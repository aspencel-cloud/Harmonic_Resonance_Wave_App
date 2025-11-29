// src/resonance/appBridge.ts
//
// Bridge between the existing app Placement type and the
// resonance engine (degreeEngine + readingBuilder).
//

import type { Placement, ContextMap } from "../app/types";
import { resolvePlacement } from "./degreeEngine";
import { buildResonanceReading, type ResonanceReading } from "./readingBuilder";
import { normSign } from "../data/aliases";

// Keep sign ordering consistent across the app and engine
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

const SIGN_INDEX: Record<string, number> = SIGN_ORDER.reduce(
  (acc, sign, idx) => {
    acc[sign] = idx;
    return acc;
  },
  {} as Record<string, number>
);

function signToIndex(sign: string): number {
  // Use the app's normalisation so "leo", "LEO" etc. all match
  const norm = normSign(sign);
  // normSign returns things like "Leo", "Scorpio" etc.
  return SIGN_INDEX[norm] ?? 0;
}

/**
 * Convert a local sign-degree placement into a global degree.
 * Assumes placement.degree is 0–29 within the sign.
 */
function toGlobalDegree(p: Placement): number {
  const idx = signToIndex(p.sign);
  const structural = Math.floor(p.degree);
  return idx * 30 + structural;
}

/**
 * Build a full resonance reading for an existing app Placement.
 *
 * Returns null if something fundamental is missing.
 */
export function buildReadingForPlacement(
  placement: Placement | null | undefined,
  context: ContextMap | null
): ResonanceReading | null {
  if (!placement) return null;

  const globalDegree = toGlobalDegree(placement);

  // Try to extract a house number if the Placement carries one.
  // This is deliberately soft to avoid type fights while you migrate.
  const houseNumber: number | undefined =
    (placement as any).house ?? (placement as any).houseNumber ?? undefined;

  // Degree engine -> ResonancePlacement
  const resPlacement = resolvePlacement(
    placement.planet,
    placement.sign,
    globalDegree,
    context as any, // existing behaviour
    houseNumber
  );

  // Reading builder -> ResonanceReading (uses context for symbols)
  return buildResonanceReading(resPlacement, context);
}
