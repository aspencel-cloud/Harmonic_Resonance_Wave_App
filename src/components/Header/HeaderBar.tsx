import React from "react";

interface HeaderBarProps {
  appName: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSoundDemo: () => void;
  onToggleDetails: () => void;
  onCenterWheel: () => void;
}

export default function HeaderBar({
  appName,
  theme,
  onToggleTheme,
  onOpenSoundDemo,
  onToggleDetails,
  onCenterWheel,
}: HeaderBarProps) {
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
        background: "transparent",
        color: "var(--rs-text)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1 }}>{appName}</h1>
        {/* Left-side pill buttons */}
        <Pill onClick={onToggleTheme}>
          {theme === "dark" ? "Light Theme" : "Dark Theme"}
        </Pill>
        <Pill onClick={onOpenSoundDemo}>Sound Demo</Pill>
        <Pill onClick={onToggleDetails}>Toggle Details</Pill>
        <Pill onClick={onCenterWheel}>Center Wheel</Pill>
      </div>
      {/* keep right side free (future use) */}
      <div />
    </header>
  );
}
