// src/utils/orientation.ts
import { SIGNS } from "../data/signs";

export type Sign = (typeof SIGNS)[number];

/** 0..11 index for a zodiac sign (Aries=0 … Pisces=11). */
export function signIndex(sign: Sign): number {
  return SIGNS.indexOf(sign);
}

/** Wrap an integer index to 0..11 and return that zodiac sign. */
export function signByIndex(i: number): Sign {
  const n = ((i % 12) + 12) % 12;
  return SIGNS[n];
}

// Intentionally no computeRotationForAsc here (we're reverting to no rotation).
