// Design palette (recovered exactly from the build). Raw swatches feed the semantic
// light/dark token maps; applyTheme() writes the tokens as `--app-*` CSS variables.

export const RAW = {
  white: "#FFFFFF",
  ink: "#0B0B0C",
  ink800: "#1B1B1F",
  ink700: "#2C2C31",
  ink600: "#3A3A3E",
  grey700: "#5A5A5F",
  grey600: "#6B6B70",
  grey500: "#8A8A8E",
  grey400: "#C9C9CE",
  grey300: "#E5E5E7",
  grey200: "#EDEDF0",
  grey100: "#F0F0F2",
  grey50: "#F7F7F8",
  grey25: "#FAFAFB",
  night900: "#0B0B0C",
  night800: "#131316",
  night700: "#17171A",
  night650: "#1A1A1E",
  night600: "#1F1F23",
  night500: "#2C2C31",
  night400: "#3A3A3E",
  night350: "#6A6A70",
  night300: "#94949B",
  night200: "#A8A8AE",
  night100: "#F2F2F3",
  blue: "#0A84FF",
  blueDark: "#0069D9",
  blueSoft: "#E8F1FF",
  blueLight: "#4CA5FF",
  blueLighter: "#7DBEFF",
  blueSoftDark: "#16283D",
  green: "#12B76A",
  greenDark: "#0E8F55",
  greenSoft: "#E6F7EF",
  greenLight: "#3DD68C",
  greenSoftDark: "#10291E",
  orange: "#E8833A",
  orangeDark: "#A85B18",
  orangeSoft: "#FDF0E3",
  orangeLight: "#F0A868",
  orangeSoftDark: "#2E2114",
  red: "#E5484D",
  redDark: "#B4292D",
  redSoft: "#FDECEC",
  redLight: "#F26D71",
  redSoftDark: "#2E1618",
  violet: "#7A5AF8",
  violetDark: "#5B3FD6",
  violetSoft: "#F1EDFE",
  violetLight: "#9E85FA",
  violetSoftDark: "#221C3D",
} as const;

export interface ThemeTokens {
  canvas: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  rowBorder: string;
  content: string;
  contentSecondary: string;
  contentMuted: string;
  contentPlaceholder: string;
  contentInverse: string;
  primary: string;
  primaryHover: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  success: string;
  successStrong: string;
  successSoft: string;
  warning: string;
  warningStrong: string;
  warningSoft: string;
  danger: string;
  dangerStrong: string;
  dangerSoft: string;
  progress: string;
  progressStrong: string;
  progressSoft: string;
  overlay: string;
}

export const LIGHT_TOKENS: ThemeTokens = {
  canvas: RAW.grey100,
  surface: RAW.white,
  surfaceMuted: RAW.grey50,
  surfaceHover: RAW.grey25,
  border: RAW.grey300,
  borderStrong: RAW.grey400,
  rowBorder: RAW.grey100,
  content: RAW.ink,
  contentSecondary: RAW.grey700,
  contentMuted: RAW.grey600,
  contentPlaceholder: RAW.grey400,
  contentInverse: RAW.white,
  primary: RAW.ink800,
  primaryHover: RAW.ink700,
  accent: RAW.blue,
  accentHover: RAW.blueDark,
  accentSoft: RAW.blueSoft,
  success: RAW.green,
  successStrong: RAW.greenDark,
  successSoft: RAW.greenSoft,
  warning: RAW.orange,
  warningStrong: RAW.orangeDark,
  warningSoft: RAW.orangeSoft,
  danger: RAW.red,
  dangerStrong: RAW.redDark,
  dangerSoft: RAW.redSoft,
  progress: RAW.violet,
  progressStrong: RAW.violetDark,
  progressSoft: RAW.violetSoft,
  overlay: "rgba(11, 11, 12, 0.45)",
};

export const DARK_TOKENS: ThemeTokens = {
  canvas: RAW.night900,
  surface: RAW.night700,
  surfaceMuted: RAW.night600,
  surfaceHover: RAW.night650,
  border: RAW.night500,
  borderStrong: RAW.night400,
  rowBorder: RAW.night600,
  content: RAW.night100,
  contentSecondary: RAW.night200,
  contentMuted: RAW.night300,
  contentPlaceholder: RAW.night350,
  contentInverse: RAW.night900,
  primary: RAW.night100,
  primaryHover: RAW.white,
  accent: RAW.blueLight,
  accentHover: RAW.blueLighter,
  accentSoft: RAW.blueSoftDark,
  success: RAW.greenLight,
  successStrong: RAW.green,
  successSoft: RAW.greenSoftDark,
  warning: RAW.orangeLight,
  warningStrong: RAW.orange,
  warningSoft: RAW.orangeSoftDark,
  danger: RAW.redLight,
  dangerStrong: RAW.red,
  dangerSoft: RAW.redSoftDark,
  progress: RAW.violetLight,
  progressStrong: RAW.violetLight,
  progressSoft: RAW.violetSoftDark,
  overlay: "rgba(0, 0, 0, 0.65)",
};

// antd design tokens shared across both themes.
export const BASE_TOKENS = {
  borderRadius: 12,
  borderRadiusSm: 8,
  borderRadiusLg: 18,
  controlHeight: 40,
  controlHeightLg: 44,
  controlHeightSm: 32,
  shadowCard: "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.05)",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontFamilyMono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

export type ResolvedTheme = "light" | "dark";

export const tokensFor = (theme: ResolvedTheme): ThemeTokens =>
  theme === "dark" ? DARK_TOKENS : LIGHT_TOKENS;
