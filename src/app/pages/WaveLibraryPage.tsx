import React from "react";
import { getWaveName } from "../../data/waves";
import {
  waveLibDetailsById,
  type WaveLibId,
  type WaveLibSection,
} from "../../data/waveLibraryDetails";

type Props = { waveId: number };

export default function WaveLibraryPage({ waveId }: Props) {
  const valid = Number.isFinite(waveId) && waveId >= 1 && waveId <= 10;
  const wd = (valid ? waveLibDetailsById[waveId as WaveLibId] : null) || null;
  const name = getWaveName(waveId) || wd?.title || "";
  const anchors = wd?.anchors || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rs-bg)",
        color: "var(--rs-fg, #ddd)",
        padding: 20,
      }}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.location.hash = "";
        }}
        style={{ textDecoration: "underline" }}
      >
        ← Back to chart
      </a>

      {!wd ? (
        <div style={{ marginTop: 16 }}>
          <h1>Wave Library</h1>
          <p>Unknown wave id: {String(waveId)}</p>
          <WaveNav current={null} />
        </div>
      ) : (
        <>
          <h1 style={{ marginTop: 12 }}>
            Wave {waveId}
            {name ? ` — ${name}` : ""}
          </h1>

          {wd.summary && (
            <p style={{ maxWidth: 900, lineHeight: 1.7, opacity: 0.95 }}>
              {wd.summary}
            </p>
          )}

          {anchors.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
                margin: "14px 0 8px",
              }}
            >
              <FactCard
                label="Anchors"
                value={anchors.map((n) => `${n}°`).join(", ")}
              />
            </div>
          ) : null}

          {(wd.sections || []).map((sec) => (
            <Section key={sec.id} section={sec} />
          ))}

          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Browse other waves</h3>
            <WaveNav current={waveId} />
          </div>
        </>
      )}
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 10,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          opacity: 0.75,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Section({ section }: { section: WaveLibSection }) {
  const { title, paragraphs = [], bullets = [] } = section;
  const hasBullets = bullets.length > 0;

  return (
    <section style={{ marginTop: 18 }}>
      <h3 style={{ margin: "0 0 6px 0" }}>{title}</h3>

      {!hasBullets &&
        paragraphs.map((p, i) => (
          <p
            key={i}
            style={{ lineHeight: 1.7, margin: "6px 0", maxWidth: 900 }}
          >
            {p}
          </p>
        ))}

      {hasBullets && (
        <ul style={{ margin: "6px 0 0 1.1rem", maxWidth: 900 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ lineHeight: 1.7, margin: "4px 0" }}>
              {b}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WaveNav({ current }: { current: number | null }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <a
          key={n}
          href={`#/library/waves/${n}`}
          className="chip"
          style={{
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 13,
            color: "inherit",
            textDecoration: "none",
            opacity: current === n ? 1 : 0.85,
            background:
              current === n ? "rgba(255,255,255,0.06)" : "transparent",
          }}
        >
          Wave {n}
        </a>
      ))}
    </div>
  );
}
