import React from "react";

interface LegalNoticeProps {
  onOpenTerms: () => void;
}

export function LegalNotice({ onOpenTerms }: LegalNoticeProps) {
  return (
    <footer
      style={{
        width: "100%",
        borderTop: "1px solid var(--rs-border)",
        background: "var(--rs-surface)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--rs-muted)",
          fontSize: 13,
        }}
      >
        <span>© 2025 Angela Spenceley. All rights reserved.</span>
        <button
          onClick={onOpenTerms}
          style={{
            border: "1px solid var(--rs-border)",
            background: "transparent",
            color: "var(--rs-text)",
            borderRadius: 8,
            padding: "4px 8px",
          }}
        >
          Terms of Use
        </button>
      </div>
    </footer>
  );
}

// Optional: keep a default too (harmless either way)
export default LegalNotice;
