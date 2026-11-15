"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Brain,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Compass,
} from "lucide-react";
import MathText from "@/components/common/MathText";

const LEVEL_META = {
  synthesis: {
    label: "កម្រិត ១៖ សំយោគគំនិត",
    badge: "bg-[#0085dd]/12 text-[#005c9e] dark:text-[#7cc4ff] border-[#0085dd]/35",
  },
  analytical: {
    label: "កម្រិត ២៖ វិភាគ និងសម្រាយ",
    badge: "bg-[#b95a00]/12 text-[#8a4300] dark:text-[#fbbf24] border-[#b95a00]/35",
  },
  challenge: {
    label: "កម្រិត ៣៖ គិតស៊ីជម្រៅ",
    badge: "bg-[#db073d]/12 text-[#9c0329] dark:text-[#ff8fa3] border-[#db073d]/35",
  },
};

export default function ChapterChallengeView({ challenge }) {
  const exercises = challenge?.exercises || [];
  const [filterLevel, setFilterLevel] = useState("all");
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showHints, setShowHints] = useState({});
  const [revealedSteps, setRevealedSteps] = useState({});
  const [masteredProofs, setMasteredProofs] = useState({});

  useEffect(() => {
    setFilterLevel("all");
    setAnswers({});
    setChecked({});
    setShowHints({});
    setRevealedSteps({});
    setMasteredProofs({});
  }, [challenge]);

  if (!challenge || exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានលំហាត់សំយោគបញ្ចប់មេរៀនទេ។
      </div>
    );
  }

  const filteredExercises =
    filterLevel === "all"
      ? exercises
      : exercises.filter((ex) => ex.level === filterLevel);

  const completedCount = exercises.filter((ex) =>
    ex.type === "proof" ? !!masteredProofs[ex.id] : checked[ex.id] === true
  ).length;
  const progressPct = Math.round((completedCount / exercises.length) * 100);

  const handleCheck = (ex) => {
    const userAns = answers[ex.id];
    if (userAns === undefined || userAns === "") return;

    let isCorrect = false;
    if (ex.type === "short-answer") {
      const normalized = String(userAns).trim().toLowerCase().replace(/\s+/g, "");
      isCorrect = (ex.expectedAnswers || []).some(
        (ans) =>
          String(ans).trim().toLowerCase().replace(/\s+/g, "") === normalized
      );
    } else {
      isCorrect = userAns === ex.correctIndex;
    }
    setChecked((prev) => ({ ...prev, [ex.id]: isCorrect }));
  };

  const handleResetOne = (exId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[exId];
      return copy;
    });
    setChecked((prev) => {
      const copy = { ...prev };
      delete copy[exId];
      return copy;
    });
  };

  const handleResetAll = () => {
    setAnswers({});
    setChecked({});
    setShowHints({});
    setRevealedSteps({});
    setMasteredProofs({});
  };

  return (
    <div className="space-y-6">
      {/* Chapter Challenge Hero Header */}
      <div className="rounded-2xl border border-[#fdbcbc] bg-gradient-to-br from-[#ffe9e8]/80 via-white to-[#fff5f5] dark:bg-none dark:bg-[#1e1015] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#db073d] text-white shadow-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-2.5 py-0.5 text-[11px] font-bold text-[#9c0329]">
                <Brain className="h-3 w-3" />
                {challenge.titleEn || "Chapter Mastery Challenge"}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#160002] khmer-prose">
                {challenge.titleKh}
              </h2>
              {challenge.descriptionKh && (
                <p className="text-xs sm:text-sm text-[#47010d] khmer-prose">
                  {challenge.descriptionKh}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white px-3.5 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ចាប់ផ្តើមឡើងវិញ
          </button>
        </div>

        {/* Mastery Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#7e021f]">
              វឌ្ឍនភាពស្ទាត់ជំនាញ៖ {completedCount} / {exercises.length} លំហាត់
            </span>
            <span className="text-[#009b5e] font-mono">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#ffd3d2]/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#db073d] to-[#009b5e] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { id: "all", label: `ទាំងអស់ (${exercises.length})` },
            {
              id: "synthesis",
              label: `សំយោគ (${exercises.filter((e) => e.level === "synthesis").length})`,
            },
            {
              id: "analytical",
              label: `វិភាគ & សម្រាយ (${exercises.filter((e) => e.level === "analytical").length})`,
            },
            {
              id: "challenge",
              label: `គិតស៊ីជម្រៅ (${exercises.filter((e) => e.level === "challenge").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterLevel(tab.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                filterLevel === tab.id
                  ? "border-[#db073d] bg-[#db073d] text-white shadow-2xs"
                  : "border-[#ffd3d2] bg-white text-[#47010d] hover:bg-[#ffe9e8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-5">
        {filteredExercises.map((ex, idx) => {
          const levelInfo = LEVEL_META[ex.level] || LEVEL_META.synthesis;
          const hintVisible = !!showHints[ex.id];
          const isChecked = checked[ex.id] !== undefined;
          const isCorrect = checked[ex.id] === true;
          const userAns = answers[ex.id];
          const steps = ex.steps || [];
          const shownSteps = revealedSteps[ex.id] || 0;
          const isMastered = !!masteredProofs[ex.id];

          return (
            <div
              key={ex.id || idx}
              className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2.5 py-1 text-xs font-bold text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    បញ្ហាទី {idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${levelInfo.badge}`}
                  >
                    {levelInfo.label}
                  </span>
                  {ex.topicTag && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#ffd3d2] bg-[#fffafa] px-2.5 py-1 text-[11px] font-bold text-[#620116]">
                      <Compass className="h-3 w-3 text-[#db073d]" />
                      {ex.topicTag}
                    </span>
                  )}
                </div>

                {ex.hint && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowHints((prev) => ({
                        ...prev,
                        [ex.id]: !prev[ex.id],
                      }))
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-[#0097a8]/35 bg-[#0097a8]/10 px-2.5 py-1 text-xs font-bold text-[#0097a8] hover:bg-[#0097a8]/20 transition"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    {hintVisible ? "លាក់គន្លឹះ" : "មើលគន្លឹះ"}
                  </button>
                )}
              </div>

              {/* Problem Statement */}
              <div className="text-base md:text-lg font-bold text-[#160002] khmer-prose">
                <MathText text={ex.question} />
              </div>

              {/* Hint Box */}
              {hintVisible && ex.hint && (
                <div className="rounded-xl border border-[#0097a8]/30 bg-[#0097a8]/10 p-3.5 text-sm font-medium text-[#160002] khmer-prose">
                  <strong className="text-[#0097a8]">គន្លឹះគិត៖ </strong>
                  <MathText text={ex.hint} />
                </div>
              )}

              {/* Proof / Multi-step Problem Solving Mode */}
              {ex.type === "proof" ? (
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {shownSteps < steps.length && (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSteps((prev) => ({
                              ...prev,
                              [ex.id]: Math.min(
                                (prev[ex.id] || 0) + 1,
                                steps.length
                              ),
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#009b5e] px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          បង្ហាញជំហានបន្ទាប់ ({shownSteps}/{steps.length})
                        </button>
                      )}
                      {shownSteps < steps.length ? (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSteps((prev) => ({
                              ...prev,
                              [ex.id]: steps.length,
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#009b5e]/40 bg-white px-3 py-2 text-xs font-bold text-[#160002] hover:bg-[#009b5e]/10 transition"
                        >
                          បង្ហាញដំណោះស្រាយទាំងអស់
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSteps((prev) => ({
                              ...prev,
                              [ex.id]: 0,
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-white px-3 py-2 text-xs font-bold text-[#47010d] hover:bg-[#ffe9e8] transition"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          លាក់ដំណោះស្រាយ
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setMasteredProofs((prev) => ({
                          ...prev,
                          [ex.id]: !prev[ex.id],
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        isMastered
                          ? "bg-[#009b5e] text-white"
                          : "border border-[#fdbcbc] bg-[#fffafa] text-[#7e021f] hover:bg-[#ffe9e8]"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isMastered ? "ស្ទាត់ជំនាញហើយ ✓" : "គូសចំណាំថាយល់ហើយ"}
                    </button>
                  </div>

                  {shownSteps > 0 && (
                    <div className="space-y-2.5 rounded-xl border border-[#009b5e]/30 bg-[#009b5e]/5 p-4">
                      {steps.slice(0, shownSteps).map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-xl border border-[#009b5e]/20 bg-white p-3.5 text-sm md:text-base font-medium text-[#160002] khmer-prose"
                        >
                          <span className="font-bold text-[#009b5e] mr-1.5">
                            ជំហានទី {sIdx + 1}៖
                          </span>
                          <MathText text={step} />
                        </div>
                      ))}

                      {shownSteps === steps.length && ex.finalAnswer && (
                        <div className="rounded-xl border border-[#009b5e] bg-[#009b5e]/12 p-3.5 text-sm md:text-base font-bold text-[#160002] khmer-prose">
                          <span className="text-[#007a49]">សន្និដ្ឋាន៖ </span>
                          <MathText text={ex.finalAnswer} />
                        </div>
                      )}

                      {shownSteps === steps.length && ex.keyTakeaway && (
                        <div className="rounded-xl border border-[#fdbcbc] bg-[#ffe9e8]/60 p-3.5 text-xs sm:text-sm font-medium text-[#2d0006] khmer-prose">
                          <strong className="text-[#9c0329]">
                            គន្លឹះគិតស៊ីជម្រៅ៖{" "}
                          </strong>
                          <MathText text={ex.keyTakeaway} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* MCQ or Short-Answer Mode */}
                  {ex.type === "short-answer" ? (
                    <input
                      type="text"
                      value={userAns || ""}
                      disabled={isChecked}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [ex.id]: e.target.value,
                        }))
                      }
                      placeholder={ex.placeholder || "បញ្ចូលចម្លើយរបស់អ្នក..."}
                      className="w-full sm:max-w-md rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-4 py-2.5 font-mono text-sm font-bold text-[#160002] focus:border-[#db073d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#db073d]/20 disabled:opacity-75"
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(ex.options || []).map((opt, optIdx) => {
                        const isSelected = userAns === optIdx;
                        const isRightOption = optIdx === ex.correctIndex;
                        let optionStyle =
                          "border-[#ffd3d2] bg-[#fffafa] text-[#160002] hover:border-[#db073d] hover:bg-[#ffe9e8]/50";
                        if (isChecked) {
                          if (isRightOption) {
                            optionStyle =
                              "border-[#009b5e] bg-[#009b5e]/12 text-[#160002] ring-1 ring-[#009b5e]";
                          } else if (isSelected && !isRightOption) {
                            optionStyle =
                              "border-[#db073d] bg-[#ffe9e8] text-[#7e021f] ring-1 ring-[#db073d]";
                          } else {
                            optionStyle =
                              "border-[#ffd3d2] bg-white text-[#47010d] opacity-70";
                          }
                        } else if (isSelected) {
                          optionStyle =
                            "border-[#db073d] bg-[#ffe9e8] text-[#7e021f] ring-2 ring-[#db073d]/30";
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isChecked}
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [ex.id]: optIdx,
                              }))
                            }
                            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm md:text-base font-medium transition khmer-prose ${optionStyle}`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                isChecked && isRightOption
                                  ? "bg-[#009b5e] text-white"
                                  : isSelected
                                  ? "bg-[#db073d] text-white"
                                  : "bg-[#ffe9e8] text-[#7e021f]"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">
                              <MathText text={opt} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={userAns === undefined || userAns === ""}
                        onClick={() => handleCheck(ex)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#bb0533] transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        ផ្ទៀងផ្ទាត់ចម្លើយ
                      </button>
                    ) : (
                      <>
                        <div
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white ${
                            isCorrect ? "bg-[#009b5e]" : "bg-[#db073d]"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              ត្រឹមត្រូវ! ពូកែណាស់!
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              មិនទាន់ត្រឹមត្រូវទេ
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleResetOne(ex.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white px-3 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          សាកល្បងម្តងទៀត
                        </button>
                      </>
                    )}
                  </div>

                  {isChecked && !isCorrect && (
                    <div className="rounded-xl border border-[#009b5e]/40 bg-[#009b5e]/10 p-3.5 text-sm md:text-base font-medium text-[#160002] khmer-prose">
                      <strong className="text-[#007a49]">ចម្លើយត្រឹមត្រូវ៖ </strong>
                      {ex.type === "short-answer" ? (
                        <span className="font-mono font-bold">
                          {ex.expectedAnswers?.[0] || ""}
                        </span>
                      ) : ex.correctIndex !== undefined &&
                        ex.options?.[ex.correctIndex] !== undefined ? (
                        <span>
                          <strong>
                            {String.fromCharCode(65 + ex.correctIndex)}.
                          </strong>{" "}
                          <MathText text={ex.options[ex.correctIndex]} />
                        </span>
                      ) : null}
                    </div>
                  )}

                  {isChecked && ex.explanation && (
                    <div className="rounded-xl border border-[#fdbcbc] bg-[#fffafa] p-4 text-sm md:text-base font-medium text-[#160002] khmer-prose">
                      <strong className="text-[#9c0329]">ការពន្យល់លម្អិត៖ </strong>
                      <MathText text={ex.explanation} />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
