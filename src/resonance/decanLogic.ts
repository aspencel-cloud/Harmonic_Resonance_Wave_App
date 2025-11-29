// src/resonance/decanLogic.ts

import type { DecanInfo, DecanMode, Sign } from "./resonanceTypes";

/**
 * Compute Decan index and mode from structural degree.
 * 0–9   → Decan I  (Emergent)
 * 10–19 → Decan II (Formative)
 * 20–29 → Decan III(Integrated)
 */
export function getDecanMode(localStructuralDegree: number): {
  index: 1 | 2 | 3;
  mode: DecanMode;
} {
  const idx = Math.floor(localStructuralDegree / 10); // 0, 1, 2
  if (idx === 0) return { index: 1, mode: "Emergent" };
  if (idx === 1) return { index: 2, mode: "Formative" };
  return { index: 3, mode: "Integrated" };
}

/**
 * Fetch Decan archetype text from your Decan Library.
 * Wire this to src/data/decans.ts + decansLoader.ts
 */
export function lookupDecan(sign: Sign, decanIndex: 1 | 2 | 3): DecanInfo {
  // TODO: replace with real lookup into your decans data.
  // Example (pseudo-code):
  //
  //   const decan = decansBySign[sign][decanIndex];
  //   return {
  //     index: decanIndex,
  //     mode: decan.mode, // or derive via getDecanMode
  //     archetypeId: decan.id,
  //     summary: decan.summaryEssence,
  //   };

  const mode =
    decanIndex === 1
      ? "Emergent"
      : decanIndex === 2
        ? "Formative"
        : "Integrated";

  return {
    index: decanIndex,
    mode,
    archetypeId: `${sign}-${decanIndex}`,
    summary: "Decan summary placeholder (connect to Decan Library).",
  };
}
