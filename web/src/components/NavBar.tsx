import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/globe", label: "Globe" },
  { to: "/explore", label: "Explore" },
  { to: "/settings", label: "Settings" },
];

export function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className="glass-panel"
      style={{
        display: "flex",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        margin: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span className="accent-text" style={{ fontWeight: 700, marginRight: "auto" }}>
        RawFeed
      </span>
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            fontWeight: isActive ? 700 : 400,
            textDecoration: "none",
            color: "var(--color-text)",
          })}
        >
          {link.label}
        </NavLink>
      ))}
      {!loading && (
        user ? (
          <>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{user.email}</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={{ background: "none", border: "none", color: "var(--color-text)", padding: 0 }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={{ textDecoration: "none", color: "var(--color-text)" }}>
              Log in
            </NavLink>
            <NavLink to="/register" style={{ textDecoration: "none", color: "var(--color-text)" }}>
              Sign up
            </NavLink>
          </>
        )
      )}
    </nav>
  );
}