#!/usr/bin/env node
/**
 * NoodleBomb pre-deploy syntax gate.
 *
 * WHY THIS EXISTS: On 2026-06-09/10, truncated copies of cart-store.js AND
 * shopify-config.js (cut off mid-IIFE, missing the closing `})();`) reached
 * production. window.NB_CART / window.NB_SHOPIFY never initialized, so
 * site-wide Add-to-Cart silently failed for ~7.5h. HEAD was fine; the
 * working-tree source was the partial file. HTTP/SW caching then pinned the
 * broken bytes. See memory: nb-sw-appshell-cache / nb-prod-deploy.
 *
 * This gate runs against the directory that is ABOUT TO BE DEPLOYED (the
 * staging dir produced by the deploy wrapper, or the repo root) and refuses to
 * pass if any shipped JS is unparseable or if a critical cart shell file is
 * truncated. The deploy wrapper aborts on a non-zero exit.
 *
 * Usage:
 *   node scripts/predeploy-check.mjs [targetDir]
 *     targetDir  directory to validate (default: current working directory)
 *
 * Exit code 0 = OK (safe to deploy), non-zero = FAIL (abort the deploy).
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const targetDir = process.argv[2] ? process.argv[2] : process.cwd();

if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
  console.error(`[predeploy-check] target directory not found: ${targetDir}`);
  process.exit(2);
}

/* ---------------------------------------------------------------------------
 * Which JS actually ships.
 *
 * Root *.js are deployed (publish = "."), EXCEPT the few config files that
 * netlify.toml 404-blocks at the edge — they ship but are never executed by a
 * browser, so a parse failure there can't break the storefront. Everything
 * else at the root (cart-store.js, shopify-config.js, sw.js, page-shared.js,
 * rewards-config.js, etc.) is live runtime code. build/*.js are the esbuild
 * bundles. netlify/functions/*.js run server-side on every request.
 * ------------------------------------------------------------------------- */
const ROOT_JS_SKIP = new Set([
  'eslint.config.js',   // 404-blocked, lint config
  'postcss.config.js',  // 404-blocked, build config
]);

function listRootJs(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.js') && !ROOT_JS_SKIP.has(f))
    .filter((f) => statSync(join(dir, f)).isFile())
    .map((f) => join(dir, f));
}

function listDirJs(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...listDirJs(p));
    else if (entry.endsWith('.js') || entry.endsWith('.mjs')) out.push(p);
  }
  return out;
}

const jsFiles = [
  ...listRootJs(targetDir),
  ...listDirJs(join(targetDir, 'build')),
  ...listDirJs(join(targetDir, 'netlify', 'functions')),
];

// De-dupe and stabilize order for readable output.
const uniqueFiles = [...new Set(jsFiles)].sort();

const rel = (p) => relative(targetDir, p).split(sep).join('/');

const failures = [];   // { file, reason }
const passes = [];     // file
const notes = [];      // informational lines

/* ---------------------------------------------------------------------------
 * (a) node --check every shipped JS file — must parse.
 * ------------------------------------------------------------------------- */
for (const file of uniqueFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    passes.push(file);
  } catch (err) {
    const msg = (err.stderr ? err.stderr.toString() : err.message || '').trim();
    failures.push({ file, reason: `syntax error / unparseable\n      ${msg.split('\n').slice(0, 3).join('\n      ')}` });
  }
}

/* ---------------------------------------------------------------------------
 * (b) Critical cart-shell files must be COMPLETE, not merely parseable.
 *
 * The truncation that caused the outage left a file that could still appear
 * "fine" at a glance. We assert the closing IIFE tail `})();` AND that the
 * global the file is supposed to expose is present. A file chopped before its
 * window.NB_* assignment will trip these even if the surviving prefix parses.
 * ------------------------------------------------------------------------- */
const TAIL = '})();';

function checkCriticalShell(name, globalToken) {
  const path = join(targetDir, name);
  if (!existsSync(path)) {
    failures.push({ file: path, reason: `MISSING — ${name} is required in the deploy and was not found` });
    return;
  }
  const raw = readFileSync(path, 'utf8');
  // Normalize trailing whitespace / CRLF / trailing newlines before tail check.
  const trimmed = raw.replace(/\s+$/, '');
  const tailOk = trimmed.endsWith(TAIL);
  const globalOk = raw.includes(globalToken);

  if (!tailOk) {
    const lastBytes = JSON.stringify(raw.slice(-48));
    failures.push({
      file: path,
      reason: `TRUNCATED — does not end with the closing IIFE \`${TAIL}\` (this is the exact outage signature). Last bytes: ${lastBytes}`,
    });
  }
  if (!globalOk) {
    failures.push({
      file: path,
      reason: `INCOMPLETE — \`${globalToken}\` initialization not found; the global this file exposes is missing`,
    });
  }
  if (tailOk && globalOk) {
    notes.push(`${name}: complete (ends with \`${TAIL}\`, ${globalToken} present)`);
  }
}

checkCriticalShell('cart-store.js', 'window.NB_CART');
checkCriticalShell('shopify-config.js', 'window.NB_SHOPIFY');

/* ---------------------------------------------------------------------------
 * (c) sw.js must define an NB_CACHE cache-name. If the SW exists but defines
 *     no NB_CACHE, the cache-bump discipline (bump on every app-shell change)
 *     has been broken — returning visitors would keep serving stale/broken
 *     assets. We require the constant to be present and non-empty.
 * ------------------------------------------------------------------------- */
const swPath = join(targetDir, 'sw.js');
if (!existsSync(swPath)) {
  failures.push({ file: swPath, reason: `MISSING — sw.js is required in the deploy and was not found` });
} else {
  const sw = readFileSync(swPath, 'utf8');
  const m = sw.match(/NB_CACHE\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    failures.push({ file: swPath, reason: `sw.js does not define a non-empty NB_CACHE cache-name (cache-bump step would be skipped)` });
  } else {
    notes.push(`sw.js: NB_CACHE = '${m[1]}'`);
  }
}

/* ---------------------------------------------------------------------------
 * Summary.
 * ------------------------------------------------------------------------- */
console.log('');
console.log('  NoodleBomb pre-deploy syntax gate');
console.log(`  target: ${targetDir}`);
console.log(`  ${uniqueFiles.length} JS file(s) parse-checked, ${passes.length} ok`);
console.log('');
for (const n of notes) console.log(`  • ${n}`);
if (notes.length) console.log('');

if (failures.length === 0) {
  console.log('  ✅ OK — all shipped JS parses and critical cart-shell files are complete.');
  console.log('');
  process.exit(0);
}

console.log(`  ❌ FAIL — ${failures.length} problem(s) found. Deploy must NOT proceed:`);
console.log('');
for (const f of failures) {
  console.log(`  ✗ ${rel(f.file)}`);
  console.log(`      ${f.reason}`);
}
console.log('');
process.exit(1);
