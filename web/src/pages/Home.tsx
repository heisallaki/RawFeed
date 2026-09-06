import { useEffect, useState } from "react";
import { fetchEvents } from "../lib/api";
import { RawFeedEvent } from "../lib/types";
import { EventCard } from "../components/EventCard";

function FeedSection({ title, events }: { title: string; events: RawFeedEvent[] }) {
  if (events.length === 0) return null;
  return (
    <section style={{ margin: "0 1rem 1.5rem 1rem" }}>
      <h2 className="accent-text" style={{ marginBottom: "0.5rem" }}>
        {title}
      </h2>
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

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError("Could not load the feed. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ margin: "2rem" }}>Loading the feed...</p>;
  }

  if (error) {
    return <p style={{ margin: "2rem", color: "var(--color-text-muted)" }}>{error}</p>;
  }

  if (events.length === 0) {
    return (
      <div className="glass-panel" style={{ margin: "1rem", padding: "1.5rem" }}>
        <h2>No events yet</h2>
        <p style={{ color: "var(--color-text-muted)" }}>
          Run the ingestion pipeline on the backend to populate the feed.
        </p>
      </div>
    );
  }

  const breaking = events.filter((event) => event.importance_score >= 85);
  const developing = events.filter((event) => event.status === "developing" && event.importance_score < 85);
  const important = events.filter(
    (event) => event.importance_score >= 70 && event.importance_score < 85 && event.status !== "developing"
  );

  return (
    <div style={{ paddingTop: "0.5rem" }}>
      <FeedSection title="Breaking" events={breaking} />
      <FeedSection title="Developing" events={developing} />
      <FeedSection title="Important" events={important} />
    </div>
  );
}