🌌 Harmonic Wave Wheel

An interactive React + TypeScript app for exploring harmonic astrology through a dynamic zodiac wheel.

Plots planets, houses, and symbolic context across 360°, with Harmonic Wave degree anchors and contextual symbolism (Sabian / Chandra). Built for astrologers, researchers, and explorers of symbolic geometry.

✨ Features
🔹 Harmonic Waves

All 10 Waves implemented with named anchors

Example: Wave 7 — Heart Weavers → 4°, 14°, 24°

Legend + tooltips show Wave number + Wave name

🔹 Placements

Add placements manually or via raw chart import

Auto-maps degrees (0–29) → Wave anchors

Handles overlaps with glyph stacking / spacing

Toggle glyph vs dot view

🔹 Houses & Angles

Whole-sign houses, aligned to ASC sign

ASC, IC, MC, DSC rendered as angle markers

Optional house cusp lines

🔹 Context Loader (CSV)

Load Sabian, Chandra, Notes, Questions

Flexible header aliases supported

Sidebar shows summary (row count, unique signs, waves, planets, degrees)

🔹 Exports

SVG — vector chart

PNG — rasterized chart (2× scale)

JSON — full app state

CSV — placements with Wave + WaveName

🧰 Tech Stack

React

- TypeScript

Vite
(dev/build tool)

Pure SVG rendering (no chart libs)

Light/Dark theme via CSS variables

▶️ Getting Started
Run in CodeSandbox (cloud, GitHub-linked)

Repo is ready for CodeSandbox microVM

Setup task: npm install

Dev task: npm run dev

Preview available at port 5173 (fallback 5174 etc.)

Run locally
git clone https://github.com/<you>/harmonic-wave-wheel.git
cd harmonic-wave-wheel
npm install
npm run dev

Visit 👉 http://localhost:5173

📥 CSV Context Format

Accepted headers (case-insensitive; aliases supported):

Wave, Degree, Sign, Planet, Note,
Sabian / Sabian Symbol,
Chandra / Chandra Symbol,
Personal Question / Question

Degree must be 0–29 (e.g. 20° → 20)

Data is merged into:

context["Wave"][sign][planet][degree] = { Note, Sabian, Chandra, Question }

⤴️ Exports

Export SVG → vector wheel

Export PNG → raster wheel

Export JSON → placements + context

Export Placements CSV →

Planet, Sign, Degree, Wave, WaveName, Note, Sabian, Chandra, Question

🗺️ Wave Degree Anchors
Wave Name Degrees
1 Root Trinity 0°, 10°, 20°
2 Soul Mirror 5°, 15°, 25°
3 Spiral Initiate 3°, 13°, 23°
4 Mystic Arc 7°, 17°, 27°
5 Edge Dancers 9°, 19°, 29°
6 Bridge Builders 2°, 12°, 22°
7 Heart Weavers 4°, 14°, 24°
8 Crystal Initiates 6°, 16°, 26°
9 Harvesters 8°, 18°, 28°
10 Genesis Mirrors 1°, 11°, 21°
🛣️ Roadmap

Smarter glyph spacing (multi-planet degrees)

Auto house numbering from ASC

Outer house labels (collision-aware)

Aspect lines (configurable orbs)

CSV validator with downloadable report

Packaged desktop app (Tauri/Electron)

🔧 Scripts
{
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview --port 5173"
}

📄 License

MIT (or your preferred license).
