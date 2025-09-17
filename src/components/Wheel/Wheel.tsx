import React from "react";
import DegreeTicks from "./DegreeTicks";
import SignRing from "./SignRing";
import WavesLayer from "./WavesLayer";
import PlacementsLayer from "./PlacementsLayer";
import HousesRing from "./HousesRing";
import AnglesLayer from "./AnglesLayer";
import SignSectors from "./SignSectors";
import { Placement } from "../../app/types";
import DecansRing from "./DecansRing"; // NEW

export default function Wheel({
  size,
  placements,
  selectedId,
  onSelect,
  filterWaveId,
  useGlyphs,
  rotationDeg = 0,
  showHouses,
  showDecans, // NEW
  ascSign,
  asc,
  mc,
  onShowTooltip,
  onHideTooltip,
}: {
  size: number;
  placements: Placement[];
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;
  filterWaveId?: number | null;
  useGlyphs?: boolean;
  rotationDeg?: number;
  showHouses?: boolean;
  showDecans?: boolean; // NEW
  ascSign?: any; // used by HousesRing
  asc?: { sign: any; degree: number } | null;
  mc?: { sign: any; degree: number } | null;
  onShowTooltip?: (e: React.MouseEvent<SVGElement>, html: string) => void;
  onHideTooltip?: () => void;
}) {
  const pad = 24;
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.max(40, size / 2 - pad);

  // Radii for layers
  const rimR = r;
  const sectorsOuter = r - 4; // under ticks
  const sectorsInner = r - 36; // leave room for labels + wave dots
  const wavesR = r - 20;
  const placementsR = r - 48;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
      {/* background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="transparent"
        stroke="var(--ring)"
        strokeWidth={1}
      />

      {/* rotate the whole wheel if needed */}
      <g transform={`rotate(${rotationDeg} ${cx} ${cy})`}>
        {/* sign wedges + cusp strokes */}
        <SignSectors
          cx={cx}
          cy={cy}
          rOuter={sectorsOuter}
          rInner={sectorsInner}
        />

        {/* ticks & labels */}
        <DegreeTicks cx={cx} cy={cy} r={rimR} />
        <SignRing cx={cx} cy={cy} r={rimR} />

        {/* Decans — subtle 10° / 20° ticks per sign */}
        {showDecans && (
          <DecansRing cx={cx} cy={cy} r={r - 30} tickLen={6} opacity={0.45} />
        )}

        {/* optional houses */}
        {showHouses && (
          <HousesRing cx={cx} cy={cy} r={r - 72} ascSign={ascSign} />
        )}

        {/* angles (ASC/MC) */}
        <AnglesLayer
          cx={cx}
          cy={cy}
          r={r - 58}
          asc={asc || undefined}
          mc={mc || undefined}
        />

        {/* wave dots */}
        <WavesLayer
          cx={cx}
          cy={cy}
          rInner={wavesR}
          filterWaveId={filterWaveId}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
        />

        {/* placements (glyphs or dots) */}
        <PlacementsLayer
          cx={cx}
          cy={cy}
          r={placementsR}
          placements={placements}
          selectedId={selectedId}
          onSelect={onSelect}
          useGlyphs={!!useGlyphs}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
        />
      </g>
    </svg>
  );
}
