"use client";

import React from "react";
import Link from "next/link";
import { Menu, BookMarked, LayoutGrid, GraduationCap } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header({
  subjectNameKh,
  subjectNameEn,
  lessonTitleKh,
  lessonTitleEn,
  onOpenMobileMenu,
}) {
  return (
    <header className="sticky top-3 z-30 mx-3 sm:mx-5 lg:mx-6 mt-3 rounded-2xl border border-[#ffd3d2]/90 bg-white/88 backdrop-blur-xl shadow-[0_12px_32px_-12px_rgba(219,7,61,0.18)] transition-all">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Fixed Brand Logo & Web App Name */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
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
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#db073d]">
              <BookMarked className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {subjectNameKh} {subjectNameEn ? `(${subjectNameEn})` : ""}
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-bold text-[#160002] truncate khmer-prose">
              {lessonTitleKh || subjectNameKh || "សូមជ្រើសរើសមេរៀន"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {lessonTitleEn && (
            <div className="hidden 2xl:block rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1 text-xs font-bold text-[#7e021f]">
              {lessonTitleEn}
            </div>
          )}
          <ThemeToggle />
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
