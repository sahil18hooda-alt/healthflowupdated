'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { HealthProfile } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  login: (role: UserRole, email: string, pass: string) => void;
  signup: (role: UserRole, details: Omit<User, 'id'|'role'>) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (newDetails: Partial<User>) => void;
  updateHealthProfile: (healthProfile: HealthProfile) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_PATIENT: User = {
  id: 'patient-001',
  name: 'John Patient',
  email: 'patient@healthflow.com',
  role: 'patient',
};

const MOCK_EMPLOYEE: User = {
  id: 'employee-001',
  name: 'Dr. Smith',
  email: 'employee@healthflow.com',
  role: 'employee',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a user session
    const session = localStorage.getItem('healthflow-user');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole, email: string, pass: string) => {
    setLoading(true);
    // This is a mock login. In a real app, you'd call an API.
    const loggedInUser = role === 'patient' ? MOCK_PATIENT : MOCK_EMPLOYEE;
    setUser(loggedInUser);
    localStorage.setItem('healthflow-user', JSON.stringify(loggedInUser));
    router.push('/dashboard');
    setLoading(false);
  };

  const signup = (role: UserRole, details: Omit<User, 'id'|'role'>) => {
    setLoading(true);
    // This is a mock signup.
    const newUser: User = {
      ...details,
      id: `new-${Date.now()}`,
      role: role,
    };
    setUser(newUser);
    localStorage.setItem('healthflow-user', JSON.stringify(newUser));
    router.push('/dashboard');
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthflow-user');
    router.push('/');
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...newDetails };
        setUser(updatedUser);
        localStorage.setItem('healthflow-user', JSON.stringify(updatedUser));
    }
  }

  const updateHealthProfile = (healthProfile: HealthProfile) => {
      if(user && user.role === 'patient') {
          const updatedUser = { ...user, healthProfile };
          setUser(updatedUser);
          localStorage.setItem('healthflow-user', JSON.stringify(updatedUser));
      }
  }

  const value = { user, login, signup, logout, loading, updateUser, updateHealthProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
