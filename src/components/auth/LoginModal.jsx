"use client";

import React, { useState } from "react";
import { X, LogIn, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isLoginModalOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setErrorMsg("អ្នកបានបិទផ្ទាំងចូលគណនី Google មុនពេលបញ្ចប់។");
      } else if (code === "auth/unauthorized-domain") {
        setErrorMsg(
          "Domain នេះមិនទាន់ត្រូវបានអនុញ្ញាតក្នុង Firebase Authentication → Settings → Authorized domains នៅឡើយទេ។"
        );
      } else {
        setErrorMsg("មិនអាចចូលគណនី Google បានទេ។ សូមព្យាយាមម្តងទៀត។");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#160002]/55 backdrop-blur-xs animate-fade-fast"
        onClick={closeLoginModal}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-2xl animate-modal-pop">
        <button
          type="button"
          onClick={closeLoginModal}
          aria-label="បិទ"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#620116] hover:bg-[#ffe9e8] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffe9e8] text-[#db073d]">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#160002]">
              ចូលប្រើប្រាស់ដោយគណនី Google
            </h3>
            <p className="text-xs text-[#620116]">
              Sign in with Google Account
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#b3e6d1] bg-[#e7f7f0]/70 p-3 text-xs text-[#005936] flex items-start gap-2">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#009b5e]" />
          <span>
            បច្ចុប្បន្នមេរៀន និងមុខងារទាំងអស់អាចប្រើប្រាស់បានដោយឥតគិតថ្លៃទាំងស្រុង។
            ការចូលគណនីជួយបង្ហាញឈ្មោះផ្លូវការរបស់អ្នកពេលបញ្ចេញមតិ និងរក្សាទុកសិទ្ធិប្រើប្រាស់។
          </span>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] p-3 text-xs font-medium text-[#9c0329]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#ffd3d2] bg-white px-4 py-3 text-sm font-bold text-[#160002] shadow-xs transition-all duration-150 hover:bg-[#ffe9e8] hover:border-[#fdbcbc] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#db073d]" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
            )}
            <span>
              {loading ? "កំពុងភ្ជាប់គណនី Google..." : "បន្តជាមួយគណនី Google"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
