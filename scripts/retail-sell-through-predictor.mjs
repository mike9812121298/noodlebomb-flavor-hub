#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FLAVOR_ANALYSIS_JSON = path.join(ROOT, "tmp/flavor-review-analyzer/flavor-review-analysis.json");
const RECIPE_CONTENT_JSON = path.join(ROOT, "tmp/recipe-content-engine/recipe-content.json");
const STORE_ARCHETYPES_JSON = path.join(ROOT, "data/retail-sell-through-store-archetypes.json");
const OPTIONAL_STORE_CSV = path.join(ROOT, "data/retail-prospects.csv");
const OPTIONAL_HISTORY_CSV = path.join(ROOT, "data/retail-sell-through-history.csv");
const OUT_DIR = path.join(ROOT, "tmp/retail-sell-through-predictor");

const FLAVORS = [
  {
    id: "original",
    name: "Original",
    sku: "Gt-50001",
    role: "daily driver",
    basePopularity: 86,
    trendMap: { garlic_umami: 1.0, chili_crisp: 0.15, citrus_bright: 0.05 },
    complaintRisk: { too_salty: 0.35, too_sweet: 0.15, thin_watery: 0.1 },
  },
  {
    id: "spicy-tokyo",
    name: "Spicy Tokyo",
    sku: "Gt-50003",
    role: "heat and excitement",
    basePopularity: 82,
    trendMap: { chili_crisp: 1.15, garlic_umami: 0.3, citrus_bright: 0.05 },
    complaintRisk: { too_spicy: 0.35, not_spicy_enough: -0.15, too_salty: 0.15 },
  },
  {
    id: "citrus-shoyu",
    name: "Citrus Shoyu",
    sku: "Gt-50002",
    role: "bright seafood and salad use",
    basePopularity: 70,
    trendMap: { citrus_bright: 1.35, garlic_umami: 0.15, chili_crisp: 0.05 },
    complaintRisk: { too_salty: 0.15, too_sweet: 0.1 },
  },
  {
    id: "shoyu-reserve",
    name: "Shoyu Reserve",
    sku: "NB-SOY-7OZ",
    role: "premium shoyu and finishing",
    basePopularity: 64,
    trendMap: { garlic_umami: 0.55, citrus_bright: 0.1, chili_crisp: 0.05 },
    complaintRisk: { too_salty: 0.25, thin_watery: 0.05 },
  },
];

const RETAILER_TYPE_WEIGHTS = {
  specialty_grocery: { original: 1.18, "spicy-tokyo": 1.02, "citrus-shoyu": 1.04, "shoyu-reserve": 0.88 },
  coop_natural: { original: 1.12, "spicy-tokyo": 0.84, "citrus-shoyu": 1.18, "shoyu-reserve": 0.92 },
  asian_grocery: { original: 1.1, "spicy-tokyo": 1.24, "citrus-shoyu": 0.94, "shoyu-reserve": 1.1 },
  premium_pantry: { original: 1.05, "spicy-tokyo": 0.82, "citrus-shoyu": 1.12, "shoyu-reserve": 1.24 },
  butcher_bbq: { original: 1.08, "spicy-tokyo": 1.22, "citrus-shoyu": 0.78, "shoyu-reserve": 1.02 },
  urban_market: { original: 1.0, "spicy-tokyo": 1.2, "citrus-shoyu": 0.9, "shoyu-reserve": 0.86 },
  mass_grocery: { original: 1.18, "spicy-tokyo": 0.96, "citrus-shoyu": 0.9, "shoyu-reserve": 0.72 },
};

const REGION_WEIGHTS = {
  PNW: { original: 1.08, "spicy-tokyo": 1.0, "citrus-shoyu": 1.08, "shoyu-reserve": 1.04 },
  "West Coast": { original: 1.0, "spicy-tokyo": 1.1, "citrus-shoyu": 1.08, "shoyu-reserve": 1.02 },
  Urban: { original: 0.98, "spicy-tokyo": 1.14, "citrus-shoyu": 1.02, "shoyu-reserve": 1.08 },
  Suburban: { original: 1.16, "spicy-tokyo": 0.88, "citrus-shoyu": 1.02, "shoyu-reserve": 0.82 },
  "Mountain / South": { original: 1.02, "spicy-tokyo": 1.12, "citrus-shoyu": 0.82, "shoyu-reserve": 0.92 },
  Canada: { original: 1.02, "spicy-tokyo": 1.02, "citrus-shoyu": 0.95, "shoyu-reserve": 1.12 },
};

const DEMOGRAPHIC_WEIGHTS = {
  local: { original: 1.08, "spicy-tokyo": 1.02, "citrus-shoyu": 1.04, "shoyu-reserve": 1.02 },
  foodie: { original: 1.06, "spicy-tokyo": 1.08, "citrus-shoyu": 1.08, "shoyu-reserve": 1.12 },
  premium: { original: 1.04, "spicy-tokyo": 0.95, "citrus-shoyu": 1.08, "shoyu-reserve": 1.18 },
  asian_snacking: { original: 1.08, "spicy-tokyo": 1.16, "citrus-shoyu": 0.96, "shoyu-reserve": 1.08 },
  natural: { original: 1.04, "spicy-tokyo": 0.88, "citrus-shoyu": 1.14, "shoyu-reserve": 0.96 },
  family: { original: 1.14, "spicy-tokyo": 0.84, "citrus-shoyu": 1.02, "shoyu-reserve": 0.85 },
  heat_seeking: { original: 0.94, "spicy-tokyo": 1.28, "citrus-shoyu": 0.82, "shoyu-reserve": 0.9 },
  low_spice: { original: 1.12, "spicy-tokyo": 0.7, "citrus-shoyu": 1.12, "shoyu-reserve": 1.0 },
  grilling: { original: 1.08, "spicy-tokyo": 1.16, "citrus-shoyu": 0.78, "shoyu-reserve": 1.05 },
  college: { original: 0.98, "spicy-tokyo": 1.18, "citrus-shoyu": 0.85, "shoyu-reserve": 0.78 },
  convenience: { original: 1.08, "spicy-tokyo": 1.1, "citrus-shoyu": 0.82, "shoyu-reserve": 0.72 },
  gift: { original: 1.02, "spicy-tokyo": 0.88, "citrus-shoyu": 1.08, "shoyu-reserve": 1.18 },
  cold_weather: { original: 1.08, "spicy-tokyo": 1.06, "citrus-shoyu": 0.88, "shoyu-reserve": 1.12 },
};

const TYPE_BASE_WEEKLY_UNITS = {
  specialty_grocery: 16,
  coop_natural: 13,
  asian_grocery: 24,
  premium_pantry: 9,
  butcher_bbq: 12,
  urban_market: 18,
  mass_grocery: 22,
};

const TRAFFIC_MULTIPLIERS = {
  low: 0.72,
  medium: 1,
  high: 1.35,
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells.map((value) => value.trim());
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function normalizeStore(row, index) {
  const name = row.name || row.store_name || row.store || `Retail prospect ${index + 1}`;
  const retailerType = normalizeType(row.retailerType || row.retailer_type || row.type || "specialty_grocery");
  const region = row.region || row.state || "PNW";
  const demographics = String(row.demographics || row.tags || "")
    .split(/[|;]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  return {
    id: row.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    name,
    retailerType,
    region,
    trafficTier: (row.trafficTier || row.traffic_tier || "medium").toLowerCase(),
    shelfContext: row.shelfContext || row.shelf_context || "premium sauce set",
    demographics: demographics.length ? demographics : ["foodie", "premium"],
    notes: row.notes || "Loaded from data/retail-prospects.csv",
  };
}

function normalizeType(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function loadStores() {
  const prospects = readCsv(OPTIONAL_STORE_CSV);
  if (prospects.length) return prospects.map(normalizeStore);
  return readJson(STORE_ARCHETYPES_JSON, []).map(normalizeStore);
}

function topicMap(analysis) {
  return Object.fromEntries((analysis.topics ?? []).map((topic) => [topic.key, Number(topic.count || 0)]));
}

function spiceMap(analysis) {
  return Object.fromEntries((analysis.spice ?? []).map((spice) => [spice.key, Number(spice.count || 0)]));
}

function recipeCountsByFlavor(recipeContent) {
  const counts = Object.fromEntries(FLAVORS.map((flavor) => [flavor.id, 0]));
  for (const recipe of recipeContent.recipes ?? []) {
    if (recipe.flavorId in counts) counts[recipe.flavorId] += 1;
  }
  return counts;
}

function historyVelocityLift() {
  const rows = readCsv(OPTIONAL_HISTORY_CSV);
  if (!rows.length) return {};
  const byFlavor = {};
  for (const row of rows) {
    const flavorId = String(row.flavor_id || row.flavor || "").toLowerCase().replace(/\s+/g, "-");
    const units = Number(row.units_sold || row.units || 0);
    const days = Math.max(1, Number(row.days || row.sell_days || 30));
    if (!flavorId || !units) continue;
    const current = byFlavor[flavorId] ?? { units: 0, days: 0 };
    current.units += units;
    current.days += days;
    byFlavor[flavorId] = current;
  }
  return Object.fromEntries(Object.entries(byFlavor).map(([flavorId, value]) => [flavorId, clamp((value.units / value.days) * 7 / 6, 0.75, 1.35)]));
}

function flavorSignalScores(analysis, recipeContent) {
  const topics = topicMap(analysis);
  const spice = spiceMap(analysis);
  const recipeCounts = recipeCountsByFlavor(recipeContent);
  const maxRecipeCount = Math.max(1, ...Object.values(recipeCounts));
  const maxTopicCount = Math.max(1, ...Object.values(topics), ...Object.values(spice));

  return Object.fromEntries(FLAVORS.map((flavor) => {
    const trendPoints = Object.entries(flavor.trendMap).reduce((sum, [topic, weight]) => {
      return sum + ((topics[topic] ?? 0) / maxTopicCount) * weight * 18;
    }, 0);
    const spicePoints =
      flavor.id === "spicy-tokyo"
        ? ((spice.hot ?? 0) + (spice.extra_hot ?? 0) * 0.8) / maxTopicCount * 16
        : ((spice.medium ?? 0) + (spice.mild ?? 0) * 0.8) / maxTopicCount * 5;
    const complaintPenalty = Object.entries(flavor.complaintRisk).reduce((sum, [topic, weight]) => {
      return sum + ((topics[topic] ?? 0) / maxTopicCount) * weight * 8;
    }, 0);
    const recipePoints = (recipeCounts[flavor.id] / maxRecipeCount) * 5;
    const score = clamp(flavor.basePopularity + trendPoints + spicePoints + recipePoints - complaintPenalty, 45, 118);
    return [flavor.id, round(score, 1)];
  }));
}

function multiplierFor(map, key, flavorId) {
  return map[key]?.[flavorId] ?? 1;
}

function scoreFlavorForStore(flavor, store, signalScores, historyLift) {
  const typeMultiplier = multiplierFor(RETAILER_TYPE_WEIGHTS, store.retailerType, flavor.id);
  const regionMultiplier = multiplierFor(REGION_WEIGHTS, store.region, flavor.id);
  const demographicMultiplier = (store.demographics ?? []).reduce((product, tag) => {
    return product * multiplierFor(DEMOGRAPHIC_WEIGHTS, tag, flavor.id);
  }, 1);
  const historyMultiplier = historyLift[flavor.id] ?? 1;
  const score = signalScores[flavor.id] * typeMultiplier * regionMultiplier * demographicMultiplier * historyMultiplier;
  return clamp(score, 20, 160);
}

function assortmentSize(store, storeFitScore) {
  if (storeFitScore >= 86 || store.trafficTier === "high") return 48;
  if (storeFitScore >= 72) return 36;
  return 24;
}

function reorderWindow(days) {
  if (days <= 14) return "10-14 days";
  if (days <= 21) return "14-21 days";
  if (days <= 30) return "21-30 days";
  if (days <= 45) return "30-45 days";
  return "45+ days";
}

function confidenceFor({ analysis, recipeContent, historyLift, storeFitScore }) {
  const hasHistory = Object.keys(historyLift).length > 0;
  const dataScore =
    (analysis.stats?.usableRows ? 15 : 0) +
    ((recipeContent.recipes?.length ?? 0) >= 20 ? 10 : 5) +
    (hasHistory ? 22 : 0) +
    (storeFitScore >= 78 ? 7 : 4);
  return clamp(38 + dataScore, 48, hasHistory ? 92 : 78);
}

function buildPrediction(store, signalScores, analysis, recipeContent, historyLift) {
  const flavorFits = FLAVORS.map((flavor) => {
    const fitScore = round(scoreFlavorForStore(flavor, store, signalScores, historyLift), 1);
    return {
      flavorId: flavor.id,
      flavorName: flavor.name,
      sku: flavor.sku,
      role: flavor.role,
      fitScore,
      reason: reasonForFlavor(flavor, store),
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  const averageTopFit = flavorFits.slice(0, 3).reduce((sum, item) => sum + item.fitScore, 0) / 3;
  const storeFitScore = round(clamp(averageTopFit / 1.45, 38, 96), 1);
  const typeBaseUnits = TYPE_BASE_WEEKLY_UNITS[store.retailerType] ?? 14;
  const weeklyUnits = round(typeBaseUnits * (TRAFFIC_MULTIPLIERS[store.trafficTier] ?? 1) * clamp(storeFitScore / 76, 0.7, 1.3), 1);
  const firstAssortmentUnits = assortmentSize(store, storeFitScore);
  const selectedFlavors = flavorFits.slice(0, firstAssortmentUnits >= 48 ? 4 : firstAssortmentUnits >= 36 ? 3 : 2);
  const unitsPerFlavor = Math.floor(firstAssortmentUnits / selectedFlavors.length / 12) * 12 || 12;
  const firstCase = selectedFlavors.map((item) => ({
    flavorName: item.flavorName,
    sku: item.sku,
    units: unitsPerFlavor,
  }));
  const totalUnits = firstCase.reduce((sum, item) => sum + item.units, 0);
  const reorderDays = round((totalUnits / Math.max(1, weeklyUnits)) * 7, 0);
  return {
    storeId: store.id,
    storeName: store.name,
    retailerType: store.retailerType,
    region: store.region,
    trafficTier: store.trafficTier,
    shelfContext: store.shelfContext,
    demographics: store.demographics,
    storeFitScore,
    weeklyUnits,
    likelyReorderDays: reorderDays,
    likelyReorderWindow: reorderWindow(reorderDays),
    confidence: confidenceFor({ analysis, recipeContent, historyLift, storeFitScore }),
    bestFirstCaseAssortment: firstCase,
    topFlavors: selectedFlavors.map((item) => item.flavorName),
    flavorFits,
    salesNote: salesNote(store, selectedFlavors),
  };
}

function reasonForFlavor(flavor, store) {
  const reasons = [];
  if (store.retailerType === "asian_grocery") reasons.push("ramen and dumpling aisle context");
  if (store.retailerType === "coop_natural") reasons.push("recipe-led natural grocery shopper");
  if (store.retailerType === "premium_pantry") reasons.push("giftable premium pantry shelf");
  if (store.retailerType === "butcher_bbq") reasons.push("marinade, wing, and glaze use case");
  if (store.demographics?.includes("heat_seeking") && flavor.id === "spicy-tokyo") reasons.push("heat-seeking shopper fit");
  if (store.demographics?.includes("low_spice") && flavor.id !== "spicy-tokyo") reasons.push("lower-spice household fit");
  if (store.demographics?.includes("local")) reasons.push("PNW maker story");
  reasons.push(`${flavor.role} role`);
  return [...new Set(reasons)].slice(0, 3).join("; ");
}

function salesNote(store, selectedFlavors) {
  const names = selectedFlavors.map((item) => item.flavorName).join(", ");
  if (store.retailerType === "asian_grocery") {
    return `Lead with ramen, dumplings, and rice bowls. First pitch: ${names}.`;
  }
  if (store.retailerType === "butcher_bbq") {
    return `Do not pitch ramen-only. Lead with wings, steak marinade, and pork glaze. First pitch: ${names}.`;
  }
  if (store.retailerType === "premium_pantry") {
    return `Sell as a giftable pantry upgrade with recipe cards. First pitch: ${names}.`;
  }
  if (store.retailerType === "coop_natural") {
    return `Lead with local small-batch story and balanced dinner use cases. First pitch: ${names}.`;
  }
  return `Lead with quick dinner use cases and shelf-ready POS. First pitch: ${names}.`;
}

function buildPredictions() {
  const stores = loadStores();
  const analysis = readJson(FLAVOR_ANALYSIS_JSON, { stats: {}, topics: [], spice: [] });
  const recipeContent = readJson(RECIPE_CONTENT_JSON, { recipes: [] });
  const signalScores = flavorSignalScores(analysis, recipeContent);
  const historyLift = historyVelocityLift();
  const predictions = stores.map((store) => buildPrediction(store, signalScores, analysis, recipeContent, historyLift));

  return {
    generatedAt: new Date().toISOString(),
    inputs: {
      flavorAnalysis: fs.existsSync(FLAVOR_ANALYSIS_JSON) ? FLAVOR_ANALYSIS_JSON : null,
      recipeContent: fs.existsSync(RECIPE_CONTENT_JSON) ? RECIPE_CONTENT_JSON : null,
      storeSource: fs.existsSync(OPTIONAL_STORE_CSV) ? OPTIONAL_STORE_CSV : STORE_ARCHETYPES_JSON,
      sellThroughHistory: fs.existsSync(OPTIONAL_HISTORY_CSV) ? OPTIONAL_HISTORY_CSV : null,
    },
    modelNotes: [
      "Prediction uses Reddit/market signal counts, recipe-use coverage, store archetype, region, demographics, and optional POS history if data/retail-sell-through-history.csv exists.",
      "This is a planning model, not a guarantee. Recalibrate once retailer reorder data exists.",
      "First-case units assume 12-unit wholesale cases per flavor.",
    ],
    signalScores,
    predictions,
  };
}

function renderMarkdown(result) {
  const lines = [];
  lines.push("# NoodleBomb Retail Sell-Through Predictor");
  lines.push("");
  lines.push(`Generated: ${result.generatedAt}`);
  lines.push("");
  lines.push("## Inputs");
  lines.push("");
  for (const [key, value] of Object.entries(result.inputs)) {
    lines.push(`- ${key}: ${value ?? "not found"}`);
  }
  lines.push("");
  lines.push("## Flavor Demand Signals");
  lines.push("");
  lines.push("| Flavor | Signal score |");
  lines.push("|---|---:|");
  for (const flavor of FLAVORS) {
    lines.push(`| ${flavor.name} | ${result.signalScores[flavor.id]} |`);
  }
  lines.push("");
  lines.push("## Store Predictions");
  lines.push("");
  lines.push("| Store / segment | Region | Fit | Reorder | Weekly units | First assortment | Confidence |");
  lines.push("|---|---|---:|---|---:|---|---:|");
  for (const prediction of result.predictions) {
    lines.push(`| ${prediction.storeName} | ${prediction.region} | ${prediction.storeFitScore} | ${prediction.likelyReorderWindow} | ${prediction.weeklyUnits} | ${prediction.bestFirstCaseAssortment.map((item) => `${item.units} ${item.flavorName}`).join(" + ")} | ${prediction.confidence}% |`);
  }
  lines.push("");
  lines.push("## How To Use");
  lines.push("");
  lines.push("- Use the top assortment as the first wholesale pitch for that store type.");
  lines.push("- If the reorder window is under 21 days, prioritize weekly follow-up and a reorder reminder.");
  lines.push("- If confidence is under 70, pitch a smaller test and collect real weekly unit movement.");
  lines.push("- Add real store rows to data/retail-prospects.csv with columns: name, retailer_type, region, traffic_tier, demographics, shelf_context.");
  lines.push("- Add real reorder history to data/retail-sell-through-history.csv with columns: store_id, flavor_id, units_sold, days.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function renderHtml(result) {
  const rows = result.predictions.map((prediction) => `
      <tr>
        <td><strong>${escapeHtml(prediction.storeName)}</strong><br><span>${escapeHtml(prediction.retailerType)}</span></td>
        <td>${escapeHtml(prediction.region)}</td>
        <td>${prediction.storeFitScore}</td>
        <td>${escapeHtml(prediction.likelyReorderWindow)}</td>
        <td>${prediction.weeklyUnits}</td>
        <td>${escapeHtml(prediction.bestFirstCaseAssortment.map((item) => `${item.units} ${item.flavorName}`).join(" + "))}</td>
        <td>${prediction.confidence}%</td>
      </tr>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NoodleBomb Retail Sell-Through Predictor</title>
  <style>
    body { margin: 0; background: #100d0b; color: #f6eee7; font-family: Inter, Arial, sans-serif; }
    main { max-width: 1180px; margin: 0 auto; padding: 42px 20px 70px; }
    .hero { border: 1px solid rgba(255,255,255,.12); background: linear-gradient(135deg, rgba(232,74,58,.22), rgba(255,255,255,.04)); border-radius: 24px; padding: 32px; }
    h1 { font-size: clamp(36px, 7vw, 74px); line-height: .92; margin: 10px 0; letter-spacing: -.06em; }
    p, td, th { color: rgba(246,238,231,.78); }
    .kicker { color: #e84a3a; text-transform: uppercase; letter-spacing: .2em; font-size: 12px; font-weight: 800; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 20px 0 28px; }
    .stat { border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 16px; background: rgba(255,255,255,.04); }
    .stat strong { display: block; font-size: 28px; color: #fff; }
    table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 16px; border: 1px solid rgba(255,255,255,.12); }
    th, td { padding: 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,.08); vertical-align: top; }
    th { color: #fff; background: rgba(255,255,255,.07); font-size: 12px; text-transform: uppercase; letter-spacing: .12em; }
    td span { color: rgba(246,238,231,.46); font-size: 12px; }
    @media (max-width: 760px) { .stats { grid-template-columns: 1fr 1fr; } table { font-size: 13px; } th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) { display: none; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="kicker">Wholesale intelligence</div>
      <h1>Retail sell-through predictor.</h1>
      <p>Flavor fit, likely reorder speed, and best first-case assortment by store type.</p>
    </section>
    <section class="stats">
      ${FLAVORS.map((flavor) => `<div class="stat"><span>${escapeHtml(flavor.name)}</span><strong>${result.signalScores[flavor.id]}</strong></div>`).join("")}
    </section>
    <table>
      <thead><tr><th>Store</th><th>Region</th><th>Fit</th><th>Reorder</th><th>Units/wk</th><th>First assortment</th><th>Conf.</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function writeOutputs(result) {
  ensureDir(OUT_DIR);
  fs.writeFileSync(path.join(OUT_DIR, "retail-sell-through.json"), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "retail-sell-through-report.md"), renderMarkdown(result));
  fs.writeFileSync(path.join(OUT_DIR, "retail-sell-through-dashboard.html"), renderHtml(result));

  const predictionHeaders = [
    "storeId",
    "storeName",
    "retailerType",
    "region",
    "trafficTier",
    "storeFitScore",
    "weeklyUnits",
    "likelyReorderDays",
    "likelyReorderWindow",
    "confidence",
    "topFlavors",
    "bestFirstCaseAssortment",
    "salesNote",
  ];
  fs.writeFileSync(
    path.join(OUT_DIR, "retail-sell-through-predictions.csv"),
    `${predictionHeaders.join(",")}\n${result.predictions.map((prediction) => predictionHeaders.map((header) => {
      if (header === "topFlavors") return csvEscape(prediction.topFlavors);
      if (header === "bestFirstCaseAssortment") return csvEscape(prediction.bestFirstCaseAssortment.map((item) => `${item.units} ${item.flavorName}`));
      return csvEscape(prediction[header]);
    }).join(",")).join("\n")}\n`,
  );

  const fitHeaders = ["storeId", "storeName", "flavorName", "sku", "fitScore", "role", "reason"];
  const fitRows = result.predictions.flatMap((prediction) =>
    prediction.flavorFits.map((fit) => ({
      storeId: prediction.storeId,
      storeName: prediction.storeName,
      ...fit,
    })),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "retail-store-flavor-fit.csv"),
    `${fitHeaders.join(",")}\n${fitRows.map((row) => fitHeaders.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
  );
}

function main() {
  const result = buildPredictions();
  writeOutputs(result);
  console.log(`Predicted ${result.predictions.length} retail segments/stores`);
  console.log(path.join(OUT_DIR, "retail-sell-through-report.md"));
  console.log(path.join(OUT_DIR, "retail-sell-through-predictions.csv"));
  console.log(path.join(OUT_DIR, "retail-sell-through-dashboard.html"));
}

main();
