import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyTheme, getStoredThemeMode, resolveTheme } from "@/theme/apply-theme";
import { App } from "@/App";
import "@/styles/index.css";

// Apply the stored theme before first render so the token values are present immediately.
applyTheme(resolveTheme(getStoredThemeMode()));

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root is missing from index.html.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
