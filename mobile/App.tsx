import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { ACCENT_COLORS } from "./src/theme/theme";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

type Page = "home" | "settings";

function Root() {
  const [page, setPage] = useState<Page>("home");
  const { palette, accentColor, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.nav}>
        <Text style={[styles.brand, { color: ACCENT_COLORS[accentColor] }]}>RawFeed</Text>
        <TouchableOpacity onPress={() => setPage("home")}>
          <Text style={{ color: palette.text, fontWeight: page === "home" ? "700" : "400" }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPage("settings")}>
          <Text style={{ color: palette.text, fontWeight: page === "settings" ? "700" : "400" }}>Settings</Text>
        </TouchableOpacity>
      </View>
      {page === "home" ? <HomeScreen /> : <SettingsScreen />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  brand: {
    fontWeight: "700",
    fontSize: 16,
    marginRight: "auto",
  },
});