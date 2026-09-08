import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { AdminUser, activateUser, deactivateUser, fetchAdminUsers } from "../lib/authApi";

export function Admin() {
  const { user, authFetch } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    fetchAdminUsers(authFetch)
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.is_admin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user?.is_admin) {
    return (
      <div className="glass-panel" role="alert" style={{ margin: "1rem", padding: "1.5rem" }}>
        <h2>Not authorized</h2>
        <p style={{ color: "var(--color-text-muted)" }}>This page is only available to RawFeed administrators.</p>
      </div>
    );
  }

  const handleToggle = async (target: AdminUser) => {
    setBusyId(target.id);
    setError(null);
    try {
      const updated = target.is_active
        ? await deactivateUser(authFetch, target.id)
        : await activateUser(authFetch, target.id);
      setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h2 className="accent-text">Admin — Users</h2>
      {error && (
        <p role="alert" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="glass-panel" style={{ padding: "0.5rem" }}>
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--color-surface-border)",
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: "1 1 220px", wordBreak: "break-all" }}>{u.email}</span>
              <span
                style={{
                  padding: "0.15rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: u.is_verified ? "color-mix(in srgb, var(--accent-color) 25%, transparent)" : "rgba(239,68,68,0.2)",
                  color: u.is_verified ? "var(--accent-color)" : "#ef4444",
                }}
              >
                {u.is_verified ? "Verified" : "Unverified"}
              </span>
              <span
                style={{
                  padding: "0.15rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: u.is_active ? "rgba(128,128,128,0.2)" : "rgba(239,68,68,0.2)",
                  color: u.is_active ? "var(--color-text-muted)" : "#ef4444",
                }}
              >
                {u.is_active ? "Active" : "Deactivated"}
              </span>
              {u.is_admin && (
                <span
                  style={{
                    padding: "0.15rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "var(--accent-color)",
                    color: "#fff",
                  }}
                >
                  Admin
                </span>
              )}
              {!u.is_admin && (
                <button
                  onClick={() => handleToggle(u)}
                  disabled={busyId === u.id}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "999px",
                    border: `1px solid ${u.is_active ? "#ef4444" : "var(--accent-color)"}`,
                    color: u.is_active ? "#ef4444" : "var(--accent-color)",
                    background: "none",
                  }}
                >
                  {busyId === u.id ? "Working..." : u.is_active ? "Deactivate" : "Reactivate"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}