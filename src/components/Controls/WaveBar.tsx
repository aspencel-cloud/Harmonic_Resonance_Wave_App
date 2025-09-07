import React from "react";
import { WAVES } from "../../data/waves";
import { getWaveColor } from "../../data/waveColors";

export default function WaveBar({
  onSelect,
  selectedWaveId,
}: {
  onSelect?: (id: number | null) => void;
  selectedWaveId?: number | null;
}) {
  return (
    <div
      style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}
    >
      {WAVES.map((w) => {
        const label = `${w.label} — ${w.degrees
          .map((d) => `${d}°`)
          .join(", ")}`;
        const isActive = selectedWaveId === w.id;
        const color = getWaveColor(w.id);

        return (
          <button
            key={w.id}
            title={label}
            onClick={() => onSelect?.(isActive ? null : w.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              background: isActive ? "#f3f4f6" : "#fff",
              cursor: "pointer",
              borderRadius: 6,
              fontWeight: 500,
              opacity: isActive ? 1 : selectedWaveId ? 0.5 : 1,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: color,
                display: "inline-block",
              }}
            />
            {w.label}
          </button>
        );
      })}
    </div>
  );
}
