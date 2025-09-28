import * as palette from "../data/waveColors";

export type WaveKey =
  | "W1"
  | "W2"
  | "W3"
  | "W4"
  | "W5"
  | "W6"
  | "W7"
  | "W8"
  | "W9"
  | "W10";

const RESOLVED_MAP: Record<WaveKey, string> =
  (palette as any).WAVE_COLOR_MAP ||
  (palette as any).WAVE_COLORS ||
  (palette as any).default ||
  {};

const FALLBACK: Record<WaveKey, string> = {
  W1: "#8B0000",
  W2: "#FFB347",
  W3: "#9ACD32",
  W4: "#8A2BE2",
  W5: "linear-gradient(135deg, #000000, #FFFFFF)",
  W6: "#5DADE2",
  W7: "#FF69B4",
  W8: "linear-gradient(135deg, #FFFFFF, #ADD8E6)",
  W9: "#B8860B",
  W10: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
};

function getMap(): Record<WaveKey, string> {
  const keys: WaveKey[] = [
    "W1",
    "W2",
    "W3",
    "W4",
    "W5",
    "W6",
    "W7",
    "W8",
    "W9",
    "W10",
  ];
  for (const k of keys) if (!RESOLVED_MAP[k]) return FALLBACK;
  return RESOLVED_MAP as Record<WaveKey, string>;
}
const MAP = getMap();

function isGradient(v: string | undefined): v is string {
  return typeof v === "string" && v.startsWith("linear-gradient");
}

export function styleFromWaveColor(key: WaveKey) {
  const c = MAP[key] || "#888888";
  if (isGradient(c))
    return { background: c, borderColor: "rgba(255,255,255,0.35)" };
  return { background: c, borderColor: `${c}55` };
}
export function barBackground(key: WaveKey) {
  const c = MAP[key] || "#888888";
  return isGradient(c) ? c : `linear-gradient(90deg, ${c}, transparent)`;
}
export function chipBackground(key: WaveKey) {
  const c = MAP[key] || "#888888";
  return isGradient(c) ? c : `${c}22`;
}
// …existing imports + helpers above…

export function textColorForChip(key: WaveKey): string {
  // Chips with very light backgrounds need dark text
  switch (key) {
    case "W8": // White → Light Blue crystalline
      return "#121212";
    case "W10": // Rainbow – mostly light overall
      return "#121212";
    default:
      // Default chip text: use the app's text var (light in dark mode)
      return "var(--hww-text, #eaeaea)";
  }
}
