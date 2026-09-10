import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiErrorLike, requestReactivation } from "../lib/authApi";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deactivated, setDeactivated] = useState(false);
  const [reactivationMessage, setReactivationMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setDeactivated(false);
    setReactivationMessage(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const apiError = err as ApiErrorLike;
      const message = apiError?.message || "Could not log in.";
      setError(message);
      if (apiError?.code === "account_deactivated") {
        setDeactivated(true);
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
    <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "1rem" }}>
      <div className="glass-panel" style={{ padding: "1.5rem", maxWidth: "420px", width: "100%" }}>
        <h2 className="accent-text">Log in</h2>
        {error && (
          <p role="alert" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}
        {deactivated && (
          <div className="reactivation-box">
            {reactivationMessage ? (
              <p style={{ margin: 0, color: "var(--color-text-muted)" }}>{reactivationMessage}</p>
            ) : (
              <>
                <p style={{ margin: "0 0 0.6rem 0", color: "var(--color-text-muted)" }}>
                  If you believe this was a mistake, you can ask an administrator to review it.
                </p>
                <button
                  onClick={handleRequestReactivation}
                  disabled={requesting}
                  style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #ef4444", color: "#ef4444", background: "none" }}
                >
                  {requesting ? "Sending request..." : "Request reactivation"}
                </button>
              </>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "0.75rem", marginTop: "1rem" }}>
            <span style={{ display: "block", marginBottom: "0.25rem" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <span style={{ display: "block", marginBottom: "0.25rem" }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
            />
          </label>
          <p style={{ marginTop: 0, marginBottom: "1rem" }}>
            <Link to="/forgot-password" className="accent-text" style={{ fontSize: "0.85rem" }}>
              Forgot password?
            </Link>
          </p>
          <button type="submit" disabled={submitting} className="accent-bg" style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", color: "#fff" }}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          No account? <Link to="/register" className="accent-text">Sign up</Link>
        </p>
      </div>
    </div>
  );
}