import React, { useEffect, useRef, useState, useMemo } from "react";

import { initialState } from "./app/state";
import { ContextMap, Placement } from "./app/types";
import Wheel from "./components/Wheel/Wheel";
import Sidebar from "./components/Sidebar/Sidebar";
import Controls from "./components/Controls/Controls";
import RawImport from "./components/Controls/RawImport"; // kept for chart mode via Controls props (optional)
import LegendBar from "./components/Controls/LegendBar";
import Tooltip, { TooltipData } from "./components/common/Tooltip";
// ❌ removed direct export helpers here; Controls menu calls them internally
// import { exportSvg, exportPng, exportJson, exportCsv } from "./utils/export";
import { waveIdForDegreeWithinSign } from "./utils/mapping";
import { useElementSize } from "./hooks/useElementSize";

// Built-in context loader
import {
  fetchContextManifest,
  fetchContextCsv,
  rowsToContext,
} from "./data/loadBuiltInContext";

// Wave core descriptions (for bottom panel in Sidebar)
import { waveDetailsById, type WaveId } from "./data/waveDetails";

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

  // Autoload built-in CONTEXT once if empty
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
          localStorage.setItem("hww.ctx.version", manifest.version);
          console.log(`Loaded built-in context v${manifest.version}`);
        } catch (e) {
          console.error("Auto-load context failed:", e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            id: `${it.planet}-${it.sign}-${deg}-${Math.random().toString(36).slice(2, 7)}`,
          } as Placement;
        })
        .filter(Boolean) as Placement[];
      if (append.length) setSelectedId(append[append.length - 1].id);
      return [...prev, ...append];
    });
  }

  // ----- Data providers for export menu -----
  function getExportCSVRows() {
    return placements.map((p) => {
      const deg = Math.floor(p.degree);
      const waveId = waveIdForDegreeWithinSign(deg) ?? "";
      const ctx = waveId
        ? ((context as any)?.[`Wave${waveId}`]?.[p.sign]?.[p.planet]?.[
            String(deg)
          ] ?? null)
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
  }
  function getExportJSON() {
    return { context, mode, manualPlacements, chartPlacements };
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
  const [showDecans, setShowDecans] = useState(false);
  const [showContextLoader, setShowContextLoader] = useState(false); // <- CSV loader toggle

  // derive ASC sign for HousesRing (whole-sign houses)
  const ascSign = deriveAscSignFromPlacements(placements);

  // Wave details for bottom panel (Legend -> select a wave)
  const selectedDetails = useMemo(() => {
    return selectedWaveId
      ? (waveDetailsById[selectedWaveId as WaveId] ?? null)
      : null;
  }, [selectedWaveId]);

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

  // loader moved into Controls via onLoadBuiltInContext
  async function loadBuiltInContext() {
    try {
      const manifest = await fetchContextManifest();
      console.log("[CTX] manifest", manifest);
      const raw = await fetchContextCsv(manifest.dataset);
      const loaded = rowsToContext(raw);
      setContext(loaded);
      localStorage.setItem("hww.ctx.version", manifest.version);
      alert(`Built-in context v${manifest.version} loaded.`);
    } catch (e: any) {
      console.error("[CTX] load failed:", e);
      alert(`Failed to load built-in context:\n${e?.message || e}`);
    }
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
          <button
            onClick={() => setShowDecans((v) => !v)}
            title="Toggle Decans"
          >
            {showDecans ? "Decans" : "No Decans"}
          </button>
          <button
            onClick={() => setShowContextLoader((v) => !v)}
            title="Toggle CSV Loader"
          >
            {showContextLoader ? "Hide CSV Loader" : "CSV Loader"}
          </button>
        </div>

        {/* MIDDLE: Controls (left) + Wheel (right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 560px) 1fr",
            gap: 16,
            alignItems: "start",
            // this row stretches to fill all available height:
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* LEFT COLUMN: controls stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 0,
            }}
          >
            <Controls
              onAdd={addPlacement}
              onClear={clearPlacements}
              onImport={mode === "chart" ? addManyRaw : undefined}
              onLoadBuiltInContext={loadBuiltInContext}
              getExportJSON={() => getExportJSON()}
              getExportCSV={() => getExportCSVRows()}
            />
          </div>
          {/* RIGHT COLUMN: wheel gets the full remaining space */}
          <div
            ref={wheelRef}
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              height: "100%", // <- give useElementSize full height to work with
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
              showDecans={showDecans}
              ascSign={ascSign as any}
              asc={showAngles ? null : null}
              mc={showAngles ? null : null}
              onShowTooltip={showTooltipFromEvent}
              onHideTooltip={hideTooltip}
            />
            <Tooltip data={tooltip} />
          </div>
        </div>
        {/* BOTTOM: legend stays at the bottom */}
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
        waveDetails={selectedDetails}
        showCsvLoader={showContextLoader} // <- pass toggle
      />
    </div>
  );
}
