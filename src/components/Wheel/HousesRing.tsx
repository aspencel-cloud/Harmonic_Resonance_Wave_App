import React from "react";
import { SIGNS } from "../../data/signs";
import { signIndex, signByIndex } from "../../utils/orientation";
import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";

/**
 * Whole-sign houses:
 * - House 1 is the ASC sign (0..29° of that sign)
 * - Each subsequent house advances one sign clockwise
 */
export default function HousesRing({
  cx,
  cy,
  r,
  ascSign,
}: {
  cx: number;
  cy: number;
  r: number;
  ascSign?: (typeof SIGNS)[number]; // pass parsed ASC sign from raw import
}) {
  const baseSign = ascSign && SIGNS.includes(ascSign) ? ascSign : "Aries";
  const baseIdx = signIndex(baseSign as any);

  const labelR = r; // where house numbers sit
  const cuspOuterR = r + 2; // draw cusp slightly past rim for visibility
  const cuspInnerR = 0; // to center

  const lines: JSX.Element[] = [];
  const labels: JSX.Element[] = [];

  for (let i = 0; i < 12; i++) {
    const cuspSign = signByIndex(baseIdx + i);

    // Cusp spoke at 0° of the cuspSign
    const cuspAngle = signDegreeToAngle(cuspSign, 0);
    const pOuter = polarToCartesian(cx, cy, cuspOuterR, cuspAngle);
    const pInner = polarToCartesian(cx, cy, cuspInnerR, cuspAngle);

    lines.push(
      <line
        key={`house-cusp-${i}`}
        x1={pOuter.x}
        y1={pOuter.y}
        x2={pInner.x}
        y2={pInner.y}
        stroke="var(--ring)"
        strokeWidth={1.2}
        opacity={0.85}
      />
    );

    // Label at mid of the same sign (15°)
    const midAngle = signDegreeToAngle(cuspSign, 15);
    const pLabel = polarToCartesian(cx, cy, labelR, midAngle);

    labels.push(
      <text
        key={`house-label-${i}`}
        x={pLabel.x}
        y={pLabel.y + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--label)"
      >
        {i + 1}
      </text>
    );
  }

  return (
    <g>
      {lines}
      {labels}
    </g>
  );
}
