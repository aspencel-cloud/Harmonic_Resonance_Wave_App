// src/data/planetLibrary.ts
//
// P3 Blended Model: SRC Harmonic Canon + Psychological Archetype + Relatable Layer
//

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

export interface PlanetArchitectureLayer {
  /** Canon: deeper SRC-based harmonic function */
  fieldFunction: string; // Core energetic job
  harmonicRole: string; // How the planet behaves in the harmonic system
  notes?: string; // Extra Canon information
}

export interface PlanetPractitionerLayer {
  /** Practitioner language: how this planet feels/behaves psychologically */
  essenceSentence: string;
  embodiedTone: string; // Coherent state
  shadowTone: string; // Distorted/non-coherent state
  resonanceKeywords: string[];
  challenges?: string[];
}

export interface PlanetRelatableLayer {
  /** Simple description anyone can understand */
  oneLiner: string;
}

export interface PlanetRecord {
  name: PlanetName;
  architecture: PlanetArchitectureLayer;
  practitioner: PlanetPractitionerLayer;
  relatable: PlanetRelatableLayer;

  colorId?: string;
  glyphId?: string;
}

/** Main export: canonical planet library */
export const PLANET_LIBRARY: Record<PlanetName, PlanetRecord> = {
  // ============================
  // ☀️ SUN — Coherent Center
  // ============================
  Sun: {
    name: "Sun",
    architecture: {
      fieldFunction:
        "Central coherence engine; organizes identity and purpose.",
      harmonicRole:
        "Radiant pattern that stabilizes the inner system around a core frequency.",
      notes:
        "Sun expresses as coherent identity, self-directing intention, and conscious will.",
    },
    practitioner: {
      essenceSentence:
        "The Sun expresses your core sense of self: direction, vitality, and the way you step into life.",
      embodiedTone:
        "Confidence, clarity, healthy self-authority, the sense of being centered.",
      shadowTone:
        "Over-identification with roles, fragile ego, performative confidence.",
      resonanceKeywords: [
        "identity",
        "core vitality",
        "purpose",
        "radiance",
        "self-authority",
      ],
      challenges: ["ego inflation", "defensiveness", "self-doubt"],
    },
    relatable: {
      oneLiner:
        "Your inner sunlight — the part of you that says, ‘This is who I am.’",
    },
  },

  // ============================
  // 🌙 MOON — Resonance Memory
  // ============================
  Moon: {
    name: "Moon",
    architecture: {
      fieldFunction:
        "Emotional regulation, imprint memory, instinctive patterning.",
      harmonicRole:
        "Somatic resonance layer; carries old waves, early imprints, and automatic responses.",
      notes:
        "Moon integrates lived experience into emotional memory and intuitive knowing.",
    },
    practitioner: {
      essenceSentence:
        "The Moon reflects your emotional rhythms, needs, and instinctive ways of staying safe.",
      embodiedTone:
        "Emotional attunement, nurturing, intuitive flow, stable inner regulation.",
      shadowTone:
        "Mood loops, attachment anxiety, acting from old emotional programs.",
      resonanceKeywords: [
        "emotion",
        "security",
        "intuition",
        "memory",
        "instinct",
        "comfort",
      ],
      challenges: ["over-sensitivity", "avoidance", "habitual reactions"],
    },
    relatable: {
      oneLiner:
        "Your inner tides — what you feel, need, and instinctively protect.",
    },
  },

  // ============================
  // ☿ MERCURY — Signal Translator
  // ============================
  Mercury: {
    name: "Mercury",
    architecture: {
      fieldFunction:
        "Signal processing, translation, cognition, communication.",
      harmonicRole:
        "Information fractal; organizes patterns into language, concepts, and connections.",
      notes:
        "Mercury carries the feedback between inner worlds and outer systems.",
    },
    practitioner: {
      essenceSentence:
        "Mercury shows how you learn, think, communicate, and make sense of the world.",
      embodiedTone:
        "Curiosity, adaptability, authentic expression, clear thinking.",
      shadowTone: "Overthinking, scattered focus, intellectual defensiveness.",
      resonanceKeywords: [
        "communication",
        "learning",
        "ideas",
        "analysis",
        "connection",
      ],
      challenges: ["anxiety", "rumination", "over-explaining"],
    },
    relatable: {
      oneLiner: "Your inner messenger — how you think, talk, and connect dots.",
    },
  },

  // ============================
  // ♀ VENUS — Harmonic Weaver
  // ============================
  Venus: {
    name: "Venus",
    architecture: {
      fieldFunction:
        "Attraction, bonding, valuation, pleasure, coherence between selves.",
      harmonicRole:
        "Phi-based harmonic weaver; creates beauty, resonance, and relational alignment.",
      notes:
        "Venus organizes what feels meaningful, pleasurable, or worth investing in.",
    },
    practitioner: {
      essenceSentence:
        "Venus guides what you love, value, choose, and seek harmony with.",
      embodiedTone:
        "Warmth, appreciation, mutuality, relational ease, aesthetic coherence.",
      shadowTone: "People-pleasing, avoidance of conflict, chasing validation.",
      resonanceKeywords: [
        "love",
        "value",
        "beauty",
        "pleasure",
        "attraction",
        "harmony",
      ],
      challenges: ["over-merging", "dependency", "fear of disapproval"],
    },
    relatable: {
      oneLiner: "Your inner magnet — what you’re drawn to and what feels good.",
    },
  },

  // ============================
  // ♂ MARS — Boundary Ignition
  // ============================
  Mars: {
    name: "Mars",
    architecture: {
      fieldFunction: "Activation, drive, assertion, boundary defense.",
      harmonicRole:
        "Ignition fractal; initiates movement, cuts through stagnation, drives individuation.",
      notes:
        "Mars clarifies the line between self and not-self through action.",
    },
    practitioner: {
      essenceSentence:
        "Mars shows how you assert needs, take action, and face challenges.",
      embodiedTone:
        "Courage, healthy assertion, decisive action, energized motivation.",
      shadowTone: "Reactivity, conflict spirals, avoidance masked as fatigue.",
      resonanceKeywords: [
        "assertion",
        "desire",
        "courage",
        "boundaries",
        "initiative",
      ],
      challenges: ["anger loops", "impulsivity", "passivity"],
    },
    relatable: {
      oneLiner:
        "Your inner fire — how you act, defend, and pursue what matters.",
    },
  },

  // ============================
  // ♃ JUPITER — Expansion Engine
  // ============================
  Jupiter: {
    name: "Jupiter",
    architecture: {
      fieldFunction: "Expansion, meaning, narrative coherence, worldview.",
      harmonicRole:
        "Field-expansion engine; increases the amplitude of a system through belief and perspective.",
      notes:
        "Jupiter frames experience within stories of possibility, opportunity, and growth.",
    },
    practitioner: {
      essenceSentence:
        "Jupiter reveals how you grow, believe, teach, hope, and understand the bigger picture.",
      embodiedTone:
        "Optimism, trust, generosity, philosophical sight, meaning-making.",
      shadowTone: "Dogmatism, overextension, inflated expectations.",
      resonanceKeywords: [
        "belief",
        "growth",
        "wisdom",
        "luck",
        "optimism",
        "adventure",
      ],
      challenges: ["excess", "self-righteousness", "escapist positivity"],
    },
    relatable: {
      oneLiner:
        "Your inner guide — the part of you that seeks meaning and possibility.",
    },
  },

  // ============================
  // ♄ SATURN — Structural Gravity
  // ============================
  Saturn: {
    name: "Saturn",
    architecture: {
      fieldFunction: "Structure, discipline, limitation, maturation.",
      harmonicRole:
        "Structural compression layer; defines edges, contracts fields, and crystallizes lessons.",
      notes:
        "Saturn is the reality principle — the part of life that insists on consequence and integration.",
    },
    practitioner: {
      essenceSentence:
        "Saturn teaches boundaries, responsibility, mastery, and long-term patience.",
      embodiedTone: "Steadiness, maturity, self-respect, clarity, resilience.",
      shadowTone: "Fear, rigidity, avoidance, self-criticism, doom-thinking.",
      resonanceKeywords: [
        "responsibility",
        "boundaries",
        "discipline",
        "realism",
        "integration",
      ],
      challenges: ["perfectionism", "delay", "self-judgment"],
    },
    relatable: {
      oneLiner:
        "Your inner backbone — the part that grows through effort and truth.",
    },
  },

  // ============================
  // ♅ URANUS — Disruption & Awakening
  // ============================
  Uranus: {
    name: "Uranus",
    architecture: {
      fieldFunction: "Liberation, disruption, awakening, novelty.",
      harmonicRole:
        "Coherence-rupture agent; breaks patterns so new frequency can emerge.",
      notes:
        "Uranus catalyzes breakthrough through instability and unexpected events.",
    },
    practitioner: {
      essenceSentence:
        "Uranus expresses through insight, rebellion, originality, and sudden clarity.",
      embodiedTone:
        "Freedom, authenticity, innovation, intuitive breakthrough.",
      shadowTone:
        "Instability, chaos for its own sake, detachment or shock as defense.",
      resonanceKeywords: [
        "innovation",
        "awakening",
        "freedom",
        "eccentricity",
        "breakthrough",
      ],
      challenges: ["restlessness", "alienation", "rebellion-patterns"],
    },
    relatable: {
      oneLiner:
        "Your inner lightning — the spark that breaks old patterns open.",
    },
  },

  // ============================
  // ♆ NEPTUNE — Dissolution & Vision
  // ============================
  Neptune: {
    name: "Neptune",
    architecture: {
      fieldFunction: "Dissolving, unifying, dreaming, spiritual permeation.",
      harmonicRole:
        "Soft-dissolution field; relaxes old identity structures to make space for sensitivity and unity.",
      notes:
        "Neptune blurs boundaries, expands imagination, and heightens compassion.",
    },
    practitioner: {
      essenceSentence:
        "Neptune reveals your sensitivity, imagination, dreams, intuition, and longing for transcendence.",
      embodiedTone:
        "Empathy, creativity, spiritual openness, grace, surrender.",
      shadowTone: "Confusion, avoidance, addiction, idealization, overwhelm.",
      resonanceKeywords: [
        "dream",
        "intuition",
        "compassion",
        "imagination",
        "surrender",
      ],
      challenges: ["escapism", "projection", "boundary loss"],
    },
    relatable: {
      oneLiner: "Your inner ocean — the part of you that feels beyond words.",
    },
  },

  // ============================
  // ♇ PLUTO — Recursion & Regeneration
  // ============================
  Pluto: {
    name: "Pluto",
    architecture: {
      fieldFunction: "Depth, compulsion, shadow exposure, regeneration.",
      harmonicRole:
        "Underworld recursion engine; exposes hidden pattern roots for transformation.",
      notes:
        "Pluto governs power dynamics, unconscious material, decay and renewal cycles.",
    },
    practitioner: {
      essenceSentence:
        "Pluto reveals your deepest drives, fears, intensities, and capacity for transformation.",
      embodiedTone: "Radical honesty, depth presence, resilience, empowerment.",
      shadowTone:
        "Control, obsession, fear of loss, secrecy, emotional extremes.",
      resonanceKeywords: [
        "transformation",
        "power",
        "rebirth",
        "shadow",
        "depth",
      ],
      challenges: ["fear loops", "attachment to intensity", "control-patterns"],
    },
    relatable: {
      oneLiner:
        "Your inner underworld — the force that breaks you open to rebuild you.",
    },
  },
};

/** Helper accessor */
export function getPlanetRecord(name: PlanetName): PlanetRecord | null {
  return PLANET_LIBRARY[name] ?? null;
}
