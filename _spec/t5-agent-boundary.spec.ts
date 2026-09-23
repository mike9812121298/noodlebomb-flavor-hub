import { test, expect, APIRequestContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * T5 — Agent boundary enforcement (hardened)
 * Spec: Mission_Control_Morning_Brief_Spec_v2, sections 9 and 11.
 *
 * Boundaries enforced against the LIVE gateway (port 18789):
 *   1. Chili has ZERO awareness of mission_control — no MASTER_INDEX.md
 *      entry, no active_tasks.json entries, nothing in its heartbeat read
 *      path, workspace outside mission control.
 *   2. Buster may execute run_morning_brief.ps1 (-Force) and read briefs\
 *      and logs\, but no grant visible to Buster may reach config\
 *      (proven with patternReaches() below). Buster's grant is
 *      agent-scoped — agentId "buster", never "*", never a bare wildcard.
 *   3. Nothing inside mission_control\ references active_tasks.json,
 *      runtime_tick.ps1, or MASTER_INDEX.md (filesystem scan).
 *
 * Hard requirements:
 *   - The gateway MUST be running. An unreachable gateway or a
 *     degraded /api/permissions snapshot FAILS the suite loudly in
 *     beforeAll — it never passes green by skipping.
 *   - The "unit: patternReaches()" describe block is pure and runs
 *     without the gateway (it carries the adversarial fixtures).
 */

const GATEWAY_BASE_URL = process.env.MC_GATEWAY_URL ?? "http://127.0.0.1:18789";

const MC_ROOT =
  process.env.MC_ROOT ??
  "C:\\Users\\12534\\NOODLEBOMB_ARCHIVE\\mission_control";

const SECRETS_TARGET = `${MC_ROOT}\\config\\secrets.json`;

const CHILI = "chili";
const BUSTER = "buster";

// Anything matching these in Chili-visible config, index files, or inside
// mission_control itself is a breach.
const MISSION_CONTROL_MARKERS =
  /mission[\s_-]?control|NOODLEBOMB_ARCHIVE\\mission_control/i;
const OPENCLAW_RUNTIME_MARKERS = /active_tasks\.json|runtime_tick\.ps1|MASTER_INDEX/i;

/* ────────────────────────────────────────────────────────────────────────
 * patternReaches() — can a grant with this pattern authorize access to
 * the target path?
 *
 * Deliberately CONSERVATIVE: when in doubt it answers "reaches". The
 * boundary tests use it to prove that no Buster-visible allowlist entry
 * reaches config\secrets.json, so a false positive fails safe (a human
 * looks at the grant) while a false negative would let a leak through.
 *
 * Semantics:
 *   - Backslashes and forward slashes are equivalent; matching is
 *     case-insensitive (Windows).
 *   - Relative patterns are matched against every path-suffix of the
 *     target ("config\secrets.json" reaches the absolute target).
 *   - A pattern matching any ANCESTOR DIRECTORY of the target reaches it
 *     (a grant on a directory covers its contents): "mission_control\*"
 *     matches the ancestor "mission_control\config" → reaches.
 *   - Glob: "**" crosses separators, "*" matches within one segment,
 *     "?" one character. A bare-filename glob like "*.json" is matched
 *     against the target's basename → reaches.
 *   - "../" segments are dropped without consuming the following segment
 *     (conservative traversal handling).
 *   - A pattern containing whitespace is treated as a COMMAND STRING:
 *     it is tokenized, quotes stripped, flag tokens (-Foo) skipped, and
 *     reaches if ANY token reaches.
 * ──────────────────────────────────────────────────────────────────────── */

function normalizePath(raw: string): string {
  const stripped = raw.trim().replace(/^["']+|["']+$/g, "");
  const segments = stripped
    .toLowerCase()
    .replace(/\\/g, "/")
    .split("/")
    .filter((seg) => seg !== "" && seg !== ".");
  const out: string[] = [];
  for (const seg of segments) {
    // Conservative traversal: ".." never cancels a following segment.
    if (seg === "..") continue;
    out.push(seg);
  }
  return out.join("/");
}

function globToRegex(glob: string): RegExp {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
      } else {
        re += "[^/]*";
      }
    } else if (ch === "?") {
      re += "[^/]";
    } else {
      re += ch.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`, "i");
}

/** Every suffix of the target path, plus every segment-boundary prefix of
 *  each suffix (the ancestor directories a directory-grant would cover). */
function targetCandidates(target: string): string[] {
  const segments = normalizePath(target).split("/");
  const candidates = new Set<string>();
  for (let start = 0; start < segments.length; start++) {
    for (let end = start + 1; end <= segments.length; end++) {
      candidates.add(segments.slice(start, end).join("/"));
    }
  }
  return [...candidates];
}

function pathPatternReaches(pattern: string, target: string): boolean {
  const pat = normalizePath(pattern);
  if (!pat) return false;
  const regex = globToRegex(pat);
  for (const candidate of targetCandidates(target)) {
    if (regex.test(candidate)) return true;
    // Non-glob directory containment: grant on "config" covers
    // "config/secrets.json" even without a trailing glob.
    if (candidate === pat || candidate.startsWith(`${pat}/`)) return true;
  }
  return false;
}

export function patternReaches(pattern: string, target: string): boolean {
  if (/\s/.test(pattern.trim())) {
    return pattern
      .split(/\s+/)
      .map((token) => token.replace(/^["']+|["']+$/g, ""))
      .filter((token) => token.length > 0 && !token.startsWith("-"))
      .some((token) => pathPatternReaches(token, target));
  }
  return pathPatternReaches(pattern, target);
}

/* ────────────────────────────────────────────────────────────────────────
 * Unit fixtures — adversarial cases for patternReaches().
 * Pure; runs without the gateway. Target is config\secrets.json.
 * ──────────────────────────────────────────────────────────────────────── */

test.describe("unit: patternReaches() adversarial fixtures", () => {
  const MUST_REACH: Array<[string, string]> = [
    ["C:\\Users\\12534\\NOODLEBOMB_ARCHIVE\\**", "absolute archive-wide glob"],
    ["NOODLEBOMB_ARCHIVE\\**", "relative archive-wide glob"],
    ["mission_control\\*", "single-star on mission_control (covers config dir)"],
    ["*.json", "bare filename glob"],
    ["config\\secrets.json", "relative path"],
    [SECRETS_TARGET, "exact absolute path"],
    ["mission_control/config/**", "forward slashes"],
    ["C:/Users/12534/NOODLEBOMB_ARCHIVE/mission_control/**", "forward-slash absolute glob"],
    ["..\\mission_control\\config\\secrets.json", "leading traversal"],
    ["mission_control\\..\\config\\secrets.json", "embedded traversal must not hide the tail"],
    ["*", "bare wildcard"],
    ["**", "double wildcard"],
    ["secrets.*", "basename glob"],
    ["config", "bare directory grant"],
    [
      `cmd /c type ${SECRETS_TARGET}`,
      "command string reading the secret",
    ],
    [
      'powershell -Command Get-Content config\\secrets.json',
      "command string with relative path",
    ],
  ];

  const MUST_NOT_REACH: Array<[string, string]> = [
    ["briefs\\**", "briefs subtree"],
    [`${MC_ROOT}\\briefs\\**`, "absolute briefs subtree"],
    ["mission_control\\briefs\\*", "briefs single-star"],
    ["logs\\*.log", "log files"],
    ["*.ps1", "script filename glob"],
    ["run_morning_brief.ps1", "the orchestrator script itself"],
    ["secrets.template.json", "the committed template is a different file"],
    ["D:\\other\\config\\secrets.json", "same-named file on another root"],
    [
      `${MC_ROOT}\\scripts\\run_morning_brief.ps1 -Force`,
      "the legitimate Buster grant",
    ],
    [
      `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ${MC_ROOT}\\scripts\\run_morning_brief.ps1 -Force`,
      "full command-line form of the legitimate grant",
    ],
  ];

  for (const [pattern, label] of MUST_REACH) {
    test(`detects reach: ${label}`, () => {
      expect(
        patternReaches(pattern, SECRETS_TARGET),
        `"${pattern}" must be detected as reaching config\\secrets.json`
      ).toBe(true);
    });
  }

  for (const [pattern, label] of MUST_NOT_REACH) {
    test(`rejects reach: ${label}`, () => {
      expect(
        patternReaches(pattern, SECRETS_TARGET),
        `"${pattern}" must NOT be flagged as reaching config\\secrets.json`
      ).toBe(false);
    });
  }
});

/* ────────────────────────────────────────────────────────────────────────
 * Gateway API types — aligned to the dashboard's /api/permissions route
 * ({allowlist: [{agentId, pattern}], execPolicies: [{scope, agentId?,
 * security}], degraded?, warning?}). verifyPermissionsShape() fails
 * loudly at runtime if the live shape ever drifts from these types.
 * ──────────────────────────────────────────────────────────────────────── */

type AllowlistEntry = {
  agentId: string;
  pattern: string;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};

type ExecPolicyScope = {
  scope: "defaults" | "agent";
  agentId?: string;
  security?: string; // "deny" | "allowlist" | "full"
  ask?: string;
  askFallback?: string;
};

type PermissionsSnapshot = {
  degraded?: boolean;
  warning?: string;
  allowlist: AllowlistEntry[];
  execPolicies: ExecPolicyScope[];
};

type HeartbeatPayload = {
  ok?: boolean;
  degraded?: boolean;
  effectiveDefaultsHeartbeat: Record<string, unknown> | null;
  agents: Array<{ id: string; name?: string; heartbeat: Record<string, unknown> | null }>;
};

type AgentsPayload = {
  agents: Array<{ id: string; name?: string; workspace?: string; agentDir?: string }>;
};

function verifyPermissionsShape(snapshot: unknown): asserts snapshot is PermissionsSnapshot {
  const s = snapshot as PermissionsSnapshot;
  if (!s || !Array.isArray(s.allowlist) || !Array.isArray(s.execPolicies)) {
    throw new Error(
      "/api/permissions shape drift: expected {allowlist: [], execPolicies: []} — " +
        "align the suite's types to the new shape; do NOT weaken the assertions. " +
        `Got: ${JSON.stringify(snapshot).slice(0, 300)}`
    );
  }
  for (const entry of s.allowlist) {
    if (typeof entry.agentId !== "string" || typeof entry.pattern !== "string") {
      throw new Error(
        `/api/permissions shape drift: allowlist entry missing string agentId/pattern: ${JSON.stringify(entry)}`
      );
    }
  }
  for (const policy of s.execPolicies) {
    if (policy.scope !== "defaults" && policy.scope !== "agent") {
      throw new Error(
        `/api/permissions shape drift: execPolicies scope must be "defaults"|"agent": ${JSON.stringify(policy)}`
      );
    }
  }
}

async function getPermissions(request: APIRequestContext): Promise<PermissionsSnapshot> {
  const res = await request.get("/api/permissions");
  if (!res.ok()) {
    throw new Error(`GET /api/permissions returned ${res.status()} — gateway unhealthy, suite must fail.`);
  }
  const snapshot = (await res.json()) as unknown;
  verifyPermissionsShape(snapshot);
  if (snapshot.degraded) {
    throw new Error(
      `permissions snapshot is DEGRADED (${snapshot.warning ?? "no warning"}) — ` +
        "the boundary cannot be verified against a degraded snapshot; this is a hard failure, never a skip."
    );
  }
  return snapshot;
}

function busterVisibleEntries(snapshot: PermissionsSnapshot): AllowlistEntry[] {
  // Buster is governed by its agent-scoped entries AND any defaults ("*").
  return snapshot.allowlist.filter(
    (e) => e.agentId.toLowerCase() === BUSTER || e.agentId === "*"
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Integration — live gateway required.
 * ──────────────────────────────────────────────────────────────────────── */

test.describe("T5 — agent boundary enforcement (live gateway)", () => {
  test.use({ baseURL: GATEWAY_BASE_URL });

  // Gateway preflight: unreachable or degraded ⇒ every test in this
  // describe fails. There is no skip path by design.
  test.beforeAll(async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: GATEWAY_BASE_URL });
    try {
      let res;
      try {
        res = await ctx.get("/api/permissions", { timeout: 10_000 });
      } catch (err) {
        throw new Error(
          `Gateway is NOT RUNNING at ${GATEWAY_BASE_URL} — start it before running T5. (${String(err)})`
        );
      }
      if (!res.ok()) {
        throw new Error(`Gateway responded ${res.status()} at ${GATEWAY_BASE_URL} — suite fails.`);
      }
      const snapshot = (await res.json()) as unknown;
      verifyPermissionsShape(snapshot);
      if ((snapshot as PermissionsSnapshot).degraded) {
        throw new Error(
          `Gateway permissions snapshot is DEGRADED at preflight (${(snapshot as PermissionsSnapshot).warning ?? "no warning"}) — fix the gateway, then re-run.`
        );
      }
    } finally {
      await ctx.dispose();
    }
  });

  test("T5.0 /api/permissions returns the expected shape (typed, not assumed)", async ({ request }) => {
    const snapshot = await getPermissions(request);
    // Shape was verified by getPermissions; pin the parts the suite leans on.
    expect(Array.isArray(snapshot.allowlist)).toBe(true);
    expect(Array.isArray(snapshot.execPolicies)).toBe(true);
    expect(snapshot.execPolicies.some((p) => p.scope === "defaults")).toBe(true);
  });

  /* ── Chili: zero awareness ──────────────────────────────────────────── */

  test("T5.1 Chili has no entry in MASTER_INDEX.md", async ({ request }) => {
    const res = await request.get(`/api/workspace/file?path=${encodeURIComponent("MASTER_INDEX.md")}`);
    if (res.status() === 404) return; // file absent ⇒ no entry, boundary holds
    expect(res.ok(), "MASTER_INDEX.md must be readable when present").toBeTruthy();
    const content = await res.text();
    expect(content, "MASTER_INDEX.md must not reference Chili").not.toMatch(
      new RegExp(`\\b${CHILI}\\b`, "i")
    );
  });

  test("T5.2 Chili has no entries in active_tasks.json", async ({ request }) => {
    const res = await request.get(`/api/workspace/file?path=${encodeURIComponent("active_tasks.json")}`);
    if (res.status() === 404) return; // absent ⇒ no entries, boundary holds
    expect(res.ok()).toBeTruthy();
    const content = await res.text();
    expect(() => JSON.parse(content), "active_tasks.json must be valid JSON").not.toThrow();
    expect(content, "active_tasks.json must contain no task referencing Chili").not.toMatch(
      new RegExp(`\\b${CHILI}\\b`, "i")
    );
  });

  test("T5.3 Chili's heartbeat read path contains nothing from mission control", async ({ request }) => {
    const res = await request.get("/api/heartbeat");
    expect(res.ok(), "/api/heartbeat must respond").toBeTruthy();
    const hb = (await res.json()) as HeartbeatPayload;
    expect(hb.degraded, "heartbeat API degraded — cannot verify boundary; hard failure").toBeFalsy();

    const chiliRow = hb.agents.find((a) => a.id.toLowerCase() === CHILI);
    // Effective heartbeat = per-agent override, else resolved defaults.
    const effective = chiliRow?.heartbeat ?? hb.effectiveDefaultsHeartbeat;
    if (effective) {
      expect(
        JSON.stringify(effective),
        "Chili's effective heartbeat must not reference mission control"
      ).not.toMatch(MISSION_CONTROL_MARKERS);
      expect(JSON.stringify(effective)).not.toMatch(OPENCLAW_RUNTIME_MARKERS);
    }
    // If defaults read mission control, Chili needs an explicit override.
    if (
      hb.effectiveDefaultsHeartbeat &&
      MISSION_CONTROL_MARKERS.test(JSON.stringify(hb.effectiveDefaultsHeartbeat))
    ) {
      expect(
        chiliRow?.heartbeat,
        "defaults heartbeat reads mission control — Chili must carry its own override"
      ).toBeTruthy();
    }
  });

  test("T5.4 Chili's workspace and agentDir are outside mission control", async ({ request }) => {
    const res = await request.get("/api/agents");
    expect(res.ok()).toBeTruthy();
    const payload = (await res.json()) as AgentsPayload;
    const chili = payload.agents.find((a) => a.id.toLowerCase() === CHILI);
    if (!chili) return; // not registered ⇒ zero awareness holds trivially
    for (const dir of [chili.workspace, chili.agentDir]) {
      if (!dir) continue;
      expect(dir, "Chili's directories must not live inside mission control").not.toMatch(
        MISSION_CONTROL_MARKERS
      );
    }
  });

  /* ── Buster: scoped operational access ──────────────────────────────── */

  test("T5.5 Buster holds an AGENT-SCOPED grant for run_morning_brief.ps1 — never wildcard", async ({
    request,
  }) => {
    const snapshot = await getPermissions(request);

    const agentScoped = snapshot.allowlist.filter(
      (e) => e.agentId.toLowerCase() === BUSTER && /run_morning_brief\.ps1/i.test(e.pattern)
    );
    expect(
      agentScoped.length,
      'Buster must hold an allowlist grant (agentId "buster") for run_morning_brief.ps1 (-Force runs)'
    ).toBeGreaterThan(0);

    const wildcardScoped = snapshot.allowlist.filter(
      (e) => e.agentId === "*" && /run_morning_brief\.ps1/i.test(e.pattern)
    );
    expect(
      wildcardScoped,
      "the run_morning_brief grant must be agent-scoped to buster, never on the defaults/wildcard scope"
    ).toHaveLength(0);
  });

  test("T5.6 Buster's effective exec security is 'allowlist', not 'full'", async ({ request }) => {
    const snapshot = await getPermissions(request);
    const busterScope = snapshot.execPolicies.find(
      (p) => p.scope === "agent" && p.agentId?.toLowerCase() === BUSTER
    );
    const defaultsScope = snapshot.execPolicies.find((p) => p.scope === "defaults");
    const effectiveSecurity = busterScope?.security ?? defaultsScope?.security;
    // "full" would let Buster write anywhere, including config\ — the write
    // boundary is only enforceable when every command must match the allowlist.
    expect(
      effectiveSecurity,
      "Buster's effective exec security must be 'allowlist' so config\\ writes cannot slip through"
    ).toBe("allowlist");
  });

  test("T5.7 no Buster-visible grant reaches config\\secrets.json (patternReaches)", async ({
    request,
  }) => {
    const snapshot = await getPermissions(request);
    for (const entry of busterVisibleEntries(snapshot)) {
      expect(
        patternReaches(entry.pattern, SECRETS_TARGET),
        `allowlist entry "${entry.pattern}" (scope ${entry.agentId}) reaches config\\secrets.json — boundary breach`
      ).toBe(false);
      const trimmed = entry.pattern.trim();
      expect(
        trimmed === "*" || trimmed === "**",
        `bare wildcard grant "${entry.pattern}" (scope ${entry.agentId}) would bypass the config\\ boundary`
      ).toBe(false);
    }
  });

  test("T5.8 Buster's briefs\\ and logs\\ access stays read-only", async ({ request }) => {
    const snapshot = await getPermissions(request);
    // Flag write/delete verbs that name briefs\ or logs\ so a read grant
    // cannot quietly become a write grant.
    const WRITE_VERBS =
      /\b(set-content|add-content|out-file|remove-item|move-item|new-item|del|rd|rmdir)\b|>{1,2}/i;
    for (const entry of busterVisibleEntries(snapshot)) {
      if (/\b(briefs|logs)\b/i.test(entry.pattern)) {
        expect(
          WRITE_VERBS.test(entry.pattern),
          `briefs\\/logs\\ grant "${entry.pattern}" must stay read-only`
        ).toBe(false);
      }
    }
  });

  /* ── Inverse boundary: mission_control references nothing of OpenClaw ── */

  test("T5.9 nothing in mission_control references active_tasks.json / runtime_tick.ps1 / MASTER_INDEX", () => {
    expect(
      fs.existsSync(MC_ROOT),
      `mission_control root not found at ${MC_ROOT} (set MC_ROOT to override) — cannot verify rule 4.1; hard failure`
    ).toBe(true);

    const offenders: string[] = [];
    const scanDirs = ["scripts", "engine", "config"].map((d) => path.join(MC_ROOT, d));
    const textExt = new Set([".ps1", ".py", ".json", ".txt", ".psm1", ".md", ".html"]);

    const walk = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full);
        } else if (textExt.has(path.extname(name).toLowerCase())) {
          const content = fs.readFileSync(full, "utf-8");
          if (OPENCLAW_RUNTIME_MARKERS.test(content)) {
            offenders.push(path.relative(MC_ROOT, full));
          }
        }
      }
    };
    for (const dir of scanDirs) walk(dir);

    expect(
      offenders,
      `mission_control files reference OpenClaw runtime artifacts: ${offenders.join(", ")}`
    ).toHaveLength(0);
  });
});
