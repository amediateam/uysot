import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Original was a single-chunk Vite + React build (no code-splitting). This config keeps
// that shape; styling is Tailwind 3 (see tailwind.config.js / src/styles/index.css).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    // Keep maps in dist (not published) so sources can't be lost again.
    sourcemap: "hidden",
  },
});
