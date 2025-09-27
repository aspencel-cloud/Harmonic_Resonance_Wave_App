import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const CSV_PATH = path.resolve(process.cwd(), "public", "data", "decans.csv");
if (!fs.existsSync(CSV_PATH)) {
  console.error("ERROR: decans.csv not found at", CSV_PATH);
  process.exit(1);
}
const text = fs.readFileSync(CSV_PATH, "utf8");
const parsed = Papa.parse(text, {
  header: true,
  skipEmptyLines: true,
  delimiter: "",
  transformHeader: (h) => (h || "").replace(/^\uFEFF/, "").trim(),
});
if (parsed.errors?.length) {
  console.error("CSV parse error:", parsed.errors[0]);
  process.exit(1);
}
const decans = parsed.data.map(nr);

function nr(raw) {
  const dn = Number(String(raw.decan_number).trim());
  return {
    sign: (raw.sign || "").trim(),
    decan_number: dn,
    title: (raw.title || "").trim(),
    ruler: (raw.ruler || "").trim(),
    sub_sign: (raw.sub_sign || "").trim(),
    spark: (raw.spark || "").trim(),
    deep_insight: (raw.deep_insight || "").trim(),
    poetic: (raw.poetic || "").trim(),
    influential_waves_a: (
      raw.influential_waves_a ??
      raw.influential_waves ??
      ""
    ).trim(),
  };
}

function getDecan(sign, deg) {
  const n = deg < 10 ? 1 : deg < 20 ? 2 : 3;
  return decans.find(
    (d) => d.sign.toLowerCase() === sign.toLowerCase() && d.decan_number === n
  );
}
function parseWaves(field) {
  if (!field) return [];
  if (/all\s*10/i.test(field)) return "All 10";
  return field
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}
function trimInsight(t, n = 3) {
  if (!t) return "";
  const parts = t.match(/[^.!?]+[.!?]+|\S+$/g) || [t];
  return parts.slice(0, n).join(" ").trim();
}

function logCase(label, sign, deg) {
  const d = getDecan(sign, deg);
  if (!d) {
    console.log(`${label}: NOT FOUND\n`);
    return;
  }
  console.log(`${label}: ${sign} ${deg}°`);
  console.log(`  Decan: ${d.sign} ${d.decan_number} — ${d.title}`);
  console.log(`  Spark: ${d.spark}`);
  console.log(`  Deep : ${trimInsight(d.deep_insight, 3)}`);
  console.log(`  Poetic: ${d.poetic}`);
  console.log(`  Chips: ${parseWaves(d.influential_waves_a)}\n`);
}

logCase("Case A (Leo 19°)", "Leo", 19);
logCase("Case B (Aries 4°)", "Aries", 4);
logCase("Case C (Taurus 27°)", "Taurus", 27);
