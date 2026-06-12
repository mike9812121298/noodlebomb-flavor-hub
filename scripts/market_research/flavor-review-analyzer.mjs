#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "data/flavor-review-sources.json");
const OUT_DIR = path.join(ROOT, "tmp/flavor-review-analyzer");
const JSON_OUT = path.join(OUT_DIR, "flavor-review-analysis.json");
const HTML_OUT = path.join(OUT_DIR, "flavor-review-dashboard.html");
const MD_OUT = path.join(OUT_DIR, "flavor-review-report.md");
const CSV_OUT = path.join(OUT_DIR, "flavor-review-quotes.csv");

const STOPWORDS = new Set(
  "the a an and or but if then this that those these with without for from into onto over under about just really very like have has had was were are is be been being i me my we our you your they them their it its it's of to in on at as by not so do does did can could would should will get got make made use used using taste tastes tasted sauce ramen noodles noodle product bottle flavor flavour one two more less too much little good great bad nice".split(
    /\s+/,
  ),
);

const TOPIC_RULES = [
  {
    key: "too_salty",
    label: "Too salty / sodium balance",
    terms: ["too salty", "salt bomb", "sodium", "salty", "over salted", "oversalted"],
    type: "complaint",
  },
  {
    key: "too_sweet",
    label: "Too sweet",
    terms: ["too sweet", "sweetener", "sugary", "sugar", "cloying"],
    type: "complaint",
  },
  {
    key: "not_spicy_enough",
    label: "Not spicy enough",
    terms: ["not spicy", "no heat", "needs more heat", "mild", "weak heat", "barely spicy"],
    type: "complaint",
  },
  {
    key: "too_spicy",
    label: "Too spicy",
    terms: ["too spicy", "too hot", "burns", "painful", "overwhelming heat"],
    type: "complaint",
  },
  {
    key: "thin_watery",
    label: "Thin or watery texture",
    terms: ["watery", "thin", "runny", "separated", "separates", "oil slick"],
    type: "complaint",
  },
  {
    key: "bland",
    label: "Bland / low umami",
    terms: ["bland", "flat", "boring", "no flavor", "lack flavor", "needs umami"],
    type: "complaint",
  },
  {
    key: "chemical",
    label: "Artificial or chemical aftertaste",
    terms: ["chemical", "artificial", "aftertaste", "fake", "metallic"],
    type: "complaint",
  },
  {
    key: "packaging_leak",
    label: "Leaking bottle / cap",
    terms: ["leak", "leaked", "leaking", "cap", "seal", "lid", "bottle broke", "broken bottle", "mess"],
    type: "packaging",
  },
  {
    key: "hard_to_pour",
    label: "Hard to pour or dose",
    terms: ["hard to pour", "pours too fast", "too much comes out", "squeeze", "drip", "messy"],
    type: "packaging",
  },
  {
    key: "garlic_umami",
    label: "Garlic / umami demand",
    terms: ["garlic", "umami", "savory", "rich", "miso", "mushroom"],
    type: "trend",
  },
  {
    key: "chili_crisp",
    label: "Chili crisp / crunchy oil language",
    terms: ["chili crisp", "chile crisp", "crunchy", "crispy", "chili oil", "crunch"],
    type: "trend",
  },
  {
    key: "citrus_bright",
    label: "Citrus / bright finish",
    terms: ["citrus", "lime", "lemon", "bright", "fresh", "tangy", "acid"],
    type: "trend",
  },
  {
    key: "subscription_use",
    label: "Daily-driver repeat use",
    terms: ["every day", "daily", "goes on everything", "finished the bottle", "staple", "pantry"],
    type: "trend",
  },
];

const SPICE_RULES = [
  { key: "mild", label: "Mild", terms: ["mild", "not spicy", "barely spicy", "no heat"] },
  { key: "medium", label: "Medium", terms: ["medium", "balanced heat", "warm", "kick", "little heat"] },
  { key: "hot", label: "Hot", terms: ["hot", "spicy", "fiery", "burn", "heat"] },
  { key: "extra_hot", label: "Extra hot", terms: ["extra hot", "super hot", "too spicy", "painful", "face melting"] },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value) {
  return normalizeText(value).toLowerCase();
}

function sentenceSplit(text) {
  return normalizeText(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 18);
}

function containsAny(text, terms) {
  return terms.some((term) => termRegex(term).test(text));
}

function termRegex(term) {
  const escaped = term
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "NoodleBombFlavorResearch/1.0 market-research contact:mike@gt40marine.com",
      Accept: "application/json,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "NoodleBombFlavorResearch/1.0 market-research contact:mike@gt40marine.com",
      Accept: "text/html,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.text();
}

async function fetchReddit(config) {
  const rows = [];
  const reddit = config.reddit ?? {};
  const subreddits = reddit.subreddits ?? [];
  const queries = reddit.queries ?? [];
  const sort = reddit.sort ?? "relevance";
  const time = reddit.time ?? "year";
  const limit = reddit.limitPerQuery ?? 25;

  for (const subreddit of subreddits) {
    for (const query of queries) {
      const url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/search.json?${new URLSearchParams({
        q: query,
        restrict_sr: "1",
        sort,
        t: time,
        limit: String(limit),
      })}`;
      try {
        const json = await fetchJson(url);
        for (const child of json?.data?.children ?? []) {
          const data = child.data ?? {};
          const text = normalizeText(`${data.title ?? ""}. ${data.selftext ?? ""}`);
          if (!text || text.length < 30) continue;
          rows.push({
            source: "reddit",
            sourceLabel: `r/${subreddit}`,
            query,
            title: data.title ?? "",
            text,
            url: data.permalink ? `https://www.reddit.com${data.permalink}` : url,
            score: data.score ?? 0,
            createdUtc: data.created_utc ?? null,
          });
        }
      } catch (error) {
        rows.push({
          source: "fetch_error",
          sourceLabel: `r/${subreddit}`,
          query,
          title: "Fetch error",
          text: String(error.message ?? error),
          url,
          score: 0,
          createdUtc: null,
        });
      }
    }
  }
  return dedupeRows(rows);
}

function readLocalInputs(paths) {
  const rows = [];
  for (const inputPath of paths ?? []) {
    const full = path.resolve(ROOT, inputPath);
    if (!fs.existsSync(full)) continue;
    const files = fs.statSync(full).isDirectory()
      ? fs.readdirSync(full).map((file) => path.join(full, file))
      : [full];
    for (const file of files) {
      if (!fs.statSync(file).isFile()) continue;
      const ext = path.extname(file).toLowerCase();
      if (ext === ".json") rows.push(...readJsonInput(file));
      if (ext === ".csv") rows.push(...readCsvInput(file));
      if (ext === ".txt" || ext === ".md") rows.push(...readTextInput(file));
    }
  }
  return rows;
}

function readJsonInput(file) {
  const raw = readJson(file, []);
  const items = Array.isArray(raw) ? raw : raw.reviews || raw.items || [];
  return items.map((item, idx) => ({
    source: item.source ?? "local",
    sourceLabel: item.sourceLabel ?? path.basename(file),
    query: "local-export",
    title: item.title ?? item.summary ?? `Local review ${idx + 1}`,
    text: normalizeText(item.text ?? item.body ?? item.review ?? item.content ?? JSON.stringify(item)),
    url: item.url ?? "",
    score: Number(item.rating ?? item.score ?? 0),
    createdUtc: item.createdUtc ?? null,
  }));
}

function readCsvInput(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsv(lines.shift()).map((h) => h.trim().toLowerCase());
  return lines.map((line, idx) => {
    const values = splitCsv(line);
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
    return {
      source: row.source || "local",
      sourceLabel: row.sourcelabel || row.product || path.basename(file),
      query: "local-export",
      title: row.title || row.summary || `CSV review ${idx + 1}`,
      text: normalizeText(row.text || row.body || row.review || row.content || line),
      url: row.url || "",
      score: Number(row.rating || row.score || 0),
      createdUtc: null,
    };
  });
}

function readTextInput(file) {
  const chunks = fs.readFileSync(file, "utf8").split(/\n\s*\n/);
  return chunks
    .map((chunk, idx) => normalizeText(chunk))
    .filter((chunk) => chunk.length > 20)
    .map((text, idx) => ({
      source: "local",
      sourceLabel: path.basename(file),
      query: "local-text",
      title: `Text note ${idx + 1}`,
      text,
      url: "",
      score: 0,
      createdUtc: null,
    }));
}

async function fetchCompetitorUrls(urls) {
  const rows = [];
  for (const url of urls ?? []) {
    try {
      const html = await fetchText(url);
      const text = normalizeText(
        html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&"),
      );
      rows.push({
        source: "competitor-url",
        sourceLabel: new URL(url).hostname,
        query: "competitor-url",
        title: new URL(url).hostname,
        text,
        url,
        score: 0,
        createdUtc: null,
      });
    } catch (error) {
      rows.push({
        source: "fetch_error",
        sourceLabel: url,
        query: "competitor-url",
        title: "Fetch error",
        text: String(error.message ?? error),
        url,
        score: 0,
        createdUtc: null,
      });
    }
  }
  return rows;
}

function splitCsv(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') {
      cur += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function dedupeRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = compactText(`${row.title} ${row.text}`).slice(0, 260);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function analyze(rows) {
  const usable = rows.filter((row) => row.source !== "fetch_error" && row.text.length > 20);
  const quoteRows = [];
  const topics = TOPIC_RULES.map((rule) => {
    const matches = [];
    for (const row of usable) {
      const text = compactText(row.text);
      if (!containsAny(text, rule.terms)) continue;
      const quote = bestSentence(row.text, rule.terms);
      matches.push({ ...row, quote });
      quoteRows.push({ topic: rule.label, type: rule.type, quote, source: row.sourceLabel, url: row.url });
    }
    return {
      key: rule.key,
      label: rule.label,
      type: rule.type,
      count: matches.length,
      examples: matches
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 8)
        .map((item) => ({ quote: item.quote, source: item.sourceLabel, url: item.url, score: item.score })),
    };
  }).sort((a, b) => b.count - a.count);

  const spice = SPICE_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    count: usable.filter((row) => containsAny(compactText(row.text), rule.terms)).length,
    examples: usable
      .filter((row) => containsAny(compactText(row.text), rule.terms))
      .slice(0, 5)
      .map((row) => ({ quote: bestSentence(row.text, rule.terms), source: row.sourceLabel, url: row.url })),
  })).sort((a, b) => b.count - a.count);

  const phrases = topPhrases(usable.map((row) => row.text).join(" "), 120);
  const wording = phrases.filter((item) => isUsefulCustomerPhrase(item.phrase)).slice(0, 40);

  const recommendations = makeRecommendations(topics, spice, wording);
  return {
    generatedAt: new Date().toISOString(),
    stats: {
      totalRows: rows.length,
      usableRows: usable.length,
      fetchErrors: rows.filter((row) => row.source === "fetch_error").length,
      redditRows: rows.filter((row) => row.source === "reddit").length,
      localRows: rows.filter((row) => row.source === "local").length,
      competitorRows: rows.filter((row) => row.source === "competitor-url").length,
    },
    topics,
    spice,
    wording,
    recommendations,
    quotes: quoteRows.slice(0, 250),
    fetchErrors: rows.filter((row) => row.source === "fetch_error"),
  };
}

function bestSentence(text, terms) {
  const sentences = sentenceSplit(text);
  const match = sentences.find((sentence) => containsAny(compactText(sentence), terms));
  return (match || sentences[0] || normalizeText(text)).slice(0, 280);
}

function topPhrases(text, limit) {
  const words = compactText(text)
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
  const counts = new Map();
  for (let n = 2; n <= 4; n += 1) {
    for (let i = 0; i <= words.length - n; i += 1) {
      const phrase = words.slice(i, i + n).join(" ");
      if (phrase.length < 7) continue;
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([phrase, count]) => ({ phrase, count }))
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
    .slice(0, limit);
}

function isUsefulCustomerPhrase(phrase) {
  if (/\b(review|quick notes|notes|http|comment|post|reddit|would love|looking for)\b/i.test(phrase)) return false;
  if (/\bquick\b/i.test(phrase)) return false;
  return /(spicy|heat|salty|sweet|umami|garlic|chili|soy|sauce|noodle|ramen|bottle|cap|leak|pour|flavor|taste|citrus|miso|crisp|oil|pantry|every)/i.test(
    phrase,
  );
}

function makeRecommendations(topics, spice, wording) {
  const topComplaints = topics.filter((topic) => topic.type === "complaint" && topic.count > 0).slice(0, 5);
  const topPackaging = topics.filter((topic) => topic.type === "packaging" && topic.count > 0).slice(0, 3);
  const topTrends = topics.filter((topic) => topic.type === "trend" && topic.count > 0).slice(0, 5);
  const idealSpice = spice[0]?.label ?? "Medium";
  return {
    product: [
      `Tune the lead sauce toward ${idealSpice.toLowerCase()} heat language unless owned data says otherwise.`,
      ...topComplaints.map((topic) => `Address "${topic.label}" directly in formulation or PDP copy.`),
      ...topTrends.map((topic) => `Lean into trend: ${topic.label}.`),
    ].slice(0, 8),
    packaging: topPackaging.length
      ? topPackaging.map((topic) => `QA packaging issue: ${topic.label}. Add packaging proof point if solved.`)
      : ["Keep monitoring bottle/cap/leak language; no dominant packaging issue found in this sample."],
    copy: wording.slice(0, 12).map((item) => item.phrase),
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function renderMarkdown(analysis) {
  const lines = [];
  lines.push("# NoodleBomb Flavor Review Analyzer");
  lines.push("");
  lines.push(`Generated: ${analysis.generatedAt}`);
  lines.push("");
  lines.push("## Source Count");
  lines.push("");
  lines.push(`- Total rows: ${analysis.stats.totalRows}`);
  lines.push(`- Usable rows: ${analysis.stats.usableRows}`);
  lines.push(`- Reddit rows: ${analysis.stats.redditRows}`);
  lines.push(`- Local rows: ${analysis.stats.localRows}`);
  lines.push(`- Competitor URL rows: ${analysis.stats.competitorRows}`);
  lines.push(`- Fetch errors: ${analysis.stats.fetchErrors}`);
  lines.push("");
  lines.push("## Recurring Complaints / Trends");
  lines.push("");
  lines.push("| Rank | Theme | Type | Mentions | Example |");
  lines.push("|---:|---|---|---:|---|");
  analysis.topics.slice(0, 16).forEach((topic, idx) => {
    lines.push(
      `| ${idx + 1} | ${topic.label} | ${topic.type} | ${topic.count} | ${topic.examples[0] ? topic.examples[0].quote.replace(/\|/g, "/") : ""} |`,
    );
  });
  lines.push("");
  lines.push("## Ideal Spice Signal");
  lines.push("");
  analysis.spice.forEach((item) => lines.push(`- ${item.label}: ${item.count} mentions`));
  lines.push("");
  lines.push("## Customer Wording To Steal Ethically");
  lines.push("");
  analysis.wording.slice(0, 25).forEach((item) => lines.push(`- "${item.phrase}" (${item.count})`));
  lines.push("");
  lines.push("## Recommendations");
  lines.push("");
  lines.push("Product:");
  analysis.recommendations.product.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("Packaging:");
  analysis.recommendations.packaging.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("Copy hooks:");
  analysis.recommendations.copy.forEach((item) => lines.push(`- ${item}`));
  return `${lines.join("\n")}\n`;
}

function renderHtml(analysis) {
  const topicCards = analysis.topics
    .slice(0, 18)
    .map(
      (topic) => `
      <article class="card">
        <div class="eyebrow">${escapeHtml(topic.type)} · ${topic.count} mentions</div>
        <h2>${escapeHtml(topic.label)}</h2>
        <p>${escapeHtml(topic.examples[0]?.quote ?? "No example captured.")}</p>
      </article>`,
    )
    .join("");
  const wording = analysis.wording
    .slice(0, 36)
    .map((item) => `<span>${escapeHtml(item.phrase)} <b>${item.count}</b></span>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NoodleBomb Flavor Review Analyzer</title>
  <style>
    body{margin:0;background:#130f0b;color:#fff6e8;font-family:Arial,Helvetica,sans-serif}
    header{padding:34px 26px;background:#1f140d;border-bottom:1px solid #3a2618}
    h1{margin:0;font-size:30px}.sub{color:#d8b98f;margin-top:8px}
    section{padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px}
    .card{background:#21160f;border:1px solid #4b2e18;border-radius:8px;padding:16px}
    .eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#ff9a3c}
    h2{font-size:18px;margin:8px 0 10px}.card p{color:#ead8c1;line-height:1.45}
    .chips{display:flex;gap:8px;flex-wrap:wrap}.chips span{background:#2c1c12;border:1px solid #5b351d;border-radius:999px;padding:7px 10px;color:#f4dbc0}
    .metrics{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.metrics div{background:#2b1b12;border-radius:8px;padding:12px 14px}
    b{color:#ffd08b}
  </style>
</head>
<body>
  <header>
    <h1>NoodleBomb Flavor Review Analyzer</h1>
    <div class="sub">${analysis.stats.usableRows} usable rows · ${analysis.stats.redditRows} Reddit · ${analysis.stats.localRows} local · generated ${new Date(analysis.generatedAt).toLocaleString()}</div>
    <div class="metrics">
      <div><b>${analysis.topics[0]?.label ?? "No theme"}</b><br/>top signal</div>
      <div><b>${analysis.spice[0]?.label ?? "Unknown"}</b><br/>spice language</div>
      <div><b>${analysis.stats.fetchErrors}</b><br/>fetch errors</div>
    </div>
  </header>
  <section>
    <h2>Recurring Signals</h2>
    <div class="grid">${topicCards}</div>
  </section>
  <section>
    <h2>Customer Wording</h2>
    <div class="chips">${wording}</div>
  </section>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function writeCsv(quotes) {
  const headers = ["topic", "type", "quote", "source", "url"];
  const rows = quotes.map((quote) => headers.map((header) => csvEscape(quote[header])).join(","));
  return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

async function main() {
  ensureDir(OUT_DIR);
  const config = readJson(CONFIG_PATH, {});
  const offline = process.argv.includes("--offline");
  const rows = [
    ...(offline ? [] : await fetchReddit(config)),
    ...readLocalInputs(config.localReviewInputs),
    ...(offline ? [] : await fetchCompetitorUrls(config.competitorUrls)),
  ];
  const analysis = analyze(dedupeRows(rows));
  fs.writeFileSync(JSON_OUT, JSON.stringify(analysis, null, 2));
  fs.writeFileSync(MD_OUT, renderMarkdown(analysis));
  fs.writeFileSync(HTML_OUT, renderHtml(analysis));
  fs.writeFileSync(CSV_OUT, writeCsv(analysis.quotes));
  console.log(
    JSON.stringify(
      {
        ok: true,
        stats: analysis.stats,
        outputs: { json: JSON_OUT, markdown: MD_OUT, html: HTML_OUT, csv: CSV_OUT },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
