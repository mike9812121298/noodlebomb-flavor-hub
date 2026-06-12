/* PWC Lab demo data — values match the design sheet exactly. */

export const ASSETS = "/pwclab/assets";

export const ski = {
  name: "2024 RXP-X 325",
  make: "Sea-Doo",
  model: "RXP-X 325",
  engine: "1.6L ACE-325 SC",
  engineHours: 52.3,
  lastRide: "May 18",
  topSpeed: 81.4,
  zeroSixty: 4.38,
  longestRide: 42.6,
  modsInstalled: 8,
  stage: "STAGE 2",
  photo: `${ASSETS}/ski-rxpx-red.png`,
};

export const leaderboardRows = [
  { rank: 1, initials: "MM", name: "Mike M.", tag: "#FULLSEND", badges: ["gold-1", "red-80"], where: "Lake Havasu, AZ · May 12", value: "84.3" },
  { rank: 2, initials: "JP", name: "Jason P.", tag: "#BOOSTED", badges: [], where: "Phoenix, AZ · May 9", value: "84.1" },
  { rank: 3, initials: "RT", name: "Ryan T.", tag: null, badges: [], where: "Parker, AZ · May 18", value: "83.9" },
  { rank: 4, initials: "TB", name: "Tommy B.", tag: "#LAKELIFE", badges: ["white-mi"], where: "Lake Havasu City, AZ · May 11", value: "83.7" },
  { rank: 5, initials: "BL", name: "Brandon L.", tag: null, badges: [], where: "Needles, CA · May 7", value: "83.5" },
  { rank: 6, initials: "KH", name: "Kevin H.", tag: "#NOLIFT", badges: ["green-0-50"], where: "Mesa, AZ · May 3", value: "83.2" },
] as const;

export const records = [
  { title: "Fastest GTX 300", holder: "Michael M. · Apr 28, 2024", value: "79.8" },
  { title: "Fastest RXT-X 300", holder: "Jason P. · May 2, 2024", value: "82.1" },
  { title: "Fastest RXP-X 325", holder: "Mike M. · May 12, 2024", value: "84.3" },
  { title: "Fastest Yamaha SVHO", holder: "Chris R. · May 10, 2024", value: "83.5" },
  { title: "Fastest Spark", holder: "Tommy B. · Apr 30, 2024", value: "61.2" },
] as const;

export const mods = [
  { name: "GT40 Stage 2 Kit", installed: "Installed Apr 10, 2024", gain: "+2.2 MPH", gainColor: "#3DDC84", note: "peak gain", img: `${ASSETS}/product-stage1.png` },
  { name: "GT40 Carbon Intake", installed: "Installed Mar 20, 2024", gain: "+1.4 MPH", gainColor: "#3DDC84", note: "peak gain", img: `${ASSETS}/product-carbon-intake.jpeg` },
  { name: "GT40 ECM Flash", installed: "Installed Mar 2, 2024", gain: "+1.2 MPH", gainColor: "#3DDC84", note: "peak gain", img: `${ASSETS}/product-gt40-ecm.png` },
  { name: "GT40 Catch Can", installed: "Installed Feb 15, 2024", gain: "RELIABILITY", gainColor: "#3EA8EF", note: "", img: `${ASSETS}/product-catch-can.png` },
] as const;

export const onboardingParts = [
  { name: "Intake", tag: "AIRFLOW", checked: true },
  { name: "Exhaust", tag: "FLOW", checked: true },
  { name: "ECM tune / flash", tag: "POWER", checked: true },
  { name: "Catch can", tag: "RELIABILITY", checked: true },
  { name: "Intercooler", tag: "COOLING", checked: false },
  { name: "Intercooler tubing / BOV", tag: "BOOST", checked: false },
  { name: "Supercharger wheel", tag: "BOOST", checked: false },
  { name: "Ribbon delete", tag: "FLOW", checked: false },
  { name: "Retainers", tag: "VALVETRAIN", checked: false },
  { name: "Waterbox", tag: "EXHAUST", checked: false },
  { name: "Impeller / wear ring", tag: "THRUST", checked: false },
] as const;

export const maintenanceSchedule = [
  { name: "Pump oil", due: "due in 22.7 engine hrs", dueColor: "#FFC53D", done: false },
  { name: "Spark plugs", due: "due in 27.7 engine hrs", dueColor: "#8A8A8A", done: false },
  { name: "Wear ring inspection", due: "due in 32.7 engine hrs", dueColor: "#8A8A8A", done: false },
  { name: "Supercharger rebuild", due: "due in 47.7 engine hrs", dueColor: "#8A8A8A", done: false },
  { name: "Anodes", due: "replaced 2.3 hrs ago — OK", dueColor: "#3DDC84", done: true },
] as const;

export const badges = [
  { glyph: "1", tint: "gold", title: "Top Gun", desc: "Hold #1 top speed on any board", status: { kind: "holder", text: "MIKE M.\nHOLDS IT" } },
  { glyph: "80+", tint: "red", title: "80 Club", desc: "GPS-verified run over 80 mph", status: { kind: "earned", text: "Earned" } },
  { glyph: "0-50", tint: "green", title: "Holeshot", desc: "Best 0–50 on your lake this month", status: { kind: "holder", text: "0.08 SEC\nBEHIND" } },
  { glyph: "¼", tint: "red", title: "Quarter King", desc: "Fastest ¼ mile on your lake", status: { kind: "holder", text: "JASON P.\nHOLDS IT" } },
  { glyph: "MI", tint: "white", title: "Iron Rider", desc: "Longest single ride on your lake", status: { kind: "earned", text: "Earned · 42.6 mi" } },
  { glyph: "HRS", tint: "white", title: "Hour Hog", desc: "Most engine hours this season", status: { kind: "holder", text: "7.2 HRS\nBEHIND" } },
  { glyph: "REC", tint: "gold", title: "Record Holder", desc: "Holds an active lake record", status: { kind: "earned", text: "Earned · Lake Tapps" } },
  { glyph: "7X", tint: "blue", title: "Streak", desc: "Ride seven weekends in a row", status: { kind: "holder", text: "WK 5 OF 7" } },
] as const;

export const products = {
  intercooler: { name: "GT40 Intercooler", img: `${ASSETS}/product-intercooler-tubing.png` },
  rearExhaust: { name: "GT40 Rear Exhaust", img: `${ASSETS}/product-gt40-exhaust.jpg` },
  catchCan: { name: "GT40 Catch Can", img: `${ASSETS}/product-catch-can.png` },
  ecm: { name: "GT40 ECM Flash", img: `${ASSETS}/product-gt40-ecm.png` },
  serviceKit: { name: "Throttle body service kit", img: `${ASSETS}/product-ecm.png` },
} as const;

export const GT40_URL = "https://gt40marine.com";
