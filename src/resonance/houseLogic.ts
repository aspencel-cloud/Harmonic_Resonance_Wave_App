// src/resonance/houseLogic.ts
import { houseLibrary, type HouseRecord } from "../data/houseLibrary";

export function getHouseRecord(
  houseNumber?: number | null
): HouseRecord | null {
  if (!houseNumber) return null;
  const record = houseLibrary[houseNumber];
  return record ?? null;
}
