import { RawFeedEvent, RawFeedEventDetail } from "./types";

const API_URL =
  (globalThis as typeof globalThis & {
    process?: { env?: { EXPO_PUBLIC_API_URL?: string } };
  }).process?.env?.EXPO_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export interface EventFilters {
  category?: string;
  county?: string;
  status?: string;
}

function buildQuery(filters: EventFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.county) params.set("county", filters.county);
  if (filters.status) params.set("status", filters.status);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function fetchEvents(filters: EventFilters = {}): Promise<RawFeedEvent[]> {
  return apiFetch<RawFeedEvent[]>(`/api/events${buildQuery(filters)}`);
}

export function fetchEvent(id: string): Promise<RawFeedEventDetail> {
  return apiFetch<RawFeedEventDetail>(`/api/events/${id}`);
}