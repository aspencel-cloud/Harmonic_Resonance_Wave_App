import React, { useMemo, useState } from "react";
import { PLANETS } from "../../data/planets";
import { SIGNS } from "../../data/signs";
import { Placement, Planet, Sign } from "../../app/types";

type Props = {
  onAdd: (p: Placement) => void;
  onClear: () => void;
};

export default function Controls({ onAdd, onClear }: Props) {
  const [planet, setPlanet] = useState<Planet>("Sun");
  const [sign, setSign] = useState<Sign>("Aries");
  const [degree, setDegree] = useState<number>(0); // integer 0–29 from dropdown

  const isInvalid = useMemo(
    () => degree < 0 || degree > 29 || Number.isNaN(degree),
    [degree]
  );

  function handleAdd() {
    if (isInvalid) return;
    onAdd({
      id: `${planet}-${sign}-${degree}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      planet,
      sign,
      degree, // integer from 0–29
    });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      {/* Planet / Point */}
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

      {/* Degree 0–29 */}
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

      <button onClick={handleAdd} disabled={isInvalid}>
        Add
      </button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}
