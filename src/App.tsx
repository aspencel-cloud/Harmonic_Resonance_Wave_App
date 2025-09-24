import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

import { initialState } from "./app/state";
import { ContextMap, Placement } from "./app/types";

import Wheel from "./components/Wheel/Wheel";
import Sidebar from "./components/Sidebar/Sidebar";
import LegendBar from "./components/Controls/LegendBar";
import Tooltip, { TooltipData } from "./components/common/Tooltip";

import HeaderBar from "./components/Header/HeaderBar";
import TopControlsBar from "./components/Controls/TopControlsBar";

import { LegalNotice } from "./components/Legal/LegalNotice";
import { TermsOfUseModal } from "./components/Legal/TermsOfUseModal";

import ResonanceSoundPrototype from "./features/sound/ResonanceSoundPrototype";

import { waveIdForDegreeWithinSign } from "./utils/mapping";
import { useElementSize } from "./hooks/useElementSize";

import {
  fetchContextManifest,
  fetchContextCsv,
  rowsToContext,
} from "./data/loadBuiltInContext";

import { waveDetailsById, type WaveId } from "./data/waveDetails";

// ----- constants / helpers
type Mode = "manual" | "chart";
const LS_MANUAL = "hww.placements.manual";
const LS_CHART = "hww.placements.chart";
const LS_THEME = "hww.theme";
const ASC_ALIASES = new Set(["ASC", "Asc", "Ascendant", "Asc."]);
function deriveAscSignFromPlacements(
  items: { planet: string; sign: string }[]
) {
  const asc = items.find((p) => ASC_ALIASES.has(p.planet));
  return asc?.sign;
}

export default function App() {
  // Route guard
  if (
    typeof window !== "undefined" &&
    window.location.pathname === "/sound-demo"
  ) {
    return <ResonanceSoundPrototype />;
  }

  // ---------- state ----------
  const [context, setContext] = useState<ContextMap>(initialState.context);
  const [mode, setMode] = useState<Mode>("manual");
  const [manualPlacements, setManualPlacements] = useState<Placement[]>([]);
  const [chartPlacements, setChartPlacements] = useState<Placement[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [browseWaveId, setBrowseWaveId] = useState<number | null>(null);

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

  // restore placements
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

  // autoload context
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

  // placements by mode
  const placements = mode === "manual" ? manualPlacements : chartPlacements;
  const setPlacements = (updater: (prev: Placement[]) => Placement[]) => {
    if (mode === "manual") setManualPlacements(updater);
    else setChartPlacements(updater);
  };

  // CRUD
  function addPlacement(p: Placement) {
    const deg = Math.floor(p.degree);
    const key = `${p.planet}|${p.sign}|${deg}`;
    setPlacements((prev) =>
      prev.some((x) => `${x.planet}|${x.sign}|${Math.floor(x.degree)}` === key)
        ? prev
        : [...prev, { ...p, degree: deg }]
    );
    setSelectedId(p.id);
    setBrowseWaveId(null);
  }
  function clearPlacements() {
    setPlacements(() => []);
    setSelectedId(undefined);
    setBrowseWaveId(null);
  }
  function deleteSelected() {
    if (!selectedId) return;
    setPlacements((p) => p.filter((x) => x.id !== selectedId));
    setSelectedId(undefined);
    setBrowseWaveId(null);
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
    setBrowseWaveId(null);
  }

  // exports
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

  // selection
  function handleSelect(nextId?: string) {
    if (nextId && nextId === selectedId) {
      setSelectedId(undefined);
      setBrowseWaveId(null);
      return;
    }
    setSelectedId(nextId);
    setBrowseWaveId(null);
  }
  function switchMode(next: Mode) {
    if (next !== mode) {
      setMode(next);
      setSelectedId(undefined);
      setBrowseWaveId(null);
    }
  }

  // wheel sizing
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const HEADER_H = 64,
    FOOTER_H = 36,
    VERTICAL_PAD = 32;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 900;
  const availableHeight = Math.max(
    620,
    viewportH - (HEADER_H + FOOTER_H + VERTICAL_PAD * 2)
  );
  const { width: wheelW, height: wheelH } = useElementSize(wheelRef.current);
  const wheelSize = Math.max(300, Math.floor(Math.min(wheelW, wheelH)));

  // features ON by default (no public toggles)
  const useGlyphs = true;
  const showHouses = true;
  const showAngles = true;
  const showDecans = true;

  const [showContextLoader, setShowContextLoader] = useState(false);

  // Effective wave details
  const placement = placements.find((p) => p.id === selectedId) || null;
  const autoWaveId = placement
    ? (waveIdForDegreeWithinSign(Math.floor(placement.degree)) ?? null)
    : null;
  const effectiveWaveId = browseWaveId ?? autoWaveId;
  const selectedDetails = useMemo(
    () =>
      effectiveWaveId
        ? (waveDetailsById[effectiveWaveId as WaveId] ?? null)
        : null,
    [effectiveWaveId]
  );

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

  async function loadBuiltInContext() {
    try {
      const manifest = await fetchContextManifest();
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

  const [termsOpen, setTermsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const openSoundDemo = useCallback(
    () => window.open("/sound-demo", "_blank"),
    []
  );
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--rs-bg)",
        display: "flex",
        flexDirection: "column",
      }}
      className={theme === "light" ? "light" : ""}
    >
      {/* Header with all app-level actions */}
      <HeaderBar
        appName={"Soul Resonance Wave Wheel"}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSoundDemo={openSoundDemo}
        onToggleDetails={() => setSidebarOpen((o) => !o)}
        onCenterWheel={() => {
          if (wheelRef.current) {
            wheelRef.current.scrollIntoView({ block: "center" });
          }
        }}
      />

      {/* Top Controls Bar (lean: Mode + Export/Data) */}
      <div style={{ width: "100%", background: "transparent" }}>
        <div style={{ maxWidth: 1760, margin: "0 auto", padding: "0 16px" }}>
          <TopControlsBar
            mode={mode}
            onSwitchMode={switchMode}
            showContextLoader={showContextLoader}
            setShowContextLoader={setShowContextLoader}
            loadBuiltInContext={loadBuiltInContext}
            getExportJSON={getExportJSON}
            getExportCSV={getExportCSVRows}
            addPlacement={addPlacement}
            clearPlacements={clearPlacements}
            addManyRaw={mode === "chart" ? addManyRaw : undefined}
          />
        </div>
      </div>

      {/* Main grid: Wheel | Details */}
      <div
        style={{
          width: "100%",
          maxWidth: 1760,
          margin: "0 auto",
          padding: "8px 16px 16px",
          display: "grid",
          gridTemplateColumns: `1fr ${sidebarOpen ? "minmax(560px, 800px)" : "0px"}`,
          gap: "16px",
          flex: 1,
          boxSizing: "border-box",
          minWidth: 0,
        }}
      >
        {/* Center: Wheel */}
        <div
          ref={wheelRef}
          style={{
            position: "relative",
            height: availableHeight,
            minHeight: 620,
            width: "100%",
            minWidth: 0,
            border: "1px solid var(--rs-border)",
            borderRadius: 16,
            background: "var(--rs-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Wheel
            size={wheelSize}
            placements={placements}
            selectedId={selectedId}
            onSelect={handleSelect}
            filterWaveId={
              browseWaveId === null && placement
                ? (waveIdForDegreeWithinSign(Math.floor(placement.degree)) ??
                  null)
                : null
            }
            useGlyphs={useGlyphs}
            rotationDeg={0}
            showHouses={showHouses}
            showDecans={showDecans}
            ascSign={deriveAscSignFromPlacements(placements) as any}
            asc={showAngles ? null : null}
            mc={showAngles ? null : null}
            onShowTooltip={showTooltipFromEvent}
            onHideTooltip={hideTooltip}
          />
          <Tooltip data={tooltip} />
        </div>

        {/* Right: Details */}
        {sidebarOpen ? (
          <aside
            style={{
              height: availableHeight,
              minHeight: 620,
              border: "1px solid var(--rs-border)",
              borderRadius: 16,
              background: "var(--rs-surface)",
              overflowY: "auto",
              overflowX: "hidden",
              padding: 0,
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <div style={{ paddingRight: 12 }}>
              <Sidebar
                context={context}
                setContext={setContext}
                selected={placement}
                waveDetails={selectedDetails}
                showCsvLoader={showContextLoader}
                browsingWaveId={browseWaveId}
                onExitBrowsing={() => setBrowseWaveId(null)}
              />
            </div>
          </aside>
        ) : null}
      </div>

      {/* Legend bottom */}
      <div
        style={{
          borderTop: "1px solid var(--rs-border)",
          background: "var(--rs-surface)",
          padding: 8,
        }}
      >
        <div style={{ maxWidth: 1760, margin: "0 auto" }}>
          <LegendBar
            selectedWaveId={
              browseWaveId ??
              (placement
                ? (waveIdForDegreeWithinSign(Math.floor(placement.degree)) ??
                  null)
                : null)
            }
            onSelect={(id) => {
              setSelectedId(undefined);
              setBrowseWaveId(id);
            }}
          />
        </div>
      </div>

      {/* Legal + Terms */}
      <LegalNotice onOpenTerms={() => setTermsOpen(true)} />
      <TermsOfUseModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
