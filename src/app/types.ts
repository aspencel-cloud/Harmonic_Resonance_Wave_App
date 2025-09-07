export type Planet =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  // points & angles
  | "North Node"
  | "South Node"
  | "Chiron"
  | "Lilith"
  | "Vertex"
  | "Part of Fortune"
  | "ASC"
  | "DSC"
  | "IC"
  | "MC";

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

export interface Placement {
  id: string;
  planet: Planet;
  sign: Sign;
  degree: number; // 0–29.999
  retro?: boolean;
}

export interface Wave {
  id: number; // 1..10
  degrees: [number, number, number]; // e.g. [0,10,20] or [1,11,21]
  label: string;
  color?: string;
}

export interface ContextEntry {
  Note?: string;
  Sabian?: string;
  Chandra?: string;
  [k: string]: string | undefined;
}

export interface ContextMap {
  // Wave -> Sign -> Planet -> degreeKey -> entry
  [waveKey: string]: {
    [sign: string]: {
      [planet: string]: {
        [degreeKey: string]: ContextEntry;
        default?: ContextEntry;
      };
    };
  };
}

export interface WheelConfig {
  radius: number;
  ringWidth: number;
  showTicks: boolean;
}

export interface AppState {
  context: ContextMap;
  config: WheelConfig;
}
