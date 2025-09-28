// src/components/Sidebar/LayerExamples.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  LayerExample,
  ExampleSection,
} from "../../data/layerExamplesCsvLoader";
import {
  loadDecans,
  getDecan,
  type DecanRecord,
} from "../../data/decansLoader";
import { normSign } from "../../data/aliases";
import { waveDetailsById, type WaveId } from "../../data/waveDetails";
import { waveIdForDegreeWithinSign } from "../../utils/mapping";

type Props = {
  examples: LayerExample[];
  storageKey?: string; // persist which example is selected
};

const STORAGE_KEY_DEFAULT = "hww.ui.exampleIndex";

const roman = (n: number) =>
  n === 1 ? "I" : n === 2 ? "II" : n === 3 ? "III" : String(n);
const ordinal = (n: number) =>
  n % 100 >= 11 && n % 100 <= 13
    ? `${n}th`
    : `${n}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][n % 10]}`;

// Strip "(3°, 13°, 23°)"-style anchors at the end
const stripAnchorTuple = (s: string) =>
  s.replace(/\(\s*\d{1,2}°\s*,\s*\d{1,2}°\s*,\s*\d{1,2}°\s*\)\s*$/u, "").trim();

// Strip leading "Wave N" (any of :, -, —) and any trailing anchor tuple
const cleanWaveLabel = (raw?: string | null, n?: number | null) => {
  if (!raw) return "";
  let s = raw.trim();
  if (n != null) {
    s = s.replace(
      new RegExp(`^\\s*wave\\s*${n}\\s*(?:[:\\-–—]\\s*)?`, "i"),
      ""
    );
  } else {
    s = s.replace(/^\s*wave\s*\d{1,2}\s*(?:[:\-–—]\s*)?/i, "");
  }
  s = stripAnchorTuple(s);
  return s.trim();
};

const LayerExamples: React.FC<Props> = ({
  examples,
  storageKey = STORAGE_KEY_DEFAULT,
}) => {
  const safe = Array.isArray(examples) ? examples : [];

  // Load decan metadata (title/ruler) so we can enrich headings
  const [decans, setDecans] = useState<DecanRecord[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadDecans()
      .then((rows) => alive && setDecans(rows))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Selected example index
  const [idx, setIdx] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? Math.max(0, Math.min(safe.length - 1, n)) : 0;
    } catch {
      return 0;
    }
  });

  // Expand/collapse long content
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(idx));
    } catch {}
  }, [idx, storageKey]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setExpanded(false);
  }, [idx]);

  const has = safe.length > 0;
  const current = useMemo(() => (has ? safe[idx] : null), [safe, idx, has]);

  // Truth-source wave: compute from degree, not CSV
  const computedWaveNum = useMemo(() => {
    if (!current) return null;
    const n = waveIdForDegreeWithinSign(current.degree);
    return typeof n === "number" && n >= 1 && n <= 10 ? n : null;
  }, [current]);

  // Build headings that match the style of the static example
  const waveHeading = useMemo(() => {
    if (!current) return "";
    const n = computedWaveNum;

    // Prefer built-in wave title for the computed wave; fall back to CSV label
    const builtInRaw = n ? (waveDetailsById[n as WaveId]?.title ?? "") : "";
    const builtInClean = cleanWaveLabel(builtInRaw, n);
    const csvClean = cleanWaveLabel(current.waveLabel ?? "", n);
    const label = builtInClean || csvClean;

    // Anchors from built-ins (e.g., [5°, 15°, 25°]) — add once
    const anchors =
      n && waveDetailsById[n as WaveId]?.anchors?.length
        ? ` (${waveDetailsById[n as WaveId].anchors.join("°, ")}°)`
        : "";

    return `1) Wave (the harmonic field) → ${n ? `Wave ${n}` : "Wave ?"}${label ? `: ${label}` : ""}${anchors}`;
  }, [current, computedWaveNum]);

  const decanHeading = useMemo(() => {
    if (!current) return "2) Decan (the archetypal stage)";
    const n = current.decanNum ?? null; // CSV decan number is fine for I/II/III display
    const sign = current.sign;

    let suffix = "";
    if (decans) {
      const rec = getDecan(decans, normSign(sign), current.degree);
      if (rec)
        suffix = `: ${rec.title}${rec.ruler ? ` (${rec.ruler} influence)` : ""}`;
    }

    return `2) Decan (the archetypal stage) → ${sign} Decan ${n ? roman(n) : "?"}${suffix}`;
  }, [current, decans]);

  const symbolHeading = useMemo(() => {
    if (!current) return "3) Symbols (the precise note)";
    const sabian = current.degree + 1; // 0..29 -> 1..30 for Sabian/Chandra
    return `3) Symbols (the precise note) → ${sabian}° ${current.sign} (${ordinal(sabian)} degree)`;
  }, [current]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIdx((i) => (i - 1 + safe.length) % safe.length);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIdx((i) => (i + 1) % safe.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setIdx(safe.length - 1);
    }
  };

  if (!has) return null;

  const maxH = expanded ? undefined : 300;

  // Sections come in the order Wave / Decan / Symbols from the loader
  const waveSec: ExampleSection | undefined = current?.sections[0];
  const decanSec: ExampleSection | undefined = current?.sections[1];
  const symSec: ExampleSection | undefined = current?.sections[2];

  return (
    <div
      role="region"
      aria-label="Layer examples"
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{
        border: "1px solid var(--rs-border)",
        borderRadius: 10,
        padding: 8,
        background: "var(--rs-surface)",
      }}
    >
      {/* Header / Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.2,
            marginRight: 8,
          }}
        >
          {current?.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            className="chip"
            aria-label="Previous example"
            onClick={() => setIdx((i) => (i - 1 + safe.length) % safe.length)}
            title="Previous (←)"
          >
            ←
          </button>
          <span style={{ fontSize: 12, opacity: 0.85 }}>
            {idx + 1}/{safe.length}
          </span>
          <button
            type="button"
            className="chip"
            aria-label="Next example"
            onClick={() => setIdx((i) => (i + 1) % safe.length)}
            title="Next (→)"
          >
            →
          </button>
          <button
            type="button"
            className="chip"
            aria-label={expanded ? "Collapse example" : "Expand example"}
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▾ Collapse" : "▸ Expand"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          maxHeight: maxH,
          overflowY: expanded ? "visible" : "auto",
          paddingRight: 4,
        }}
      >
        {/* Wave */}
        {waveSec ? (
          <div style={{ marginTop: 0 }}>
            <div style={{ fontWeight: 600 }}>{waveHeading}</div>
            {waveSec.paragraphs.map((p, j) => (
              <p key={j} style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {/* Decan */}
        {decanSec ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 600 }}>{decanHeading}</div>
            {decanSec.paragraphs.map((p, j) => (
              <p key={j} style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {/* Symbols */}
        {symSec ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 600 }}>{symbolHeading}</div>
            {symSec.paragraphs.map((p, j) => (
              <p key={j} style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {/* Synthesis footer */}
        {current?.footer ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>🔑 Synthesis</div>
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {current.footer}
            </p>
          </div>
        ) : null}
      </div>

      {/* Dot nav */}
      {safe.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          {safe.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to example ${i + 1}`}
              className="chip"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                padding: 0,
                border: "1px solid var(--rs-border)",
                opacity: i === idx ? 1 : 0.6,
              }}
              onClick={() => setIdx(i)}
              title={`Example ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LayerExamples;
