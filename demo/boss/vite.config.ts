import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    // Карты не публикуются, но остаются в dist, чтобы исходники больше не терялись.
    sourcemap: "hidden",
    rollupOptions: {
      onwarn(warning, warn) {
        // Шум от директив "use client" в antd и react-query при включённых картах.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" || warning.code === "SOURCEMAP_ERROR") return;
        warn(warning);
      },
    },
  },
});
