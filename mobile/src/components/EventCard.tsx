import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { Badge } from "./Badge";
import { RawFeedEvent } from "../lib/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface EventCardProps {
  event: RawFeedEvent;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: palette.surface }]}>
      <View style={styles.badgeRow}>
        <Badge label={event.status} color={event.status === "confirmed" ? accent : "#88888888"} />
        <Badge label={event.category.replace("_", " ")} color="#88888888" />
        {event.county && <Badge label={event.county} color="#88888888" />}
      </View>
      <Text style={[styles.title, { color: palette.text }]}>{event.title}</Text>
      <Text style={[styles.meta, { color: palette.textMuted }]}>
        Impact {event.importance_score}/100 · Confidence {event.confidence_score}% · {timeAgo(event.last_updated_at)}
      </Text>
      {event.why_it_matters ? (
        <Text style={[styles.why, { color: palette.text }]}>
          <Text style={{ color: accent, fontWeight: "700" }}>Why it matters: </Text>
          {event.why_it_matters}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    marginBottom: 6,
  },
  why: {
    fontSize: 13,
  },
});