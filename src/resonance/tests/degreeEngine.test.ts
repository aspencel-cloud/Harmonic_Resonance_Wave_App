import { describe, it, expect } from "vitest";
import { resolvePlacement } from "../degreeEngine";
import type { ContextMap } from "../../app/types";

// For now, we don't care about Sabian/Chandra in tests.
// An empty context is enough to validate core logic.
const EMPTY_CONTEXT: ContextMap = {} as any;

describe("Degree Engine – basic resolution", () => {
  it("resolves Sun at Leo 19° correctly", () => {
    // Leo spans 120°–149.999...
    const globalDegree = 120 + 19.63; // approx Leo 19°38'

    const placement = resolvePlacement(
      "Sun",
      "Leo",
      globalDegree,
      EMPTY_CONTEXT
    );

    // Structural degree should be 19
    expect(placement.degree).toBe(19);
    // Wave 5 owns 9/19/29
    expect(placement.waveId).toBe(5);
    // Decan II covers 10–19
    expect(placement.decanIndex).toBe(2);
    // Should clearly be a planet
    expect(placement.isPlanet).toBe(true);
    expect(placement.isPoint).toBe(false);
    expect(placement.isAngle).toBe(false);
    // Archetype should be the Sun record
    expect(placement.archetype?.name).toBe("Sun");
  });

  it("resolves Moon at Gemini 29° correctly", () => {
    // Gemini spans 60°–89.999...
    const globalDegree = 60 + 29.4; // approx Gemini 29°24'

    const placement = resolvePlacement(
      "Moon",
      "Gemini",
      globalDegree,
      EMPTY_CONTEXT
    );

    expect(placement.degree).toBe(29);
    // 29° → Wave 5 (Edge Dancers)
    expect(placement.waveId).toBe(5);
    // 29° → Decan III
    expect(placement.decanIndex).toBe(3);
    expect(placement.isPlanet).toBe(true);
    expect(placement.archetype?.name).toBe("Moon");
  });

  it("resolves Vertex at Cancer 21° as a point, not planet", () => {
    // Cancer spans 90°–119.999...
    const globalDegree = 90 + 21;

    const placement = resolvePlacement(
      "Vertex",
      "Cancer",
      globalDegree,
      EMPTY_CONTEXT
    );

    expect(placement.degree).toBe(21);
    // 21° → Wave 10 anchor? No. Wave anchors: 1/11/21 etc.
    // 21° mod wave mapping: should give Wave 10.
    expect(placement.waveId).toBe(10);
    expect(placement.isPlanet).toBe(false);
    expect(placement.isPoint).toBe(true);
    expect(placement.isAngle).toBe(false);
    expect(placement.archetype?.name).toBe("Vertex");
  });
});
