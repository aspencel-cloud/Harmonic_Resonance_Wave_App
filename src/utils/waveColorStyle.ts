// src/utils/waveColorStyle.ts
// Bring back your original palette (including gradients) with minimal changes.
// Consumers (chips/sound UI) can keep using the same helpers as before.

import React from "react";

export type WaveKey = number | string;
type WaveId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/* -----------------------------
   1) Your palette (exact)
   - BG can be a solid hex OR a CSS gradient.
   - SOLID is a reasonable hex used for borders/alpha/text math.
------------------------------ */

// Backgrounds exactly as you provided:
const PALETTE_BG: Record<WaveId, string> = {
  1: "#8B0000", // W1
  2: "#FFB347", // W2
  3: "#9ACD32", // W3
  4: "#8A2BE2", // W4
  5: "linear-gradient(135deg, #000000, #FFFFFF)", // W5
  6: "#5DADE2", // W6
  7: "#FF69B4", // W7
  8: "linear-gradient(135deg, #FFFFFF, #ADD8E6)", // W8
  9: "#B8860B", // W9
  10: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)", // W10
};

// A single solid hex for each wave (used only for borders/alpha/text contrast).
// These are visually close to your gradients’ “average” look.
const PALETTE_SOLID: Record<WaveId, string> = {
  1: "#8B0000", // darkred
  2: "#FFB347", // apricot
  3: "#9ACD32", // yellowgreen
  4: "#8A2BE2", // blueviolet
  5: "#808080", // mid gray ≈ avg of black/white gradient
  6: "#5DADE2", // light steel blue
  7: "#FF69B4", // hotpink
  8: "#ADD8E6", // light blue ≈ avg of white→light-blue gradient
  9: "#B8860B", // dark goldenrod
  10: "#9B59B6", // pleasant purple as a single-color stand-in for the rainbow
};

/* -----------------------------
   2) Helpers
------------------------------ */

function toWaveId(wave: WaveKey): WaveId {
  if (typeof wave === "number" && Number.isFinite(wave)) {
    const n = Math.max(1, Math.min(10, Math.floor(wave)));
    return n as WaveId;
  }
  const s = String(wave).trim().toUpperCase(); // "W1" | "1"
  const m = s.match(/^W?([1-9]|10)$/);
  const n = m ? Number(m[1]) : 1;
  return Math.max(1, Math.min(10, n)) as WaveId;
}

function isHexColor(v: string): boolean {
  return /^#([0-9a-f]{6})$/i.test(v);
}

function withAlpha(hex: string, alpha: number): string {
  if (!isHexColor(hex)) return hex; // if not hex (e.g. gradient), return as-is
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function relLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLin(rgb.r);
  const G = toLin(rgb.g);
  const B = toLin(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/* -----------------------------
   3) Public API (same names)
------------------------------ */

export function waveBackground(wave: WaveKey): string {
  return PALETTE_BG[toWaveId(wave)];
}

// Solid color useful for borders / alpha overlays / places that can’t use gradients.
export function solidColorForWave(wave: WaveKey): string {
  return PALETTE_SOLID[toWaveId(wave)];
}

export function waveStroke(wave: WaveKey): string {
  // Use the solid stand-in for crisp borders.
  return solidColorForWave(wave);
}

export function barBackground(wave: WaveKey, alpha = 0.22): string {
  const bg = waveBackground(wave);
  // Bars prefer translucent solid; if background is gradient, use solid stand-in with alpha.
  return isHexColor(bg)
    ? withAlpha(bg, alpha)
    : withAlpha(solidColorForWave(wave), alpha);
}

export function chipBackground(wave: WaveKey, alpha = 0.18): string {
  const bg = waveBackground(wave);
  // Chips can show the full gradient. If hex, we add a little transparency.
  return isHexColor(bg) ? withAlpha(bg, alpha) : bg;
}

export function textColorForChip(wave: WaveKey): string {
  const bg = waveBackground(wave);
  // If it’s a gradient, choose a readable default (dark text usually wins on your gradients).
  if (!isHexColor(bg)) return "#0e1116";
  // Compute contrast for solid hex.
  return relLuminance(bg) < 0.35 ? "#ffffff" : "#0e1116";
}

export function styleFromWaveColor(
  wave: WaveKey,
  alpha = 0.18
): React.CSSProperties {
  return {
    background: chipBackground(wave, alpha),
    color: textColorForChip(wave),
    borderColor: waveStroke(wave),
  };
}
