import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AccentColor, ThemeMode, useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../auth/AuthContext";
import { confirmAccountDeletion, requestAccountDeletion } from "../auth/authApi";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];

function AccountSection() {
  const navigation = useNavigation<any>();
  const { palette, accentColor } = useTheme();
  const { user, accessToken, loading, logout } = useAuth();
  const [stage, setStage] = useState<"idle" | "code-sent">("idle");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRequestDeletion = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const result = await requestAccountDeletion(accessToken);
      setMessage(result.message);
      setStage("code-sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start account deletion.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeletion = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await confirmAccountDeletion(accessToken, code);
      logout();
      navigation.navigate("Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm deletion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <Text style={{ color: palette.text, marginBottom: 10 }}>{user.email}</Text>
      <Pressable onPress={logout} style={[styles.pill, { borderColor: ACCENT_COLORS[accentColor], alignSelf: "flex-start", marginBottom: 20 }]}>
        <Text style={{ color: palette.text }}>Log out</Text>
      </Pressable>

      <Text style={{ color: "#ef4444", fontWeight: "700", marginBottom: 6 }}>Delete account</Text>
      <Text style={{ color: palette.textMuted, marginBottom: 10 }}>
        This permanently deletes your account and cannot be undone.
      </Text>
      {error ? <Text style={{ color: "#ef4444", marginBottom: 8 }}>{error}</Text> : null}
      {message ? <Text style={{ color: palette.textMuted, marginBottom: 8 }}>{message}</Text> : null}

      {stage === "idle" ? (
        <Pressable
          onPress={handleRequestDeletion}
          disabled={submitting}
          style={[styles.pill, { borderColor: "#ef4444", alignSelf: "flex-start" }]}
        >
          <Text style={{ color: "#ef4444" }}>{submitting ? "Sending code..." : "Delete account"}</Text>
        </Pressable>
      ) : (
        <View>
          <TextInput
            placeholder="6-digit code"
            placeholderTextColor={palette.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
          />
          <Pressable
            onPress={handleConfirmDeletion}
            disabled={submitting || code.length !== 6}
            style={[styles.dangerButton]}
          >
            <Text style={{ color: "#ffffff", fontWeight: "700" }}>
              {submitting ? "Deleting..." : "Permanently delete my account"}
            </Text>
          </Pressable>
        </View>
      )}
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
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, width: 160 },
  dangerButton: { backgroundColor: "#ef4444", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignSelf: "flex-start" },
});