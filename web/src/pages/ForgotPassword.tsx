import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../lib/authApi";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem", maxWidth: "420px" }}>
      <h2 className="accent-text">Forgot password</h2>
      <p style={{ color: "var(--color-text-muted)" }}>
        Enter your email and we'll send you a reset code if an account exists.
      </p>
      {message && <p style={{ color: "var(--color-text-muted)" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <span style={{ display: "block", marginBottom: "0.25rem" }}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="accent-bg"
          style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", color: "#fff" }}
        >
          {submitting ? "Sending..." : "Send reset code"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        <Link to="/login" className="accent-text">Back to login</Link>
      </p>
    </div>
  );
}