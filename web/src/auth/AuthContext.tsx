import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AuthUser, fetchCurrentUser, loginUser, refreshTokens, registerUser } from "../lib/authApi";

const API_URL = (import.meta as ImportMeta & {
  env: { VITE_API_URL?: string };
}).env.VITE_API_URL ?? "";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  authFetch: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("rawfeed_access_token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem("rawfeed_refresh_token")
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("rawfeed_access_token");
    localStorage.removeItem("rawfeed_refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const persistTokens = (tokens: { access_token: string; refresh_token: string }) => {
    localStorage.setItem("rawfeed_access_token", tokens.access_token);
    localStorage.setItem("rawfeed_refresh_token", tokens.refresh_token);
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
  };

  const authFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const doFetch = (token: string | null) =>
      fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    let response = await doFetch(accessToken);

    if (response.status === 401 && refreshToken) {
      try {
        const tokens = await refreshTokens(refreshToken);
        persistTokens(tokens);
        response = await doFetch(tokens.access_token);
      } catch {
        clearSession();
      }
    }

    return response;
  };

  useEffect(() => {
    async function loadUser() {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser(accessToken);
        setUser(currentUser);
      } catch {
        if (refreshToken) {
          try {
            const tokens = await refreshTokens(refreshToken);
            persistTokens(tokens);
            const currentUser = await fetchCurrentUser(tokens.access_token);
            setUser(currentUser);
          } catch {
            clearSession();
          }
        } else {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await loginUser(email, password);
    persistTokens(tokens);
    const currentUser = await fetchCurrentUser(tokens.access_token);
    setUser(currentUser);
  };

  const register = async (email: string, password: string) => {
    await registerUser(email, password);
  };

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout: clearSession, setUser, authFetch }),
    [user, accessToken, refreshToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}