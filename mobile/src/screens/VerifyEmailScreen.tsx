import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { resendVerification, verifyEmail } from "../auth/authApi";
import { useAuth } from "../auth/AuthContext";

export function VerifyEmailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { palette, accentColor } = useTheme();
  const { setUser } = useAuth();
  const accent = ACCENT_COLORS[accentColor];

  const [email, setEmail] = useState(route.params?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const updatedUser = await verifyEmail(email, code);
      setUser(updatedUser);
      navigation.navigate("Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify email.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await resendVerification(email);
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.heading, { color: palette.text }]}>Verify your email</Text>
      <Text style={{ color: palette.textMuted, marginBottom: 16 }}>
        You're already logged in — just enter the 6-digit code sent to your email.
      </Text>
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
        placeholder="6-digit code"
        placeholderTextColor={palette.textMuted}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.button, { backgroundColor: accent }]}
      >
        <Text style={styles.buttonText}>{submitting ? "Verifying..." : "Verify"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResend} style={{ marginTop: 16 }}>
        <Text style={{ color: accent }}>Resend code</Text>
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