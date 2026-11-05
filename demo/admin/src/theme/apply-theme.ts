import { STORAGE_KEYS } from "@/constants/storage";
import { BASE_TOKENS, tokensFor, type ResolvedTheme } from "@/theme/palette";

// Theme application (recovered from the build). applyTheme() writes the resolved token
// map onto the document root as `--app-*` CSS variables; Tailwind's `--color-*` tokens
// (src/styles/index.css) reference these.
export type ThemeMode = "light" | "dark" | "system";

export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

// camelCase token name -> `--app-...` CSS variable.
const cssVar = (name: string): string => `--app-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

export const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";

export const resolveTheme = (mode: ThemeMode): ResolvedTheme =>
  mode === "system" ? getSystemTheme() : mode;

export const getStoredThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEYS.themeMode) as ThemeMode | null;
  return stored && THEME_MODES.includes(stored) ? stored : "system";
};

export const subscribeSystemTheme = (onChange: (theme: ResolvedTheme) => void): (() => void) => {
  const media = window.matchMedia(DARK_MEDIA_QUERY);
  const listener = (event: MediaQueryListEvent) => onChange(event.matches ? "dark" : "light");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

export const applyTheme = (theme: ResolvedTheme): void => {
  const root = document.documentElement;
  const tokens = tokensFor(theme);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  (Object.keys(tokens) as (keyof typeof tokens)[]).forEach((key) => {
    root.style.setProperty(cssVar(key), tokens[key]);
  });
  root.style.setProperty("--app-font-family", BASE_TOKENS.fontFamily);
  root.style.setProperty("--app-font-mono", BASE_TOKENS.fontFamilyMono);
};
