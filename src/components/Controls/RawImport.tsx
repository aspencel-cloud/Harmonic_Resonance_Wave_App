import React, { useState } from "react";
import { Placement } from "../../app/types";
import { parseRawInput } from "../../utils/raw";

export default function RawImport({
  onImport,
}: {
  onImport: (items: Omit<Placement, "id">[]) => void;
}) {
  const [text, setText] = useState("");
  const [report, setReport] = useState<string>("");

  function handleParse() {
    const { placements, errors } = parseRawInput(text);
    onImport(placements);
    setReport(
      `Imported ${placements.length} item(s)` +
        (errors.length
          ? ` • ${errors.length} warning(s):\n- ` + errors.join("\n- ")
          : "")
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <details>
        <summary style={{ cursor: "pointer", marginBottom: 6 }}>
          Raw Import (paste lines like “Sun in Aquarius 26°24’, …”)
        </summary>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{ width: "100%", fontFamily: "monospace" }}
          placeholder={`Sun in Aquarius 26°24’, in 3rd House\nMoon in Aquarius 26°18’, in 3rd House\n...`}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={handleParse}>Parse & Add</button>
          <button
            onClick={() => {
              setText("");
              setReport("");
            }}
          >
            Clear
          </button>
        </div>
        {report && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              marginTop: 8,
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            {report}
          </pre>
        )}
      </details>
    </div>
  );
}
