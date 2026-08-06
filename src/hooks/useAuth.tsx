import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { recupererProfil } from '../services/authService';
import type { Profil } from '../types/user';

interface AuthContextValue {
  profil: Profil | null;
  chargement: boolean;
  rafraichirProfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [chargement, setChargement] = useState(true);

  async function chargerProfil(userId: string) {
    const data = await recupererProfil(userId);
    setProfil(data as Profil);
  }

  async function rafraichirProfil() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await chargerProfil(user.id);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        chargerProfil(session.user.id).finally(() => setChargement(false));
      } else {
        setChargement(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        chargerProfil(session.user.id);
      } else {
        setProfil(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ profil, chargement, rafraichirProfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
