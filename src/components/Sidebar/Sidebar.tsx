// src/components/Sidebar/Sidebar.tsx
import React, { useEffect, useState } from "react";
import type { ContextMap, Placement } from "../../app/types";
import { waveIdForDegreeWithinSign } from "../../utils/mapping";
import { getWaveName } from "../../data/waves";
import { normPlanet, normSign } from "../../data/aliases";
import type { WaveDetails } from "../../data/waveDetails";
import "./sidebar.css";

type Props = {
  context: ContextMap;
  setContext: (ctx: ContextMap) => void;
  selected: Placement | null;
  waveDetails?: WaveDetails | null;
};

const LS_ADVANCED = "hww.sidebarAdvanced";

export default function Sidebar({
  context,
  setContext,
  selected,
  waveDetails,
}: Props) {
  // Advanced section toggle (persisted)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem(LS_ADVANCED) === "1"
  );
  useEffect(() => {
    try {
      if (isAdvanced) localStorage.setItem(LS_ADVANCED, "1");
      else localStorage.removeItem(LS_ADVANCED);
    } catch {}
  }, [isAdvanced]);

  let ctxEntry: null | {
    Note?: string;
    Sabian?: string;
    Chandra?: string;
    Question?: string;
  } = null;

  let waveId: number | null = null;
  let waveName = "";

  if (selected) {
    const deg = Math.floor(selected.degree);
    waveId = waveIdForDegreeWithinSign(deg) ?? null;
    waveName = waveId ? getWaveName(waveId) || "" : "";
    const signKey = normSign(selected.sign);
    const planetKey = normPlanet(selected.planet);

    if (waveId != null) {
      ctxEntry =
        (context as any)?.[`Wave${waveId}`]?.[signKey]?.[planetKey]?.[
          String(deg)
        ] ?? null;
    }
  }

  function onLoadCsvFromFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
        if (lines.length <= 1) throw new Error("No rows detected.");
        const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const idx = (name: string) => header.indexOf(name);

        const iWave = [idx("wave")].find((i) => i >= 0) ?? -1;
        const iDeg = [idx("degree")].find((i) => i >= 0) ?? -1;
        const iSign = [idx("sign")].find((i) => i >= 0) ?? -1;
        const iPlanet = [idx("planet")].find((i) => i >= 0) ?? -1;
        const iNote = [idx("note")].find((i) => i >= 0) ?? -1;
        const iSabian =
          [idx("sabian"), idx("sabian symbol")].find((i) => i >= 0) ?? -1;
        const iChandra =
          [idx("chandra"), idx("chandra symbol")].find((i) => i >= 0) ?? -1;
        const iQ =
          [idx("personal question"), idx("question")].find((i) => i >= 0) ?? -1;

        const out: any = {};
        for (let r = 1; r < lines.length; r++) {
          const cells = splitCsvLine(lines[r], header.length);
          if (!cells.length) continue;

          const wave = Number(safeCell(cells, iWave));
          const deg = Math.floor(Number(safeCell(cells, iDeg)));
          const sign = normSign(safeCell(cells, iSign));
          const planet = normPlanet(safeCell(cells, iPlanet));
          if (!Number.isFinite(wave) || wave < 1 || wave > 10) continue;
          if (!Number.isFinite(deg) || deg < 0 || deg > 29) continue;
          if (!sign || !planet) continue;

          const note = safeCell(cells, iNote);
          const sabian = safeCell(cells, iSabian);
          const chandra = safeCell(cells, iChandra);
          const q = safeCell(cells, iQ);

          const wk = `Wave${wave}`;
          out[wk] ||= {};
          out[wk][sign] ||= {};
          out[wk][sign][planet] ||= {};
          out[wk][sign][planet][String(deg)] = {
            Note: note,
            Sabian: sabian,
            Chandra: chandra,
            Question: q,
          };
        }

        setContext(out as ContextMap);
        (window as any).__CTX__ = out;
        alert("Custom context loaded.");
      } catch (err) {
        console.error(err);
        alert("Failed to parse CSV.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <aside className="sidebar">
      <div className="toolbar">
        <h2>Details</h2>
        <button
          className="btn"
          onClick={() => setIsAdvanced((v) => !v)}
          title={isAdvanced ? "Hide advanced tools" : "Show advanced tools"}
        >
          {isAdvanced ? "Advanced ▴" : "Advanced ▾"}
        </button>
      </div>

      {selected ? (
        <>
          <h3>{normPlanet(selected.planet)}</h3>
          <div className="meta">
            {normSign(selected.sign)} {Math.floor(selected.degree)}°
            {waveId ? (
              <>
                {" "}
                • Wave {waveId}
                {waveName ? ` — ${waveName}` : ""}
              </>
            ) : null}
          </div>

          {ctxEntry ? (
            <div className="block">
              {ctxEntry.Note ? (
                <>
                  <h4>Note</h4>
                  <div className="prewrap">{ctxEntry.Note}</div>
                </>
              ) : null}

              {ctxEntry.Sabian ? (
                <>
                  <h4>Sabian Symbol</h4>
                  <div>{ctxEntry.Sabian}</div>
                </>
              ) : null}

              {ctxEntry.Chandra ? (
                <>
                  <h4>Chandra Symbol</h4>
                  <div>{ctxEntry.Chandra}</div>
                </>
              ) : null}

              {ctxEntry.Question ? (
                <>
                  <h4>Personal Question</h4>
                  <div>{ctxEntry.Question}</div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="muted">No context found for this degree.</div>
          )}
        </>
      ) : (
        <div className="muted">Click a placement to see details.</div>
      )}

      <hr className="divider" />

      {/* Wave Details (bottom-half) */}
      {waveDetails ? (
        <>
          <h3>
            Wave Details
            <span className="badge">{waveDetails.shortId}</span>
          </h3>

          <div style={{ opacity: 0.9, marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{waveDetails.title}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Anchors: {waveDetails.anchors.join(", ")}
            </div>
          </div>

          <p>{waveDetails.summary}</p>

          {waveDetails.keywords?.length ? (
            <div style={{ fontSize: 12, opacity: 0.85, margin: "6px 0 10px" }}>
              <strong>Keywords:</strong> {waveDetails.keywords.join(" · ")}
            </div>
          ) : null}

          {waveDetails.sections.map((s) => (
            <section key={s.id} style={{ marginBottom: 12 }}>
              <h4>{s.title}</h4>
              {s.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: "4px 0" }}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </>
      ) : (
        <div className="muted">
          Select a Wave (via the legend) to see its details here.
        </div>
      )}

      {/* Advanced tools (dev) */}
      {isAdvanced && (
        <>
          <hr className="divider" />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Load Context CSV (dev)
          </div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onLoadCsvFromFile}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            Accepted headers (case-insensitive): Wave, Degree, Sign, Planet,
            Note, Sabian/Sabian Symbol, Chandra/Chandra Symbol, Personal
            Question/Question
          </div>
        </>
      )}
    </aside>
  );
}

function safeCell(cells: string[], idx: number) {
  if (idx < 0 || idx >= cells.length) return "";
  return cells[idx]?.trim() ?? "";
}

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
    }
  }
  out.push(cur);
  while (out.length < expectedCols) out.push("");
  return out;
}
