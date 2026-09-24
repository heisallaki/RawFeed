import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AccentColor, ThemeMode, useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../auth/AuthContext";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];
const PRIVACY_URL = "https://rawfeed-news.vercel.app/privacy";
const TERMS_URL = "https://rawfeed-news.vercel.app/terms";

function AccountSection() {
  const navigation = useNavigation<any>();
  const { palette, accentColor } = useTheme();
  const { user, accessToken, loading, logout } = useAuth();

  if (loading) {
    return <Text style={{ color: palette.textMuted }}>Loading...</Text>;
  }

  if (!user || !accessToken) {
    return (
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor] }]}
        >
          <Text style={{ color: palette.text }}>Log in</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor] }]}
        >
          <Text style={{ color: palette.text }}>Sign up</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ color: palette.text, marginBottom: 10 }}>{user.email}</Text>
      <Pressable onPress={logout} style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor], alignSelf: "flex-start", marginBottom: 20 }]}>
        <Text style={{ color: palette.text }}>Log out</Text>
      </Pressable>

    </View>
  );
}

function LegalSection() {
  const { palette, accentColor } = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      <Pressable
        onPress={() => Linking.openURL(PRIVACY_URL)}
        style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor] }]}
      >
        <Text style={{ color: palette.text }}>Privacy Policy</Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL(TERMS_URL)}
        style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor] }]}
      >
        <Text style={{ color: palette.text }}>Terms of Use</Text>
      </Pressable>
    </View>
  );
}

export function SettingsScreen() {
  const { palette, themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  return (
    <AppShell active="Settings">
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.heading, { color: palette.text }]}>Account</Text>
        <AccountSection />
      </View>

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

      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.heading, { color: palette.text }]}>Legal</Text>
        <LegalSection />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { margin: 16, padding: 20, borderRadius: 14 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 2 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
});