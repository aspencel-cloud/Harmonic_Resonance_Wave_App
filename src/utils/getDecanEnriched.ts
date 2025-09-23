// src/utils/getDecanEnriched.ts
import { getDecanInfo, type DecanSystem } from "../utils/decan";
import type { DecanMetaMap } from "../data/decans";

/** Return compute-info + prose. Falls back gracefully if CSV isn’t loaded. */
export function getDecanEnriched(
  sign: string,
  degreeInSign: number,
  metaMap: DecanMetaMap | null,
  system: DecanSystem = "chaldean" // UI default: show face ruler in header
) {
  // base: index/start/end/label/secondary from your decan util
  const base = getDecanInfo(sign, degreeInSign, system);
  const key = `${sign}:${base.index}`;
  const meta = metaMap?.get(key) ?? null;

  // Prefer CSV prose; fallback to computed label/secondary
  return {
    ...base,
    ...(meta ?? {}),
    Label: meta?.Label ?? base.label,
    Ruler: meta?.Ruler ?? (system === "chaldean" ? base.secondary : ""),
    Subsign:
      meta?.Subsign ??
      (system === "modern_elemental"
        ? (base.secondary ?? "")
        : (meta?.Subsign ?? "")),
  };
}
