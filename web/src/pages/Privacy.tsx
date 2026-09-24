import { Link } from "react-router-dom";

export function Privacy() {
  return (
    <div style={{ margin: "1rem", maxWidth: "720px", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
      <Link to="/" className="accent-text" style={{ textDecoration: "none" }}>
        &larr; Back to the feed
      </Link>

      <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "1rem" }}>
        <h1 className="accent-text" style={{ marginTop: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          RawFeed is built and maintained by Alvin Kipng&apos;eno Langat.
        </p>

        <p>RawFeed collects only the information needed to provide and maintain the service:</p>
        <ul>
          <li>Your account email address and hashed password</li>
          <li>
            Verification, password reset, and account deletion codes. These are temporary, expire automatically, and
            can only be used once
          </li>
          <li>
            Your preferences, including country, county, followed topics, accent color, theme mode, and notification
            level
          </li>
          <li>A push notification token if you choose to enable notifications, linked to your account</li>
          <li>Public news articles collected by RawFeed and the events derived from them. This is not personal data</li>
        </ul>

        <p>RawFeed does not sell or share your personal data with third parties for advertising.</p>

        <h2>Deleting your data</h2>
        <p>
          If you delete your account through <strong>Settings &gt; Account &gt; Delete account</strong>, your user
          record, preferences, verification codes, and push notification tokens are permanently removed. This cannot
          be undone.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy can be sent to kal.projects.dev@gmail.com.</p>
      </div>
    </div>
  );
}