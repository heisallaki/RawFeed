import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      className="glass-panel"
      style={{
        margin: "1rem",
        marginTop: "0",
        padding: "0.9rem 1.25rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.6rem",
        fontSize: "0.85rem",
        color: "var(--color-text-muted)",
      }}
    >
      <span>
        &copy; {new Date().getFullYear()} RawFeed &middot; Built by Alvin Kipng&apos;eno Langat
      </span>
      <div style={{ display: "flex", gap: "1.1rem" }}>
        <Link to="/privacy" className="accent-text" style={{ textDecoration: "none" }}>
          Privacy Policy
        </Link>
        <Link to="/terms" className="accent-text" style={{ textDecoration: "none" }}>
          Terms of Use
        </Link>
      </div>
    </footer>
  );
}