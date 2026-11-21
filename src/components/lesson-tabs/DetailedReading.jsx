"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  BookOpenText,
  BookOpen,
  List,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Minus,
  Plus,
  Sun,
  Moon,
  FileText,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import MathText from "@/components/common/MathText";
import SlideGraph from "@/components/lesson-tabs/SlideGraph";

const DIFFICULTY_STYLES = {
  Easy: {
    label: "ងាយ (Easy)",
    classes: "bg-[#009b5e] text-white border-[#009b5e]",
  },
  Medium: {
    label: "មធ្យម (Medium)",
    classes: "bg-[#b95a00] text-white border-[#b95a00]",
  },
  Hard: {
    label: "លំបាក (Hard)",
    classes: "bg-[#db073d] text-white border-[#db073d]",
  },
};

const PAPER_THEMES = {
  white: {
    label: "ស",
    backdrop: "bg-[#f3eff0]",
    sheet: "bg-white text-[#160002] border-[#ece2e4]",
    topbar: "bg-white/95 border-[#ffd3d2]/80 text-[#160002]",
    muted: "text-[#620116]",
    theoremBox: "bg-[#fff7f8] border-[#db073d]",
    exampleBox: "bg-[#fcfafb] border-[#e8d5d8]",
    stepBg: "bg-white border-[#f0dfe2]",
    summaryBox: "bg-[#fff5f6] border-[#fdbcbc]",
    figureBox: "bg-[#fffafa] border-[#f0dfe2]",
    tocDrawer: "bg-white border-[#ffd3d2]",
  },
  sepia: {
    label: "ក្រដាស",
    backdrop: "bg-[#ece4d5]",
    sheet: "bg-[#fbf7ef] text-[#2a1f16] border-[#e4d8c3]",
    topbar: "bg-[#fbf7ef]/95 border-[#e2d4bc] text-[#2a1f16]",
    muted: "text-[#6e553b]",
    theoremBox: "bg-[#f4ecdc] border-[#b45309]",
    exampleBox: "bg-[#f7f1e5] border-[#dfd0b8]",
    stepBg: "bg-[#fdfaf3] border-[#e4d8c3]",
    summaryBox: "bg-[#f3ead8] border-[#d6c2a2]",
    figureBox: "bg-[#fdfaf3] border-[#e4d8c3]",
    tocDrawer: "bg-[#fbf7ef] border-[#dfd0b8]",
  },
  dark: {
    label: "ងងឹត",
    backdrop: "bg-[#0d0a0c]",
    sheet: "bg-[#171215] text-[#f5ecee] border-[#33232a]",
    topbar: "bg-[#171215]/95 border-[#33232a] text-[#f5ecee]",
    muted: "text-[#d9b8c0]",
    theoremBox: "bg-[#22161c] border-[#ff4d79]",
    exampleBox: "bg-[#1d1519] border-[#33232a]",
    stepBg: "bg-[#21181c] border-[#3a2830]",
    summaryBox: "bg-[#24161c] border-[#4b2936]",
    figureBox: "bg-[#1f171b] border-[#33232a]",
    tocDrawer: "bg-[#1a1317] border-[#3a2830]",
  },
};

const FONT_SIZES = [
  { label: "តូច", bodyClass: "text-[15.5px] sm:text-[16.5px]" },
  { label: "មធ្យម", bodyClass: "text-[17px] sm:text-[18.5px]" },
  { label: "ធំ", bodyClass: "text-[19px] sm:text-[20.5px]" },
];

function InlineWorkedExampleCard({ example, index }) {
  const [isOpen, setIsOpen] = useState(true);
  const [shownCount, setShownCount] = useState(0);

  const steps = example.steps || [];
  const diff = DIFFICULTY_STYLES[example.difficulty] || DIFFICULTY_STYLES.Medium;

  return (
    <div className="overflow-hidden rounded-xl border border-[#fdbcbc] bg-[#fffafa] shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-[#ffe9e8]/60 transition"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#db073d] px-2 py-0.5 text-[11px] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              លំហាត់គំរូ {index + 1}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${diff.classes}`}
            >
              {diff.label}
            </span>
          </div>
          <div className="text-sm md:text-base font-bold text-[#160002] khmer-prose">
            <MathText text={example.problem} />
          </div>
        </div>
        <span className="mt-1 text-[#7e021f]">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#ffd3d2] bg-white p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#47010d]">
              ដំណោះស្រាយ ({shownCount} / {steps.length} ជំហាន)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {shownCount < steps.length && (
                <button
                  type="button"
                  onClick={() =>
                    setShownCount((c) => Math.min(c + 1, steps.length))
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#bb0533] active:scale-95 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  បង្ហាញជំហានបន្ទាប់
                </button>
              )}

              {shownCount < steps.length ? (
                <button
                  type="button"
                  onClick={() => setShownCount(steps.length)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#fdbcbc] bg-white px-2.5 py-1 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] active:scale-95 transition"
                >
                  បង្ហាញទាំងអស់
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShownCount(0)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#fdbcbc] bg-white px-2.5 py-1 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] active:scale-95 transition"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  លាក់ដំណោះស្រាយ
                </button>
              )}
            </div>
          </div>

          {shownCount === 0 ? (
            <div className="rounded-lg border border-dashed border-[#fdbcbc] bg-[#fffafa] p-4 text-center text-xs md:text-sm font-medium text-[#47010d]">
              ចុច{" "}
              <strong className="text-[#db073d]">«បង្ហាញជំហានបន្ទាប់»</strong>{" "}
              ដើម្បីមើលដំណោះស្រាយតាមលំដាប់។
            </div>
          ) : (
            <div className="space-y-2.5">
              {steps.slice(0, shownCount).map((step, sIdx) => (
                <div
                  key={sIdx}
                  style={{ animationDelay: `${Math.min(sIdx * 65, 260)}ms` }}
                  className="animate-step-reveal flex items-start gap-2.5 rounded-lg border border-[#ffd3d2] bg-[#fffafa] p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#009b5e] shrink-0 mt-1" />
                  <div className="text-sm md:text-base font-medium text-[#160002] khmer-prose flex-1">
                    <MathText text={step} />
                  </div>
                </div>
              ))}
              {shownCount === steps.length && example.finalAnswer && (
                <div className="animate-step-reveal rounded-lg border border-[#009b5e]/40 bg-[#009b5e]/10 px-3.5 py-2.5 text-sm font-bold text-[#160002] khmer-prose">
                  <span className="text-[#009b5e]">ចម្លើយ៖ </span>
                  <MathText text={example.finalAnswer} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Clean Textbook-Style Example Block used inside Full-Screen Book Read Mode
 */
function TextbookExampleBlock({
  example,
  numberLabel,
  theme,
  bodyFontClass,
  globalExpandAll,
}) {
  const steps = example.steps || [];
  const [shownCount, setShownCount] = useState(globalExpandAll ? steps.length : 0);

  useEffect(() => {
    setShownCount(globalExpandAll ? steps.length : 0);
  }, [globalExpandAll, steps.length]);

  const diff = DIFFICULTY_STYLES[example.difficulty] || DIFFICULTY_STYLES.Medium;

  return (
    <div
      className={`rounded-xl border px-4 py-4 sm:px-6 sm:py-5 space-y-3.5 transition-colors ${theme.exampleBox}`}
    >
      {/* Example Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#db073d]">
            <Bookmark className="h-3.5 w-3.5" />
            {numberLabel}
          </span>
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${diff.classes}`}
          >
            {diff.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {shownCount < steps.length && (
            <button
              type="button"
              onClick={() =>
                setShownCount((c) => Math.min(c + 1, steps.length))
              }
              className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#bb0533] active:scale-95 transition"
            >
              <Eye className="h-3 w-3" />
              ជំហានបន្ទាប់ ({shownCount}/{steps.length})
            </button>
          )}
          {shownCount < steps.length ? (
            <button
              type="button"
              onClick={() => setShownCount(steps.length)}
              className="rounded-lg border border-[#db073d]/30 px-2.5 py-1 text-[11px] font-bold text-[#db073d] hover:bg-[#db073d]/10 active:scale-95 transition"
            >
              បង្ហាញទាំងអស់
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShownCount(0)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#db073d]/25 px-2.5 py-1 text-[11px] font-bold opacity-80 hover:opacity-100 active:scale-95 transition"
            >
              <EyeOff className="h-3 w-3" />
              លាក់ដំណោះស្រាយ
            </button>
          )}
        </div>
      </div>

      {/* Problem Statement */}
      <div className={`${bodyFontClass} font-bold khmer-prose leading-[1.9]`}>
        <MathText text={example.problem} />
      </div>

      {/* Solution Steps */}
      {shownCount > 0 && (
        <div className="pt-2 border-t border-current/10 space-y-2.5">
          <div className={`text-xs font-bold uppercase tracking-wider ${theme.muted}`}>
            ដំណោះស្រាយ (Solution)
          </div>
          {steps.slice(0, shownCount).map((step, sIdx) => (
            <div
              key={sIdx}
              style={{ animationDelay: `${Math.min(sIdx * 55, 220)}ms` }}
              className={`animate-step-reveal rounded-lg border px-3.5 py-3 ${theme.stepBg}`}
            >
              <div className={`${bodyFontClass} khmer-prose leading-[1.9]`}>
                <MathText text={step} />
              </div>
            </div>
          ))}
          {shownCount === steps.length && example.finalAnswer && (
            <div className="animate-step-reveal rounded-lg border border-[#009b5e]/45 bg-[#009b5e]/10 px-4 py-2.5 khmer-prose">
              <span className="font-bold text-[#009b5e]">ចម្លើយចុងក្រោយ៖ </span>
              <span className="font-bold">
                <MathText text={example.finalAnswer} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DetailedReading({
  detailedReading,
  workedExamples = [],
  lessonTitle = "",
  subTopicTitle = "",
}) {
  const sections = detailedReading?.sections || [];
  // Auto-open Full-Screen Book Reader Mode when entering Detailed Reading
  const [isBookMode, setIsBookMode] = useState(true);
  const [paperThemeKey, setPaperThemeKey] = useState("sepia");
  const [fontIdx, setFontIdx] = useState(1);
  const [expandAllSolutions, setExpandAllSolutions] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const scrollRafRef = useRef(0);

  // Reset scroll & progress refs cleanly when switching sub-topic
  useEffect(() => {
    setIsTocOpen(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "0%";
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = "0%";
    }
  }, [detailedReading]);

  // Cleanup any pending rAF on unmount
  useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  // Lock background scroll & handle Escape key while Full-Screen Book Mode is open
  useEffect(() => {
    if (!isBookMode) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isTocOpen) {
          setIsTocOpen(false);
        } else {
          setIsBookMode(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isBookMode, isTocOpen]);

  // Zero-re-render GPU-friendly scroll progress update via direct DOM refs + rAF
  const handleBookScroll = (e) => {
    const el = e.currentTarget;
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const pct =
        maxScroll <= 0
          ? 100
          : Math.min(100, Math.round((el.scrollTop / maxScroll) * 100));
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${pct}%`;
      }
    });
  };

  const jumpToBookAnchor = (anchorId) => {
    setIsTocOpen(false);
    const target = document.getElementById(anchorId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!sections.length && !workedExamples.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានឯកសារអានលម្អិតសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  const theme = PAPER_THEMES[paperThemeKey] || PAPER_THEMES.sepia;
  const bodyFontClass = FONT_SIZES[fontIdx]?.bodyClass || FONT_SIZES[1].bodyClass;

  // Running figure counter for textbook-style Figure 1, Figure 2...
  let figureCounter = 0;

  return (
    <div className="space-y-5">
      {/* Compact Banner to Re-open Full-Screen Textbook Read Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#fdbcbc] bg-[#ffe9e8]/70 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-bold text-[#160002] truncate">
              របៀបអានដូចសៀវភៅ Calculus (Textbook Read Mode)
            </div>
            <div className="text-xs text-[#7e021f]">
              អានពេញអេក្រង់ Clean មានក្រដាសសៀវភៅ ពង្រីកអក្សរ និងរូបភាពតាមលំដាប់
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsBookMode(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          <BookOpen className="h-4 w-4" />
          បើករបៀបអានសៀវភៅ Full Screen
        </button>
      </div>

      {/* Regular In-Page Detailed Reading View (mounted only when Book Mode is closed to avoid 2x KaTeX/SVG cost) */}
      {!isBookMode && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="lg:col-span-8 xl:col-span-9 space-y-5 sm:space-y-6">
          {detailedReading?.introduction && (
            <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs text-base md:text-[17px] text-[#160002] khmer-prose leading-relaxed">
              <MathText text={detailedReading.introduction} />
            </div>
          )}

          {sections.map((section, idx) => {
            const heading =
              section.subHeading || section.headingKh || `ផ្នែកទី ${idx + 1}`;
            const isTheoremOrDef =
              heading.includes("និយមន័យ") ||
              heading.includes("ទ្រឹស្តីបទ") ||
              heading.includes("Definition") ||
              heading.includes("Theorem");

            const rawContent = section.content || section.body || "";
            const paragraphs = rawContent.split(/\n\n+/);
            const sectionExamples = section.examples || [];
            const sectionGraphs = section.visualGraphs
              ? section.visualGraphs
              : section.visualGraph
              ? [section.visualGraph]
              : [];

            return (
              <section
                key={idx}
                id={`reading-section-${idx}`}
                className={`rounded-2xl border p-4 sm:p-6 md:p-8 shadow-xs scroll-mt-24 space-y-4 sm:space-y-5 ${
                  isTheoremOrDef
                    ? "border-[#fdbcbc] bg-[#ffe9e8]/45"
                    : "border-[#ffd3d2] bg-white"
                }`}
              >
                <h3 className="flex items-center gap-2.5 text-lg md:text-xl font-bold text-[#160002] khmer-prose">
                  <BookOpenText className="h-5 w-5 text-[#db073d] shrink-0" />
                  <span>
                    <MathText text={heading} />
                  </span>
                </h3>

                <div className="space-y-4 text-base md:text-[17px] font-normal text-[#160002] khmer-prose leading-relaxed">
                  {paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">
                      <MathText text={para} />
                    </p>
                  ))}
                </div>

                {sectionGraphs.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {sectionGraphs.map((vg, gIdx) => (
                      <div
                        key={gIdx}
                        className="rounded-xl border border-[#ffd3d2] bg-[#fffafa] p-3 md:p-4"
                      >
                        <SlideGraph visualGraph={vg} />
                      </div>
                    ))}
                  </div>
                )}

                {sectionExamples.length > 0 && (
                  <div className="pt-3 border-t border-[#ffd3d2] space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#9c0329]">
                      លំហាត់គំរូប្រចាំបញ្ញត្តិ (Worked Examples)
                    </div>
                    <div className="space-y-3">
                      {sectionExamples.map((ex, eIdx) => (
                        <InlineWorkedExampleCard
                          key={ex.id || `${idx}-${eIdx}`}
                          example={ex}
                          index={eIdx}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {workedExamples.length > 0 && (
            <section
              id="reading-section-examples"
              className="rounded-2xl border border-[#fdbcbc] bg-white p-6 md:p-8 shadow-xs scroll-mt-24 space-y-4"
            >
              <h3 className="flex items-center gap-2.5 text-lg md:text-xl font-bold text-[#160002] khmer-prose">
                <Sparkles className="h-5 w-5 text-[#db073d] shrink-0" />
                <span>លំហាត់គំរូរួម (Combined Worked Examples)</span>
              </h3>
              <div className="space-y-3">
                {workedExamples.map((ex, eIdx) => (
                  <InlineWorkedExampleCard
                    key={ex.id || eIdx}
                    example={ex}
                    index={eIdx}
                  />
                ))}
              </div>
            </section>
          )}

          {detailedReading?.summary && (
            <section className="rounded-2xl border border-[#fdbcbc] bg-[#ffe9e8]/60 p-5 sm:p-6 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9c0329]">
                សេចក្តីសង្ខេបខ្លឹមសារ
              </div>
              <div className="text-sm sm:text-base text-[#160002] khmer-prose leading-relaxed">
                <MathText text={detailedReading.summary} />
              </div>
            </section>
          )}
        </article>

        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-[#ffd3d2] bg-white p-5 shadow-xs">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7e021f] mb-3">
              <List className="h-4 w-4 text-[#db073d]" />
              មាតិកាអត្ថបទ
            </h4>
            <nav className="space-y-1.5">
              {sections.map((section, idx) => (
                <a
                  key={idx}
                  href={`#reading-section-${idx}`}
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-[#160002] hover:bg-[#ffe9e8] hover:text-[#db073d] transition khmer-prose"
                >
                  <MathText text={section.subHeading || `ផ្នែកទី ${idx + 1}`} />
                </a>
              ))}
              {workedExamples.length > 0 && (
                <a
                  href="#reading-section-examples"
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-[#db073d] hover:bg-[#ffe9e8] transition khmer-prose"
                >
                  លំហាត់គំរូរួម (Combined Examples)
                </a>
              )}
            </nav>
          </div>
        </aside>
      </div>
      )}

      {/* =================================================================== */}
      {/* FULL-SCREEN CALCULUS TEXTBOOK READER WINDOW (Portal on document.body)*/}
      {/* =================================================================== */}
      {isBookMode &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] flex flex-col animate-exam-overlay ${theme.backdrop}`}
            role="dialog"
            aria-modal="true"
            aria-label="របៀបអានសៀវភៅពេញអេក្រង់"
          >
            {/* Minimalist Textbook Reader Top Bar */}
            <header
              className={`relative z-20 border-b transition-colors ${theme.topbar}`}
            >
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
                {/* Left: Back / TOC + Running Title */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsTocOpen((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border border-current/15 px-2.5 py-1.5 text-xs font-bold hover:bg-[#db073d]/10 active:scale-95 transition ${
                      isTocOpen ? "bg-[#db073d] text-white border-[#db073d]" : ""
                    }`}
                    title="មាតិកាចំណុចរង"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">មាតិកា</span>
                  </button>

                  <div className="min-w-0">
                    <div className={`text-[10px] sm:text-[11px] font-bold truncate ${theme.muted}`}>
                      {lessonTitle || "សៀវភៅគណិតវិទ្យាសាកលវិទ្យាល័យ"}
                    </div>
                    <div className="text-xs sm:text-sm font-bold truncate khmer-prose">
                      {subTopicTitle || "ឯកសារអានលម្អិត"}
                    </div>
                  </div>
                </div>

                {/* Right: Paper Theme + Font Size + Solutions Toggle + Close */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Paper Theme Switcher */}
                  <div className="hidden md:inline-flex items-center rounded-xl border border-current/15 p-0.5">
                    {[
                      { id: "white", icon: Sun, label: "ស" },
                      { id: "sepia", icon: FileText, label: "ក្រដាស" },
                      { id: "dark", icon: Moon, label: "ងងឹត" },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const active = paperThemeKey === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPaperThemeKey(opt.id)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                            active
                              ? "bg-[#db073d] text-white"
                              : "opacity-75 hover:opacity-100"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile single-click theme cycler */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaperThemeKey((prev) =>
                        prev === "sepia" ? "white" : prev === "white" ? "dark" : "sepia"
                      )
                    }
                    className="md:hidden inline-flex items-center justify-center rounded-xl border border-current/15 p-2 active:scale-95 transition"
                    title="ប្តូរពណ៌ក្រដាស"
                    aria-label="ប្តូរពណ៌ក្រដាស"
                  >
                    {paperThemeKey === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : paperThemeKey === "sepia" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </button>

                  {/* Font Size Controls */}
                  <div className="inline-flex items-center rounded-xl border border-current/15 p-0.5">
                    <button
                      type="button"
                      disabled={fontIdx === 0}
                      onClick={() => setFontIdx((i) => Math.max(0, i - 1))}
                      className="rounded-lg p-1.5 hover:bg-current/10 disabled:opacity-35 transition"
                      title="បង្រួមអក្សរ"
                      aria-label="បង្រួមអក្សរ"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-1.5 text-[11px] font-bold select-none">
                      A
                    </span>
                    <button
                      type="button"
                      disabled={fontIdx === FONT_SIZES.length - 1}
                      onClick={() =>
                        setFontIdx((i) => Math.min(FONT_SIZES.length - 1, i + 1))
                      }
                      className="rounded-lg p-1.5 hover:bg-current/10 disabled:opacity-35 transition"
                      title="ពង្រីកអក្សរ"
                      aria-label="ពង្រីកអក្សរ"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Expand / Collapse All Solutions */}
                  <button
                    type="button"
                    onClick={() => setExpandAllSolutions((v) => !v)}
                    className={`hidden sm:inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold active:scale-95 transition ${
                      expandAllSolutions
                        ? "border-[#009b5e] bg-[#009b5e] text-white"
                        : "border-current/15 hover:bg-current/5"
                    }`}
                    title="បើក ឬលាក់ដំណោះស្រាយទាំងអស់ដូចក្នុងសៀវភៅ"
                  >
                    {expandAllSolutions ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>លាក់ដំណោះស្រាយ</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>បង្ហាញដំណោះស្រាយទាំងអស់</span>
                      </>
                    )}
                  </button>

                  {/* Close Full-Screen Reader */}
                  <button
                    type="button"
                    onClick={() => setIsBookMode(false)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#db073d]/35 bg-[#db073d]/10 px-2.5 py-1.5 text-xs font-bold text-[#db073d] hover:bg-[#db073d] hover:text-white active:scale-95 transition"
                    aria-label="បិទរបៀបអានសៀវភៅ"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">បិទ</span>
                  </button>
                </div>
              </div>

              {/* Thin Scroll Progress Bar (updated via ref, zero re-renders) */}
              <div className="h-[2.5px] w-full bg-current/10">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#db073d]"
                  style={{ width: "0%" }}
                />
              </div>
            </header>

            {/* Floating Slide-Out Table of Contents Drawer */}
            {isTocOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/25 backdrop-blur-2xs"
                onClick={() => setIsTocOpen(false)}
              >
                <aside
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute left-3 top-16 bottom-4 w-72 sm:w-80 overflow-y-auto rounded-2xl border p-4 shadow-2xl animate-panel-enter ${theme.tocDrawer}`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#db073d]">
                      មាតិកាក្នុងទំព័រសៀវភៅ
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTocOpen(false)}
                      className="rounded-lg p-1 hover:bg-current/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <nav className="space-y-1.5">
                    {sections.map((sec, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => jumpToBookAnchor(`book-section-${idx}`)}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs sm:text-sm font-bold hover:bg-[#db073d]/10 hover:text-[#db073d] transition khmer-prose"
                      >
                        <MathText
                          text={sec.subHeading || sec.headingKh || `ផ្នែកទី ${idx + 1}`}
                        />
                      </button>
                    ))}
                    {workedExamples.length > 0 && (
                      <button
                        type="button"
                        onClick={() => jumpToBookAnchor("book-section-examples")}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#db073d] hover:bg-[#db073d]/10 transition khmer-prose"
                      >
                        លំហាត់គំរូសំយោគ ({workedExamples.length})
                      </button>
                    )}
                    {detailedReading?.summary && (
                      <button
                        type="button"
                        onClick={() => jumpToBookAnchor("book-section-summary")}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs sm:text-sm font-bold hover:bg-[#db073d]/10 transition khmer-prose"
                      >
                        សេចក្តីសង្ខេបខ្លឹមសារ
                      </button>
                    )}
                  </nav>
                </aside>
              </div>
            )}

            {/* Main Scrollable Calculus Textbook Sheet */}
            <div
              ref={scrollContainerRef}
              onScroll={handleBookScroll}
              className="flex-1 overflow-y-auto px-2.5 py-5 sm:px-6 sm:py-8 md:py-10"
            >
              <article
                className={`mx-auto max-w-[840px] rounded-2xl sm:rounded-3xl border px-5 py-8 sm:px-10 sm:py-12 md:px-14 md:py-14 shadow-[0_18px_60px_-20px_rgba(22,0,2,0.16)] transition-colors space-y-10 ${theme.sheet} ${
                  paperThemeKey === "dark" ? "book-theme-dark" : ""
                }`}
              >
                {/* Textbook Chapter / Section Title Header */}
                <div className="border-b-2 border-[#db073d]/25 pb-6 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-[#db073d]">
                    <span>UNIVERSITY MATH STUDIO • TEXTBOOK MODE</span>
                    <span ref={progressTextRef} className="font-mono">0%</span>
                  </div>
                  {lessonTitle && (
                    <div className={`text-sm sm:text-base font-bold khmer-prose ${theme.muted}`}>
                      {lessonTitle}
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight khmer-prose leading-snug">
                    {subTopicTitle || "ឯកសារអានលម្អិត"}
                  </h1>
                  {detailedReading?.introduction && (
                    <p className={`pt-2 ${bodyFontClass} khmer-prose leading-[2] opacity-95`}>
                      <MathText text={detailedReading.introduction} />
                    </p>
                  )}
                </div>

                {/* Ordered Textbook Sections */}
                <div className="space-y-12">
                  {sections.map((section, idx) => {
                    const heading =
                      section.subHeading || section.headingKh || `ផ្នែកទី ${idx + 1}`;
                    const isTheoremOrDef =
                      heading.includes("និយមន័យ") ||
                      heading.includes("ទ្រឹស្តីបទ") ||
                      heading.includes("Definition") ||
                      heading.includes("Theorem");

                    const rawContent = section.content || section.body || "";
                    const paragraphs = rawContent.split(/\n\n+/);
                    const sectionExamples = section.examples || [];
                    const sectionGraphs = section.visualGraphs
                      ? section.visualGraphs
                      : section.visualGraph
                      ? [section.visualGraph]
                      : [];

                    return (
                      <section
                        key={idx}
                        id={`book-section-${idx}`}
                        className="scroll-mt-20 space-y-6"
                      >
                        {/* Section Heading */}
                        <h2 className="border-l-4 border-[#db073d] pl-4 text-lg sm:text-2xl font-extrabold khmer-prose leading-snug">
                          <MathText text={heading} />
                        </h2>

                        {/* Core Explanation (with Editorial Callout Frame for Theorems/Definitions) */}
                        <div
                          className={
                            isTheoremOrDef
                              ? `rounded-r-xl border-l-4 px-5 py-5 sm:px-6 sm:py-6 space-y-4 ${theme.theoremBox}`
                              : "space-y-4"
                          }
                        >
                          {isTheoremOrDef && (
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#db073d]">
                              បញ្ញត្តិ និងទ្រឹស្តីបទស្នូល
                            </div>
                          )}
                          <div className={`space-y-4 ${bodyFontClass} khmer-prose leading-[2]`}>
                            {paragraphs.map((para, pIdx) => (
                              <p key={pIdx} className="whitespace-pre-line">
                                <MathText text={para} />
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Numbered Textbook Figures (Interactive Graphs) */}
                        {sectionGraphs.length > 0 && (
                          <div className="space-y-5 py-1">
                            {sectionGraphs.map((vg, gIdx) => {
                              figureCounter += 1;
                              const figNum = figureCounter;
                              return (
                                <figure
                                  key={gIdx}
                                  className={`rounded-2xl border p-3.5 sm:p-5 space-y-2.5 ${theme.figureBox}`}
                                >
                                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#db073d]">
                                    រូបភាពទី {figNum} (Figure {figNum})
                                  </div>
                                  <div className="text-[#160002]">
                                    <SlideGraph visualGraph={vg} />
                                  </div>
                                </figure>
                              );
                            })}
                          </div>
                        )}

                        {/* Ordered Concept Examples */}
                        {sectionExamples.length > 0 && (
                          <div className="space-y-4 pt-1">
                            {sectionExamples.map((ex, eIdx) => (
                              <TextbookExampleBlock
                                key={ex.id || `${idx}-${eIdx}`}
                                example={ex}
                                numberLabel={`ឧទាហរណ៍ ${idx + 1}.${eIdx + 1}`}
                                theme={theme}
                                bodyFontClass={bodyFontClass}
                                globalExpandAll={expandAllSolutions}
                              />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>

                {/* Combined / Synthesis Worked Examples */}
                {workedExamples.length > 0 && (
                  <section
                    id="book-section-examples"
                    className="scroll-mt-20 border-t-2 border-current/10 pt-8 space-y-5"
                  >
                    <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold khmer-prose">
                      <Sparkles className="h-5 w-5 text-[#db073d] shrink-0" />
                      <span>លំហាត់គំរូសំយោគ (Worked Examples)</span>
                    </h2>
                    <div className="space-y-4">
                      {workedExamples.map((ex, eIdx) => (
                        <TextbookExampleBlock
                          key={ex.id || eIdx}
                          example={ex}
                          numberLabel={`លំហាត់គំរូសំយោគទី ${eIdx + 1}`}
                          theme={theme}
                          bodyFontClass={bodyFontClass}
                          globalExpandAll={expandAllSolutions}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Textbook Summary Box */}
                {detailedReading?.summary && (
                  <section
                    id="book-section-summary"
                    className={`scroll-mt-20 rounded-2xl border p-5 sm:p-7 space-y-2.5 ${theme.summaryBox}`}
                  >
                    <div className="text-xs font-extrabold uppercase tracking-widest text-[#db073d]">
                      សេចក្តីសង្ខេបខ្លឹមសារ (Key Takeaways)
                    </div>
                    <div className={`${bodyFontClass} khmer-prose leading-[1.95]`}>
                      <MathText text={detailedReading.summary} />
                    </div>
                  </section>
                )}

                {/* Textbook Page Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-6">
                  <span className={`text-xs font-semibold ${theme.muted}`}>
                    ចប់ឯកសារអានលម្អិត — {subTopicTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBookMode(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#db073d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#bb0533] active:scale-95 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    ត្រឡប់ទៅផ្ទាំងមេរៀន
                  </button>
                </div>
              </article>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
