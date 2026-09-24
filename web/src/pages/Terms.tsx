import { Link } from "react-router-dom";

export function Terms() {
  return (
    <div style={{ margin: "1rem", maxWidth: "720px", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
      <Link to="/" className="accent-text" style={{ textDecoration: "none" }}>
        &larr; Back to the feed
      </Link>

      <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "1rem" }}>
        <h1 className="accent-text" style={{ marginTop: 0 }}>
          Terms of Use
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          RawFeed is built and maintained by Alvin Kipng&apos;eno Langat.
        </p>

        <p>
          RawFeed aggregates, clusters, and summarizes publicly available news about Kenya. RawFeed is not the
          original publisher of the articles. Each event links back to its original source, and credit belongs to
          those sources.
        </p>

        <h2>Accuracy</h2>
        <p>
          Event importance scores, confidence scores, and &quot;why it matters&quot; summaries are generated using a
          combination of rules and AI assistance and may contain errors. RawFeed should not be used as a substitute
          for official government or emergency guidance during a crisis.
        </p>

        <h2>Acceptable use</h2>
        <p>
          By using RawFeed, you agree not to misuse the service, attempt to disrupt it, or scrape it at a volume that
          could negatively affect the service for other users.
        </p>

        <h2>Ownership</h2>
        <p>
          Owned and maintained by Alvin Kipng&apos;eno Langat. The source code is released under the MIT
          License.
        </p>
      </div>
    </div>
  );
}