import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'company' | null;
  company?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateRole: (role: 'client' | 'company') => Promise<void>;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Handle OAuth callback token in URL
    const params = new URLSearchParams(window.location.search);
    const cbToken = params.get('token');
    if (cbToken) {
      localStorage.setItem('token', cbToken);
      window.history.replaceState({}, '', '/');
      api.get('/auth/me').then(r => { setUser(r.data); setLoading(false); });
    }
  }, []);

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateRole = async (role: 'client' | 'company') => {
    const { data } = await api.put('/auth/role', { role });
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
