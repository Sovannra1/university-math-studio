"use client";

import React from "react";
import Link from "next/link";
import { Menu, BookMarked, LayoutGrid } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";

export default function Header({
  subjectNameKh,
  subjectNameEn,
  lessonTitleKh,
  lessonTitleEn,
  onOpenMobileMenu,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ffd3d2] bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex items-center justify-center rounded-xl border border-[#fdbcbc] p-2 text-[#160002] hover:bg-[#ffe9e8] lg:hidden"
            aria-label="បើកម៉ឺនុយ"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-[#db073d]">
              <BookMarked className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {subjectNameKh} {subjectNameEn ? `(${subjectNameEn})` : ""}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#160002] truncate khmer-prose">
              {lessonTitleKh || subjectNameKh || "សូមជ្រើសរើសមេរៀន"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {lessonTitleEn && (
            <div className="hidden xl:block rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3.5 py-1 text-xs font-bold text-[#7e021f]">
              {lessonTitleEn}
            </div>
          )}
          <AuthButton />
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3 py-1.5 text-xs font-bold text-[#7e021f] transition-all duration-150 hover:border-[#fdbcbc] hover:bg-[#ffe9e8] active:scale-95"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[#db073d]" />
            <span className="hidden sm:inline">ធ្នើរសៀវភៅ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
