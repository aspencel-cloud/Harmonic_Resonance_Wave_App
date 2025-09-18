import { SIGNS } from "../data/signs";
import { Placement, Planet, Sign } from "../app/types";

// Map raw labels -> internal Planet strings
const ALIAS: Record<string, Planet> = {
  Sun: "Sun",
  Moon: "Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto",
  Node: "North Node", // “Node” -> treat as North Node by default
  "North Node": "North Node",
  "South Node": "South Node",
  Chiron: "Chiron",
  Lilith: "Lilith",
  Vertex: "Vertex",
  Fortune: "Part of Fortune", // “Fortune” -> Part of Fortune
  "Part of Fortune": "Part of Fortune",
  ASC: "ASC",
  DSC: "DSC",
  IC: "IC",
  MC: "MC",
};

// Robust degree/minutes pattern (handles 26°24’, 7°07', 0°30’, 11°)
const DEG_PATTERN = String.raw`(?<deg>\d{1,2})\s*(?:°|º)?\s*(?<min>\d{1,2})?\s*(?:['’])?`;

// Body names we recognize
const BODY_PATTERN = [
  "ASC",
  "DSC",
  "IC",
  "MC",
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
  "Node",
  "North Node",
  "South Node",
  "Chiron",
  "Lilith",
  "Vertex",
  "Fortune",
  "Part of Fortune",
].join("|");

// Signs
const SIGN_PATTERN = SIGNS.join("|");

// Main tolerant regex:
// <Body> in <Sign> <deg°min>[, Retrograde][, in <House> House]
const LINE_RE = new RegExp(
  String.raw`^\s*(?<body>${BODY_PATTERN})\s+in\s+(?<sign>${SIGN_PATTERN})\s+${DEG_PATTERN}[^]*$`,
  "i"
);

// Normalize odd characters/whitespace (DOES NOT add a degree symbol anywhere)
function normalizeLine(line: string): string {
  return line
    .replace(/\u00B0/g, "°") // standardize degree symbol
    .replace(/º/g, "°") // Spanish/Portuguese degree to standard
    .replace(/’/g, "'") // curly apostrophe to straight
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

function toPlanet(name: string): Planet | null {
  const key = Object.keys(ALIAS).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? ALIAS[key] : null;
}

function toSign(name: string): Sign | null {
  const s = SIGNS.find((x) => x.toLowerCase() === name.toLowerCase());
  return (s ?? null) as Sign | null;
}

// Convert deg/min to INTEGER degree [0..29]
function degMinToInt(degStr?: string, minStr?: string): number | null {
  if (!degStr) return null;
  const d = Number(degStr);
  const m = minStr ? Number(minStr) : 0;
  if (Number.isNaN(d) || Number.isNaN(m)) return null;

  const decimal = d + m / 60; // e.g., 26 + 24/60 = 26.4
  const floored = Math.floor(decimal); // enforce integer
  if (floored < 0 || floored >= 30) return null;
  return floored;
}

export function parseRawInput(text: string): {
  placements: Omit<Placement, "id">[];
  errors: string[];
} {
  const placements: Omit<Placement, "id">[] = [];
  const errors: string[] = [];

  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(LINE_RE);
    if (!m || !m.groups) {
      errors.push(`Line ${i + 1}: could not parse -> "${line}"`);
      continue;
    }

    const bodyRaw = m.groups.body;
    const signRaw = m.groups.sign;
    const deg = degMinToInt(m.groups.deg, m.groups.min);

    const planet = toPlanet(bodyRaw);
    const sign = toSign(signRaw);

    if (!planet) {
      errors.push(`Line ${i + 1}: unknown body "${bodyRaw}"`);
      continue;
    }
    if (!sign) {
      errors.push(`Line ${i + 1}: unknown sign "${signRaw}"`);
      continue;
    }
    if (deg === null) {
      errors.push(`Line ${i + 1}: invalid degree/minutes`);
      continue;
    }

    // Only what we need: planet, sign, integer degree (no symbols stored)
    placements.push({ planet, sign, degree: deg });
  }

  return { placements, errors };
}
