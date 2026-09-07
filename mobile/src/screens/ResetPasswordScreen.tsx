import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { resetPassword } from "../auth/authApi";

export function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  const [email, setEmail] = useState(route.params?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const result = await resetPassword(email, code, newPassword);
      setMessage(result.message);
      setTimeout(() => navigation.navigate("Login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.heading, { color: palette.text }]}>Reset password</Text>
      {error ? <Text style={{ color: "#ef4444", marginBottom: 12 }}>{error}</Text> : null}
      {message ? <Text style={{ color: palette.textMuted, marginBottom: 12 }}>{message}</Text> : null}
      <TextInput
        placeholder="Email"
        placeholderTextColor={palette.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
      />
      <TextInput
        placeholder="Reset code"
        placeholderTextColor={palette.textMuted}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
      />
      <TextInput
        placeholder="New password"
        placeholderTextColor={palette.textMuted}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
      />
      <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={[styles.button, { backgroundColor: accent }]}>
        <Text style={styles.buttonText}>{submitting ? "Resetting..." : "Reset password"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});