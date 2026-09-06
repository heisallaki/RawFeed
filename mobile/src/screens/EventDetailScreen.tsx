import { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { Badge } from "../components/Badge";
import { fetchEvent } from "../lib/api";
import { RawFeedEventDetail } from "../lib/types";

export function EventDetailScreen() {
  const route = useRoute<any>();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];
  const [event, setEvent] = useState<RawFeedEventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent(route.params.id)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [route.params.id]);

  if (loading || !event) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: palette.textMuted }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={styles.badgeRow}>
        <Badge label={event.status} color={event.status === "confirmed" ? accent : "#88888888"} />
        <Badge label={event.category.replace("_", " ")} color="#88888888" />
        {event.county && <Badge label={event.county} color="#88888888" />}
      </View>

      <Text style={[styles.title, { color: palette.text }]}>{event.title}</Text>
      <Text style={{ color: palette.textMuted, marginBottom: 12 }}>
        Impact {event.importance_score}/100 · Confidence {event.confidence_score}%
      </Text>

      {event.why_it_matters ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>Why it matters</Text>
          <Text style={{ color: palette.text }}>{event.why_it_matters}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>What we know</Text>
        {event.what_we_know.map((fact, index) => (
          <Text key={index} style={{ color: palette.text, marginBottom: 4 }}>
            • {fact}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>What we don't know</Text>
        {event.what_we_dont_know.map((fact, index) => (
          <Text key={index} style={{ color: palette.text, marginBottom: 4 }}>
            • {fact}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Sources</Text>
        {event.sources.map((source, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(source.url)}>
            <Text style={{ color: accent, marginBottom: 6 }}>{source.source_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
});