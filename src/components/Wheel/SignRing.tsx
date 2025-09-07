import React from "react";
import { SIGNS } from "../../data/signs";
import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";

export default function SignRing({
  cx,
  cy,
  r,
}: {
  cx: number;
  cy: number;
  r: number;
}) {
  const labelR = r - 32;

  return (
    <g>
      {SIGNS.map((sign) => {
        const angle = signDegreeToAngle(sign, 15);
        const p = polarToCartesian(cx, cy, labelR, angle);
        return (
          <text
            key={sign}
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="var(--label)"
          >
            {sign}
          </text>
        );
      })}
    </g>
  );
}
