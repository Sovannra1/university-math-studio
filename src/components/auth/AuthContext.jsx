"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "math_studio_auth_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const signInWithGoogleCredential = useCallback(
    (credential) => {
      try {
        const base64Url = credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const profile = JSON.parse(jsonPayload);
        persistUser({
          id: profile.sub,
          name: profile.name || "Google User",
          email: profile.email || "",
          picture: profile.picture || "",
          provider: "google",
          plan: "free",
        });
        setIsLoginModalOpen(false);
      } catch {
        // Fallback ignore malformed token
      }
    },
    [persistUser]
  );

  const signInWithDemo = useCallback(
    ({ name, email }) => {
      persistUser({
        id: `demo-${Date.now()}`,
        name: name?.trim() || "និស្សិតគណិតវិទ្យា",
        email: email?.trim() || "student@gmail.com",
        picture: "",
        provider: "google-demo",
        plan: "free",
      });
      setIsLoginModalOpen(false);
    },
    [persistUser]
  );

  const signOut = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  // All features remain unlocked right now; ready for future Free vs Pro gating
  const canAccessFeature = useCallback(() => true, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        plan: user?.plan || "free",
        canAccessFeature,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        signInWithGoogleCredential,
        signInWithDemo,
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
