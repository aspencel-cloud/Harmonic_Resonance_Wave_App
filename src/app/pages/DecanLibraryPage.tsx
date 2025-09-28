import React, { useEffect, useState } from "react";
import { loadDecans, type DecanRecord } from "../../data/decansLoader";

type Props = { sign: string; decan: 1 | 2 | 3 };

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export default function DecanLibraryPage({ sign, decan }: Props) {
  const [rows, setRows] = useState<DecanRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadDecans()
      .then((r) => {
        if (alive) setRows(r);
      })
      .catch((e) => {
        if (alive) setErr(String(e?.message || e));
      });
    return () => {
      alive = false;
    };
  }, []);

  const norm = (s: string) => (s || "").trim().toLowerCase();
  const rec =
    rows?.find(
      (d) => norm(d.sign) === norm(sign) && d.decan_number === decan
    ) || null;

  const validSign = SIGNS.some((s) => norm(s) === norm(sign));
  const validDec = [1, 2, 3].includes(decan);

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

      {!validSign || !validDec ? (
        <div style={{ marginTop: 16 }}>
          <h1>Decan Library</h1>
          <p>
            Unknown address: {String(sign)} / {String(decan)}
          </p>
          <SignNav currentSign={null} currentDecan={1} />
        </div>
      ) : err ? (
        <div style={{ marginTop: 16, color: "#f66" }}>Error: {err}</div>
      ) : !rows ? (
        <div style={{ marginTop: 16 }}>Loading…</div>
      ) : !rec ? (
        <div style={{ marginTop: 16 }}>
          <h1>Decan Library</h1>
          <p>
            No record found for {nice(sign)} Decan {decan}.
          </p>
          <SignNav currentSign={nice(sign)} currentDecan={decan} />
        </div>
      ) : (
        <>
          <h1 style={{ marginTop: 12 }}>
            {rec.sign} Decan {rec.decan_number} — {rec.title}
          </h1>
          <div style={{ opacity: 0.85, marginBottom: 16 }}>
            {rec.sub_sign} • Ruler: {rec.ruler} • Range: {rec.degree_range}
          </div>

          <Section title="Spark">
            <p>{rec.spark}</p>
          </Section>

          <Section title="Deep Insight">
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {rec.deep_insight}
            </p>
          </Section>

          <Section title="Poetic">
            <p style={{ fontStyle: "italic" }}>{rec.poetic}</p>
          </Section>

          <Section title="Influential Waves (A)">
            <p>{rec.influential_waves_a || "—"}</p>
          </Section>

          {rec.influential_waves_e && (
            <Section title="Influential Waves (E)">
              <p>{rec.influential_waves_e}</p>
            </Section>
          )}

          {rec.structural_tone && (
            <Section title="Structural Tone">
              <p>{rec.structural_tone}</p>
            </Section>
          )}

          {rec.field_function && (
            <Section title="Field Function">
              <p>{rec.field_function}</p>
            </Section>
          )}

          {rec.wave_summary && (
            <Section title="Wave Summary">
              <p>{rec.wave_summary}</p>
            </Section>
          )}

          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Browse decans in {rec.sign}</h3>
            <DecanNav sign={rec.sign} current={rec.decan_number} />
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Jump to another sign</h3>
            <SignNav currentSign={rec.sign} currentDecan={rec.decan_number} />
          </div>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 18 }}>
      <h3 style={{ margin: "0 0 6px 0" }}>{title}</h3>
      {children}
    </section>
  );
}

function DecanNav({ sign, current }: { sign: string; current: 1 | 2 | 3 }) {
  const nums: Array<1 | 2 | 3> = [1, 2, 3];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {nums.map((n) => (
        <a
          key={n}
          href={`#/library/decans/${encodeURIComponent(sign)}/${n}`}
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
          {["Decan I", "Decan II", "Decan III"][n - 1]}
        </a>
      ))}
    </div>
  );
}

function SignNav({
  currentSign,
  currentDecan,
}: {
  currentSign: string | null;
  currentDecan: 1 | 2 | 3;
}) {
  const SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {SIGNS.map((s) => (
        <a
          key={s}
          href={`#/library/decans/${encodeURIComponent(s)}/${currentDecan}`}
          className="chip"
          style={{
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 13,
            color: "inherit",
            textDecoration: "none",
            opacity:
              currentSign && s.toLowerCase() === currentSign.toLowerCase()
                ? 1
                : 0.85,
            background:
              currentSign && s.toLowerCase() === currentSign.toLowerCase()
                ? "rgba(255,255,255,0.06)"
                : "transparent",
          }}
        >
          {s}
        </a>
      ))}
    </div>
  );
}

function nice(s: string) {
  const t = (s || "").trim();
  return t.slice(0, 1).toUpperCase() + t.slice(1).toLowerCase();
}
