import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access
    port: 5173, // force correct port
    allowedHosts: ["*"], // allow all hosts (important for Codesandbox)
  },
});
