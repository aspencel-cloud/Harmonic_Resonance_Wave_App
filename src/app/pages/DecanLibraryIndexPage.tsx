import React from "react";

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

export default function DecanLibraryIndexPage() {
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

      <h1 style={{ marginTop: 12 }}>Decan Library</h1>
      <p style={{ maxWidth: 800, lineHeight: 1.6 }}>
        Browse the three decans in each sign.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {SIGNS.map((s) => (
          <div
            key={s}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{s}</div>
            {[1, 2, 3].map((n) => (
              <a
                key={n}
                href={`#/library/decans/${encodeURIComponent(s)}/${n}`}
                className="chip"
                style={{
                  marginRight: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 13,
                  color: "inherit",
                  textDecoration: "none",
                }}
                title={`${s} — ${["Decan I", "Decan II", "Decan III"][n - 1]}`}
              >
                {["Decan I", "Decan II", "Decan III"][n - 1]}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
