import React from "react";
import { SIGNS } from "../../data/signs";
import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";

export default function DegreeTicks({
  cx,
  cy,
  r,
}: {
  cx: number;
  cy: number;
  r: number;
}) {
  const outer = r;
  const major = r - 10;
  const minor = r - 6;

  const ticks: JSX.Element[] = [];
  for (const sign of SIGNS) {
    for (let d = 0; d < 30; d++) {
      const a = signDegreeToAngle(sign, d);
      const p1 = polarToCartesian(cx, cy, outer, a);
      const p2 =
        d === 0
          ? { x: cx, y: cy } // cusp line to center
          : polarToCartesian(cx, cy, d % 5 === 0 ? major : minor, a);

      ticks.push(
        <line
          key={`${sign}-${d}`}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={
            d === 0
              ? "var(--tick-strong)"
              : d % 5 === 0
              ? "var(--tick)"
              : "var(--ring)"
          }
          strokeWidth={d === 0 ? 1.6 : d % 5 === 0 ? 1.2 : 1}
          opacity={0.9}
        />
      );
    }
  }
  return <g>{ticks}</g>;
}
