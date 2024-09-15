import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
    lightningcss: {
      mode: "live",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
