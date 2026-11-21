"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpenText,
  List,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
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
                  className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#bb0533] transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  បង្ហាញជំហានបន្ទាប់
                </button>
              )}

              {shownCount < steps.length ? (
                <button
                  type="button"
                  onClick={() => setShownCount(steps.length)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#fdbcbc] bg-white px-2.5 py-1 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
                >
                  បង្ហាញទាំងអស់
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShownCount(0)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#fdbcbc] bg-white px-2.5 py-1 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
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
}) {
  const sections = detailedReading?.sections || [];

  // Reset scroll/state when switching sub-topics
  useEffect(() => {}, [detailedReading]);

  if (!sections.length && !workedExamples.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានឯកសារអានលម្អិតសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Reading Content */}
      <article className="lg:col-span-8 xl:col-span-9 space-y-5 sm:space-y-6">
        {/* Mobile Quick Jump Table of Contents */}
        {sections.length > 0 && (
          <div className="lg:hidden rounded-2xl border border-[#ffd3d2] bg-white p-3.5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7e021f]">
              <List className="h-3.5 w-3.5 text-[#db073d]" />
              រំលងទៅផ្នែក (Quick Jump)
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {sections.map((section, idx) => (
                <a
                  key={idx}
                  href={`#reading-section-${idx}`}
                  className="shrink-0 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] hover:text-[#db073d] transition"
                >
                  <MathText
                    text={
                      section.subHeading ||
                      section.headingKh ||
                      `ផ្នែកទី ${idx + 1}`
                    }
                  />
                </a>
              ))}
              {workedExamples.length > 0 && (
                <a
                  href="#reading-section-examples"
                  className="shrink-0 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1.5 text-xs font-bold text-[#9c0329]"
                >
                  លំហាត់គំរូរួម
                </a>
              )}
            </div>
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

              {/* Embedded Visual Graphs for this Concept */}
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

              {/* Embedded Worked Examples for this Concept */}
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

        {/* Combined / Synthesis Worked Examples at the bottom */}
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
      </article>

      {/* Sticky Table of Contents */}
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
  );
}
