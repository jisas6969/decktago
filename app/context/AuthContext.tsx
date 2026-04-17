'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  companyName: string;
  role: string;
  createdAt?: Timestamp;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    companyName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 📝 SIGNUP
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    companyName: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const newUserData: UserData = {
      uid: newUser.uid,
      email: newUser.email!,
      fullName,
      phoneNumber,
      companyName,
      role: 'CUSTOMER',
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, 'users', newUser.uid), newUserData);
    setUserData(newUserData);
  };

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // 🔄 UPDATE USER DATA
  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in');

    await setDoc(doc(db, 'users', user.uid), data, { merge: true });

    setUserData((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signup,
        login,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔗 HOOK
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}