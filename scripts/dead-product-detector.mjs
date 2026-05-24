import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "data", "dead-product-detector-config.json");
const DEFAULT_INPUT = path.join(ROOT, "data", "dead-products", "sku_metrics.csv");

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
  if (!rows.length) return [];

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
  const parsed = Number(String(value).replace(/[$,%]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeRow(row) {
  const numericFields = [
    "inventory_on_hand",
    "inventory_age_days",
    "unit_cost",
    "price",
    "gross_margin_pct",
    "sessions_30d",
    "orders_30d",
    "revenue_30d",
    "units_sold_30d",
    "ad_spend_30d",
    "support_mentions_30d",
    "refunds_30d",
    "last_sale_days_ago",
  ];
  const normalized = { ...row };
  for (const field of numericFields) {
    normalized[field] = toNumber(row[field]);
  }
  normalized.conversion_rate = normalized.sessions_30d > 0 ? normalized.orders_30d / normalized.sessions_30d : 0;
  normalized.inventory_value = normalized.inventory_on_hand * normalized.unit_cost;
  normalized.ad_roas = normalized.ad_spend_30d > 0 ? normalized.revenue_30d / normalized.ad_spend_30d : 0;
  return normalized;
}

function segmentKey(row, groupBy) {
  return groupBy.map((field) => row[field] || "(blank)").join(" | ");
}

function blankGroup(key) {
  return {
    key,
    sku: "",
    product: "",
    category: "",
    flavor: "",
    channels: new Set(),
    statuses: new Set(),
    inventory_on_hand: 0,
    inventory_age_weighted_sum: 0,
    inventory_age_weight: 0,
    inventory_value: 0,
    unit_cost_sum: 0,
    price_sum: 0,
    price_count: 0,
    gross_margin_pct_sum: 0,
    gross_margin_pct_count: 0,
    sessions_30d: 0,
    orders_30d: 0,
    revenue_30d: 0,
    units_sold_30d: 0,
    ad_spend_30d: 0,
    support_mentions_30d: 0,
    refunds_30d: 0,
    last_sale_days_ago: 0,
    related_hero_skus: new Set(),
    change_markers: new Set(),
    notes: new Set(),
  };
}

function addRow(group, row) {
  group.sku ||= row.sku;
  group.product ||= row.product;
  group.category ||= row.category;
  group.flavor ||= row.flavor;
  if (row.channel) group.channels.add(row.channel);
  if (row.status) group.statuses.add(row.status);
  group.inventory_on_hand += row.inventory_on_hand;
  group.inventory_age_weighted_sum += row.inventory_age_days * Math.max(1, row.inventory_on_hand);
  group.inventory_age_weight += Math.max(1, row.inventory_on_hand);
  group.inventory_value += row.inventory_value;
  group.unit_cost_sum += row.unit_cost;
  if (row.price) {
    group.price_sum += row.price;
    group.price_count += 1;
  }
  if (row.gross_margin_pct) {
    group.gross_margin_pct_sum += row.gross_margin_pct;
    group.gross_margin_pct_count += 1;
  }
  group.sessions_30d += row.sessions_30d;
  group.orders_30d += row.orders_30d;
  group.revenue_30d += row.revenue_30d;
  group.units_sold_30d += row.units_sold_30d;
  group.ad_spend_30d += row.ad_spend_30d;
  group.support_mentions_30d += row.support_mentions_30d;
  group.refunds_30d += row.refunds_30d;
  group.last_sale_days_ago = Math.max(group.last_sale_days_ago, row.last_sale_days_ago);
  if (row.related_hero_sku) group.related_hero_skus.add(row.related_hero_sku);
  if (row.change_marker) group.change_markers.add(row.change_marker);
  if (row.notes) group.notes.add(row.notes);
}

function finalizeGroup(group) {
  const conversionRate = group.sessions_30d > 0 ? group.orders_30d / group.sessions_30d : 0;
  const sellThrough30d =
    group.inventory_on_hand + group.units_sold_30d > 0
      ? group.units_sold_30d / (group.inventory_on_hand + group.units_sold_30d)
      : 0;
  return {
    key: group.key,
    sku: group.sku,
    product: group.product,
    category: group.category,
    flavor: group.flavor,
    channels: unique([...group.channels]),
    statuses: unique([...group.statuses]),
    inventory_on_hand: group.inventory_on_hand,
    inventory_age_days:
      group.inventory_age_weight > 0 ? Math.round(group.inventory_age_weighted_sum / group.inventory_age_weight) : 0,
    inventory_value: Math.round(group.inventory_value * 100) / 100,
    price: group.price_count > 0 ? Math.round((group.price_sum / group.price_count) * 100) / 100 : 0,
    gross_margin_pct:
      group.gross_margin_pct_count > 0
        ? Math.round((group.gross_margin_pct_sum / group.gross_margin_pct_count) * 1000) / 1000
        : 0,
    sessions_30d: group.sessions_30d,
    orders_30d: group.orders_30d,
    revenue_30d: Math.round(group.revenue_30d * 100) / 100,
    units_sold_30d: group.units_sold_30d,
    ad_spend_30d: Math.round(group.ad_spend_30d * 100) / 100,
    support_mentions_30d: group.support_mentions_30d,
    refunds_30d: group.refunds_30d,
    last_sale_days_ago: group.last_sale_days_ago,
    conversion_rate: conversionRate,
    sell_through_30d: sellThrough30d,
    ad_roas: group.ad_spend_30d > 0 ? group.revenue_30d / group.ad_spend_30d : 0,
    related_hero_skus: unique([...group.related_hero_skus]),
    change_markers: unique([...group.change_markers]),
    notes: unique([...group.notes]),
  };
}

function groupRows(rows, groupBy) {
  const map = new Map();
  for (const row of rows) {
    const key = segmentKey(row, groupBy);
    if (!map.has(key)) map.set(key, blankGroup(key));
    addRow(map.get(key), row);
  }
  return [...map.values()].map(finalizeGroup);
}

function scoreGroup(group, thresholds) {
  const signals = {
    demand: 0,
    friction: 0,
    inventoryRisk: 0,
    adWaste: 0,
    supportNoise: 0,
    staleness: 0,
  };

  if (group.sessions_30d >= thresholds.highTrafficSessions30d) signals.demand += 32;
  if (group.sessions_30d >= thresholds.lowTrafficSessions30d) signals.demand += 14;
  if (group.revenue_30d >= thresholds.minimumRevenue30d) signals.demand += 14;
  if (group.conversion_rate >= thresholds.healthyConversionRate) signals.demand += 22;
  if (group.orders_30d >= 5) signals.demand += 18;

  if (group.sessions_30d >= thresholds.highTrafficSessions30d && group.conversion_rate < thresholds.weakConversionRate) {
    signals.friction += 42;
  }
  if (group.support_mentions_30d >= thresholds.supportNoiseMentions30d) signals.friction += 18;
  if (group.change_markers.length) signals.friction += 12;
  if (group.refunds_30d >= 2) signals.friction += 18;

  if (group.inventory_on_hand >= thresholds.highInventoryUnits) signals.inventoryRisk += 22;
  if (group.inventory_age_days >= thresholds.agedInventoryDays) signals.inventoryRisk += 28;
  if (group.inventory_age_days >= thresholds.veryAgedInventoryDays) signals.inventoryRisk += 22;
  if (group.sell_through_30d < 0.05 && group.inventory_on_hand > 0) signals.inventoryRisk += 22;

  if (group.ad_spend_30d >= thresholds.adWasteSpend30d && group.revenue_30d < group.ad_spend_30d * 1.2) {
    signals.adWaste += 44;
  }
  if (group.ad_spend_30d > 0 && group.ad_roas > 0 && group.ad_roas < 1.5) signals.adWaste += 18;

  if (group.support_mentions_30d >= thresholds.supportNoiseMentions30d) signals.supportNoise += 30;
  if (group.support_mentions_30d >= thresholds.supportNoiseMentions30d * 2) signals.supportNoise += 20;

  if (group.last_sale_days_ago >= thresholds.lastSaleStaleDays) signals.staleness += 24;
  if (group.last_sale_days_ago >= thresholds.lastSaleDeadDays) signals.staleness += 38;
  if (group.sessions_30d < thresholds.lowTrafficSessions30d && group.orders_30d === 0) signals.staleness += 28;

  const healthScore = Math.max(
    0,
    Math.min(100, signals.demand - signals.friction * 0.5 - signals.inventoryRisk * 0.25 - signals.adWaste * 0.35),
  );
  const zombieScore = Math.max(
    0,
    Math.min(100, signals.staleness * 0.42 + signals.inventoryRisk * 0.34 + signals.adWaste * 0.14 + signals.supportNoise * 0.1),
  );

  return { signals, healthScore: Math.round(healthScore), zombieScore: Math.round(zombieScore) };
}

function decide(group, scores, thresholds) {
  const reasons = [];
  const actions = [];
  const { signals } = scores;

  if (group.sessions_30d >= thresholds.highTrafficSessions30d && group.conversion_rate < thresholds.weakConversionRate) {
    reasons.push("High traffic but weak conversion");
    actions.push("Audit PDP image, first-screen copy, price, shipping promise, and add-to-cart flow.");
  }
  if (group.support_mentions_30d >= thresholds.supportNoiseMentions30d) {
    reasons.push("Support mentions are high");
    actions.push("Add FAQ, ingredient, use-case, or sizing clarity before spending more traffic.");
  }
  if (group.ad_spend_30d >= thresholds.adWasteSpend30d && group.revenue_30d < group.ad_spend_30d * 1.2) {
    reasons.push("Ad spend is not paying back");
    actions.push("Pause cold spend until the PDP or offer is fixed.");
  }
  if (group.inventory_age_days >= thresholds.agedInventoryDays && group.inventory_on_hand >= thresholds.highInventoryUnits) {
    reasons.push("Inventory is aging with material units on hand");
    actions.push("Create a 14-day clearance or bundle offer to free cash.");
  }
  if (group.last_sale_days_ago >= thresholds.lastSaleDeadDays || (group.sessions_30d < thresholds.lowTrafficSessions30d && group.orders_30d === 0)) {
    reasons.push("No meaningful demand signal");
    actions.push("Remove from primary navigation and paid ads.");
  }
  if (group.related_hero_skus.length) {
    actions.push(`Test as an add-on with ${group.related_hero_skus.join(", ")}.`);
  }

  let recommendation = "bundle";
  if (
    signals.friction >= 35 &&
    group.sessions_30d >= thresholds.highTrafficSessions30d &&
    group.inventory_age_days < thresholds.veryAgedInventoryDays
  ) {
    recommendation = "revive";
  } else if (
    (group.inventory_age_days >= thresholds.veryAgedInventoryDays && group.orders_30d === 0) ||
    (group.sessions_30d < thresholds.lowTrafficSessions30d && group.last_sale_days_ago >= thresholds.lastSaleDeadDays)
  ) {
    recommendation = "archive";
  } else if (signals.inventoryRisk >= 50 || signals.adWaste >= 35) {
    recommendation = "liquidate";
  } else if (group.orders_30d >= 5 && group.conversion_rate >= thresholds.healthyConversionRate) {
    recommendation = "revive";
    reasons.push("Demand is healthy enough to keep investing");
    actions.push("Keep live and test better bundles or subscription placement.");
  } else {
    recommendation = "bundle";
    reasons.push("Standalone demand is modest but it can support AOV");
  }

  if (recommendation === "archive") {
    actions.sort((left, right) => {
      const leftRank = left.startsWith("Remove from primary") ? 0 : 1;
      const rightRank = right.startsWith("Remove from primary") ? 0 : 1;
      return leftRank - rightRank;
    });
  }

  if (!reasons.length) reasons.push("Insufficient signal; monitor for another 30 days");
  if (!actions.length) actions.push("Keep visible only where it helps the main purchase path.");

  return {
    recommendation,
    reasons: unique(reasons),
    actions: unique(actions),
  };
}

function analyze(rows, config) {
  const normalized = rows.map(normalizeRow);
  const grouped = groupRows(normalized, config.groupBy || ["sku"]);
  const results = grouped.map((group) => {
    const scores = scoreGroup(group, config.thresholds);
    const decision = decide(group, scores, config.thresholds);
    return { ...group, ...scores, ...decision };
  });

  results.sort((left, right) => {
    const priority = { liquidate: 0, archive: 1, revive: 2, bundle: 3 };
    return priority[left.recommendation] - priority[right.recommendation] || right.zombieScore - left.zombieScore;
  });
  return results.slice(0, config.outputs?.maxRows || 80);
}

function money(value) {
  return moneyFormatter.format(value || 0);
}

function pct(value) {
  return `${Math.round((value || 0) * 1000) / 10}%`;
}

function csvValue(value) {
  const clean = String(value ?? "");
  if (/[",\n\r]/.test(clean)) return `"${clean.replace(/"/g, '""')}"`;
  return clean;
}

function writeCsv(outputDir, rows) {
  const headers = [
    "recommendation",
    "sku",
    "product",
    "zombie_score",
    "health_score",
    "sessions_30d",
    "conversion_rate",
    "inventory_on_hand",
    "inventory_age_days",
    "ad_spend_30d",
    "support_mentions_30d",
    "last_sale_days_ago",
    "first_reason",
    "first_action",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((header) => {
          if (header === "first_reason") return csvValue(row.reasons[0]);
          if (header === "first_action") return csvValue(row.actions[0]);
          if (header === "zombie_score") return csvValue(row.zombieScore);
          if (header === "health_score") return csvValue(row.healthScore);
          return csvValue(row[header]);
        })
        .join(","),
    );
  }
  fs.writeFileSync(path.join(outputDir, "dead-product-action-plan.csv"), `${lines.join("\n")}\n`);
}

function writeJson(outputDir, rows, meta) {
  fs.writeFileSync(
    path.join(outputDir, "dead-product-detector.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), ...meta, results: rows }, null, 2),
  );
}

function writeMarkdown(outputDir, rows, meta) {
  const counts = rows.reduce((acc, row) => {
    acc[row.recommendation] = (acc[row.recommendation] || 0) + 1;
    return acc;
  }, {});
  const trappedCash = rows
    .filter((row) => row.recommendation === "liquidate" || row.recommendation === "archive")
    .reduce((sum, row) => sum + row.inventory_value, 0);
  const lines = [
    "# Dead Product Detector",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Input: \`${meta.inputLabel}\``,
    "",
    "## Executive Read",
    "",
    `- Revive: **${counts.revive || 0}**`,
    `- Bundle: **${counts.bundle || 0}**`,
    `- Liquidate: **${counts.liquidate || 0}**`,
    `- Archive: **${counts.archive || 0}**`,
    `- Inventory value trapped in liquidate/archive candidates: **${money(trappedCash)}**`,
    "",
    "## Action Queue",
    "",
    "| Action | SKU | Product | Zombie | Health | Traffic | Conv. | Inventory Age | Reason | Next Move |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.recommendation.toUpperCase()} | ${row.sku} | ${row.product} | ${row.zombieScore} | ${row.healthScore} | ${row.sessions_30d} | ${pct(row.conversion_rate)} | ${row.inventory_age_days}d | ${row.reasons[0]} | ${row.actions[0]} |`,
    );
  }

  lines.push("", "## Rules Of Thumb", "");
  lines.push("- `revive`: people are looking, but the offer/page is leaking.");
  lines.push("- `bundle`: useful next to a stronger product, weak alone.");
  lines.push("- `liquidate`: inventory or ad waste is tying up cash.");
  lines.push("- `archive`: no real demand signal; stop letting it clutter the store.");

  fs.writeFileSync(path.join(outputDir, "dead-product-report.md"), `${lines.join("\n")}\n`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeHtml(outputDir, rows, meta) {
  const counts = rows.reduce((acc, row) => {
    acc[row.recommendation] = (acc[row.recommendation] || 0) + 1;
    return acc;
  }, {});
  const tableRows = rows
    .map(
      (row) => `<tr>
        <td><span class="pill ${row.recommendation}">${escapeHtml(row.recommendation)}</span></td>
        <td>${escapeHtml(row.sku)}</td>
        <td>${escapeHtml(row.product)}</td>
        <td>${row.zombieScore}</td>
        <td>${row.healthScore}</td>
        <td>${row.sessions_30d}</td>
        <td>${pct(row.conversion_rate)}</td>
        <td>${row.inventory_on_hand} / ${row.inventory_age_days}d</td>
        <td>${money(row.ad_spend_30d)}</td>
        <td>${row.support_mentions_30d}</td>
        <td>${escapeHtml(row.reasons.join("; "))}</td>
      </tr>`,
    )
    .join("");
  const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NoodleBomb Dead Product Detector</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #100d0b; color: #f8ead1; }
    main { width: min(1220px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 64px; }
    h1 { margin: 0; font-size: clamp(2.2rem, 5vw, 4.8rem); line-height: .92; letter-spacing: 0; }
    p { color: #cdbd9d; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin: 28px 0; }
    .card { border: 1px solid #3d2e24; background: #1b1410; border-radius: 14px; padding: 16px; }
    .card span { color: #b9a98c; font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; }
    .card strong { display: block; color: #ffb454; font-size: 2.2rem; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; background: #1b1410; border: 1px solid #3d2e24; border-radius: 14px; overflow: hidden; }
    th, td { padding: 11px 9px; border-bottom: 1px solid #30241d; text-align: left; vertical-align: top; }
    th { color: #f8d8a6; font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; }
    td { color: #ead8bb; }
    .pill { display: inline-flex; border-radius: 999px; padding: 5px 9px; font-size: .74rem; font-weight: 900; text-transform: uppercase; }
    .revive { background: #22c55e; color: #031407; }
    .bundle { background: #facc15; color: #171303; }
    .liquidate { background: #f97316; color: #170903; }
    .archive { background: #ef4444; color: #170606; }
  </style>
</head>
<body>
  <main>
    <p>Catalog hygiene</p>
    <h1>Dead Product Detector</h1>
    <p>${escapeHtml(meta.inputLabel)} analyzed for zombie SKU risk, trapped inventory cash, ad waste, and support noise.</p>
    <section class="cards">
      <div class="card"><span>Revive</span><strong>${counts.revive || 0}</strong></div>
      <div class="card"><span>Bundle</span><strong>${counts.bundle || 0}</strong></div>
      <div class="card"><span>Liquidate</span><strong>${counts.liquidate || 0}</strong></div>
      <div class="card"><span>Archive</span><strong>${counts.archive || 0}</strong></div>
    </section>
    <table>
      <thead><tr><th>Action</th><th>SKU</th><th>Product</th><th>Zombie</th><th>Health</th><th>Traffic</th><th>Conv.</th><th>Inv.</th><th>Ad Spend</th><th>Support</th><th>Reason</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outputDir, "dead-product-dashboard.html"), htmlDoc);
}

function printNoData(outputDir, inputPath) {
  fs.mkdirSync(outputDir, { recursive: true });
  const message = [
    "# Dead Product Detector",
    "",
    `No live SKU metrics file found at \`${path.relative(ROOT, inputPath)}\`.`,
    "",
    "Add `data/dead-products/sku_metrics.csv` or run `npm run catalog:dead-products:sample` for a smoke test.",
  ].join("\n");
  fs.writeFileSync(path.join(outputDir, "dead-product-report.md"), `${message}\n`);
  console.log(`[OK] No live SKU metrics file found: ${inputPath}`);
  console.log(`[OK] Wrote placeholder report: ${path.join(outputDir, "dead-product-report.md")}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const outputDir = path.join(ROOT, config.outputs?.directory || "tmp/dead-product-detector");
  const inputPath = path.resolve(ROOT, args.input || process.env.DEAD_PRODUCT_INPUT || DEFAULT_INPUT);

  if (!fs.existsSync(inputPath)) {
    printNoData(outputDir, inputPath);
    return;
  }

  const rows = parseCsv(fs.readFileSync(inputPath, "utf8")).filter((row) => row.sku || row.product);
  if (!rows.length) throw new Error(`No usable rows found in ${inputPath}`);

  const results = analyze(rows, config);
  const meta = {
    inputLabel: path.relative(ROOT, inputPath),
    sampleMode: Boolean(args.sample),
  };

  fs.mkdirSync(outputDir, { recursive: true });
  writeJson(outputDir, results, meta);
  writeCsv(outputDir, results);
  writeMarkdown(outputDir, results, meta);
  writeHtml(outputDir, results, meta);

  const counts = results.reduce((acc, row) => {
    acc[row.recommendation] = (acc[row.recommendation] || 0) + 1;
    return acc;
  }, {});
  console.log(`[OK] Dead product detector analyzed ${results.length} SKUs`);
  console.log(
    `[OK] revive=${counts.revive || 0} bundle=${counts.bundle || 0} liquidate=${counts.liquidate || 0} archive=${counts.archive || 0}`,
  );
  console.log(`[OK] Report: ${path.join(outputDir, "dead-product-report.md")}`);
  console.log(`[OK] Dashboard: ${path.join(outputDir, "dead-product-dashboard.html")}`);
}

try {
  main();
} catch (error) {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
}
