// src/data/decans.ts
// Loader for /public/data/decans.csv -> Map("Sign:DecanNumber" => DecanMeta)

import { normSign } from "./aliases";

export type DecanMeta = { title: string; ruler?: string; sub_sign?: string };
export type DecanMetaMap = Map<string, DecanMeta>;

/* BASE_URL-safe join */
const BASE: string = (import.meta.env.BASE_URL || "/") as string;
const withBase = (p: string) =>
  (BASE.endsWith("/") ? BASE : BASE + "/") + p.replace(/^\/+/, "");

/* CSV helpers with delimiter detection */
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
    }
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

function parseDecanFromString(v: string): 1 | 2 | 3 | null {
  const s = (v || "").trim();
  const dm = s.match(/\b([123])\b/);
  if (dm) return Number(dm[1]) as 1 | 2 | 3;
  const sl = s.toLowerCase();
  if (/\b(iii|ⅲ)\b/.test(sl)) return 3;
  if (/\b(ii|ⅱ)\b/.test(sl)) return 2;
  if (/\b(i|ⅰ)\b/.test(sl)) return 1;
  return null;
}
function parseDecanFromRange(range: string): 1 | 2 | 3 | null {
  const nums = (range || "").match(/\d+/g);
  if (!nums) return null;
  const first = parseInt(nums[0], 10);
  if (first <= 9) return 1;
  if (first <= 19) return 2;
  if (first <= 29) return 3;
  return null;
}

export async function loadDecanMetaMap(): Promise<DecanMetaMap> {
  const url = withBase("data/decans.csv");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Failed to fetch decans.csv (${res.status}) @ ${res.url}`);

  const text = (await res.text()).replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length <= 1) return new Map();

  const delim = detectDelimiter(lines);
  const header = splitByDelim(lines[0], delim);

  const iSign = idxOf(header, "sign");
  const iDec = idxOf(header, "decan", "decan_number", "decan_num", "number");
  const iTitle = idxOf(header, "title");
  const iSub = idxOf(header, "sub_sign", "sub sign", "subsign");
  const iRuler = idxOf(header, "ruler");
  const iRange = idxOf(header, "range", "degree_range");

  const map: DecanMetaMap = new Map();
  for (let r = 1; r < lines.length; r++) {
    const cells = splitByDelim(lines[r], delim);
    const sign = normSign(safe(cells, iSign));
    if (!sign) continue;

    let dec = parseDecanFromString(safe(cells, iDec));
    if (dec == null) dec = parseDecanFromRange(safe(cells, iRange));
    if (dec == null) dec = parseDecanFromString(safe(cells, iTitle));
    if (dec == null) continue;

    map.set(`${sign}:${dec}`, {
      title: safe(cells, iTitle),
      sub_sign: safe(cells, iSub) || undefined,
      ruler: safe(cells, iRuler) || undefined,
    });
  }

  return map;
}

// Back-compat aliases some code may import
export { loadDecanMetaMap as loadDecansMap };
export { loadDecanMetaMap as loadDecansMeta };
