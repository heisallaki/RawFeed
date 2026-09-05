interface NavBarProps {
  activePage: "home" | "settings";
  onNavigate: (page: "home" | "settings") => void;
}

export function NavBar({ activePage, onNavigate }: NavBarProps) {
  return (
    <nav
      className="glass-panel"
      style={{
        display: "flex",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        margin: "1rem",
        alignItems: "center",
      }}
    >
      <span className="accent-text" style={{ fontWeight: 700, marginRight: "auto" }}>
        RawFeed
      </span>
      <button onClick={() => onNavigate("home")} style={{ fontWeight: activePage === "home" ? 700 : 400 }}>
        Home
      </button>
      <button
        onClick={() => onNavigate("settings")}
        style={{ fontWeight: activePage === "settings" ? 700 : 400 }}
      >
        Settings
      </button>
    </nav>
  );
}