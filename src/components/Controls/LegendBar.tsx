import React from "react";
import type { WaveKey } from "../../utils/waveColorStyle";
import {
  barBackground,
  chipBackground,
  styleFromWaveColor,
  textColorForChip,
} from "../../utils/waveColorStyle";

type Props = {
  selectedWaveId?: number | null;
  onSelect: (id: number) => void;
};

const KEYS: WaveKey[] = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
  "W9",
  "W10",
];

export default function LegendBar({ selectedWaveId, onSelect }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 10,
        padding: 10,
        borderTop: "1px solid var(--hww-card-border, rgba(255,255,255,0.12))",
        background: "var(--hww-card, rgba(255,255,255,0.04))",
      }}
    >
      {KEYS.map((key, idx) => {
        const id = idx + 1;
        const active = selectedWaveId === id;
        const swatch = styleFromWaveColor(key);
        return (
          <button
            key={key}
            onClick={() => onSelect(id)}
            title={`Wave ${id}`}
            style={{
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 12,
              border: `1px solid ${swatch.borderColor}`,
              background: chipBackground(key),
              color: textColorForChip(key), // <-- readable text for W8/W10
              cursor: "pointer",
              outline: active ? "2px solid var(--hww-text, #eaeaea)" : "none",
              boxShadow: active
                ? "0 0 0 3px rgba(255,255,255,0.15) inset"
                : "none",
              fontSize: 13,
            }}
          >
            <div style={{ opacity: 0.85, fontWeight: 600 }}>{`Wave ${id}`}</div>
            <div
              style={{
                marginTop: 6,
                height: 4,
                borderRadius: 999,
                background: barBackground(key),
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
