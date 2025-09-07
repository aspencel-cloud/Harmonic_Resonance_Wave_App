import { SIGNS } from "../data/signs";
import type { ContextMap } from "../app/types";

export type Sign = (typeof SIGNS)[number];

/** Aries..Pisces CCW angle in degrees (0..359). */
export function zodiacAngleCCW(sign: Sign, degree: number): number {
  const idx = SIGNS.indexOf(sign);
  if (idx < 0) throw new Error(`Unknown sign: ${sign}`);
  const d = clampInt(Math.floor(degree), 0, 29);
  return (idx * 30 + d) % 360;
}

/**
 * Screen angle (0° = right, +CW).
 * Aries 0° at top (270°) and zodiac goes CLOCKWISE: screen = 270 + zodiacCCW.
 */
export function signDegreeToAngle(sign: Sign, degree: number): number {
  const z = zodiacAngleCCW(sign, degree);
  return normDeg(270 + z);
}

/** Your canonical Wave mapping by degree remainder. */
const REMAINDER_TO_WAVE: Record<number, number> = {
  0: 1,
  1: 10,
  2: 6,
  3: 3,
  4: 7,
  5: 2,
  6: 8,
  7: 4,
  8: 9,
  9: 5,
};

/** Return Wave id (1..10) for a degree within a sign (0..29). */
export function waveIdForDegreeWithinSign(degree: number): number | null {
  const d = clampInt(Math.floor(degree), 0, 29);
  const r = d % 10;
  return REMAINDER_TO_WAVE[r] ?? null;
}

/** context["Wave{n}"][sign][planet][degreeString] -> {...} */
export function getContextEntry(
  context: ContextMap,
  waveId: number | null,
  sign: Sign,
  planet: string,
  degree: number
): any | null {
  if (!context || !waveId) return null;
  const waveKey = `Wave${waveId}`;
  const dKey = String(clampInt(Math.floor(degree), 0, 29));
  return (context as any)?.[waveKey]?.[sign]?.[planet]?.[dKey] ?? null;
}

/* helpers */
function normDeg(d: number): number {
  let x = d % 360;
  if (x < 0) x += 360;
  return x;
}
function clampInt(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v | 0));
}
