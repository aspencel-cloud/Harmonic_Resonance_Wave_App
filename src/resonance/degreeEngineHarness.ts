// src/resonance/degreeEngineHarness.ts

import { resolvePlacement } from "./degreeEngine";
import {
  fetchContextManifest,
  fetchContextCsv,
  rowsToContext,
} from "../data/loadBuiltinContext";
import type { ContextMap } from "../app/types";

/**
 * Run a few sanity-check tests for the Degree Engine.
 * This runs in the browser (Vite dev) and logs results to the console.
 */
export async function runDegreeEngineTestHarness() {
  console.group(
    "%c[SRC Degree Engine Test Harness]",
    "color:#9b5bff;font-weight:bold;"
  );
  try {
    // 1) Load context_v1 via your existing loader
    const manifest = await fetchContextManifest();
    const rows = await fetchContextCsv(manifest.dataset);
    const context: ContextMap = rowsToContext(rows);

    console.log("[Harness] Context loaded:", {
      version: manifest.version,
      dataset: manifest.dataset,
      rows: rows.length,
    });

    // 2) Define test placements (you can edit/add your own)
    const tests = [
      {
        label: "Sun at Leo 19°38′ (your Sun)",
        name: "Sun",
        sign: "Leo",
        // Leo starts at 120° → 120 + 19.63 ≈ 139.63
        globalDegree: 120 + 19.63,
      },
      {
        label: "Moon at Gemini 29°24′ (your Moon)",
        name: "Moon",
        sign: "Gemini",
        // Gemini starts at 60° → 60 + 29.4 ≈ 89.4
        globalDegree: 60 + 29.4,
      },
      {
        label: "Vertex at Cancer 21° (example angle)",
        name: "Vertex",
        sign: "Cancer",
        // Cancer starts at 90° → 90 + 21 = 111
        globalDegree: 90 + 21,
      },
    ];

    // 3) Run the Degree Engine for each test
    for (const t of tests) {
      const placement = resolvePlacement(
        t.name,
        t.sign,
        t.globalDegree,
        context
      );

      console.group(`%c${t.label}`, "color:#00bcd4;font-weight:bold;");
      console.log("Input:", {
        name: t.name,
        sign: t.sign,
        globalDegree: t.globalDegree,
      });
      console.log("Resolved:", placement);

      console.log("Checkpoints:", {
        waveId: placement.waveId,
        decanIndex: placement.decanIndex,
        isPlanet: placement.isPlanet,
        isPoint: placement.isPoint,
        isAngle: placement.isAngle,
        archetypeName: placement.archetype?.name ?? null,
        sabian: placement.symbols.sabian,
        chandra: placement.symbols.chandra,
        mirrors: placement.mirrors,
      });
      console.groupEnd();
    }
  } catch (err) {
    console.error("[Harness] ERROR running Degree Engine tests:", err);
  } finally {
    console.groupEnd();
  }
}
