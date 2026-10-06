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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setMobileNavOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const initial = user?.email?.charAt(0).toUpperCase() || "?";

  const closeMobileNav = () => setMobileNavOpen(false);

  const toggleMobileNav = () => {
    setMenuOpen(false);
    setMobileNavOpen((open) => !open);
  };

  const toggleAccountMenu = () => {
    setMobileNavOpen(false);
    setMenuOpen((open) => !open);
  };

  return (
    <nav
      className="glass-panel navbar"
      style={{
        position: "relative",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        margin: "1rem",
        flexWrap: "wrap",
      }}
    >
      <span className="brand-title navbar-brand">RawFeed</span>

      <div className="navbar-links" style={{ display: "flex", flex: "1 1 auto", minWidth: 0, justifyContent: "space-evenly", flexWrap: "wrap" }}>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            {link.label}
          </NavLink>
        ))}
        {user?.is_admin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Admin
          </NavLink>
        )}
      </div>

      <button
        ref={hamburgerRef}
        className="navbar-hamburger"
        onClick={toggleMobileNav}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-nav-panel"
      >
        <span />
        <span />
        <span />
      </button>

      {!loading &&
        (user ? (
          <div ref={menuRef} className="navbar-auth" style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={toggleAccountMenu}
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
          <div className="navbar-auth" style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <NavLink to="/login" className="nav-link">
              Log in
            </NavLink>
            <NavLink to="/register" className="nav-link accent-bg" style={{ color: "#fff" }}>
              Sign up
            </NavLink>
          </div>
        ))}

      <div
        id="mobile-nav-panel"
        ref={mobileNavRef}
        role="menu"
        aria-hidden={!mobileNavOpen}
        className={`glass-panel mobile-nav-panel${mobileNavOpen ? " open" : ""}`}
      >
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            role="menuitem"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={closeMobileNav}
          >
            {link.label}
          </NavLink>
        ))}
        {user?.is_admin && (
          <NavLink
            to="/admin"
            role="menuitem"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={closeMobileNav}
          >
            Admin
          </NavLink>
        )}
      </div>

      {mobileNavOpen && <div className="mobile-nav-backdrop" onClick={closeMobileNav} />}
    </nav>
  );
}