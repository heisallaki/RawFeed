export type EventStatus = "confirmed" | "developing" | "disputed" | "unverified" | "resolved";

export type EventCategory =
  | "government_politics"
  | "economy_business"
  | "technology_ai"
  | "science"
  | "health"
  | "security"
  | "climate_weather"
  | "transportation"
  | "emergencies_disasters"
  | "public_figures"
  | "other";

export interface EventSource {
  source_name: string;
  url: string;
  published_at: string | null;
}

export interface RawFeedEvent {
  id: string;
  title: string;
  summary: string;
  category: EventCategory;
  status: EventStatus;
  country: string;
  county: string | null;
  importance_score: number;
  importance_reasons: string[];
  confidence_score: number;
  why_it_matters: string | null;
  what_we_know: string[];
  what_we_dont_know: string[];
  first_reported_at: string;
  last_updated_at: string;
}

export interface RawFeedEventDetail extends RawFeedEvent {
  sources: EventSource[];
}

export interface NewsSourceSummary {
  id: string;
  name: string;
  website_url: string;
  credibility_tier: string;
  county_scope: string | null;
  is_active: boolean;
}