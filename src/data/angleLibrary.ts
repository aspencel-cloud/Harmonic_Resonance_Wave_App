// src/data/angleLibrary.ts
//
// Canonical Angle Library for the Resonance Engine.
// Angles are NOT planets and NOT symbolic points.
// They function as orientation gates and field-context entrances.
//
// P3 Blended Model: SRC Canon + psychological clarity + simple language.
//

export type AngleName = "ASC" | "DSC" | "IC" | "MC";

export interface AngleArchitectureLayer {
  /** SRC Canon: what this angle does structurally */
  gateFunction: string; // How the angle shapes the flow of energy
  orientationRole: string; // How it orients identity, relationship, or life path
  notes?: string;
}

export interface AnglePractitionerLayer {
  /** Experiential / psychological framing */
  essenceSentence: string;
  embodiedTone: string; // Coherent expression
  shadowTone: string; // Distorted expression
  resonanceKeywords: string[];
  challenges?: string[];
}

export interface AngleRelatableLayer {
  /** Simple, user-friendly description */
  oneLiner: string;
}

export interface AngleRecord {
  name: AngleName;
  architecture: AngleArchitectureLayer;
  practitioner: AnglePractitionerLayer;
  relatable: AngleRelatableLayer;

  colorId?: string;
  glyphId?: string;
}

export const ANGLE_LIBRARY: Record<AngleName, AngleRecord> = {
  // ============================
  // ASC — Self Gate / Life Entrance
  // ============================
  ASC: {
    name: "ASC",
    architecture: {
      gateFunction:
        "Entrance gate of incarnation; defines how personal energy meets the world.",
      orientationRole:
        "Orients identity toward expression, embodiment, and personal presence.",
      notes:
        "ASC is how frequency first makes contact with outer life — the interface between self and environment.",
    },
    practitioner: {
      essenceSentence:
        "The ASC describes your instinctive way of entering life and presenting yourself.",
      embodiedTone:
        "Authenticity, presence, natural confidence, ease of being seen.",
      shadowTone:
        "Self-consciousness, compensatory masks, reactive identity patterns.",
      resonanceKeywords: [
        "identity gate",
        "presentation",
        "self-expression",
        "instinct",
        "first impression",
      ],
      challenges: ["masking", "over-adaptation", "image fixation"],
    },
    relatable: {
      oneLiner:
        "Your doorway into the world — the style and energy of your presence.",
    },
  },

  // ============================
  // DSC — Other Gate / Relational Entrance
  // ============================
  DSC: {
    name: "DSC",
    architecture: {
      gateFunction:
        "Entrance gate of the Other; defines how relational energy meets you.",
      orientationRole:
        "Orients the psyche toward partnership, mirroring, and co-regulation.",
      notes:
        "DSC is the point where you encounter reflection, contrast, and relational learning.",
    },
    practitioner: {
      essenceSentence:
        "The DSC reveals what you seek in partnership and how relationship shapes you.",
      embodiedTone:
        "Mutuality, attunement, curiosity about difference, complementarity.",
      shadowTone:
        "Projection, dependency, idealization, chasing missing parts in others.",
      resonanceKeywords: [
        "relationship",
        "mirror",
        "partnership",
        "balance",
        "co-creation",
      ],
      challenges: ["projection loops", "avoidance of conflict", "fusion"],
    },
    relatable: {
      oneLiner:
        "Your relationship doorway — how others enter your life and shape you.",
    },
  },

  // ============================
  // IC — Root Gate / Inner Foundation
  // ============================
  IC: {
    name: "IC",
    architecture: {
      gateFunction:
        "Entrance gate to inner life; defines roots, memory, and emotional foundations.",
      orientationRole:
        "Orients energy toward ancestry, belonging, home, and inner safety.",
      notes:
        "IC is the deep root system — what you fall back on and what shaped your earliest imprint.",
    },
    practitioner: {
      essenceSentence:
        "The IC reveals your emotional home base: what feels safe, familiar, and grounding.",
      embodiedTone:
        "Security, inner warmth, belonging, stability, emotional rootedness.",
      shadowTone:
        "Retreating, regression, over-attachment to family patterns or history.",
      resonanceKeywords: [
        "roots",
        "foundation",
        "inner life",
        "ancestry",
        "belonging",
      ],
      challenges: ["isolation", "clinging to the past", "fear of exposure"],
    },
    relatable: {
      oneLiner:
        "Your inner home — the roots that nourish you (or hold you back).",
    },
  },

  // ============================
  // MC — Direction Gate / Public Alignment
  // ============================
  MC: {
    name: "MC",
    architecture: {
      gateFunction:
        "Exit gate of purpose; directs energy upward toward vocation, contribution, and destiny.",
      orientationRole:
        "Orients identity toward expression in the world through role, purpose, or mastery.",
      notes:
        "MC carries the outward arc of becoming — what you grow into and offer to the collective.",
    },
    practitioner: {
      essenceSentence:
        "The MC reveals your calling, your public contribution, and your evolving sense of mission.",
      embodiedTone:
        "Confidence, service, visible impact, living your truth out loud.",
      shadowTone:
        "Overachievement, image obsession, burnout, or fear of being seen.",
      resonanceKeywords: [
        "purpose",
        "career",
        "calling",
        "public presence",
        "legacy",
      ],
      challenges: [
        "workaholism",
        "performance identity",
        "expectation pressure",
      ],
    },
    relatable: {
      oneLiner:
        "Your calling doorway — how your life expresses its purpose in the world.",
    },
  },
};

/** Helper accessor */
export function getAngleRecord(name: AngleName): AngleRecord | null {
  return ANGLE_LIBRARY[name] ?? null;
}
