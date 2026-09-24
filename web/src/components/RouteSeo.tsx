import { useLocation } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { DEFAULT_DESCRIPTION, buildWebsiteJsonLd } from "../lib/seo";

interface SeoEntry {
  title: string;
  description: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const ROUTE_SEO: Record<string, SeoEntry> = {
  "/": {
    title: "RawFeed — Kenyan News, Clustered by Event",
    description: DEFAULT_DESCRIPTION,
    jsonLd: buildWebsiteJsonLd(),
  },
  "/globe": {
    title: "Globe",
    description: "Explore RawFeed events across Kenya's counties on an interactive 3D globe.",
  },
  "/explore": {
    title: "Explore",
    description: "Filter Kenyan news events by category and county on RawFeed.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "What RawFeed collects, why, and how to delete your account and data.",
  },
  "/terms": {
    title: "Terms of Use",
    description: "Terms for using RawFeed, a news aggregation and event-clustering service for Kenya.",
  },
  "/login": {
    title: "Log in",
    description: "Log in to your RawFeed account.",
    noindex: true,
  },
  "/register": {
    title: "Sign up",
    description: "Create a RawFeed account to personalize your news feed.",
    noindex: true,
  },
  "/verify-email": {
    title: "Verify email",
    description: "Verify your RawFeed account email address.",
    noindex: true,
  },
  "/forgot-password": {
    title: "Forgot password",
    description: "Reset your RawFeed account password.",
    noindex: true,
  },
  "/reset-password": {
    title: "Reset password",
    description: "Set a new password for your RawFeed account.",
    noindex: true,
  },
  "/settings": {
    title: "Settings",
    description: "Manage your RawFeed account, preferences, and notifications.",
    noindex: true,
  },
  "/admin": {
    title: "Admin",
    description: "RawFeed administration.",
    noindex: true,
  },
};

function resolveEntry(path: string): SeoEntry {
  if (path.startsWith("/events/")) {
    return { title: "Event", description: DEFAULT_DESCRIPTION };
  }
  return ROUTE_SEO[path] ?? { title: "Page not found", description: DEFAULT_DESCRIPTION, noindex: true };
}

export function RouteSeo() {
  const location = useLocation();
  const path = location.pathname;
  const entry = resolveEntry(path);

  useSEO({
    title: entry.title,
    description: entry.description,
    path,
    noindex: path.startsWith("/events/") ? undefined : entry.noindex,
    jsonLd: entry.jsonLd,
  });

  return null;
}