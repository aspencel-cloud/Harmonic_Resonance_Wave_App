import React from "react";
import { getWaveName } from "../../data/waves";

export default function WaveLibraryIndexPage() {
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

      <h1 style={{ marginTop: 12 }}>Wave Library</h1>
      <p style={{ maxWidth: 800, lineHeight: 1.6 }}>
        Browse all ten Waves. Click any to see its full write-up page.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const name = getWaveName(n) || "";
          return (
            <a
              key={n}
              href={`#/library/waves/${n}`}
              style={{
                display: "block",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "12px 14px",
                color: "inherit",
                textDecoration: "none",
                background: "rgba(255,255,255,0.04)",
              }}
              title={`Wave ${n}${name ? ` — ${name}` : ""}`}
            >
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                Wave {n}
                {name ? ` — ${name}` : ""}
              </div>
              <div style={{ opacity: 0.85, marginTop: 4 }}>Open →</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
