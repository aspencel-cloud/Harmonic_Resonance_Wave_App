// Canonical Wave anchors + names

export const WAVE_DEGREE_ANCHORS: Record<number, number[]> = {
  1: [0, 10, 20],
  2: [5, 15, 25],
  3: [3, 13, 23],
  4: [7, 17, 27],
  5: [9, 19, 29],
  6: [2, 12, 22],
  7: [4, 14, 24],
  8: [6, 16, 26],
  9: [8, 18, 28],
  10: [1, 11, 21],
};

export const WAVE_NAMES: Record<number, string> = {
  1: "Root Trinity",
  2: "Soul Mirror",
  3: "Spiral Initiate",
  4: "Mystic Arc",
  5: "Edge Dancers",
  6: "Bridge Builders",
  7: "Heart Weavers",
  8: "Crystal Initiates",
  9: "Harvesters",
  10: "Genesis Mirrors",
};

export function getWaveName(id: number | null | undefined): string | null {
  if (!id) return null;
  return WAVE_NAMES[id] ?? null;
}

// Convenience array for rendering dots on the ring
export const WAVES = Object.keys(WAVE_DEGREE_ANCHORS).map((k) => {
  const id = Number(k);
  return {
    id,
    label: `Wave ${id}: ${WAVE_NAMES[id]}`,
    degrees: WAVE_DEGREE_ANCHORS[id],
  };
});
