// src/utils/getDecanEnriched.ts
import { getDecanInfo, DecanSystem } from "./decan";
import type { DecanMeta, DecanMetaMap } from "@/data/decans";

/** Compute decan (index/start/end/labels) + merge CSV meta if present */
export function getDecanEnriched(
  sign: string,
  degreeInSign: number,
  metaMap: DecanMetaMap | null,
  system: DecanSystem = "chaldean"
) {
  const base = getDecanInfo(sign, degreeInSign, system);
  const key = `${sign}:${base.index}`;
  const meta: DecanMeta | undefined = metaMap?.get(key) ?? undefined;

  return {
    ...base,
    // simple fields (prefer CSV when present)
    Label: meta?.Label ?? base.label,
    Ruler: meta?.Ruler ?? (system === "chaldean" ? base.secondary : ""),
    Subsign:
      meta?.Subsign ??
      (system === "modern_elemental" ? (base.secondary ?? "") : ""),

    Degree_Start: meta?.Degree_Start ?? base.startDeg,
    Degree_End: meta?.Degree_End ?? base.endDeg,

    // rich prose
    Structural_Function: meta?.Structural_Function,
    Phase_Tone: meta?.Phase_Tone,
    One_Liner: meta?.One_Liner,
    Field_Function: meta?.Field_Function,
    Wave_Summary: meta?.Wave_Summary,
    Poetic_Short: meta?.Poetic_Short,
  };
}
