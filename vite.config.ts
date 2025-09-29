// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev: '/', Build: '/Harmonic_Resonance_Wave_App/'
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/Harmonic_Resonance_Wave_App/",
}));
