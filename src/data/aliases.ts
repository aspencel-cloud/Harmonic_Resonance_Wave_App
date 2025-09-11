// src/data/aliases.ts

export function normSign(raw: string): string {
  const s = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    aries: "Aries",
    taurus: "Taurus",
    gemini: "Gemini",
    cancer: "Cancer",
    leo: "Leo",
    virgo: "Virgo",
    libra: "Libra",
    scorpio: "Scorpio",
    sagittarius: "Sagittarius",
    capricorn: "Capricorn",
    aquarius: "Aquarius",
    pisces: "Pisces",
  };
  return map[s] ?? raw.trim();
}

export function normPlanet(raw: string): string {
  const p = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    sun: "Sun",
    moon: "Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
    pluto: "Pluto",
    node: "North Node",
    "north node": "North Node",
    "south node": "South Node",
    asc: "Asc",
    ascendant: "Asc",
    dsc: "Dsc",
    descendant: "Dsc",
    mc: "MC",
    ic: "IC",
    fortune: "Fortune",
    "part of fortune": "Fortune", // 👈 the key alias fix
  };
  return map[p] ?? raw.trim();
}
