import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    devSourcemap: true,
    lightningcss: {
      mode: "live",
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.VITE_APP_PORT,
    proxy: {
      "/api": {
        target:
          `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` ||
          `http://http://192.168.18.13:${process.env.SERVER_PORT}`,
        changeOrigin: true,
      },
      "/public": {
        target: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
