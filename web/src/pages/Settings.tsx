import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT_COLORS, AccentColor, ThemeMode, useTheme } from "../theme/ThemeContext";
import { useAuth } from "../auth/AuthContext";
import { confirmAccountDeletion, requestAccountDeletion } from "../lib/authApi";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];

function AccountPanel() {
  const { user, authFetch, logout } = useAuth();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"idle" | "code-sent">("idle");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleRequestDeletion = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const result = await requestAccountDeletion(authFetch);
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
      await confirmAccountDeletion(authFetch, code);
      logout();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm deletion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem" }}>
      <h2>Account</h2>
      <p style={{ color: "var(--color-text-muted)" }}>{user.email}</p>

      <h3 style={{ color: "#ef4444", marginTop: "1.5rem" }}>Delete account</h3>
      <p style={{ color: "var(--color-text-muted)" }}>
        This permanently deletes your account and all associated data. This action cannot be undone.
      </p>
      {error && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
      {message && <p style={{ color: "var(--color-text-muted)" }}>{message}</p>}

      {stage === "idle" ? (
        <button
          onClick={handleRequestDeletion}
          disabled={submitting}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "1px solid #ef4444",
            color: "#ef4444",
            background: "none",
          }}
        >
          {submitting ? "Sending code..." : "Delete account"}
        </button>
      ) : (
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <span style={{ display: "block", marginBottom: "0.25rem" }}>Enter the code we sent you</span>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "8px" }}
            />
          </label>
          <button
            onClick={handleConfirmDeletion}
            disabled={submitting || code.length !== 6}
            style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff" }}
          >
            {submitting ? "Deleting..." : "Permanently delete my account"}
          </button>
        </div>
      )}
    </div>
  );
}

export function Settings() {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  return (
    <div>
      <AccountPanel />
      <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem" }}>
        <h2>Appearance</h2>

        <p style={{ color: "var(--color-text-muted)" }}>Theme</p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {THEME_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: mode === themeMode ? "2px solid var(--accent-color)" : "1px solid var(--color-surface-border)",
                textTransform: "capitalize",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <p style={{ color: "var(--color-text-muted)" }}>Accent color</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {ACCENT_OPTIONS.map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              aria-label={color}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: ACCENT_COLORS[color],
                border: color === accentColor ? "3px solid var(--color-text)" : "1px solid var(--color-surface-border)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}