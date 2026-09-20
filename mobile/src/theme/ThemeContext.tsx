import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AccentColor, ThemeMode, PALETTE } from "./theme";

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isDark: boolean;
  palette: typeof PALETTE.light;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [accentColor, setAccentColorState] = useState<AccentColor>("teal");

  useEffect(() => {
    (async () => {
      const storedMode = (await AsyncStorage.getItem("rawfeed_theme_mode")) as ThemeMode | null;
      const storedAccent = (await AsyncStorage.getItem("rawfeed_accent_color")) as AccentColor | null;
      if (storedMode) setThemeModeState(storedMode);
      if (storedAccent) setAccentColorState(storedAccent);
    })();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    AsyncStorage.setItem("rawfeed_theme_mode", mode);
    setThemeModeState(mode);
  };

  const setAccentColor = (color: AccentColor) => {
    AsyncStorage.setItem("rawfeed_accent_color", color);
    setAccentColorState(color);
  };

  const isDark =
    themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");
  const palette = isDark ? PALETTE.dark : PALETTE.light;

  const value = useMemo(
    () => ({ themeMode, setThemeMode, accentColor, setAccentColor, isDark, palette }),
    [themeMode, accentColor, isDark, palette]
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

export { AccentColor, ThemeMode };
