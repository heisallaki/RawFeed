import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";

const TABS = [
  { name: "Home", label: "Home" },
  { name: "Regions", label: "Globe" },
  { name: "Explore", label: "Explore" },
  { name: "Settings", label: "Settings" },
];

interface TabBarProps {
  activeRoute: string;
  onNavigate: (name: string) => void;
}

export function TabBar({ activeRoute, onNavigate }: TabBarProps) {
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  return (
    <View style={[styles.bar, { backgroundColor: palette.surface }]}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => onNavigate(tab.name)} style={styles.tab}>
          <Text
            style={{
              color: activeRoute === tab.name ? accent : palette.textMuted,
              fontWeight: activeRoute === tab.name ? "700" : "400",
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});