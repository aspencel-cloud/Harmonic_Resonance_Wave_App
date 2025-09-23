// src/components/Sidebar/DecanBlock.tsx
import React from "react";
import "./sidebar.css";

type DecanEnriched = {
  index: 1 | 2 | 3;
  startDeg: 0 | 10 | 20;
  endDeg: 9 | 19 | 29;
  Label?: string;
  Ruler?: string; // e.g., "Mars"
  Subsign?: string; // e.g., "Leo"
  Structural_Function?: string;
  Phase_Tone?: string;
  Field_Function?: string;
  Wave_Summary?: string;
  Poetic_Short?: string;
};

export default function DecanBlock({ decan }: { decan: DecanEnriched | null }) {
  if (!decan) return null;

  const header = decan.Label ?? `Decan ${decan.index}`;
  const ruler = decan.Ruler ? ` — ${decan.Ruler}` : "";
  const range = `${decan.startDeg}–${decan.endDeg}°`;

  return (
    <section>
      <div className="headerRow">
        <span className="chip decanChip">Decan</span>
        <h3 className="sectionTitle" style={{ marginLeft: 4 }}>
          {header}
          {ruler}
        </h3>
      </div>

      <ul className="kvList" style={{ marginBottom: 8 }}>
        <li>
          <strong>Degrees:</strong> {range}
        </li>
        {decan.Subsign ? (
          <li>
            <strong>Sub-sign:</strong> {decan.Subsign}
          </li>
        ) : null}
        {decan.Ruler ? (
          <li>
            <strong>Face:</strong> {decan.Ruler}
          </li>
        ) : null}
      </ul>

      {/* Collapsible: Structural Function & Tone */}
      {(decan.Structural_Function || decan.Phase_Tone) && (
        <details className="details" open>
          <summary>Structural Function & Tone</summary>
          <div className="content">
            {decan.Structural_Function ? (
              <p>
                <strong>Function:</strong> {decan.Structural_Function}
              </p>
            ) : null}
            {decan.Phase_Tone ? (
              <p>
                <strong>Phase Tone:</strong> {decan.Phase_Tone}
              </p>
            ) : null}
          </div>
        </details>
      )}

      {/* Collapsible: Field Function */}
      {decan.Field_Function && (
        <details className="details">
          <summary>Field Function</summary>
          <div className="content">{decan.Field_Function}</div>
        </details>
      )}

      {/* Collapsible: Wave Summary */}
      {decan.Wave_Summary && (
        <details className="details">
          <summary>Wave Summary</summary>
          <div className="content">{decan.Wave_Summary}</div>
        </details>
      )}

      {/* Collapsible: Poetic Snapshot */}
      {decan.Poetic_Short && (
        <details className="details">
          <summary>Poetic Snapshot</summary>
          <div className="content">{decan.Poetic_Short}</div>
        </details>
      )}

      <div className="smallNote">
        Select a Wave (via the legend) to see its details here.
      </div>
    </section>
  );
}
