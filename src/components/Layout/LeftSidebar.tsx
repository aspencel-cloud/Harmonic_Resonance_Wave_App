import React from "react";
import Controls from "../Controls/Controls";

type Mode = "manual" | "chart";

interface LeftSidebarProps {
  // App-level actions
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSoundDemo: () => void;

  // App mode
  mode: Mode;
  onSwitchMode: (m: Mode) => void;

  // View toggles
  useGlyphs: boolean;
  setUseGlyphs: (v: boolean) => void;
  showHouses: boolean;
  setShowHouses: (v: boolean) => void;
  showAngles: boolean;
  setShowAngles: (v: boolean) => void;
  showDecans: boolean;
  setShowDecans: (v: boolean) => void;

  // Data / loader
  showContextLoader: boolean;
  setShowContextLoader: (v: boolean) => void;
  loadBuiltInContext: () => void;
  getExportJSON: () => any;
  getExportCSV: () => any[];

  // Controls (add/import/export)
  addPlacement: any;
  clearPlacements: () => void;
  addManyRaw?: any;

  // Layout actions
  onCenterWheel: () => void;
  onToggleSidebar: () => void;
}

export default function LeftSidebar({
  theme,
  onToggleTheme,
  onOpenSoundDemo,
  mode,
  onSwitchMode,
  useGlyphs,
  setUseGlyphs,
  showHouses,
  setShowHouses,
  showAngles,
  setShowAngles,
  showDecans,
  setShowDecans,
  showContextLoader,
  setShowContextLoader,
  loadBuiltInContext,
  getExportJSON,
  getExportCSV,
  addPlacement,
  clearPlacements,
  addManyRaw,
  onCenterWheel,
  onToggleSidebar,
}: LeftSidebarProps) {
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <section style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "var(--rs-muted)",
          margin: "2px 0 8px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </section>
  );

  const SegBtn: React.FC<{
    active?: boolean;
    onClick?: () => void;
    label: string;
  }> = ({ active, onClick, label }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid var(--rs-border)",
        background: active ? "var(--rs-bg)" : "var(--rs-surface)",
        color: "var(--rs-text)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    style,
    ...rest
  }) => (
    <button
      {...rest}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
        color: "var(--rs-text)",
        textAlign: "left",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );

  return (
    <aside
      style={{
        width: 300, // a touch wider
        borderRight: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflow: "auto",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <Section title="App">
        <Btn onClick={onToggleTheme}>
          {theme === "dark" ? "Light Theme" : "Dark Theme"}
        </Btn>
        <Btn onClick={onOpenSoundDemo}>Sound Demo</Btn>
        <Btn onClick={onToggleSidebar}>Toggle Right Sidebar</Btn>
      </Section>

      <Section title="Mode">
        <div style={{ display: "flex", gap: 8 }}>
          <SegBtn
            label="Manual"
            active={mode === "manual"}
            onClick={() => onSwitchMode("manual")}
          />
          <SegBtn
            label="Chart"
            active={mode === "chart"}
            onClick={() => onSwitchMode("chart")}
          />
        </div>
      </Section>

      <Section title="View">
        <Btn onClick={() => setUseGlyphs(!useGlyphs)}>
          {useGlyphs ? "Glyphs: On" : "Glyphs: Off"}
        </Btn>
        <Btn onClick={() => setShowHouses(!showHouses)}>
          {showHouses ? "Houses: On" : "Houses: Off"}
        </Btn>
        <Btn onClick={() => setShowAngles(!showAngles)}>
          {showAngles ? "Angles: On" : "Angles: Off"}
        </Btn>
        <Btn onClick={() => setShowDecans(!showDecans)}>
          {showDecans ? "Decans: On" : "Decans: Off"}
        </Btn>
      </Section>

      <Section title="Data & Export">
        <Controls
          onAdd={addPlacement}
          onClear={clearPlacements}
          onImport={addManyRaw}
          onLoadBuiltInContext={loadBuiltInContext}
          getExportJSON={getExportJSON}
          getExportCSV={getExportCSV}
        />
        <Btn onClick={() => setShowContextLoader(!showContextLoader)}>
          {showContextLoader ? "CSV Loader: On" : "CSV Loader: Off"}
        </Btn>
      </Section>

      <Section title="Actions">
        <Btn onClick={onCenterWheel}>Center Wheel</Btn>
      </Section>
    </aside>
  );
}
