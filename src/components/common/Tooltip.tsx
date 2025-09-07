import React from "react";

export type TooltipData = {
  x: number; // px relative to container
  y: number; // px relative to container
  html: string;
};

export default function Tooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;
  const { x, y, html } = data;
  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(x + 12),
        top: Math.round(y + 12),
        maxWidth: 280,
        background: "var(--bg)",
        color: "var(--fg)",
        border: "1px solid var(--btn-border)",
        borderRadius: 8,
        padding: "8px 10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        fontSize: 12,
        zIndex: 20,
        pointerEvents: "none",
        lineHeight: 1.35,
        whiteSpace: "pre-wrap",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
