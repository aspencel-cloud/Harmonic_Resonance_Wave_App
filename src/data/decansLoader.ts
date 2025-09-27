import Papa from "papaparse";

export type DecanRecord = {
  sign: string;
  decan_number: 1 | 2 | 3;
  degree_range: string;
  title: string;
  ruler: string;
  sub_sign: string;
  spark: string;
  deep_insight: string;
  poetic: string;
  influential_waves_a: string; // "3,6" or "All 10"
  influential_waves_e?: string; // optional
  structural_tone?: string; // library-only
  field_function?: string; // library-only
  wave_summary?: string; // library-only
};

export async function loadDecans(): Promise<DecanRecord[]> {
  const urls = ["/data/decans.csv", "/decans.csv"]; // fallback if needed
  let lastErr: any;

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) {
        lastErr = `HTTP ${res.status} @ ${url}`;
        continue;
      }
      const text = await res.text();

      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: "", // auto-detect
        transformHeader: (h) => (h || "").replace(/^\uFEFF/, "").trim(),
      });
      if (parsed.errors?.length) {
        lastErr = parsed.errors[0]?.message;
        continue;
      }

      return parsed.data
        .filter((r) => r && Object.keys(r).length)
        .map(normalizeDecanRecord);
    } catch (e: any) {
      lastErr = e?.message || e;
    }
  }
  throw new Error(`Failed to load decans.csv: ${String(lastErr)}`);
}

export function getDecan(
  decans: DecanRecord[],
  sign: string,
  degreeInSign: number // 0..29
): DecanRecord | undefined {
  const decan_number: 1 | 2 | 3 =
    degreeInSign < 10 ? 1 : degreeInSign < 20 ? 2 : 3;
  return decans.find(
    (d) =>
      d.sign.trim().toLowerCase() === sign.trim().toLowerCase() &&
      d.decan_number === decan_number
  );
}

export function parseWaves(field: string | undefined | null): number[] {
  if (!field) return [];
  if (/all\s*10/i.test(field)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const out: number[] = [];
  for (const part of field.split(",")) {
    const n = Number(part.trim());
    if (Number.isFinite(n) && n >= 1 && n <= 10 && !out.includes(n))
      out.push(n);
  }
  return out;
}

export function trimInsight(text: string, maxSentences = 3): string {
  if (!text) return "";
  const parts = text.match(/[^.!?]+[.!?]+|\S+$/g) || [text];
  return parts.slice(0, maxSentences).join(" ").trim();
}

function normalizeDecanRecord(raw: Record<string, string>): DecanRecord {
  const dn = Number(String(raw.decan_number).trim()) as 1 | 2 | 3;
  const wavesA = (
    raw.influential_waves_a ??
    raw.influential_waves ??
    ""
  ).trim();
  return {
    sign: (raw.sign || "").trim(),
    decan_number: dn,
    degree_range: (raw.degree_range || "").trim(),
    title: (raw.title || "").trim(),
    ruler: (raw.ruler || "").trim(),
    sub_sign: (raw.sub_sign || "").trim(),
    spark: coerce(raw.spark),
    deep_insight: coerce(raw.deep_insight),
    poetic: coerce(raw.poetic),
    influential_waves_a: wavesA,
    influential_waves_e: opt(raw.influential_waves_e),
    structural_tone: opt(raw.structural_tone),
    field_function: opt(raw.field_function),
    wave_summary: opt(raw.wave_summary),
  };
}
function opt(v?: string) {
  const s = (v ?? "").trim();
  return s.length ? s : undefined;
}
function coerce(v?: string) {
  return (v ?? "").replace(/\r\n/g, "\n").trim();
}
