"use client";

import React from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { APP_VERSION, BRAND_NAME } from "@/lib/appConfig";

export default function Footer({ maxWidthClass = "max-w-7xl" }) {
  return (
    <footer className="border-t border-[#ffd3d2] bg-white/85 dark:bg-[#1c1015]/95 px-4 py-4 text-xs text-[#620116] sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex ${maxWidthClass} flex-col items-center justify-between gap-3 sm:flex-row`}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          <span className="font-medium text-[#47010d]">
            គណិតវិទ្យាសាកលវិទ្យាល័យ • University Math Studio
          </span>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <Link
              href="/about"
              className="text-[#7e021f] hover:text-[#db073d] hover:underline transition-colors"
            >
              អំពីយើង
            </Link>
            <span className="text-[#fdbcbc]">•</span>
            <Link
              href="/privacy"
              className="text-[#7e021f] hover:text-[#db073d] hover:underline transition-colors"
            >
              គោលការណ៍ឯកជនភាព
            </Link>
            <span className="text-[#fdbcbc]">•</span>
            <a
              href="https://t.me/sovannra1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0085dd] hover:underline transition-colors"
            >
              <Send className="h-3 w-3" />
              <span>ជំនួយបច្ចេកទេស (@sovannra1)</span>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-bold text-[#160002]">
            អភិវឌ្ឍន៍ដោយ៖ {BRAND_NAME}
          </span>
          <span className="rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-2.5 py-0.5 text-[11px] font-bold text-[#9c0329]">
            ជំនាន់ {APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
