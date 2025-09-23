// src/data/decans.ts
import Papa from "papaparse";

/** Columns you keep in public/data/decans.csv */
export type DecanMeta = {
  Sign: string; // Aries, Taurus, …
  Decan_Number: number; // 1 | 2 | 3
  Label: string; // "Aries I — The Flame Seed", etc.
  Ruler?: string; // Face ruler (if you store it)
  Subsign?: string; // Modern elemental subsign (if you store it)
  Degree_Start?: number; // 0 | 10 | 20  (optional)
  Degree_End?: number; // 9 | 19 | 29  (optional)
  Structural_Function?: string;
  Phase_Tone?: string;
  One_Liner?: string;
  Field_Function?: string;
  Wave_Summary?: string;
  Poetic_Short?: string;
};

export type DecanMetaMap = Map<string, DecanMeta>; // key: "Aries:1", "Aries:2", …

let _cache: Promise<DecanMetaMap> | null = null;

function buildMap(rows: DecanMeta[]): DecanMetaMap {
  const m = new Map<string, DecanMeta>();
  for (const r of rows) {
    if (!r || !r.Sign) continue;
    // Normalize sign capitalization just in case
    const sign = (r.Sign || "").trim();
    const num = Number(r.Decan_Number);
    if (!sign || !(num === 1 || num === 2 || num === 3)) continue;
    m.set(`${sign}:${num}`, r);
  }
  return m;
}

export async function loadDecans(): Promise<DecanMetaMap> {
  if (_cache) return _cache;
  _cache = (async () => {
    const res = await fetch("/data/decans.csv");
    if (!res.ok) throw new Error(`Failed to fetch decans.csv (${res.status})`);
    const text = await res.text();

    const parsed = Papa.parse<DecanMeta>(text, {
      header: true,
      skipEmptyLines: true,
    });

    return buildMap(parsed.data);
  })();
  return _cache;
}
