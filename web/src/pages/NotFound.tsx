import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="glass-panel" role="alert" style={{ margin: "1rem", padding: "1.5rem", textAlign: "center" }}>
      <h1 className="accent-text">Page not found</h1>
      <p style={{ color: "var(--color-text-muted)" }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="accent-text">
        Back to the feed
      </Link>
    </div>
  );
}