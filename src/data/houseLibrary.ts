// src/data/houseLibrary.ts

export interface HouseRecord {
  id: number;
  shortName: string; // "1st House"
  title: string; // "Field of Incarnational Orientation"
  essenceSentence: string;
  coherentState?: string; // short paragraph
  shadowState?: string; // short paragraph
  keywords?: string[]; // life-area / field words
}

export const houseLibrary: Record<number, HouseRecord> = {
  1: {
    id: 1,
    shortName: "1st House",
    title: "Field of Incarnational Orientation",
    essenceSentence:
      "The 1st House is your incarnational orientation field — how the system enters embodiment and asserts presence.",
    coherentState:
      "Confident presence, clarity of orientation, natural initiation, embodied vitality, healthy self-definition.",
    shadowState:
      "Overemphasis on self-image, reactive identity, impulsive emergence, disconnection from relational balance.",
    keywords: [
      "emergence",
      "self-presentation",
      "instinctive embodiment",
      "arrival",
      "orientation",
    ],
  },

  2: {
    id: 2,
    shortName: "2nd House",
    title: "Field of Value Stabilization",
    essenceSentence:
      "The 2nd House is your value stabilization field — how the system anchors, maintains, and allocates its resources.",
    coherentState:
      "Grounded, steady, supported, resourced, able to maintain what matters.",
    shadowState:
      "Anxious about stability, uncertain of support, stuck in routine, overly attached to what feels safe.",
    keywords: [
      "stability",
      "resources",
      "continuity",
      "grounding",
      "stewardship",
    ],
  },

  3: {
    id: 3,
    shortName: "3rd House",
    title: "Field of Signal Exchange",
    essenceSentence:
      "The 3rd House is your signal exchange field — how information and awareness circulate through your immediate environment.",
    coherentState:
      "Clear perception, fluid exchange, adaptive interaction, natural learning, spontaneous curiosity.",
    shadowState:
      "Scattered attention, signal overload, compulsive mental loops, miscommunication, hyper-reactivity.",
    keywords: [
      "learning",
      "local environment",
      "communication signals",
      "perception",
      "short-range exchange",
    ],
  },

  4: {
    id: 4,
    shortName: "4th House",
    title: "Field of Rooted Belonging",
    essenceSentence:
      "The 4th House is your rooted belonging field — where the system seeks inner anchoring, origin, and emotional ground.",
    coherentState:
      "Deeply rooted, emotionally held, safe enough to feel, connected to inner home.",
    shadowState:
      "Unsettled, uprooted, clinging to the past, over-identified with origin stories, emotional withdrawal.",
    keywords: [
      "home",
      "roots",
      "emotional base",
      "inner sanctuary",
      "ancestral ground",
    ],
  },

  5: {
    id: 5,
    shortName: "5th House",
    title: "Field of Creative Radiance",
    essenceSentence:
      "The 5th House is your creative radiance field — where your life-force plays, shines, and expresses itself.",
    coherentState:
      "Authentic creativity, joyful presence, healthy risk-taking, expressive confidence, generative vitality.",
    shadowState:
      "Attention-seeking, performative identity, creative blockage, dramatization — radiance without center.",
    keywords: ["creativity", "play", "joy", "self-expression", "creative risk"],
  },

  6: {
    id: 6,
    shortName: "6th House",
    title: "Field of Integrative Function",
    essenceSentence:
      "The 6th House is your integrative function field — where you refine, practice, and bring your life into working order.",
    coherentState:
      "Consistent routines, clean energetic boundaries, craftsmanship, embodied skill, smooth functioning.",
    shadowState:
      "Over-analysis, perfectionism, rigidity, burnout from over-functioning — integration without balance.",
    keywords: [
      "refinement",
      "practice",
      "order",
      "daily rhythm",
      "craft",
      "competence",
    ],
  },

  7: {
    id: 7,
    shortName: "7th House",
    title: "Field of Relational Convergence",
    essenceSentence:
      "The 7th House is your relational convergence field — where you meet others as mirrors and co-creators.",
    coherentState:
      "Balanced partnership, clear mirroring, mutual recognition, shared space that feels alive and reciprocal.",
    shadowState:
      "Over-focus on others, loss of self in relationship, projection, fate- or soulmate-style fixation.",
    keywords: [
      "partnership",
      "mirroring",
      "agreements",
      "relational meeting",
      "balance",
    ],
  },

  8: {
    id: 8,
    shortName: "8th House",
    title: "Field of Shared Energetics",
    essenceSentence:
      "The 8th House is your shared energetics field — where you merge, transform, and evolve through deep connection.",
    coherentState:
      "Deeply connected, willing to transform, empowered through intimacy, honest about your depth.",
    shadowState:
      "Overwhelmed, afraid of exposure, entangled or over-attached, pulled into intensity without clarity.",
    keywords: [
      "merging",
      "shared resources",
      "intimacy",
      "power exchange",
      "transformation",
    ],
  },

  9: {
    id: 9,
    shortName: "9th House",
    title: "Field of Meaning & Orientation",
    essenceSentence:
      "The 9th House is your meaning and orientation field — where the system widens perspective and orients to a larger story.",
    coherentState:
      "Broad perspective, orienting wisdom, clarity about direction, inspired exploration, synthesizing insight.",
    shadowState:
      "Dogmatism, ideological rigidity, overgeneralization, escapist searching — meaning without grounding.",
    keywords: [
      "philosophy",
      "worldview",
      "exploration",
      "big-picture meaning",
      "orientation",
    ],
  },

  10: {
    id: 10,
    shortName: "10th House",
    title: "Field of Public Contribution",
    essenceSentence:
      "The 10th House is your public contribution field — how the system crystallizes its role, responsibility, and visible impact in the wider world.",
    coherentState:
      "Clear contribution, grounded authority, coherent responsibility, visibility aligned with inner truth.",
    shadowState:
      "Over-identification with status, burnout through obligation, image management instead of contribution.",
    keywords: [
      "role",
      "responsibility",
      "public presence",
      "legacy",
      "impact field",
    ],
  },

  11: {
    id: 11,
    shortName: "11th House",
    title: "Field of Collective Coherence",
    essenceSentence:
      "The 11th House is your collective coherence field — how you participate in, receive from, and harmonize with collective currents and futures.",
    coherentState:
      "Connected beyond the personal, energized by community, inspired by collective vision, able to offer your gifts to others.",
    shadowState:
      "Disconnected from self within groups, unsure of belonging, overly attached to group identity, socially overstimulated or detached.",
    keywords: [
      "community",
      "networks",
      "collective purpose",
      "futures",
      "participation",
    ],
  },

  12: {
    id: 12,
    shortName: "12th House",
    title: "Field of Transcendent Dissolution",
    essenceSentence:
      "The 12th House is your transcendent dissolution field — where identity dissolves and re-enters the symbolic, intuitive, and collective dimensions of being.",
    coherentState:
      "Spiritually connected, intuitively guided, deeply compassionate, at peace with the unseen.",
    shadowState:
      "Unmoored, overwhelmed, disconnected from clear identity, tempted to escape — surrender without structure.",
    keywords: [
      "dissolution",
      "surrender",
      "mysticism",
      "collective unconscious",
      "liminal space",
    ],
  },
};
