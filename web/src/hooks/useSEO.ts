import { useEffect } from "react";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL } from "../lib/seo";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO(options: SeoOptions) {
  const { title, description, path, noindex, image, type, jsonLd } = options;
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = path === "/" ? `${title}` : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    const canonicalUrl = `${SITE_URL}${path}`;
    setLink("canonical", canonicalUrl);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", type || "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", image || DEFAULT_IMAGE);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image || DEFAULT_IMAGE);

    let script = document.querySelector('script[data-seo="jsonld"]') as HTMLScriptElement | null;
    if (jsonLdString) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "jsonld");
        document.head.appendChild(script);
      }
      script.textContent = jsonLdString;
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, noindex, image, type, jsonLdString]);
}