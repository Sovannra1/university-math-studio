"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-2.5 py-1.5 text-xs font-bold text-[#7e021f] transition-all duration-150 hover:border-[#fdbcbc] hover:bg-[#ffe9e8] active:scale-95"
      title={isDark ? "ប្តូរទៅផ្ទៃភ្លឺ (Light Mode)" : "ប្តូរទៅផ្ទៃងងឹត (Dark Mode)"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-[#f59e0b]" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-[#db073d]" />
      )}
      <span className="hidden md:inline">{isDark ? "ភ្លឺ" : "ងងឹត"}</span>
    </button>
  );
}
