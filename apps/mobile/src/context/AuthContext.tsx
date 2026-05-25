import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, clearAuth, getStoredUser, setAuth, type AuthUser } from '../lib/api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await getStoredUser();
    if (!stored) {
      setUser(null);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      await clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const signIn = async (identifier: string, password: string) => {
    const { token, user: u } = await api.login(identifier, password);
    await setAuth(token, u);
    setUser(u);
  };

  const signOut = async () => {
    await clearAuth();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus di dalam AuthProvider');
  return ctx;
}
