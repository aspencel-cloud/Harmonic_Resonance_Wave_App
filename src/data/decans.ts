// src/data/decans.ts
// Loader for /public/decans.csv -> Map("Sign:DecanNumber" => DecanMeta)

export type DecanMeta = {
  Sign: string; // Aries...
  Decan_Number: 1 | 2 | 3;
  Label?: string;
  Ruler?: string;
  Subsign?: string;
  Degree_Start?: number;
  Degree_End?: number;

  // Optional prose fields (all from your CSV)
  Structural_Function?: string;
  Phase_Tone?: string;
  One_Liner?: string;
  Field_Function?: string;
  Wave_Summary?: string;
  Poetic_Short?: string;
};

export type DecanMetaMap = Map<string, DecanMeta>; // key: "Aries:1"

function norm(s: string) {
  return (s ?? "").trim();
}

// split a CSV line that may contain quoted commas
function splitCsvLine(line: string, expectedCols: number): string[] {
  const out: string[] = [];
  let cur = "";
  let i = 0;
  let inQ = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 2;
      } else if (ch === '"') {
        inQ = false;
        i++;
      } else {
        cur += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQ = true;
        i++;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
        i++;
      } else {
        cur += ch;
        i++;
      }
    }
  }
  out.push(cur);
  while (out.length < expectedCols) out.push("");
  return out;
}

export async function loadDecans(): Promise<DecanMetaMap> {
  const res = await fetch("/decans.csv", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch decans.csv (${res.status})`);
  const text = await res.text();

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length <= 1) return new Map();

  const header = lines[0].split(",").map((h) => norm(h).toLowerCase());
  const idx = (name: string) => header.indexOf(name);

  const getIdx = (...names: string[]) =>
    names.map((n) => idx(n.toLowerCase())).find((i) => i >= 0) ?? -1;

  const iSign = getIdx("sign");
  const iDec = getIdx("decan_number", "decan", "number");
  const iLabel = getIdx("label", "name", "title");
  const iRuler = getIdx("ruler", "face", "face_ruler");
  const iSub = getIdx("subsign", "sub_sign", "sub-sign");
  const iStart = getIdx("degree_start", "start", "start_degree");
  const iEnd = getIdx("degree_end", "end", "end_degree");

  const iStruct = getIdx("structural_function");
  const iTone = getIdx("phase_tone", "tone");
  const iOne = getIdx("one_liner", "one-line", "one_line");
  const iField = getIdx("field_function");
  const iWaveS = getIdx("wave_summary", "wave_summary_text");
  const iPoet = getIdx("poetic_short", "poetic");

  const map: DecanMetaMap = new Map();

  for (let r = 1; r < lines.length; r++) {
    const cells = splitCsvLine(lines[r], header.length);
    if (!cells.length) continue;

    const Sign = norm(cells[iSign] || "");
    const Decan_Number = Number(norm(cells[iDec] || "")) as 1 | 2 | 3;
    if (!Sign || ![1, 2, 3].includes(Decan_Number)) continue;

    const m: DecanMeta = {
      Sign,
      Decan_Number,
      Label: norm(cells[iLabel] || ""),
      Ruler: norm(cells[iRuler] || ""),
      Subsign: norm(cells[iSub] || ""),
      Degree_Start: Number(norm(cells[iStart] || "")),
      Degree_End: Number(norm(cells[iEnd] || "")),
      Structural_Function: norm(cells[iStruct] || ""),
      Phase_Tone: norm(cells[iTone] || ""),
      One_Liner: norm(cells[iOne] || ""),
      Field_Function: norm(cells[iField] || ""),
      Wave_Summary: norm(cells[iWaveS] || ""),
      Poetic_Short: norm(cells[iPoet] || ""),
    };

    // empty strings -> undefined (tidier)
    Object.keys(m).forEach((k) => {
      const key = k as keyof DecanMeta;
      if (typeof m[key] === "string" && (m[key] as any).trim() === "") {
        (m as any)[key] = undefined;
      }
      if (
        (key === "Degree_Start" || key === "Degree_End") &&
        Number.isNaN(m[key] as any)
      ) {
        (m as any)[key] = undefined;
      }
    });

    map.set(`${Sign}:${Decan_Number}`, m);
  }

  return map;
}
