"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AuthResponse, User } from "@/types";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "rs_access_token";
const REFRESH_TOKEN_KEY = "rs_refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const saveSession = (session: AuthResponse) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    async function loadSession() {
      if (!storedAccessToken) {
        setIsReady(true);
        return;
      }

      try {
        const currentUser = await apiRequest<User>("/api/auth/me", {
          token: storedAccessToken,
        });
        setUser(currentUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      } catch {
        if (!storedRefreshToken) {
          clearSession();
          setIsReady(true);
          return;
        }

        try {
          const refreshed = await apiRequest<Omit<AuthResponse, "refreshToken">>(
            "/api/auth/refresh",
            {
              method: "POST",
              body: JSON.stringify({ refreshToken: storedRefreshToken }),
            }
          );
          setUser(refreshed.user);
          setAccessToken(refreshed.accessToken);
          setRefreshToken(storedRefreshToken);
          localStorage.setItem(ACCESS_TOKEN_KEY, refreshed.accessToken);
        } catch {
          clearSession();
        }
      } finally {
        setIsReady(true);
      }
    }

    loadSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isReady,
      login: async (email, password) => {
        const session = await apiRequest<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        saveSession(session);
      },
      register: async (name, email, password) => {
        const session = await apiRequest<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        saveSession(session);
      },
      logout: async () => {
        const token = refreshToken;
        clearSession();
        if (token) {
          await apiRequest<void>("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken: token }),
          }).catch(() => undefined);
        }
      },
    }),
    [accessToken, isReady, refreshToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
