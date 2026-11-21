"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BookOpen,
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LayoutGrid,
  Crown,
  Lock,
} from "lucide-react";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthContext";
import {
  ADMIN_EMAIL,
  DEFAULT_ACCESS_CONFIG,
  FEATURE_LABELS,
} from "@/lib/accessControl";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AuthButton from "@/components/auth/AuthButton";
import Footer from "@/components/layout/Footer";

export default function AdminDashboard({ subjects = [] }) {
  const { user, isLoggedIn, isAdmin, authLoading, accessConfig, openLoginModal } =
    useAuth();
  const [activeTab, setActiveTab] = useState("access");
  const [draftConfig, setDraftConfig] = useState(DEFAULT_ACCESS_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    setDraftConfig({
      ...DEFAULT_ACCESS_CONFIG,
      ...accessConfig,
      featureAccess: {
        ...DEFAULT_ACCESS_CONFIG.featureAccess,
        ...(accessConfig?.featureAccess || {}),
      },
      subjectAccess: {
        ...(accessConfig?.subjectAccess || {}),
      },
      subjectPrices: {
        ...(accessConfig?.subjectPrices || {}),
      },
    });
  }, [accessConfig]);

  const loadAdminLists = async () => {
    if (!isAdmin) return;
    setLoadingLists(true);
    setErrorMsg("");
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersData = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsersList(usersData);

      const paySnap = await getDocs(
        query(collection(db, "paymentRequests"), orderBy("createdAt", "desc"))
      );
      const payData = paySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPaymentsList(payData);
    } catch {
      setErrorMsg(
        "មិនអាចទាញទិន្នន័យ Users / Payments បានទេ (សូមពិនិត្យ Firestore Security Rules សម្រាប់ Admin)។"
      );
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    if (isAdmin && (activeTab === "users" || activeTab === "payments")) {
      loadAdminLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, activeTab]);

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveMessage("");
    setErrorMsg("");
    try {
      await setDoc(
        doc(db, "appSettings", "accessControl"),
        {
          ...draftConfig,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email || ADMIN_EMAIL,
        },
        { merge: true }
      );
      setSaveMessage("បានរក្សាទុកការកំណត់សិទ្ធិដោយជោគជ័យ!");
    } catch {
      setErrorMsg(
        "មិនអាចរក្សាទុកទៅ Firestore បានទេ។ សូមពិនិត្យ Firestore Rules ឱ្យអនុញ្ញាត Admin (loeur.sovannra1@gmail.com) សរសេរលើ appSettings។"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUserPlan = async (targetUser) => {
    const nextPlan = targetUser.plan === "pro" ? "free" : "pro";
    try {
      await updateDoc(doc(db, "users", targetUser.id), { plan: nextPlan });
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, plan: nextPlan } : u))
      );
    } catch {
      setErrorMsg("មិនអាចកែប្រែសិទ្ធិអ្នកប្រើប្រាស់បានទេ។");
    }
  };

  const handleApprovePayment = async (reqItem) => {
    try {
      await updateDoc(doc(db, "paymentRequests", reqItem.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
      });
      if (reqItem.purchaseType === "subject" && reqItem.subjectId) {
        await setDoc(
          doc(db, "users", reqItem.uid),
          { purchasedSubjects: arrayUnion(reqItem.subjectId) },
          { merge: true }
        );
      } else {
        await setDoc(
          doc(db, "users", reqItem.uid),
          { plan: "pro" },
          { merge: true }
        );
      }
      setPaymentsList((prev) =>
        prev.map((p) => (p.id === reqItem.id ? { ...p, status: "approved" } : p))
      );
    } catch {
      setErrorMsg("មិនអាចអនុម័តការបង់ប្រាក់បានទេ។");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffafa]">
        <Loader2 className="h-7 w-7 animate-spin text-[#db073d]" />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffafa] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#fdbcbc] bg-white p-6 text-center shadow-md space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe9e8] text-[#db073d]">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold text-[#160002]">
            តំបន់គ្រប់គ្រងសម្រាប់ Admin ប៉ុណ្ណោះ
          </h1>
          <p className="text-xs text-[#620116]">
            សូមចូលគណនី Google ដែលមានសិទ្ធិ Admin ({ADMIN_EMAIL}) ដើម្បីគ្រប់គ្រងមាតិកា និងអ្នកប្រើប្រាស់។
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {!isLoggedIn && (
              <button
                type="button"
                onClick={openLoginModal}
                className="rounded-xl bg-[#db073d] px-4 py-2 text-xs font-bold text-white hover:bg-[#bb0533]"
              >
                ចូលគណនី Google
              </button>
            )}
            <Link
              href="/"
              className="rounded-xl border border-[#ffd3d2] bg-white px-4 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8]"
            >
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa]">
      <header className="sticky top-0 z-30 border-b border-[#ffd3d2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#160002]">
                ផ្ទាំងគ្រប់គ្រង Admin (Access &amp; ABA Control)
              </h1>
              <p className="text-[11px] font-semibold text-[#7e021f]">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-white px-3 py-1.5 text-xs font-bold text-[#7e021f] hover:bg-[#ffe9e8]"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#db073d]" />
              <span className="hidden sm:inline">ធ្នើរសៀវភៅ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "access", label: "កំណត់សិទ្ធិមាតិកា & មុខងារ", icon: BookOpen },
            { id: "users", label: "គ្រប់គ្រងអ្នកប្រើប្រាស់", icon: Users },
            { id: "payments", label: "សំណើបង់ប្រាក់ ABA", icon: CreditCard },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
                  activeTab === t.id
                    ? "border-[#db073d] bg-[#db073d] text-white shadow-xs"
                    : "border-[#ffd3d2] bg-white text-[#160002] hover:bg-[#ffe9e8]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] p-3.5 text-xs font-bold text-[#9c0329]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-[#b3e6d1] bg-[#e7f7f0] p-3.5 text-xs font-bold text-[#005936]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#009b5e]" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* TAB 1: ACCESS CONTROL */}
        {activeTab === "access" && (
          <div className="space-y-6">
            {/* Master Free Launch Toggle & Pricing */}
            <div className="rounded-2xl border border-[#fdbcbc] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#160002]">
                    របៀបបើកប្រើប្រាស់ទូទៅ (Global Mode)
                  </h2>
                  <p className="text-xs text-[#620116]">
                    បើក «ប្រើប្រាស់ដោយសេរី» ដើម្បីឱ្យអ្នកប្រើប្រាស់ទាំងអស់អានបានដោយឥតគិតថ្លៃសិន ឬបិទដើម្បីអនុវត្តលក្ខខណ្ឌបង់ប្រាក់ Pro។
                  </p>
                </div>

                <label className="inline-flex items-center gap-2.5 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8]/60 px-4 py-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftConfig.freeLaunchMode}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        freeLaunchMode: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#009b5e]"
                  />
                  <span className="text-xs font-bold text-[#160002]">
                    {draftConfig.freeLaunchMode
                      ? "កំពុងបើកឱ្យប្រើដោយសេរី (Free Launch ON)"
                      : "កំពុងអនុវត្តសិទ្ធិ Free / Pro (Gating ON)"}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#ffd3d2]">
                <div>
                  <label className="block text-xs font-bold text-[#47010d] mb-1">
                    តម្លៃ Pro ទាំងអស់ (USD)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={draftConfig.proPriceUsd}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        proPriceUsd: Number(e.target.value) || 15,
                      }))
                    }
                    className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#47010d] mb-1">
                    តម្លៃលំនាំដើមតាមមុខវិជ្ជា (USD)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={draftConfig.defaultSubjectPriceUsd ?? 5}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        defaultSubjectPriceUsd: Number(e.target.value) || 5,
                      }))
                    }
                    className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#47010d] mb-1">
                    ឈ្មោះគណនី ABA (បម្រុង)
                  </label>
                  <input
                    type="text"
                    value={draftConfig.abaAccountName}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        abaAccountName: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#47010d] mb-1">
                    លេខគណនី ABA (បម្រុង)
                  </label>
                  <input
                    type="text"
                    value={draftConfig.abaAccountNumber}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        abaAccountNumber: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>
              </div>

              {/* Free Trial Settings */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ffd3d2]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(draftConfig.trialEnabled)}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        trialEnabled: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#0097a8]"
                  />
                  <span className="text-xs font-bold text-[#160002]">
                    អនុញ្ញាតឱ្យសាកល្បងប្រើឥតគិតថ្លៃ (Free Trial)
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#47010d]">
                    រយៈពេលសាកល្បង (ថ្ងៃ)៖
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={draftConfig.trialDays ?? 7}
                    onChange={(e) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        trialDays: Number(e.target.value) || 7,
                      }))
                    }
                    className="w-20 rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Feature Permissions */}
            <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#160002]">
                កំណត់សិទ្ធិមុខងារប្រើប្រាស់ (Feature Permissions)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FEATURE_LABELS.map((feat) => {
                  const val = draftConfig.featureAccess?.[feat.id] || "free";
                  return (
                    <div
                      key={feat.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[#ffd3d2] bg-[#fffafa] p-3"
                    >
                      <span className="text-xs font-bold text-[#160002]">
                        {feat.labelKh}
                      </span>
                      <select
                        value={val}
                        onChange={(e) =>
                          setDraftConfig((prev) => ({
                            ...prev,
                            featureAccess: {
                              ...prev.featureAccess,
                              [feat.id]: e.target.value,
                            },
                          }))
                        }
                        className="rounded-lg border border-[#fdbcbc] bg-white px-2.5 py-1 text-xs font-bold text-[#160002]"
                      >
                        <option value="free">សេរី (Free)</option>
                        <option value="pro">បង់ប្រាក់ (Pro)</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subject / Book Permissions */}
            <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#160002]">
                កំណត់សិទ្ធិមាតិកាសៀវភៅ ({subjects.length} មុខវិជ្ជា)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjects.map((subj) => {
                  const val = draftConfig.subjectAccess?.[subj.id] || "free";
                  const priceVal =
                    draftConfig.subjectPrices?.[subj.id] ??
                    draftConfig.defaultSubjectPriceUsd ??
                    5;
                  return (
                    <div
                      key={subj.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[#ffd3d2] bg-[#fffafa] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#160002] truncate">
                          {subj.nameKh}
                        </div>
                        <div className="text-[11px] text-[#620116] truncate">
                          {subj.nameEn}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center rounded-lg border border-[#fdbcbc] bg-white px-2 py-1">
                          <span className="text-[11px] font-bold text-[#7e021f] mr-1">$</span>
                          <input
                            type="number"
                            min={1}
                            value={priceVal}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                subjectPrices: {
                                  ...prev.subjectPrices,
                                  [subj.id]: Number(e.target.value) || 5,
                                },
                              }))
                            }
                            className="w-11 text-xs font-bold text-[#160002] focus:outline-none"
                            title="តម្លៃមុខវិជ្ជានេះ (USD)"
                          />
                        </div>
                        <select
                          value={val}
                          onChange={(e) =>
                            setDraftConfig((prev) => ({
                              ...prev,
                              subjectAccess: {
                                ...prev.subjectAccess,
                                [subj.id]: e.target.value,
                              },
                            }))
                          }
                          className="rounded-lg border border-[#fdbcbc] bg-white px-2 py-1 text-xs font-bold text-[#160002]"
                        >
                          <option value="free">សេរី</option>
                          <option value="pro">បង់ប្រាក់</option>
                          <option value="hidden">លាក់</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveConfig}
                className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>រក្សាទុកការកំណត់សិទ្ធិ</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#160002]">
                បញ្ជីអ្នកប្រើប្រាស់ ({usersList.length})
              </h2>
              <button
                type="button"
                onClick={loadAdminLists}
                className="rounded-lg border border-[#fdbcbc] px-3 py-1.5 text-xs font-bold text-[#7e021f] hover:bg-[#ffe9e8]"
              >
                ផ្ទុកឡើងវិញ
              </button>
            </div>

            {loadingLists ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#db073d] mx-auto" />
              </div>
            ) : usersList.length === 0 ? (
              <p className="text-xs text-[#620116] py-6 text-center">
                មិនទាន់មានទិន្នន័យអ្នកប្រើប្រាស់នៅឡើយទេ។
              </p>
            ) : (
              <div className="space-y-2.5">
                {usersList.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ffd3d2] bg-[#fffafa] p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#160002]">
                        {u.name || "Google User"}
                      </div>
                      <div className="text-xs text-[#620116]">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                          u.plan === "pro"
                            ? "bg-[#009b5e] text-white"
                            : "bg-[#ffe9e8] text-[#7e021f]"
                        }`}
                      >
                        {u.plan || "free"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleUserPlan(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#fdbcbc] bg-white px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8]"
                      >
                        <Crown className="h-3.5 w-3.5 text-[#db073d]" />
                        {u.plan === "pro" ? "ដាក់ជា Free" : "ដំឡើងជា Pro"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#160002]">
                សំណើបង់ប្រាក់ ABA ({paymentsList.length})
              </h2>
              <button
                type="button"
                onClick={loadAdminLists}
                className="rounded-lg border border-[#fdbcbc] px-3 py-1.5 text-xs font-bold text-[#7e021f] hover:bg-[#ffe9e8]"
              >
                ផ្ទុកឡើងវិញ
              </button>
            </div>

            {loadingLists ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#db073d] mx-auto" />
              </div>
            ) : paymentsList.length === 0 ? (
              <p className="text-xs text-[#620116] py-6 text-center">
                មិនទាន់មានសំណើបង់ប្រាក់ ABA នៅឡើយទេ។
              </p>
            ) : (
              <div className="space-y-2.5">
                {paymentsList.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ffd3d2] bg-[#fffafa] p-3.5"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-[#160002]">
                        {p.name} ({p.email})
                      </div>
                      <div className="text-xs text-[#620116]">
                        លេខយោង ABA: <strong className="font-mono">{p.abaReference}</strong> • ចំនួន:{" "}
                        <strong className="text-[#db073d]">${p.amountUsd}</strong>
                      </div>
                    </div>
                    {p.status === "approved" ? (
                      <span className="rounded-full bg-[#009b5e] px-3 py-1 text-xs font-bold text-white">
                        បានអនុម័ត ✓
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApprovePayment(p)}
                        className="rounded-xl bg-[#009b5e] px-3.5 py-2 text-xs font-bold text-white hover:opacity-95"
                      >
                        អនុម័ត Pro
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer maxWidthClass="max-w-6xl" />
    </div>
  );
}
