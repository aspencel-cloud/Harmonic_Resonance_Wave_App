import React, { useMemo, useState } from "react";

import { PLANETS } from "../../data/planets";
import { SIGNS } from "../../data/signs";
import { Placement, Planet, Sign } from "../../app/types";

type Props = {
  onAdd: (p: Placement) => void;
  onClear: () => void;
};

const HOUSE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function QuickControls({ onAdd, onClear }: Props) {
  const [planet, setPlanet] = useState<Planet>("Sun");
  const [sign, setSign] = useState<Sign>("Aries");
  const [degree, setDegree] = useState<number>(0); // 0–29
  const [house, setHouse] = useState<number>(1); // 1–12

  const isInvalid = useMemo(
    () =>
      degree < 0 ||
      degree > 29 ||
      Number.isNaN(degree) ||
      house < 1 ||
      house > 12 ||
      Number.isNaN(house),
    [degree, house]
  );

  function handleAdd() {
    if (isInvalid) return;
    onAdd({
      id: `${planet}-${sign}-${degree}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      planet,
      sign,
      degree,
      // House is included for Door 1 entries
      // (existing logic ignores it if not needed)
      // @ts-expect-error: house may be optional on Placement
      house,
    } as Placement);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        maxWidth: 720,
      }}
    >
      {/* Planet */}
      <select
        value={planet}
        onChange={(e) => setPlanet(e.target.value as Planet)}
      >
        {PLANETS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Sign */}
      <select value={sign} onChange={(e) => setSign(e.target.value as Sign)}>
        {SIGNS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Degree */}
      <select
        value={degree}
        onChange={(e) => setDegree(Number(e.target.value))}
        title="Degree within the sign (0–29)"
      >
        {Array.from({ length: 30 }, (_, d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* House (1–12) */}
      <select
        value={house}
        onChange={(e) => setHouse(Number(e.target.value))}
        title="House number (1–12)"
      >
        {HOUSE_OPTIONS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <button onClick={handleAdd} disabled={isInvalid}>
        Add
      </button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}
