import React from "react";
import Controls from "./Controls";

type Mode = "manual" | "chart";

interface TopControlsBarProps {
  // Mode
  mode: Mode;
  onSwitchMode: (m: Mode) => void;

  // Data / loader / export
  loadBuiltInContext: () => void;
  getExportJSON: () => any;
  getExportCSV: () => any[];

  // Controls (add/import/export)
  addPlacement: any;
  clearPlacements: () => void;
  addManyRaw?: any;
}

export default function TopControlsBar({
  mode,
  onSwitchMode,
  loadBuiltInContext,
  getExportJSON,
  getExportCSV,
  addPlacement,
  clearPlacements,
  addManyRaw,
}: TopControlsBarProps) {
  const Pill: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    style,
    ...rest
  }) => (
    <button
      {...rest}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
        color: "var(--rs-text)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );

  const Group: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px solid var(--rs-border)",
        borderRadius: 12,
        background: "var(--rs-surface)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "var(--rs-muted)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        padding: "10px 0 6px",
      }}
    >
      <Group label="Mode">
        <Pill
          onClick={() => onSwitchMode("manual")}
          style={{ fontWeight: mode === "manual" ? 700 : 400 }}
        >
          Manual
        </Pill>
        <Pill
          onClick={() => onSwitchMode("chart")}
          style={{ fontWeight: mode === "chart" ? 700 : 400 }}
        >
          Chart
        </Pill>
      </Group>

      {/* Raw Import + Export & Data controls (no CSV toggle) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--rs-border)",
          borderRadius: 12,
          padding: "6px 10px",
          background: "var(--rs-surface)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "var(--rs-muted)",
          }}
        >
          Export & Data
        </span>
        <Controls
          onAdd={addPlacement}
          onClear={clearPlacements}
          onImport={addManyRaw}
          onLoadBuiltInContext={loadBuiltInContext}
          getExportJSON={getExportJSON}
          getExportCSV={getExportCSV}
        />
      </div>
    </div>
  );
}
