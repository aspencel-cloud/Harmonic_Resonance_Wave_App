// src/app/types.ts

/** One contextual entry at a specific Wave/Sign/Planet/Degree */
export type ContextEntry = {
  Note?: string;
  Sabian?: string;
  Chandra?: string;
  Question?: string;
};

/**
 * Full context map:
 * Wave -> Sign -> Planet -> DegreeString -> ContextEntry
 * Example:
 *   context["Wave7"]["Scorpio"]["Part of Fortune"]["14"]
 */
export type ContextMap = Record<
  string, // "Wave1" ..."Wave10"
  Record<
    string, // Sign (e.g., "Aries")
    Record<
      string, // Planet (e.g., "Sun", "Part of Fortune")
      Record<string, ContextEntry> // Degree "0".."29"
    >
  >
>;

/** Signs used across the app (narrow union so autocompletion is nice) */
export type Sign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

/**
 * Planet-ish label. Keep string to stay flexible (PoF, angles, nodes, etc.)
 */
export type Planet = string;

/** A single placement rendered on the wheel. */
export type Placement = {
  id: string;
  planet: Planet;
  sign: Sign | string;
  degree: number;
  data?: {
    Sabian?: string;
    Chandra?: string;
    [key: string]: any;
  };
};

/** Optional wheel/UI config carried in initialState. */
export type WheelConfig = {
  radius: number;
  ringWidth: number;
  showTicks: boolean;
};

/** Minimal app state shape used by initialState and consumers. */
export type AppState = {
  context: ContextMap;
  config?: WheelConfig; // <-- add this to match state.ts
};
