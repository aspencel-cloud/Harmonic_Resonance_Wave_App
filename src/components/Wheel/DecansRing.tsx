// src/components/Wheel/DecansRing.tsx
import React from "react";

/**
 * DecansRing
 * Draws subtle 10° and 20° ticks for each sign as an inner ring.
 * - Pure zodiac coordinates (0° Aries = 0° to the right, increasing CCW).
 * - The parent wheel <g transform="rotate(...)"> will handle ASC alignment.
 */
export default function DecansRing({
  cx,
  cy,
  r,
  tickLen = 6,
  opacity = 0.45,
}: {
  cx: number;
  cy: number;
  r: number; // radius where ticks end (outer)
  tickLen?: number; // length of ticks inward
  opacity?: number;
}) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const lineAt = (deg: number) => {
    const t = toRad(deg);
    const x2 = cx + r * Math.cos(t);
    const y2 = cy + r * Math.sin(t);
    const x1 = cx + (r - tickLen) * Math.cos(t);
    const y1 = cy + (r - tickLen) * Math.sin(t);
    return { x1, y1, x2, y2 };
  };

  // For each sign (0..11), draw ticks at +10° and +20° within that sign
  const ticks: number[] = [];
  for (let s = 0; s < 12; s++) {
    const base = s * 30;
    ticks.push(base + 10, base + 20);
  }

  return (
    <g className="decans-ring" opacity={opacity} aria-label="Decans">
      {ticks.map((deg, i) => {
        const p = lineAt(((deg % 360) + 360) % 360);
        return (
          <line
            key={i}
            x1={p.x1}
            y1={p.y1}
            x2={p.x2}
            y2={p.y2}
            stroke="currentColor"
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
        );
      })}
    </g>
  );
}
