import React from "react";

import { SIGNS } from "../../data/signs";
import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian, describeArc } from "../../utils/geometry";

/**
 * Low-contrast alternating sign wedges (each 30°), plus a cusp stroke at each boundary.
 */
export default function SignSectors({
  cx,
  cy,
  rOuter,
  rInner,
}: {
  cx: number;
  cy: number;
  rOuter: number; // outer radius of wedge fill (tucked under ticks)
  rInner: number; // inner radius of wedge fill (leave room for labels/dots)
}) {
  const nodes: JSX.Element[] = [];

  SIGNS.forEach((sign, i) => {
    const startA = signDegreeToAngle(sign, 0);
    const endA = signDegreeToAngle(sign, 29.999); // just shy of next sign
    const fill = i % 2 === 0 ? "var(--sectorA)" : "var(--sectorB)";

    // Wedge (donut slice)
    nodes.push(
      <path
        key={`sector-${sign}`}
        d={donutSlice(cx, cy, rInner, rOuter, startA, endA)}
        fill={fill}
        stroke="none"
      />
    );

    // Cusp stroke
    const cuspOuter = polarToCartesian(cx, cy, rOuter, startA);
    const cuspInner = polarToCartesian(cx, cy, rInner, startA);
    nodes.push(
      <line
        key={`cusp-${sign}`}
        x1={cuspOuter.x}
        y1={cuspOuter.y}
        x2={cuspInner.x}
        y2={cuspInner.y}
        stroke="var(--ring)"
        strokeWidth={1.2}
        opacity={0.7}
      />
    );
  });

  return <g>{nodes}</g>;
}

function donutSlice(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
) {
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

  const arcOuter = describeArc(cx, cy, rOuter, startDeg, endDeg, largeArc);
  const arcInner = describeArc(cx, cy, rInner, endDeg, startDeg, largeArc);

  const pOuterStart = polarToCartesian(cx, cy, rOuter, startDeg);
  const pInnerEnd = polarToCartesian(cx, cy, rInner, endDeg);

  return [
    `M ${pOuterStart.x} ${pOuterStart.y}`,
    arcOuter,
    `L ${pInnerEnd.x} ${pInnerEnd.y}`,
    arcInner,
    "Z",
  ].join(" ");
}
