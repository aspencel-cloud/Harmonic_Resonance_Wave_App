import React from "react";

import { Placement } from "../types";
import { placementsToCsv, placementsToJson } from "../utils/exports";

export default function ExportPanel({
  placements,
  ascSignIndex,
}: {
  placements: Placement[];
  ascSignIndex: number;
}) {
  const onExportJSON = () => {
    const data = placementsToJson(placements, ascSignIndex);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, "placements.json");
  };
  const onExportCSV = () => {
    const data = placementsToCsv(placements, ascSignIndex);
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, "placements.csv");
  };
  return (
    <div className="export-panel">
      <button onClick={onExportJSON}>Export JSON</button>
      <button onClick={onExportCSV}>Export CSV</button>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
