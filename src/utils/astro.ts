export const SIGNS = [
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
] as const;

export function signLabel(i: number) {
  return SIGNS[((i % 12) + 12) % 12];
}

export function fullDegree(signIndex: number, degreeInSign: number) {
  return signIndex * 30 + degreeInSign; // 0..359.999
}

export function houseFromAsc(ascSignIndex: number, signIndex: number) {
  // Whole‑sign houses: House 1 = ASC sign, House n = (signIndex - asc + 12) % 12 + 1
  const diff = (((signIndex - ascSignIndex) % 12) + 12) % 12;
  return diff + 1; // 1..12
}
