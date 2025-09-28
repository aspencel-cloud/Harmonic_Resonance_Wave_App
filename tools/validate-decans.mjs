import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));

const CANDIDATES = [
  path.resolve(ROOT, "public", "data", "decans.csv"),
  path.resolve(HERE, "..", "public", "data", "decans.csv"),
];

const CSV_PATH = CANDIDATES.find((p) => fs.existsSync(p));
if (!CSV_PATH) {
  console.error("ERROR: decans.csv not found. Looked in:");
  for (const c of CANDIDATES) console.error(" -", c);
  process.exit(1);
}

const csvText = fs.readFileSync(CSV_PATH, "utf8");

// Parse with auto delimiter + skip empty lines; strip BOM in headers.
const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
  delimiter: "", // auto-detect , ; or \t
  quoteChar: '"',
  escapeChar: '"',
  transformHeader: (h) => (h || "").replace(/^\uFEFF/, "").trim(),
});

if (parsed.errors?.length) {
  console.error("ERROR: CSV parse errors:");
  for (const e of parsed.errors.slice(0, 5))
    console.error(` - ${e.message} (row ${e.row ?? "?"})`);
  process.exit(1);
}

const rows = parsed.data.filter((r) =>
  Object.values(r).some((v) => String(v ?? "").trim() !== "")
); // non-empty rows
const headerKeys = new Set(parsed.meta?.fields?.map((f) => f.trim()) ?? []);
const need = [
  "sign",
  "decan_number",
  "degree_range",
  "title",
  "ruler",
  "spark",
  "deep_insight",
  "poetic",
];
const missing = need.filter((k) => !headerKeys.has(k));

if (missing.length) {
  console.error("ERROR: missing header columns:", missing.join(", "));
  console.error("Found headers:", Array.from(headerKeys).join(", "));
  process.exit(1);
}

// waves column: allow either modern or legacy
if (
  !headerKeys.has("influential_waves_a") &&
  !headerKeys.has("influential_waves")
) {
  console.error(
    "ERROR: need influential_waves_a (preferred) or influential_waves (legacy)"
  );
  process.exit(1);
}

// soft warnings
[
  "sub_sign",
  "structural_tone",
  "field_function",
  "wave_summary",
  "influential_waves_e",
].forEach((c) => {
  if (!headerKeys.has(c)) console.warn("WARN: missing optional column:", c);
});

// Ensure decan_number is 1/2/3
for (let i = 0; i < rows.length; i++) {
  const raw = rows[i].decan_number;
  const n = Number(String(raw).trim());
  if (![1, 2, 3].includes(n)) {
    console.error(
      `ERROR: decan_number must be 1/2/3 at row ${i + 2} (got "${raw}")`
    );
    process.exit(1);
  }
}

if (rows.length !== 36) {
  console.error(`ERROR: expected 36 rows, found ${rows.length}`);
  process.exit(1);
}

console.log(
  `OK: ${path.relative(ROOT, CSV_PATH)} looks good (36 rows, required columns present).`
);
