// src/resonance/symbolLogic.ts

import type {
  MirrorSymbolSet,
  Sign,
  SymbolEntry,
  SymbolSetId,
} from "./resonanceTypes";
import {
  fromGlobalDegree,
  getSymbolIndex,
  toGlobalDegree,
  oppositeSign,
} from "./mirrorLogic";

/**
 * Core symbol lookup. Wire this to your degree symbol library
 * (Sabian + Chandra). For now it uses placeholders.
 */
export function lookupSymbol(
  set: SymbolSetId,
  sign: Sign,
  symbolIndex: number
): SymbolEntry {
  // TODO: hook into your actual symbol DB (likely via context_v1.csv or a new file).
  //
  // Example shape:
  //   const entry = symbols[set][sign][symbolIndex];
  //   return {
  //     id: entry.id,
  //     title: entry.title,
  //     text: entry.text,
  //   };

  return {
    id: `${set}-${sign}-${symbolIndex}`,
    title: `${set} ${sign} ${symbolIndex}`,
    text: `${set} symbol text placeholder for ${sign} ${symbolIndex}.`,
  };
}

/**
 * Build the main degree’s Sabian + Chandra pair.
 */
export function getPrimarySymbols(
  sign: Sign,
  localStructuralDegree: number
): {
  sabian: SymbolEntry;
  chandra: SymbolEntry;
  symbolIndex: number;
} {
  const symbolIndex = getSymbolIndex(localStructuralDegree);
  const sabian = lookupSymbol("Sabian", sign, symbolIndex);
  const chandra = lookupSymbol("Chandra", sign, symbolIndex);
  return { sabian, chandra, symbolIndex };
}

/**
 * Axis mirror symbols:
 * - Opposite sign
 * - Same local structural degree
 * - Therefore same symbolIndex (1–30)
 */
export function getAxisMirrorSymbols(
  sign: Sign,
  localStructuralDegree: number
): MirrorSymbolSet {
  const axisSign = oppositeSign(sign);
  const symbolIndex = getSymbolIndex(localStructuralDegree);
  const globalDegree = toGlobalDegree(axisSign, localStructuralDegree);

  const sabian = lookupSymbol("Sabian", axisSign, symbolIndex);
  const chandra = lookupSymbol("Chandra", axisSign, symbolIndex);

  return {
    sign: axisSign,
    degree: localStructuralDegree,
    globalDegree,
    symbolIndex,
    sabian,
    chandra,
  };
}

/**
 * Codex mirror symbols:
 * - Reflect global degree around 360°
 * - New sign + local degree
 */
export function getCodexMirrorSymbols(
  sign: Sign,
  localStructuralDegree: number
): MirrorSymbolSet {
  const globalDegree = toGlobalDegree(sign, localStructuralDegree);
  const mirroredGlobal = (360 - globalDegree + 360) % 360;
  const { sign: codexSign, localStructuralDegree: codexLocal } =
    fromGlobalDegree(mirroredGlobal);
  const symbolIndex = getSymbolIndex(codexLocal);

  const sabian = lookupSymbol("Sabian", codexSign, symbolIndex);
  const chandra = lookupSymbol("Chandra", codexSign, symbolIndex);

  return {
    sign: codexSign,
    degree: codexLocal,
    globalDegree: mirroredGlobal,
    symbolIndex,
    sabian,
    chandra,
  };
}
