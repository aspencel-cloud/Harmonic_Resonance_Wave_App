// src/data/loadBuiltInContext.ts
// Robust built-in context loader.
// - Tries ',', ';', '\t' and validates required headers
// - Picks the valid candidate with the most rows
// - Strips BOM, normalizes headers, normalizes Sign/Planet

import Papa from "papaparse";
import type { ContextMap } from "../app/types";
import { normSign, normPlanet } from "./aliases";

type Manifest = { version: string; dataset: string };
type RawRow = Record<string, string | number | null | undefined>;

export async function fetchContextManifest(): Promise<Manifest> {
  const res = await fetch("/data/context_manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch context manifest");
  return (await res.json()) as Manifest;
}

type ParseCandidate = {
  rows: RawRow[];
  delimiterTried: string;
  fields: string[];
  warnings: Papa.ParseError[];
  valid: boolean;
};

const REQUIRED_HEADERS = ["wave", "degree", "sign", "planet"];

function normalizeHeaders(fields?: string[] | null): string[] {
  if (!fields) return [];
  const seen = new Set<string>();
  return fields.map((f) => {
    let k = String(f ?? "")
      .trim()
      .toLowerCase();
    while (seen.has(k)) k += "_";
    seen.add(k);
    return k;
  });
}

function postProcessRows(data: any): RawRow[] {
  return (data as RawRow[]).map((row) => {
    const out: RawRow = {};
    for (const [k, v] of Object.entries(row)) {
      const key = String(k).trim().toLowerCase();
      out[key] = typeof v === "string" ? v.trim() : v;
    }
    return out;
  });
}

function hasRequiredHeaders(fields: string[]): boolean {
  const set = new Set(fields);
  return REQUIRED_HEADERS.every((h) => set.has(h));
}

function tryParse(text: string, delimiter: string): ParseCandidate {
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: "greedy",
    dynamicTyping: false,
    delimiter,
    quoteChar: '"',
    escapeChar: '"',
    // transformHeader runs before mapping rows, so it’s the safest way
    transformHeader(h) {
      return String(h ?? "")
        .trim()
        .toLowerCase();
    },
  });

  const fields = normalizeHeaders(parsed.meta?.fields);
  // NOTE: meta.fields is not re-applied to data, but transformHeader already
  // lowercased them for mapping; we normalize here just for validation/logging.

  const rows = postProcessRows(parsed.data);
  const warnings = parsed.errors || [];
  const valid = hasRequiredHeaders(fields);

  return { rows, delimiterTried: delimiter, fields, warnings, valid };
}

export async function fetchContextCsv(path: string): Promise<RawRow[]> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  let text = await res.text();

  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const delimiters = [",", ";", "\t"];
  const attempts = delimiters.map((d) => tryParse(text, d));

  // Log all attempts for visibility
  attempts.forEach((a) =>
    console.log(
      `[CTX] candidate delimiter ${JSON.stringify(a.delimiterTried)} -> rows: ${
        a.rows.length
      }, valid headers: ${a.valid}, fields: ${a.fields.join(", ")}`
    )
  );

  // Filter only candidates that have required headers
  const valids = attempts.filter((a) => a.valid);

  if (!valids.length) {
    console.error(
      "[CTX] No valid parse candidates found. Check delimiter/headers in CSV."
    );
    // Fall back to the max rows candidate just so the app doesn't hard-crash
    const best = attempts
      .slice()
      .sort((a, b) => b.rows.length - a.rows.length)[0];
    console.log(
      `[CTX] fallback to delimiter ${JSON.stringify(
        best.delimiterTried
      )} with ${best.rows.length} rows`
    );
    return best.rows;
  }

  // Choose the valid candidate with the most rows
  const best = valids.slice().sort((a, b) => b.rows.length - a.rows.length)[0];
  console.log(
    `[CTX] parsed rows: ${best.rows.length} (delimiter chosen: ${JSON.stringify(
      best.delimiterTried
    )})`
  );
  if (best.warnings?.length) {
    console.warn(
      "[CTX] CSV parse warnings (first 5):",
      best.warnings.slice(0, 5)
    );
  }
  return best.rows;
}

export function rowsToContext(rows: RawRow[]): ContextMap {
  const ctx: any = {};

  const pick = (r: RawRow, keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return "";
  };

  for (const r of rows) {
    const wave = Number(r["wave"]);
    const deg = Math.floor(Number(r["degree"]));
    const sign = normSign(String(r["sign"] || ""));
    const planet = normPlanet(String(r["planet"] || ""));

    if (!Number.isFinite(wave) || wave < 1 || wave > 10) continue;
    if (!Number.isFinite(deg) || deg < 0 || deg > 29) continue;
    if (!sign || !planet) continue;

    const note = pick(r, ["note"]);
    const sabian = pick(r, ["sabian", "sabian symbol"]);
    const chandra = pick(r, ["chandra", "chandra symbol"]);
    const question = pick(r, ["personal question", "question"]);

    const wk = `Wave${wave}`;
    ctx[wk] ||= {};
    ctx[wk][sign] ||= {};
    ctx[wk][sign][planet] ||= {};
    ctx[wk][sign][planet][String(deg)] = {
      Note: note,
      Sabian: sabian,
      Chandra: chandra,
      Question: question,
    };
  }

  return ctx as ContextMap;
}
