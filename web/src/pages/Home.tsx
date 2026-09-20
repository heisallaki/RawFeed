import { useEffect, useState } from "react";
import { fetchEvents } from "../lib/api";
import { RawFeedEvent } from "../lib/types";
import { EventCard } from "../components/EventCard";
import { CATEGORIES } from "../constants/categories";

interface SectionProps {
  title: string;
  icon: string;
  events: RawFeedEvent[];
}

function FeedSection({ title, icon, events }: SectionProps) {
  if (events.length === 0) return null;
  return (
    <section style={{ margin: "0 1rem 1.75rem 1rem" }}>
      <div className="section-banner accent-bg">
        <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        <span>{title}</span>
        <span className="count-pill">{events.length}</span>
      </div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
}

export function Home() {
  const [events, setEvents] = useState<RawFeedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEvents(category ? { category } : {})
      .then(setEvents)
      .catch(() => setError("Could not load the feed. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ paddingTop: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "0 1rem 1rem 1rem" }}>
        <select
          className="select-glass"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter feed by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ margin: "2rem" }}>Loading the feed...</p>
      ) : error ? (
        <p style={{ margin: "2rem", color: "var(--color-text-muted)" }}>{error}</p>
      ) : events.length === 0 ? (
        <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem" }}>
          <h2>No events yet</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Run the ingestion pipeline on the backend to populate the feed, or try a different category.
          </p>
        </div>
      ) : (
        <>
          <FeedSection title="Breaking" icon="🚨" events={events.filter((event) => event.importance_score >= 85)} />
          <FeedSection
            title="Developing"
            icon="📡"
            events={events.filter((event) => event.status === "developing" && event.importance_score < 85)}
          />
          <FeedSection
            title="Important"
            icon="⭐"
            events={events.filter(
              (event) => event.importance_score >= 70 && event.importance_score < 85 && event.status !== "developing"
            )}
          />
        </>
      )}
    </div>
  );
}