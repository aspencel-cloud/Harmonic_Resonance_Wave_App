import React from "react";

import { WAVE_DEGREE_ANCHORS, WAVE_NAMES } from "../../data/waves";
import { getWaveColor } from "../../data/waveColors";

export default function LegendBar({
  selectedWaveId,
  onSelect,
}: {
  selectedWaveId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const waves = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 8,
      }}
    >
      {waves.map((id) => {
        const color = getWaveColor(id);
        const name = WAVE_NAMES[id];
        const anchors = WAVE_DEGREE_ANCHORS[id].map((d) => `${d}°`).join(", ");
        const active = selectedWaveId === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(active ? null : id)}
            title={`Wave ${id} — ${name} (${anchors})`}
            style={{
              borderRadius: 999,
              padding: "4px 10px",
              border: `1px solid ${color}`,
              background: active ? color : "transparent",
              color: active ? "#000" : "var(--text)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 999,
                background: color,
                outline: active ? "2px solid #000" : "none",
              }}
            />
            Wave {id}
          </button>
        );
      })}
    </div>
  );
}
