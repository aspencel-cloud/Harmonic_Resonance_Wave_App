import React from "react";

import { Placement } from "../../app/types";
import { signDegreeToAngle, waveIdForDegreeWithinSign } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";
import { PLANET_GLYPH } from "../../data/glyphs";
import { getWaveColor } from "../../data/waveColors";
import { getWaveName } from "../../data/waves";

/**
 * Improved collision handling:
 * - Group by (sign, floor(degree)) like your current loader does.
 * - Dynamic fan spread based on group size (up to ±10° total).
 * - Radial stepping so stacked glyphs don't overlap visually.
 */
export default function PlacementsLayer({
  cx,
  cy,
  r,
  placements,
  selectedId,
  onSelect,
  useGlyphs = true,
  onShowTooltip,
  onHideTooltip,
}: {
  cx: number;
  cy: number;
  r: number;
  placements: Placement[];
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;
  useGlyphs?: boolean;
  onShowTooltip?: (e: React.MouseEvent<SVGElement>, html: string) => void;
  onHideTooltip?: () => void;
}) {
  // 1) Group by (sign, floor(degree)) because upstream normalizes degree -> integer
  const groups = new Map<string, Placement[]>();
  for (const p of placements) {
    const deg = Math.floor(p.degree);
    const key = `${p.sign}|${deg}`;
    const arr = groups.get(key) || [];
    arr.push(p);
    groups.set(key, arr);
  }

  // Tunables: you can tweak these two for your visual taste
  const MAX_FAN_DEG = 10; // total spread limit (±10°)
  const BASE_SPREAD_DEG = 3; // minimal total spread for small groups
  const SPREAD_PER_ITEM = 0.8; // how quickly spread grows with n
  const RAD_STEP = useGlyphs ? 12 : 8; // radial separation between stacked items

  const nodes: JSX.Element[] = [];

  // 2) Render each group with dynamic fan + radial stacking
  for (const [key, rawList] of groups) {
    // stable sort by planet so behavior is predictable
    const list = [...rawList].sort((a, b) =>
      a.planet > b.planet ? 1 : a.planet < b.planet ? -1 : 0
    );

    const [sign, degStr] = key.split("|");
    const deg = parseInt(degStr, 10);
    const baseAngle = signDegreeToAngle(sign as any, deg);

    const n = list.length;
    const centerIdx = (n - 1) / 2;

    // Dynamic total spread in degrees (cap at MAX_FAN_DEG)
    // Example: n=2 => around ~3.8°, n=5 => ~7°, n>=10 => capped near 10°
    const totalSpread = Math.min(MAX_FAN_DEG, BASE_SPREAD_DEG + n * SPREAD_PER_ITEM);

    // If only one element, no angular offset; otherwise distribute across the total spread
    const denom = Math.max(n - 1, 1);

    list.forEach((p, idx) => {
      const idxCentered = idx - centerIdx;

      // Angular offset: center at baseAngle; distribute evenly within totalSpread
      const angleOffset = n > 1 ? (idxCentered * totalSpread) / denom : 0;
      const angle = baseAngle + angleOffset;

      // Radial stacking: move inward with |idxCentered|
      const radius = r - Math.abs(idxCentered) * RAD_STEP;

      const { x, y } = polarToCartesian(cx, cy, radius, angle);

      const d = Math.floor(p.degree);
      const wave = waveIdForDegreeWithinSign(d);
      const waveName = getWaveName(wave);
      const color = getWaveColor(wave);
      const glyph = PLANET_GLYPH[p.planet] || p.planet;

      const html =
        `<b>${p.planet}</b> — ${p.sign} ${d}°` +
        (wave ? `<br/><i>Wave ${wave}${waveName ? ` — ${waveName}` : ""}</i>` : "");

      const isSelected = selectedId === p.id;

      nodes.push(
        <g
          key={p.id}
          onClick={() => onSelect?.(p.id)}
          onMouseEnter={(e) => onShowTooltip?.(e, html)}
          onMouseMove={(e) => onShowTooltip?.(e, html)}
          onMouseLeave={onHideTooltip}
          style={{ cursor: "pointer" }}
        >
          {useGlyphs ? (
            <>
              <circle cx={x} cy={y} r={12} fill="var(--bg)" opacity={isSelected ? 0.95 : 0.85} />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize={20}
                fontWeight={800}
                fill={color}
                stroke="var(--bg)"
                strokeWidth={2}
                paintOrder="stroke"
                style={{ fontFamily: "serif" }}
              >
                {glyph}
              </text>
              {isSelected && (
                <circle cx={x} cy={y} r={14} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
              )}
            </>
          ) : (
            <circle
              cx={x}
              cy={y}
              r={8}
              fill={color}
              stroke={isSelected ? "var(--accent)" : "var(--bg)"}
              strokeWidth={isSelected ? 3 : 2}
            />
          )}
        </g>
      );
    });
  }

  return <g>{nodes}</g>;
}
