const CATEGORIES: { value: string; label: string }[] = [
  { value: "government_politics", label: "Government & Politics" },
  { value: "economy_business", label: "Economy & Business" },
  { value: "technology_ai", label: "Technology & AI" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "security", label: "Security" },
  { value: "climate_weather", label: "Climate & Weather" },
  { value: "transportation", label: "Transportation" },
  { value: "emergencies_disasters", label: "Emergencies & Disasters" },
  { value: "public_figures", label: "Public Figures" },
  { value: "other", label: "Other" },
];

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
      <button
        onClick={() => onSelect(null)}
        className="glass-panel"
        style={{ padding: "0.4rem 0.9rem", border: selected === null ? "2px solid var(--accent-color)" : "none" }}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          className="glass-panel"
          style={{
            padding: "0.4rem 0.9rem",
            border: selected === category.value ? "2px solid var(--accent-color)" : "none",
          }}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}