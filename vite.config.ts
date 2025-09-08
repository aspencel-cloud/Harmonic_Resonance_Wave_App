import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 inside container
    port: 5173, // preferred port
    strictPort: false, // fall back to 5174/5175 if busy
    allowedHosts: true, // <-- allow ANY host (boolean, not ["*"])
    // HMR hints for browsers behind proxies (CodeSandbox/Containers)
    hmr: {
      host: undefined, // let Vite infer from request
      protocol: undefined, // let Vite infer (ws/wss)
      clientPort: undefined, // let Vite infer forwarded port
    },
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
});
