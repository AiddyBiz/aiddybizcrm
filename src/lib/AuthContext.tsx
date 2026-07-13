import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type AppRole = "SUPER_ADMIN" | "WORKSPACE_ADMIN" | "AGENT";

export interface Profile {
  id: string;
  full_name: string | null;
  role: AppRole;
  workspace_id: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  workspace: Workspace | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (patch: { full_name?: string; phone?: string | null; avatar_url?: string | null }) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  sendPasswordReset: (email?: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfileAndWorkspace(
  userId: string,
): Promise<{ profile: Profile | null; workspace: Workspace | null }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, workspace_id")
    .eq("id", userId)
    .maybeSingle();

  let workspace: Workspace | null = null;
  if (profile?.workspace_id) {
    const { data: ws } = await supabase
      .from("workspaces")
      .select("id, name, created_at")
      .eq("id", profile.workspace_id)
      .maybeSingle();
    workspace = (ws as Workspace | null) ?? null;
  }
  return { profile: (profile as Profile | null) ?? null, workspace };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!nextSession?.user) {
      setProfile(null);
      setWorkspace(null);
      return;
    }
    const { profile: p, workspace: w } = await loadProfileAndWorkspace(nextSession.user.id);
    setProfile(p);
    setWorkspace(w);
  }, []);

  useEffect(() => {
    // Register listener first, then read initial session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      // Defer async work to avoid deadlocks inside the callback.
      setTimeout(() => {
        void hydrate(next);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data }) => {
      void hydrate(data.session).finally(() => setIsLoading(false));
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setError(null);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: redirectTo,
      },
    });
    if (err) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    if (result.error) {
      const msg = result.error instanceof Error ? result.error.message : String(result.error);
      setError(msg);
      throw result.error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setWorkspace(null);
    setSession(null);
  };

  const refresh = async () => {
    if (!session?.user) return;
    const { profile: p, workspace: w } = await loadProfileAndWorkspace(session.user.id);
    setProfile(p);
    setWorkspace(w);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      workspace,
      isLoading,
      isAuthenticated: !!session,
      error,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refresh,
      clearError: () => setError(null),
    }),
    [session, profile, workspace, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
