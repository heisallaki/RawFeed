import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem", maxWidth: "420px" }}>
      <h2 className="accent-text">Log in</h2>
      {error && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "0.75rem" }}>
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
  );
}