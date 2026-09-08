import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AuthUser, fetchCurrentUser, loginUser, refreshTokens, registerUser } from "./authApi";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    AsyncStorage.multiRemove(["rawfeed_access_token", "rawfeed_refresh_token"]);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      const storedAccess = await AsyncStorage.getItem("rawfeed_access_token");
      const storedRefresh = await AsyncStorage.getItem("rawfeed_refresh_token");
      if (!storedAccess) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser(storedAccess);
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setUser(currentUser);
      } catch {
        if (storedRefresh) {
          try {
            const tokens = await refreshTokens(storedRefresh);
            await AsyncStorage.setItem("rawfeed_access_token", tokens.access_token);
            await AsyncStorage.setItem("rawfeed_refresh_token", tokens.refresh_token);
            setAccessToken(tokens.access_token);
            setRefreshToken(tokens.refresh_token);
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
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await loginUser(email, password);
    await AsyncStorage.setItem("rawfeed_access_token", tokens.access_token);
    await AsyncStorage.setItem("rawfeed_refresh_token", tokens.refresh_token);
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    const currentUser = await fetchCurrentUser(tokens.access_token);
    setUser(currentUser);
  };

  const register = async (email: string, password: string) => {
    await registerUser(email, password);
  };

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout: clearSession, setUser }),
    [user, accessToken, loading]
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