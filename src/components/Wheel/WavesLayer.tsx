import React from "react";

import { SIGNS } from "../../data/signs";
import { WAVES, getWaveName } from "../../data/waves";
import { signDegreeToAngle } from "../../utils/mapping";
import { polarToCartesian } from "../../utils/geometry";
import { getWaveColor } from "../../data/waveColors";

export default function WavesLayer({
  cx,
  cy,
  rInner,
  filterWaveId = null,
  onShowTooltip,
  onHideTooltip,
}: {
  cx: number;
  cy: number;
  rInner: number;
  filterWaveId?: number | null;
  onShowTooltip?: (e: React.MouseEvent<SVGElement>, html: string) => void;
  onHideTooltip?: () => void;
}) {
  const wavesToRender = filterWaveId ? WAVES.filter((w) => w.id === filterWaveId) : WAVES;

  return (
    <g>
      {wavesToRender.flatMap((wave) => {
        const color = getWaveColor(wave.id);
        const waveName = getWaveName(wave.id);
        return SIGNS.flatMap((sign) =>
          wave.degrees.map((d) => {
            const a = signDegreeToAngle(sign, d);
            const p = polarToCartesian(cx, cy, rInner, a);
            const html = `<b>Wave ${wave.id}${
              waveName ? ` — ${waveName}` : ""
            }</b><br/>${sign} ${d}°`;
            return (
              <circle
                key={`${wave.id}-${sign}-${d}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill={color}
                onMouseEnter={(e) => onShowTooltip?.(e, html)}
                onMouseMove={(e) => onShowTooltip?.(e, html)}
                onMouseLeave={onHideTooltip}
              />
            );
          })
        );
      })}
    </g>
  );
}
