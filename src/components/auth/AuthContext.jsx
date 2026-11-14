"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || "Google User",
          email: fbUser.email || "",
          picture: fbUser.photoURL || "",
          provider: "google",
          plan: "free",
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result?.user) {
      setIsLoginModalOpen(false);
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  // All features remain unlocked right now; ready for future Free vs Pro gating
  const canAccessFeature = useCallback(() => true, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isLoggedIn: !!user,
        plan: user?.plan || "free",
        canAccessFeature,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
