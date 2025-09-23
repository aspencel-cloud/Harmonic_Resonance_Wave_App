// src/utils/decan.ts
import { normSign } from "../data/aliases";

/**
 * Which decan system to compute:
 * - "modern_elemental": 3 decans follow the sign's element sequence (e.g., Aries → Aries/Leo/Sagittarius)
 * - "chaldean": 7-planet Chaldean Faces cycling across the 36 decans starting from Aries I = Mars
 */
export type DecanSystem = "modern_elemental" | "chaldean";

/** Canonical zodiac order for indexing helpers. */
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
  // Fire
  Aries: ["Aries", "Leo", "Sagittarius"],
  Leo: ["Leo", "Sagittarius", "Aries"],
  Sagittarius: ["Sagittarius", "Aries", "Leo"],
  // Earth
  Taurus: ["Taurus", "Virgo", "Capricorn"],
  Virgo: ["Virgo", "Capricorn", "Taurus"],
  Capricorn: ["Capricorn", "Taurus", "Virgo"],
  // Air
  Gemini: ["Gemini", "Libra", "Aquarius"],
  Libra: ["Libra", "Aquarius", "Gemini"],
  Aquarius: ["Aquarius", "Gemini", "Libra"],
  // Water
  Cancer: ["Cancer", "Scorpio", "Pisces"],
  Scorpio: ["Scorpio", "Pisces", "Cancer"],
  Pisces: ["Pisces", "Cancer", "Scorpio"],
};

/**
 * Chaldean sequence of Faces repeating through all 36 decans.
 * Starting at Aries 0–9° = Mars, then Sun, Venus, Mercury, Moon, Saturn, Jupiter, repeat…
 */
const CHALDEAN_SEQUENCE = ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"] as const;

/** Precompute 36 face rulers (0 = Aries 0–9°, 35 = Pisces 20–29°). */
const CHALDEAN_RULERS: string[] = Array.from({ length: 36 }, (_, i) => {
  return CHALDEAN_SEQUENCE[i % CHALDEAN_SEQUENCE.length];
});

/** Return 1, 2, or 3 for a degree (0–29) within a sign. */
export function decanIndexForDegree(degWithinSign: number): 1 | 2 | 3 {
  const d = Math.floor(Math.max(0, Math.min(29, degWithinSign)));
  if (d < 10) return 1;
  if (d < 20) return 2;
  return 3;
}

export type DecanInfo = {
  /** 1st, 2nd, or 3rd decan of the sign */
  index: 1 | 2 | 3;
  /** start degree (inclusive) within sign: 0, 10, 20 */
  startDeg: 0 | 10 | 20;
  /** end degree (inclusive) within sign: 9, 19, 29 */
  endDeg: 9 | 19 | 29;
  /**
   * Human-readable label:
   *  - modern: "Decan 2 (Leo influence)"
   *  - chaldean: "Decan 3 (Jupiter face)"
   */
  label: string;
  /**
   * Secondary indicator:
   *  - modern: the sub-sign name (e.g., "Leo")
   *  - chaldean: the face ruler planet (e.g., "Jupiter")
   */
  secondary?: string;
};

/**
 * Compute decan meta from a sign + degree (0–29) using the requested system.
 * Returns a simple, display-ready object. Rich prose is added elsewhere from CSV.
 */
export function getDecanInfo(
  sign: string,
  degWithinSign: number,
  system: DecanSystem = "modern_elemental"
): DecanInfo {
  const s = normSign(sign) as SignName;
  const idx = decanIndexForDegree(degWithinSign); // 1, 2, or 3
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

  // Chaldean Faces
  const signBase = SIGN_ORDER.indexOf(s) * 3; // 0,3,6,…,33
  const faceIdx = signBase + (idx - 1); // 0..35
  const ruler = CHALDEAN_RULERS[faceIdx] || "—";
  const label = `Decan ${idx} (${ruler} face)`;
  return { index: idx, startDeg, endDeg, label, secondary: ruler };
}

/** Optional helper: absolute 0–35 index (Aries 0–9° = 0 … Pisces 20–29° = 35). */
export function absoluteDecanIndex(sign: string, degWithinSign: number): number {
  const s = normSign(sign) as SignName;
  const signIdx = SIGN_ORDER.indexOf(s); // 0..11
  const d = Math.floor(Math.max(0, Math.min(29, degWithinSign)));
  const decIdx = d < 10 ? 0 : d < 20 ? 1 : 2; // 0..2
  return signIdx * 3 + decIdx; // 0..35
}
