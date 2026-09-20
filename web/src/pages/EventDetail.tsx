import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchEvent } from "../lib/api";
import { RawFeedEventDetail } from "../lib/types";
import { Badge } from "../components/Badge";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<RawFeedEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setError("Could not load this event."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ margin: "2rem" }}>Loading...</p>;
  if (error || !event) return <p style={{ margin: "2rem" }}>{error || "Event not found."}</p>;

  return (
    <div style={{ margin: "1rem" }}>
      <Link to="/" className="accent-text" style={{ textDecoration: "none" }}>
        &larr; Back to feed
      </Link>

      <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.6rem" }}>
          <Badge label={event.status} tone={event.status === "confirmed" ? "accent" : "neutral"} />
          <Badge label={event.category.replace("_", " ")} />
          {event.county && <Badge label={event.county} />}
        </div>

        <h1 style={{ margin: "0 0 0.5rem 0" }}>{event.title}</h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Impact {event.importance_score}/100 · Confidence {event.confidence_score}%
        </p>

        {event.why_it_matters && (
          <section style={{ marginTop: "1.2rem" }}>
            <h3 className="accent-text">Why it matters</h3>
            <p>{event.why_it_matters}</p>
          </section>
        )}

        <section style={{ marginTop: "1.2rem" }}>
          <h3>What we know</h3>
          <ul>
            {event.what_we_know.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "1.2rem" }}>
          <h3>What we don't know</h3>
          <ul>
            {event.what_we_dont_know.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "1.2rem" }}>
          <h3>Why this score</h3>
          <ul>
            {event.importance_reasons.map((reason, index) => (
              <li key={index} style={{ color: "var(--color-text-muted)" }}>
                {reason}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "1.2rem" }}>
          <h3>Sources</h3>
          {event.sources.map((source, index) => (
            <p key={index}>
              <a href={source.url} target="_blank" rel="noreferrer" className="accent-text">
                {source.source_name}
              </a>
              {source.published_at && (
                <span style={{ color: "var(--color-text-muted)" }}>
                  {" "}
                  · {new Date(source.published_at).toLocaleString()}
                </span>
              )}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}