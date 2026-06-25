"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { tokenStore } from "@/lib/auth/token-store";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName?: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

interface SessionResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  user: AuthUser;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// Refresh the access token shortly before it expires for a seamless session.
const REFRESH_SKEW_MS = 60_000;

async function readError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: string; title?: string };
    return data.detail ?? data.title ?? fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lets the scheduled timeout call the latest silentRefresh without a dependency cycle.
  const silentRefreshRef = useRef<() => Promise<boolean>>(() =>
    Promise.resolve(false),
  );

  const cancelScheduledRefresh = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  const applySession = useCallback((session: SessionResponse) => {
    tokenStore.set(session.accessToken);
    setUser(session.user);
    setStatus("authenticated");

    cancelScheduledRefresh();
    const delay =
      new Date(session.accessTokenExpiresAt).getTime() -
      Date.now() -
      REFRESH_SKEW_MS;
    refreshTimer.current = setTimeout(
      () => void silentRefreshRef.current(),
      Math.max(delay, 0),
    );
  }, []);

  const clearSession = useCallback(() => {
    cancelScheduledRefresh();
    tokenStore.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const silentRefresh = useCallback(async (): Promise<boolean> => {
    const response = await fetch("/api/auth/refresh", { method: "POST" });
    if (!response.ok) {
      clearSession();
      return false;
    }
    applySession((await response.json()) as SessionResponse);
    return true;
  }, [applySession, clearSession]);

  useEffect(() => {
    silentRefreshRef.current = silentRefresh;
  }, [silentRefresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Unable to sign in."));
      }
      applySession((await response.json()) as SessionResponse);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Unable to create account."));
      }
      applySession((await response.json()) as SessionResponse);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearSession();
    }
  }, [clearSession]);

  // Restore the session on load using the httpOnly refresh cookie. State updates
  // run in async callbacks (not synchronously in the effect body).
  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/refresh", { method: "POST" })
      .then(async (response) => {
        if (cancelled) {
          return;
        }
        if (response.ok) {
          applySession((await response.json()) as SessionResponse);
        } else {
          clearSession();
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession();
        }
      });

    return () => {
      cancelled = true;
      cancelScheduledRefresh();
    };
  }, [applySession, clearSession]);

  const value: AuthContextValue = { user, status, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
