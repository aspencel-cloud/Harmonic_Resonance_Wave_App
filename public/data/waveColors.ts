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

export const WAVE_COLOR_MAP: Record<WaveKey, string> = {
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

// Compatibility aliases so ANY old import still works
export const WAVE_COLORS = WAVE_COLOR_MAP;
export default WAVE_COLOR_MAP;
