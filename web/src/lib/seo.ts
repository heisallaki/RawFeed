import { RawFeedEventDetail } from "./types";

export const SITE_URL = "https://rawfeed-news.vercel.app";
export const SITE_NAME = "RawFeed";
export const DEFAULT_DESCRIPTION =
  "Know what matters. Ignore the noise. RawFeed clusters Kenyan news into scored, sourced events.";
export const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  };
}

export function buildEventJsonLd(event: RawFeedEventDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: event.title,
    description: event.why_it_matters || event.summary || event.title,
    datePublished: event.first_reported_at,
    dateModified: event.last_updated_at,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/events/${event.id}` },
    citation: event.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.source_name,
      url: source.url,
    })),
  };
}