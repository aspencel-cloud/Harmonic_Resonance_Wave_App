// DEBUG: SHIM ACTIVE (no papaparse import)
// TEMP SHIM — placements loader disabled in this build.
export async function fetchPlacementsManifest() {
  throw new Error("Built-in placements loader is disabled.");
}
export async function fetchPlacementsCsv(_name: string) {
  return [];
}
export function rowsToPlacements(_rows: any[]) {
  return [];
}
export {};
