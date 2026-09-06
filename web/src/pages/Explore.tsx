import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchEvents } from "../lib/api";
import { RawFeedEvent } from "../lib/types";
import { EventCard } from "../components/EventCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { KENYA_COUNTIES } from "../constants/kenyaCounties";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const countyParam = searchParams.get("county");
  const [category, setCategory] = useState<string | null>(null);
  const [county, setCounty] = useState<string | null>(countyParam);
  const [events, setEvents] = useState<RawFeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCounty(countyParam);
  }, [countyParam]);

  useEffect(() => {
    setLoading(true);
    fetchEvents({ category: category || undefined, county: county || undefined })
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [category, county]);

  const handleCountySelect = (value: string) => {
    const next = value === county ? null : value;
    setCounty(next);
    setSearchParams(next ? { county: next } : {});
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      <h2 className="accent-text">Explore</h2>
      <CategoryFilter selected={category} onSelect={setCategory} />

      <div className="glass-panel" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <p style={{ color: "var(--color-text-muted)", marginTop: 0 }}>County</p>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {KENYA_COUNTIES.map((countyItem) => (
            <button
              key={countyItem.name}
              onClick={() => handleCountySelect(countyItem.name)}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                border:
                  county === countyItem.name ? "2px solid var(--accent-color)" : "1px solid var(--color-surface-border)",
                background: "transparent",
                color: "var(--color-text)",
              }}
            >
              {countyItem.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No events match these filters yet.</p>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
}