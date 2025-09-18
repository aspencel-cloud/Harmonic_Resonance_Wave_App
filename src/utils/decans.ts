// src/utils/decan.ts
import { normSign } from "../data/aliases";

export type DecanSystem = "modern_elemental" | "chaldean";

const SIGN_ORDER = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Modern elemental system: each sign's 3 decans carry its element's signs in order.
// e.g., Aries decans: Aries (0–9), Leo (10–19), Sagittarius (20–29)
const ELEMENTAL_SEQUENCES: Record<string, [string, string, string]> = {
  Aries: ["Aries", "Leo", "Sagittarius"],
  Leo: ["Leo", "Sagittarius", "Aries"],
  Sagittarius: ["Sagittarius", "Aries", "Leo"],

  Taurus: ["Taurus", "Virgo", "Capricorn"],
  Virgo: ["Virgo", "Capricorn", "Taurus"],
  Capricorn: ["Capricorn", "Taurus", "Virgo"],

  Gemini: ["Gemini", "Libra", "Aquarius"],
  Libra: ["Libra", "Aquarius", "Gemini"],
  Aquarius: ["Aquarius", "Gemini", "Libra"],

  Cancer: ["Cancer", "Scorpio", "Pisces"],
  Scorpio: ["Scorpio", "Pisces", "Cancer"],
  Pisces: ["Pisces", "Cancer", "Scorpio"],
};

// Chaldean rulers (Faces) starting from Aries: Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter (repeat)
const CHALDEAN_SEQUENCE = ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"];
// Precompute 36 decans’ rulers (0 = Aries 0–9°, 1 = Aries 10–19°, ..., 35 = Pisces 20–29°)
const CHALDEAN_RULERS: string[] = Array.from({ length: 36 }, (_, i) => {
  return CHALDEAN_SEQUENCE[i % CHALDEAN_SEQUENCE.length];
});

export type DecanInfo = {
  index: 1 | 2 | 3; // 1st, 2nd, 3rd decan of the sign
  startDeg: 0 | 10 | 20; // start degree within sign
  endDeg: 9 | 19 | 29; // end degree within sign
  label: string; // e.g., "Decan 2 (Leo influence)" or "Decan 3 (Jupiter face)"
  secondary?: string; // the secondary sign (modern) or planet (chaldean)
};

export function decanIndexForDegree(degWithinSign: number): 1 | 2 | 3 {
  const d = Math.floor(Math.max(0, Math.min(29, degWithinSign)));
  if (d < 10) return 1;
  if (d < 20) return 2;
  return 3;
}

export function getDecanInfo(
  sign: string,
  degWithinSign: number,
  system: DecanSystem = "modern_elemental"
): DecanInfo {
  const s = normSign(sign);
  const idx = decanIndexForDegree(degWithinSign); // 1,2,3
  const startDeg = (idx === 1 ? 0 : idx === 2 ? 10 : 20) as 0 | 10 | 20;
  const endDeg = (idx === 1 ? 9 : idx === 2 ? 19 : 29) as 9 | 19 | 29;

  if (system === "modern_elemental") {
    const seq = ELEMENTAL_SEQUENCES[s];
    const secondary = seq ? seq[idx - 1] : undefined;
    const label = secondary ? `Decan ${idx} (${secondary} influence)` : `Decan ${idx}`;
    return { index: idx, startDeg, endDeg, label, secondary };
  }

  // chaldean
  const signBase = SIGN_ORDER.indexOf(s) * 3; // 0..33 step 3
  const faceIdx = signBase + (idx - 1); // 0..35
  const ruler = CHALDEAN_RULERS[faceIdx] || "—";
  const label = `Decan ${idx} (${ruler} face)`;
  return { index: idx, startDeg, endDeg, label, secondary: ruler };
}
