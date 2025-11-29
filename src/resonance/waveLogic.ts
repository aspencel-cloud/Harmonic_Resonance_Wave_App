// src/resonance/waveLogic.ts
//
// Pure Wave-resolution logic for the Resonance Engine.
// No UI imports. No app state dependencies. Canon-only logic.
// ------------------------------------------------------------

import { WAVE_DEGREE_ANCHORS, type WaveId, getWaveRecord } from "../data/waves";

/**
 * Given a 0–29 degree within a sign,
 * return the WaveId (1–10) whose anchor list includes this degree.
 *
 * If no exact match is found (should not happen under Canon rules),
 * we return null.
 */
export function waveFromStructuralDegree(degree: number): WaveId | null {
  if (!Number.isFinite(degree)) return null;

  const d = Math.floor(degree);
  if (d < 0 || d > 29) return null;

  // Look for Wave whose anchor list includes this degree
  for (const key of Object.keys(WAVE_DEGREE_ANCHORS)) {
    const id = Number(key) as WaveId;
    if (WAVE_DEGREE_ANCHORS[id].includes(d)) {
      return id;
    }
  }

  return null;
}

/**
 * Given a 0–359 global zodiac degree,
 * convert to structural degree (0–29)
 * then resolve the Wave.
 */
export function waveFromGlobalDegree(globalDegree: number): WaveId | null {
  if (!Number.isFinite(globalDegree)) return null;

  let gd = globalDegree % 360;
  if (gd < 0) gd += 360;

  // What matters for Wave mapping is only the degree *within* the sign → (0–29)
  const structural = gd % 30;

  return waveFromStructuralDegree(structural);
}

/**
 * Generic resolver that accepts:
 *  - structural degree (0–29)
 *  - global zodiac degree (0–359)
 *  - fractional degree within a sign (e.g., 19.38)
 *
 * And automatically selects the right resolver.
 *
 * If `isGlobal = true`, interpret the input as global zodiac degree.
 * Otherwise interpret as degree-within-sign.
 */
export function resolveWave(
  degree: number,
  isGlobal: boolean = false
): WaveId | null {
  if (!Number.isFinite(degree)) return null;
  return isGlobal
    ? waveFromGlobalDegree(degree)
    : waveFromStructuralDegree(degree);
}

/**
 * Return the full WaveRecord (with Canon + practitioner layers),
 * or null if no Wave matches.
 *
 * This gives the Resonance Engine the full wave metadata.
 */
export function getWaveMeaning(degree: number, isGlobal = false) {
  const waveId = resolveWave(degree, isGlobal);
  if (!waveId) return null;
  return getWaveRecord(waveId);
}

/**
 * Utility for debugging or export:
 * Returns the anchor map in an easy-to-inspect array form.
 */
export function listWaves() {
  return Object.keys(WAVE_DEGREE_ANCHORS).map((k) => {
    const id = Number(k) as WaveId;
    return {
      id,
      anchors: WAVE_DEGREE_ANCHORS[id],
      ...getWaveRecord(id),
    };
  });
}
