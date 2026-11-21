"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Presentation,
  TrendingUp,
  Trophy,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Footer from "@/components/layout/Footer";

const BENEFITS = [
  {
    icon: BookOpen,
    color: "bg-[#db073d] text-white",
    title: "សៀវភៅ ១៥ មុខវិជ្ជាសាកលវិទ្យាល័យ",
    desc: "រៀបចំតាមលំដាប់ពីឆ្នាំទី ១ ដល់ឆ្នាំទី ៤ ជាភាសាខ្មែរច្បាស់លាស់ មានរូបមន្ត LaTeX ស្តង់ដារ។",
  },
  {
    icon: Presentation,
    color: "bg-[#0085dd] text-white",
    title: "ស្លាយបង្រៀន + សរសេរ និងនាំចេញ PDF",
    desc: "អាចសរសេរគូសចំណាំលើស្លាយ (គាំទ្រកម្រាស់ និងសម្ពាធប៊ិច) រួចនាំចេញជា PDF បានភ្លាមៗ។",
  },
  {
    icon: TrendingUp,
    color: "bg-[#0097a8] text-white",
    title: "ក្រាហ្វអន្តរកម្មមានជីវិត (Interactive Graphs)",
    desc: "សាកល្បងអូស Slider មើលលីមីត ដេរីវេ និងការបំប្លែងក្រាបដោយផ្ទាល់លើអេក្រង់។",
  },
  {
    icon: Trophy,
    color: "bg-[#009b5e] text-white",
    title: "ឯកសារអានលម្អិត និងលំហាត់ស៊ីជម្រៅ",
    desc: "មានលំហាត់គំរូតាមជំហាន លំហាត់អនុវត្តន៍ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ និងលំហាត់សំយោគបញ្ចប់មេរៀន។",
  },
];

export default function WelcomeAuthGate({ children }) {
  const { isLoggedIn, authLoading, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffafa] gap-3 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#db073d] text-white shadow-md animate-pulse">
          <GraduationCap className="h-7 w-7" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#7e021f]">
          <Loader2 className="h-4 w-4 animate-spin text-[#db073d]" />
          <span>កំពុងផ្ទៀងផ្ទាត់គណនី...</span>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <>{children}</>;
  }

  const handleSignIn = async () => {
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
          "Domain នេះមិនទាន់ត្រូវបានអនុញ្ញាតក្នុង Firebase Authentication → Authorized domains នៅឡើយទេ។"
        );
      } else {
        setErrorMsg("មិនអាចចូលគណនី Google បានទេ។ សូមព្យាយាមម្តងទៀត។");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa]">
      {/* Minimal Top Bar */}
      <header className="border-b border-[#ffd3d2] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#160002] leading-tight">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </div>
              <div className="text-[11px] font-semibold text-[#7e021f]">
                KHMER-TEX • University Math Studio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/about"
              className="rounded-xl border border-[#ffd3d2] bg-white px-3 py-1.5 text-xs font-bold text-[#7e021f] hover:bg-[#ffe9e8] transition"
            >
              អំពីយើង
            </Link>
          </div>
        </div>
      </header>

      {/* Main Welcome & Google Sign-In Gate */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: About & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1 text-xs font-bold text-[#9c0329]">
                <Sparkles className="h-3.5 w-3.5 text-[#db073d]" />
                វេទិកាសិក្សាគណិតវិទ្យាអន្តរកម្មសម្រាប់និស្សិត និងគ្រូបង្រៀន
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#160002] leading-snug khmer-prose">
                រៀន និងបង្រៀនគណិតវិទ្យាសាកលវិទ្យាល័យ ឱ្យកាន់តែងាយយល់ និងមានជីវិត
              </h1>
              <p className="text-sm sm:text-base text-[#47010d] leading-relaxed khmer-prose">
                <strong>KHMER-TEX — University Math Studio</strong> រួមបញ្ចូលស្លាយបង្រៀន ក្រាហ្វអន្តរកម្ម ឯកសារអានលម្អិត និងលំហាត់គិតស៊ីជម្រៅ ដើម្បីជួយនិស្សិតខ្មែរស្ទាត់ជំនាញពីកម្រិតគ្រឹះរហូតដល់កម្រិតខ្ពស់។
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {BENEFITS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#ffd3d2] bg-white p-4 shadow-xs space-y-2"
                  >
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs ${item.color}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-sm font-bold text-[#160002] khmer-prose">
                      {item.title}
                    </h2>
                    <p className="text-xs text-[#47010d] leading-relaxed khmer-prose">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sign-In Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#fdbcbc] bg-white p-6 sm:p-8 shadow-lg space-y-5">
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe9e8] text-[#db073d] border border-[#fdbcbc]">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-[#160002]">
                  ចូលប្រើប្រាស់ប្រព័ន្ធសិក្សា
                </h2>
                <p className="text-xs sm:text-sm text-[#620116]">
                  សូមចូលគណនី Google របស់អ្នក ដើម្បីបើកធ្នើរសៀវភៅ និងមេរៀនទាំងអស់
                </p>
              </div>

              <div className="rounded-2xl border border-[#b3e6d1] bg-[#e7f7f0]/75 p-3.5 text-xs text-[#005936] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#009b5e]" />
                  <span>បើកឱ្យប្រើប្រាស់ដោយសេរី (Free Launch)</span>
                </div>
                <p className="leading-relaxed">
                  បច្ចុប្បន្នមេរៀន និងមុខងារទាំងអស់បើកឱ្យសិក្សាដោយឥតគិតថ្លៃ។ គណនី Google ជួយរក្សាទុកសិទ្ធិប្រើប្រាស់ និងការចូលរួមសួរ-ឆ្លើយមេរៀនរបស់អ្នក។
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] p-3 text-xs font-medium text-[#9c0329]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={handleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#fdbcbc] bg-[#db073d] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-150 hover:bg-[#bb0533] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
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
                  </span>
                )}
                <span>ចូលប្រើប្រាស់ដោយគណនី Google</span>
              </button>

              <p className="text-center text-[11px] text-[#620116] leading-relaxed">
                ដោយការចូលប្រើប្រាស់ អ្នកយល់ព្រមតាម{" "}
                <Link href="/privacy" className="font-bold text-[#db073d] hover:underline">
                  គោលការណ៍ឯកជនភាព
                </Link>{" "}
                របស់យើង។ មានបញ្ហាបច្ចេកទេស?{" "}
                <a
                  href="https://t.me/sovannra1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0085dd] hover:underline"
                >
                  ទាក់ទង Telegram @sovannra1
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer maxWidthClass="max-w-6xl" />
    </div>
  );
}
