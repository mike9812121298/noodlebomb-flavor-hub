import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "data", "mike-today-config.json");
const SAMPLE_PATH = path.join(ROOT, "data", "mike-today", "sample_signals.json");

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function readJson(relativeOrAbsolute) {
  const filePath = path.isAbsolute(relativeOrAbsolute)
    ? relativeOrAbsolute
    : path.join(ROOT, relativeOrAbsolute);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clamp(value, lower = 0, upper = 100) {
  return Math.max(lower, Math.min(upper, value));
}

function money(value) {
  return moneyFormatter.format(value || 0);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeAction(action, config) {
  const type = action.type || "opportunity";
  const effort = Number(action.effort_minutes || 60);
  const confidence = clamp(Number(action.confidence || 60));
  const impact = Number(action.impact || 0);
  const typeWeight = config.weights?.[type] || 1;
  const roiWeight = config.weights?.roi || 1;
  const effortPenalty = Math.sqrt(Math.max(effort, 10)) * 1.8;
  const impactScore = Math.sqrt(Math.max(impact, 0)) * 1.25 * roiWeight;
  const priorityBonus = Number(action.priority_bonus || 0);
  const score = clamp(impactScore + confidence * 0.64 + typeWeight * 16 + priorityBonus - effortPenalty, 0, 100);

  return {
    id: action.id || `${type}:${action.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    source: action.source || "manual",
    title: action.title,
    type,
    category: action.category || "Ops",
    score: Math.round(score),
    impact,
    impact_label: action.impact_label || (impact ? money(impact) : "Impact not quantified"),
    confidence,
    effort_minutes: effort,
    blockers: action.blockers || [],
    next_action: action.next_action || "Review this signal and choose the smallest useful next step.",
    evidence: action.evidence || [],
  };
}

function fromRevenueWatchdog(report) {
  if (!report?.anomalies?.length) return [];
  const seen = new Set();
  const priorityScopes = new Set(["product", "campaign", "business"]);
  return report.anomalies
    .filter((item) => priorityScopes.has(item.scope_id))
    .filter((item) => {
      const key = item.scope_id === "business" ? "business" : item.segment;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6)
    .map((item) => ({
      source: "revenue-watchdog",
      title:
        item.scope_id === "business"
          ? "Check the business-wide revenue drop"
          : `Fix ${item.segment} revenue leak`,
      type: item.severity === "P0" ? "fire" : item.severity === "P1" ? "fire" : "bottleneck",
      category: "Revenue",
      impact: Math.round(item.estimated_lost_revenue || 0),
      impact_label: `${money(item.estimated_lost_revenue || 0)}/day recovered`,
      confidence: item.severity === "P0" ? 88 : item.severity === "P1" ? 78 : 64,
      priority_bonus: item.severity === "P0" ? 20 : item.severity === "P1" ? 10 : 4,
      effort_minutes: item.scope_id === "campaign" ? 35 : item.scope_id === "business" ? 50 : 45,
      blockers: unique([
        item.target?.markers?.length ? `Recent change: ${item.target.markers.join(", ")}` : "",
        "Need PDP/cart/ad delivery smoke check",
      ]),
      next_action:
        item.scope_id === "campaign"
          ? "Open the campaign and check delivery, approvals, budget, and landing-page conversion."
          : "Open the affected PDP on mobile, verify image, price, shipping promise, Add to Cart, and checkout.",
      evidence: [item.alert, ...(item.probable_causes || []).slice(0, 2)],
    }));
}

function fromDeadProducts(report) {
  if (!report?.results?.length) return [];
  const important = report.results.filter((item) =>
    ["revive", "liquidate", "archive", "bundle"].includes(item.recommendation),
  );
  return important.slice(0, 8).map((item) => {
    const healthyRevive = item.recommendation === "revive" && item.healthScore >= 80 && item.zombieScore <= 15;
    const actionType =
      healthyRevive
        ? "opportunity"
        : item.recommendation === "revive"
        ? "bottleneck"
        : item.recommendation === "bundle"
          ? "roi"
          : item.recommendation === "liquidate"
            ? "roi"
            : "fire";
    const impact = Math.max(item.inventory_value || 0, item.ad_spend_30d || 0, item.revenue_30d || 0);
    return {
      source: "dead-product-detector",
      title: healthyRevive
        ? `Scale ${item.product}`
        : `${item.recommendation[0].toUpperCase()}${item.recommendation.slice(1)} ${item.product}`,
      type: actionType,
      category: "Catalog",
      impact: Math.round(impact),
      impact_label:
        healthyRevive
          ? `${money(impact)} 30-day revenue base`
          : item.recommendation === "revive"
          ? `${money(impact)} at stake`
          : `${money(impact)} trapped or recoverable`,
      confidence: healthyRevive
        ? 82
        : item.recommendation === "archive"
          ? 86
          : item.recommendation === "liquidate"
            ? 78
            : 72,
      priority_bonus: item.recommendation === "archive" ? 5 : item.recommendation === "liquidate" ? 3 : 0,
      effort_minutes: healthyRevive ? 45 : item.recommendation === "archive" ? 20 : item.recommendation === "bundle" ? 45 : 75,
      blockers: item.recommendation === "revive" && !healthyRevive ? ["Need PDP/offer fix before more spend"] : [],
      next_action: healthyRevive
        ? "Keep live and test subscription placement, bundle placement, or one focused AOV lift."
        : item.actions?.[0] || "Apply the recommended catalog action.",
      evidence: [`Zombie score ${item.zombieScore}`, ...(item.reasons || []).slice(0, 2)],
    };
  });
}

function fromShelfImpact(report) {
  if (!report?.results?.length) return [];
  return report.results
    .filter((item) => item.risk_tier !== "STRONG" || item.color_uniqueness_score < 50)
    .sort((left, right) => left.total_score - right.total_score)
    .slice(0, 4)
    .map((item) => ({
      source: "shelf-impact-analyzer",
      title: `Improve ${item.name} shelf cue before retail push`,
      type: "bottleneck",
      category: "Packaging",
      impact: Math.max(150, (70 - item.total_score) * 25),
      impact_label: "Retail conversion protection",
      confidence: item.risk_tier === "FIX BEFORE PRINT" ? 76 : 66,
      effort_minutes: 120,
      blockers: ["Needs label/design pass"],
      next_action: item.recommendations?.[0] || "Increase contrast and shelf-readable flavor cue.",
      evidence: [
        `Shelf score ${item.total_score}/100`,
        `Color uniqueness ${item.color_uniqueness_score}/100`,
      ],
    }));
}

function fromRetailSellThrough(report) {
  if (!report?.predictions?.length) return [];
  return report.predictions
    .slice()
    .sort((left, right) => (right.weeklyUnits || 0) * (right.confidence || 0) - (left.weeklyUnits || 0) * (left.confidence || 0))
    .slice(0, 5)
    .map((item) => ({
      source: "retail-sell-through-predictor",
      title: `Pitch ${item.storeName}`,
      type: "opportunity",
      category: "Wholesale",
      impact: Math.round((item.weeklyUnits || 0) * 12),
      impact_label: `${Math.round(item.weeklyUnits || 0)} weekly units predicted`,
      confidence: item.confidence || 60,
      effort_minutes: 90,
      blockers: ["Need buyer contact and wholesale one-sheet"],
      next_action: item.salesNote || "Send the recommended first-case assortment pitch.",
      evidence: [
        `Store fit ${item.storeFitScore}/100`,
        `Likely reorder window ${item.likelyReorderWindow}`,
      ],
    }));
}

function fromManualSignals(report) {
  if (!report?.signals?.length) return [];
  return report.signals;
}

function collectActions(config, args) {
  if (args.sample) {
    return fromManualSignals(readJson(SAMPLE_PATH));
  }

  const inputs = config.inputs || {};
  return [
    ...fromRevenueWatchdog(readJson(inputs.revenueWatchdog)),
    ...fromDeadProducts(readJson(inputs.deadProductDetector)),
    ...fromShelfImpact(readJson(inputs.shelfImpact)),
    ...fromRetailSellThrough(readJson(inputs.retailSellThrough)),
    ...fromManualSignals(readJson(inputs.manualSignals)),
  ];
}

function dedupeActions(actions) {
  const seen = new Set();
  return actions.filter((action) => {
    const key = `${action.category}:${action.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildSummary(actions) {
  const buckets = { fire: 0, opportunity: 0, bottleneck: 0, roi: 0 };
  for (const action of actions) {
    buckets[action.type] = (buckets[action.type] || 0) + 1;
  }
  return buckets;
}

function csvValue(value) {
  const clean = String(value ?? "");
  if (/[",\n\r]/.test(clean)) return `"${clean.replace(/"/g, '""')}"`;
  return clean;
}

function writeCsv(outputDir, actions) {
  const headers = [
    "rank",
    "score",
    "type",
    "category",
    "title",
    "impact",
    "impact_label",
    "confidence",
    "effort_minutes",
    "next_action",
    "blockers",
    "source",
  ];
  const lines = [headers.join(",")];
  actions.forEach((action, index) => {
    lines.push(
      [
        index + 1,
        action.score,
        action.type,
        action.category,
        action.title,
        action.impact,
        action.impact_label,
        action.confidence,
        action.effort_minutes,
        action.next_action,
        action.blockers.join("; "),
        action.source,
      ]
        .map(csvValue)
        .join(","),
    );
  });
  fs.writeFileSync(path.join(outputDir, "mike-today-actions.csv"), `${lines.join("\n")}\n`);
}

function writeJson(outputDir, actions, meta) {
  fs.writeFileSync(
    path.join(outputDir, "mike-today.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), ...meta, actions }, null, 2),
  );
}

function actionLine(action, index) {
  const blockers = action.blockers.length ? action.blockers.join("; ") : "None";
  return [
    `${index + 1}. ${action.title}`,
    `   Impact: ${action.impact_label} | Confidence: ${action.confidence}% | Score: ${action.score}/100`,
    `   Do this: ${action.next_action}`,
    `   Blockers: ${blockers}`,
  ].join("\n");
}

function alertText(actions, meta) {
  if (!actions.length) {
    return "Mike Today: no ranked actions yet. Run the revenue/catalog/shelf tools or add manual signals.";
  }
  return [
    `Mike Today ${meta.date}: top ${Math.min(5, actions.length)} actions.`,
    ...actions.slice(0, 5).map(actionLine),
  ].join("\n");
}

function writeMarkdown(outputDir, actions, meta) {
  const summary = buildSummary(actions);
  const lines = [
    "# What Should Mike Work On Today?",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Mode: **${meta.sampleMode ? "sample" : "live local signals"}**`,
    "",
    "## Executive Read",
    "",
    `- Fires: **${summary.fire || 0}**`,
    `- Opportunities: **${summary.opportunity || 0}**`,
    `- Bottlenecks: **${summary.bottleneck || 0}**`,
    `- Fast ROI actions: **${summary.roi || 0}**`,
    "",
    "## Top 5",
    "",
  ];

  if (!actions.length) {
    lines.push("No actions found. Run the supporting tools or add `data/mike-today/manual_signals.json`.");
  } else {
    for (const [index, action] of actions.slice(0, 5).entries()) {
      lines.push(`### ${index + 1}. ${action.title}`);
      lines.push("");
      lines.push(`- Type: ${action.type}`);
      lines.push(`- Category: ${action.category}`);
      lines.push(`- Estimated impact: ${action.impact_label}`);
      lines.push(`- Confidence: ${action.confidence}%`);
      lines.push(`- Score: ${action.score}/100`);
      lines.push(`- Next action: ${action.next_action}`);
      lines.push(`- Blockers: ${action.blockers.length ? action.blockers.join("; ") : "None"}`);
      lines.push(`- Evidence: ${action.evidence?.length ? action.evidence.join("; ") : action.source}`);
      lines.push("");
    }
  }

  lines.push("## Owner Alert", "", "```text", alertText(actions, meta), "```");
  fs.writeFileSync(path.join(outputDir, "mike-today-report.md"), `${lines.join("\n")}\n`);
  fs.writeFileSync(path.join(outputDir, "mike-today-alert.txt"), `${alertText(actions, meta)}\n`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeHtml(outputDir, actions, meta) {
  const cards = actions
    .slice(0, 5)
    .map(
      (action, index) => `<article class="card ${action.type}">
        <span class="rank">${index + 1}</span>
        <p>${escapeHtml(action.type)} / ${escapeHtml(action.category)}</p>
        <h2>${escapeHtml(action.title)}</h2>
        <strong>${escapeHtml(action.impact_label)}</strong>
        <dl>
          <div><dt>Score</dt><dd>${action.score}/100</dd></div>
          <div><dt>Confidence</dt><dd>${action.confidence}%</dd></div>
          <div><dt>Effort</dt><dd>${action.effort_minutes} min</dd></div>
        </dl>
        <h3>Do this</h3>
        <p>${escapeHtml(action.next_action)}</p>
        <h3>Blockers</h3>
        <p>${escapeHtml(action.blockers.length ? action.blockers.join("; ") : "None")}</p>
      </article>`,
    )
    .join("");
  const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>What Should Mike Work On Today?</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #100d0b; color: #f8ead1; }
    main { width: min(1160px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 64px; }
    h1 { margin: 0; font-size: clamp(2.2rem, 5vw, 4.8rem); line-height: .92; letter-spacing: 0; }
    p { color: #cdbd9d; line-height: 1.55; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 28px; }
    .card { position: relative; border: 1px solid #3d2e24; background: #1b1410; border-radius: 14px; padding: 18px; overflow: hidden; }
    .card::before { content: ""; position: absolute; inset: 0 0 auto; height: 5px; background: #facc15; }
    .fire::before { background: #ef4444; }
    .opportunity::before { background: #22c55e; }
    .bottleneck::before { background: #f97316; }
    .roi::before { background: #38bdf8; }
    .rank { display: inline-flex; width: 30px; height: 30px; align-items: center; justify-content: center; border-radius: 999px; background: #ffb454; color: #150a05; font-weight: 900; }
    h2 { margin: 12px 0 10px; font-size: 1.35rem; line-height: 1.12; }
    h3 { margin: 16px 0 5px; font-size: .78rem; color: #ffcf8a; text-transform: uppercase; letter-spacing: .08em; }
    strong { color: #ffb454; font-size: 1.1rem; }
    dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 16px 0 0; }
    dl div { background: #2a211a; border: 1px solid #45352a; border-radius: 10px; padding: 9px; }
    dt { color: #a9987c; font-size: .7rem; text-transform: uppercase; }
    dd { margin: 4px 0 0; color: #f8ead1; font-weight: 800; }
  </style>
</head>
<body>
  <main>
    <p>CEO copilot / ${escapeHtml(meta.sampleMode ? "sample mode" : "live local signals")}</p>
    <h1>What Should Mike Work On Today?</h1>
    <p>Ranked by fire severity, opportunity size, bottleneck removal, ROI, confidence, and effort.</p>
    <section class="grid">${cards || "<p>No actions found. Run the supporting tools or add manual signals.</p>"}</section>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outputDir, "mike-today-dashboard.html"), htmlDoc);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = readJson(CONFIG_PATH);
  if (!config) throw new Error(`Missing config: ${CONFIG_PATH}`);

  const outputDir = path.join(ROOT, config.outputs?.directory || "tmp/mike-today");
  fs.mkdirSync(outputDir, { recursive: true });

  const rawActions = collectActions(config, args);
  const actions = dedupeActions(rawActions)
    .map((action) => normalizeAction(action, config))
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(config.outputLimit || 5, 5));

  const meta = {
    date: new Date().toISOString().slice(0, 10),
    sampleMode: Boolean(args.sample),
    actionCount: actions.length,
  };

  writeJson(outputDir, actions, meta);
  writeCsv(outputDir, actions);
  writeMarkdown(outputDir, actions, meta);
  writeHtml(outputDir, actions, meta);

  console.log(`[OK] Mike Today ranked ${actions.length} actions`);
  console.log(`[OK] Report: ${path.join(outputDir, "mike-today-report.md")}`);
  console.log(`[OK] Alert: ${path.join(outputDir, "mike-today-alert.txt")}`);
}

try {
  main();
} catch (error) {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
}
