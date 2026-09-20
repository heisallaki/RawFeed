import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { EventCard } from "../components/EventCard";
import { AppShell } from "../components/AppShell";
import { fetchEvents } from "../lib/api";
import { RawFeedEvent } from "../lib/types";

interface SectionProps {
  title: string;
  events: RawFeedEvent[];
  onPressEvent: (id: string) => void;
  color: string;
}

function Section({ title, events, onPressEvent, color }: SectionProps) {
  if (events.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {events.map((event) => (
        <EventCard key={event.id} event={event} onPress={() => onPressEvent(event.id)} />
      ))}
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { palette, accentColor } = useTheme();
  const [events, setEvents] = useState<RawFeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const onPressEvent = (id: string) => navigation.navigate("EventDetail", { id });
  const accent = ACCENT_COLORS[accentColor];

  return (
    <AppShell active="Home">
      {loading ? (
        <View style={styles.centered}>
          <Text style={{ color: palette.textMuted }}>Loading the feed...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <Text style={{ color: palette.text, fontWeight: "700", marginBottom: 6 }}>No events yet</Text>
          <Text style={{ color: palette.textMuted }}>Run ingestion on the backend to populate the feed.</Text>
        </View>
      ) : (
        <ScrollView>
          <Section
            title="Breaking"
            events={events.filter((event) => event.importance_score >= 85)}
            onPressEvent={onPressEvent}
            color={accent}
          />
          <Section
            title="Developing"
            events={events.filter((event) => event.status === "developing" && event.importance_score < 85)}
            onPressEvent={onPressEvent}
            color={accent}
          />
          <Section
            title="Important"
            events={events.filter(
              (event) => event.importance_score >= 70 && event.importance_score < 85 && event.status !== "developing"
            )}
            onPressEvent={onPressEvent}
            color={accent}
          />
        </ScrollView>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    marginHorizontal: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 14,
  },
});