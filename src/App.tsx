// src/App.tsx
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

// NEW
import {
  fetchContextManifest,
  fetchContextCsv,
  rowsToContext,
} from "./data/loadBuiltInContext";
import { normPlanet, normSign } from "./data/aliases";

type Mode = "manual" | "chart";
const LS_MANUAL = "hww.placements.manual";
const LS_CHART = "hww.placements.chart";
const LS_THEME = "hww.theme";

// Accept common ASC labels found in raw data
const ASC_ALIASES = new Set(["ASC", "Asc", "Ascendant", "Asc."]);

// Find the ASC sign from current placements (manual or chart)
function deriveAscSignFromPlacements(
  items: { planet: string; sign: string }[]
) {
  const asc = items.find((p) => ASC_ALIASES.has(p.planet));
  return asc?.sign;
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
  useEffect(() => {
    (window as any).__CTX__ = context;
  }, [context]);

  // NEW: autoload built-in CONTEXT (Sabian/Chandra/Notes) once if context is empty
  useEffect(() => {
    const skipLS = localStorage.getItem("hww.skipBuiltinContext") === "1";
    const sp = new URLSearchParams(window.location.search);
    const skipURL = sp.get("ctx") === "0";

    const isEmpty =
      !context ||
      Object.keys(context).filter((k) => k.startsWith("Wave")).length === 0;

    if (isEmpty && !skipLS && !skipURL) {
      (async () => {
        try {
          const manifest = await fetchContextManifest();
          const raw = await fetchContextCsv(manifest.dataset);
          const loaded = rowsToContext(raw);
          setContext(loaded);
          (window as any).__CTX__ = loaded; // expose for console debugging
          console.log(
            `Loaded built-in context v${manifest.version} (${raw.length} rows).`
          );
        } catch (e) {
          console.error("Auto-load context failed:", e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once after initial restore

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
    const rows = placements.map((p) => {
      const deg = Math.floor(p.degree);
      const waveId = waveIdForDegreeWithinSign(deg) ?? "";
      const planetKey = normPlanet(p.planet);
      const signKey = normSign(p.sign);
      const ctx = waveId
        ? (context as any)?.[`Wave${waveId}`]?.[signKey]?.[planetKey]?.[
            String(deg)
          ] ?? null
        : null;
      return {
        Planet: p.planet,
        Sign: p.sign,
        Degree: deg,
        Wave: waveId,
        Note: (ctx as any)?.Note ?? "",
        Sabian: (ctx as any)?.Sabian ?? (p as any)?.data?.Sabian ?? "",
        Chandra: (ctx as any)?.Chandra ?? (p as any)?.data?.Chandra ?? "",
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

          {/* Keep the debug context loader for now */}
          <button
            onClick={async () => {
              try {
                const manifest = await fetchContextManifest();
                const raw = await fetchContextCsv(manifest.dataset);
                const loaded = rowsToContext(raw);
                setContext(loaded);
                (window as any).__CTX__ = loaded;
                alert(`Built-in context v${manifest.version} loaded.`);
              } catch (e) {
                console.error(e);
                alert("Failed to load built-in context. See console.");
              }
            }}
          >
            Load Built-in Context
          </button>

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
            rotationDeg={0}
            showHouses={showHouses}
            ascSign={ascSign as any}
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
