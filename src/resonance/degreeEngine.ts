// src/resonance/degreeEngine.ts
//
// The unified Degree Engine for Soul Resonance Cosmology.
//
// Input: global zodiac degree (0–359), sign, planet/point/angle name.
// Output: ResonancePlacement — the full SRC interpretation package.
//
// Canon pillars used:
//  - Wave Library
//  - Decan Library
//  - Planet Library
//  - Point Library
//  - Angle Library
//  - Degree Symbols (Sabian/Chandra) from Context CSV
//  - Mirror Logic (Axis + Codex)
//
// This file is pure logic — no UI, no DOM, no React.
// ---------------------------------------------------------------------------

import { resolveWave, getWaveMeaning } from "./waveLogic";
import { getDecanRecord } from "../data/decanLibrary";
import { getPlanetRecord } from "../data/planetLibrary";
import { getPointRecord } from "../data/pointLibrary";
import { getAngleRecord } from "../data/angleLibrary";
import { houseLibrary } from "../data/houseLibrary";

import { normSign } from "../data/aliases";

// ContextMap is loaded from context_v1.csv (Sabian/Chandra)
import type { ContextMap } from "../app/types";

// --------------------------------------
// TYPES
// --------------------------------------

export interface DegreeSymbolPackage {
  sabian: string | null;
  chandra: string | null;
  note?: string | null;
  question?: string | null;
}

export interface MirrorPackage {
  axisOppositionDegree: number; // 180° mirror
  codexMirrorDegree: number; // 360° - global degree
}

export interface ResonancePlacement {
  name: string; // planet/point/angle name
  sign: string; // normalized sign
  degree: number; // structural degree (0–29)
  globalDegree: number; // 0–359

  waveId: number | null;
  wave: any; // full WaveRecord or null

  decanIndex: 1 | 2 | 3;
  decan: any | null; // full DecanRecord

  isPlanet: boolean;
  isPoint: boolean;
  isAngle: boolean;

  archetype: any | null; // planet/point/angle record

  symbols: DegreeSymbolPackage;
  mirrors: MirrorPackage;

  // House is intentionally soft-typed here to avoid mismatch with UI types.
  house?: any | null;
}

// --------------------------------------
// RESOLVERS
// --------------------------------------

/** Structural 0–29° degree inside the sign. */
function structuralDegree(globalDeg: number): number {
  // Normalize into 0–359
  let d = globalDeg % 360;
  if (d < 0) d += 360;

  // Structural degree is the INTEGER part within the sign: 0–29
  const withinSign = d % 30;
  return Math.floor(withinSign);
}

/** Return decan index from structural degree. */
function getDecanIndex(d: number): 1 | 2 | 3 {
  if (d <= 9) return 1;
  if (d <= 19) return 2;
  return 3;
}

/** Return Degree Symbols (Sabian/Chandra) from ContextMap. */
function getSymbols(
  ctx: ContextMap,
  waveId: number | null,
  sign: string,
  name: string,
  degree: number
): DegreeSymbolPackage {
  if (!waveId) {
    return { sabian: null, chandra: null };
  }

  const waveKey = `Wave${waveId}`;
  const signKey = normSign(sign);
  const degKey = String(degree);

  const block =
    ctx?.[waveKey]?.[signKey]?.[name]?.[degKey] ||
    ctx?.[waveKey]?.[signKey]?.["*"]?.[degKey] ||
    null;

  if (!block) return { sabian: null, chandra: null };

  return {
    sabian: block.Sabian || null,
    chandra: block.Chandra || null,
    note: block.Note || null,
    question: block.Question || null,
  };
}

/** Axis + Codex Mirrors */
function getMirrors(globalDeg: number): MirrorPackage {
  let g = globalDeg % 360;
  if (g < 0) g += 360;

  return {
    axisOppositionDegree: (g + 180) % 360,
    codexMirrorDegree: (360 - g) % 360,
  };
}

/** House resolver (soft-typed). */
function resolveHouse(houseNumber?: number): any | null {
  if (!houseNumber) return null;
  const record = houseLibrary[houseNumber];
  return record ?? null;
}

// --------------------------------------
// MAIN DEGREE ENGINE RESOLVER
// --------------------------------------

export function resolvePlacement(
  name: string,
  sign: string,
  globalDegree: number,
  context: ContextMap,
  houseNumber?: number
): ResonancePlacement {
  // normalize inputs
  const cleanSign = normSign(sign);
  let gd = globalDegree % 360;
  if (gd < 0) gd += 360;
  const sd = structuralDegree(gd);

  // wave
  const waveId = resolveWave(gd, true);
  const wave = waveId ? getWaveMeaning(gd, true) : null;

  // decan
  const decanIndex = getDecanIndex(sd);
  const decan = getDecanRecord(cleanSign as any, decanIndex);

  // type resolution
  const planet = getPlanetRecord(name as any);
  const point = getPointRecord(name as any);
  const angle = getAngleRecord(name as any);

  const isPlanet = planet !== null;
  const isPoint = point !== null;
  const isAngle = angle !== null;

  const archetype = planet || point || angle || null;

  // house (optional, will be null until you pass a number in)
  const house = resolveHouse(houseNumber);

  // symbols
  const symbols = getSymbols(context, waveId, cleanSign, name, sd);

  // mirrors
  const mirrors = getMirrors(gd);

  return {
    name,
    sign: cleanSign,
    degree: sd,
    globalDegree: gd,

    waveId,
    wave,

    decanIndex,
    decan,

    isPlanet,
    isPoint,
    isAngle,
    archetype,

    symbols,
    mirrors,

    house,
  };
}
