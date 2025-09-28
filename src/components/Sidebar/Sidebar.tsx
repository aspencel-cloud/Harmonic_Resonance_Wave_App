import React, { useEffect, useState } from "react";

import type { ContextMap, Placement } from "../../app/types";
import { waveIdForDegreeWithinSign } from "../../utils/mapping";
import { getWaveName } from "../../data/waves";
import { normPlanet, normSign } from "../../data/aliases";
import type { WaveDetails } from "../../data/waveDetails";

import {
  loadDecans,
  getDecan,
  parseWaves,
  trimInsight,
  type DecanRecord,
} from "../../data/decansLoader";

import "./sidebar.css";

// Collapsible section
function Section(props: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!props.defaultOpen);
  return (
    <div
      className="rs-card"
      style={{ padding: 12, borderRadius: 12, marginTop: 12 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="sectionHeader"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontWeight: 600,
          padding: "6px 2px",
          cursor: "pointer",
          background: "transparent",
          border: "none",
          color: "inherit",
        }}
      >
        <span>{props.title}</span>
        <span>{open ? "▾" : "▸"}</span>
      </button>
      {open && <div style={{ marginTop: 8 }}>{props.children}</div>}
    </div>
  );
}

type Props = {
  context: ContextMap;
  setContext: (ctx: ContextMap) => void;
  selected: Placement | null;
  waveDetails?: WaveDetails | null;
  showCsvLoader?: boolean;

  // browsing support
  browsingWaveId?: number | null;
  onExitBrowsing?: () => void;

  // optional callbacks (still supported)
  onOpenWaveLibrary?: (waveId: number) => void;
  onOpenDecanLibrary?: (sign: string, decan: number) => void;
};

export default function Sidebar({
  context,
  setContext,
  selected,
  waveDetails,
  showCsvLoader = false,
  browsingWaveId = null,
  onExitBrowsing,
  onOpenWaveLibrary,
  onOpenDecanLibrary,
}: Props) {
  // placement context lookup
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

  // decans
  const [decans, setDecans] = useState<DecanRecord[] | null>(null);
  const [decansErr, setDecansErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadDecans()
      .then((rows) => {
        if (alive) setDecans(rows);
      })
      .catch((e) => {
        if (alive) setDecansErr(String(e?.message || e));
      });
    return () => {
      alive = false;
    };
  }, []);

  const selectedDecan =
    selected && typeof selected.degree === "number" && decans
      ? getDecan(decans, normSign(selected.sign), Math.floor(selected.degree))
      : null;

  // custom context CSV loader
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

  // ---------- RENDER ----------
  return (
    <aside className="aside">
      <h2 style={{ marginTop: 0 }}>Details</h2>

      {!selected ? (
        <div
          className="rs-card"
          style={{
            padding: 16,
            borderRadius: 12,
            lineHeight: 1.6,
            background: "var(--rs-surface)",
            border: "1px solid var(--rs-border)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Welcome to Soul Resonance Astrology
          </div>

          <p style={{ margin: "8px 0" }}>
            This system reveals how your chart resonates across three layers of
            meaning:
          </p>

          <ul style={{ margin: "8px 0 8px 18px" }}>
            <li>
              <strong>Waves</strong> — the harmonic fields that shape your
              soul’s rhythm.
            </li>
            <li>
              <strong>Decans</strong> — archetypal gateways within each sign.
            </li>
            <li>
              <strong>Degrees</strong> — the precise resonance anchors where
              your story unfolds.
            </li>
          </ul>

          <p style={{ margin: "8px 0" }}>
            Select a placement, Wave, or Decan to begin the journey. Each layer
            deepens the picture, and together they weave the resonance of your
            soul.
          </p>
        </div>
      ) : (
        <>
          {/* ===================== STAGE 1: ANCHOR ===================== */}
          <Section title="Anchor" defaultOpen>
            <div className="headerRow" style={{ marginTop: 4 }}>
              <span
                className="chip"
                style={{ fontSize: 16, padding: "4px 8px" }}
              >
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
          </Section>

          {/* Browsing banner */}
          {browsingWaveId != null && (
            <div
              className="chip"
              style={{
                display: "inline-flex",
                gap: 8,
                background: "#10161d",
                borderColor: "#2e3a46",
                marginTop: 8,
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

          {/* ===================== STAGE 2: WAVE (mid-range) ===================== */}
          <Section title="Wave" defaultOpen>
            {waveId ? (
              <>
                <div style={{ fontWeight: 600 }}>
                  Wave {waveId}
                  {waveName ? ` — ${waveName}` : ""}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  {/* Same-tab: keeps app state */}
                  <a
                    href={`#/library/waves/${waveId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = `#/library/waves/${waveId}`;
                      onOpenWaveLibrary?.(waveId);
                    }}
                    style={{ textDecoration: "underline" }}
                    title="Open Wave Library"
                  >
                    Open Wave Library →
                  </a>

                  {/* New tab */}
                  <a
                    href={`#/library/waves/${waveId}`}
                    target="_blank"
                    rel="noopener"
                    className="chip"
                    style={{
                      padding: "2px 8px",
                      border: "1px solid var(--rs-border)",
                      textDecoration: "none",
                    }}
                    title="Open in new tab (↗)"
                  >
                    ↗
                  </a>
                </div>
              </>
            ) : (
              <div className="dim">No wave mapping found for this degree.</div>
            )}
          </Section>

          {/* ===================== STAGE 3: DECAN ===================== */}
          <Section title="Decan">
            {decansErr ? (
              <div style={{ color: "#f66" }}>
                Error loading decans: {decansErr}
              </div>
            ) : !decans ? (
              <div>Loading…</div>
            ) : !selectedDecan ? (
              <div>
                Decan unavailable for {normSign(selected.sign)}{" "}
                {Math.floor(selected.degree)}°
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600 }}>{selectedDecan.title}</div>
                <div style={{ opacity: 0.8, fontSize: 13, marginTop: 2 }}>
                  {selectedDecan.sub_sign} • Ruler: {selectedDecan.ruler}
                </div>

                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 600 }}>Spark:</span>{" "}
                  {selectedDecan.spark}
                </div>

                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 600 }}>Deep Insight:</span>{" "}
                  {trimInsight(selectedDecan.deep_insight, 3)}
                </div>

                <div
                  style={{ marginTop: 8, fontStyle: "italic", opacity: 0.9 }}
                >
                  {selectedDecan.poetic}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {(() => {
                    const chips = parseWaves(selectedDecan.influential_waves_a);
                    if (chips.length === 10) return <Chip label="All 10" />;
                    return chips.map((n) => <Chip key={n} label={String(n)} />);
                  })()}
                </div>

                {/* Decan I/II/III quick nav chips */}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      className="chip"
                      style={{
                        opacity: selectedDecan.decan_number === n ? 1 : 0.7,
                        cursor: "pointer",
                      }}
                      title={["Decan I", "Decan II", "Decan III"][n - 1]}
                      onClick={() => {
                        window.location.hash = `#/library/decans/${encodeURIComponent(
                          selectedDecan.sign
                        )}/${n}`;
                        onOpenDecanLibrary?.(selectedDecan.sign, n);
                      }}
                    >
                      {["I", "II", "III"][n - 1]}
                    </button>
                  ))}
                </div>

                {/* Library links */}
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Same-tab: keeps app state */}
                  <a
                    href={`#/library/decans/${selectedDecan.sign}/${selectedDecan.decan_number}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = `#/library/decans/${encodeURIComponent(
                        selectedDecan.sign
                      )}/${selectedDecan.decan_number}`;
                      onOpenDecanLibrary?.(
                        selectedDecan.sign,
                        selectedDecan.decan_number
                      );
                    }}
                    style={{ textDecoration: "underline" }}
                    title="Open the full Decan Library page"
                  >
                    Open Decan Library →
                  </a>

                  {/* New tab */}
                  <a
                    href={`#/library/decans/${selectedDecan.sign}/${selectedDecan.decan_number}`}
                    target="_blank"
                    rel="noopener"
                    style={{
                      marginLeft: 8,
                      opacity: 0.85,
                      textDecoration: "none",
                    }}
                    title="Open in a new tab"
                  >
                    ↗
                  </a>
                </div>
              </>
            )}
          </Section>

          {/* ===================== STAGE 4: SYMBOLS ===================== */}
          <Section title="Symbols">
            {ctxEntry?.Sabian ? (
              <>
                <div className="label" style={{ fontSize: 16 }}>
                  Sabian Symbol
                </div>
                <div style={{ fontSize: 15 }}>{ctxEntry.Sabian}</div>
              </>
            ) : null}

            {ctxEntry?.Chandra ? (
              <>
                <div className="label" style={{ fontSize: 16, marginTop: 8 }}>
                  Chandra Symbol
                </div>
                <div style={{ fontSize: 15 }}>{ctxEntry.Chandra}</div>
              </>
            ) : null}

            {ctxEntry?.Question ? (
              <>
                <div className="label" style={{ marginTop: 8 }}>
                  Personal Question
                </div>
                <div style={{ fontStyle: "italic" }}>{ctxEntry.Question}</div>
              </>
            ) : null}

            {!ctxEntry?.Sabian && !ctxEntry?.Chandra && !ctxEntry?.Question ? (
              <div className="dim">No symbols found for this degree.</div>
            ) : null}
          </Section>

          {/* ===================== STAGE 5: DEEP DIVE ===================== */}
          <Section title="Deep Dive">
            {ctxEntry?.Note ? (
              <>
                <div className="label">Placement Insight</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{ctxEntry.Note}</div>
              </>
            ) : (
              <div className="dim">
                No placement insight available for this degree.
              </div>
            )}
          </Section>
        </>
      )}

      {/* CSV loader */}
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

      <hr className="hr" />

      {/* Wave details (only when browsing) */}
      {browsingWaveId != null && waveDetails ? (
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

function Chip({ label }: { label: string }) {
  return (
    <span
      className="chip"
      style={{
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
      }}
      title={
        label === "All 10"
          ? "All waves are influential in this decan"
          : undefined
      }
    >
      {label}
    </span>
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
