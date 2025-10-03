'use client';

import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/providers/auth-provider';
import { useFirebase as useFirebaseServices } from '@/firebase';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useFirebase = useFirebaseServices;
