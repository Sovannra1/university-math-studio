"use client";

import React from "react";
import Link from "next/link";
import { Menu, BookMarked, LayoutGrid, GraduationCap, ShieldCheck, Sigma } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthContext";

export default function Header({
  subjectNameKh,
  subjectNameEn,
  lessonTitleKh,
  lessonTitleEn,
  onOpenMobileMenu,
  onOpenSymbols,
}) {
  const { isAdmin } = useAuth();
  return (
    <header className="fixed top-2 sm:top-3 inset-x-2 sm:inset-x-5 lg:inset-x-6 z-40 rounded-2xl ios-glass transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-2.5 py-2 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Fixed Brand Logo & Web App Name */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-bold text-[#160002] leading-tight group-hover:text-[#db073d] transition-colors">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#7e021f] leading-tight">
                University Math Studio
              </div>
            </div>
          </Link>

          <div className="hidden sm:block h-8 w-px shrink-0 bg-[#ffd3d2]" />

          {/* Lesson Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#db073d]">
              <BookMarked className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">
                {subjectNameKh} {subjectNameEn ? `(${subjectNameEn})` : ""}
              </span>
            </div>
            <h1 className="text-xs sm:text-lg font-bold text-[#160002] truncate khmer-prose">
              {lessonTitleKh || subjectNameKh || "សូមជ្រើសរើសមេរៀន"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenSymbols && (
            <button
              type="button"
              onClick={onOpenSymbols}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#7e021f] transition-all duration-150 hover:border-[#fdbcbc] hover:bg-[#ffe9e8] active:scale-95"
              title="និមិត្តសញ្ញាគណិតវិទ្យាប្រើក្នុងមុខវិជ្ជានេះ"
              aria-label="បើកតារាងនិមិត្តសញ្ញាគណិតវិទ្យា"
            >
              <Sigma className="h-3.5 w-3.5 text-[#db073d]" />
              <span className="hidden md:inline">និមិត្តសញ្ញា</span>
            </button>
          )}
          <ThemeToggle />
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] px-2.5 py-1.5 text-xs font-bold text-[#9c0329] hover:bg-[#ffd3d2] transition"
              title="ផ្ទាំងគ្រប់គ្រង Admin"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
          <AuthButton />
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#7e021f] transition-all duration-150 hover:border-[#fdbcbc] hover:bg-[#ffe9e8] active:scale-95"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[#db073d]" />
            <span className="hidden md:inline">ធ្នើរសៀវភៅ</span>
          </Link>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex items-center justify-center rounded-xl border border-[#fdbcbc] bg-[#fffafa] p-2 text-[#160002] hover:bg-[#ffe9e8] lg:hidden"
            aria-label="បើកមាតិកាសៀវភៅ"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
