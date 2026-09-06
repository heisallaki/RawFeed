import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { EventCard } from "../components/EventCard";
import { AppShell } from "../components/AppShell";
import { fetchEvents } from "../lib/api";
import { RawFeedEvent } from "../lib/types";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "government_politics", label: "Politics" },
  { value: "economy_business", label: "Economy" },
  { value: "technology_ai", label: "Tech & AI" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "security", label: "Security" },
  { value: "climate_weather", label: "Weather" },
  { value: "transportation", label: "Transport" },
  { value: "emergencies_disasters", label: "Emergencies" },
  { value: "public_figures", label: "Public Figures" },
  { value: "other", label: "Other" },
];

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  const [category, setCategory] = useState<string | null>(null);
  const [county, setCounty] = useState<string | null>(route.params?.county ?? null);
  const [events, setEvents] = useState<RawFeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCounty(route.params?.county ?? null);
  }, [route.params?.county]);

  useEffect(() => {
    setLoading(true);
    fetchEvents({ category: category ?? undefined, county: county ?? undefined })
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [category, county]);

  return (
    <AppShell active="Explore">
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, { borderColor: category === null ? accent : "#88888844" }]}
          onPress={() => setCategory(null)}
        >
          <Text style={{ color: palette.text }}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, { borderColor: category === item.value ? accent : "#88888844" }]}
            onPress={() => setCategory(item.value)}
          >
            <Text style={{ color: palette.text }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {county && (
        <View style={styles.countyBanner}>
          <Text style={{ color: palette.textMuted }}>Filtering by {county}</Text>
          <TouchableOpacity onPress={() => setCounty(null)}>
            <Text style={{ color: accent }}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <Text style={{ color: palette.textMuted, margin: 16 }}>Loading...</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate("EventDetail", { id: item.id })} />
          )}
          ListEmptyComponent={
            <Text style={{ color: palette.textMuted, margin: 16 }}>No events match these filters yet.</Text>
          }
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  countyBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});