import { CATEGORIES } from "../constants/categories";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filter by category" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
      <button
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className="glass-panel"
        style={{ padding: "0.4rem 0.9rem", border: selected === null ? "2px solid var(--accent-color)" : "none" }}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          aria-pressed={selected === category.value}
          className="glass-panel"
          style={{
            padding: "0.4rem 0.9rem",
            border: selected === category.value ? "2px solid var(--accent-color)" : "none",
          }}
        >
          {category.icon} {category.label}
        </button>
      ))}
    </div>
  );
}