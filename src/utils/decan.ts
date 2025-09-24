// src/utils/decan.ts
import { normSign } from "../data/aliases";

/** Decan systems */
export type DecanSystem = "modern_elemental" | "chaldean";

/** Canonical sign order for indexing helpers. */
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
] as const;
type SignName = (typeof SIGN_ORDER)[number];

/** Modern elemental sub-sign sequences (by primary sign). */
const ELEMENTAL_SEQUENCES: Record<SignName, [SignName, SignName, SignName]> = {
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

/** Chaldean Face rulers repeating through the 36 decans. */
const CHALDEAN_SEQUENCE = [
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
  "Saturn",
  "Jupiter",
] as const;
const CHALDEAN_RULERS: string[] = Array.from(
  { length: 36 },
  (_, i) => CHALDEAN_SEQUENCE[i % CHALDEAN_SEQUENCE.length]
);

export type DecanInfo = {
  index: 1 | 2 | 3; // decan within sign
  startDeg: 0 | 10 | 20; // inclusive
  endDeg: 9 | 19 | 29; // inclusive
  label: string; // e.g. "Decan 2 (Leo influence)" or "Decan 3 (Jupiter face)"
  secondary?: string; // modern: sub-sign; chaldean: face ruler
};

export function decanIndexForDegree(degWithinSign: number): 1 | 2 | 3 {
  const d = Math.floor(Math.max(0, Math.min(29, degWithinSign)));
  if (d < 10) return 1;
  if (d < 20) return 2;
  return 3;
}

/** Named export the app needs */
export function getDecanInfo(
  sign: string,
  degWithinSign: number,
  system: DecanSystem = "modern_elemental"
): DecanInfo {
  const s = normSign(sign) as SignName;
  const idx = decanIndexForDegree(degWithinSign); // 1 | 2 | 3
  const startDeg = (idx === 1 ? 0 : idx === 2 ? 10 : 20) as 0 | 10 | 20;
  const endDeg = (idx === 1 ? 9 : idx === 2 ? 19 : 29) as 9 | 19 | 29;

  if (system === "modern_elemental") {
    const seq = ELEMENTAL_SEQUENCES[s];
    const secondary = seq ? seq[idx - 1] : undefined;
    const label = secondary
      ? `Decan ${idx} (${secondary} influence)`
      : `Decan ${idx}`;
    return { index: idx, startDeg, endDeg, label, secondary };
  }

  // chaldean faces
  const signBase = SIGN_ORDER.indexOf(s) * 3; // 0..33 step 3
  const faceIdx = signBase + (idx - 1); // 0..35
  const ruler = CHALDEAN_RULERS[faceIdx] || "—";
  const label = `Decan ${idx} (${ruler} face)`;
  return { index: idx, startDeg, endDeg, label, secondary: ruler };
}

/** Optional helper: 0..35 absolute decan index */
export function absoluteDecanIndex(
  sign: string,
  degWithinSign: number
): number {
  const s = normSign(sign) as SignName;
  const signIdx = SIGN_ORDER.indexOf(s); // 0..11
  const d = Math.floor(Math.max(0, Math.min(29, degWithinSign)));
  const decIdx = d < 10 ? 0 : d < 20 ? 1 : 2; // 0..2
  return signIdx * 3 + decIdx; // 0..35
}
