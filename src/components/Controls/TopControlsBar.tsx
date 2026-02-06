import React from "react";
import Controls from "./Controls";
import QuickControls from "./QuickControls";

type Mode = "manual" | "chart";

interface TopControlsBarProps {
  mode: Mode;
  onSwitchMode: (m: Mode) => void;

  // Shared chart input callbacks
  addPlacement: any;
  clearPlacements: () => void;
  addManyRaw?: any;
}

export default function TopControlsBar({
  mode,
  onSwitchMode,
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

  const isSinglePlacement = mode === "manual";
  const isFullChart = mode === "chart";

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
      {/* INPUT MODE selector */}
      <Group label="Input Mode">
        <Pill
          onClick={() => onSwitchMode("manual")}
          style={{ fontWeight: isSinglePlacement ? 700 : 400 }}
        >
          Single Placement
        </Pill>

        <Pill
          onClick={() => onSwitchMode("chart")}
          style={{ fontWeight: isFullChart ? 700 : 400 }}
        >
          Full Chart
        </Pill>

        <Pill disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
          Enter Birth Data
        </Pill>
      </Group>

      {/* Input area switches based on mode */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--rs-border)",
          borderRadius: 12,
          padding: "6px 10px",
          background: "var(--rs-surface)",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "var(--rs-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {isSinglePlacement ? "Single Placement" : "Full Chart Input"}
        </span>

        <div style={{ flexGrow: 1, minWidth: 0 }}>
          {isSinglePlacement ? (
            <QuickControls onAdd={addPlacement} onClear={clearPlacements} />
          ) : (
            <Controls
              onAdd={addPlacement}
              onClear={clearPlacements}
              onImport={addManyRaw}
              // 🚫 Always lock manual-add when in Full Chart mode
              lockManualAdd={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
