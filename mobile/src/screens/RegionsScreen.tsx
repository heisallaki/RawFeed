import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { AppShell } from "../components/AppShell";
import { KENYA_COUNTIES, REGIONS } from "../constants/kenyaCounties";

export function RegionsScreen() {
  const navigation = useNavigation<any>();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  return (
    <AppShell active="Regions">
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.heading, { color: palette.text }]}>Kenya by region</Text>
        <Text style={{ color: palette.textMuted, marginBottom: 16 }}>
          Tap a county to see its events. A full interactive map view is planned for a future release.
        </Text>
        {REGIONS.map((region) => (
          <View key={region} style={{ marginBottom: 18 }}>
            <Text style={[styles.regionTitle, { color: accent }]}>{region}</Text>
            <View style={styles.countyGrid}>
              {KENYA_COUNTIES.filter((county) => county.region === region).map((county) => (
                <TouchableOpacity
                  key={county.name}
                  style={[styles.countyChip, { backgroundColor: palette.surface }]}
                  onPress={() => navigation.navigate("Explore", { county: county.name })}
                >
                  <Text style={{ color: palette.text }}>{county.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  regionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  countyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  countyChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
});