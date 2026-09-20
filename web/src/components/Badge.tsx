interface BadgeProps {
  label: string;
  tone?: "accent" | "neutral" | "warning";
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const background =
    tone === "accent" ? "var(--accent-color)" : tone === "warning" ? "#f59e0b" : "rgba(128,128,128,0.25)";
  const color = tone === "neutral" ? "var(--color-text)" : "#ffffff";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background,
        color,
        marginRight: "0.4rem",
      }}
    >
      {label}
    </span>
  );
}