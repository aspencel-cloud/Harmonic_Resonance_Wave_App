import { describe, it, expect } from "vitest";
import { resolvePlacement } from "../degreeEngine";
import { buildResonanceReading } from "../readingBuilder";
import type { ContextMap } from "../../app/types";

const EMPTY_CONTEXT: ContextMap = {} as any;

// Simple mock context for Sun in Leo 19° (Wave 5)
const MOCK_CONTEXT: ContextMap = {
  Wave5: {
    Leo: {
      Sun: {
        "19": {
          Note: "You walk between radiance and shadow, learning how to hold both without collapsing into either.",
          Sabian: "20. A houseboat party.",
          Chandra: "20. A cafeteria with an endless variety of dishes.",
          Question:
            "Where are you being invited to shine more honestly, without performance?",
        },
      },
    },
  },
} as any;

describe("Reading Builder – basic flow", () => {
  it("builds a coherent reading object for Sun in Leo 19° and logs it", () => {
    const globalDegree = 120 + 19.63;

    const placement = resolvePlacement(
      "Sun",
      "Leo",
      globalDegree,
      EMPTY_CONTEXT // context is not used by Degree Engine yet
    );

    // 🔴 Key change: pass MOCK_CONTEXT into the reading builder
    const reading = buildResonanceReading(placement, MOCK_CONTEXT);

    // Basic structural checks
    expect(reading.header).toContain("Sun in Leo");
    expect(reading.sections.length).toBeGreaterThan(0);
    expect(reading.sections[0].id).toBe("summary");

    // Expect Symbol Dialogue section to be present now
    const hasSymbolSection = reading.sections.some((s) => s.id === "symbols");
    expect(hasSymbolSection).toBe(true);

    // DEBUG: pretty-print the reading so you can evaluate tone
    console.log("\n========== SRC READING: Sun in Leo 19° ==========");
    console.log("HEADER:", reading.header);
    console.log("SUBHEADER:", reading.subheader);
    console.log("-------------------------------------------------");
    for (const section of reading.sections) {
      console.log(`\n[${section.label}]`);
      console.log(section.body);
    }
    console.log("=================================================\n");
  });
});
