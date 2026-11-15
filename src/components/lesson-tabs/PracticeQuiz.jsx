"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Lightbulb,
} from "lucide-react";
import MathText from "@/components/common/MathText";

export default function PracticeQuiz({ practiceExercises = [] }) {
  // Store selected option index or text input per exercise id
  const [answers, setAnswers] = useState({});
  // Store checked state per exercise id: { [id]: boolean (isCorrect) }
  const [checked, setChecked] = useState({});
  // Store hint visibility per exercise id
  const [showHints, setShowHints] = useState({});

  useEffect(() => {
    setAnswers({});
    setChecked({});
    setShowHints({});
  }, [practiceExercises]);

  if (!practiceExercises.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានលំហាត់អនុវត្តន៍សម្រាប់ផ្នែកនេះទេ។
      </div>
    );
  }

  const totalCount = practiceExercises.length;
  const checkedCount = Object.keys(checked).length;
  const correctCount = Object.values(checked).filter(Boolean).length;

  const handleSelectOption = (exId, optIndex) => {
    if (checked[exId] !== undefined) return; // Lock after checking until reset
    setAnswers((prev) => ({ ...prev, [exId]: optIndex }));
  };

  const handleTextChange = (exId, value) => {
    if (checked[exId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [exId]: value }));
  };

  const handleCheck = (ex) => {
    const userAns = answers[ex.id];
    if (userAns === undefined || userAns === "") return;

    let isCorrect = false;
    if (ex.type === "short-answer") {
      const normalized = String(userAns).trim().toLowerCase().replace(/\s+/g, "");
      isCorrect = (ex.expectedAnswers || []).some(
        (ans) => String(ans).trim().toLowerCase().replace(/\s+/g, "") === normalized
      );
    } else {
      isCorrect = userAns === ex.correctIndex;
    }

    setChecked((prev) => ({ ...prev, [ex.id]: isCorrect }));
  };

  const handleRetryOne = (exId) => {
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
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#fdbcbc] bg-[#ffe9e8]/70 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#160002]">
              លំហាត់អនុវត្តន៍ និងផ្ទៀងផ្ទាត់ចម្លើយ (Practice & Verification)
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#7e021f]">
              បានផ្ទៀងផ្ទាត់៖ {checkedCount} / {totalCount} លំហាត់ • ពិន្ទុត្រឹមត្រូវ៖{" "}
              <span className="text-[#009b5e] font-bold">
                {correctCount} / {totalCount}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white px-3.5 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          ធ្វើឡើងវិញទាំងអស់
        </button>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-5">
        {practiceExercises.map((ex, idx) => {
          const isChecked = checked[ex.id] !== undefined;
          const isCorrect = checked[ex.id] === true;
          const userAns = answers[ex.id];
          const hintVisible = !!showHints[ex.id];

          return (
            <div
              key={ex.id || idx}
              className="rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffe9e8] border border-[#fdbcbc] px-2.5 py-1 text-xs font-bold text-[#7e021f]">
                  <HelpCircle className="h-3.5 w-3.5 text-[#db073d]" />
                  លំហាត់ទី {idx + 1}
                </span>

                {ex.hint && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowHints((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-[#0097a8]/35 bg-[#0097a8]/10 px-2.5 py-1 text-xs font-bold text-[#0097a8] hover:bg-[#0097a8]/20 transition"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    {hintVisible ? "លាក់គន្លឹះ" : "មើលគន្លឹះ"}
                  </button>
                )}
              </div>

              {/* Question Prompt */}
              <div className="text-base md:text-lg font-bold text-[#160002] khmer-prose">
                <MathText text={ex.question} />
              </div>

              {/* Optional Hint Box */}
              {hintVisible && ex.hint && (
                <div className="rounded-xl border border-[#0097a8]/30 bg-[#0097a8]/10 p-3.5 text-sm font-medium text-[#160002] khmer-prose">
                  <strong className="text-[#0097a8]">គន្លឹះ៖ </strong>
                  <MathText text={ex.hint} />
                </div>
              )}

              {/* Answer Input Area */}
              {ex.type === "short-answer" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userAns || ""}
                    disabled={isChecked}
                    onChange={(e) => handleTextChange(ex.id, e.target.value)}
                    placeholder={ex.placeholder || "បញ្ចូលចម្លើយរបស់អ្នក..."}
                    className="w-full sm:max-w-md rounded-xl border border-[#fdbcbc] bg-[#fffafa] px-4 py-2.5 font-mono text-sm font-bold text-[#160002] focus:border-[#db073d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#db073d]/20 disabled:opacity-75"
                  />
                </div>
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
                        optionStyle = "border-[#ffd3d2] bg-white text-[#47010d] opacity-70";
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
                        onClick={() => handleSelectOption(ex.id, optIdx)}
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

              {/* Action Buttons & Result Banner */}
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
                      onClick={() => handleRetryOne(ex.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white px-3 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      សាកល្បងម្តងទៀត
                    </button>
                  </>
                )}
              </div>

              {/* Correct answer & explanation after checking */}
              {isChecked && !isCorrect && (
                <div className="rounded-xl border border-[#009b5e]/40 bg-[#009b5e]/10 p-3.5 text-sm md:text-base font-medium text-[#160002] khmer-prose">
                  <strong className="text-[#007a49]">ចម្លើយត្រឹមត្រូវ៖ </strong>
                  {ex.type === "short-answer" ? (
                    <span className="font-mono font-bold">
                      {ex.expectedAnswers?.[0] || ""}
                    </span>
                  ) : ex.correctIndex !== undefined && ex.options?.[ex.correctIndex] !== undefined ? (
                    <span>
                      <strong>{String.fromCharCode(65 + ex.correctIndex)}.</strong>{" "}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
