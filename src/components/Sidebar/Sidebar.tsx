// src/components/Sidebar/Sidebar.tsx
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

import { CopyLinkButton } from "../CopyLinkButton";
import LayerExamples from "./LayerExamples";
import {
  loadLayerExamplesFromCsv,
  type LayerExample as GalleryExample,
} from "../../data/layerExamplesCsvLoader";

import { buildReadingForPlacement } from "../../resonance/appBridge";

import "./sidebar.css";

// Collapsible section
function Section(props: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!props.defaultOpen);
  const id = `section-${props.title.replace(/\s+/g, "-")}`;
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
        aria-expanded={open}
        aria-controls={id}
      >
        <span>{props.title}</span>
        <span>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div id={id} style={{ marginTop: 8 }}>
          {props.children}
        </div>
      )}
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
          String(Math.floor(selected.degree))
        ] ?? null;
    }
  }

  // NEW: full integrated resonance reading (engine + context_v1)
  const resonanceReading =
    selected && context ? buildReadingForPlacement(selected, context) : null;

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

  // CSV-backed "Examples" gallery (welcome card) – explicit path version
  const [examples, setExamples] = useState<GalleryExample[] | null>(null);
  const [examplesErr, setExamplesErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    loadLayerExamplesFromCsv("data/Resonance_Gallery_12_Placements.csv")
      .then((rows) => {
        if (alive) setExamples(rows);
      })
      .catch((e) => {
        if (alive) setExamplesErr(String(e?.message || e));
      });
    return () => {
      alive = false;
    };
  }, []);

  // custom context CSV loader (kept; hidden when showCsvLoader=false)
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
      <h2 style={{ marginTop: 0 }}>Resonance Reading</h2>

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

          {/* Short primer (always visible) */}
          <p style={{ margin: "8px 0" }}>
            This system reveals how your chart resonates across three layers of
            meaning:
          </p>

          <ul style={{ margin: "8px 0 8px 18px" }}>
            <li>
              <strong>Waves</strong> — harmonic fields that set the rhythm and
              tone of your unfolding.
            </li>
            <li>
              <strong>Decans</strong> — archetypal gateways within each sign
              (three per sign) that shape how the sign expresses.
            </li>
            <li>
              <strong>Symbols</strong> — <em>degree-specific</em> intelligence
              (Sabian/Chandra) that speaks to your exact placement. Symbols lean
              on the precise degree; Waves and Decans provide the field and
              frame.
            </li>
          </ul>

          {/* Collapsible “How these layers work (1-minute read)” */}
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              How these layers work (1-minute read)
            </summary>

            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
              <p>
                <strong>Three lenses</strong> you’ll see throughout the app:
              </p>
              <ul style={{ margin: "6px 0 12px 18px" }}>
                <li>
                  <em>Wave</em> — the harmonic field (context, tone, “the
                  music”).
                </li>
                <li>
                  <em>Decan</em> — the archetypal stage inside the sign (how the
                  sign plays out).
                </li>
                <li>
                  <em>Symbols</em> — <em>degree-specific</em> notes
                  (Sabian/Chandra) for the exact placement.
                </li>
              </ul>

              <div
                style={{
                  border: "1px solid var(--rs-border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "var(--rs-surface)",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  🌟 Example: Venus at 12° Leo{" "}
                  <span style={{ opacity: 0.8 }}>(13th degree)</span>
                </div>

                {/* Wave */}
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontWeight: 600 }}>
                    1) Wave (the harmonic field) → Wave 2: The Soul Mirror
                  </div>
                  <p style={{ margin: "4px 0 0" }}>
                    Venus here moves through the field of reflection and
                    relationship. Value and beauty are revealed through
                    mirroring — love becomes known in the way it resonates with
                    others. This Wave sets the tone of dialogue, harmony, and
                    reciprocity:
                    <em>
                      {" "}
                      “You discover yourself in the mirror of what you love.”
                    </em>
                  </p>
                </div>

                {/* Decan */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600 }}>
                    2) Decan (the archetypal stage) → Leo Decan II: The Sculptor
                    of Self{" "}
                    <span style={{ opacity: 0.8 }}>(Jupiter influence)</span>
                  </div>
                  <p style={{ margin: "4px 0 0" }}>
                    The second decan of Leo sculpts radiance into artistry and
                    offering. Venus here learns that beauty is not simply
                    display but must be refined, shaped, and devoted.
                    Relationships become tests of grace and loyalty; creativity
                    matures into form that serves more than ego.
                  </p>
                </div>

                {/* Symbols */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600 }}>
                    3) Symbols (the precise note) → 13° Leo
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontWeight: 600 }}>Sabian Symbol:</div>
                    <div style={{ fontStyle: "italic" }}>
                      “An old sea captain.”
                    </div>
                    <p style={{ margin: "4px 0 0" }}>
                      Venus here carries the wisdom of journeys completed. Love
                      and value are infused with memory, perspective, and the
                      ability to hold steady after life’s storms. There is
                      gravitas and a seasoned quality to affection and beauty.
                    </p>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 600 }}>Chandra Symbol:</div>
                    <div style={{ fontStyle: "italic" }}>
                      “A man painting scenes on a ceiling.”
                    </div>
                    <p style={{ margin: "4px 0 0" }}>
                      Alongside this maturity comes aspiration. Venus longs to
                      elevate beauty, to inspire, to raise love and creativity
                      toward higher vision. What is ordinary is lifted toward
                      the extraordinary.
                    </p>
                  </div>

                  <p style={{ marginTop: 10 }}>
                    Together, these symbols show a Venus that is both seasoned
                    and aspiring: it holds the weight of past experience while
                    striving to uplift the present into vision and artistry.
                  </p>
                </div>

                {/* Synthesis */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 700 }}>🔑 The Synthesis</div>
                  <ul style={{ margin: "6px 0 0 18px" }}>
                    <li>
                      <strong>Wave 2</strong> provides the field of mirroring
                      and resonance.
                    </li>
                    <li>
                      <strong>Leo Decan II</strong> frames that resonance as
                      artistry and devotion.
                    </li>
                    <li>
                      <strong>13° symbols</strong> ground it in lived detail:
                      seasoned wisdom (sea captain) reaching upward (painted
                      ceiling).
                    </li>
                  </ul>
                  <p style={{ marginTop: 6 }}>
                    ✨ This Venus is not only radiant in Leo — it is reflective,
                    sculpted, and matured. Love here both remembers and aspires,
                    carrying the weight of journeys past and the pull of vision
                    above.
                  </p>
                </div>
              </div>
            </div>
          </details>

          {/* CSV-backed Examples carousel */}
          <details style={{ marginTop: 12 }} open>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              Examples (browse)
            </summary>
            <div style={{ marginTop: 8 }}>
              {examplesErr ? (
                <div style={{ color: "#f66" }}>
                  Error loading examples: {examplesErr}
                </div>
              ) : examples?.length ? (
                <LayerExamples examples={examples} />
              ) : (
                <div className="dim">No examples found.</div>
              )}
            </div>
          </details>
        </div>
      ) : (
        <>
          {/* ===================== STAGE 1: Selected Placement ===================== */}
          <Section title="Selected Placement" defaultOpen>
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

          {/* ===================== NEW: Integrated Resonance Reading ===================== */}
          {resonanceReading && (
            <Section title="Integrated Resonance Reading" defaultOpen>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{resonanceReading.header}</div>
                <div
                  style={{
                    fontStyle: "italic",
                    opacity: 0.9,
                    marginTop: 2,
                  }}
                >
                  {resonanceReading.subheader}
                </div>
              </div>

              {resonanceReading.sections.map((section) => (
                <div key={section.id} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 2,
                      fontSize: 14,
                    }}
                  >
                    {section.label}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                    {section.body}
                  </div>
                </div>
              ))}
            </Section>
          )}

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
                  {/* Same-tab */}
                  <a
                    href={`#/library/waves/${waveId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = `#/library/waves/${waveId}`;
                      onOpenWaveLibrary?.(waveId);
                    }}
                    style={{ textDecoration: "underline" }}
                    title="Open Wave Library"
                    aria-label="Open Wave in library (same tab)"
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
                    aria-label="Open Wave in library (new tab)"
                  >
                    ↗
                  </a>
                </div>

                {/* Copy link for this Wave */}
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <CopyLinkButton
                    ariaLabel="Copy link to this Wave"
                    label="Copy link"
                    getHashHref={() => `#/library/waves/${waveId}`}
                    className="chip"
                  />
                </div>
              </>
            ) : (
              <div className="dim">No wave mapping found for this degree.</div>
            )}
          </Section>

          {/* ===================== STAGE 3: DECAN ===================== */}
          <Section title="Decan">
            {/* Always-available quick nav chips (work even before CSV finishes loading) */}
            {selected ? (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="chip"
                    style={{ cursor: "pointer" }}
                    title={["Decan I", "Decan II", "Decan III"][n - 1]}
                    aria-label={`Open ${normSign(selected.sign)} Decan ${
                      ["I", "II", "III"][n - 1]
                    } in library`}
                    onClick={() => {
                      const sign = normSign(selected.sign);
                      window.location.hash = `#/library/decans/${encodeURIComponent(
                        sign
                      )}/${n}`;
                      onOpenDecanLibrary?.(sign, n);
                    }}
                  >
                    {["I", "II", "III"][n - 1]}
                  </button>
                ))}
              </div>
            ) : null}

            {decansErr ? (
              <div style={{ color: "#f66" }}>
                Error loading decans: {decansErr}
              </div>
            ) : !decans ? (
              <div>Loading…</div>
            ) : !selected ? (
              <div className="dim">No placement selected.</div>
            ) : !selected.degree && selected.degree !== 0 ? (
              <div className="dim">Degree missing for selected placement.</div>
            ) : (
              (() => {
                const selectedDecan =
                  selected && typeof selected.degree === "number"
                    ? getDecan(
                        decans,
                        normSign(selected.sign),
                        Math.floor(selected.degree)
                      )
                    : null;

                if (!selectedDecan) {
                  return (
                    <div>
                      Decan unavailable for {normSign(selected.sign)}{" "}
                      {Math.floor(selected.degree)}°
                    </div>
                  );
                }

                return (
                  <>
                    <div style={{ fontWeight: 600 }}>{selectedDecan.title}</div>
                    <div
                      style={{
                        opacity: 0.8,
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {selectedDecan.sub_sign} • Ruler: {selectedDecan.ruler}
                    </div>

                    {/* 1-minute read: What is a Decan? */}
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                        What is a Decan? (1-minute read)
                      </summary>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 14,
                          lineHeight: 1.55,
                        }}
                      >
                        <p>
                          Each sign spans 30°, and it’s divided into three{" "}
                          <em>Decans</em> (10° each). Decans add a distinct
                          archetypal flavor to the sign — like three chapters
                          within the same book.
                        </p>
                        <ul style={{ margin: "6px 0 6px 18px" }}>
                          <li>
                            <strong>Decan I (0–9°)</strong> — the pure seed of
                            the sign’s energy.
                          </li>
                          <li>
                            <strong>Decan II (10–19°)</strong> — the sign
                            matures; a secondary ruler adds emphasis.
                          </li>
                          <li>
                            <strong>Decan III (20–29°)</strong> —
                            refinement/mastery edge.
                          </li>
                        </ul>
                        <p>
                          In this system, Decans and their rulers set the{" "}
                          <em>style</em> of expression inside a sign.
                          <strong> Waves</strong> describe the broader harmonic
                          field; <strong>Symbols</strong> (Sabian/Chandra) speak
                          to the exact degree. Use the Decan to orient the
                          story, then let the Symbol provide the precise,
                          personal note.
                        </p>
                        <p style={{ opacity: 0.9 }}>
                          Example: <strong>Venus at 12° Leo</strong> → Leo{" "}
                          <strong>Decan II</strong> (Sun influence). The Decan
                          frames expression; the degree’s Symbols bring a custom
                          message for 12°.
                        </p>
                      </div>
                    </details>

                    {/* Quick jump to this sign's Decan Library */}
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <a
                        href={`#/library/decans/${encodeURIComponent(
                          selectedDecan.sign
                        )}/${selectedDecan.decan_number}`}
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
                        aria-label="Open Decan Library (same tab)"
                        title="Open Decan Library"
                      >
                        Learn more in Decan Library →
                      </a>
                      <a
                        href={`#/library/decans/${encodeURIComponent(
                          selectedDecan.sign
                        )}/${selectedDecan.decan_number}`}
                        target="_blank"
                        rel="noopener"
                        className="chip"
                        style={{
                          padding: "2px 8px",
                          border: "1px solid var(--rs-border)",
                          textDecoration: "none",
                        }}
                        aria-label="Open Decan Library (new tab)"
                        title="Open in new tab (↗)"
                      >
                        ↗
                      </a>
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
                      style={{
                        marginTop: 8,
                        fontStyle: "italic",
                        opacity: 0.9,
                      }}
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
                        const chips = parseWaves(
                          selectedDecan.influential_waves_a
                        );
                        if (chips.length === 10) return <Chip label="All 10" />;
                        return chips.map((n) => (
                          <Chip key={n} label={String(n)} />
                        ));
                      })()}
                    </div>

                    {/* Library links + Copy link */}
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Same-tab */}
                      <a
                        href={`#/library/decans/${encodeURIComponent(
                          selectedDecan.sign
                        )}/${selectedDecan.decan_number}`}
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
                        aria-label="Open Decan in library (same tab)"
                      >
                        Open Decan Library →
                      </a>

                      {/* New tab */}
                      <a
                        href={`#/library/decans/${encodeURIComponent(
                          selectedDecan.sign
                        )}/${selectedDecan.decan_number}`}
                        target="_blank"
                        rel="noopener"
                        className="chip"
                        style={{
                          padding: "2px 8px",
                          border: "1px solid var(--rs-border)",
                          textDecoration: "none",
                        }}
                        title="Open in a new tab"
                        aria-label="Open Decan in library (new tab)"
                      >
                        ↗
                      </a>

                      {/* Copy link */}
                      <CopyLinkButton
                        ariaLabel="Copy link to this Decan"
                        label="Copy link"
                        getHashHref={() =>
                          `#/library/decans/${encodeURIComponent(
                            selectedDecan.sign
                          )}/${selectedDecan.decan_number}`
                        }
                        className="chip"
                      />
                    </div>
                  </>
                );
              })()
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

      {/* CSV loader (hidden if showCsvLoader=false) */}
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
          Select a Wave (bottom legend) or choose a <strong>sign</strong> (Decan
          chips) to dive into Decans I/II/III.
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
