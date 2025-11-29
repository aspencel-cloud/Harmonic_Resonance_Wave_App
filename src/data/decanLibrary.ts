// src/data/decanLibrary.ts

import type { WaveId } from "./waves";

export type DecanIndex = 1 | 2 | 3;
export type DecanMode = "Emergent" | "Formative" | "Integrated";

export type DecanSign =
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

export interface DecanArchitectureLayer {
  /** Canon: how this 10° chamber behaves structurally */
  mode: DecanMode;
  degreeRange: [number, number]; // [0,9], [10,19], [20,29]
  notes?: string;
}

export interface DecanPractitionerLayer {
  /** Practitioner language: chamber as a lived mode */
  title: string;
  summary: string; // 2–3 sentence essence
  fieldFunction: string; // how this chamber acts as a mode
  resonanceKeywords: string[];
  challenges?: string[];
}

export interface DecanRelatableLayer {
  /** Simple human-facing summary */
  oneLiner: string;
}

export interface DecanRecord {
  id: string; // e.g. "Aries-1"
  sign: DecanSign;
  index: DecanIndex;
  architecture: DecanArchitectureLayer;
  practitioner: DecanPractitionerLayer;
  relatable: DecanRelatableLayer;
  emphasizedWaves?: WaveId[]; // optional
}

function decanId(sign: DecanSign, index: DecanIndex): string {
  return `${sign}-${index}`;
}

/**
 * Canonical Decan Library — 36 chambers
 * You can refine wording later; structure and modes are locked.
 */
export const DECAN_LIBRARY: Record<string, DecanRecord> = {
  // ========================
  // ARIES — Desire & Potency
  // ========================

  [decanId("Aries", 1)]: {
    id: decanId("Aries", 1),
    sign: "Aries",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Raw ignition; first spark of Aries’ Desire & Potency theme.",
    },
    practitioner: {
      title: "Aries Decan I",
      summary:
        "Aries Decan I carries the raw ignition of desire — the spark that wants to incarnate as action. It is impulsive, direct, and learning how to move without burning out the field around it.",
      fieldFunction:
        "Opens cycles through decisive moves and instinctive initiative; tests what happens when desire meets the world without filters.",
      resonanceKeywords: ["ignition", "impulse", "boldness", "trial by action"],
      challenges: ["impatience", "impulsivity", "difficulty pausing"],
    },
    relatable: {
      oneLiner: "The first spark — acting on desire as soon as it appears.",
    },
    emphasizedWaves: [1, 3, 5],
  },

  [decanId("Aries", 2)]: {
    id: decanId("Aries", 2),
    sign: "Aries",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes:
        "Drive consolidates; action learns form, method, and sustained effort.",
    },
    practitioner: {
      title: "Aries Decan II",
      summary:
        "Aries Decan II takes the raw spark and tests it against resistance. Here, drive encounters form — commitments, obstacles, and the need to follow through.",
      fieldFunction:
        "Channels raw desire into focused effort, learning how to stay with a path long enough to build something real.",
      resonanceKeywords: [
        "drive",
        "endurance",
        "tested will",
        "applied courage",
      ],
      challenges: [
        "frustration with limits",
        "pushing too hard",
        "struggle with pacing",
      ],
    },
    relatable: {
      oneLiner: "The test of will — turning impulse into sustained action.",
    },
    emphasizedWaves: [1, 6, 7],
  },

  [decanId("Aries", 3)]: {
    id: decanId("Aries", 3),
    sign: "Aries",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes:
        "Potency matures; self-assertion seeks honorable expression and consequence-awareness.",
    },
    practitioner: {
      title: "Aries Decan III",
      summary:
        "Aries Decan III integrates fire with responsibility. Desire is no longer just about ‘I want’ — it begins to ask what the impact of action is on others and on the wider field.",
      fieldFunction:
        "Transforms raw assertion into honorable action; explores leadership, consequence, and the maturation of will.",
      resonanceKeywords: [
        "honor",
        "mature will",
        "responsible assertion",
        "leadership",
      ],
      challenges: [
        "ego battles",
        "difficulty yielding",
        "learning when not to push",
      ],
    },
    relatable: {
      oneLiner:
        "The honorable warrior — acting with courage and awareness of impact.",
    },
    emphasizedWaves: [4, 8, 9],
  },

  // =========================
  // TAURUS — Substantiation
  // =========================

  [decanId("Taurus", 1)]: {
    id: decanId("Taurus", 1),
    sign: "Taurus",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "First stabilization of value and resource; anchoring into form.",
    },
    practitioner: {
      title: "Taurus Decan I",
      summary:
        "Taurus Decan I explores the power of grounding. It senses what is worth holding, protecting, and cultivating, and begins to build simple, dependable structures around that.",
      fieldFunction:
        "Establishes basic stability and resource security so that life can unfold without constant survival stress.",
      resonanceKeywords: [
        "grounding",
        "stability",
        "security",
        "resource focus",
      ],
      challenges: ["stubbornness", "over-attachment", "resistance to change"],
    },
    relatable: {
      oneLiner: "The settler — claiming ground and building a solid base.",
    },
    emphasizedWaves: [1, 8],
  },

  [decanId("Taurus", 2)]: {
    id: decanId("Taurus", 2),
    sign: "Taurus",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application of power and value; methods of sustaining growth.",
    },
    practitioner: {
      title: "Taurus Decan II",
      summary:
        "Taurus Decan II puts values to work. It experiments with how effort, skill, and patience can translate into tangible results and lasting forms.",
      fieldFunction:
        "Applies power carefully and deliberately, refining methods for building, maintaining, and improving what matters.",
      resonanceKeywords: ["application", "craft", "patience", "stewardship"],
      challenges: ["overwork", "rigidity", "fear of experimentation"],
    },
    relatable: {
      oneLiner: "The craftsperson — making value real through steady effort.",
    },
    emphasizedWaves: [3, 6],
  },

  [decanId("Taurus", 3)]: {
    id: decanId("Taurus", 3),
    sign: "Taurus",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Depth and authority around value, resource, and embodiment.",
    },
    practitioner: {
      title: "Taurus Decan III",
      summary:
        "Taurus Decan III deepens into the mystery of value and trust. It knows that true wealth includes inner steadiness, sensual presence, and the capacity to receive.",
      fieldFunction:
        "Anchors authority in embodied knowing; models how to be resourced without clinging or scarcity.",
      resonanceKeywords: ["authority", "depth", "embodiment", "trust"],
      challenges: ["possessiveness", "complacency", "fear of loss"],
    },
    relatable: {
      oneLiner: "The keeper — embodying value rather than just owning it.",
    },
    emphasizedWaves: [4, 9],
  },

  // =========================
  // GEMINI — Discovery
  // =========================

  [decanId("Gemini", 1)]: {
    id: decanId("Gemini", 1),
    sign: "Gemini",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Fresh curiosity; first contact with multiplicity and contrast.",
    },
    practitioner: {
      title: "Gemini Decan I",
      summary:
        "Gemini Decan I delights in first impressions and new inputs. It’s alert, playful, and hungry to taste the variety that life offers.",
      fieldFunction:
        "Opens channels of perception and language, gathering raw data and initial impressions.",
      resonanceKeywords: ["curiosity", "freshness", "variety", "light contact"],
      challenges: [
        "scattered focus",
        "surface-level engagement",
        "inconsistency",
      ],
    },
    relatable: {
      oneLiner:
        "The sampler — tasting many possibilities without yet choosing.",
    },
    emphasizedWaves: [2, 3],
  },

  [decanId("Gemini", 2)]: {
    id: decanId("Gemini", 2),
    sign: "Gemini",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes:
        "Enquiry and participation; weaving information into relationship.",
    },
    practitioner: {
      title: "Gemini Decan II",
      summary:
        "Gemini Decan II moves from simple noticing into deeper enquiry. Communication becomes more mutual, and learning happens through dialogue and shared experience.",
      fieldFunction:
        "Builds relational networks of information, practicing how to listen, ask, and respond in real time.",
      resonanceKeywords: ["enquiry", "dialogue", "connection", "participation"],
      challenges: ["over-talking", "gossip", "mental overactivity"],
    },
    relatable: {
      oneLiner: "The conversationalist — learning by talking things through.",
    },
    emphasizedWaves: [2, 6],
  },

  [decanId("Gemini", 3)]: {
    id: decanId("Gemini", 3),
    sign: "Gemini",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes:
        "Clearing and evaluation; discernment about which stories to keep.",
    },
    practitioner: {
      title: "Gemini Decan III",
      summary:
        "Gemini Decan III becomes more discerning about information and narrative. It wants to clear noise and choose which stories truly serve coherence.",
      fieldFunction:
        "Evaluates patterns and perspectives, deciding what to keep, what to release, and how to speak with more integrity.",
      resonanceKeywords: ["discernment", "editing", "clarity", "choice"],
      challenges: ["over-analysis", "skepticism", "detachment"],
    },
    relatable: {
      oneLiner: "The editor — choosing which stories continue and which end.",
    },
    emphasizedWaves: [5, 8],
  },

  // =========================
  // CANCER — Decision & Consolidation
  // =========================

  [decanId("Cancer", 1)]: {
    id: decanId("Cancer", 1),
    sign: "Cancer",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Pragmatic emotional decisions; building initial containers.",
    },
    practitioner: {
      title: "Cancer Decan I",
      summary:
        "Cancer Decan I tests how feelings and needs meet practical reality. It explores which bonds, homes, or commitments genuinely support growth.",
      fieldFunction:
        "Makes basic decisions around safety, belonging, and care in a grounded, practical way.",
      resonanceKeywords: ["pragmatism", "safety", "containment", "care"],
      challenges: ["over-caution", "fear of risk", "defensiveness"],
    },
    relatable: {
      oneLiner: "The nest-builder — creating a workable base for belonging.",
    },
    emphasizedWaves: [1, 7],
  },

  [decanId("Cancer", 2)]: {
    id: decanId("Cancer", 2),
    sign: "Cancer",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Claiming and maturing emotional commitments.",
    },
    practitioner: {
      title: "Cancer Decan II",
      summary:
        "Cancer Decan II deepens commitment to people, places, and roles. It learns what it means to show up reliably, even when feelings shift.",
      fieldFunction:
        "Stewards emotional bonds and shared spaces, helping relationships and families grow up.",
      resonanceKeywords: [
        "commitment",
        "maturity",
        "responsibility",
        "loyalty",
      ],
      challenges: ["over-responsibility", "emotional enmeshment", "guilt"],
    },
    relatable: {
      oneLiner: "The steward — showing up for what and whom you claim.",
    },
    emphasizedWaves: [3, 9],
  },

  [decanId("Cancer", 3)]: {
    id: decanId("Cancer", 3),
    sign: "Cancer",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes:
        "Centring and uniting; belonging that doesn’t erase individuality.",
    },
    practitioner: {
      title: "Cancer Decan III",
      summary:
        "Cancer Decan III integrates emotional depth with clear boundaries. It understands that true unity happens when everyone can remain themselves.",
      fieldFunction:
        "Creates cohesive family, team, or community fields where care, autonomy, and mutual support coexist.",
      resonanceKeywords: [
        "centering",
        "uniting",
        "emotional coherence",
        "community",
      ],
      challenges: ["clannishness", "exclusion", "fear of difference"],
    },
    relatable: {
      oneLiner:
        "The hearth-keeper — gathering people without asking them to shrink.",
    },
    emphasizedWaves: [4, 8],
  },

  // =========================
  // LEO — Combustion & Radiance
  // =========================

  [decanId("Leo", 1)]: {
    id: decanId("Leo", 1),
    sign: "Leo",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Emergence of radiance and self-expression.",
    },
    practitioner: {
      title: "Leo Decan I",
      summary:
        "Leo Decan I explores the courage to be visibly oneself. It is raw, bright, and learning what it means to step into the center of the stage.",
      fieldFunction:
        "Initiates self-expression and creative risk; tests how much light the field can hold.",
      resonanceKeywords: ["radiance", "courage", "play", "visibility"],
      challenges: ["attention-seeking", "fragile pride", "drama"],
    },
    relatable: {
      oneLiner: "The spotlight moment — daring to be seen as you are.",
    },
    emphasizedWaves: [1, 5],
  },

  [decanId("Leo", 2)]: {
    id: decanId("Leo", 2),
    sign: "Leo",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Drive toward attainment; expressing radiance with intention.",
    },
    practitioner: {
      title: "Leo Decan II",
      summary:
        "Leo Decan II practices turning charisma into craft. It cares about doing things well, not just loudly, and wants its efforts to have real impact.",
      fieldFunction:
        "Channels creative fire into projects, performance, and meaningful contributions.",
      resonanceKeywords: ["attainment", "craft", "impact", "authorship"],
      challenges: ["perfectionism", "ego investment", "envy"],
    },
    relatable: {
      oneLiner: "The performer — proving your light through what you create.",
    },
    emphasizedWaves: [3, 8],
  },

  [decanId("Leo", 3)]: {
    id: decanId("Leo", 3),
    sign: "Leo",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes:
        "Progression and proficiency; radiance in service of something larger.",
    },
    practitioner: {
      title: "Leo Decan III",
      summary:
        "Leo Decan III integrates personal glory with purpose. It is less concerned with applause and more with whether its light warms, guides, or inspires.",
      fieldFunction:
        "Embodies creative leadership; radiates in ways that encourage others’ brilliance too.",
      resonanceKeywords: [
        "proficiency",
        "generosity",
        "leadership",
        "inspiration",
      ],
      challenges: ["martyr-leadership", "over-responsibility", "pride wounds"],
    },
    relatable: {
      oneLiner: "The hearth-sun — shining so others remember their own light.",
    },
    emphasizedWaves: [4, 9],
  },

  // =========================
  // VIRGO — Refinement & Service
  // =========================

  [decanId("Virgo", 1)]: {
    id: decanId("Virgo", 1),
    sign: "Virgo",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes:
        "Power into effectiveness; first moves into refinement and service.",
    },
    practitioner: {
      title: "Virgo Decan I",
      summary:
        "Virgo Decan I notices what could be improved. It experiments with simple, practical changes that make life a bit more functional and aligned.",
      fieldFunction:
        "Begins the refinement process through small, tangible adjustments and attentive care.",
      resonanceKeywords: [
        "effectiveness",
        "tweaking",
        "attention",
        "usefulness",
      ],
      challenges: ["nitpicking", "self-criticism", "over-fixation"],
    },
    relatable: {
      oneLiner: "The tuner — making small changes that improve everything.",
    },
    emphasizedWaves: [2, 8],
  },

  [decanId("Virgo", 2)]: {
    id: decanId("Virgo", 2),
    sign: "Virgo",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application and awakening; discernment deepens.",
    },
    practitioner: {
      title: "Virgo Decan II",
      summary:
        "Virgo Decan II refines methods and systems. It awakens through the discipline of showing up, noticing patterns, and practicing better ways of doing things.",
      fieldFunction:
        "Applies discernment to routines, skills, and health; brings consciousness into everyday practice.",
      resonanceKeywords: [
        "application",
        "discernment",
        "practice",
        "improvement",
      ],
      challenges: ["overwork", "anxiety", "perfectionism"],
    },
    relatable: {
      oneLiner: "The practitioner — waking up through daily refinement.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Virgo", 3)]: {
    id: decanId("Virgo", 3),
    sign: "Virgo",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Authority and depth; integrity in service and craft.",
    },
    practitioner: {
      title: "Virgo Decan III",
      summary:
        "Virgo Decan III integrates precision with compassion. It wants its skill to serve healing, coherence, and humility — not just standards.",
      fieldFunction:
        "Embodies mastery in service; holds high standards while making room for human mess and learning.",
      resonanceKeywords: ["authority", "integrity", "service", "healing"],
      challenges: ["harsh judgment", "burnout", "over-functioning"],
    },
    relatable: {
      oneLiner: "The healer-craftsperson — excellence in service to wholeness.",
    },
    emphasizedWaves: [4, 9],
  },

  // =========================
  // LIBRA — Relation & Balance
  // =========================

  [decanId("Libra", 1)]: {
    id: decanId("Libra", 1),
    sign: "Libra",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes:
        "Emergence of learning through reflection and contrast in relationship.",
    },
    practitioner: {
      title: "Libra Decan I",
      summary:
        "Libra Decan I begins the learning of self through other. It notices how every connection teaches, destabilizes, or beautifies its inner balance.",
      fieldFunction:
        "Opens relational learning cycles; invites feedback from mirrors, allies, and even adversaries.",
      resonanceKeywords: ["learning", "reflection", "contrast", "connection"],
      challenges: ["indecision", "over-accommodation", "image focus"],
    },
    relatable: {
      oneLiner: "The first mirror — discovering yourself through others’ eyes.",
    },
    emphasizedWaves: [2, 6],
  },

  [decanId("Libra", 2)]: {
    id: decanId("Libra", 2),
    sign: "Libra",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application and awakening in relational skill and justice.",
    },
    practitioner: {
      title: "Libra Decan II",
      summary:
        "Libra Decan II practices fairness, boundaries, and mutuality. It cares about agreements that feel balanced in real, lived terms.",
      fieldFunction:
        "Tests and adjusts relational structures — contracts, collaborations, and shared responsibilities.",
      resonanceKeywords: ["fairness", "agreement", "mutuality", "justice"],
      challenges: [
        "conflict avoidance",
        "passive aggression",
        "performative harmony",
      ],
    },
    relatable: {
      oneLiner: "The negotiator — shaping agreements everyone can live with.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Libra", 3)]: {
    id: decanId("Libra", 3),
    sign: "Libra",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Integration of learning; depth in relational intelligence.",
    },
    practitioner: {
      title: "Libra Decan III",
      summary:
        "Libra Decan III integrates relational wisdom into presence. It knows that real peace includes difference, honesty, and sometimes friction.",
      fieldFunction:
        "Embodies relational poise; can hold tension, listen deeply, and choose alignment over superficial harmony.",
      resonanceKeywords: [
        "poise",
        "relational wisdom",
        "truth-telling",
        "co-creation",
      ],
      challenges: ["over-mediating", "self-erasure", "chronic doubt"],
    },
    relatable: {
      oneLiner: "The diplomat — holding the room while truth is spoken.",
    },
    emphasizedWaves: [4, 8],
  },

  // =========================
  // SCORPIO — Depth & Transformation
  // =========================

  [decanId("Scorpio", 1)]: {
    id: decanId("Scorpio", 1),
    sign: "Scorpio",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "First encounters with depth, intimacy, and shared power.",
    },
    practitioner: {
      title: "Scorpio Decan I",
      summary:
        "Scorpio Decan I senses what lies beneath surface agreements. It’s drawn to emotional truth, energetic subtext, and bonds that matter.",
      fieldFunction:
        "Opens investigative and intimate pathways, feeling into where trust is real and where it is not.",
      resonanceKeywords: ["intensity", "truth-sense", "magnetism", "focus"],
      challenges: ["suspicion", "jealousy", "testing others"],
    },
    relatable: {
      oneLiner: "The probe — feeling what’s really going on underneath.",
    },
    emphasizedWaves: [2, 9],
  },

  [decanId("Scorpio", 2)]: {
    id: decanId("Scorpio", 2),
    sign: "Scorpio",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application of depth; transformative encounters and commitments.",
    },
    practitioner: {
      title: "Scorpio Decan II",
      summary:
        "Scorpio Decan II moves deeper into merging and shared resources. It tests loyalty, resilience, and the edges of what can be transformed together.",
      fieldFunction:
        "Engages in depth processes — grief, shadow work, healing, and radical honesty with self and others.",
      resonanceKeywords: [
        "transformation",
        "merging",
        "healing crisis",
        "catharsis",
      ],
      challenges: ["control", "manipulation", "all-or-nothing intensity"],
    },
    relatable: {
      oneLiner:
        "The alchemist — entering the fire so something real can change.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Scorpio", 3)]: {
    id: decanId("Scorpio", 3),
    sign: "Scorpio",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Integrated power; depth held with humility and clarity.",
    },
    practitioner: {
      title: "Scorpio Decan III",
      summary:
        "Scorpio Decan III holds power more lightly. It has seen cycles of loss and rebirth and knows that clinging is the real danger.",
      fieldFunction:
        "Embodies resilient presence; able to accompany others through depth without needing to control the outcome.",
      resonanceKeywords: [
        "resilience",
        "trust",
        "depth presence",
        "soul strength",
      ],
      challenges: [
        "emotional fatigue",
        "over-responsibility",
        "hidden resentments",
      ],
    },
    relatable: {
      oneLiner: "The depth-keeper — strong enough to let things live or die.",
    },
    emphasizedWaves: [4, 8],
  },

  // =========================
  // SAGITTARIUS — Vision & Expansion
  // =========================

  [decanId("Sagittarius", 1)]: {
    id: decanId("Sagittarius", 1),
    sign: "Sagittarius",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Fresh quest impulse; first glimpse of wider horizons.",
    },
    practitioner: {
      title: "Sagittarius Decan I",
      summary:
        "Sagittarius Decan I feels the urge to explore beyond familiar ground. It seeks experiences that challenge assumptions and expand perspective.",
      fieldFunction:
        "Launches quests of meaning, travel, study, and exploration — internally or externally.",
      resonanceKeywords: ["quest", "adventure", "exploration", "openness"],
      challenges: ["restlessness", "commitment issues", "naive idealism"],
    },
    relatable: {
      oneLiner: "The trailhead — taking first steps into the unknown.",
    },
    emphasizedWaves: [1, 3],
  },

  [decanId("Sagittarius", 2)]: {
    id: decanId("Sagittarius", 2),
    sign: "Sagittarius",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application of vision; forming philosophies and paths.",
    },
    practitioner: {
      title: "Sagittarius Decan II",
      summary:
        "Sagittarius Decan II wants to make sense of experience. It begins to form coherent worldviews, teachings, or frameworks from what it has seen.",
      fieldFunction:
        "Translates experience into meaning; experiments with belief systems, spiritual paths, and big-picture thinking.",
      resonanceKeywords: [
        "philosophy",
        "meaning-making",
        "teaching",
        "frameworks",
      ],
      challenges: ["dogmatism", "over-generalization", "preaching"],
    },
    relatable: {
      oneLiner: "The map-maker — turning journeys into guiding stories.",
    },
    emphasizedWaves: [3, 6],
  },

  [decanId("Sagittarius", 3)]: {
    id: decanId("Sagittarius", 3),
    sign: "Sagittarius",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Embodied wisdom; walking the talk of vision.",
    },
    practitioner: {
      title: "Sagittarius Decan III",
      summary:
        "Sagittarius Decan III integrates belief with behavior. It cares whether its philosophy actually improves life in concrete ways.",
      fieldFunction:
        "Embodies lived wisdom; models integrity between stated values and everyday choices.",
      resonanceKeywords: [
        "integrity",
        "lived truth",
        "embodied wisdom",
        "coherence",
      ],
      challenges: [
        "moralism",
        "self-righteousness",
        "burnout from over-reaching",
      ],
    },
    relatable: {
      oneLiner: "The guide — living the path instead of just talking about it.",
    },
    emphasizedWaves: [4, 9],
  },

  // =========================
  // CAPRICORN — Structure & Stewardship
  // =========================

  [decanId("Capricorn", 1)]: {
    id: decanId("Capricorn", 1),
    sign: "Capricorn",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Pragmatic ambition; first structures of responsibility.",
    },
    practitioner: {
      title: "Capricorn Decan I",
      summary:
        "Capricorn Decan I explores what it means to take life seriously. It starts to build structures that can hold long-term goals and commitments.",
      fieldFunction:
        "Lays foundations for responsibility, reputation, and long-range effort.",
      resonanceKeywords: [
        "foundations",
        "responsibility",
        "work ethic",
        "realism",
      ],
      challenges: ["pessimism", "self-pressure", "over-control"],
    },
    relatable: {
      oneLiner: "The builder — putting up the scaffolding for a real life.",
    },
    emphasizedWaves: [1, 8],
  },

  [decanId("Capricorn", 2)]: {
    id: decanId("Capricorn", 2),
    sign: "Capricorn",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application and awakening in mastery and social function.",
    },
    practitioner: {
      title: "Capricorn Decan II",
      summary:
        "Capricorn Decan II tests itself against the world. It learns what real mastery demands and how systems respond to sustained effort.",
      fieldFunction:
        "Develops competence and authority through practice, endurance, and strategic choices.",
      resonanceKeywords: ["mastery", "status", "strategy", "endurance"],
      challenges: ["workaholism", "image obsession", "rigidity"],
    },
    relatable: {
      oneLiner: "The climber — proving your capacity over time.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Capricorn", 3)]: {
    id: decanId("Capricorn", 3),
    sign: "Capricorn",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Depth and authority; stewardship of power and resources.",
    },
    practitioner: {
      title: "Capricorn Decan III",
      summary:
        "Capricorn Decan III recognizes that power carries consequence. It explores how to use status, skill, or influence in service of something beyond ego.",
      fieldFunction:
        "Holds stewardship roles; makes decisions that shape fields, institutions, or lineages.",
      resonanceKeywords: ["stewardship", "legacy", "accountability", "gravity"],
      challenges: ["cynicism", "over-burden", "emotional distance"],
    },
    relatable: {
      oneLiner: "The elder-builder — responsible for more than just yourself.",
    },
    emphasizedWaves: [4, 9],
  },

  // =========================
  // AQUARIUS — Pattern & Future
  // =========================

  [decanId("Aquarius", 1)]: {
    id: decanId("Aquarius", 1),
    sign: "Aquarius",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Fresh pattern awareness; first glimpses of the bigger grid.",
    },
    practitioner: {
      title: "Aquarius Decan I",
      summary:
        "Aquarius Decan I sees patterns and oddities others miss. It is curious about systems, networks, and the edges of what’s considered normal.",
      fieldFunction:
        "Opens awareness to larger fields — collectives, networks, and emergent trends.",
      resonanceKeywords: [
        "pattern-seeing",
        "difference",
        "innovation",
        "objectivity",
      ],
      challenges: ["detachment", "alienation", "contrarianism"],
    },
    relatable: {
      oneLiner: "The pattern-spotter — noticing what doesn’t fit (and why).",
    },
    emphasizedWaves: [2, 6],
  },

  [decanId("Aquarius", 2)]: {
    id: decanId("Aquarius", 2),
    sign: "Aquarius",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application of pattern insight; forming experiments and futures.",
    },
    practitioner: {
      title: "Aquarius Decan II",
      summary:
        "Aquarius Decan II wants to build better systems. It tests unconventional ideas and aligns with communities or movements that resonate with its vision.",
      fieldFunction:
        "Designs and experiments with new structures — social, technological, spiritual — that might serve the future.",
      resonanceKeywords: ["experimentation", "reform", "vision", "community"],
      challenges: [
        "utopianism",
        "impersonal idealism",
        "rebellion for its own sake",
      ],
    },
    relatable: {
      oneLiner:
        "The reformer — trying out new ways for people to live and work.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Aquarius", 3)]: {
    id: decanId("Aquarius", 3),
    sign: "Aquarius",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Integrated futurism; living as a node in the wider field.",
    },
    practitioner: {
      title: "Aquarius Decan III",
      summary:
        "Aquarius Decan III integrates individuality with collective belonging. It knows that being truly yourself is part of serving the larger pattern.",
      fieldFunction:
        "Embodies a lived example of the future it believes in, while staying anchored enough to be effective.",
      resonanceKeywords: [
        "embodied future",
        "authenticity",
        "networking",
        "field-awareness",
      ],
      challenges: ["burnout", "over-detachment", "social fatigue"],
    },
    relatable: {
      oneLiner: "The signal — living now as if the future were already here.",
    },
    emphasizedWaves: [4, 8],
  },

  // =========================
  // PISCES — Dissolution & Union
  // =========================

  [decanId("Pisces", 1)]: {
    id: decanId("Pisces", 1),
    sign: "Pisces",
    index: 1,
    architecture: {
      mode: "Emergent",
      degreeRange: [0, 9],
      notes: "Fresh contact with the imaginal and subtle; boundaries soften.",
    },
    practitioner: {
      title: "Pisces Decan I",
      summary:
        "Pisces Decan I senses the porousness of reality. It drifts toward dreams, moods, and subtle currents beneath everyday life.",
      fieldFunction:
        "Opens the field to imagination, symbolism, and spiritual or artistic impressions.",
      resonanceKeywords: [
        "sensitivity",
        "dreaming",
        "imagination",
        "porousness",
      ],
      challenges: ["confusion", "escapism", "overwhelm"],
    },
    relatable: {
      oneLiner: "The dreamer — feeling more than the visible world.",
    },
    emphasizedWaves: [2, 4],
  },

  [decanId("Pisces", 2)]: {
    id: decanId("Pisces", 2),
    sign: "Pisces",
    index: 2,
    architecture: {
      mode: "Formative",
      degreeRange: [10, 19],
      notes: "Application of sensitivity; devotion, service, and surrender.",
    },
    practitioner: {
      title: "Pisces Decan II",
      summary:
        "Pisces Decan II explores devotion — to people, practices, or paths. It wants to pour itself into something that feels meaningful.",
      fieldFunction:
        "Channels sensitivity into care, service, art, or spiritual practice; learns about healthy vs. unhealthy sacrifice.",
      resonanceKeywords: ["devotion", "service", "compassion", "surrender"],
      challenges: ["self-sacrifice", "codependency", "martyr tendencies"],
    },
    relatable: {
      oneLiner: "The devotee — giving yourself to what you love or revere.",
    },
    emphasizedWaves: [3, 7],
  },

  [decanId("Pisces", 3)]: {
    id: decanId("Pisces", 3),
    sign: "Pisces",
    index: 3,
    architecture: {
      mode: "Integrated",
      degreeRange: [20, 29],
      notes: "Union and dissolution integrated with embodiment and clarity.",
    },
    practitioner: {
      title: "Pisces Decan III",
      summary:
        "Pisces Decan III integrates mystical sensitivity with grounded presence. It can feel the whole field without needing to lose itself in it.",
      fieldFunction:
        "Embodies compassionate, spacious presence; channels inspiration into forms that support healing and coherence.",
      resonanceKeywords: [
        "union",
        "compassion",
        "inspired embodiment",
        "spaciousness",
      ],
      challenges: ["drain", "boundary fatigue", "avoidance of the practical"],
    },
    relatable: {
      oneLiner: "The mystic-bridge — touching the infinite while staying here.",
    },
    emphasizedWaves: [4, 8, 9],
  },
};

/**
 * Fetch a DecanRecord by sign + index.
 */
export function getDecanRecord(
  sign: DecanSign,
  index: DecanIndex
): DecanRecord | null {
  const key = decanId(sign, index);
  return DECAN_LIBRARY[key] ?? null;
}
