import { ACCENT_COLORS, AccentColor, ThemeMode, useTheme } from "../theme/ThemeContext";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];

export function Settings() {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  return (
    <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem" }}>
      <h2>Appearance</h2>

      <p style={{ color: "var(--color-text-muted)" }}>Theme</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {THEME_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: mode === themeMode ? "2px solid var(--accent-color)" : "1px solid var(--color-surface-border)",
              textTransform: "capitalize",
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      <p style={{ color: "var(--color-text-muted)" }}>Accent color</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {ACCENT_OPTIONS.map((color) => (
          <button
            key={color}
            onClick={() => setAccentColor(color)}
            aria-label={color}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: ACCENT_COLORS[color],
              border: color === accentColor ? "3px solid var(--color-text)" : "1px solid var(--color-surface-border)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}