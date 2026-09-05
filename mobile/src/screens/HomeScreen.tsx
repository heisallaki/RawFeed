import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";

export function HomeScreen() {
  const { palette, accentColor } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.surface }]}>
      <Text style={[styles.title, { color: ACCENT_COLORS[accentColor] }]}>
        Know what matters. Ignore the noise.
      </Text>
      <Text style={[styles.body, { color: palette.textMuted }]}>
        The RawFeed Kenya event feed and county map will render here in Phase 3.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
  },
});