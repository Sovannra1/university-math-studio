"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    signInWithGoogleCredential,
    signInWithDemo,
  } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isLoginModalOpen || !GOOGLE_CLIENT_ID) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              signInWithGoogleCredential(response.credential);
            }
          },
        });
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "signin_with",
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
  }, [isLoginModalOpen, signInWithGoogleCredential]);

  if (!isLoginModalOpen) return null;

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    signInWithDemo({ name, email });
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
            ការចូលគណនីជួយរក្សាទុកឈ្មោះពេលបញ្ចេញមតិ និងត្រៀមសម្រាប់មុខងារពិសេសនាពេលអនាគត។
          </span>
        </div>

        {GOOGLE_CLIENT_ID ? (
          <div className="mt-5 flex flex-col items-center gap-3">
            <div ref={googleBtnRef} />
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#47010d] mb-1">
                ឈ្មោះគណនី Google (សម្រាប់សាកល្បង)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឧទាហរណ៍៖ សុខ ដារ៉ា"
                className="w-full rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3.5 py-2 text-sm text-[#160002] outline-none focus:border-[#db073d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#47010d] mb-1">
                អ៊ីមែល Google (Gmail)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3.5 py-2 text-sm text-[#160002] outline-none focus:border-[#db073d]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#ffd3d2] bg-white px-4 py-2.5 text-sm font-bold text-[#160002] shadow-xs transition-all duration-150 hover:bg-[#ffe9e8] hover:border-[#fdbcbc] active:scale-[0.98]"
            >
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
              <span>បន្តជាមួយគណនី Google</span>
            </button>

            <p className="flex items-center gap-1.5 pt-1 text-[11px] text-[#620116]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0097a8]" />
              <span>
                ដើម្បីភ្ជាប់ Google OAuth ពិតប្រាកដ សូមដាក់{" "}
                <code className="rounded bg-[#ffe9e8] px-1 py-0.5 text-[10px]">
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID
                </code>{" "}
                ក្នុង <code className="rounded bg-[#ffe9e8] px-1 py-0.5 text-[10px]">.env.local</code>
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
