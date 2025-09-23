import React, { useEffect, useState } from "react";

import type { ContextMap, Placement } from "../../app/types";
import { waveIdForDegreeWithinSign } from "../../utils/mapping";
import { getWaveName } from "../../data/waves";
import { normPlanet, normSign } from "../../data/aliases";
import type { WaveDetails } from "../../data/waveDetails";

import { loadDecans, type DecanMetaMap } from "../../data/decans";
import { getDecanEnriched } from "../../utils/getDecanEnriched";
import DecanBlock from "./DecanBlock";

import "./sidebar.css";

type Props = {
  context: ContextMap;
  setContext: (ctx: ContextMap) => void;
  selected: Placement | null;
  waveDetails?: WaveDetails | null;
  showCsvLoader?: boolean;

  // wave-browsing support from App
  browsingWaveId?: number | null;
  onExitBrowsing?: () => void;
};

export default function Sidebar({
  context,
  setContext,
  selected,
  waveDetails,
  showCsvLoader = false,
  browsingWaveId = null,
  onExitBrowsing,
}: Props) {
  // ------- Context lookup for selected placement -------
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

  // ------- Decans (CSV meta + computed face/subsign) -------
  const [decanMeta, setDecanMeta] = useState<DecanMetaMap | null>(null);
  useEffect(() => {
    let alive = true;
    loadDecans()
      .then((m) => {
        if (alive) setDecanMeta(m);
      })
      .catch(() => {
        if (alive) setDecanMeta(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  const decan =
    selected && typeof selected.degree === "number"
      ? getDecanEnriched(
          normSign(selected.sign),
          Math.floor(selected.degree),
          decanMeta,
          "chaldean" // default show face ruler
        )
      : null;

  // ------- CSV loader for custom context -------
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
    <aside className="aside">
      <h2 style={{ marginTop: 0 }}>Details</h2>

      {selected ? (
        <>
          {/* Header: Planet (bigger) + Sign/Degree + Wave chip */}
          <div className="headerRow">
            <span className="chip" style={{ fontSize: 16, padding: "4px 8px" }}>
              {normPlanet(selected.planet)}
            </span>
            <h3 style={{ margin: "0 0 0 6px", fontSize: 20 }}>
              {normSign(selected.sign)} {Math.floor(selected.degree)}°
            </h3>
            {waveId ? (
              <span className="chip waveChip" style={{ marginLeft: 8 }}>
                Wave {waveId}
                {waveName ? ` — ${waveName}` : ""}
              </span>
            ) : null}
          </div>

          {/* Browsing banner */}
          {browsingWaveId != null && (
            <div
              className="chip"
              style={{
                display: "inline-flex",
                gap: 8,
                background: "#10161d",
                borderColor: "#2e3a46",
                marginBottom: 8,
              }}
            >
              Viewing Wave {browsingWaveId} (browsing)
              {onExitBrowsing ? (
                <button
                  onClick={onExitBrowsing}
                  style={{
                    marginLeft: 6,
                    border: "1px solid var(--pane-border)",
                    background: "transparent",
                    color: "inherit",
                    borderRadius: 6,
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                >
                  Back to placement’s wave
                </button>
              ) : null}
            </div>
          )}

          {/* Placement context */}
          {ctxEntry ? (
            <div className="block">
              {ctxEntry.Note ? (
                <>
                  <div className="label">Placement Insight</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{ctxEntry.Note}</div>
                </>
              ) : null}

              {ctxEntry.Sabian ? (
                <>
                  <div className="label" style={{ fontSize: 16 }}>
                    Sabian Symbol
                  </div>
                  <div style={{ fontSize: 15 }}>{ctxEntry.Sabian}</div>
                </>
              ) : null}

              {ctxEntry.Chandra ? (
                <>
                  <div className="label" style={{ fontSize: 16 }}>
                    Chandra Symbol
                  </div>
                  <div style={{ fontSize: 15 }}>{ctxEntry.Chandra}</div>
                </>
              ) : null}

              {ctxEntry.Question ? (
                <>
                  <div className="label">Personal Question</div>
                  <div style={{ fontStyle: "italic" }}>{ctxEntry.Question}</div>
                </>
              ) : null}
            </div>
          ) : (
            <div style={{ opacity: 0.7 }}>
              No context found for this degree.
            </div>
          )}
        </>
      ) : (
        <div style={{ opacity: 0.7 }}>Click a placement to see details.</div>
      )}

      {/* CSV loader toggle */}
      {showCsvLoader && (
        <>
          <hr className="hr" />
          <div className="label" style={{ marginBottom: 8 }}>
            Load Context CSV
          </div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onLoadCsvFromFile}
          />
          <div className="smallNote" style={{ marginTop: 8 }}>
            Accepted headers (case-insensitive): Wave, Degree, Sign, Planet,
            Note, Sabian/Sabian Symbol, Chandra/Chandra Symbol, Personal
            Question/Question
          </div>
        </>
      )}

      {/* --------- DECAN BLOCK (back again!) --------- */}
      {decan ? (
        <>
          <hr className="hr" />
          <DecanBlock decan={decan} />
        </>
      ) : null}

      <hr className="hr" />

      {/* --------- WAVE DETAILS --------- */}
      {waveDetails ? (
        <div>
          <div className="headerRow" style={{ marginTop: 6 }}>
            <span className="chip waveChip">W{waveDetails.shortId}</span>
            <h3 style={{ margin: "6px 0" }}>{waveDetails.title}</h3>
          </div>
          <p className="dim" style={{ opacity: 0.9 }}>
            {waveDetails.summary}
          </p>

          <ul className="kvList" style={{ margin: "8px 0" }}>
            <li>
              <strong>Anchors:</strong> {waveDetails.anchors.join(", ")}
            </li>
            {waveDetails.keywords?.length ? (
              <li>
                <strong>Keywords:</strong> {waveDetails.keywords.join(" · ")}
              </li>
            ) : null}
          </ul>

          {waveDetails.sections.map((s) => (
            <section key={s.id} style={{ padding: "6px 0" }}>
              <details
                className="details"
                {...(s.title.toLowerCase().includes("theme")
                  ? { open: true }
                  : {})}
              >
                <summary>{s.title}</summary>
                <div className="content">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} style={{ margin: "4px 0" }}>
                      {p}
                    </p>
                  ))}
                </div>
              </details>
            </section>
          ))}
        </div>
      ) : (
        <div className="dim">
          Select a Wave (via the legend) to see its details here.
        </div>
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
