'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { User, UserRole, HealthProfile } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (role: UserRole, email: string, pass: string) => Promise<void>;
  signup: (role: UserRole, details: Omit<User, 'id' | 'role'> & {password: string}) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (newDetails: Partial<User>) => void;
  updateHealthProfile: (healthProfile: HealthProfile) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { auth, firestore, isUserLoading, user: authStateUser } = useFirebase();

  const fetchAppData = useCallback(async (fbUser: FirebaseUser) => {
    if (!firestore) return;
    setLoading(true);

    try {
      // Check if user is in 'users' (patient) collection
      let userDocRef = doc(firestore, 'users', fbUser.uid);
      let userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const patientData = userDocSnap.data();

        // Fetch health profile
        const healthProfileRef = doc(firestore, 'users', fbUser.uid, 'healthProfile', fbUser.uid);
        const healthProfileSnap = await getDoc(healthProfileRef);
        const healthProfile = healthProfileSnap.exists() ? healthProfileSnap.data() as HealthProfile : undefined;

        setUser({
          id: fbUser.uid,
          email: fbUser.email!,
          name: patientData.name,
          role: 'patient',
          healthProfile,
        });

      } else {
        // Check if user is in 'employees' collection
        userDocRef = doc(firestore, 'employees', fbUser.uid);
        userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const employeeData = userDocSnap.data();
          setUser({
            id: fbUser.uid,
            email: fbUser.email!,
            name: employeeData.name,
            role: 'employee',
          });
        } else {
            // User exists in Auth but not in Firestore DB. This might be a fresh signup.
            // Or an inconsistent state. For now, we log out.
            console.warn("User record not found in Firestore. Logging out.");
            await signOut(auth);
            setUser(null);
        }
      }
    } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
    } finally {
        setLoading(false);
    }
  }, [firestore, auth]);
  
  useEffect(() => {
    // isUserLoading is the master loading state from the core Firebase provider.
    // When it's done, authStateUser will be populated or null.
    if (!isUserLoading) {
      setFirebaseUser(authStateUser);
      if (authStateUser) {
        // If there's a user from Firebase Auth, fetch our app-specific data.
        fetchAppData(authStateUser);
      } else {
        // No user is logged in.
        setUser(null);
        setLoading(false);
      }
    }
  }, [isUserLoading, authStateUser, fetchAppData]);


  const login = async (role: UserRole, email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle the rest
    router.push('/dashboard');
  };
  
  const signup = async (role: UserRole, details: Omit<User, 'id' | 'role'> & {password: string}) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
    const { uid } = userCredential.user;

    const collectionPath = role === 'patient' ? 'users' : 'employees';
    const userDocRef = doc(firestore, collectionPath, uid);

    const { password, ...userData } = details;

    setDocumentNonBlocking(userDocRef, { ...userData, id: uid }, {});

    setUser({
        id: uid,
        ...userData,
        role,
    });

    router.push('/dashboard');
  };


  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    router.push('/');
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (user && firestore) {
      const updatedUser = { ...user, ...newDetails };
      setUser(updatedUser);
      
      const collectionPath = user.role === 'patient' ? 'users' : 'employees';
      const userDocRef = doc(firestore, collectionPath, user.id);
      
      const {id, role, healthProfile, ...detailsToUpdate} = newDetails;
      
      updateDoc(userDocRef, detailsToUpdate).catch(error => {
        console.error("Failed to update user in Firestore", error);
        // Optionally revert state or show an error
      });
    }
  };

  const updateHealthProfile = (healthProfile: HealthProfile) => {
    if (user && firestore) {
        setUser(prev => prev ? {...prev, healthProfile} : null);
        const healthProfileRef = doc(firestore, 'users', user.id, 'healthProfile', user.id);
        setDocumentNonBlocking(healthProfileRef, healthProfile, {});
    }
  };

  const value = { user, firebaseUser, login, signup, logout, loading, updateUser, updateHealthProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
