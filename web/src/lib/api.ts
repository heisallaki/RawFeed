import { RawFeedEvent, RawFeedEventDetail } from "./types";

const API_URL = ((import.meta as any).env?.VITE_API_URL ?? "") as string;

export interface AuthUser {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type AuthFetch = (path: string, options?: RequestInit) => Promise<Response>;

export class ApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    const detail = body.detail;
    if (detail && typeof detail === "object") {
      throw new ApiError(detail.message || "Request failed", detail.code);
    }
    throw new ApiError(detail || "Request failed");
  }
  return response.json() as Promise<T>;
}

export function fetchEvents(params?: {
  category?: string;
  county?: string;
  status?: string;
  limit?: number;
}): Promise<RawFeedEvent[]> {
  const searchParams = new URLSearchParams();

  if (params?.category) searchParams.set("category", params.category);
  if (params?.county) searchParams.set("county", params.county);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return fetch(`${API_URL}/api/events${query ? `?${query}` : ""}`).then((res) =>
    handle<RawFeedEvent[]>(res)
  );
}

export function fetchEvent(eventId: string): Promise<RawFeedEventDetail> {
  return fetch(`${API_URL}/api/events/${eventId}`).then((res) =>
    handle<RawFeedEventDetail>(res)
  );
}

export function registerUser(email: string, password: string): Promise<AuthUser> {
  return fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => handle<AuthUser>(res));
}

export function loginUser(email: string, password: string): Promise<TokenPair> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);
  return fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  }).then((res) => handle<TokenPair>(res));
}

export function verifyEmail(email: string, code: string): Promise<AuthUser> {
  return fetch(`${API_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  }).then((res) => handle<AuthUser>(res));
}

export function resendVerification(email: string): Promise<{ message: string }> {
  return fetch(`${API_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((res) => handle<{ message: string }>(res));
}

export function refreshTokens(refreshToken: string): Promise<TokenPair> {
  return fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  }).then((res) => handle<TokenPair>(res));
}

export function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  return fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => handle<AuthUser>(res));
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return fetch(`${API_URL}/api/auth/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((res) => handle<{ message: string }>(res));
}

export function resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
  return fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password: newPassword }),
  }).then((res) => handle<{ message: string }>(res));
}

export function requestReactivation(email: string): Promise<{ message: string }> {
  return fetch(`${API_URL}/api/auth/request-reactivation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((res) => handle<{ message: string }>(res));
}

export function requestAccountDeletion(authFetch: AuthFetch): Promise<{ message: string }> {
  return authFetch("/api/users/me/request-deletion", { method: "POST" }).then((res) =>
    handle<{ message: string }>(res)
  );
}

export function confirmAccountDeletion(authFetch: AuthFetch, code: string): Promise<{ message: string }> {
  return authFetch("/api/users/me/confirm-deletion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }).then((res) => handle<{ message: string }>(res));
}

export interface AdminUser {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  reactivation_requested: boolean;
  created_at: string;
}

export function fetchAdminUsers(authFetch: AuthFetch): Promise<AdminUser[]> {
  return authFetch("/api/admin/users").then((res) => handle<AdminUser[]>(res));
}

export function deactivateUser(authFetch: AuthFetch, userId: string): Promise<AdminUser> {
  return authFetch(`/api/admin/users/${userId}/deactivate`, { method: "POST" }).then((res) =>
    handle<AdminUser>(res)
  );
}

export function activateUser(authFetch: AuthFetch, userId: string): Promise<AdminUser> {
  return authFetch(`/api/admin/users/${userId}/activate`, { method: "POST" }).then((res) => handle<AdminUser>(res));
}