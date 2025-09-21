"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For testing: Always set a mock authenticated user
    const mockUser: User = {
      id: "test-user-id",
      email: "test@example.com",
      user_metadata: {
        name: "Test User",
        role: "student",
      },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: "authenticated",
      confirmation_sent_at: new Date().toISOString(),
      recovery_sent_at: new Date().toISOString(),
      email_change_sent_at: new Date().toISOString(),
      new_email: undefined,
      invited_at: new Date().toISOString(),
      action_link: undefined,
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      phone: undefined,
      identities: [],
      factors: [],
    };

    const mockSession: Session = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: "bearer",
      user: mockUser,
    };

    // Set mock user immediately for testing
    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);

    // Keep the original Supabase listeners for when you want to re-enable auth
    /*
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    */
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
