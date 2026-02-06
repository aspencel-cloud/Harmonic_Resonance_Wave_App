import React, { useMemo, useState } from "react";

import { PLANETS } from "../../data/planets";
import { SIGNS } from "../../data/signs";
import { Placement, Planet, Sign } from "../../app/types";

import RawImport from "./RawImport";

type Props = {
  // Add a single placement (used when manual add is allowed)
  onAdd: (p: Placement) => void;

  // Clear all placements in the current mode
  onClear: () => void;

  // Optional: Raw import callback (used in Full Chart mode)
  onImport?: (items: Omit<Placement, "id">[]) => void;

  // When true, manual single-add UI is visually present but disabled
  lockManualAdd?: boolean;
};

export default function Controls({
  onAdd,
  onClear,
  onImport,
  lockManualAdd = false,
}: Props) {
  const [planet, setPlanet] = useState<Planet>("Sun");
  const [sign, setSign] = useState<Sign>("Aries");
  const [degree, setDegree] = useState<number>(0); // 0–29

  const isInvalid = useMemo(
    () => degree < 0 || degree > 29 || Number.isNaN(degree),
    [degree]
  );

  const manualDisabled = lockManualAdd;

  function handleAdd() {
    if (isInvalid || manualDisabled) return;
    onAdd({
      id: `${planet}-${sign}-${degree}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      planet,
      sign,
      degree,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      {/* LEFT: Raw Import (Full Chart entry) */}
      {onImport ? (
        <div style={{ maxWidth: 560 }}>
          <RawImport onImport={onImport} />
        </div>
      ) : null}

      {/* RIGHT: Manual single-placement controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: 560,
          opacity: manualDisabled ? 0.4 : 1,
        }}
      >
        {/* Planet */}
        <select
          value={planet}
          onChange={(e) => setPlanet(e.target.value as Planet)}
          disabled={manualDisabled}
        >
          {PLANETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Sign */}
        <select
          value={sign}
          onChange={(e) => setSign(e.target.value as Sign)}
          disabled={manualDisabled}
        >
          {SIGNS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Degree 0–29 */}
        <select
          value={degree}
          onChange={(e) => setDegree(Number(e.target.value))}
          title="Degree within the sign (0–29)"
          disabled={manualDisabled}
        >
          {Array.from({ length: 30 }, (_, d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} disabled={isInvalid || manualDisabled}>
          Add
        </button>

        {/* Clear still works even when manual add is locked */}
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
