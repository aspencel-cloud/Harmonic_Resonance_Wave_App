/** High-contrast, colorblind-friendly palette (Tableau 10–style) */
export const WAVE_COLORS: Record<number, string> = {
  1: "#E15759", // red
  2: "#4E79A7", // blue
  3: "#59A14F", // green
  4: "#F28E2B", // orange
  5: "#B07AA1", // purple
  6: "#EDC948", // yellow
  7: "#76B7B2", // teal
  8: "#FF9DA7", // pink
  9: "#9C755F", // brown
  10: "#17BECF", // cyan
};

export function getWaveColor(id?: number | null): string {
  return (id && WAVE_COLORS[id]) || "var(--placement)";
}
