import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { App as AntApp, ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { STORAGE_KEYS } from "@/constants/storage";
import { buildAntdTheme } from "@/theme/antd-theme";
import {
  applyTheme,
  getStoredThemeMode,
  getSystemTheme,
  subscribeSystemTheme,
  type ThemeMode,
} from "@/theme/apply-theme";
import type { ResolvedTheme } from "@/theme/palette";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Theme + antd provider (recovered from the build). Tracks the chosen mode and the live
// system preference, applies the resolved tokens, and wires antd's ConfigProvider/App.
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(getStoredThemeMode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
  const resolvedTheme: ResolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => subscribeSystemTheme(setSystemTheme), []);
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEYS.themeMode, next);
    setModeState(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode],
  );

  const antdTheme = useMemo(() => buildAntdTheme(resolvedTheme), [resolvedTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <StyleProvider layer>
        <ConfigProvider theme={antdTheme}>
          <AntApp>{children}</AntApp>
        </ConfigProvider>
      </StyleProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }
  return value;
};
