// src/data/waves.ts

// -----------------------------
// Types
// -----------------------------

export type WaveId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface WaveArchitectureLayer {
  /** Canon: what this Wave does in the harmonic system */
  function: string; // e.g. "Initiation Fractal"
  fractalRole: string; // e.g. "beginnings; first pulse of a cycle"
  anchors: number[]; // structural degrees within a sign, e.g. [0, 10, 20]
  notes?: string; // any extra Canon notes
}

export interface WavePractitionerLayer {
  /** Practitioner language: emotional / experiential tone */
  essenceSentence: string; // 1–2 line core description
  embodiedTone: string; // how this feels when coherent
  shadowTone: string; // how this feels when distorted (non-pathologizing)
  coherenceKeywords: string[]; // short words/phrases
  distortionKeywords: string[]; // short words/phrases
}

export interface WaveRelatableLayer {
  /** Simple “for non-astrologers” summary */
  oneLiner: string;
}

export interface WaveRecord {
  id: WaveId;
  key: string; // "Wave1", "Wave2", ...
  name: string; // "Root Trinity", ...
  shortName: string; // optional shorthand (can match name)

  architecture: WaveArchitectureLayer;
  practitioner: WavePractitionerLayer;
  relatable: WaveRelatableLayer;

  // Optional hooks into visuals if/when needed
  colorId?: string;
  glyphId?: string;
}

// -----------------------------
// Canonical Wave anchors + names
// -----------------------------

export const WAVE_DEGREE_ANCHORS: Record<number, number[]> = {
  1: [0, 10, 20],
  2: [5, 15, 25],
  3: [3, 13, 23],
  4: [7, 17, 27],
  5: [9, 19, 29],
  6: [2, 12, 22],
  7: [4, 14, 24],
  8: [6, 16, 26],
  9: [8, 18, 28],
  10: [1, 11, 21],
};

export const WAVE_NAMES: Record<number, string> = {
  1: "Root Trinity",
  2: "Soul Mirror",
  3: "Spiral Initiate",
  4: "Mystic Arc",
  5: "Edge Dancers",
  6: "Bridge Builders",
  7: "Heart Weavers",
  8: "Crystal Initiates",
  9: "Harvesters",
  10: "Genesis Mirrors",
};

export function getWaveName(id: number | null | undefined): string | null {
  if (!id) return null;
  return WAVE_NAMES[id] ?? null;
}

// Convenience array for rendering dots on the ring
export const WAVES = Object.keys(WAVE_DEGREE_ANCHORS).map((k) => {
  const id = Number(k);
  return {
    id,
    label: `Wave ${id}: ${WAVE_NAMES[id]}`,
    degrees: WAVE_DEGREE_ANCHORS[id],
  };
});

// -----------------------------
// Full Wave Library (Canon + Practitioner)
// -----------------------------

export const WAVE_LIBRARY: Record<WaveId, WaveRecord> = {
  1: {
    id: 1,
    key: "Wave1",
    name: WAVE_NAMES[1],
    shortName: WAVE_NAMES[1],
    architecture: {
      function: "Initiation Fractal",
      fractalRole: "beginnings; the first pulse of a cycle",
      anchors: WAVE_DEGREE_ANCHORS[1],
      notes:
        "Root harmonic trinity within each sign; stabilizing first position.",
    },
    practitioner: {
      essenceSentence:
        "Wave 1 begins things from essence — steady, rooted, and simple.",
      embodiedTone:
        "Feels like quiet confidence, grounded starts, and solid first steps.",
      shadowTone:
        "Can feel stuck, resistant to change, or over-attached to the familiar.",
      coherenceKeywords: [
        "initiation",
        "rootedness",
        "stability",
        "first pulse",
      ],
      distortionKeywords: ["inertia", "stagnation", "fear of movement"],
    },
    relatable: {
      oneLiner: "The stable first step — starting from solid ground.",
    },
  },

  2: {
    id: 2,
    key: "Wave2",
    name: WAVE_NAMES[2],
    shortName: WAVE_NAMES[2],
    architecture: {
      function: "Mirror Fractal",
      fractalRole: "relational feedback and contrast",
      anchors: WAVE_DEGREE_ANCHORS[2],
      notes: "Phi / Venus-pentagram resonance; mutual seeing and contrast.",
    },
    practitioner: {
      essenceSentence:
        "Wave 2 shows you yourself through others and through contrast.",
      embodiedTone:
        "Feels like honest reflection, mutual recognition, and gentle recalibration.",
      shadowTone:
        "Can feel like over-identifying with others or losing yourself in reflection.",
      coherenceKeywords: ["mirroring", "relationship", "contrast", "feedback"],
      distortionKeywords: ["projection", "people-pleasing", "over-merging"],
    },
    relatable: {
      oneLiner: "The mirror — learning who you are by what reflects back.",
    },
  },

  3: {
    id: 3,
    key: "Wave3",
    name: WAVE_NAMES[3],
    shortName: WAVE_NAMES[3],
    architecture: {
      function: "Recursion Fractal",
      fractalRole: "patterned repetition and learning loops",
      anchors: WAVE_DEGREE_ANCHORS[3],
      notes: "Fibonacci phase steps; recursive thresholds of awareness.",
    },
    practitioner: {
      essenceSentence:
        "Wave 3 turns repetition into wisdom — patterns become teachers.",
      embodiedTone:
        "Feels like curiosity, experimentation, and iterative growth.",
      shadowTone:
        "Can feel like stuck loops, going in circles, or repeating the same lesson.",
      coherenceKeywords: [
        "learning",
        "iteration",
        "experimentation",
        "curiosity",
      ],
      distortionKeywords: ["stuck cycles", "rumination", "spinning wheels"],
    },
    relatable: {
      oneLiner: "The learning loop — repeating until it becomes wisdom.",
    },
  },

  4: {
    id: 4,
    key: "Wave4",
    name: WAVE_NAMES[4],
    shortName: WAVE_NAMES[4],
    architecture: {
      function: "Liminal Fractal",
      fractalRole: "openings and intuition breaches",
      anchors: WAVE_DEGREE_ANCHORS[4],
      notes: "Inner-octave/chakra resonance; subtle threshold of insight.",
    },
    practitioner: {
      essenceSentence:
        "Wave 4 opens doors you didn’t know were there — intuition breaches through.",
      embodiedTone:
        "Feels like subtle openings, glimpses, and nonlinear knowing.",
      shadowTone:
        "Can feel like disorientation, fantasy-escape, or chasing signs.",
      coherenceKeywords: ["intuition", "mystery", "threshold", "insight arc"],
      distortionKeywords: ["confusion", "escapism", "ungrounded mysticism"],
    },
    relatable: {
      oneLiner: "The opening — sudden knowing that bends the line into an arc.",
    },
  },

  5: {
    id: 5,
    key: "Wave5",
    name: WAVE_NAMES[5],
    shortName: WAVE_NAMES[5],
    architecture: {
      function: "Termination Fractal (Anaretic)",
      fractalRole: "thresholds, closures, and identity edges",
      anchors: WAVE_DEGREE_ANCHORS[5],
      notes:
        "Anaretic wave; lands on decan and sign boundaries. Boundary collapse and inversion.",
    },
    practitioner: {
      essenceSentence:
        "Wave 5 lives at the edge — endings, thresholds, and identity flips.",
      embodiedTone:
        "Feels like completion, release, and stepping over a line into the new.",
      shadowTone:
        "Can feel like chronic crisis, drama at endings, or fear of letting go.",
      coherenceKeywords: [
        "threshold",
        "completion",
        "transition",
        "edge-walking",
      ],
      distortionKeywords: [
        "self-sabotage",
        "perpetual crisis",
        "refusal to finish",
      ],
    },
    relatable: {
      oneLiner: "The edge — where one story ends and another waits to begin.",
    },
  },

  6: {
    id: 6,
    key: "Wave6",
    name: WAVE_NAMES[6],
    shortName: WAVE_NAMES[6],
    architecture: {
      function: "Bridge Fractal",
      fractalRole: "transitions and connective tissue",
      anchors: WAVE_DEGREE_ANCHORS[6],
      notes: "Dwad/sub-harmonic resonance; links phases, people, and systems.",
    },
    practitioner: {
      essenceSentence:
        "Wave 6 connects what was separate — people, timelines, and ideas.",
      embodiedTone:
        "Feels like translation, mediation, and weaving between worlds.",
      shadowTone:
        "Can feel like over-responsibility for holding everything together.",
      coherenceKeywords: [
        "bridging",
        "translation",
        "connection",
        "transition",
      ],
      distortionKeywords: [
        "over-functioning",
        "triangulation",
        "boundary blur",
      ],
    },
    relatable: {
      oneLiner: "The bridge — carrying energy from one side to another.",
    },
  },

  7: {
    id: 7,
    key: "Wave7",
    name: WAVE_NAMES[7],
    shortName: WAVE_NAMES[7],
    architecture: {
      function: "Quadrature Fractal",
      fractalRole: "emotional structuring and tension balance",
      anchors: WAVE_DEGREE_ANCHORS[7],
      notes:
        "Soft-square logic; embeds quadrature into relational/emotional scaffolding.",
    },
    practitioner: {
      essenceSentence:
        "Wave 7 weaves tension into structure — emotional reality gets organized.",
      embodiedTone:
        "Feels like honest sorting, boundary work, and necessary adjustments.",
      shadowTone:
        "Can feel like chronic friction, relational strain, or inner stalemate.",
      coherenceKeywords: [
        "integration",
        "emotional structure",
        "tension-balance",
        "boundaries",
      ],
      distortionKeywords: ["stuck tension", "resentment", "over-correction"],
    },
    relatable: {
      oneLiner:
        "The tension-weaver — turning friction into healthy emotional structure.",
    },
  },

  8: {
    id: 8,
    key: "Wave8",
    name: WAVE_NAMES[8],
    shortName: WAVE_NAMES[8],
    architecture: {
      function: "Refinement Fractal",
      fractalRole: "purification and distillation",
      anchors: WAVE_DEGREE_ANCHORS[8],
      notes:
        "Hexagonal lattice / frozen light; refinement and clarity crystallization.",
    },
    practitioner: {
      essenceSentence:
        "Wave 8 refines — it distills, clarifies, and purifies what’s already in motion.",
      embodiedTone:
        "Feels like editing, simplifying, and polishing something to its essence.",
      shadowTone:
        "Can feel like perfectionism, harsh self-critique, or never good enough.",
      coherenceKeywords: [
        "refinement",
        "purification",
        "clarity",
        "distillation",
      ],
      distortionKeywords: ["perfectionism", "over-pruning", "sterility"],
    },
    relatable: {
      oneLiner: "The distiller — boiling life down to what’s truly essential.",
    },
  },

  9: {
    id: 9,
    key: "Wave9",
    name: WAVE_NAMES[9],
    shortName: WAVE_NAMES[9],
    architecture: {
      function: "Memory Fractal",
      fractalRole: "accumulation and encoding",
      anchors: WAVE_DEGREE_ANCHORS[9],
      notes:
        "Resonance archive; carries contract memory, legacy, and cumulative patterns.",
    },
    practitioner: {
      essenceSentence:
        "Wave 9 gathers and stores — it remembers, accumulates, and encodes experience.",
      embodiedTone:
        "Feels like harvesting lessons, seeing patterns over time, and honoring legacy.",
      shadowTone:
        "Can feel like clinging to the past, looping stories, or living in old memory.",
      coherenceKeywords: ["harvest", "memory", "integration", "legacy"],
      distortionKeywords: ["nostalgia-trap", "regret loops", "stuck history"],
    },
    relatable: {
      oneLiner: "The harvester — collecting what the journey has grown.",
    },
  },

  10: {
    id: 10,
    key: "Wave10",
    name: WAVE_NAMES[10],
    shortName: WAVE_NAMES[10],
    architecture: {
      function: "Genesis Fractal",
      fractalRole: "new coherence and emergent pattern",
      anchors: WAVE_DEGREE_ANCHORS[10],
      notes:
        "Phase-zero mirror gate; radiates new patterns in toroidal formation.",
    },
    practitioner: {
      essenceSentence:
        "Wave 10 births new coherence — the next version of you comes online.",
      embodiedTone:
        "Feels like fresh identity, new synthesis, and surprising alignment.",
      shadowTone:
        "Can feel like restless reinvention, perpetual newness, or abandoning roots.",
      coherenceKeywords: [
        "emergence",
        "coherence",
        "new pattern",
        "integration peak",
      ],
      distortionKeywords: [
        "compulsive reinvention",
        "identity whiplash",
        "incompletion",
      ],
    },
    relatable: {
      oneLiner: "The new pattern — when everything clicks into a new shape.",
    },
  },
};

// -----------------------------
// Helper for full Wave record
// -----------------------------

export function getWaveRecord(
  id: number | null | undefined
): WaveRecord | null {
  if (!id || id < 1 || id > 10) return null;
  return WAVE_LIBRARY[id as WaveId] ?? null;
}
