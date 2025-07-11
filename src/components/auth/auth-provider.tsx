
'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setPreviewUser: (profile: UserProfile) => void;
  logoutPreviewUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  setPreviewUser: () => {},
  logoutPreviewUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const setPreviewUser = useCallback((profile: UserProfile) => {
    setUser(null); // Ensure no real user is set
    setUserProfile(profile);
    setLoading(false);
  }, []);

  const logoutPreviewUser = useCallback(() => {
    setUser(null);
    setUserProfile(null);
  }, []);

  useEffect(() => {
    // If a preview user is set, don't run firebase auth
    if (userProfile && userProfile.uid.startsWith('preview-')) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const value = { user, userProfile, loading, setPreviewUser, logoutPreviewUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
