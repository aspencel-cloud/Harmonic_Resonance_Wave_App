import React, { useEffect, useMemo, useRef, useState } from "react";
import type { WaveKey } from "../../utils/waveColorStyle";
import {
  styleFromWaveColor,
  barBackground,
  chipBackground,
  textColorForChip,
} from "../../utils/waveColorStyle";

// ===== Harmonic Wave Wheel — Sound Prototype (React/Web Audio) =====
// Audibility Boost adds a QUIET 2nd harmonic (×2) so low tones (e.g., 108 Hz)
// are audible on small speakers — base frequency math remains untouched.

// ---------- Data: Ten Harmonic Waves (432-root mapping) ----------
type WaveDef = { name: string; frequency: number; desc: string };
const WAVE_MAP: Record<WaveKey, WaveDef> = {
  W1: {
    name: "Wave 1 — Root Trinity",
    frequency: 432.0,
    desc: "Baseline coherence / ignition",
  },
  W2: {
    name: "Wave 2 — Soul Mirror",
    frequency: 267.72,
    desc: "Golden mean reflection",
  },
  W3: {
    name: "Wave 3 — Spiral Initiate",
    frequency: 688.56,
    desc: "Phi expansion / recursion",
  },
  W4: {
    name: "Wave 4 — Mystic Arc",
    frequency: 375.0,
    desc: "Inner octave / contemplative",
  },
  W5: {
    name: "Wave 5 — Edge Dancers",
    frequency: 324.0,
    desc: "Threshold / dissolution",
  },
  W6: {
    name: "Wave 6 — Bridge Builders",
    frequency: 576.0,
    desc: "Coherence / linking",
  },
  W7: {
    name: "Wave 7 — Heart Weavers",
    frequency: 486.0,
    desc: "Emotional architecture",
  },
  W8: {
    name: "Wave 8 — Crystal Initiates",
    frequency: 864.0,
    desc: "Geometric embodiment",
  },
  W9: {
    name: "Wave 9 — The Harvesters",
    frequency: 288.0,
    desc: "Memory resurfacing",
  },
  W10: {
    name: "Wave 10 — Genesis Mirrors",
    frequency: 108.0,
    desc: "Toroidal broadcast",
  },
};

// ---------- Audio Engine ----------
class ResonanceAudio {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  active: Map<
    string,
    {
      osc: OscillatorNode;
      gain: GainNode;
      osc2?: OscillatorNode;
      gain2?: GainNode;
    }
  >;

  constructor() {
    this.active = new Map();
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  setMasterGain(value: number) {
    const ctx = this.ensureContext();
    if (this.masterGain) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, value)),
        now + 0.1
      );
    }
  }

  startTone(
    key: string,
    frequency: number,
    type: OscillatorType = "sine",
    fadeMs = 0.4,
    boost = false
  ) {
    const ctx = this.ensureContext();
    if (this.active.has(key)) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + fadeMs);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();

    let osc2: OscillatorNode | undefined;
    let gain2: GainNode | undefined;
    if (boost) {
      osc2 = ctx.createOscillator();
      gain2 = ctx.createGain();
      osc2.type = type;
      osc2.frequency.value = frequency * 2; // 2nd harmonic
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.linearRampToValueAtTime(0.15, now + fadeMs);
      osc2.connect(gain2);
      gain2.connect(this.masterGain!);
      osc2.start();
    }

    this.active.set(key, { osc, gain, osc2, gain2 });
  }

  stopTone(key: string, fadeMs = 0.4) {
    const nodes = this.active.get(key);
    if (!nodes || !this.ctx) return;
    const { osc, gain, osc2, gain2 } = nodes;
    const now = this.ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.linearRampToValueAtTime(0, now + fadeMs);
    osc.stop(now + fadeMs + 0.02);

    if (gain2 && osc2) {
      gain2.gain.cancelScheduledValues(now);
      gain2.gain.linearRampToValueAtTime(0, now + fadeMs);
      osc2.stop(now + fadeMs + 0.02);
    }

    this.active.delete(key);
  }

  stopAll(fadeMs = 0.3) {
    Array.from(this.active.keys()).forEach((k) => this.stopTone(k, fadeMs));
  }

  async playOneShot(
    frequency: number,
    duration = 5,
    type: OscillatorType = "sine",
    boost = false
  ) {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    gain.gain.setValueAtTime(0.5, now + Math.max(0, duration - 0.8));
    gain.gain.linearRampToValueAtTime(0, now + Math.max(0.01, duration - 0.4));
    osc.stop(now + duration);

    if (boost) {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = type;
      osc2.frequency.value = frequency * 2;
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(this.masterGain!);
      osc2.start(now);
      gain2.gain.setValueAtTime(0.15, now + Math.max(0, duration - 0.8));
      gain2.gain.linearRampToValueAtTime(
        0,
        now + Math.max(0.01, duration - 0.4)
      );
      osc2.stop(now + duration);
    }
  }

  async playSequence(
    freqs: number[],
    perToneSec = 5,
    type: OscillatorType = "sine",
    boost = false
  ) {
    for (const f of freqs) {
      await this.playOneShot(f, perToneSec, type, boost);
      await new Promise((r) => setTimeout(r, 120));
    }
  }
}

function useResonanceAudio() {
  const ref = useRef<ResonanceAudio | null>(null);
  if (!ref.current) ref.current = new ResonanceAudio();
  useEffect(() => () => ref.current?.stopAll(0.1), []);
  return ref.current!;
}

// ---------- UI Component ----------
export default function ResonanceSoundPrototype() {
  const audio = useResonanceAudio();
  const [waveform, setWaveform] = useState<OscillatorType>("sine");
  const [modeChord, setModeChord] = useState<boolean>(true);
  const [masterGain, setMasterGain] = useState<number>(0.6);
  const [perToneSec, setPerToneSec] = useState<number>(5);
  const [audibilityBoost, setAudibilityBoost] = useState<boolean>(true);

  useEffect(() => {
    audio.setMasterGain(masterGain);
  }, [masterGain]);

  const waves = useMemo(
    () => Object.entries(WAVE_MAP) as [WaveKey, WaveDef][],
    []
  );
  const sequence = useMemo(() => waves.map(([, w]) => w.frequency), [waves]);

  const toggleTone = (key: WaveKey) => {
    const k = `tone:${key}`;
    // @ts-ignore internal map ok for presence check
    const isActive = (audio as any).active?.has(k);
    if (modeChord) {
      if (isActive) audio.stopTone(k);
      else
        audio.startTone(
          k,
          WAVE_MAP[key].frequency,
          waveform,
          0.4,
          audibilityBoost
        );
    } else {
      audio.playOneShot(
        WAVE_MAP[key].frequency,
        perToneSec,
        waveform,
        audibilityBoost
      );
    }
  };

  return (
    <div
      className="h-full"
      style={{
        ["--bg" as any]: "var(--hww-bg, #0b0b0b)",
        ["--card" as any]: "var(--hww-card, rgba(255,255,255,0.07))",
        ["--cardBorder" as any]:
          "var(--hww-card-border, rgba(255,255,255,0.12))",
        ["--text" as any]: "var(--hww-text, #eaeaea)",
        ["--muted" as any]: "var(--hww-muted, #b8b8b8)",
      }}
    >
      <style>{`
        .rs-root{color:var(--text);background:var(--bg);min-height:100%;padding:24px 20px}
        .rs-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        @media (max-width: 960px){.rs-grid{grid-template-columns:1fr}}
        .rs-card{background:var(--card);border:1px solid var(--cardBorder);border-radius:16px;padding:16px;backdrop-filter:blur(6px);box-shadow:0 10px 30px rgba(0,0,0,.25)}
        .rs-h1{font-size:24px;font-weight:600;margin:0 0 8px}
        .rs-sub{font-size:12px;color:var(--muted)}
        .rs-btn{padding:10px 12px;border-radius:12px;border:1px solid var(--cardBorder);background:rgba(255,255,255,0.06);color:var(--text);cursor:pointer}
        .rs-btn:hover{background:rgba(255,255,255,0.1)}
        .rs-btn.primary{background:#111;border-color:#222}
        .rs-chip{display:block;text-align:left;padding:14px;border-radius:14px;border:1px solid var(--cardBorder);transition:transform .05s ease, box-shadow .2s ease}
        .rs-chip:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,.35)}
        .rs-chip .k{font-size:12px;color:var(--muted)}
        .rs-chip .name{font-weight:600}
        .rs-chip .freq{font-size:12px;color:var(--muted)}
        .rs-chip .desc{font-size:12px;color:var(--muted);margin-top:4px}
        .rs-chip .bar{height:4px;border-radius:999px;margin-top:8px;background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,.0))}
        :root[data-theme='light']{--hww-bg:#f6f7fb;--hww-card:#ffffff;--hww-card-border:#e6e6ea;--hww-text:#121212;--hww-muted:#666}
      `}</style>

      <div className="rs-root">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <div className="rs-h1">Harmonic Wave Wheel — Sound Prototype</div>
            <div className="rs-sub">
              Feature Branch Ready • Web Audio • Shared Wave palette
            </div>
          </div>
        </div>

        <div className="rs-grid">
          <div className="rs-card">
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Playback</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <label style={{ fontSize: 12 }}>Chord Mode</label>
              <input
                type="checkbox"
                checked={modeChord}
                onChange={(e) => setModeChord(e.target.checked)}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12 }}>Waveform</label>
              <select
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: 8,
                  borderRadius: 10,
                  border: "1px solid var(--cardBorder)",
                  background: "transparent",
                  color: "var(--text)",
                }}
                value={waveform}
                onChange={(e) => setWaveform(e.target.value as OscillatorType)}
              >
                <option value="sine">Sine (pure)</option>
                <option value="triangle">Triangle (soft overtones)</option>
                <option value="square">Square (rich, buzzy)</option>
                <option value="sawtooth">Sawtooth (bright)</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12 }}>Per Tone Duration (sec)</label>
              <input
                type="range"
                min={2}
                max={15}
                value={perToneSec}
                onChange={(e) => setPerToneSec(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                {perToneSec}s
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Master Gain</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={masterGain}
                onChange={(e) => setMasterGain(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={audibilityBoost}
                  onChange={(e) => setAudibilityBoost(e.target.checked)}
                />{" "}
                Audibility Boost (adds quiet 2nd harmonic)
              </label>
            </div>
          </div>

          <div className="rs-card">
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Quick Actions</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="rs-btn primary"
                onClick={() =>
                  audio.playSequence(
                    sequence,
                    perToneSec,
                    waveform,
                    audibilityBoost
                  )
                }
              >
                Play Full Sequence
              </button>
              <button className="rs-btn" onClick={() => audio.stopAll()}>
                Stop All
              </button>
            </div>
            <p className="rs-sub" style={{ marginTop: 10 }}>
              Sequence plays each Wave in order with gentle crossfades.
            </p>
          </div>

          <div className="rs-card">
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Notes</h2>
            <ul
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                margin: 0,
                paddingLeft: 18,
              }}
            >
              <li>Shared palette via helpers; no direct map imports.</li>
              <li>
                Audibility Boost adds a low-gain 2nd harmonic for tiny speakers.
              </li>
              <li>
                Chord Mode toggles sustained layers (click again to stop each).
              </li>
              <li>
                Non-chord mode plays single-shot tones for the set duration.
              </li>
            </ul>
          </div>
        </div>

        {/* Waves Section */}
        <div className="rs-card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Waves</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: 12,
            }}
          >
            {Object.entries(WAVE_MAP).map(([key, w]) => {
              const waveKey = key as WaveKey;
              const swatch = styleFromWaveColor(waveKey);
              return (
                <button
                  key={key}
                  onClick={() => toggleTone(waveKey)}
                  className="rs-chip"
                  style={{
                    background: chipBackground(waveKey),
                    borderColor: swatch.borderColor,
                    color: textColorForChip(waveKey), // dark text for light chips (W8/W10)
                  }}
                  title={`${w.frequency.toFixed(2)} Hz`}
                >
                  <div className="k">{key}</div>
                  <div className="name">{w.name}</div>
                  <div className="freq">{w.frequency.toFixed(2)} Hz</div>
                  <div className="desc">{w.desc}</div>
                  <div
                    className="bar"
                    style={{ background: barBackground(waveKey) }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanations / Notes Section */}
        <div className="rs-card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Explanations</h2>
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              border:
                "1px solid var(--hww-card-border, rgba(255,255,255,0.12))",
              borderRadius: 12,
              padding: 16,
              minHeight: 160,
              color: "var(--hww-text, #eaeaea)",
              lineHeight: 1.6,
            }}
          >
            <p style={{ marginTop: 0, opacity: 0.9 }}>
              Use this space to describe how the tones relate to placements, how
              the Audibility Boost preserves the base frequency math, or to
              include per-Wave guidance. Replace or populate dynamically later.
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
              <li>
                Wave 8 — crystalline alignment (light geometry). Text uses dark
                ink for readability.
              </li>
              <li>
                Wave 10 — rainbow carrier (broadband broadcast). Dark ink for
                contrast.
              </li>
            </ul>
          </div>
        </div>

        <div className="rs-sub" style={{ marginTop: 12 }}>
          Prototype: © Soul Resonance Astrology • Web Audio Engine v0.6 —
          Shared palette • gradient-safe • readable chips.
        </div>
      </div>
    </div>
  );
}
