"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Crown,
  CheckCircle2,
  Loader2,
  CreditCard,
  AlertCircle,
  Sparkles,
  Clock,
  BookOpen,
  Send,
  Download,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthContext";
import { getSubjectPrice } from "@/lib/accessControl";

export default function UpgradeModal() {
  const {
    user,
    isUpgradeModalOpen,
    upgradeTarget,
    closeUpgradeModal,
    accessConfig,
    startFreeTrial,
  } = useAuth();

  const [purchaseType, setPurchaseType] = useState("subject"); // "subject" | "all-pro"
  const [loading, setLoading] = useState(false);
  const [abaRef, setAbaRef] = useState("");
  const [manualModeData, setManualModeData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isUpgradeModalOpen) {
      setPurchaseType(upgradeTarget?.subjectId ? "subject" : "all-pro");
      setManualModeData(null);
      setSubmitted(false);
      setTrialActivated(false);
      setErrorMsg("");
      setAbaRef("");
    }
  }, [isUpgradeModalOpen, upgradeTarget?.subjectId]);

  if (!isUpgradeModalOpen) return null;

  const subjectPrice = upgradeTarget?.subjectId
    ? getSubjectPrice(accessConfig, upgradeTarget.subjectId)
    : Number(accessConfig?.defaultSubjectPriceUsd ?? 5);
  const allProPrice = Number(accessConfig?.proPriceUsd ?? 15);
  const activeAmount =
    purchaseType === "subject" && upgradeTarget?.subjectId
      ? subjectPrice
      : allProPrice;

  const canStartTrial = accessConfig?.trialEnabled && !user?.trialUsed;

  const handleActivateTrial = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await startFreeTrial();
      setTrialActivated(true);
    } catch {
      setErrorMsg("មិនអាចបើកការសាកល្បងឥតគិតថ្លៃបានទេ។");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAbaPay = async () => {
    if (!user) return;
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/payway/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.id,
          email: user.email,
          name: user.name,
          amount: activeAmount,
          purchaseType,
          subjectId:
            purchaseType === "subject" ? upgradeTarget?.subjectId || null : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment init failed");

      if (data.configured && data.checkoutUrl && data.payload) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.checkoutUrl;
        Object.entries(data.payload).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        setManualModeData(data);
      }
    } catch (err) {
      setErrorMsg(err?.message || "មិនអាចភ្ជាប់ទៅ ABA PayWay បានទេ។");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitManualRef = async (e) => {
    e.preventDefault();
    if (!user || !abaRef.trim()) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await addDoc(collection(db, "paymentRequests"), {
        uid: user.id,
        name: user.name,
        email: user.email,
        purchaseType,
        subjectId:
          purchaseType === "subject" ? upgradeTarget?.subjectId || null : null,
        subjectNameKh:
          purchaseType === "subject" ? upgradeTarget?.subjectNameKh || "" : "Pro ទាំងអស់",
        amountUsd: activeAmount,
        tranId: manualModeData?.tranId || `MAN-${Date.now()}`,
        abaReference: abaRef.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setErrorMsg("មិនអាចផ្ញើសំណើបានទេ។ សូមពិនិត្យ Firestore Rules ឬអ៊ីនធឺណិត។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#160002]/55 backdrop-blur-xs animate-fade-fast"
        onClick={closeUpgradeModal}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-2xl animate-modal-pop space-y-4 my-auto">
        <button
          type="button"
          onClick={closeUpgradeModal}
          aria-label="បិទ"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#620116] hover:bg-[#ffe9e8] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffe9e8] text-[#db073d]">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#160002]">
              ដោះសោរមេរៀនតាម ABA PayWay
            </h3>
            <p className="text-xs text-[#620116]">
              ជ្រើសរើសទិញមុខវិជ្ជាជាក់លាក់ ឬ Pro ទាំងអស់
            </p>
          </div>
        </div>

        {/* Free Trial Option if enabled */}
        {canStartTrial && !trialActivated && !manualModeData && !submitted && (
          <div className="rounded-xl border border-[#0097a8]/35 bg-[#0097a8]/10 p-3.5 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#006b78]">
                <Clock className="h-3.5 w-3.5" />
                <span>សាកល្បងប្រើឥតគិតថ្លៃ {accessConfig.trialDays} ថ្ងៃ!</span>
              </div>
              <p className="text-[11px] text-[#160002]">
                អាចសាកល្បងអានមេរៀនទាំងអស់សិនមុនសម្រេចចិត្តទិញ។
              </p>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handleActivateTrial}
              className="shrink-0 rounded-xl bg-[#0097a8] px-3 py-2 text-xs font-bold text-white hover:opacity-95"
            >
              សាកល្បងឥឡូវ
            </button>
          </div>
        )}

        {trialActivated ? (
          <div className="rounded-xl border border-[#b3e6d1] bg-[#e7f7f0] p-4 text-center space-y-2">
            <Sparkles className="h-6 w-6 text-[#009b5e] mx-auto" />
            <div className="text-sm font-bold text-[#005936]">
              បានបើកការសាកល្បង {accessConfig.trialDays} ថ្ងៃជោគជ័យ!
            </div>
            <button
              type="button"
              onClick={closeUpgradeModal}
              className="rounded-xl bg-[#009b5e] px-4 py-2 text-xs font-bold text-white"
            >
              ចូលអានមេរៀនភ្លាម
            </button>
          </div>
        ) : (
          <>
            {/* Package Selector */}
            {!manualModeData && !submitted && (
              <div className="space-y-2">
                {upgradeTarget?.subjectId && (
                  <button
                    type="button"
                    onClick={() => setPurchaseType("subject")}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                      purchaseType === "subject"
                        ? "border-[#db073d] bg-[#ffe9e8]/70 ring-1 ring-[#db073d]"
                        : "border-[#ffd3d2] bg-[#fffafa]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="h-4 w-4 text-[#db073d] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#160002] truncate">
                          ទិញតែមុខវិជ្ជា៖ {upgradeTarget.subjectNameKh}
                        </div>
                        <div className="text-[11px] text-[#620116]">
                          បើកសិទ្ធិអានមុខវិជ្ជានេះជាអចិន្ត្រៃយ៍
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 font-bold text-sm text-[#db073d]">
                      ${subjectPrice}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPurchaseType("all-pro")}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                    purchaseType === "all-pro"
                      ? "border-[#db073d] bg-[#ffe9e8]/70 ring-1 ring-[#db073d]"
                      : "border-[#ffd3d2] bg-[#fffafa]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Crown className="h-4 w-4 text-[#db073d] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#160002]">
                        កញ្ចប់ Pro គ្រប់មុខវិជ្ជាទាំងអស់
                      </div>
                      <div className="text-[11px] text-[#620116]">
                        បើកសៀវភៅ និងមុខងារ Pro ទាំងអស់ក្នុង Web App
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 font-bold text-sm text-[#db073d]">
                    ${allProPrice}
                  </span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] p-3 text-xs font-medium text-[#9c0329]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div className="rounded-2xl border border-[#b3e6d1] bg-[#e7f7f0] p-5 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-[#009b5e] mx-auto" />
                <div className="text-base font-bold text-[#005936]">
                  កំពុងដំណើរការស្នើសុំទិញ និងផ្ទៀងផ្ទាត់ការបង់ប្រាក់
                </div>
                <p className="text-xs sm:text-sm text-[#005936] leading-relaxed">
                  ប្រព័ន្ធបានទទួលលេខយោង ABA របស់អ្នករួចរាល់ហើយ។ ការផ្ទៀងផ្ទាត់ និងបើកសិទ្ធិអាចចំណាយពេល{" "}
                  <strong>យ៉ាងយូរ ២៤ ម៉ោង</strong>។
                </p>
                <div className="pt-1">
                  <a
                    href="https://t.me/sovannra1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0085dd] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>ចង់បានឆាប់រហ័ស? ទាក់ទង Telegram @sovannra1</span>
                  </a>
                </div>
              </div>
            ) : manualModeData ? (
              <form onSubmit={handleSubmitManualRef} className="space-y-3">
                <div className="rounded-xl border border-[#0085dd]/30 bg-[#e8f4fd]/70 p-4 text-center space-y-3">
                  <div className="text-xs sm:text-sm font-bold text-[#005c9e]">
                    ស្កេន ABA QR ខាងក្រោមដើម្បីបង់ប្រាក់ (${activeAmount} USD)
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/aba-qr.png"
                    alt="ABA Mobile Payment QR"
                    className="mx-auto w-64 sm:w-72 max-w-full rounded-2xl border border-[#ffd3d2] bg-white p-1.5 shadow-sm"
                    style={{ imageRendering: "auto" }}
                  />
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href="/images/aba-qr.png"
                      download="ABA-QR-KHMER-TEX.png"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#0085dd]/35 bg-white px-3 py-1.5 text-xs font-bold text-[#005c9e] hover:bg-[#e8f4fd] transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>ទាញយករូប QR ច្បាស់</span>
                    </a>
                    <span className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#db073d] border border-[#ffd3d2]">
                      Ref: {manualModeData.tranId}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#160002] mb-1">
                    បញ្ចូលលេខយោងប្រតិបត្តិការ ABA (Transaction ID)៖
                  </label>
                  <input
                    type="text"
                    required
                    value={abaRef}
                    onChange={(e) => setAbaRef(e.target.value)}
                    placeholder="ឧ. 492817402"
                    className="w-full rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-3.5 py-2 text-sm font-mono focus:border-[#db073d] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !abaRef.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#009b5e] px-4 py-2.5 text-sm font-bold text-white hover:opacity-95 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>ផ្ញើបញ្ជាក់ការបង់ប្រាក់</span>
                </button>
              </form>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleStartAbaPay}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#db073d] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] transition disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                <span>បង្កើត QR / បង់ប្រាក់ ABA (${activeAmount})</span>
              </button>
            )}
          </>
        )}

        <div className="pt-2 border-t border-[#ffd3d2] text-center">
          <a
            href="https://t.me/sovannra1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0085dd] hover:underline"
          >
            <Send className="h-3.5 w-3.5" />
            <span>មានបញ្ហាបង់ប្រាក់ ឬបច្ចេកទេស? ទាក់ទង Telegram @sovannra1</span>
          </a>
        </div>
      </div>
    </div>
  );
}
