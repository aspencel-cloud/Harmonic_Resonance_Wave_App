// src/data/waveDetails.ts

export type WaveId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type WaveMeta = {
  id: WaveId;
  shortId: string;
  name: string;
  anchors: string[]; // e.g., ["4°","14°","24°"]
};

export type WaveDetails = WaveMeta & {
  title: string;
  summary: string;
  keywords?: string[];
  sections: Array<{ id: string; title: string; paragraphs: string[] }>;
};

export const waves: WaveMeta[] = [
  {
    id: 1,
    shortId: "W1",
    name: "Wave 1 — The Root Trinity",
    anchors: ["0°", "10°", "20°"],
  },
  {
    id: 2,
    shortId: "W2",
    name: "Wave 2 — The Soul Mirror",
    anchors: ["5°", "15°", "25°"],
  },
  {
    id: 3,
    shortId: "W3",
    name: "Wave 3 — The Spiral Initiate",
    anchors: ["3°", "13°", "23°"],
  },
  {
    id: 4,
    shortId: "W4",
    name: "Wave 4 — The Mystic Arc",
    anchors: ["7°", "17°", "27°"],
  },
  {
    id: 5,
    shortId: "W5",
    name: "Wave 5 — The Edge Dancers",
    anchors: ["9°", "19°", "29°"],
  },
  {
    id: 6,
    shortId: "W6",
    name: "Wave 6 — The Bridge Builders",
    anchors: ["2°", "12°", "22°"],
  },
  {
    id: 7,
    shortId: "W7",
    name: "Wave 7 — The Heart Weavers",
    anchors: ["4°", "14°", "24°"],
  },
  {
    id: 8,
    shortId: "W8",
    name: "Wave 8 — The Crystal Initiates",
    anchors: ["6°", "16°", "26°"],
  },
  {
    id: 9,
    shortId: "W9",
    name: "Wave 9 — The Harvesters",
    anchors: ["8°", "18°", "28°"],
  },
  {
    id: 10,
    shortId: "W10",
    name: "Wave 10 — The Genesis Mirrors",
    anchors: ["1°", "11°", "21°"],
  },
];

export const waveDetailsById: Record<WaveId, WaveDetails> = {
  1: {
    ...waves[0],
    title: "Wave 1 — The Root Trinity (0°, 10°, 20°)",
    summary:
      "The Starter — seed-planter energy that ignites beginnings and brings new things into being.",
    keywords: ["Starter", "Initiation", "Spark", "Beginnings"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Starter",
        paragraphs: [
          "You are the seed-planter of the zodiac. You're here to light the spark and bring new things into being—projects, ideas, or movements. You thrive on beginnings and have the courage to ignite momentum and inspire action in others. You might not always finish what you start, but you'll initiate things no one else dares to.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are reliable, have strong personal clarity, and are good at turning ideas into tangible results. People often know where they stand with you and count on your consistent presence.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can scatter your energy by starting too many things without finishing, chasing novelty over depth. This can also manifest as becoming rigid or overly invested in “being right,” mistaking control for stability.",
        ],
      },
    ],
  },
  2: {
    ...waves[1],
    title: "Wave 2 — The Soul Mirror (5°, 15°, 25°)",
    summary:
      "The Mirror — reflective presence that reveals patterns and grows through relationships.",
    keywords: ["Mirror", "Harmony", "Relational Growth", "Beauty"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Mirror",
        paragraphs: [
          "You naturally reflect truth back to people, helping them see themselves more clearly. Your presence often reveals hidden truths and unspoken patterns in others. You value harmony, beauty, and recognizing the patterns that connect things. Growth often happens for you through relationships and social dynamics that serve as catalysts for self-awareness.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are highly sensitive to social dynamics, learn quickly from experience, and are skilled at tuning into others' feelings, making you a natural empath or mediator.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can lose your own sense of self by mirroring others too much or over-identifying with their perceptions. You might avoid conflict at the cost of your own authenticity.",
        ],
      },
    ],
  },
  3: {
    ...waves[2],
    title: "Wave 3 — The Spiral Initiate (3°, 13°, 23°)",
    summary:
      "The Spiral Walker — iterative growth that returns to themes at deeper levels.",
    keywords: ["Iteration", "Layers", "Deep Learning", "Recursion"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Spiral Walker",
        paragraphs: [
          "Your growth is never in a straight line; you move in spirals, returning to themes at deeper levels of understanding each time. You embrace learning as a lifelong process and thrive in layered exploration. You are a deep learner who needs to see things from multiple angles and are more sensitive to “unfinished business”.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are excellent at building mastery through iteration and can track subtle shifts over time. You are persistent and capable of long-term projects where progress is not linear.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can get caught in endless loops without reaching closure, or over-complicate situations by seeing too many angles at once.",
        ],
      },
    ],
  },
  4: {
    ...waves[3],
    title: "Wave 4 — The Mystic Arc (7°, 17°, 27°)",
    summary:
      "The Steady Builder / Intuitive — attuned to sacred patterns beneath life’s surface.",
    keywords: ["Pattern Sense", "Intuition", "Meaning", "Cycles"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Steady Builder / Intuitive",
        paragraphs: [
          "You are tuned to the sacred patterns beneath life's surface. You have a strong intuitive sense of what's going on beneath conversations and events. You are drawn to meaning from symbols, cycles, and synchronicity. You often feel that something unseen is guiding you, and your life may feel guided by “meant to be” moments.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You have high emotional intelligence, the ability to perceive emotional layers others miss, and deep resilience built from navigating complexity. People count on you because you don't rush the foundation.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can get lost in abstract meaning and neglect practical action, or become overly idealistic. You may also get stuck in emotional rumination or struggle to express your inner depth clearly.",
        ],
      },
    ],
  },
  5: {
    ...waves[4],
    title: "Wave 5 — The Edge Dancers (9°, 19°, 29°)",
    summary:
      "The Threshold Keeper — lives at endings/beginnings and guides crossing points.",
    keywords: ["Thresholds", "Change", "Courage", "Crossing"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Threshold Keeper",
        paragraphs: [
          "You live at thresholds—the boundaries between endings and beginnings, the known and the unknown. You have a gift for navigating change and helping others (and yourself) cross from one phase of life to another. You understand that endings are not failures, but gateways to renewal.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are adaptable and resilient during periods of change, skilled at managing uncertainty, and courageous in facing the unknown.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You may cling to the edge without fully committing to crossing, or create drama to avoid stability. You might also have a tendency to burn bridges too quickly.",
        ],
      },
    ],
  },
  6: {
    ...waves[5],
    title: "Wave 6 — The Bridge Builders (2°, 12°, 22°)",
    summary:
      "The Bridge — connects people, ideas, and worlds into coherent wholes.",
    keywords: ["Bridge", "Diplomacy", "Translation", "Cooperation"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Bridge",
        paragraphs: [
          "You connect people, ideas, and worlds that might never meet otherwise. You see hidden common ground and help create harmony across divides. You often act as a mediator or translator, seeing where separate parts can be brought together into a coherent whole.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are diplomatic and empathetic, able to see multiple sides fairly, and a creative problem-solver who fosters cooperation.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You may overextend yourself trying to keep everyone connected, becoming a “go-between” who neglects your own needs to maintain peace.",
        ],
      },
    ],
  },
  7: {
    ...waves[6],
    title: "Wave 7 — The Heart Weavers (4°, 14°, 24°)",
    summary:
      "The Heart Weaver — builds bonds, belonging, and resilient communities.",
    keywords: ["Care", "Belonging", "Trust", "Community"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Heart Weaver",
        paragraphs: [
          "You build relationships and communities with care, like a weaver making strong cloth. Your strength lies in tending to the emotional bonds that hold people together, creating trust and a sense of belonging. You value loyalty and are committed to growing relationships over time.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You have high emotional intelligence and empathy, are skilled at fostering safe and nurturing environments, and are patient in resolving conflict.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can over-nurture to the point of enabling or sacrifice your own needs to keep the peace. You may also resist necessary endings to preserve harmony.",
        ],
      },
    ],
  },
  8: {
    ...waves[7],
    title: "Wave 8 — The Crystal Initiates (6°, 16°, 26°)",
    summary:
      "The Crystal — brings natural clarity and structure; organizes complexity.",
    keywords: ["Structure", "Clarity", "Order", "Systems"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Crystal",
        paragraphs: [
          "You carry a natural clarity and love of structure. You bring order where there is chaos and help people see the systems that hold their lives steady. You are skilled at organizing complexity into clear, efficient, and functional forms.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You have high attention to detail, strong organizational skills, and the ability to bring stability to uncertain situations.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You can become rigid, overly controlling, or perfectionistic in your pursuit of order. You may focus too much on details while missing the bigger picture.",
        ],
      },
    ],
  },
  9: {
    ...waves[8],
    title: "Wave 9 — The Harvesters (8°, 18°, 28°)",
    summary:
      "The Harvester — gathers lessons, preserves what’s valuable, and closes cycles.",
    keywords: ["Legacy", "Lessons", "Closure", "Wisdom"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Harvester",
        paragraphs: [
          "You are a collector of wisdom and a keeper of legacy. You are here to gather the lessons of the past and ensure what is valuable is preserved and passed forward. You naturally reflect on what you've learned and feel a strong connection to what you leave behind.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You are skilled at seeing the big picture, extracting key lessons from experience, and bringing projects to a meaningful close.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You may live too much in the past, resist change, or hoard knowledge and resources instead of sharing them.",
        ],
      },
    ],
  },
  10: {
    ...waves[9],
    title: "Wave 10 — The Genesis Mirrors (1°, 11°, 21°)",
    summary:
      "The Mirror Gate — reset points that invite renewal and fresh cycles.",
    keywords: ["Reset", "Renewal", "Choice", "Crossroads"],
    sections: [
      {
        id: "theme",
        title: "Theme: The Mirror Gate",
        paragraphs: [
          "You are a reset point in human form. You help people see themselves clearly and start again, reminding them that a fresh cycle is always possible. You frequently find yourself at crossroads and have the ability to recognize old patterns and deliberately choose different paths.",
        ],
      },
      {
        id: "strengths",
        title: "Potential Strengths",
        paragraphs: [
          "You have a strong capacity for renewal and reinvention, are insightful about past lessons, and can inspire fresh energy in yourself and others.",
        ],
      },
      {
        id: "shadow",
        title: "Shadow Alert",
        paragraphs: [
          "You might abandon projects or relationships too soon, mistaking a moment of challenge for a genuine ending. You can also hesitate at the start for fear of repeating past mistakes.",
        ],
      },
    ],
  },
};
