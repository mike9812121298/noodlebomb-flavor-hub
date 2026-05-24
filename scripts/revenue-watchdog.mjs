import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "data", "revenue-watchdog-config.json");
const DEFAULT_INPUT = path.join(ROOT, "data", "revenue-watchdog", "daily_metrics.csv");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  if (rows.length === 0) return [];
  const headers = rows[0].map((cell) => cell.trim());
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const clean = String(value).replace(/[$,%]/g, "").trim();
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRow(row) {
  const normalized = { ...row };
  for (const field of [
    "sessions",
    "orders",
    "revenue",
    "units",
    "ad_spend",
    "refunds",
    "inventory_on_hand",
  ]) {
    normalized[field] = toNumber(row[field]);
  }
  normalized.conversion_rate = normalized.sessions > 0 ? normalized.orders / normalized.sessions : 0;
  normalized.aov = normalized.orders > 0 ? normalized.revenue / normalized.orders : 0;
  normalized.date = String(row.date || "").trim();
  return normalized;
}

function isoDateOffset(dateString, offsetDays) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function yesterdayIso() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function segmentKey(row, dimensions) {
  if (!dimensions.length) return "All revenue";
  return dimensions.map((dimension) => row[dimension] || "(blank)").join(" | ");
}

function emptyMetric() {
  return {
    sessions: 0,
    orders: 0,
    revenue: 0,
    units: 0,
    ad_spend: 0,
    refunds: 0,
    inventory_on_hand: 0,
    markers: new Set(),
    notes: new Set(),
  };
}

function addRow(metric, row) {
  metric.sessions += row.sessions;
  metric.orders += row.orders;
  metric.revenue += row.revenue;
  metric.units += row.units;
  metric.ad_spend += row.ad_spend;
  metric.refunds += row.refunds;
  metric.inventory_on_hand += row.inventory_on_hand;
  if (row.change_marker) metric.markers.add(row.change_marker);
  if (row.notes) metric.notes.add(row.notes);
}

function finalizeMetric(metric) {
  return {
    ...metric,
    conversion_rate: metric.sessions > 0 ? metric.orders / metric.sessions : 0,
    aov: metric.orders > 0 ? metric.revenue / metric.orders : 0,
    markers: unique([...metric.markers]),
    notes: unique([...metric.notes]),
  };
}

function divideMetric(metric, divisor) {
  const safe = Math.max(1, divisor);
  const divided = {
    sessions: metric.sessions / safe,
    orders: metric.orders / safe,
    revenue: metric.revenue / safe,
    units: metric.units / safe,
    ad_spend: metric.ad_spend / safe,
    refunds: metric.refunds / safe,
    inventory_on_hand: metric.inventory_on_hand / safe,
    markers: metric.markers,
    notes: metric.notes,
  };
  return finalizeMetric(divided);
}

function aggregateRows(rows, dimensions) {
  const map = new Map();
  for (const row of rows) {
    const key = segmentKey(row, dimensions);
    if (!map.has(key)) map.set(key, emptyMetric());
    addRow(map.get(key), row);
  }
  return map;
}

function pctChange(current, baseline) {
  if (!baseline) return current ? 100 : 0;
  return ((current - baseline) / baseline) * 100;
}

function severityFor(dropPct, lostRevenue, thresholds) {
  if (dropPct <= thresholds.p0RevenueDropPct && lostRevenue >= thresholds.minimumBaselineRevenue) return "P0";
  if (dropPct <= thresholds.p1RevenueDropPct) return "P1";
  if (dropPct <= thresholds.watchRevenueDropPct) return "WATCH";
  return "OK";
}

function causeFor({ target, baseline, revenueDropPct, conversionDropPct, sessionsDropPct, aovDropPct, adSpendDropPct }, thresholds) {
  const causes = [];
  if (target.markers.length) {
    causes.push(`recent change marker: ${target.markers.join(", ")}`);
  }
  if (target.inventory_on_hand > 0 && target.inventory_on_hand <= thresholds.lowInventoryUnits) {
    causes.push(`inventory risk: ${Math.round(target.inventory_on_hand)} units on hand`);
  }
  if (sessionsDropPct <= thresholds.sessionsDropPct) {
    causes.push("traffic drop: check ad delivery, email sends, search visibility, and tracking");
  }
  if (conversionDropPct <= thresholds.conversionDropPct && sessionsDropPct > thresholds.sessionsDropPct) {
    causes.push("conversion drop with traffic still present: inspect PDP image, price, add-to-cart, checkout, and shipping message");
  }
  if (adSpendDropPct <= thresholds.adSpendDropPct && baseline.ad_spend > 0) {
    causes.push("paid spend dropped: campaign may be paused, capped, rejected, or budget-limited");
  }
  if (aovDropPct <= thresholds.aovDropPct && baseline.orders > 0) {
    causes.push("AOV dropped: mix shifted away from bundles or subscription offers");
  }
  if (target.refunds > baseline.refunds * (1 + thresholds.refundSpikePct / 100) && target.refunds > 0) {
    causes.push("refund spike: inspect fulfillment, damage, or product quality tickets");
  }
  if (!causes.length && revenueDropPct < 0) {
    causes.push("mixed demand shift: review channel mix, landing-page changes, and stock status");
  }
  return causes;
}

function buildAnomaly(scope, key, targetRaw, baselineRaw, baselineDays, thresholds) {
  const target = finalizeMetric(targetRaw || emptyMetric());
  const baseline = divideMetric(baselineRaw || emptyMetric(), baselineDays);

  if (
    baseline.revenue < thresholds.minimumBaselineRevenue &&
    baseline.orders < thresholds.minimumBaselineOrders
  ) {
    return null;
  }

  const revenueDropPct = pctChange(target.revenue, baseline.revenue);
  const conversionDropPct = pctChange(target.conversion_rate, baseline.conversion_rate);
  const sessionsDropPct = pctChange(target.sessions, baseline.sessions);
  const aovDropPct = pctChange(target.aov, baseline.aov);
  const adSpendDropPct = pctChange(target.ad_spend, baseline.ad_spend);
  const lostRevenue = Math.max(0, baseline.revenue - target.revenue);
  const severity = severityFor(revenueDropPct, lostRevenue, thresholds);

  if (severity === "OK") return null;

  const causes = causeFor(
    { target, baseline, revenueDropPct, conversionDropPct, sessionsDropPct, aovDropPct, adSpendDropPct },
    thresholds,
  );

  const noun = scope.id === "business" ? "total revenue" : key;
  const marker = target.markers[0] ? ` after ${target.markers[0]}` : "";
  let alert;
  if (scope.id === "business" && conversionDropPct <= thresholds.conversionDropPct) {
    alert = `Total conversion rate dropped ${Math.abs(Math.round(conversionDropPct))}%${marker}.`;
  } else if (conversionDropPct <= thresholds.conversionDropPct) {
    alert = `${noun} conversions dropped ${Math.abs(Math.round(conversionDropPct))}%${marker}.`;
  } else {
    alert = `${noun} dropped ${Math.abs(Math.round(revenueDropPct))}%${marker}.`;
  }

  return {
    severity,
    scope: scope.label,
    scope_id: scope.id,
    segment: key,
    alert,
    probable_causes: causes,
    estimated_lost_revenue: Math.round(lostRevenue * 100) / 100,
    target,
    baseline,
    changes: {
      revenue_pct: Math.round(revenueDropPct * 10) / 10,
      conversion_pct: Math.round(conversionDropPct * 10) / 10,
      sessions_pct: Math.round(sessionsDropPct * 10) / 10,
      aov_pct: Math.round(aovDropPct * 10) / 10,
      ad_spend_pct: Math.round(adSpendDropPct * 10) / 10,
    },
  };
}

function analyze(rows, config, targetDate) {
  const trailingDays = Number(config.trailingDays || 7);
  const baselineDates = [];
  for (let offset = -trailingDays; offset < 0; offset += 1) {
    baselineDates.push(isoDateOffset(targetDate, offset));
  }

  const rowsByDate = new Map();
  for (const row of rows) {
    if (!rowsByDate.has(row.date)) rowsByDate.set(row.date, []);
    rowsByDate.get(row.date).push(row);
  }

  const targetRows = rowsByDate.get(targetDate) || [];
  const baselineRows = baselineDates.flatMap((date) => rowsByDate.get(date) || []);
  const availableBaselineDates = baselineDates.filter((date) => rowsByDate.has(date));

  const anomalies = [];
  const summaries = [];

  for (const scope of config.scopes) {
    const dimensions = scope.dimensions || [];
    const targetMap = aggregateRows(targetRows, dimensions);
    const baselineMap = aggregateRows(baselineRows, dimensions);
    const keys = unique([...targetMap.keys(), ...baselineMap.keys()]);

    for (const key of keys) {
      const anomaly = buildAnomaly(
        scope,
        key,
        targetMap.get(key),
        baselineMap.get(key),
        Math.max(availableBaselineDates.length, 1),
        config.thresholds,
      );
      if (anomaly) anomalies.push(anomaly);
    }

    if (scope.id === "business") {
      const targetTotal = finalizeMetric(targetMap.get("All revenue") || emptyMetric());
      const baselineTotal = divideMetric(
        baselineMap.get("All revenue") || emptyMetric(),
        Math.max(availableBaselineDates.length, 1),
      );
      summaries.push({ scope: scope.label, segment: "All revenue", target: targetTotal, baseline: baselineTotal });
    }
  }

  anomalies.sort((left, right) => {
    const severityRank = { P0: 0, P1: 1, WATCH: 2 };
    return (
      severityRank[left.severity] - severityRank[right.severity] ||
      right.estimated_lost_revenue - left.estimated_lost_revenue
    );
  });

  return {
    targetDate,
    baselineDates: availableBaselineDates,
    anomalies: anomalies.slice(0, config.outputs.maxAnomalies || 40),
    summaries,
  };
}

function money(value) {
  return currencyFormatter.format(value || 0);
}

function pct(value) {
  return `${percentFormatter.format(value || 0)}%`;
}

function estimatedExposure(result) {
  const business = result.anomalies.find((item) => item.scope_id === "business");
  if (business) return business.estimated_lost_revenue;
  return Math.max(0, ...result.anomalies.map((item) => item.estimated_lost_revenue || 0));
}

function writeJson(outputDir, result, meta) {
  fs.writeFileSync(
    path.join(outputDir, "revenue-watchdog.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), ...meta, ...result }, null, 2),
  );
}

function writeMarkdown(outputDir, result, meta) {
  const totalLost = estimatedExposure(result);
  const p0Count = result.anomalies.filter((item) => item.severity === "P0").length;
  const p1Count = result.anomalies.filter((item) => item.severity === "P1").length;
  const lines = [
    "# Autonomous Revenue Watchdog",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Input: \`${meta.inputLabel}\``,
    `Date checked: **${result.targetDate}**`,
    `Baseline: trailing ${result.baselineDates.length} available days`,
    "",
    "## Executive Read",
    "",
  ];

  if (!result.anomalies.length) {
    lines.push("- No revenue anomalies crossed the configured thresholds.");
  } else {
    lines.push(`- **${result.anomalies.length} anomalies** detected: ${p0Count} P0, ${p1Count} P1.`);
    lines.push(`- Estimated daily revenue at risk: **${money(totalLost)}**.`);
    lines.push(`- Top alert: **${result.anomalies[0].alert}**`);
  }

  lines.push("", "## Top Anomalies", "");
  if (!result.anomalies.length) {
    lines.push("No anomalies detected.");
  } else {
    lines.push("| Severity | Scope | Segment | Lost Revenue | Revenue | Sessions | Conversion | Probable Cause |");
    lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | --- |");
    for (const item of result.anomalies.slice(0, 12)) {
      lines.push(
        `| ${item.severity} | ${item.scope} | ${item.segment} | ${money(item.estimated_lost_revenue)} | ${pct(item.changes.revenue_pct)} | ${pct(item.changes.sessions_pct)} | ${pct(item.changes.conversion_pct)} | ${item.probable_causes[0]} |`,
      );
    }
  }

  lines.push("", "## Owner Alert Text", "");
  lines.push("```text");
  lines.push(buildAlertText(result));
  lines.push("```");

  lines.push("", "## Next Checks", "");
  lines.push("- Open the affected product/page and confirm images, price, inventory, add-to-cart, and checkout still work.");
  lines.push("- Check ad delivery and email sends for any segment where sessions dropped.");
  lines.push("- Add `change_marker` values to the daily export whenever images, pricing, copy, ads, or stock changed.");

  fs.writeFileSync(path.join(outputDir, "revenue-watchdog-report.md"), `${lines.join("\n")}\n`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeHtml(outputDir, result, meta) {
  const rows = result.anomalies
    .map(
      (item) => `<tr>
        <td><span class="sev ${item.severity.toLowerCase()}">${item.severity}</span></td>
        <td>${escapeHtml(item.scope)}</td>
        <td>${escapeHtml(item.segment)}</td>
        <td>${money(item.estimated_lost_revenue)}</td>
        <td>${pct(item.changes.revenue_pct)}</td>
        <td>${pct(item.changes.sessions_pct)}</td>
        <td>${pct(item.changes.conversion_pct)}</td>
        <td>${escapeHtml(item.probable_causes.join("; "))}</td>
      </tr>`,
    )
    .join("");
  const totalLost = estimatedExposure(result);
  const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NoodleBomb Revenue Watchdog</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #100d0b; color: #f8ead1; }
    main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 64px; }
    h1 { margin: 0; font-size: clamp(2.2rem, 5vw, 4.8rem); line-height: .92; letter-spacing: 0; }
    p { color: #cdbd9d; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 28px 0; }
    .card { border: 1px solid #3d2e24; background: #1b1410; border-radius: 14px; padding: 16px; }
    .card span { display: block; color: #b9a98c; font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; }
    .card strong { display: block; color: #ffb454; font-size: 2rem; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; background: #1b1410; border: 1px solid #3d2e24; border-radius: 14px; overflow: hidden; }
    th, td { padding: 12px 10px; border-bottom: 1px solid #30241d; text-align: left; vertical-align: top; }
    th { color: #f8d8a6; font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; }
    td { color: #ead8bb; }
    .sev { display: inline-flex; border-radius: 999px; padding: 5px 9px; font-weight: 800; font-size: .78rem; }
    .p0 { background: #ef4444; color: #170606; }
    .p1 { background: #f97316; color: #180a03; }
    .watch { background: #facc15; color: #171303; }
    pre { white-space: pre-wrap; background: #1b1410; border: 1px solid #3d2e24; border-radius: 14px; padding: 16px; color: #f5dec0; }
  </style>
</head>
<body>
  <main>
    <p>Executive intelligence</p>
    <h1>Revenue Watchdog</h1>
    <p>${escapeHtml(meta.inputLabel)} checked for ${escapeHtml(result.targetDate)} against ${result.baselineDates.length} trailing days.</p>
    <section class="cards">
      <div class="card"><span>Anomalies</span><strong>${result.anomalies.length}</strong></div>
      <div class="card"><span>Estimated lost revenue</span><strong>${money(totalLost)}</strong></div>
      <div class="card"><span>Highest severity</span><strong>${result.anomalies[0]?.severity || "OK"}</strong></div>
    </section>
    <h2>Top anomalies</h2>
    <table>
      <thead><tr><th>Severity</th><th>Scope</th><th>Segment</th><th>Lost</th><th>Revenue</th><th>Sessions</th><th>Conversion</th><th>Probable cause</th></tr></thead>
      <tbody>${rows || "<tr><td colspan='8'>No anomalies crossed the configured thresholds.</td></tr>"}</tbody>
    </table>
    <h2>Owner alert</h2>
    <pre>${escapeHtml(buildAlertText(result))}</pre>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outputDir, "revenue-watchdog-dashboard.html"), htmlDoc);
}

function buildAlertText(result) {
  if (!result.anomalies.length) {
    return `Revenue Watchdog ${result.targetDate}: no anomalies crossed thresholds.`;
  }
  const top = result.anomalies[0];
  const totalLost = estimatedExposure(result);
  return [
    `Revenue Watchdog ${result.targetDate}: ${result.anomalies.length} anomalies detected, estimated ${money(totalLost)} at risk.`,
    `${top.severity}: ${top.alert}`,
    `Lost revenue estimate: ${money(top.estimated_lost_revenue)}.`,
    `Probable cause: ${top.probable_causes[0]}.`,
    `Next move: inspect ${top.segment} for inventory, PDP changes, ad delivery, and checkout friction.`,
  ].join("\n");
}

function writeAlert(outputDir, result) {
  fs.writeFileSync(path.join(outputDir, "revenue-watchdog-alert.txt"), `${buildAlertText(result)}\n`);
}

async function maybePostSlack(result, config) {
  const webhookEnv = config.notification?.slackWebhookEnv;
  const webhook = webhookEnv ? process.env[webhookEnv] : "";
  if (!webhook || !result.anomalies.length) return;
  if (config.notification?.postOnlyP0P1 && !result.anomalies.some((item) => item.severity === "P0" || item.severity === "P1")) {
    return;
  }
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: buildAlertText(result) }),
  });
  if (!response.ok) {
    throw new Error(`Slack webhook failed: HTTP ${response.status} ${await response.text()}`);
  }
}

function printNoData(outputDir, inputPath) {
  fs.mkdirSync(outputDir, { recursive: true });
  const message = [
    "# Autonomous Revenue Watchdog",
    "",
    `No live input file found at \`${path.relative(ROOT, inputPath)}\`.`,
    "",
    "Add `data/revenue-watchdog/daily_metrics.csv` or run `npm run revenue:watch:sample` for a smoke test.",
  ].join("\n");
  fs.writeFileSync(path.join(outputDir, "revenue-watchdog-report.md"), `${message}\n`);
  fs.writeFileSync(path.join(outputDir, "revenue-watchdog-alert.txt"), "Revenue Watchdog: no live input file found.\n");
  console.log(`[OK] No live revenue file found: ${inputPath}`);
  console.log(`[OK] Wrote placeholder report: ${path.join(outputDir, "revenue-watchdog-report.md")}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const outputDir = path.join(ROOT, config.outputs?.directory || "tmp/revenue-watchdog");
  const inputPath = path.resolve(ROOT, args.input || process.env.REVENUE_WATCHDOG_INPUT || DEFAULT_INPUT);

  if (!fs.existsSync(inputPath)) {
    printNoData(outputDir, inputPath);
    return;
  }

  const rows = parseCsv(fs.readFileSync(inputPath, "utf8")).map(normalizeRow).filter((row) => row.date);
  if (!rows.length) {
    throw new Error(`No usable rows found in ${inputPath}`);
  }

  const targetDate = args.date || process.env.REVENUE_WATCHDOG_DATE || yesterdayIso();
  const result = analyze(rows, config, targetDate);
  const meta = {
    inputLabel: path.relative(ROOT, inputPath),
    sampleMode: Boolean(args.sample),
  };

  fs.mkdirSync(outputDir, { recursive: true });
  writeJson(outputDir, result, meta);
  writeMarkdown(outputDir, result, meta);
  writeHtml(outputDir, result, meta);
  writeAlert(outputDir, result);
  await maybePostSlack(result, config);

  console.log(`[OK] Revenue watchdog checked ${targetDate}`);
  console.log(`[OK] Anomalies: ${result.anomalies.length}`);
  console.log(`[OK] Report: ${path.join(outputDir, "revenue-watchdog-report.md")}`);
  console.log(`[OK] Dashboard: ${path.join(outputDir, "revenue-watchdog-dashboard.html")}`);
}

main().catch((error) => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
