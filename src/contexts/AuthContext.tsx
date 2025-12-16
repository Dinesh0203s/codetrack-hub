import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    return profile;
  };

  const fetchRole = async (userId: string): Promise<AppRole> => {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    return roleData?.role || 'USER';
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }));

        // Defer profile/role fetch to avoid deadlock
        if (session?.user) {
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            const role = await fetchRole(session.user.id);
            setAuthState(prev => ({
              ...prev,
              profile,
              role,
            }));
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null,
            role: null,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }));

      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchRole(session.user.id)
        ]).then(([profile, role]) => {
          setAuthState(prev => ({
            ...prev,
            profile,
            role,
          }));
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!authState.user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authState.user.id);

    if (error) {
      console.error('Profile update error:', error);
      throw error;
    }

    // Refresh profile
    const profile = await fetchProfile(authState.user.id);
    setAuthState(prev => ({ ...prev, profile }));
  };

  const refreshProfile = async () => {
    if (!authState.user) return;
    const profile = await fetchProfile(authState.user.id);
    const role = await fetchRole(authState.user.id);
    setAuthState(prev => ({ ...prev, profile, role }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, signInWithGoogle, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
