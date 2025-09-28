// src/data/layerExamplesCsvLoader.ts
export type ExampleSection = { heading: string; paragraphs: string[] };

export type LayerExample = {
  id: string;
  title: string;
  sections: ExampleSection[];
  bullets?: string[];
  footer?: string;

  // added: raw facts so the UI can enrich headings
  sign: string;
  planet: string;
  degree: number; // 0..29 (we'll display +1 for Sabian/Chandra)
  waveNum?: number | null;
  decanNum?: number | null;
  waveLabel?: string | null; // e.g., "The Soul Mirror" if present in wave_text
};

// ---------- CSV utils ----------
function splitCsvLine(line: string, expectedCols?: number): string[] {
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
  if (expectedCols && out.length < expectedCols) {
    while (out.length < expectedCols) out.push("");
  }
  return out;
}

const roman = (n: number) =>
  n === 1 ? "I" : n === 2 ? "II" : n === 3 ? "III" : String(n);
const fromRoman = (s: string): number | null => {
  const t = s.trim().toUpperCase();
  if (t === "I") return 1;
  if (t === "II") return 2;
  if (t === "III") return 3;
  return null;
};

const normHeader = (s: string) =>
  s
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "_");
const findIdx = (headers: string[], ...aliases: string[]) => {
  for (const a of aliases) {
    const i = headers.indexOf(normHeader(a));
    if (i >= 0) return i;
  }
  return -1;
};
const baseUrlPath = (rel: string) => {
  const base = (import.meta as any).env?.BASE_URL || "/";
  return new URL(
    `${base.replace(/\/+$/, "")}/${rel.replace(/^\/+/, "")}`,
    window.location.href
  ).toString();
};

// ---------- tolerant field parsing ----------
function intFrom(s: string | undefined | null): number | null {
  const m = String(s ?? "")
    .trim()
    .match(/\b(\d{1,2})\b/);
  return m ? Number(m[1]) : null;
}
function waveFrom(cell: string, waveText: string): number | null {
  const n1 = intFrom(cell);
  if (n1 != null) return n1;
  const m = /wave\s*(\d{1,2})/i.exec(waveText || "");
  if (m) return Number(m[1]);
  const n2 = intFrom(waveText);
  return n2;
}
function decanFrom(cell: string, decanText: string): number | null {
  const n = intFrom(cell) ?? intFrom(decanText);
  if (n && n >= 1 && n <= 3) return n;
  const m1 = /\b([ivx]{1,3})\b/i.exec(cell || "");
  if (m1) {
    const r = fromRoman(m1[1]);
    if (r) return r;
  }
  const m2 = /\b([ivx]{1,3})\b/i.exec(decanText || "");
  if (m2) {
    const r2 = fromRoman(m2[1]);
    if (r2) return r2;
  }
  return null;
}

// try to extract "Wave N: <Label>" from wave_text
function waveLabelFrom(text: string): string | null {
  if (!text) return null;
  const m = /wave\s*\d{1,2}\s*:\s*([^,–—\-]+)\s*/i.exec(text);
  return m ? m[1].trim() : null;
}

// ---------- loader ----------
export async function loadLayerExamplesFromCsv(
  url: string = "data/Resonance_Gallery_12_Placements.csv"
): Promise<LayerExample[]> {
  const csvUrl = baseUrlPath(url);
  const res = await fetch(csvUrl, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  const raw = await res.text();
  const text = raw.replace(/^\uFEFF/, "");

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length <= 1) throw new Error("[Examples CSV] No data rows found.");

  const headers = splitCsvLine(lines[0]).map((h) => normHeader(h));

  // your CSV headers (case/space tolerant)
  const iSign = findIdx(headers, "sign");
  const iPlanet = findIdx(headers, "planet");
  const iDegree = findIdx(headers, "degree", "deg");
  const iWave = findIdx(headers, "wave");
  const iWaveText = findIdx(
    headers,
    "wave_text",
    "wave text",
    "wave_description"
  );
  const iDecan = findIdx(headers, "decan");
  const iDecanText = findIdx(
    headers,
    "decan_text",
    "decan text",
    "decan_description"
  );
  const iSabianTitle = findIdx(headers, "sabian_title", "sabian title");
  const iSabianText = findIdx(headers, "sabian_text", "sabian text");
  const iChandraTitle = findIdx(headers, "chandra_title", "chandra title");
  const iChandraText = findIdx(headers, "chandra_text", "chandra text");
  const iSynthesis = findIdx(headers, "synthesis_text", "synthesis", "summary");

  const missing: string[] = [];
  if (iSign < 0) missing.push("sign");
  if (iPlanet < 0) missing.push("planet");
  if (iDegree < 0) missing.push("degree");
  if (missing.length)
    throw new Error(
      `[Examples CSV] Missing required headers: ${missing.join(", ")}`
    );

  const out: LayerExample[] = [];
  const notes: string[] = [];

  for (let r = 1; r < lines.length; r++) {
    const cells = splitCsvLine(lines[r], headers.length);
    if (!cells.length) continue;

    const sign = (cells[iSign] || "").trim();
    const planet = (cells[iPlanet] || "").trim();

    // degree: "12", "12°", "12 deg" → 12
    const degreeRaw = (cells[iDegree] || "").trim();
    const degree = Number.parseInt(
      (degreeRaw.match(/\d+/)?.[0] ?? "").trim(),
      10
    );
    if (!sign || !planet || !Number.isFinite(degree)) continue;

    const waveCell = iWave >= 0 ? (cells[iWave] || "").trim() : "";
    const waveText = iWaveText >= 0 ? (cells[iWaveText] || "").trim() : "";
    const decanCell = iDecan >= 0 ? (cells[iDecan] || "").trim() : "";
    const decanText = iDecanText >= 0 ? (cells[iDecanText] || "").trim() : "";

    const waveNum = waveFrom(waveCell, waveText);
    const decanNum = decanFrom(decanCell, decanText);
    const waveLabel = waveLabelFrom(waveText);

    if (waveNum == null)
      notes.push(`Wave missing/unknown → ${planet} ${degree}° ${sign}`);
    if (decanNum == null)
      notes.push(`Decan missing/unknown → ${planet} ${degree}° ${sign}`);

    const sabianTitle =
      iSabianTitle >= 0 ? (cells[iSabianTitle] || "").trim() : "";
    const sabianText =
      iSabianText >= 0 ? (cells[iSabianText] || "").trim() : "";
    const chandraTitle =
      iChandraTitle >= 0 ? (cells[iChandraTitle] || "").trim() : "";
    const chandraText =
      iChandraText >= 0 ? (cells[iChandraText] || "").trim() : "";
    const synthesis = iSynthesis >= 0 ? (cells[iSynthesis] || "").trim() : "";

    const title = `🌟 ${planet} at ${degree}° ${sign}`;

    const sections: ExampleSection[] = [
      { heading: "Wave", paragraphs: waveText ? [waveText] : [] },
      { heading: "Decan", paragraphs: decanText ? [decanText] : [] },
      {
        heading: "Symbols",
        paragraphs: [
          sabianTitle
            ? `Sabian: “${sabianTitle}” — ${sabianText}`.trim()
            : sabianText,
          chandraTitle
            ? `Chandra: “${chandraTitle}” — ${chandraText}`.trim()
            : chandraText,
        ].filter(Boolean),
      },
    ];

    out.push({
      id: `${planet}-${sign}-${degree}`.toLowerCase().replace(/\s+/g, "-"),
      title,
      sections,
      footer: synthesis || undefined,
      sign,
      planet,
      degree,
      waveNum,
      decanNum,
      waveLabel,
    });
  }

  if (notes.length) console.warn("[Examples CSV] Notes:\n" + notes.join("\n"));
  console.info(`[Examples CSV] Loaded ${out.length} rows from`, csvUrl);
  if (out.length === 0) throw new Error("[Examples CSV] Parsed 0 rows.");
  return out;
}
