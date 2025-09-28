import React, { useState } from "react";

type Props = {
  selectedSign: string | null; // e.g., "Aries"
  onSelect: (sign: string, decan: 1 | 2 | 3) => void;
};

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

export default function DecanLegend({ selectedSign, onSelect }: Props) {
  const [openSign, setOpenSign] = useState<string | null>(null);

  function toggleSign(sign: string) {
    setOpenSign((s) => (s === sign ? null : sign));
  }

  return (
    <div aria-label="Decan Navigator" role="group">
      {/* Row 1: Signs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SIGNS.map((sign) => (
          <button
            key={sign}
            className="chip"
            type="button"
            aria-expanded={openSign === sign}
            aria-label={`Choose ${sign} to pick a decan`}
            style={{
              opacity: selectedSign === sign ? 1 : 0.95,
              border:
                openSign === sign
                  ? "1px solid var(--rs-accent, #7aa7ff)"
                  : "1px solid var(--rs-border)",
            }}
            onClick={() => toggleSign(sign)}
          >
            {sign}
          </button>
        ))}
      </div>

      {/* Row 2: Decans for open sign */}
      {openSign && (
        <div
          style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}
        >
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className="chip"
              type="button"
              aria-label={`${openSign} Decan ${["I", "II", "III"][n - 1]}`}
              onClick={() => onSelect(openSign, n as 1 | 2 | 3)}
              title={`${openSign} — Decan ${["I", "II", "III"][n - 1]}`}
            >
              {["Decan I", "Decan II", "Decan III"][n - 1]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
