const API_URL = (import.meta as ImportMeta & {
  env: { VITE_API_URL?: string };
}).env.VITE_API_URL as string;

export interface AuthUser {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(body.detail || "Request failed");
  }
  return response.json() as Promise<T>;
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