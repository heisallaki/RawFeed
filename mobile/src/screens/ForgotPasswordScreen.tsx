import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { requestPasswordReset } from "../auth/authApi";

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
      setTimeout(() => navigation.navigate("ResetPassword", { email }), 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.heading, { color: palette.text }]}>Forgot password</Text>
      <Text style={{ color: palette.textMuted, marginBottom: 16 }}>
        Enter your email and we'll send a reset code if an account exists.
      </Text>
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
      <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={[styles.button, { backgroundColor: accent }]}>
        <Text style={styles.buttonText}>{submitting ? "Sending..." : "Send reset code"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }}>
        <Text style={{ color: accent }}>Back to login</Text>
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