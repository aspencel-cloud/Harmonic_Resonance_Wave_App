// src/components/Sidebar/DecanBlock.tsx
import React from "react";
import "./sidebar.css"; // <-- plain stylesheet (no ?inline, no modules)

type Props = {
  decan: {
    index: 1 | 2 | 3;
    startDeg: number;
    endDeg: number;
    Label?: string;
    Ruler?: string; // Chaldean face ruler if present
    Subsign?: string; // Modern sub-sign if present
    Structural_Function?: string;
    Phase_Tone?: string;
    One_Liner?: string;
    Field_Function?: string;
    Wave_Summary?: string;
    Poetic_Short?: string;
  } | null;
};

export default function DecanBlock({ decan }: Props) {
  if (!decan) return null;

  const {
    index,
    startDeg,
    endDeg,
    Label,
    Ruler,
    Subsign,
    Structural_Function,
    Phase_Tone,
    One_Liner,
    Field_Function,
    Wave_Summary,
    Poetic_Short,
  } = decan;

  return (
    <section className="block">
      <span className="chip decanChip">Decan</span>
      <h3 style={{ margin: "2px 0 0" }}>
        {Label || `Decan ${index}`}
        {Ruler ? ` — ${Ruler}` : Subsign ? ` — ${Subsign}` : ""}
      </h3>

      <ul className="kvList">
        <li>
          <strong>Degrees:</strong> {startDeg}–{endDeg}°
        </li>
        {Ruler ? (
          <li>
            <strong>Face:</strong> {Ruler}
          </li>
        ) : null}
        {Subsign ? (
          <li>
            <strong>Sub-sign:</strong> {Subsign}
          </li>
        ) : null}
      </ul>

      {One_Liner ? (
        <details className="details" open>
          <summary>Essence (one-liner)</summary>
          <div className="content">{One_Liner}</div>
        </details>
      ) : null}

      {Structural_Function ? (
        <details className="details" open>
          <summary>Structural Function &amp; Tone</summary>
          <div className="content">
            {Structural_Function}
            {Phase_Tone ? `\n\nTone: ${Phase_Tone}` : ""}
          </div>
        </details>
      ) : null}

      {Field_Function ? (
        <details className="details">
          <summary>Field Function</summary>
          <div className="content">{Field_Function}</div>
        </details>
      ) : null}

      {Wave_Summary ? (
        <details className="details">
          <summary>Wave Summary</summary>
          <div className="content">{Wave_Summary}</div>
        </details>
      ) : null}

      {Poetic_Short ? (
        <details className="details">
          <summary>Poetic</summary>
          <div className="content">{Poetic_Short}</div>
        </details>
      ) : null}
    </section>
  );
}
