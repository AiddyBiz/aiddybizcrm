import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "admin" | "manager" | "agent" | "partner";
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "aiddybiz_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from client storage on mount only.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: replace with real backend call (Lovable Cloud / Supabase auth).
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (password.length < 6) throw new Error("Invalid credentials.");

      const next: AuthUser = {
        id: crypto.randomUUID(),
        email: email.toLowerCase().trim(),
        name: email.split("@")[0],
        role: "agent",
      };
      persist(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: replace with real backend call.
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");

      const next: AuthUser = {
        id: crypto.randomUUID(),
        email: email.toLowerCase().trim(),
        name: name || email.split("@")[0],
        role: "agent",
      };
      persist(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // TODO: replace with real backend sign-out.
      await new Promise((resolve) => setTimeout(resolve, 250));
      persist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (patch: Partial<AuthUser>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    persist(next);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
