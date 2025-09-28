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
] as const;
type Sign = (typeof SIGNS)[number];

type Props = {
  selectedSign?: string | null;
  onSelect: (sign: Sign, decan: 1 | 2 | 3) => void;
};

export default function DecanLegend({ selectedSign, onSelect }: Props) {
  const openOrSelect = (
    e: React.MouseEvent<HTMLButtonElement>,
    sign: Sign,
    n: 1 | 2 | 3
  ) => {
    if (e.shiftKey) {
      const base = window.location.href.split("#")[0];
      const url = `${base}#/library/decans/${encodeURIComponent(sign)}/${n}`;
      window.open(url, "_blank", "noopener");
      return;
    }
    onSelect(sign, n);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "6px 0",
        WebkitOverflowScrolling: "touch",
      }}
      aria-label="Decan legend"
      title="Click to open the Decan Library (Shift-click for a new tab)"
    >
      {SIGNS.map((sign) =>
        [1, 2, 3].map((n) => {
          const isSel =
            selectedSign && selectedSign.toLowerCase() === sign.toLowerCase();
          return (
            <button
              key={`${sign}-${n}`}
              onClick={(e) => openOrSelect(e, sign, n as 1 | 2 | 3)}
              className="chip"
              style={{
                whiteSpace: "nowrap",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid var(--rs-border)",
                background: isSel ? "rgba(255,255,255,0.08)" : "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {sign} {["I", "II", "III"][n - 1]}
            </button>
          );
        })
      )}
    </div>
  );
}
