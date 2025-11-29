// src/resonance/mirrorLogic.ts

import { SIGN_INDEX, SIGN_ORDER, type Sign } from "./resonanceTypes";

export function toGlobalDegree(
  sign: Sign,
  localStructuralDegree: number
): number {
  const signIndex = SIGN_INDEX[sign];
  return signIndex * 30 + localStructuralDegree; // 0–359
}

export function fromGlobalDegree(globalDegree: number): {
  sign: Sign;
  localStructuralDegree: number;
} {
  const norm = ((globalDegree % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const local = norm % 30;
  return {
    sign: SIGN_ORDER[signIndex],
    localStructuralDegree: local,
  };
}

export function getSymbolIndex(localStructuralDegree: number): number {
  return localStructuralDegree + 1; // 1–30
}

export function oppositeSign(sign: Sign): Sign {
  const idx = SIGN_INDEX[sign];
  const oppIdx = (idx + 6) % 12;
  return SIGN_ORDER[oppIdx];
}
