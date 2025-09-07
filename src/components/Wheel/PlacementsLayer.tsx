import React from "react";
import { Placement } from "../../app/types";
import {
  signDegreeToAngle,
  waveIdForDegreeWithinSign,
} from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";
import { PLANET_GLYPH } from "../../data/glyphs";
import { getWaveColor } from "../../data/waveColors";
import { getWaveName } from "../../data/waves";

/**
 * Group overlapping placements by (sign, floor(degree)) and spread them
 * using a small angular fan + radial stepping for readability.
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
  const groups = new Map<string, Placement[]>();
  for (const p of placements) {
    const deg = Math.floor(p.degree);
    const key = `${p.sign}|${deg}`;
    const arr = groups.get(key) || [];
    arr.push(p);
    groups.set(key, arr);
  }

  const ANG_STEP = 1.15;
  const RAD_STEP = useGlyphs ? 12 : 8;
  const BASE_R = r;

  const nodes: JSX.Element[] = [];

  for (const [key, rawList] of groups) {
    const list = [...rawList].sort((a, b) =>
      a.planet > b.planet ? 1 : a.planet < b.planet ? -1 : 0
    );
    const [sign, degStr] = key.split("|");
    const deg = parseInt(degStr, 10);
    const baseAngle = signDegreeToAngle(sign as any, deg);
    const n = list.length;
    const centerIdx = (n - 1) / 2;

    list.forEach((p, idx) => {
      const idxCentered = idx - centerIdx;
      const a = baseAngle + idxCentered * ANG_STEP;
      const radius = BASE_R - Math.abs(idxCentered) * RAD_STEP;
      const { x, y } = polarToCartesian(cx, cy, radius, a);

      const d = Math.floor(p.degree);
      const wave = waveIdForDegreeWithinSign(d);
      const waveName = getWaveName(wave);
      const color = getWaveColor(wave);
      const glyph = PLANET_GLYPH[p.planet] || p.planet;

      const html =
        `<b>${p.planet}</b> — ${p.sign} ${d}°` +
        (wave
          ? `<br/><i>Wave ${wave}${waveName ? ` — ${waveName}` : ""}</i>`
          : "");

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
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="var(--bg)"
                opacity={isSelected ? 0.95 : 0.85}
              />
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
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                />
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
