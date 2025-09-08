import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // leave port as a preference; allow fallback if busy
    port: 5173,
    strictPort: false, // let Vite pick 5174 if 5173 is busy
    allowedHosts: ["*"], // important for *.csb.app
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false,
  },
});
