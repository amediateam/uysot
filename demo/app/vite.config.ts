import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Разбиение vendor-чанков повторяет исходную сборку (vendor-react, vendor-redux, vendor-i18n, vendor-router, vendor-data).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  define: { global: "window" },
  build: {
    sourcemap: "hidden", // карты не публикуются, но остаются в dist — чтобы исходники больше не терялись
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/node_modules\/(react|react-dom|scheduler|react-is)\//.test(id)) return "vendor-react";
          if (/node_modules\/(@reduxjs|react-redux|redux|redux-persist|immer|reselect|redux-thunk)\//.test(id)) return "vendor-redux";
          if (/node_modules\/(i18next|react-i18next|i18next-browser-languagedetector|@tolgee)\//.test(id)) return "vendor-i18n";
          if (/node_modules\/(react-router|react-router-dom|@remix-run)\//.test(id)) return "vendor-router";
          if (/node_modules\/(axios|react-query)\//.test(id)) return "vendor-data";
        },
      },
    },
  },
});
