"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sigma,
  Grid3X3,
  Orbit,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Bookmark,
  Binary,
  GitBranch,
  Activity,
  BarChart3,
  Hash,
  Boxes,
  Compass,
  Calculator,
  Shapes,
  Waves,
  Layers,
  X,
  Clock,
} from "lucide-react";
import { APP_VERSION } from "@/lib/appConfig";
import AuthButton from "@/components/auth/AuthButton";
import Footer from "@/components/layout/Footer";

const SUBJECT_THEMES = {
  "logic-proofs": {
    icon: Binary,
    symbol: "∀",
    spineBg: "from-[#7e021f] via-[#9c0329] to-[#620116]",
    coverTint: "from-white via-[#fffafa] to-[#fff0f0]",
    badgeBg: "bg-[#ffe9e8] text-[#9c0329] border-[#fdbcbc]",
    iconBg: "bg-[#9c0329] text-white",
    accentBorder: "border-[#f3b6b5]",
    ribbonColor: "text-[#9c0329]",
  },
  calculus: {
    icon: TrendingUp,
    symbol: "∫",
    spineBg: "from-[#b80431] via-[#db073d] to-[#8a0224]",
    coverTint: "from-white via-[#fffafa] to-[#fff1f1]",
    badgeBg: "bg-[#ffe9e8] text-[#9c0329] border-[#fdbcbc]",
    iconBg: "bg-[#db073d] text-white",
    accentBorder: "border-[#f3b6b5]",
    ribbonColor: "text-[#db073d]",
  },
  "linear-algebra": {
    icon: Grid3X3,
    symbol: "[A]",
    spineBg: "from-[#006bb3] via-[#0085dd] to-[#004f85]",
    coverTint: "from-white via-[#f8fbff] to-[#ebf4fd]",
    badgeBg: "bg-[#e8f4fd] text-[#005c9e] border-[#b6dcf8]",
    iconBg: "bg-[#0085dd] text-white",
    accentBorder: "border-[#abd4f4]",
    ribbonColor: "text-[#0085dd]",
  },
  "discrete-math": {
    icon: GitBranch,
    symbol: "G",
    spineBg: "from-[#007a88] via-[#0097a8] to-[#005863]",
    coverTint: "from-white via-[#f7fdfe] to-[#eaf8fa]",
    badgeBg: "bg-[#e6f7f9] text-[#006b78] border-[#b2e4ea]",
    iconBg: "bg-[#0097a8] text-white",
    accentBorder: "border-[#a6dde4]",
    ribbonColor: "text-[#0097a8]",
  },
  ode: {
    icon: Activity,
    symbol: "y′",
    spineBg: "from-[#9a4a00] via-[#b95a00] to-[#753800]",
    coverTint: "from-white via-[#fffcf8] to-[#fdf3e7]",
    badgeBg: "bg-[#fdf3e7] text-[#8a4300] border-[#f2d0a9]",
    iconBg: "bg-[#b95a00] text-white",
    accentBorder: "border-[#ecc69b]",
    ribbonColor: "text-[#b95a00]",
  },
  "probability-statistics": {
    icon: BarChart3,
    symbol: "P",
    spineBg: "from-[#007d4b] via-[#009b5e] to-[#005936]",
    coverTint: "from-white via-[#f7fdf9] to-[#e9f8f1]",
    badgeBg: "bg-[#e7f7f0] text-[#006e42] border-[#b3e6d1]",
    iconBg: "bg-[#009b5e] text-white",
    accentBorder: "border-[#a8e0c8]",
    ribbonColor: "text-[#009b5e]",
  },
  "number-theory": {
    icon: Hash,
    symbol: "≡",
    spineBg: "from-[#5d3fd3] via-[#7052e6] to-[#442ba8]",
    coverTint: "from-white via-[#faf9ff] to-[#f1edfd]",
    badgeBg: "bg-[#f1edfd] text-[#4c32b8] border-[#d3c7f8]",
    iconBg: "bg-[#6546dc] text-white",
    accentBorder: "border-[#cdc0f6]",
    ribbonColor: "text-[#6546dc]",
  },
  "real-analysis": {
    icon: Sigma,
    symbol: "∑",
    spineBg: "from-[#007a88] via-[#0097a8] to-[#005863]",
    coverTint: "from-white via-[#f7fdfe] to-[#eaf8fa]",
    badgeBg: "bg-[#e6f7f9] text-[#006b78] border-[#b2e4ea]",
    iconBg: "bg-[#0097a8] text-white",
    accentBorder: "border-[#a6dde4]",
    ribbonColor: "text-[#0097a8]",
  },
  "abstract-algebra": {
    icon: Boxes,
    symbol: "∘",
    spineBg: "from-[#006bb3] via-[#0085dd] to-[#004f85]",
    coverTint: "from-white via-[#f8fbff] to-[#ebf4fd]",
    badgeBg: "bg-[#e8f4fd] text-[#005c9e] border-[#b6dcf8]",
    iconBg: "bg-[#0085dd] text-white",
    accentBorder: "border-[#abd4f4]",
    ribbonColor: "text-[#0085dd]",
  },
  "complex-analysis": {
    icon: Compass,
    symbol: "∮",
    spineBg: "from-[#b80431] via-[#db073d] to-[#8a0224]",
    coverTint: "from-white via-[#fffafa] to-[#fff1f1]",
    badgeBg: "bg-[#ffe9e8] text-[#9c0329] border-[#fdbcbc]",
    iconBg: "bg-[#db073d] text-white",
    accentBorder: "border-[#f3b6b5]",
    ribbonColor: "text-[#db073d]",
  },
  "numerical-analysis": {
    icon: Calculator,
    symbol: "≈",
    spineBg: "from-[#9a4a00] via-[#b95a00] to-[#753800]",
    coverTint: "from-white via-[#fffcf8] to-[#fdf3e7]",
    badgeBg: "bg-[#fdf3e7] text-[#8a4300] border-[#f2d0a9]",
    iconBg: "bg-[#b95a00] text-white",
    accentBorder: "border-[#ecc69b]",
    ribbonColor: "text-[#b95a00]",
  },
  topology: {
    icon: Orbit,
    symbol: "◯",
    spineBg: "from-[#007d4b] via-[#009b5e] to-[#005936]",
    coverTint: "from-white via-[#f7fdf9] to-[#e9f8f1]",
    badgeBg: "bg-[#e7f7f0] text-[#006e42] border-[#b3e6d1]",
    iconBg: "bg-[#009b5e] text-white",
    accentBorder: "border-[#a8e0c8]",
    ribbonColor: "text-[#009b5e]",
  },
  "differential-geometry": {
    icon: Shapes,
    symbol: "κ",
    spineBg: "from-[#5d3fd3] via-[#7052e6] to-[#442ba8]",
    coverTint: "from-white via-[#faf9ff] to-[#f1edfd]",
    badgeBg: "bg-[#f1edfd] text-[#4c32b8] border-[#d3c7f8]",
    iconBg: "bg-[#6546dc] text-white",
    accentBorder: "border-[#cdc0f6]",
    ribbonColor: "text-[#6546dc]",
  },
  pde: {
    icon: Waves,
    symbol: "∂",
    spineBg: "from-[#006bb3] via-[#0085dd] to-[#004f85]",
    coverTint: "from-white via-[#f8fbff] to-[#ebf4fd]",
    badgeBg: "bg-[#e8f4fd] text-[#005c9e] border-[#b6dcf8]",
    iconBg: "bg-[#0085dd] text-white",
    accentBorder: "border-[#abd4f4]",
    ribbonColor: "text-[#0085dd]",
  },
  "functional-analysis": {
    icon: Layers,
    symbol: "‖·‖",
    spineBg: "from-[#7e021f] via-[#9c0329] to-[#620116]",
    coverTint: "from-white via-[#fffafa] to-[#fff0f0]",
    badgeBg: "bg-[#ffe9e8] text-[#9c0329] border-[#fdbcbc]",
    iconBg: "bg-[#9c0329] text-white",
    accentBorder: "border-[#f3b6b5]",
    ribbonColor: "text-[#9c0329]",
  },
};

function groupSubjectsByLevel(subjects) {
  const groups = [];
  let bookIndex = 0;
  subjects.forEach((subject) => {
    bookIndex += 1;
    const item = { ...subject, bookNumber: bookIndex };
    const key = subject.levelKh || "__default__";
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.subjects.push(item);
    } else {
      groups.push({ key, levelKh: subject.levelKh || null, subjects: [item] });
    }
  });
  return groups;
}

export default function SubjectHub({ subjects = [] }) {
  const levelGroups = groupSubjectsByLevel(subjects);
  const [upcomingSubject, setUpcomingSubject] = useState(null);
  const [isTearing, setIsTearing] = useState(false);

  const handleClosePopup = () => {
    if (isTearing) return;
    setIsTearing(true);
    setTimeout(() => {
      setUpcomingSubject(null);
      setIsTearing(false);
    }, 420);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 border-b border-[#ffd3d2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#db073d] text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#160002] leading-snug">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </h1>
              <p className="text-xs font-semibold text-[#7e021f]">
                University Math Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1 text-xs font-bold text-[#9c0329]">
              <Sparkles className="h-3.5 w-3.5 text-[#db073d]" />
              បណ្ណាល័យសៀវភៅ ({subjects.length} មុខវិជ្ជា)
            </span>
            <AuthButton />
            <span className="rounded-full border border-[#ffd3d2] bg-white px-2.5 py-1 text-xs font-bold text-[#620116]">
              {APP_VERSION}
            </span>
          </div>
        </div>
      </header>

      {/* Main Bookshelf Hub */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 max-w-3xl animate-obj-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#160002] leading-snug khmer-prose">
            ធ្នើរសៀវភៅគណិតវិទ្យាតាមលំដាប់ចំណេះដឹង
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#47010d] khmer-prose">
            រៀបចំតាមលំដាប់លំដោយពីឆ្នាំទី ១ ដល់ ឆ្នាំទី ៤ ដើម្បីឱ្យនិស្សិតសិក្សាពីគ្រឹះទៅកម្រិតខ្ពស់។
            ចុចលើក្របសៀវភៅណាមួយ ដើម្បីបើកអានមេរៀន។
          </p>
        </div>

        {/* Bookshelf Levels */}
        <div className="space-y-10">
          {levelGroups.map((group, groupIdx) => (
            <section key={group.key} className="space-y-4">
              {group.levelKh && (
                <div className="flex items-center gap-3 border-b border-[#ffd3d2] pb-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#db073d] text-xs font-bold text-white shadow-2xs">
                    {groupIdx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#7e021f]">
                    {group.levelKh}
                  </h3>
                </div>
              )}

              {/* Book Covers Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.subjects.map((subject, idx) => {
                  const theme = SUBJECT_THEMES[subject.id] || {
                    icon: BookOpen,
                    symbol: "π",
                    spineBg: "from-[#b80431] via-[#db073d] to-[#8a0224]",
                    coverTint: "from-white via-[#fffafa] to-[#fff1f1]",
                    badgeBg: "bg-[#ffe9e8] text-[#9c0329] border-[#fdbcbc]",
                    iconBg: "bg-[#db073d] text-white",
                    accentBorder: "border-[#f3b6b5]",
                    ribbonColor: "text-[#db073d]",
                  };
                  const Icon = theme.icon;
                  const lessons = subject.lessons || [];
                  const availableCount = lessons.filter((l) => l.isAvailable).length;
                  const hasContent = availableCount > 0;

                  const hasLessons = lessons.length > 0;
                  const cardInner = (
                    <>
                      {/* Layered Paper Page Edges */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-2 translate-y-2 rounded-r-2xl rounded-l-md border border-[#e6d5d5] bg-[#f7efef] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2.5 group-hover:translate-y-2.5"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-2xl rounded-l-md border border-[#efe2e2] bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:translate-y-1.5"
                      />

                      {/* Hardcover Book Surface */}
                      <div
                        className={`relative flex min-h-[305px] w-full overflow-hidden rounded-r-2xl rounded-l-md border ${theme.accentBorder} bg-gradient-to-br ${theme.coverTint} shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-xl group-active:scale-[0.98]`}
                      >
                        {/* Hardcover Left Spine */}
                        <div
                          className={`relative flex w-5 shrink-0 flex-col items-center justify-between bg-gradient-to-b ${theme.spineBg} py-4 shadow-inner`}
                        >
                          <span className="h-0.5 w-full bg-white/30" />
                          <span className="h-0.5 w-full bg-black/15" />
                        </div>

                        {/* Subtle Spine Crease */}
                        <div
                          aria-hidden="true"
                          className="w-1 shrink-0 bg-gradient-to-r from-black/10 to-transparent"
                        />

                        {/* Book Cover Front */}
                        <div className="relative flex flex-1 flex-col justify-between p-4 sm:p-5 text-left">
                          {hasContent && (
                            <div className="absolute right-3.5 -top-0.5">
                              <Bookmark
                                className={`h-6 w-6 fill-current ${theme.ribbonColor} drop-shadow-xs`}
                              />
                            </div>
                          )}

                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 bottom-14 select-none font-serif text-6xl font-bold text-[#160002]/[0.04] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                          >
                            {theme.symbol}
                          </span>

                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#620116]">
                              សៀវភៅទី {subject.bookNumber}
                            </div>

                            <div className="mt-3 flex items-center gap-2.5">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-250 group-hover:scale-110 group-hover:-rotate-3 ${theme.iconBg}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${theme.badgeBg}`}
                              >
                                {lessons.length > 0
                                  ? `${lessons.length} មេរៀន`
                                  : "កំពុងរៀបចំ"}
                              </span>
                            </div>

                            {/* Book Title Plate */}
                            <div className="mt-4 border-t border-b border-[#160002]/10 py-3">
                              <h4 className="text-base font-bold text-[#160002] leading-snug group-hover:text-[#9c0329] transition-colors">
                                {subject.nameKh}
                              </h4>
                              <div className="mt-0.5 text-[11px] font-bold tracking-wide text-[#7e021f]">
                                {subject.nameEn}
                              </div>
                            </div>

                            <p className="mt-2.5 text-xs text-[#47010d] leading-relaxed khmer-prose line-clamp-3">
                              {subject.descriptionKh}
                            </p>
                          </div>

                          {/* Bottom Open Book Action */}
                          <div className="mt-4 flex items-center justify-between pt-2 text-xs font-bold">
                            <span className="text-[#620116] font-semibold">
                              {hasContent ? "មានមេរៀនរួចរាល់" : "នឹងមកដល់ឆាប់ៗ"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[#db073d] transition-transform duration-200 group-hover:translate-x-1">
                              <span>{hasLessons ? "បើកសៀវភៅ" : "មើលព័ត៌មាន"}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );

                  if (!hasLessons) {
                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => setUpcomingSubject({ ...subject, theme })}
                        style={{ animationDelay: `${Math.min(idx * 55, 220)}ms` }}
                        className="group relative block w-full animate-obj-up focus:outline-none cursor-pointer"
                      >
                        {cardInner}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={subject.id}
                      href={`/?subject=${encodeURIComponent(subject.id)}`}
                      prefetch={true}
                      style={{ animationDelay: `${Math.min(idx * 55, 220)}ms` }}
                      className="group relative block animate-obj-up focus:outline-none"
                    >
                      {cardInner}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Upcoming Subject Pop-up with Paper-Tear Close Animation */}
      {upcomingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={handleClosePopup}
            className={`fixed inset-0 bg-[#160002]/50 backdrop-blur-xs transition-opacity duration-300 ${
              isTearing ? "opacity-0" : "animate-fade-fast"
            }`}
          />

          {!isTearing ? (
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#ffd3d2] bg-white p-6 shadow-2xl animate-modal-pop">
              <button
                type="button"
                onClick={handleClosePopup}
                aria-label="បិទផ្ទាំង"
                className="absolute right-4 top-4 rounded-lg p-1.5 text-[#620116] hover:bg-[#ffe9e8] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${upcomingSubject.theme.iconBg}`}
                >
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-flex rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-2.5 py-0.5 text-[11px] font-bold text-[#9c0329]">
                    កំពុងរៀបចំខ្លឹមសារ
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-[#160002]">
                    {upcomingSubject.nameKh}
                  </h3>
                </div>
              </div>

              <div className="mt-3 text-xs font-bold text-[#7e021f]">
                {upcomingSubject.nameEn} • {upcomingSubject.levelKh}
              </div>

              <p className="mt-3 rounded-xl border border-[#ffe9e8] bg-[#fffafa] p-3.5 text-sm text-[#47010d] leading-relaxed khmer-prose">
                {upcomingSubject.descriptionKh}
              </p>

              <p className="mt-3 text-xs text-[#620116] leading-relaxed">
                សៀវភៅមុខវិជ្ជានេះមិនទាន់មានមេរៀនលម្អិតនៅឡើយទេ។ ក្រុមការងារកំពុងរៀបចំស្លាយបង្រៀន
                ក្រាបអន្តរកម្ម និងលំហាត់គំរូ ដើម្បីដាក់ជូនសិក្សាក្នុងពេលឆាប់ៗនេះ។
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#bb0533] active:scale-95"
                >
                  <span>បិទផ្ទាំងនេះ</span>
                </button>
              </div>
            </div>
          ) : (
            /* Paper-Tear Split Animation (Left & Right Halves Ripping Apart) */
            <div className="relative z-10 flex w-full max-w-md pointer-events-none select-none">
              <div
                className="w-1/2 overflow-hidden rounded-l-2xl border-y border-l border-[#ffd3d2] bg-white p-6 shadow-xl animate-paper-tear-left"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 94% 12%, 100% 24%, 92% 38%, 100% 52%, 93% 66%, 100% 80%, 94% 92%, 100% 100%, 0 100%)",
                }}
              >
                <div className="h-44 flex flex-col justify-between">
                  <div className="h-6 w-28 rounded bg-[#ffe9e8]" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-[#fff1f1]" />
                    <div className="h-4 w-5/6 rounded bg-[#fff1f1]" />
                    <div className="h-4 w-2/3 rounded bg-[#fff1f1]" />
                  </div>
                </div>
              </div>
              <div
                className="w-1/2 overflow-hidden rounded-r-2xl border-y border-r border-[#ffd3d2] bg-white p-6 shadow-xl animate-paper-tear-right"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 0 100%, 6% 92%, 0 80%, 7% 66%, 0 52%, 8% 38%, 0 24%, 6% 12%)",
                }}
              >
                <div className="h-44 flex flex-col justify-between items-end">
                  <div className="h-6 w-20 rounded bg-[#ffe9e8]" />
                  <div className="h-9 w-24 rounded-xl bg-[#db073d]/20" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clean Footer */}
      <Footer maxWidthClass="max-w-7xl" />
    </div>
  );
}
