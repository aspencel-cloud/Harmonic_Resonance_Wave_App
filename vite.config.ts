import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed under: https://aspencel-cloud.github.io/Harmonic_Resonance_Wave_App/
export default defineConfig({
  plugins: [react()],
  base: "/Harmonic_Resonance_Wave_App/",
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
});
