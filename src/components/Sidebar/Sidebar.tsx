import React from "react";
import type { ContextMap, Placement } from "../../app/types";
import { waveIdForDegreeWithinSign } from "../../utils/mapping";
import { getWaveName } from "../../data/waves";
import { normPlanet, normSign } from "../../data/aliases";
import type { WaveDetails } from "../../data/waveDetails";

type Props = {
  context: ContextMap;
  setContext: (ctx: ContextMap) => void;
  selected: Placement | null;
  waveDetails?: WaveDetails | null;
  showCsvLoader?: boolean; // <- NEW
};

export default function Sidebar({
  context,
  setContext,
  selected,
  waveDetails,
  showCsvLoader = false,
}: Props) {
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
    <aside
      style={{
        borderLeft: "1px solid var(--muted)",
        padding: 16,
        overflow: "auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Details</h2>

      {selected ? (
        <>
          <h3 style={{ margin: "8px 0" }}>{normPlanet(selected.planet)}</h3>
          <div style={{ opacity: 0.85, marginBottom: 12 }}>
            {normSign(selected.sign)} {Math.floor(selected.degree)}°{" "}
            {waveId ? (
              <>
                • Wave {waveId}
                {waveName ? ` — ${waveName}` : ""}
              </>
            ) : null}
          </div>

          {ctxEntry ? (
            <div style={{ display: "grid", gap: 12 }}>
              {ctxEntry.Note ? (
                <>
                  <div style={{ fontWeight: 600 }}>Note</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{ctxEntry.Note}</div>
                </>
              ) : null}

              {ctxEntry.Sabian ? (
                <>
                  <div style={{ fontWeight: 600 }}>Sabian Symbol</div>
                  <div>{ctxEntry.Sabian}</div>
                </>
              ) : null}

              {ctxEntry.Chandra ? (
                <>
                  <div style={{ fontWeight: 600 }}>Chandra Symbol</div>
                  <div>{ctxEntry.Chandra}</div>
                </>
              ) : null}

              {ctxEntry.Question ? (
                <>
                  <div style={{ fontWeight: 600 }}>Personal Question</div>
                  <div>{ctxEntry.Question}</div>
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

      {/* CSV loader – gated behind toggle */}
      {showCsvLoader && (
        <>
          <hr style={{ margin: "16px 0" }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Load Context CSV</div>
          <input type="file" accept=".csv,text/csv" onChange={onLoadCsvFromFile} />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
            Accepted headers (case-insensitive): Wave, Degree, Sign, Planet, Note,
            Sabian/Sabian Symbol, Chandra/Chandra Symbol, Personal Question/Question
          </div>
        </>
      )}

      {/* Core Wave details (selected via Legend) */}
      <hr style={{ margin: "16px 0" }} />
      {waveDetails ? (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                background: "var(--bg-soft)",
                border: "1px solid var(--muted)",
                borderRadius: 6,
                padding: "2px 6px",
              }}
            >
              {waveDetails.shortId}
            </span>
            <h3 style={{ margin: "6px 0" }}>{waveDetails.title}</h3>
          </div>
          <p style={{ opacity: 0.9 }}>{waveDetails.summary}</p>

          <ul style={{ display: "flex", gap: 12, padding: 0, margin: "8px 0", flexWrap: "wrap" }}>
            <li style={{ listStyle: "none" }}>
              <strong>Anchors:</strong> {waveDetails.anchors.join(", ")}
            </li>
            {waveDetails.keywords?.length ? (
              <li style={{ listStyle: "none" }}>
                <strong>Keywords:</strong> {waveDetails.keywords.join(" · ")}
              </li>
            ) : null}
          </ul>

          {waveDetails.sections.map((s) => (
            <section key={s.id} style={{ padding: "6px 0" }}>
              <h4 style={{ margin: "4px 0" }}>{s.title}</h4>
              {s.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: "4px 0" }}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div style={{ opacity: 0.7 }}>
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
