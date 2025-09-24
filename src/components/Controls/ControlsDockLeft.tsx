import React from "react";

type Mode = "manual" | "chart";

interface ControlsDockLeftProps {
  // browsing & layout
  browseMode: boolean;
  onToggleBrowseMode: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCenterWheel?: () => void;

  // mode
  mode: Mode;
  onSwitchMode: (m: Mode) => void;

  // view toggles
  useGlyphs: boolean;
  onToggleGlyphs: () => void;

  showHouses: boolean;
  onToggleHouses: () => void;

  showAngles: boolean;
  onToggleAngles: () => void;

  showDecans: boolean;
  onToggleDecans: () => void;

  showContextLoader: boolean;
  onToggleContextLoader: () => void;
}

export function ControlsDockLeft(props: ControlsDockLeftProps) {
  const {
    browseMode,
    onToggleBrowseMode,
    sidebarOpen,
    onToggleSidebar,
    onCenterWheel,
    mode,
    onSwitchMode,
    useGlyphs,
    onToggleGlyphs,
    showHouses,
    onToggleHouses,
    showAngles,
    onToggleAngles,
    showDecans,
    onToggleDecans,
    showContextLoader,
    onToggleContextLoader,
  } = props;

  const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    ...rest
  }) => (
    <button
      {...rest}
      className="rs-btn"
      style={{
        width: "100%",
        textAlign: "left",
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
        color: "var(--rs-text)",
      }}
    >
      {children}
    </button>
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
        border: `1px solid var(--rs-border)`,
        background: active ? "var(--rs-bg)" : "var(--rs-surface)",
        color: "var(--rs-text)",
      }}
    >
      {label}
    </button>
  );

  return (
    <aside style={{ width: 260 }}>
      <div
        style={{
          position: "sticky",
          top: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Btn onClick={onToggleBrowseMode} aria-pressed={browseMode}>
          {browseMode ? "Exit Browse Waves" : "Browse Waves"}
        </Btn>

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

        <Btn onClick={onToggleSidebar} aria-pressed={sidebarOpen}>
          {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </Btn>
        <Btn onClick={onCenterWheel}>Center Wheel</Btn>

        <div
          style={{ height: 1, background: "var(--rs-border)", margin: "4px 0" }}
        />

        <Btn onClick={onToggleGlyphs} aria-pressed={useGlyphs}>
          {useGlyphs ? "Glyphs: On" : "Glyphs: Off"}
        </Btn>
        <Btn onClick={onToggleHouses} aria-pressed={showHouses}>
          {showHouses ? "Houses: On" : "Houses: Off"}
        </Btn>
        <Btn onClick={onToggleAngles} aria-pressed={showAngles}>
          {showAngles ? "Angles: On" : "Angles: Off"}
        </Btn>
        <Btn onClick={onToggleDecans} aria-pressed={showDecans}>
          {showDecans ? "Decans: On" : "Decans: Off"}
        </Btn>
        <Btn onClick={onToggleContextLoader} aria-pressed={showContextLoader}>
          {showContextLoader ? "CSV Loader: On" : "CSV Loader: Off"}
        </Btn>
      </div>
    </aside>
  );
}
