import { Segmented, Tooltip } from "antd";
import type { ReactNode } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeMode } from "@/theme/apply-theme";
import { DesktopIcon, MoonIcon, SunIcon } from "@/theme/theme-icons";

// Theme toggle (recovered from the build): light / dark / system Segmented control.
const OPTIONS: { value: ThemeMode; icon: ReactNode; label: string }[] = [
  { value: "light", icon: <SunIcon />, label: "Light" },
  { value: "dark", icon: <MoonIcon />, label: "Dark" },
  { value: "system", icon: <DesktopIcon />, label: "System" },
];

export const ThemeSwitcher = () => {
  const { mode, setMode } = useTheme();
  return (
    <Segmented<ThemeMode>
      value={mode}
      onChange={setMode}
      aria-label="Color theme"
      options={OPTIONS.map(({ value, icon, label }) => ({
        value,
        label: (
          <Tooltip title={label}>
            <span className="flex h-10 w-7 items-center justify-center">{icon}</span>
          </Tooltip>
        ),
      }))}
    />
  );
};
