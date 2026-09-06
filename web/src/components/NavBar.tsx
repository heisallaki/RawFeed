import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/globe", label: "Globe" },
  { to: "/explore", label: "Explore" },
  { to: "/settings", label: "Settings" },
];

export function NavBar() {
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
    </nav>
  );
}