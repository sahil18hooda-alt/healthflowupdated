
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  login: (role: UserRole, emailOrName: string) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (newDetails: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper to convert email to a capitalized name
const emailToName = (email: string) => {
  if (!email.includes('@')) return email; // It's probably a name from signup
  const namePart = email.split('@')[0];
  return namePart
    .split(/[\._-]/)
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('healthflow-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('healthflow-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (role: UserRole, emailOrName: string) => {
    const isEmail = emailOrName.includes('@');
    const name = isEmail ? emailToName(emailOrName) : emailOrName;
    const email = isEmail ? emailOrName : (role === 'patient' ? 'patient@healthflow.com' : 'doctor@healthflow.com');

    const mockUser: User = {
      id: '123',
      name: name,
      email: email,
      role: role,
    };
    localStorage.setItem('healthflow-user', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('healthflow-user');
    setUser(null);
    router.push('/');
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...newDetails };
      localStorage.setItem('healthflow-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = { user, login, logout, loading, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
