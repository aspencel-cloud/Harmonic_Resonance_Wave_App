import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Harmonic_Resonance_Wave_App/",
  server: {
    port: 5173,
    open: true,
    allowedHosts: [".csb.app"], // allow CodeSandbox preview hosts
  },
});
