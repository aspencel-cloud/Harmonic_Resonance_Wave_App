import React from "react";
import { Placement } from "../types";
import { SIGNS, houseFromAsc } from "../utils/astro";
import { getWave } from "../utils/waves";

type Props = {
  target: Placement | null;
  ascSignIndex: number;
};

export default function Tooltip({ target, ascSignIndex }: Props) {
  if (!target) return null;
  const wave = getWave(target.degree);
  const sign = SIGNS[target.signIndex];
  const house = houseFromAsc(ascSignIndex, target.signIndex);
  return (
    <div className="tooltip">
      <div className="t-row">
        <span className="t-key">Planet</span>
        <span>{target.planet}</span>
      </div>
      <div className="t-row">
        <span className="t-key">Sign</span>
        <span>
          {sign} {target.degree.toFixed(2)}°
        </span>
      </div>
      <div className="t-row">
        <span className="t-key">House</span>
        <span>{house}</span>
      </div>
      <div className="t-row">
        <span className="t-key">Wave</span>
        <span>
          {wave.id} — {wave.name}
        </span>
      </div>
      {target.data?.Sabian && (
        <div className="t-row">
          <span className="t-key">Sabian</span>
          <span>{String(target.data.Sabian)}</span>
        </div>
      )}
      {target.data?.Chandra && (
        <div className="t-row">
          <span className="t-key">Chandra</span>
          <span>{String(target.data.Chandra)}</span>
        </div>
      )}
    </div>
  );
}
