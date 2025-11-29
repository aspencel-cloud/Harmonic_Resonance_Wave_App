// src/data/pointLibrary.ts
//
// Canonical symbolic point library for the Resonance Engine.
// These are NOT planets — they do not generate fields, they indicate vectors.
// P3 Blended Model (SRC Canon + Psychological + Relatable).
//

export type PointName =
  | "Chiron"
  | "Lilith"
  | "North Node"
  | "South Node"
  | "Vertex"
  | "Part of Fortune";

export interface PointArchitectureLayer {
  /** SRC Canon: what this point indicates structurally */
  vectorFunction: string; // What direction or theme this point pulls toward
  symbolicRole: string; // How it behaves within the symbolic system
  notes?: string; // Additional Canon notes
}

export interface PointPractitionerLayer {
  /** Psychological / experiential interpretation */
  essenceSentence: string;
  embodiedTone: string; // Coherent state
  shadowTone: string; // Distorted/non-coherent state
  resonanceKeywords: string[];
  challenges?: string[];
}

export interface PointRelatableLayer {
  /** Simple, user-friendly summary */
  oneLiner: string;
}

export interface PointRecord {
  name: PointName;
  architecture: PointArchitectureLayer;
  practitioner: PointPractitionerLayer;
  relatable: PointRelatableLayer;

  colorId?: string;
  glyphId?: string;
}

/** Main export: all symbolic points */
export const POINT_LIBRARY: Record<PointName, PointRecord> = {
  // ============================
  // 🜂 CHIRON — The Wound & The Medicine
  // ============================
  Chiron: {
    name: "Chiron",
    architecture: {
      vectorFunction: "Reveals fracture points in the coherence field.",
      symbolicRole:
        "The bridge between pain and wisdom; exposes unresolved patterns so integration can occur.",
      notes:
        "Chiron functions as a harmonic hinge — where vulnerability becomes medicine.",
    },
    practitioner: {
      essenceSentence:
        "Chiron shows where your core wound becomes your greatest wisdom.",
      embodiedTone:
        "Compassion, courage to feel, integrated healing, teaching through lived experience.",
      shadowTone:
        "Avoidance of pain, self-minimizing, over-functioning, or carrying others’ wounds.",
      resonanceKeywords: [
        "healing",
        "wound",
        "wisdom",
        "integration",
        "mentor energy",
      ],
      challenges: ["self-judgment", "shame loops", "caretaker identity"],
    },
    relatable: {
      oneLiner:
        "Your sacred wound — the place where healing becomes your gift.",
    },
  },

  // ============================
  // ⚸ LILITH — Shadow Instinct & Unclaimed Power
  // ============================
  Lilith: {
    name: "Lilith",
    architecture: {
      vectorFunction:
        "Points to repressed instinct, exiled self-permission, and boundary violations.",
      symbolicRole:
        "The wild, unclaimed part of the psyche that refuses to be suppressed.",
      notes:
        "Lilith reveals where authenticity was punished or denied — and where reclaiming begins.",
    },
    practitioner: {
      essenceSentence:
        "Lilith shows where your instinctive truth pushes for expression.",
      embodiedTone:
        "Fierce honesty, liberated desire, healthy boundaries, refusal to self-abandon.",
      shadowTone:
        "Rebellion as defense, sexualized power dynamics, emotional volatility.",
      resonanceKeywords: [
        "instinct",
        "truth",
        "shadow",
        "power reclamation",
        "boundaries",
      ],
      challenges: ["rage", "rejection fear", "self-sabotage"],
    },
    relatable: {
      oneLiner: "Your wild edge — the part of you that won’t pretend anymore.",
    },
  },

  // ============================
  // ☊ NORTH NODE — Growth Direction
  // ============================
  "North Node": {
    name: "North Node",
    architecture: {
      vectorFunction: "Indicates evolutionary direction and future growth.",
      symbolicRole:
        "Pulls the soul toward unfamiliar experiences that expand capacity and consciousness.",
      notes:
        "The North Node describes the developmental arc — not comfort, but evolution.",
    },
    practitioner: {
      essenceSentence:
        "The North Node shows where life is asking you to grow, stretch, and take risks.",
      embodiedTone: "Courage, curiosity, experimentation, forward movement.",
      shadowTone:
        "Impatience, chasing novelty, abandoning roots, spiritual bypassing.",
      resonanceKeywords: [
        "growth",
        "destiny",
        "future",
        "risk",
        "learning curve",
      ],
      challenges: ["fear of change", "overreach", "identity whiplash"],
    },
    relatable: {
      oneLiner: "Your growth edge — the path that feels scary but right.",
    },
  },

  // ============================
  // ☋ SOUTH NODE — Memory & Habit
  // ============================
  "South Node": {
    name: "South Node",
    architecture: {
      vectorFunction:
        "Points to past-life momentum, familiar behaviors, and karmic habit fields.",
      symbolicRole:
        "Reveals comfort zones, overlearned patterns, and gifts brought from before.",
      notes:
        "Not a ‘bad’ point — simply what is already mastered, sometimes overused.",
    },
    practitioner: {
      essenceSentence:
        "The South Node shows your comfort zone: what comes naturally, and what must be released or updated.",
      embodiedTone:
        "Grace, ease, mastery, inherited strengths, intuitive skill.",
      shadowTone: "Stagnation, avoidance of growth, repeating old karma loops.",
      resonanceKeywords: ["past", "comfort", "habit", "karma", "mastery"],
      challenges: ["complacency", "avoidance", "nostalgia loops"],
    },
    relatable: {
      oneLiner:
        "Your comfort zone — familiar strengths and habits you may outgrow.",
    },
  },

  // ============================
  // ✶ VERTEX — Fated Encounter Point
  // ============================
  Vertex: {
    name: "Vertex",
    architecture: {
      vectorFunction:
        "Indicates catalytic encounters and synchronistic meeting points.",
      symbolicRole:
        "Acts as an attractor for people or events that shift the timeline.",
      notes:
        "Often activated through relationships, fate-like events, and meaningful coincidences.",
    },
    practitioner: {
      essenceSentence:
        "The Vertex shows where life brings you profound encounters that alter direction.",
      embodiedTone:
        "Receptivity, openness, meaningful coincidence, life-changing connections.",
      shadowTone:
        "Attachment to ‘destiny’, magical thinking, mistaking intensity for truth.",
      resonanceKeywords: [
        "synchronicity",
        "encounters",
        "destiny",
        "fateful energy",
        "turning points",
      ],
      challenges: ["projection", "romanticizing fate", "misreading signs"],
    },
    relatable: {
      oneLiner:
        "Your cosmic meeting point — where life crosses your path with purpose.",
    },
  },

  // ============================
  // ⚷ PART OF FORTUNE — Ease & Flow
  // ============================
  "Part of Fortune": {
    name: "Part of Fortune",
    architecture: {
      vectorFunction:
        "Shows where ease, flow, and natural alignment occur without forcing.",
      symbolicRole:
        "Indicates the intersection of Sun–Moon–ASC — the harmony point.",
      notes:
        "Represents integration of vitality (Sun), emotional attunement (Moon), and orientation (ASC).",
    },
    practitioner: {
      essenceSentence:
        "The Part of Fortune reveals your natural flow state — where life feels effortless.",
      embodiedTone:
        "Ease, synchronicity, confidence, natural talent, inner alignment.",
      shadowTone:
        "Entitlement, complacency, expecting luck without participation.",
      resonanceKeywords: [
        "flow",
        "ease",
        "alignment",
        "talent",
        "synchronicity",
      ],
      challenges: ["laziness", "magical thinking", "avoidance of effort"],
    },
    relatable: {
      oneLiner: "Your luck field — where things just tend to work out.",
    },
  },
};

/** Helper accessor */
export function getPointRecord(name: PointName): PointRecord | null {
  return POINT_LIBRARY[name] ?? null;
}
