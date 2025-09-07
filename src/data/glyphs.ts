import { Planet } from "../app/types";

/** Unicode glyphs (fallback to text if missing) */
export const PLANET_GLYPH: Record<Planet, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  "North Node": "☊",
  "South Node": "☋",
  Chiron: "⚷", // some fonts may not support; fallback handled
  Lilith: "⚸", // Black Moon Lilith alt; may fall back
  Vertex: "Vx",
  "Part of Fortune": "⊗",
  ASC: "ASC",
  DSC: "DSC",
  IC: "IC",
  MC: "MC",
};
