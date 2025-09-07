// Polar/cartesian helpers shared by all wheel layers

/** Angle is in screen degrees (0° = right, +CW). */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

/** CW screen-arc command from startDeg -> endDeg at radius r. */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  largeArcFlag?: number
) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc =
    typeof largeArcFlag === "number"
      ? largeArcFlag
      : Math.abs(endDeg - startDeg) > 180
      ? 1
      : 0;
  const sweep = 1; // clockwise in our screen system
  return `A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}
