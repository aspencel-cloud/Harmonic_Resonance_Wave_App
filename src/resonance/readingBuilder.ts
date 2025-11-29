// src/resonance/readingBuilder.ts
//
// Resonance Reading Builder
// -------------------------
// Takes a ResonancePlacement from degreeEngine.ts and produces a
// structured, multi-section reading that can be rendered by any UI.
//
// This layer is intentionally UI-agnostic: pure data → text.
//

import type { ResonancePlacement } from "./degreeEngine";
import type { ContextMap } from "../app/types";

export interface ReadingSection {
  id: string;
  label: string;
  body: string;
}

export interface ResonanceReading {
  placement: ResonancePlacement;
  header: string;
  subheader: string;
  sections: ReadingSection[];
}

/**
 * Utility: format degree as "19°" etc.
 */
function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  return `${d}°`;
}

const ZODIAC_SIGNS = [
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

function globalToZodiacPosition(globalDeg: number): {
  sign: string;
  degree: number;
} {
  let g = globalDeg % 360;
  if (g < 0) g += 360;

  const signIndex = Math.floor(g / 30);
  const degree = Math.floor(g % 30);

  const sign = ZODIAC_SIGNS[signIndex] ?? "Unknown";
  return { sign, degree };
}

function formatSignDegree(globalDeg: number): string {
  const { sign, degree } = globalToZodiacPosition(globalDeg);
  return `${sign} ${degree}°`;
}

function formatSymbolicSignDegree(globalDeg: number): string {
  const { sign, degree } = globalToZodiacPosition(globalDeg);
  const symbolic = degree + 1; // symbolic index: 1–30
  return `${sign} ${symbolic}°`;
}

/**
 * Utility: describe the planet/point/angle label for humans.
 */
function describeBodyKind(p: ResonancePlacement): string {
  if (p.isPlanet) return "Planet";
  if (p.isPoint) return "Point";
  if (p.isAngle) return "Angle";
  return "Body";
}

function cleanSentence(text: string | undefined | null): string {
  if (!text) return "";
  // Trim whitespace and trailing periods, then add a single period.
  return text.trim().replace(/\.*\s*$/, "") + ".";
}

/**
 * Core header + subheader builder.
 */
function buildHeader(placement: ResonancePlacement): {
  header: string;
  subheader: string;
} {
  const kind = describeBodyKind(placement);
  const degStr = formatDegree(placement.degree);
  const waveLabel =
    (placement.wave as any)?.label ??
    (placement.waveId ? `Wave ${placement.waveId}` : "No Wave");

  const header = `${placement.name} in ${placement.sign} ${degStr}`;
  const subheader = `${kind} · ${waveLabel} · Decan ${placement.decanIndex}`;

  return { header, subheader };
}

/**
 * Build Wave section from WaveRecord (if present).
 */
function buildWaveSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const wave = placement.wave as any;
  if (!wave) return null;

  const label = wave.label ?? `Wave ${placement.waveId ?? ""}`.trim();

  const canon = wave.architecture?.fieldFunction ?? wave.fieldFunction ?? "";
  const harmonic = wave.architecture?.harmonicRole ?? wave.harmonicRole ?? "";
  const essence =
    wave.practitioner?.essenceSentence ?? wave.practitioner?.summary ?? "";

  const pieces: string[] = [];

  if (canon) pieces.push(canon);
  if (harmonic) pieces.push(harmonic);
  if (essence) pieces.push(essence);

  if (!pieces.length) return null;

  return {
    id: "wave",
    label,
    body: pieces.join(" "),
  };
}

/**
 * Build Decan section from DecanRecord (if present).
 * We stay flexible about property names.
 */
function buildDecanSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const decan = placement.decan as any;
  if (!decan) return null;

  const mode =
    decan.mode ??
    decan.modeLabel ??
    decan.phase ??
    (placement.decanIndex === 1
      ? "Emergent"
      : placement.decanIndex === 2
        ? "Formative"
        : "Integrated");

  const title =
    decan.title ??
    decan.name ??
    `${placement.sign} Decan ${placement.decanIndex}`;

  const essence = decan.essence ?? decan.description ?? decan.summary ?? "";

  const keywords: string[] = decan.keywords ?? decan.resonanceKeywords ?? [];

  const lines: string[] = [];
  lines.push(`${title} — ${mode} chamber of ${placement.sign}.`);
  if (essence) lines.push(essence);
  if (keywords?.length) {
    lines.push(`Key themes: ${keywords.join(", ")}.`);
  }

  return {
    id: "decan",
    label: "Decan Chamber",
    body: lines.join(" "),
  };
}

/**
 * Build archetype section (planet / point / angle).
 */
function buildArchetypeSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const arch = placement.archetype as any;
  if (!arch) return null;

  const kind = describeBodyKind(placement);

  const essence =
    arch.practitioner?.essenceSentence ?? arch.practitioner?.summary ?? "";
  const embodied =
    arch.practitioner?.embodiedTone ?? arch.practitioner?.coherentState ?? "";
  const shadow =
    arch.practitioner?.shadowTone ?? arch.practitioner?.distortedState ?? "";
  const keywords: string[] =
    arch.practitioner?.resonanceKeywords ?? arch.practitioner?.keywords ?? [];

  const lines: string[] = [];
  if (essence) {
    lines.push(cleanSentence(essence));
  }
  if (embodied) {
    lines.push(
      cleanSentence(
        `When coherent, this ${kind.toLowerCase()} expresses as ${embodied}`
      )
    );
  }
  if (shadow) {
    lines.push(
      cleanSentence(`In shadow, this energy can distort into ${shadow}`)
    );
  }

  if (keywords?.length) lines.push(`Keywords: ${keywords.join(", ")}.`);

  if (!lines.length) return null;

  return {
    id: "archetype",
    label: `${kind} Archetype`,
    body: lines.join(" "),
  };
}

/**
 * Build symbol dialogue (Sabian + Chandra + Question).
 * Note: we deliberately do NOT include the long "Note" text here,
 * since the existing Deep Dive section in the Sidebar already
 * presents that placement insight.
 */
function buildSymbolSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const { symbols, sign, degree } = placement;
  const { sabian, chandra, question } = symbols;

  const hasSabian = sabian && sabian.trim().length > 0;
  const hasChandra = chandra && chandra.trim().length > 0;
  const hasQuestion = question && question.trim().length > 0;

  if (!hasSabian && !hasChandra && !hasQuestion) return null;

  const degIndex = degree + 1; // symbolic index: 1–30
  const lines: string[] = [];

  if (hasSabian) {
    lines.push(`Sabian symbol for ${sign} ${degIndex}°: ${sabian}`.trim());
  }

  if (hasChandra) {
    lines.push(`Chandra symbol for ${sign} ${degIndex}°: ${chandra}`.trim());
  }

  if (hasQuestion) {
    lines.push(`Reflective question: ${question.trim()}`);
  }

  return {
    id: "symbols",
    label: "Symbol Dialogue",
    body: lines.join(" "),
  };
}

/**
 * Build mirror note (Axis + Codex mirrors).
 */
function buildMirrorSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const { mirrors, globalDegree } = placement;
  if (!mirrors) return null;

  // symbolic labels instead of raw degrees
  const baseLabel = formatSymbolicSignDegree(globalDegree);
  const axisLabel = formatSymbolicSignDegree(mirrors.axisOppositionDegree);
  const codexLabel = formatSymbolicSignDegree(mirrors.codexMirrorDegree);

  const lines: string[] = [];

  lines.push(
    cleanSentence(
      `Axis mirror: ${baseLabel} sits opposite ${axisLabel}. This axis describes a polarity your system is learning to balance`
    )
  );

  lines.push(
    cleanSentence(
      `Codex mirror: ${baseLabel} echoes through ${codexLabel}, hinting at a deeper, often more subtle layer where this pattern recurs in your field`
    )
  );

  return {
    id: "mirrors",
    label: "Mirror Field",
    body: lines.join(" "),
  };
}

/**
 * Build House section (if house data is present).
 */
function buildHouseSection(
  placement: ResonancePlacement
): ReadingSection | null {
  const h: any = (placement as any).house;
  if (!h) return null;

  const number: number | undefined = h.number ?? h.id ?? undefined;
  const title: string | undefined =
    h.title ?? h.name ?? h.shortName ?? undefined;

  const essence: string | undefined =
    h.essenceSentence ?? h.summary ?? undefined;

  const keywords: string[] =
    Array.isArray(h.keywords) && h.keywords.length ? h.keywords : [];

  const lines: string[] = [];

  if (number && title) {
    lines.push(`House ${number} — ${title}.`);
  } else if (number) {
    lines.push(`House ${number} field.`);
  } else if (title) {
    lines.push(`${title}.`);
  }

  if (essence) {
    lines.push(cleanSentence(essence));
  }

  if (keywords.length) {
    lines.push(`Key life areas: ${keywords.join(", ")}.`);
  }

  if (!lines.length) return null;

  return {
    id: "house",
    label: "House Field",
    body: lines.join(" "),
  };
}

/**
 * Build a short integrative summary.
 */
function buildSummarySection(
  placement: ResonancePlacement,
  waveSection: ReadingSection | null,
  decanSection: ReadingSection | null,
  archSection: ReadingSection | null,
  houseSection: ReadingSection | null
): ReadingSection {
  const lines: string[] = [];

  const degStr = formatDegree(placement.degree);
  const waveName =
    waveSection?.label ??
    (placement.waveId ? `Wave ${placement.waveId}` : "the active wave");
  const decanStr = `Decan ${placement.decanIndex}`;

  // Opening line: neutral, no house implication required
  lines.push(
    cleanSentence(
      `${placement.name} in ${placement.sign} ${degStr} is expressing through ${waveName} and ${decanStr}`
    )
  );

  // Archetype contribution
  if (archSection) {
    lines.push(
      cleanSentence(
        `This placement shapes how you experience and express the ${placement.name} archetype in your overall field`
      )
    );
  }

  // House context (soft, only if present)
  const h: any = (placement as any).house;
  if (h) {
    const num: number | undefined = h.number ?? h.id ?? undefined;
    const title: string | undefined =
      h.title ?? h.name ?? h.shortName ?? undefined;

    if (num && title) {
      lines.push(
        cleanSentence(
          `Here it roots into your ${num}th-house field — ${title.toLowerCase()}`
        )
      );
    } else if (num) {
      lines.push(cleanSentence(`Here it roots into your ${num}th-house field`));
    }
  }

  // Decan role
  if (decanSection) {
    lines.push(
      cleanSentence(
        "The decan chamber sets the tone for how this energy unfolds over time — from situation, to challenge, to integration"
      )
    );
  }

  // Wave role
  if (waveSection) {
    lines.push(
      cleanSentence(
        "The wave describes the harmonic behaviour — how this energy tends to rise, peak, and resolve in your field"
      )
    );
  }

  return {
    id: "summary",
    label: "Integration Summary",
    body: lines.join(" "),
  };
}

/**
 * Main API: build a full reading for a given placement.
 *
 * This is pure and deterministic: given the same placement, it will always
 * return the same reading text.
 */
export function buildResonanceReading(
  placement: ResonancePlacement,
  context?: ContextMap | null
): ResonanceReading {
  const { header, subheader } = buildHeader(placement);

  const waveSection = buildWaveSection(placement);
  const decanSection = buildDecanSection(placement);
  const archSection = buildArchetypeSection(placement);
  const symbolSection = buildSymbolSection(placement);
  const mirrorSection = buildMirrorSection(placement);
  const houseSection = buildHouseSection(placement);

  const summarySection = buildSummarySection(
    placement,
    waveSection,
    decanSection,
    archSection,
    houseSection
  );

  const sections: ReadingSection[] = [];

  // Order matters for UI flow
  sections.push(summarySection);
  if (archSection) sections.push(archSection);
  if (houseSection) sections.push(houseSection); // NEW in the flow
  if (waveSection) sections.push(waveSection);
  if (decanSection) sections.push(decanSection);
  if (symbolSection) sections.push(symbolSection);
  if (mirrorSection) sections.push(mirrorSection);

  return {
    placement,
    header,
    subheader,
    sections,
  };
}
