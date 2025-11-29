// src/resonance/resonanceTypes.ts

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

export const SIGN_ORDER: Sign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const SIGN_INDEX: Record<Sign, number> = SIGN_ORDER.reduce(
  (acc, sign, idx) => {
    acc[sign] = idx;
    return acc;
  },
  {} as Record<Sign, number>
);

export type PlanetId =
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
  | "NorthNode"
  | "SouthNode"
  | "Chiron"
  | "Lilith"
  | "ASC"
  | "MC"
  | "IC"
  | "DSC";

export type DecanMode = "Emergent" | "Formative" | "Integrated";

export interface PlanetInput {
  planetId: PlanetId;
  sign: Sign;
  degree: number; // 0–29 structural degree in sign
  minute: number; // 0–59
  house?: number; // 1–12, optional
}

export interface SymbolEntry {
  id: string; // e.g. "Sabian-Leo-20"
  title: string; // short label/title
  text: string; // main symbol text
}

export type SymbolSetId = "Sabian" | "Chandra";

export interface WaveInfo {
  id: number; // 1–10
  name: string; // "Edge Dancers"
  summary: string; // 1–2 sentence essence
  // Optional fields: color, glyphId, etc.
}

export interface DecanInfo {
  index: 1 | 2 | 3;
  mode: DecanMode;
  archetypeId: string; // e.g. "Leo-2" for Leo Decan II
  summary: string;
}

export interface HouseInfo {
  number: number; // 1–12
  name: string; // e.g. "Field of Orientation"
  summary: string; // 1–3 sentence archetype
}

export interface PlanetFieldInfo {
  name: string; // "Sun"
  cosmology: string; // field-function description
  astrology: string; // classical astro framing
  resonance: string; // coherent/distorted notes (short)
}

export interface MirrorSymbolSet {
  sign: Sign;
  degree: number; // 0–29 structural
  globalDegree: number; // 0–359
  symbolIndex: number; // 1–30
  sabian: SymbolEntry;
  chandra: SymbolEntry;
}

export interface ResonancePlacement {
  planetId: PlanetId;

  sign: Sign;
  degree: number; // structural 0–29
  minute: number; // 0–59
  globalDegree: number; // 0–359

  wave: WaveInfo;

  decan: DecanInfo;

  house?: HouseInfo; // <-- make optional

  symbols: {
    sabian: SymbolEntry;
    chandra: SymbolEntry;
    axisMirror: MirrorSymbolSet;
    codexMirror: MirrorSymbolSet;
  };

  planetField: PlanetFieldInfo;

  interpretation?: {
    short: string;
    long?: string;
  };
}
