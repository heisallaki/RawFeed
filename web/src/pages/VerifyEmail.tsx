import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resendVerification, verifyEmail } from "../lib/authApi";
import { useAuth } from "../auth/AuthContext";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const updatedUser = await verifyEmail(email, code);
      setUser(updatedUser);
      navigate("/");
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
    <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem", maxWidth: "420px" }}>
      <h2 className="accent-text">Verify your email</h2>
      <p style={{ color: "var(--color-text-muted)" }}>
        You're logged in already — just enter the 6-digit code we sent to your email. It expires in 10 minutes.
      </p>
      {error && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
      {message && <p style={{ color: "var(--color-text-muted)" }}>{message}</p>}
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
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <span style={{ display: "block", marginBottom: "0.25rem" }}>Verification code</span>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
          />
        </label>
        <button type="submit" disabled={submitting} className="accent-bg" style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", color: "#fff", marginRight: "0.5rem" }}>
          {submitting ? "Verifying..." : "Verify"}
        </button>
        <button type="button" onClick={handleResend} style={{ padding: "0.6rem 1.2rem", borderRadius: "8px" }}>
          Resend code
        </button>
      </form>
    </div>
  );
}