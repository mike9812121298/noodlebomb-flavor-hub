const STORAGE_KEY = "noodlebomb.retailOutreachCrm.v2";

const columns = [
  "store",
  "contact",
  "title",
  "email",
  "phone",
  "category",
  "region",
  "employeeCount",
  "storeCount",
  "adjacentBrands",
  "status",
  "outreachDate",
  "sampleSent",
  "sampleDate",
  "sampleFollowUpDate",
  "sampleSecondFollowUpDate",
  "followUpStatus",
  "firstOrderDate",
  "reorder30Date",
  "reorder60Date",
  "reorder90Date",
  "nextAction",
  "nextActionDate",
  "tier",
  "priority",
  "source",
  "dnc",
  "notes",
];

const categories = [
  "Specialty Grocery",
  "Co-op",
  "Asian Grocery",
  "Premium Pantry",
  "Natural Grocery",
  "Distributor",
  "Major Specialty Chain",
  "Other",
];

const statuses = [
  "Prospect",
  "Contacted",
  "Sample Sent",
  "Follow Up",
  "Buyer Reply",
  "First Order",
  "Reorder",
  "Passed",
];

const followUpStatuses = ["Not started", "Due", "Waiting", "Replied", "Closed"];
const tierRank = { "Tier A": 0, "Tier B": 1, "Tier C": 2 };
const priorityRank = { High: 0, Medium: 1, Low: 2 };
const dayMs = 24 * 60 * 60 * 1000;

let records = migrateRecords(loadRecords());

const $ = (id) => document.getElementById(id);

function loadRecords() {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    const rawV1 = localStorage.getItem("noodlebomb.retailOutreachCrm.v1");
    const raw = rawV2 || rawV1;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addDays(value, days) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysSince(value) {
  if (!value) return null;
  const target = new Date(`${value}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  return Math.floor((new Date(`${todayIso()}T00:00:00`).getTime() - target.getTime()) / dayMs);
}

function fillSelect(select, values, allLabel = "") {
  select.innerHTML = "";
  if (allLabel) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = allLabel;
    select.append(option);
  }
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function hydrateSelects() {
  fillSelect($("category"), categories);
  fillSelect($("status"), statuses);
  fillSelect($("followUpStatus"), followUpStatuses);
  fillSelect($("categoryFilter"), categories, "All categories");
  fillSelect($("statusFilter"), statuses, "All stages");
  fillSelect($("tierFilter"), ["Tier A", "Tier B", "Tier C"], "All tiers");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

function isWithinNextSevenDays(value) {
  if (!value) return false;
  const diff = new Date(`${value}T00:00:00`).getTime() - new Date(`${todayIso()}T00:00:00`).getTime();
  return diff >= 0 && diff <= 7 * dayMs;
}

function isOverdue(value) {
  if (!value) return false;
  return new Date(`${value}T00:00:00`) < new Date(`${todayIso()}T00:00:00`);
}

function getFormData() {
  const data = {};
  columns.forEach((key) => {
    const element = $(key);
    if (element) data[key] = element.value.trim();
  });
  return data;
}

function setFormData(record = {}) {
  $("recordId").value = record.id || "";
  columns.forEach((key) => {
    const element = $(key);
    if (element) element.value = record[key] || "";
  });
  if (!record.id) {
    $("category").value = "Specialty Grocery";
    $("status").value = "Prospect";
    $("sampleSent").value = "No";
    $("followUpStatus").value = "Not started";
    $("priority").value = "Medium";
    $("tier").value = "Tier B";
    $("dnc").value = "No";
  }
}

function numberValue(value) {
  const parsed = Number.parseInt(String(value || "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function scoreStore(record) {
  const stores = numberValue(record.storeCount);
  const employees = numberValue(record.employeeCount);
  const category = String(record.category || "").toLowerCase();
  let score = 0;

  if (stores >= 10) score += 4;
  else if (stores >= 3) score += 2;
  else if (stores >= 1) score += 1;

  if (employees >= 500) score += 4;
  else if (employees >= 75) score += 2;
  else if (employees >= 1) score += 1;

  if (category.includes("major") || category.includes("distributor")) score += 4;
  if (category.includes("co-op") || category.includes("specialty") || category.includes("natural")) score += 2;
  if (String(record.adjacentBrands || "").trim()) score += 1;

  if (score >= 7) return "Tier A";
  if (score >= 3) return "Tier B";
  return "Tier C";
}

function enrichRecord(record) {
  const next = { ...record };
  if (!next.id) next.id = makeId();
  if (!next.sampleSent) next.sampleSent = "No";
  if (!next.status) next.status = "Prospect";
  if (!next.followUpStatus) next.followUpStatus = "Not started";
  if (!next.priority) next.priority = "Medium";
  if (!next.dnc) next.dnc = "No";

  if (next.sampleSent === "Yes" || next.status === "Sample Sent") {
    next.sampleSent = "Yes";
    if (!next.sampleDate) next.sampleDate = todayIso();
    next.sampleFollowUpDate = addDays(next.sampleDate, 7);
    next.sampleSecondFollowUpDate = addDays(next.sampleDate, 14);
    if (!next.nextActionDate) next.nextActionDate = next.sampleFollowUpDate;
    if (!next.nextAction) next.nextAction = "Ask for sample feedback";
  } else {
    next.sampleFollowUpDate = "";
    next.sampleSecondFollowUpDate = "";
  }

  if (next.status === "First Order" || next.status === "Reorder") {
    const hadSampleAction = next.nextAction === "Ask for sample feedback";
    if (!next.firstOrderDate) next.firstOrderDate = todayIso();
    next.reorder30Date = addDays(next.firstOrderDate, 30);
    next.reorder60Date = addDays(next.firstOrderDate, 60);
    next.reorder90Date = addDays(next.firstOrderDate, 90);
    if (!next.nextAction || hadSampleAction) next.nextAction = "Send reorder nudge";
    if (
      !next.nextActionDate ||
      hadSampleAction ||
      next.nextActionDate === next.sampleFollowUpDate ||
      next.nextActionDate === next.sampleSecondFollowUpDate
    ) {
      next.nextActionDate = next.reorder30Date;
    }
  } else if (!next.firstOrderDate) {
    next.reorder30Date = "";
    next.reorder60Date = "";
    next.reorder90Date = "";
  }

  next.tier = scoreStore(next);
  if (next.tier === "Tier A") next.priority = "High";
  if (next.tier === "Tier C" && next.priority === "High") next.priority = "Medium";
  return next;
}

function migrateRecords(items) {
  return Array.isArray(items) ? items.map((record) => enrichRecord(record)) : [];
}

function passesFilters(record) {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const status = $("statusFilter").value;
  const sample = $("sampleFilter").value;
  const tier = $("tierFilter").value;
  const haystack = columns.map((key) => record[key]).join(" ").toLowerCase();
  return (
    (!query || haystack.includes(query)) &&
    (!category || record.category === category) &&
    (!status || record.status === status) &&
    (!sample || record.sampleSent === sample) &&
    (!tier || record.tier === tier)
  );
}

function sortedRows() {
  return [...records].filter(passesFilters).sort((a, b) => {
    const aDate = a.nextActionDate || "9999-12-31";
    const bDate = b.nextActionDate || "9999-12-31";
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    if ((tierRank[a.tier] ?? 9) !== (tierRank[b.tier] ?? 9)) return (tierRank[a.tier] ?? 9) - (tierRank[b.tier] ?? 9);
    return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
  });
}

function sampleColdRecords() {
  return records.filter((record) => {
    if (record.sampleSent !== "Yes" || ["Replied", "Closed"].includes(record.followUpStatus)) return false;
    return isOverdue(record.sampleFollowUpDate) || isOverdue(record.sampleSecondFollowUpDate);
  });
}

function reorderCandidates() {
  const checkpoints = [
    ["30d", "reorder30Date"],
    ["60d", "reorder60Date"],
    ["90d", "reorder90Date"],
  ];
  return records.flatMap((record) => {
    if (!record.firstOrderDate) return [];
    return checkpoints
      .filter(([, key]) => isOverdue(record[key]) || isWithinNextSevenDays(record[key]))
      .map(([label, key]) => ({ record, label, date: record[key] }));
  });
}

function renderMetrics() {
  $("totalStores").textContent = records.length;
  $("dueSoon").textContent = records.filter((record) => isWithinNextSevenDays(record.nextActionDate)).length;
  $("samplesCold").textContent = sampleColdRecords().length;
  $("reorderDue").textContent = reorderCandidates().length;
  $("tierAStores").textContent = records.filter((record) => record.tier === "Tier A").length;
}

function renderAutomationList(targetId, items, emptyText, type) {
  const target = $(targetId);
  target.innerHTML = "";
  if (!items.length) {
    target.innerHTML = `<p class="empty-inline">${escapeHtml(emptyText)}</p>`;
    return;
  }

  items.slice(0, 8).forEach((item) => {
    const record = item.record || item;
    const detail = item.label ? `${item.label} checkpoint - ${formatDate(item.date)}` : `Sample sent ${formatDate(record.sampleDate)}`;
    const card = document.createElement("article");
    card.className = "automation-card";
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(record.store)}</strong>
        <p>${escapeHtml(detail)}</p>
        <span class="pill ${record.tier === "Tier A" ? "hot" : ""}">${escapeHtml(record.tier)}</span>
      </div>
      <button class="ghost" type="button" data-action="${type}" data-id="${record.id}">Draft</button>
    `;
    target.append(card);
  });
}

function renderAutomation() {
  renderAutomationList("coldSamplesList", sampleColdRecords(), "No cold samples right now.", "draft-sample");
  renderAutomationList("reorderList", reorderCandidates(), "No reorder nudges due right now.", "draft-reorder");
}

function renderRows() {
  const tbody = $("crmRows");
  const template = $("rowTemplate");
  const rows = sortedRows();
  tbody.innerHTML = "";

  rows.forEach((record) => {
    const row = template.content.firstElementChild.cloneNode(true);
    const cells = row.querySelectorAll("td");
    const nextDate = formatDate(record.nextActionDate);
    const dueClass = isOverdue(record.nextActionDate) || isWithinNextSevenDays(record.nextActionDate) ? "hot" : "";
    const sampleDates = record.sampleSent === "Yes"
      ? `7d ${formatDate(record.sampleFollowUpDate)} / 14d ${formatDate(record.sampleSecondFollowUpDate)}`
      : "No sample";
    const reorderDates = record.firstOrderDate
      ? `30d ${formatDate(record.reorder30Date)} / 60d ${formatDate(record.reorder60Date)} / 90d ${formatDate(record.reorder90Date)}`
      : "No first order";

    cells[0].innerHTML = `<strong>${escapeHtml(record.store)}</strong><div class="muted">${escapeHtml(record.region)}</div><span class="pill ${record.tier === "Tier A" ? "hot" : ""}">${escapeHtml(record.tier)}</span>`;
    cells[1].innerHTML = `${escapeHtml(record.contact)}<div class="muted">${escapeHtml(record.title)}</div><div class="muted">${escapeHtml(record.email)}</div>`;
    cells[2].innerHTML = `<span class="pill">${escapeHtml(record.category)}</span><div class="muted">${escapeHtml(record.adjacentBrands)}</div>`;
    cells[3].innerHTML = `<span class="pill">${escapeHtml(record.status)}</span><div class="muted">${formatDate(record.outreachDate)}</div>`;
    cells[4].innerHTML = `<span class="pill">${escapeHtml(record.sampleSent || "No")}</span><div class="muted">${sampleDates}</div>`;
    cells[5].innerHTML = `<span class="pill">${escapeHtml(record.followUpStatus)}</span><div class="muted">${escapeHtml(record.priority)}</div>`;
    cells[6].innerHTML = `<strong>${escapeHtml(record.nextAction)}</strong><div class="pill ${dueClass}">${nextDate || "No date"}</div><div class="muted">${reorderDates}</div>`;
    cells[7].innerHTML = `
      <button class="ghost" type="button" data-action="edit" data-id="${record.id}">Edit</button>
      <button class="ghost" type="button" data-action="draft-cold" data-id="${record.id}">Cold draft</button>
      <button class="ghost" type="button" data-action="draft-sample" data-id="${record.id}">Sample draft</button>
      <button class="ghost" type="button" data-action="draft-reorder" data-id="${record.id}">Reorder draft</button>
      <button class="ghost" type="button" data-action="copy" data-id="${record.id}">Copy</button>
      <button class="ghost danger" type="button" data-action="delete" data-id="${record.id}">Delete</button>
    `;
    tbody.append(row);
  });

  $("emptyState").classList.toggle("visible", rows.length === 0);
}

function render() {
  renderMetrics();
  renderAutomation();
  renderRows();
}

function upsertRecord(event) {
  event.preventDefault();
  const id = $("recordId").value || makeId();
  const existingIndex = records.findIndex((record) => record.id === id);
  const nextRecord = enrichRecord({
    id,
    updatedAt: new Date().toISOString(),
    createdAt: records[existingIndex]?.createdAt || new Date().toISOString(),
    ...getFormData(),
  });

  if (existingIndex >= 0) {
    records[existingIndex] = nextRecord;
  } else {
    records.unshift(nextRecord);
  }
  saveRecords();
  setFormData();
  render();
}

function deleteRecord(id) {
  const record = records.find((item) => item.id === id);
  if (!record) return;
  if (!confirm(`Delete ${record.store}?`)) return;
  records = records.filter((item) => item.id !== id);
  saveRecords();
  setFormData();
  render();
}

function subjectFor(record, type) {
  const store = record.store || "your store";
  if (type === "sample") return `Quick sample feedback for ${store}`;
  if (type === "reorder") return `${store} reorder timing`;
  return `${store} - quick NoodleBomb question`;
}

function bodyFor(record, type) {
  const name = record.contact || "there";
  const store = record.store || "your store";
  const context = record.adjacentBrands
    ? `I saw ${store} carries ${record.adjacentBrands}, so NoodleBomb may fit the same premium specialty section.`
    : `I saw ${store} has a strong specialty grocery mix, so NoodleBomb may fit the same shelf set.`;

  if (type === "sample") {
    return `Hi ${name},\n\nQuick check-in on the NoodleBomb samples we sent over.\n\nAny feedback from your team yet? If the flavor fit looks right for ${store}, I can send wholesale case pricing and the current line sheet.\n\nThanks,\nAshley\nNoodleBomb\nhello@noodlebomb.co | noodlebomb.co | 253-486-3445`;
  }

  if (type === "reorder") {
    return `Hi ${name},\n\nWanted to check timing on a NoodleBomb reorder for ${store}.\n\nIf the first case is moving, I can help with a clean reorder mix across Original, Spicy Tokyo, Citrus Shoyu, and the next line additions.\n\nThanks,\nAshley\nNoodleBomb\nhello@noodlebomb.co | noodlebomb.co | 253-486-3445`;
  }

  return `Hi ${name},\n\n${context}\n\nNoodleBomb is a ramen sauce brand built for fast weeknight bowls, rice bowls, eggs, dumplings, and everyday meals. The line is small-batch, made in the USA, and easy for shoppers to understand at shelf.\n\nWould you be open to reviewing samples for ${store}?\n\nThanks,\nAshley\nNoodleBomb\nhello@noodlebomb.co | noodlebomb.co | 253-486-3445`;
}

function showDraft(record, type) {
  const panel = $("draftPanel");
  const warning = record.dnc === "Yes" ? "DNC is set. Do not send unless Mike clears this recipient." : "Draft only. Review and approve per recipient before sending.";
  const subject = subjectFor(record, type);
  const body = bodyFor(record, type);
  $("draftMeta").textContent = `${record.store || "Store"} - ${warning}`;
  $("draftSubject").value = subject;
  $("draftBody").value = body;
  $("draftMailto").href = record.dnc === "Yes" || !record.email
    ? "#"
    : `mailto:${encodeURIComponent(record.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $("draftMailto").classList.toggle("disabled", record.dnc === "Yes" || !record.email);
  panel.classList.add("visible");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const record = records.find((item) => item.id === button.dataset.id);
  if (!record) return;

  if (button.dataset.action === "edit") {
    setFormData(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (button.dataset.action === "copy") {
    const copy = enrichRecord({ ...record, id: makeId(), store: `${record.store} copy`, createdAt: new Date().toISOString() });
    records.unshift(copy);
    saveRecords();
    render();
  }

  if (button.dataset.action === "delete") deleteRecord(record.id);
  if (button.dataset.action === "draft-cold") showDraft(record, "cold");
  if (button.dataset.action === "draft-sample") showDraft(record, "sample");
  if (button.dataset.action === "draft-reorder") showDraft(record, "reorder");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(items) {
  const header = columns.join(",");
  const body = items.map((record) => columns.map((key) => csvEscape(record[key])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") value += char;
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  if (rows.length < 2) return [];
  const headers = rows[0].map((cell) => cell.trim());
  return rows
    .slice(1)
    .filter((cells) => cells.some(Boolean))
    .map((cells) => {
      const record = { id: makeId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      headers.forEach((header, index) => {
        const key = columns.find((column) => column.toLowerCase() === header.toLowerCase());
        if (key) record[key] = cells[index] || "";
      });
      return enrichRecord(record);
    });
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  download(`noodlebomb-retail-crm-${todayIso()}.csv`, toCsv(records), "text/csv;charset=utf-8");
}

function backupJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 2,
    records,
  };
  download(`noodlebomb-retail-crm-backup-${todayIso()}.json`, JSON.stringify(payload, null, 2), "application/json");
}

function readFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result || ""));
  reader.readAsText(file);
}

function importCsv(file) {
  readFile(file, (text) => {
    const imported = parseCsv(text);
    records = [...imported, ...records];
    saveRecords();
    render();
    alert(`Imported ${imported.length} store records.`);
  });
}

function restoreJson(file) {
  readFile(file, (text) => {
    const payload = JSON.parse(text);
    const incoming = Array.isArray(payload) ? payload : payload.records;
    if (!Array.isArray(incoming)) throw new Error("Backup JSON does not contain records.");
    records = migrateRecords(incoming);
    saveRecords();
    render();
    alert(`Restored ${records.length} store records.`);
  });
}

function bindEvents() {
  $("crmForm").addEventListener("submit", upsertRecord);
  $("resetFormButton").addEventListener("click", () => setFormData());
  $("deleteCurrentButton").addEventListener("click", () => {
    const id = $("recordId").value;
    if (id) deleteRecord(id);
  });
  $("crmRows").addEventListener("click", handleTableClick);
  $("coldSamplesList").addEventListener("click", handleTableClick);
  $("reorderList").addEventListener("click", handleTableClick);
  $("searchInput").addEventListener("input", renderRows);
  $("categoryFilter").addEventListener("change", renderRows);
  $("statusFilter").addEventListener("change", renderRows);
  $("sampleFilter").addEventListener("change", renderRows);
  $("tierFilter").addEventListener("change", renderRows);
  $("exportCsvButton").addEventListener("click", exportCsv);
  $("backupJsonButton").addEventListener("click", backupJson);
  $("copyDraftButton").addEventListener("click", async () => {
    const text = `Subject: ${$("draftSubject").value}\n\n${$("draftBody").value}`;
    await navigator.clipboard.writeText(text);
    $("copyDraftButton").textContent = "Copied";
    setTimeout(() => {
      $("copyDraftButton").textContent = "Copy draft";
    }, 1200);
  });
  $("closeDraftButton").addEventListener("click", () => $("draftPanel").classList.remove("visible"));
  $("importCsvInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importCsv(file);
    event.target.value = "";
  });
  $("restoreJsonInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) restoreJson(file);
    event.target.value = "";
  });
  $("clearAllButton").addEventListener("click", () => {
    if (!confirm("Clear all local CRM records from this browser? Export first if you need a backup.")) return;
    records = [];
    saveRecords();
    setFormData();
    render();
  });
}

hydrateSelects();
setFormData();
records = migrateRecords(records);
saveRecords();
bindEvents();
render();
