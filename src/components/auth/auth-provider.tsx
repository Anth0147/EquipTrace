
'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  setPreviewUser: (profile: UserProfile) => void;
  logoutPreviewUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  setPreviewUser: () => {},
  logoutPreviewUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to set a local "preview" user
  const setPreviewUser = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    sessionStorage.setItem('userProfile', JSON.stringify(profile)); // Persist to session storage
    setLoading(false);
  }, []);

  // Function to log out the local "preview" user
  const logoutPreviewUser = useCallback(() => {
    setUserProfile(null);
    sessionStorage.removeItem('userProfile'); // Remove from session storage
  }, []);
  
  // Check for a logged-in user in session storage on initial load
  useEffect(() => {
    try {
        const storedUserProfile = sessionStorage.getItem('userProfile');
        if (storedUserProfile) {
            setUserProfile(JSON.parse(storedUserProfile));
        }
    } catch (error) {
        console.error("Could not parse user profile from session storage", error);
        sessionStorage.removeItem('userProfile');
    }
    setLoading(false);
  }, []);


  const value = { userProfile, loading, setPreviewUser, logoutPreviewUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
