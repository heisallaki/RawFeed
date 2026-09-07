import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <nav
      className="glass-panel"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        margin: "1rem",
        flexWrap: "wrap",
      }}
    >
      <span className="accent-text" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        RawFeed
      </span>

      <div style={{ display: "flex", flex: "1 1 auto", justifyContent: "space-evenly", flexWrap: "wrap" }}>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {!loading &&
        (user ? (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="nav-avatar"
              aria-label={`Account menu for ${user.email}`}
              aria-expanded={menuOpen}
            >
              {initial}
            </button>
            {menuOpen && (
              <div className="glass-panel dropdown-menu">
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    wordBreak: "break-all",
                  }}
                >
                  {user.email}
                </p>
                <NavLink
                  to="/settings"
                  className="nav-link"
                  style={{ display: "block", marginBottom: "0.35rem" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="nav-link"
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none" }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <NavLink to="/login" className="nav-link">
              Log in
            </NavLink>
            <NavLink to="/register" className="nav-link accent-bg" style={{ color: "#fff" }}>
              Sign up
            </NavLink>
          </div>
        ))}
    </nav>
  );
}