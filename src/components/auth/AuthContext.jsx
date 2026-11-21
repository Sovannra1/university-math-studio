"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import {
  DEFAULT_ACCESS_CONFIG,
  isAdminEmail,
  canUserAccess,
  isTrialActive,
} from "@/lib/accessControl";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [accessConfig, setAccessConfig] = useState(DEFAULT_ACCESS_CONFIG);

  // Listen to global accessControl settings from Firestore
  useEffect(() => {
    const ref = doc(db, "appSettings", "accessControl");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAccessConfig({
            ...DEFAULT_ACCESS_CONFIG,
            ...data,
            featureAccess: {
              ...DEFAULT_ACCESS_CONFIG.featureAccess,
              ...(data.featureAccess || {}),
            },
            subjectAccess: {
              ...(data.subjectAccess || {}),
            },
            subjectPrices: {
              ...(data.subjectPrices || {}),
            },
          });
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    let unsubUserDoc = null;
    let unsubPayments = null;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }
      if (unsubPayments) {
        unsubPayments();
        unsubPayments = null;
      }

      if (fbUser) {
        const baseUser = {
          id: fbUser.uid,
          name: fbUser.displayName || "Google User",
          email: fbUser.email || "",
          picture: fbUser.photoURL || "",
          provider: "google",
          plan: isAdminEmail(fbUser.email) ? "pro" : "free",
          purchasedSubjects: [],
          trialEndsAt: null,
          trialUsed: false,
        };
        setUser(baseUser);

        const userRef = doc(db, "users", fbUser.uid);
        try {
          await setDoc(
            userRef,
            {
              uid: fbUser.uid,
              name: baseUser.name,
              email: baseUser.email,
              picture: baseUser.picture,
              lastLoginAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch {
          // Ignore if Firestore rules block write
        }

        unsubUserDoc = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              const d = snap.data();
              setUser((prev) =>
                prev
                  ? {
                      ...prev,
                      plan: isAdminEmail(prev.email) ? "pro" : d.plan || "free",
                      purchasedSubjects: Array.isArray(d.purchasedSubjects)
                        ? d.purchasedSubjects
                        : [],
                      trialEndsAt: d.trialEndsAt || null,
                      trialUsed: Boolean(d.trialUsed),
                    }
                  : prev
              );
            }
          },
          () => {}
        );

        // Listen to user's pending ABA payment requests in real time
        unsubPayments = onSnapshot(
          query(
            collection(db, "paymentRequests"),
            where("uid", "==", fbUser.uid),
            where("status", "==", "pending")
          ),
          (snap) => {
            setPendingPayments(
              snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
          },
          () => setPendingPayments([])
        );
      } else {
        setUser(null);
        setPendingPayments([]);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
      if (unsubPayments) unsubPayments();
    };
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

  const startFreeTrial = useCallback(async () => {
    if (!user?.id || user.trialUsed) return false;
    const days = Number(accessConfig?.trialDays ?? 7);
    const endsAt = Date.now() + days * 24 * 60 * 60 * 1000;
    await setDoc(
      doc(db, "users", user.id),
      {
        trialEndsAt: endsAt,
        trialUsed: true,
      },
      { merge: true }
    );
    return true;
  }, [user?.id, user?.trialUsed, accessConfig?.trialDays]);

  const isAdmin = isAdminEmail(user?.email);

  const canAccessFeature = useCallback(
    (opts = {}) => {
      if (typeof opts === "string") {
        return canUserAccess({
          user,
          accessConfig,
          featureKey: opts,
        }).allowed;
      }
      return canUserAccess({
        user,
        accessConfig,
        subjectId: opts.subjectId,
        featureKey: opts.featureKey,
      }).allowed;
    },
    [user, accessConfig]
  );

  const checkAccess = useCallback(
    ({ subjectId, featureKey } = {}) =>
      canUserAccess({ user, accessConfig, subjectId, featureKey }),
    [user, accessConfig]
  );

  const openUpgradeModal = useCallback((target = null) => {
    setUpgradeTarget(target);
    setIsUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
    setUpgradeTarget(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isLoggedIn: !!user,
        isAdmin,
        plan: user?.plan || "free",
        hasActiveTrial: accessConfig?.trialEnabled && isTrialActive(user),
        accessConfig,
        canAccessFeature,
        checkAccess,
        startFreeTrial,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        isUpgradeModalOpen,
        upgradeTarget,
        pendingPayments,
        openUpgradeModal,
        closeUpgradeModal,
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
