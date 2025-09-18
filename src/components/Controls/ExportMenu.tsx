import React from "react";

type Props = {
  onExportSVG: () => void;
  onExportPNG: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onLoadBuiltInContext: () => void;
};

export default function ExportMenu({
  onExportSVG,
  onExportPNG,
  onExportJSON,
  onExportCSV,
  onLoadBuiltInContext,
}: Props) {
  return (
    <details
      style={{
        marginTop: 8,
        maxWidth: 220,
        position: "sticky",
        top: 8,
      }}
    >
      <summary style={{ cursor: "pointer", userSelect: "none" }}>
        Export & Data ▾
      </summary>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 10,
        }}
      >
        <button onClick={onExportSVG}>Export SVG (vector)</button>
        <button onClick={onExportPNG}>Export PNG (image)</button>
        <button onClick={onExportJSON}>Export JSON (state)</button>
        <button onClick={onExportCSV}>Export Placements CSV</button>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.1)",
            margin: "6px 0",
          }}
        />

        <button onClick={onLoadBuiltInContext}>Load Built-in Context</button>
      </div>
    </details>
  );
}
