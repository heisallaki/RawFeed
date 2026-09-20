import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor = "teal" | "blue" | "purple" | "red" | "orange" | "yellow" | "green" | "pink";

export const ACCENT_COLORS: Record<AccentColor, string> = {
  teal: "#14b8a6",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  pink: "#ec4899",
};

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveDarkPreference(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    () => (localStorage.getItem("rawfeed_theme_mode") as ThemeMode) || "system"
  );
  const [accentColor, setAccentColorState] = useState<AccentColor>(
    () => (localStorage.getItem("rawfeed_accent_color") as AccentColor) || "teal"
  );

  useEffect(() => {
    const isDark = resolveDarkPreference(themeMode);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", ACCENT_COLORS[accentColor]);
  }, [accentColor]);

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem("rawfeed_theme_mode", mode);
    setThemeModeState(mode);
  };

  const setAccentColor = (color: AccentColor) => {
    localStorage.setItem("rawfeed_accent_color", color);
    setAccentColorState(color);
  };

  const value = useMemo(
    () => ({ themeMode, setThemeMode, accentColor, setAccentColor }),
    [themeMode, accentColor]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}