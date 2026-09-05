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

export const PALETTE = {
  light: {
    background: "#f5fbfa",
    surface: "rgba(255,255,255,0.6)",
    text: "#0b1f1c",
    textMuted: "#4a6360",
  },
  dark: {
    background: "#06120f",
    surface: "rgba(20,30,28,0.55)",
    text: "#eaf6f4",
    textMuted: "#9fb8b4",
  },
};