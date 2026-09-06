import { Link } from "react-router-dom";
import { RawFeedEvent } from "../lib/types";
import { Badge } from "./Badge";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function statusTone(status: string): "accent" | "neutral" | "warning" {
  if (status === "confirmed") return "accent";
  if (status === "disputed" || status === "unverified") return "warning";
  return "neutral";
}

interface EventCardProps {
  event: RawFeedEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="glass-panel" style={{ padding: "1.1rem", marginBottom: "0.9rem" }}>
        <div style={{ marginBottom: "0.4rem" }}>
          <Badge label={event.status} tone={statusTone(event.status)} />
          <Badge label={event.category.replace("_", " ")} />
          {event.county && <Badge label={event.county} />}
        </div>
        <h3 style={{ margin: "0 0 0.35rem 0" }}>{event.title}</h3>
        <p style={{ color: "var(--color-text-muted)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
          Impact {event.importance_score}/100 · Confidence {event.confidence_score}% · {timeAgo(event.last_updated_at)}
        </p>
        {event.why_it_matters && (
          <p style={{ fontSize: "0.9rem" }}>
            <strong className="accent-text">Why it matters: </strong>
            {event.why_it_matters}
          </p>
        )}
      </div>
    </Link>
  );
}