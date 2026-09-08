import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";
import { useAuth } from "../auth/AuthContext";
import { ApiError, requestReactivation } from "../auth/authApi";

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deactivated, setDeactivated] = useState(false);
  const [reactivationMessage, setReactivationMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setDeactivated(false);
    setReactivationMessage(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (err) {
      if (err instanceof ApiError && err.code === "account_deactivated") {
        setDeactivated(true);
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Could not log in.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestReactivation = async () => {
    setRequesting(true);
    try {
      const result = await requestReactivation(email);
      setReactivationMessage(result.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.heading, { color: palette.text }]}>Log in</Text>
      {error ? <Text style={{ color: "#ef4444", marginBottom: 12 }}>{error}</Text> : null}
      {deactivated && (
        <View style={{ marginBottom: 16, padding: 12, borderRadius: 10, backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.35)" }}>
          {reactivationMessage ? (
            <Text style={{ color: palette.textMuted }}>{reactivationMessage}</Text>
          ) : (
            <TouchableOpacity onPress={handleRequestReactivation} disabled={requesting}>
              <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                {requesting ? "Sending request..." : "Request reactivation"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
        placeholder="Password"
        placeholderTextColor={palette.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { color: palette.text, borderColor: palette.textMuted }]}
      />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={{ marginBottom: 12 }}>
        <Text style={{ color: accent, fontSize: 13 }}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.button, { backgroundColor: accent }]}
      >
        <Text style={styles.buttonText}>{submitting ? "Logging in..." : "Log in"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 16 }}>
        <Text style={{ color: accent }}>No account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});