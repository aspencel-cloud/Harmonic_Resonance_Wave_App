// src/data/decansLoader.ts
import { normSign } from "./aliases";

/** Row shape exposed to the app */
export type DecanRecord = {
  sign: string; // normalized sign, e.g. "Aries"
  decan_number: 1 | 2 | 3; // 1..3
  title: string;
  sub_sign: string;
  ruler: string;
  spark: string;
  deep_insight: string;
  poetic: string;
  influential_waves_a: string;
  influential_waves_e: string;
  structural_tone: string;
  field_function: string;
  wave_summary: string;
  range?: string;
  [key: string]: any; // preserve extra columns
};

/* ----------------------------------------------------------------------------
   BASE_URL-safe path join (dev: '/', prod: '/Harmonic_Resonance_Wave_App/')
---------------------------------------------------------------------------- */
const BASE: string = (import.meta.env.BASE_URL || "/") as string;
const withBase = (p: string) =>
  (BASE.endsWith("/") ? BASE : BASE + "/") + p.replace(/^\/+/, "");

/* ----------------------------------------------------------------------------
   CSV helpers (auto-detect delimiter; BOM-safe)
---------------------------------------------------------------------------- */
function splitCsvCommaWithQuotes(line: string): string[] {
  const out: string[] = [];
  let cur = "",
    i = 0,
    inQ = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      if (ch === '"') {
        inQ = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    } else {
      if (ch === '"') {
        inQ = true;
        i++;
        continue;
      }
      if (ch === ",") {
        out.push(cur);
        cur = "";
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
  }
  out.push(cur);
  return out;
}
function splitByDelim(line: string, delim: string): string[] {
  return delim === "," ? splitCsvCommaWithQuotes(line) : line.split(delim);
}
const normHead = (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_");
function detectDelimiter(lines: string[]): string {
  const candidates = ["\t", ",", ";", "|"];
  const sample = lines.slice(0, Math.min(10, lines.length)).filter(Boolean);
  let best = { score: -1, delim: "," };
  for (const d of candidates) {
    const cols = splitByDelim(sample[0], d).map(normHead);
    const hasSign = cols.includes("sign");
    const hasDec = cols.includes("decan") || cols.includes("decan_number");
    const width = cols.length;
    const score = (hasSign ? 10 : 0) + (hasDec ? 5 : 0) + width;
    if (score > best.score) best = { score, delim: d };
  }
  return best.delim;
}
const idxOf = (hdr: string[], ...alts: string[]) => {
  const wants = alts.map(normHead);
  for (let i = 0; i < hdr.length; i++)
    if (wants.includes(normHead(hdr[i]))) return i;
  return -1;
};
const safe = (cells: string[], i: number) =>
  i >= 0 && i < cells.length ? (cells[i] ?? "").trim() : "";

/* ----------------------------------------------------------------------------
   Decan parsing (very tolerant)
---------------------------------------------------------------------------- */
function parseDecanFromString(v: string): 1 | 2 | 3 | null {
  const s = (v || "").trim();
  if (!s) return null;

  // direct 1/2/3 token
  const dm = s.match(/\b([123])\b/);
  if (dm) {
    const n = Number(dm[1]);
    if (n === 1 || n === 2 || n === 3) return n as 1 | 2 | 3;
  }

  // roman numerals or “Decan II”
  const sl = s.toLowerCase();
  if (/\b(iii|ⅲ)\b/.test(sl)) return 3;
  if (/\b(ii|ⅱ)\b/.test(sl)) return 2;
  if (/\b(i|ⅰ)\b/.test(sl)) return 1;

  return null;
}

function parseDecanFromRange(range: string): 1 | 2 | 3 | null {
  // Detect first number and bucket by 0–9, 10–19, 20–29
  const nums = (range || "").match(/\d+/g);
  if (!nums || !nums.length) return null;
  const first = parseInt(nums[0], 10);
  if (Number.isNaN(first)) return null;
  if (first <= 9) return 1;
  if (first <= 19) return 2;
  if (first <= 29) return 3;
  return null;
}

/* ----------------------------------------------------------------------------
   Public API
---------------------------------------------------------------------------- */
export async function loadDecans(): Promise<DecanRecord[]> {
  const url = withBase("data/decans.csv");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Failed to load decans.csv: HTTP ${res.status} @ ${res.url}`
    );
  }

  const text = (await res.text()).replace(/^\uFEFF/, ""); // strip BOM
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length <= 1) return [];

  // delimiter detection (supports TSV/CSV/etc.)
  const delim = detectDelimiter(lines);

  const header = splitByDelim(lines[0], delim);

  // Header indices (accept common variants)
  const iSign = idxOf(header, "sign");
  const iDec = idxOf(
    header,
    "decan",
    "decan_number",
    "decan_num",
    "number",
    "decan_text",
    "decan_title"
  );
  const iTitle = idxOf(header, "title");
  const iSub = idxOf(header, "sub_sign", "sub sign", "subsign");
  const iRuler = idxOf(header, "ruler");
  const iSpark = idxOf(header, "spark");
  const iDeep = idxOf(header, "deep_insight", "deep insight");
  const iPoet = idxOf(header, "poetic", "poem", "poetic_text");
  const iWavesA = idxOf(
    header,
    "influential_waves_a",
    "waves_a",
    "influential_waves"
  );
  const iWavesE = idxOf(header, "influential_waves_e", "waves_e");
  const iTone = idxOf(header, "structural_tone", "tone");
  const iField = idxOf(header, "field_function", "function");
  const iSum = idxOf(header, "wave_summary", "summary");
  const iRange = idxOf(header, "range", "degree_range");

  const out: DecanRecord[] = [];

  for (let r = 1; r < lines.length; r++) {
    const cells = splitByDelim(lines[r], delim);

    const sign = normSign(safe(cells, iSign));
    if (!sign) continue;

    // Resolve decan number from any of: decan column, range, title
    let dec = parseDecanFromString(safe(cells, iDec));
    if (dec == null) dec = parseDecanFromRange(safe(cells, iRange));
    if (dec == null) dec = parseDecanFromString(safe(cells, iTitle));
    if (dec == null) continue;

    const rec: DecanRecord = {
      sign,
      decan_number: dec as 1 | 2 | 3,
      title: safe(cells, iTitle),
      sub_sign: safe(cells, iSub),
      ruler: safe(cells, iRuler),
      spark: safe(cells, iSpark),
      deep_insight: safe(cells, iDeep),
      poetic: safe(cells, iPoet),
      influential_waves_a: safe(cells, iWavesA),
      influential_waves_e: safe(cells, iWavesE),
      structural_tone: safe(cells, iTone),
      field_function: safe(cells, iField),
      wave_summary: safe(cells, iSum),
      range: safe(cells, iRange) || undefined,
    };

    // Preserve any extra columns (forward-compat)
    header.forEach((h, i) => {
      const k = normHead(h);
      if (!(k in rec)) rec[k] = safe(cells, i);
    });

    out.push(rec);
  }

  return out;
}

/** Find the decan row by sign and degree (0..29) */
export function getDecan(
  rows: DecanRecord[],
  sign: string,
  degree0to29: number
): DecanRecord | null {
  const s = normSign(sign);
  const d = Math.max(0, Math.min(29, Math.floor(degree0to29)));
  const n = (Math.floor(d / 10) + 1) as 1 | 2 | 3;
  return rows.find((r) => r.sign === s && r.decan_number === n) || null;
}

/** Parse a comma/space list of wave numbers; “All 10” → [1..10] */
export function parseWaves(text?: string | null): number[] {
  const s = (text || "").trim();
  if (!s) return [];
  if (/all\s*10/i.test(s)) return Array.from({ length: 10 }, (_, i) => i + 1);
  const seen = new Set<number>();
  const out: number[] = [];
  s.split(/[^0-9]+/g)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 10)
    .forEach((n) => {
      if (!seen.has(n)) {
        seen.add(n);
        out.push(n);
      }
    });
  return out;
}

/** Keep first N paragraphs (or sentences) for compact previews */
export function trimInsight(text?: string | null, maxParts = 3): string {
  if (!text) return "";
  const s = String(text).trim();

  // Try paragraphs split by blank line first
  const paras = s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paras.length > 1) {
    const trimmed = paras.slice(0, maxParts).join("\n\n");
    return paras.length > maxParts ? trimmed + " …" : trimmed;
  }

  // Fallback to sentences
  const sentences = s.split(/(?<=\.)\s+/).filter(Boolean);
  const trimmed = sentences.slice(0, maxParts).join(" ");
  return sentences.length > maxParts ? trimmed + " …" : trimmed;
}
