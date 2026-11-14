"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import MathText from "@/components/common/MathText";

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

export default function WorkedExamples({ workedExamples = [] }) {
  const [expandedIds, setExpandedIds] = useState(() =>
    workedExamples[0] ? { [workedExamples[0].id]: true } : {}
  );
  const [revealedSteps, setRevealedSteps] = useState({});

  useEffect(() => {
    setExpandedIds(workedExamples[0] ? { [workedExamples[0].id]: true } : {});
    setRevealedSteps({});
  }, [workedExamples]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealNextStep = (id, totalSteps) => {
    setRevealedSteps((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.min(current + 1, totalSteps) };
    });
  };

  const revealAllSteps = (id, totalSteps) => {
    setRevealedSteps((prev) => ({ ...prev, [id]: totalSteps }));
  };

  const resetSteps = (id) => {
    setRevealedSteps((prev) => ({ ...prev, [id]: 0 }));
  };

  if (!workedExamples.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានលំហាត់គំរូសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workedExamples.map((example, index) => {
        const isOpen = !!expandedIds[example.id];
        const steps = example.steps || [];
        const shownCount = revealedSteps[example.id] ?? 0;
        const diff =
          DIFFICULTY_STYLES[example.difficulty] || DIFFICULTY_STYLES.Medium;

        return (
          <div
            key={example.id || index}
            className="overflow-hidden rounded-2xl border border-[#ffd3d2] bg-white shadow-xs transition"
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => toggleExpand(example.id)}
              className="flex w-full items-start justify-between gap-4 p-5 text-left hover:bg-[#ffe9e8]/50 transition"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-[#ffe9e8] border border-[#fdbcbc] px-2.5 py-0.5 text-xs font-bold text-[#7e021f]">
                    លំហាត់គំរូទី {index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${diff.classes}`}
                  >
                    {diff.label}
                  </span>
                </div>
                <div className="text-base md:text-lg font-bold text-[#160002] khmer-prose">
                  <MathText text={example.problem} />
                </div>
              </div>

              <span className="mt-1 rounded-lg p-1 text-[#7e021f]">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
            </button>

            {/* Accordion Body */}
            {isOpen && (
              <div className="border-t border-[#ffd3d2] bg-[#fffafa] p-5 space-y-4">
                {/* Step Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#47010d]">
                    ដំណោះស្រាយ ({shownCount} / {steps.length} ជំហាន)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {shownCount < steps.length && (
                      <button
                        type="button"
                        onClick={() => revealNextStep(example.id, steps.length)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#db073d] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#bb0533] transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        បង្ហាញជំហានបន្ទាប់
                      </button>
                    )}

                    {shownCount < steps.length ? (
                      <button
                        type="button"
                        onClick={() => revealAllSteps(example.id, steps.length)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fdbcbc] bg-white px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
                      >
                        បង្ហាញទាំងអស់
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resetSteps(example.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fdbcbc] bg-white px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
                      >
                        {shownCount > 0 ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        លាក់ដំណោះស្រាយ
                      </button>
                    )}
                  </div>
                </div>

                {/* Revealed Steps */}
                {shownCount === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#fdbcbc] bg-white p-6 text-center text-sm font-medium text-[#47010d]">
                    ចុចប៊ូតុង{" "}
                    <strong className="text-[#db073d]">
                      «បង្ហាញជំហានបន្ទាប់»
                    </strong>{" "}
                    ដើម្បីមើលសម្រាយបញ្ជាក់ ឬដំណោះស្រាយតាមលំដាប់។
                  </div>
                ) : (
                  <div className="space-y-3">
                    {steps.slice(0, shownCount).map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-3 rounded-xl border border-[#ffd3d2] bg-white p-4 shadow-2xs"
                      >
                        <CheckCircle2 className="h-5 w-5 text-[#009b5e] shrink-0 mt-0.5" />
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
      })}
    </div>
  );
}
