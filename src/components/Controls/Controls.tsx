import React, { useMemo, useState } from "react";

import { PLANETS } from "../../data/planets";
import { SIGNS } from "../../data/signs";
import { Placement, Planet, Sign } from "../../app/types";

import RawImport from "./RawImport";
import ExportMenu from "./ExportMenu";

// Export helpers you already have
import {
  exportSvg,
  exportPng,
  exportJson,
  exportCsv,
} from "../../utils/export";

type Props = {
  onAdd: (p: Placement) => void;
  onClear: () => void;

  // Optional: Raw import callback
  onImport?: (items: Omit<Placement, "id">[]) => void;

  // Optional: programmatic loader for built-in context
  onLoadBuiltInContext?: () => Promise<void> | void;

  // Optional: give us a ref to the actual wheel SVG to export that exact node
  svgRef?: React.RefObject<SVGSVGElement>;

  // Optional: data providers for JSON/CSV export
  getExportJSON?: () => unknown;
  getExportCSV?: () => Array<Record<string, unknown>>;
};

export default function Controls({
  onAdd,
  onClear,
  onImport,
  onLoadBuiltInContext,
  svgRef,
  getExportJSON,
  getExportCSV,
}: Props) {
  const [planet, setPlanet] = useState<Planet>("Sun");
  const [sign, setSign] = useState<Sign>("Aries");
  const [degree, setDegree] = useState<number>(0); // 0–29

  const isInvalid = useMemo(
    () => degree < 0 || degree > 29 || Number.isNaN(degree),
    [degree]
  );

  function handleAdd() {
    if (isInvalid) return;
    onAdd({
      id: `${planet}-${sign}-${degree}-${Math.random().toString(36).slice(2, 7)}`,
      planet,
      sign,
      degree,
    });
  }

  // ----- Export handlers -----
  const handleExportSVG = () => exportSvg(svgRef?.current, "wheel.svg");
  const handleExportPNG = () => exportPng(svgRef?.current, "wheel.png", 2);
  const handleExportJSON = () =>
    exportJson(getExportJSON ? getExportJSON() : {}, "data.json");
  const handleExportCSV = () =>
    exportCsv(getExportCSV ? getExportCSV() : [], "data.csv");

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      {/* LEFT COLUMN: Raw Import + Export/Data (kept narrow so wheel has room) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 560,
        }}
      >
        {onImport && <RawImport onImport={onImport} />}

        <ExportMenu
          onExportSVG={handleExportSVG}
          onExportPNG={handleExportPNG}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
          onLoadBuiltInContext={onLoadBuiltInContext ?? (() => {})}
        />
      </div>

      {/* RIGHT COLUMN: Manual Add controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: 560,
        }}
      >
        {/* Planet */}
        <select
          value={planet}
          onChange={(e) => setPlanet(e.target.value as Planet)}
        >
          {PLANETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Sign */}
        <select value={sign} onChange={(e) => setSign(e.target.value as Sign)}>
          {SIGNS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Degree 0–29 */}
        <select
          value={degree}
          onChange={(e) => setDegree(Number(e.target.value))}
          title="Degree within the sign (0–29)"
        >
          {Array.from({ length: 30 }, (_, d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} disabled={isInvalid}>
          Add
        </button>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
