import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// The production build was produced with rolldown-vite and had readable, per-feature
// chunk names (login-page, companies-page, …) via React.lazy code-splitting. This config
// uses the standard Vite toolchain; lazy() route splitting reproduces the same chunking
// intent. Styles are Tailwind v4 (CSS-first config in src/styles/index.css).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    // Keep maps in dist (not published) so the sources can't be lost again.
    sourcemap: "hidden",
  },
});
