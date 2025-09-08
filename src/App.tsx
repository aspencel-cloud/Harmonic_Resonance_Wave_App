import React, { useEffect, useRef, useState } from "react";
import { initialState } from "./app/state";
import { ContextMap, Placement } from "./app/types";
import Wheel from "./components/Wheel/Wheel";
import Sidebar from "./components/Sidebar/Sidebar";
import Controls from "./components/Controls/Controls";
import RawImport from "./components/Controls/RawImport";
import LegendBar from "./components/Controls/LegendBar";
import Tooltip, { TooltipData } from "./components/common/Tooltip";
import { exportSvg, exportPng, exportJson, exportCsv } from "./utils/export";
import { waveIdForDegreeWithinSign } from "./utils/mapping";
import { useElementSize } from "./hooks/useElementSize";

type Mode = "manual" | "chart";
const LS_MANUAL = "hww.placements.manual";
const LS_CHART = "hww.placements.chart";
const LS_THEME = "hww.theme";

// Accept common ASC labels found in raw data
const ASC_ALIASES = new Set(["ASC", "Asc", "Ascendant", "Asc."]);

// --- NEW: Canonical sign order and helpers for house math ---
const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

function signIndexFromName(name: string | undefined): number | null {
  if (!name) return null;
  const i = SIGNS.indexOf(name as (typeof SIGNS)[number]);
  return i >= 0 ? i : null;
}

function houseFromAscSign(
  ascSignName: string | undefined,
  signName: string | undefined
): number | null {
  const ascI = signIndexFromName(ascSignName);
  const sI = signIndexFromName(signName);
  if (ascI == null || sI == null) return null;
  return ((sI - ascI + 12) % 12) + 1; // 1..12
}

// --- NEW: Wave name lookup (kept local to avoid touching other files) ---
const WAVE_NAMES: Record<number, string> = {
  1: "Root Trinity",
  2: "Soul Mirror",
  3: "Spiral Initiate",
  4: "Mystic Arc",
  5: "Edge Dancers",
  6: "Bridge Builders",
  7: "Heart Weavers",
  8: "Crystal Initiates",
  9: "Harvesters",
  10: "Genesis Mirrors",
};

// Find the ASC sign from current placements (manual or chart)
function deriveAscSignFromPlacements(
  items: { planet: string; sign: string }[]
) {
  const asc = items.find((p) => ASC_ALIASES.has(p.planet));
  return asc?.sign; // e.g., "Sagittarius"
}

export default function App() {
  const [context, setContext] = useState<ContextMap>(initialState.context);
  const [mode, setMode] = useState<Mode>("manual");
  const [manualPlacements, setManualPlacements] = useState<Placement[]>([]);
  const [chartPlacements, setChartPlacements] = useState<Placement[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [selectedWaveId, setSelectedWaveId] = useState<number | null>(null);

  // theme
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem(LS_THEME) as "light" | "dark") ||
      (matchMedia && matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );
  useEffect(() => {
    localStorage.setItem(LS_THEME, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // restore/persist
  useEffect(() => {
    try {
      const rawM = localStorage.getItem(LS_MANUAL);
      if (rawM) setManualPlacements(JSON.parse(rawM));
    } catch {}
    try {
      const rawC = localStorage.getItem(LS_CHART);
      if (rawC) setChartPlacements(JSON.parse(rawC));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_MANUAL, JSON.stringify(manualPlacements));
    } catch {}
  }, [manualPlacements]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_CHART, JSON.stringify(chartPlacements));
    } catch {}
  }, [chartPlacements]);

  const placements = mode === "manual" ? manualPlacements : chartPlacements;
  const setPlacements = (updater: (prev: Placement[]) => Placement[]) => {
    if (mode === "manual") setManualPlacements(updater);
    else setChartPlacements(updater);
  };

  // add / import / delete / clear
  function addPlacement(p: Placement) {
    const deg = Math.floor(p.degree);
    const key = `${p.planet}|${p.sign}|${deg}`;
    setPlacements((prev) =>
      prev.some((x) => `${x.planet}|${x.sign}|${Math.floor(x.degree)}` === key)
        ? prev
        : [...prev, { ...p, degree: deg }]
    );
    setSelectedId(p.id);
  }
  function clearPlacements() {
    setPlacements(() => []);
    setSelectedId(undefined);
    setSelectedWaveId(null);
  }
  function deleteSelected() {
    if (!selectedId) return;
    setPlacements((prev) => prev.filter((p) => p.id !== selectedId));
    setSelectedId(undefined);
    setSelectedWaveId(null);
  }
  function addManyRaw(items: Omit<Placement, "id">[]) {
    if (mode !== "chart" || !items.length) return;
    setPlacements((prev) => {
      const seen = new Set(
        prev.map((x) => `${x.planet}|${x.sign}|${Math.floor(x.degree)}`)
      );
      const append = items
        .map((it) => {
          const deg = Math.floor(it.degree);
          const k = `${it.planet}|${it.sign}|${deg}`;
          if (seen.has(k)) return null;
          seen.add(k);
          return {
            ...it,
            degree: deg,
            id: `${it.planet}-${it.sign}-${deg}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,
          } as Placement;
        })
        .filter(Boolean) as Placement[];
      if (append.length) setSelectedId(append[append.length - 1].id);
      return [...prev, ...append];
    });
  }

  // export
  function exportPlacementsCsv() {
    const ascSign = deriveAscSignFromPlacements(placements);

    const rows = placements.map((p) => {
      const deg = Math.floor(p.degree);
      const waveId = waveIdForDegreeWithinSign(deg) ?? "";
      const waveName =
        typeof waveId === "number" ? WAVE_NAMES[waveId] || "" : "";

      // Context-driven fields (existing behavior)
      const ctx = waveId
        ? context?.[`Wave${waveId}`]?.[p.sign]?.[p.planet]?.[String(deg)] ??
          null
        : null;

      // Optional: include sign index and whole-sign house (derived from ASC)
      const signIndex = signIndexFromName(p.sign);
      const house = houseFromAscSign(ascSign, p.sign);

      return {
        Planet: p.planet,
        Sign: p.sign,
        SignIndex: signIndex ?? "",
        Degree: deg,
        Wave: waveId,
        WaveName: waveName, // <-- NEW: easy to read in spreadsheets
        House: house ?? "", // <-- NEW: whole-sign house from ASC
        Note: (ctx as any)?.Note ?? "",
        Sabian: (ctx as any)?.Sabian ?? "",
        Chandra: (ctx as any)?.Chandra ?? "",
        PersonalQuestion: (ctx as any)?.Question ?? "",
      };
    });

    exportCsv(
      rows,
      mode === "manual" ? "placements-manual.csv" : "placements-chart.csv"
    );
  }

  // selection -> auto wave filter
  function handleSelect(nextId?: string) {
    if (nextId && nextId === selectedId) {
      setSelectedId(undefined);
      setSelectedWaveId(null);
      return;
    }
    setSelectedId(nextId);

    if (!nextId) {
      setSelectedWaveId(null);
      return;
    }
    const p = placements.find((x) => x.id === nextId);
    if (!p) {
      setSelectedWaveId(null);
      return;
    }
    const wave = waveIdForDegreeWithinSign(Math.floor(p.degree));
    setSelectedWaveId(wave ?? null);
  }

  // mode switch
  function switchMode(next: Mode) {
    if (next !== mode) {
      setMode(next);
      setSelectedId(undefined);
      setSelectedWaveId(null);
    }
  }

  // responsive sizing + tooltip positioning
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useElementSize(wheelRef.current);
  const wheelSize = Math.max(240, Math.floor(Math.min(width, height) - 16));

  // glyphs + overlays
  const [useGlyphs, setUseGlyphs] = useState(true);
  const [showHouses, setShowHouses] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  // derive ASC sign for HousesRing (whole-sign houses)
  const ascSign = deriveAscSignFromPlacements(placements);

  // tooltips
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  function showTooltipFromEvent(
    e: React.MouseEvent<SVGElement, MouseEvent>,
    html: string
  ) {
    const host = wheelRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, html });
  }
  function hideTooltip() {
    setTooltip(null);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 480px",
        height: "100vh",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => switchMode("manual")}
            style={{ fontWeight: mode === "manual" ? 700 : 400 }}
          >
            Manual
          </button>
          <button
            onClick={() => switchMode("chart")}
            style={{ fontWeight: mode === "chart" ? 700 : 400 }}
          >
            Chart
          </button>
          <button
            onClick={() => setUseGlyphs((v) => !v)}
            title="Toggle planet glyphs"
          >
            {useGlyphs ? "Glyphs" : "Dots"}
          </button>
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button onClick={() => setShowHouses((v) => !v)}>
            {showHouses ? "Houses" : "No Houses"}
          </button>
          <button onClick={() => setShowAngles((v) => !v)}>
            {showAngles ? "Angles" : "No Angles"}
          </button>
        </div>

        {mode === "manual" && (
          <Controls onAdd={addPlacement} onClear={clearPlacements} />
        )}
        {mode === "chart" && <RawImport onImport={addManyRaw} />}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => {
              const svg = document.querySelector("svg") as SVGSVGElement | null;
              if (svg) exportSvg(svg, "wheel.svg");
            }}
          >
            Export SVG
          </button>
          <button
            onClick={() => {
              const svg = document.querySelector("svg") as SVGSVGElement | null;
              if (svg) exportPng(svg, "wheel.png", 2);
            }}
          >
            Export PNG
          </button>
          <button
            onClick={() =>
              exportJson(
                { context, mode, manualPlacements, chartPlacements },
                "state.json"
              )
            }
          >
            Export JSON
          </button>
          <button onClick={exportPlacementsCsv}>Export Placements CSV</button>
          <button onClick={deleteSelected} disabled={!selectedId}>
            Delete Selected
          </button>
          <button onClick={clearPlacements} disabled={!placements.length}>
            Clear
          </button>
        </div>

        {/* Wheel + tooltip overlay */}
        <div
          ref={wheelRef}
          style={{ position: "relative", flex: 1, minHeight: 0 }}
        >
          <Wheel
            size={wheelSize}
            placements={placements}
            selectedId={selectedId}
            onSelect={handleSelect}
            filterWaveId={selectedWaveId}
            useGlyphs={useGlyphs}
            rotationDeg={0} // no global rotation (stable)
            showHouses={showHouses}
            ascSign={ascSign as any} // <<< House 1 = ASC sign
            asc={showAngles ? null : null}
            mc={showAngles ? null : null}
            onShowTooltip={showTooltipFromEvent}
            onHideTooltip={hideTooltip}
          />
          <Tooltip data={tooltip} />
        </div>

        {/* Bottom legend = single wave filter UI */}
        <LegendBar
          selectedWaveId={selectedWaveId}
          onSelect={setSelectedWaveId}
        />
      </div>

      {/* RIGHT */}
      <Sidebar
        context={context}
        setContext={setContext}
        selected={placements.find((p) => p.id === selectedId) || null}
      />
    </div>
  );
}
