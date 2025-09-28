// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: must match your repo name exactly (case-sensitive)
  base: "/Harmonic_Resonance_Wave_App/",
});
