import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});