import React from "react";

import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";
import { SIGNS } from "../../data/signs";

export default function AnglesLayer({
  cx,
  cy,
  r,
  asc,
  mc,
}: {
  cx: number;
  cy: number;
  r: number; // to outer circle
  asc?: { sign: (typeof SIGNS)[number]; degree: number } | null;
  mc?: { sign: (typeof SIGNS)[number]; degree: number } | null;
}) {
  const lines: JSX.Element[] = [];

  if (asc) {
    const aAsc = signDegreeToAngle(asc.sign, Math.floor(asc.degree));
    const aDsc = aAsc + 180;
    const p1 = polarToCartesian(cx, cy, r, aAsc);
    const p2 = polarToCartesian(cx, cy, r, aDsc);
    lines.push(
      <line
        key="asc-dsc"
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="var(--accent)"
        strokeWidth={2}
        opacity={0.9}
      />
    );
  }
  if (mc) {
    const aMc = signDegreeToAngle(mc.sign, Math.floor(mc.degree));
    const aIc = aMc + 180;
    const p1 = polarToCartesian(cx, cy, r, aMc);
    const p2 = polarToCartesian(cx, cy, r, aIc);
    lines.push(
      <line
        key="mc-ic"
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="var(--tick)"
        strokeWidth={2}
        opacity={0.9}
      />
    );
  }

  return <g>{lines}</g>;
}
