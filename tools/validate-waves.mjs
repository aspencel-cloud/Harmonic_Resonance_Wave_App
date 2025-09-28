// tools/validate-waves.mjs
import fs from "node:fs";
import Papa from "papaparse";

const PATH = "public/data/waves.csv";

const csv = fs.readFileSync(PATH, "utf8");
const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: "greedy",
  newline: "\n", // let Papa detect too, but keep consistent on Windows
});

if (parsed.errors?.length) {
  console.error("\nCSV parse errors:");
  for (const e of parsed.errors)
    console.error("-", e.type, e.message, "row:", e.row);
  process.exit(1);
}

// expected header fields (21)
const FIELDS = [
  "id",
  "title",
  "summary",
  "anchors",
  "keywords",
  "harmonic_function",
  "core_essence",
  "geometric_analogy",
  "numerological_core",
  "anchors_desc",
  "archetypal_role",
  "lived_rel",
  "lived_evolution",
  "lived_service",
  "inner_alchemy",
  "psychological_tone",
  "wisdom_questions",
  "extra1_title",
  "extra1_text",
  "extra2_title",
  "extra2_text",
];

const rows = parsed.data;
console.log(`OK parsed ${rows.length} data rows`);

const seen = new Set();
let bad = 0;

rows.forEach((row, i) => {
  const idx = i + 2; // account for header line
  // 1) column count
  const cols = Object.keys(row);
  if (cols.length !== FIELDS.length) {
    bad++;
    console.warn(
      `Row ${idx}: has ${cols.length} columns (expected ${FIELDS.length}).`
    );
  }
  // 2) required fields
  const id = Number(row.id);
  const anchorsOk = /^\s*\d+\|\d+\|\d+\s*$/.test(row.anchors || "");
  if (!Number.isFinite(id) || id < 1 || id > 10) {
    bad++;
    console.warn(`Row ${idx}: bad id "${row.id}"`);
  } else {
    if (seen.has(id)) console.warn(`Row ${idx}: duplicate id ${id}`);
    seen.add(id);
  }
  if (!anchorsOk) {
    bad++;
    console.warn(`Row ${idx}: anchors not like "7|17|27" -> "${row.anchors}"`);
  }
});

for (let n = 1; n <= 10; n++) {
  if (!seen.has(n)) console.warn(`Missing wave id ${n}`);
}

if (bad) {
  console.error(
    `\nFound ${bad} issues. Fix the rows above (most often missing trailing empty cells or a stray quote).`
  );
  process.exit(2);
}
console.log("Looks good!");
