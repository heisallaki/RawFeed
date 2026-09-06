import { Pressable, StyleSheet, Text, View } from "react-native";
import { AccentColor, ThemeMode, useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { AppShell } from "../components/AppShell";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];

export function SettingsScreen() {
  const { palette, themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  return (
    <AppShell active="Settings">
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.heading, { color: palette.text }]}>Appearance</Text>

        <Text style={[styles.label, { color: palette.textMuted }]}>Theme</Text>
        <View style={styles.row}>
          {THEME_MODES.map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[styles.pill, { borderColor: mode === themeMode ? ACCENT_COLORS[accentColor] : "#88888844" }]}
            >
              <Text style={{ color: palette.text, textTransform: "capitalize" }}>{mode}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: palette.textMuted, marginTop: 20 }]}>Accent color</Text>
        <View style={styles.row}>
          {ACCENT_OPTIONS.map((color) => (
            <Pressable
              key={color}
              onPress={() => setAccentColor(color)}
              style={[
                styles.swatch,
                {
                  backgroundColor: ACCENT_COLORS[color],
                  borderWidth: color === accentColor ? 3 : 0,
                  borderColor: palette.text,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});