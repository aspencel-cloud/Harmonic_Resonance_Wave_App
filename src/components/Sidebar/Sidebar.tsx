import React, { useCallback, useState } from "react";
import { ContextMap, Placement } from "../../app/types";
import {
  getContextEntry,
  waveIdForDegreeWithinSign,
} from "../../utils/mapping";
import { getWaveName } from "../../data/waves";

/* ============================ CSV HELPERS ============================ */

function splitCsvLine(line: string): string[] {
  const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/g;
  return line
    .split(re)
    .map((s) => s.trim())
    .map((s) => (s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s));
}
function prepCsv(text: string): string[] {
  const noBOM = text.replace(/^\uFEFF/, "");
  return noBOM
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}
function normalizeHeader(h: string): string {
  const k = h.trim().toLowerCase();
  if (k === "wave") return "Wave";
  if (k === "degree" || k === "deg") return "Degree";
  if (k === "sign") return "Sign";
  if (k === "planet" || k === "body") return "Planet";
  if (k === "note" || k === "notes") return "Note";
  if (k === "sabian" || k === "sabian symbol" || k === "sabiansymbol")
    return "Sabian";
  if (k === "chandra" || k === "chandra symbol" || k === "chandrasymbol")
    return "Chandra";
  if (k === "personal question" || k === "question" || k === "personalquestion")
    return "Personal Question";
  return h.trim();
}
function parseDegreeCell(v: string): number {
  const raw = String(v ?? "").trim();
  const m = raw.match(/-?\d+/);
  const n = m ? parseInt(m[0], 10) : NaN;
  if (!Number.isFinite(n)) throw new Error(`Invalid Degree value: "${v}"`);
  if (n < 0 || n > 29) throw new Error(`Degree out of range (0..29): ${n}`);
  return n;
}

type ContextRow = {
  Wave: number;
  Degree: number;
  Sign: string;
  Planet: string;
  Note?: string;
  Sabian?: string;
  Chandra?: string;
  "Personal Question"?: string;
};

function parseCsv(text: string): ContextRow[] {
  const lines = prepCsv(text);
  if (lines.length === 0) return [];
  const headerRaw = splitCsvLine(lines[0]);
  const headers = headerRaw.map(normalizeHeader);

  const required = ["Wave", "Degree", "Sign", "Planet"];
  for (const r of required) {
    if (!headers.includes(r)) {
      throw new Error(
        `Missing required column "${r}". Found headers: ${headerRaw.join(", ")}`
      );
    }
  }

  const rows: ContextRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const obj: any = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ?? "";
    });

    const wave = Number(String(obj["Wave"]).trim());
    if (!Number.isFinite(wave) || wave < 1 || wave > 10) {
      throw new Error(`Row ${i + 1}: invalid Wave "${obj["Wave"]}"`);
    }

    const degree = parseDegreeCell(String(obj["Degree"]));
    const sign = String(obj["Sign"] ?? "").trim();
    const planet = String(obj["Planet"] ?? "").trim();
    const note = String(obj["Note"] ?? "");
    const sabian = String(obj["Sabian"] ?? "");
    const chandra = String(obj["Chandra"] ?? "");
    const question = String(
      obj["Personal Question"] ??
        obj["Question"] ??
        obj["PersonalQuestion"] ??
        ""
    );

    rows.push({
      Wave: wave,
      Degree: degree,
      Sign: sign,
      Planet: planet,
      Note: note,
      Sabian: sabian,
      Chandra: chandra,
      "Personal Question": question,
    });
  }
  return rows;
}

function mergeIntoContext(base: ContextMap, rows: ContextRow[]): ContextMap {
  const next: any = { ...base };
  for (const r of rows) {
    const waveKey = `Wave${r.Wave}`;
    const degreeKey = String(r.Degree);
    const sign = r.Sign;
    const planet = r.Planet;
    if (!sign || !planet) continue;

    next[waveKey] = next[waveKey] || {};
    next[waveKey][sign] = next[waveKey][sign] || {};
    next[waveKey][sign][planet] = next[waveKey][sign][planet] || {};

    next[waveKey][sign][planet][degreeKey] = {
      Note: r.Note ?? "",
      Sabian: r.Sabian ?? "",
      Chandra: r.Chandra ?? "",
      Question: r["Personal Question"] ?? "",
    };
  }
  return next as ContextMap;
}

/* ============================== STATS ============================== */

type LoadStats = {
  fileName: string;
  total: number;
  waves: number;
  signs: number;
  planets: number;
  degrees: number;
  at: string; // timestamp
};

function computeStats(rows: ContextRow[], fileName: string): LoadStats {
  const w = new Set<number>();
  const s = new Set<string>();
  const p = new Set<string>();
  const d = new Set<number>();
  for (const r of rows) {
    w.add(r.Wave);
    s.add(r.Sign);
    p.add(r.Planet);
    d.add(r.Degree);
  }
  return {
    fileName,
    total: rows.length,
    waves: w.size,
    signs: s.size,
    planets: p.size,
    degrees: d.size,
    at: new Date().toLocaleString(),
  };
}

/* ============================== SIDEBAR ============================== */

export default function Sidebar({
  context,
  setContext,
  selected,
}: {
  context: ContextMap;
  setContext: (c: ContextMap) => void;
  selected: Placement | null;
}) {
  const [loading, setLoading] = useState(false);
  const [lastStats, setLastStats] = useState<LoadStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCsv = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      setLoading(true);
      try {
        const text = await file.text();
        const rows = parseCsv(text);
        const merged = mergeIntoContext(context, rows);
        setContext(merged);
        setLastStats(computeStats(rows, file.name));
      } catch (err: any) {
        setError(err?.message ?? "Failed to load CSV");
        setLastStats(null);
      } finally {
        setLoading(false);
        // Allow re-upload of the same file name
        e.target.value = "";
      }
    },
    [context, setContext]
  );

  // Selected details
  const details = (() => {
    if (!selected) return null;
    const deg = Math.floor(selected.degree);
    const waveId = waveIdForDegreeWithinSign(deg);
    const waveName = getWaveName(waveId);
    const ctx =
      waveId != null
        ? getContextEntry(
            context,
            waveId,
            selected.sign as any,
            selected.planet,
            deg
          )
        : null;

    return {
      title: selected.planet,
      summary: `${selected.sign} ${deg}° • Wave ${waveId ?? "—"}${
        waveName ? ` — ${waveName}` : ""
      }`,
      note: ctx?.Note || "",
      sabian: ctx?.Sabian || "",
      chandra: ctx?.Chandra || "",
      question: ctx?.Question || "",
    };
  })();

  return (
    <aside
      style={{
        borderLeft: "1px solid var(--ring)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        overflow: "auto",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0" }}>Details</h2>

      {!selected ? (
        <div style={{ opacity: 0.8 }}>Click a placement to see details.</div>
      ) : (
        <div>
          <h3 style={{ margin: "0 0 6px 0" }}>{details!.title}</h3>
          <div style={{ opacity: 0.9, marginBottom: 12 }}>
            {details!.summary}
          </div>

          {details!.note && (
            <>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Note</div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                {details!.note}
              </div>
            </>
          )}
          {details!.sabian && (
            <>
              <div style={{ fontWeight: 600, marginTop: 12 }}>
                Sabian Symbol
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                {details!.sabian}
              </div>
            </>
          )}
          {details!.chandra && (
            <>
              <div style={{ fontWeight: 600, marginTop: 12 }}>
                Chandra Symbol
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                {details!.chandra}
              </div>
            </>
          )}
          {details!.question && (
            <>
              <div style={{ fontWeight: 600, marginTop: 12 }}>
                Personal Question
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                {details!.question}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ height: 1, background: "var(--ring)", margin: "8px 0" }} />

      <div style={{ fontWeight: 600, marginBottom: 4 }}>Load Context CSV</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleCsv}
          disabled={loading}
        />
        {loading && (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              border: "2px solid var(--ring)",
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }}
          />
        )}
      </div>
      <style>
        {`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}
      </style>

      {/* Accepted headers */}
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Accepted headers (case-insensitive):{" "}
        <code>
          Wave, Degree, Sign, Planet, Note, Sabian/Sabian Symbol,
          Chandra/Chandra Symbol, Personal Question/Question
        </code>
      </div>

      {/* Success / error */}
      {lastStats && !error && (
        <div
          style={{
            border: "1px solid #2ea043",
            background: "rgba(46,160,67,0.12)",
            color: "#b7f3c7",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 700, color: "#d2ffd9" }}>
            Loaded context
          </div>
          <div style={{ opacity: 0.95 }}>
            <b>{lastStats.fileName}</b> • {lastStats.total} rows
          </div>
          <div style={{ opacity: 0.9 }}>
            Waves: {lastStats.waves} • Signs: {lastStats.signs} • Planets:{" "}
            {lastStats.planets} • Degrees: {lastStats.degrees}
          </div>
          <div style={{ opacity: 0.7, marginTop: 2 }}>at {lastStats.at}</div>
        </div>
      )}
      {error && (
        <div
          style={{
            border: "1px solid #e5534b",
            background: "rgba(229,83,75,0.12)",
            color: "#ffd1cd",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ fontWeight: 700, color: "#ffd8d5" }}>CSV error</div>
          {error}
        </div>
      )}
    </aside>
  );
}
