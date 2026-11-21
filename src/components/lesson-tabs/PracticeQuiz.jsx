"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Lightbulb,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Clock,
  Trophy,
  Maximize2,
  X,
} from "lucide-react";
import MathText from "@/components/common/MathText";
import { useAuth } from "@/components/auth/AuthContext";
import { loadUserProgress, saveUserProgress } from "@/lib/userProgress";
import {
  getExercisesForRound,
  MAX_MASTERY_ROUNDS,
} from "@/lib/practiceGenerator";

const DIFFICULTY_BADGES = {
  Easy: {
    label: "ងាយ",
    classes: "bg-[#009b5e]/12 text-[#009b5e] border-[#009b5e]/30",
  },
  Medium: {
    label: "មធ្យម",
    classes: "bg-[#b95a00]/12 text-[#b95a00] border-[#b95a00]/30",
  },
  Hard: {
    label: "លំបាក",
    classes: "bg-[#db073d]/12 text-[#db073d] border-[#db073d]/30",
  },
};

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function PracticeQuiz({
  practiceExercises = [],
  progressKey = "",
}) {
  const { user } = useAuth();

  // Full-screen Glassmorphic Exam Layer state
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [slideDir, setSlideDir] = useState("next");

  // Round state: Round 1 = curated base set, Round 2+ = dynamically generated sets
  const [round, setRound] = useState(1);
  const [completedRounds, setCompletedRounds] = useState([]);
  const [roundStore, setRoundStore] = useState({});

  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showHints, setShowHints] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);

  // Exam mode navigation, timer, pause/resume
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeExercises = useMemo(
    () => getExercisesForRound(practiceExercises, progressKey, round),
    [practiceExercises, progressKey, round]
  );

  // Persist helper
  const persistState = useCallback(
    (overrides = {}) => {
      if (!progressKey) return;
      const nextRound = overrides.round ?? round;
      const nextAnswers = overrides.answers ?? answers;
      const nextChecked = overrides.checked ?? checked;
      const nextStore = {
        ...roundStore,
        [nextRound]: { answers: nextAnswers, checked: nextChecked },
      };
      const nextCompleted = overrides.completedRounds ?? completedRounds;
      const nextIndex = overrides.currentIndex ?? currentIndex;
      const nextPaused = overrides.isPaused ?? isPaused;
      const nextElapsed = overrides.elapsedSeconds ?? elapsedSeconds;
      const nextScore = Object.values(nextChecked).filter(Boolean).length;

      saveUserProgress(user?.id, progressKey, {
        answers: nextAnswers,
        checked: nextChecked,
        score: nextScore,
        total: activeExercises.length,
        round: nextRound,
        completedRounds: nextCompleted,
        roundStore: nextStore,
        currentIndex: nextIndex,
        isPaused: nextPaused,
        elapsedSeconds: nextElapsed,
      });
      setRoundStore(nextStore);
      setSavedNotice(true);
    },
    [
      progressKey,
      user?.id,
      round,
      answers,
      checked,
      roundStore,
      completedRounds,
      currentIndex,
      isPaused,
      elapsedSeconds,
      activeExercises.length,
    ]
  );

  // Load saved progress when switching sub-topic or user
  useEffect(() => {
    let cancelled = false;
    setIsExamOpen(false);
    setAnswers({});
    setChecked({});
    setShowHints({});
    setSavedNotice(false);
    setRound(1);
    setCompletedRounds([]);
    setRoundStore({});
    setCurrentIndex(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    setIsLoaded(false);

    if (!progressKey) {
      setIsLoaded(true);
      return;
    }

    loadUserProgress(user?.id, progressKey).then((data) => {
      if (cancelled) return;
      if (data) {
        const savedRound = data.round || 1;
        const savedStore = data.roundStore || {
          [savedRound]: {
            answers: data.answers || {},
            checked: data.checked || {},
          },
        };
        const currentRoundData = savedStore[savedRound] || {
          answers: data.answers || {},
          checked: data.checked || {},
        };

        setRound(savedRound);
        setRoundStore(savedStore);
        const loadedCompleted = Array.isArray(data.completedRounds)
          ? [...data.completedRounds]
          : [];
        const savedCorrectCount = Object.values(
          currentRoundData.checked || {}
        ).filter(Boolean).length;
        if (
          practiceExercises.length > 0 &&
          savedCorrectCount >= practiceExercises.length &&
          !loadedCompleted.includes(savedRound)
        ) {
          loadedCompleted.push(savedRound);
          loadedCompleted.sort((a, b) => a - b);
        }
        setCompletedRounds(loadedCompleted);
        setAnswers(currentRoundData.answers || {});
        setChecked(currentRoundData.checked || {});
        setCurrentIndex(
          typeof data.currentIndex === "number" ? data.currentIndex : 0
        );
        setIsPaused(Boolean(data.isPaused));
        setElapsedSeconds(
          typeof data.elapsedSeconds === "number" ? data.elapsedSeconds : 0
        );

        if (
          Object.keys(currentRoundData.checked || {}).length > 0 ||
          (data.elapsedSeconds || 0) > 0
        ) {
          setSavedNotice(true);
        }
      }
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [progressKey, user?.id, practiceExercises]);

  const totalCount = activeExercises.length;
  const checkedCount = Object.keys(checked).length;
  const correctCount = Object.values(checked).filter(Boolean).length;
  const isAllCorrect = totalCount > 0 && correctCount === totalCount;
  const isRoundFinished = totalCount > 0 && checkedCount === totalCount;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCount - 1));

  // Live timer ticks only while Full-Screen Exam is open, not paused, and not finished
  useEffect(() => {
    if (!isLoaded || !isExamOpen || isPaused || isRoundFinished || totalCount === 0) {
      return;
    }
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoaded, isExamOpen, isPaused, isRoundFinished, totalCount]);

  // Lock page scroll while Full-Screen Exam Layer is open
  useEffect(() => {
    if (!isExamOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isExamOpen]);

  const handleGoToQuestion = useCallback(
    (idx) => {
      if (idx < 0 || idx >= totalCount || idx === safeIndex) return;
      setSlideDir(idx > safeIndex ? "next" : "prev");
      setCurrentIndex(idx);
      persistState({ currentIndex: idx });
    },
    [totalCount, safeIndex, persistState]
  );

  const handleCloseExam = useCallback(() => {
    setIsExamOpen(false);
    // Auto-save timer and progress on exit
    persistState({ elapsedSeconds, isPaused: !isRoundFinished && elapsedSeconds > 0 ? true : isPaused });
  }, [persistState, elapsedSeconds, isRoundFinished, isPaused]);

  // Keyboard shortcuts inside Full-Screen Exam Layer
  useEffect(() => {
    if (!isExamOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseExam();
        return;
      }
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || isPaused) return;
      if (e.key === "ArrowRight") handleGoToQuestion(safeIndex + 1);
      if (e.key === "ArrowLeft") handleGoToQuestion(safeIndex - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExamOpen, isPaused, safeIndex, handleGoToQuestion, handleCloseExam]);

  if (!practiceExercises.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានលំហាត់អនុវត្តន៍សម្រាប់ផ្នែកនេះទេ។
      </div>
    );
  }

  const highestUnlockedRound = Math.max(
    1,
    ...(completedRounds.length ? completedRounds.map((r) => r + 1) : [1]),
    isAllCorrect ? round + 1 : round
  );

  const handleOpenExam = () => {
    setIsExamOpen(true);
    if (isPaused) {
      setIsPaused(false);
      persistState({ isPaused: false });
    }
  };

  const handleSelectOption = (exId, optIndex) => {
    if (checked[exId] !== undefined) return;
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
        (ans) =>
          String(ans).trim().toLowerCase().replace(/\s+/g, "") === normalized
      );
    } else {
      isCorrect = userAns === ex.correctIndex;
    }

    const nextChecked = { ...checked, [ex.id]: isCorrect };
    const nextCorrectCount = Object.values(nextChecked).filter(Boolean).length;
    let nextCompleted = completedRounds;
    if (nextCorrectCount === totalCount && !completedRounds.includes(round)) {
      nextCompleted = [...completedRounds, round].sort((a, b) => a - b);
      setCompletedRounds(nextCompleted);
    }

    setChecked(nextChecked);
    persistState({
      answers,
      checked: nextChecked,
      completedRounds: nextCompleted,
    });
  };

  const handleRetryOne = (exId) => {
    const nextAnswers = { ...answers };
    delete nextAnswers[exId];
    const nextChecked = { ...checked };
    delete nextChecked[exId];
    setAnswers(nextAnswers);
    setChecked(nextChecked);
    persistState({ answers: nextAnswers, checked: nextChecked });
  };

  const handleResetRound = () => {
    setAnswers({});
    setChecked({});
    setShowHints({});
    setCurrentIndex(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    persistState({
      answers: {},
      checked: {},
      currentIndex: 0,
      isPaused: false,
      elapsedSeconds: 0,
    });
  };

  const handleTogglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    persistState({ isPaused: nextPaused });
  };

  const handleSwitchRound = (targetRound) => {
    if (targetRound === round) return;
    const updatedStore = {
      ...roundStore,
      [round]: { answers, checked },
    };
    const targetData = updatedStore[targetRound] || { answers: {}, checked: {} };

    setRound(targetRound);
    setAnswers(targetData.answers || {});
    setChecked(targetData.checked || {});
    setShowHints({});
    setSlideDir("next");
    setCurrentIndex(0);
    setIsPaused(false);
    setElapsedSeconds(0);
    setRoundStore(updatedStore);

    if (progressKey) {
      const nextScore = Object.values(targetData.checked || {}).filter(
        Boolean
      ).length;
      saveUserProgress(user?.id, progressKey, {
        answers: targetData.answers || {},
        checked: targetData.checked || {},
        score: nextScore,
        total: totalCount,
        round: targetRound,
        completedRounds,
        roundStore: updatedStore,
        currentIndex: 0,
        isPaused: false,
        elapsedSeconds: 0,
      });
      setSavedNotice(true);
    }
  };

  const renderExerciseCard = (ex, idx, isGlass = false) => {
    const isChecked = checked[ex.id] !== undefined;
    const isCorrect = checked[ex.id] === true;
    const userAns = answers[ex.id];
    const hintVisible = !!showHints[ex.id];
    const diffBadge = DIFFICULTY_BADGES[ex.difficulty] || DIFFICULTY_BADGES.Medium;

    return (
      <div
        key={`${ex.id || idx}-${isGlass ? "glass" : "list"}`}
        className={
          isGlass
            ? `exam-glass-card rounded-3xl p-5 sm:p-7 space-y-5 ${
                slideDir === "next" ? "animate-slide-next" : "animate-slide-prev"
              }`
            : "rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs space-y-4"
        }
      >
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffe9e8] border border-[#fdbcbc] px-3 py-1 text-xs font-bold text-[#7e021f]">
              <HelpCircle className="h-3.5 w-3.5 text-[#db073d]" />
              លំហាត់ទី {idx + 1} / {totalCount}
            </span>
            <span
              className={`inline-flex items-center rounded-xl border px-2.5 py-1 text-[11px] font-bold ${diffBadge.classes}`}
            >
              កម្រិត៖ {diffBadge.label}
            </span>
          </div>

          {ex.hint && (
            <button
              type="button"
              onClick={() =>
                setShowHints((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0097a8]/35 bg-[#0097a8]/10 px-3 py-1 text-xs font-bold text-[#0097a8] hover:bg-[#0097a8]/20 active:scale-95 transition-all"
            >
              <Lightbulb
                className={`h-3.5 w-3.5 ${hintVisible ? "animate-icon-pop" : ""}`}
              />
              {hintVisible ? "លាក់គន្លឹះ" : "មើលគន្លឹះ"}
            </button>
          )}
        </div>

        {/* Question Prompt */}
        <div className="text-base md:text-lg font-bold text-[#160002] khmer-prose leading-relaxed">
          <MathText text={ex.question} />
        </div>

        {/* Optional Hint Box */}
        {hintVisible && ex.hint && (
          <div className="animate-hint-pop rounded-2xl border border-[#0097a8]/30 bg-[#0097a8]/10 p-3.5 text-sm font-medium text-[#160002] khmer-prose">
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isChecked && userAns) {
                  handleCheck(ex);
                }
              }}
              placeholder={ex.placeholder || "បញ្ចូលចម្លើយរបស់អ្នក..."}
              className="w-full sm:max-w-md rounded-2xl border border-[#fdbcbc] bg-white/90 px-4 py-3 font-mono text-sm font-bold text-[#160002] focus:border-[#db073d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#db073d]/20 disabled:opacity-75 transition-all"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(ex.options || []).map((opt, optIdx) => {
              const isSelected = userAns === optIdx;
              const isRightOption = optIdx === ex.correctIndex;

              let optionStyle =
                "border-[#ffd3d2] bg-white/75 text-[#160002] hover:border-[#db073d] hover:bg-[#ffe9e8]/60 hover:-translate-y-0.5 hover:shadow-xs";
              if (isChecked) {
                if (isRightOption) {
                  optionStyle =
                    "border-[#009b5e] bg-[#009b5e]/12 text-[#160002] ring-1 ring-[#009b5e] animate-option-pop";
                } else if (isSelected && !isRightOption) {
                  optionStyle =
                    "border-[#db073d] bg-[#ffe9e8] text-[#7e021f] ring-1 ring-[#db073d]";
                } else {
                  optionStyle = "border-[#ffd3d2] bg-white/50 text-[#47010d] opacity-65";
                }
              } else if (isSelected) {
                optionStyle =
                  "border-[#db073d] bg-[#ffe9e8]/90 text-[#7e021f] ring-2 ring-[#db073d]/30 animate-option-pop";
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isChecked}
                  onClick={() => handleSelectOption(ex.id, optIdx)}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 sm:p-4 text-left text-sm md:text-base font-medium transition-all duration-150 active:scale-[0.98] khmer-prose ${optionStyle}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isChecked && isRightOption
                        ? "bg-[#009b5e] text-white"
                        : isChecked && isSelected && !isRightOption
                        ? "bg-[#db073d] text-white"
                        : isSelected
                        ? "bg-[#db073d] text-white scale-105"
                        : "bg-white border border-[#fdbcbc] text-[#7e021f]"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <MathText text={opt} />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {!isChecked ? (
              <button
                type="button"
                disabled={userAns === undefined || userAns === ""}
                onClick={() => handleCheck(ex)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#db073d] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] hover:shadow-md active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                ផ្ទៀងផ្ទាត់ចម្លើយ
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRetryOne(ex.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white/90 px-4 py-2 text-xs sm:text-sm font-bold text-[#160002] hover:bg-[#ffe9e8] active:scale-95 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                សាកល្បងលំហាត់នេះម្តងទៀត
              </button>
            )}
          </div>

          {isGlass && isChecked && safeIndex < totalCount - 1 && (
            <button
              type="button"
              onClick={() => handleGoToQuestion(safeIndex + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#009b5e] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#00824f] active:scale-95 transition-all animate-option-pop"
            >
              លំហាត់បន្ទាប់
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Verification Feedback & Explanation */}
        {isChecked && (
          <div
            className={`animate-step-reveal rounded-2xl border p-4 text-sm khmer-prose space-y-1.5 ${
              isCorrect
                ? "border-[#009b5e]/40 bg-[#009b5e]/10 text-[#160002]"
                : "border-[#db073d]/40 bg-[#ffe9e8]/90 text-[#160002]"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#009b5e] animate-icon-pop" />
                  <span className="text-[#009b5e]">ត្រឹមត្រូវ! (Correct)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#db073d] animate-icon-pop" />
                  <span className="text-[#db073d]">
                    មិនទាន់ត្រឹមត្រូវទេ — សូមពិនិត្យការពន្យល់ខាងក្រោម
                  </span>
                </>
              )}
            </div>
            {ex.explanation && (
              <p className="text-[#160002] leading-relaxed">
                <strong className="text-[#9c0329]">ការពន្យល់៖ </strong>
                <MathText text={ex.explanation} />
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const firstWrongIndex = activeExercises.findIndex(
    (ex) => checked[ex.id] === false
  );

  const renderMasteryBanner = () => {
    if (isAllCorrect) {
      return (
        <div className="animate-panel-enter rounded-2xl border border-[#009b5e]/40 bg-gradient-to-r from-[#009b5e]/14 via-white/90 to-[#009b5e]/10 backdrop-blur-md p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#009b5e] text-white shadow-xs animate-icon-pop">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#009b5e]">
                អបអរសាទរ! អ្នកធ្វើត្រូវទាំងអស់ {correctCount} / {totalCount} ក្នុងជុំទី {round}!
              </h4>
              <p className="text-xs sm:text-sm text-[#160002]">
                {round < MAX_MASTERY_ROUNDS
                  ? `អ្នកបានដោះសោជុំទី ${round + 1} (លំហាត់បំប្លែងថ្មី ៦ លំហាត់បង្កើតដោយស្វ័យប្រវត្តិ)។`
                  : `អ្នកបានសម្រេចគោលដៅជំនាញគ្រប់ ${MAX_MASTERY_ROUNDS} ជុំ (${MAX_MASTERY_ROUNDS * totalCount} លំហាត់) ហើយ!`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSwitchRound(round + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#009b5e] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#00824f] active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            {round < MAX_MASTERY_ROUNDS
              ? `បន្តទៅជុំទី ${round + 1} (លំហាត់ថ្មី)`
              : `បង្កើតជុំហ្វឹកហាត់បន្ថែម (ជុំទី ${round + 1})`}
          </button>
        </div>
      );
    }

    if (isRoundFinished && !isAllCorrect) {
      return (
        <div className="animate-panel-enter rounded-2xl border border-[#b95a00]/35 bg-[#b95a00]/10 backdrop-blur-md p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-sm sm:text-base font-bold text-[#b95a00]">
              អ្នកបានបញ្ចប់ជុំទី {round} ({correctCount} / {totalCount} ត្រឹមត្រូវ)
            </h4>
            <p className="text-xs sm:text-sm text-[#160002]">
              សូមកែលំហាត់ដែលខុសឱ្យត្រូវទាំងអស់ {totalCount}/{totalCount} ដើម្បីដោះសោជុំទី {round + 1} (ប្រព័ន្ធនឹងបង្កើតលំហាត់ថ្មីដោយស្វ័យប្រវត្តិ)។
            </p>
          </div>
          {firstWrongIndex !== -1 && (
            <button
              type="button"
              onClick={() => {
                if (isExamOpen) {
                  handleGoToQuestion(firstWrongIndex);
                } else {
                  setCurrentIndex(firstWrongIndex);
                  setIsExamOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#b95a00] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#9a4b00] active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              ទៅកែលំហាត់ទី {firstWrongIndex + 1}
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const renderRoundPills = () => (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from(
        { length: Math.max(MAX_MASTERY_ROUNDS, highestUnlockedRound) },
        (_, i) => i + 1
      ).map((r) => {
        const isCompleted = completedRounds.includes(r);
        const isUnlocked = r <= highestUnlockedRound;
        const isCurrent = r === round;
        const roundLabel =
          r === 1 ? "មូលដ្ឋាន" : r === 2 ? "បំប្លែង" : r === 3 ? "ជំនាញ" : "បន្ថែម";

        return (
          <button
            key={r}
            type="button"
            disabled={!isUnlocked}
            onClick={() => handleSwitchRound(r)}
            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold active:scale-95 transition-all ${
              isCurrent
                ? "bg-[#db073d] text-white shadow-xs"
                : isCompleted
                ? "border border-[#009b5e]/40 bg-[#009b5e]/12 text-[#009b5e] hover:bg-[#009b5e]/20"
                : isUnlocked
                ? "border border-[#fdbcbc] bg-white/85 text-[#7e021f] hover:bg-[#ffe9e8]"
                : "border border-[#ffd3d2] bg-white/45 text-[#7e021f]/40 cursor-not-allowed"
            }`}
          >
            {isCompleted && <CheckCircle2 className="h-3 w-3" />}
            ជុំទី {r} ({roundLabel})
          </button>
        );
      })}
    </div>
  );

  const hasSavedExamSession = elapsedSeconds > 0 && !isRoundFinished;

  return (
    <div className="space-y-5">
      {/* Main Practice Scoreboard & Full-Screen Exam Launcher */}
      <div className="rounded-2xl border border-[#fdbcbc] bg-[#ffe9e8]/70 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#160002]">
                លំហាត់អនុវត្តន៍ និងតេស្តសាកល្បង
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#7e021f]">
                ជុំទី {round} • បានផ្ទៀងផ្ទាត់៖ {checkedCount} / {totalCount} • ពិន្ទុ៖{" "}
                <span className="text-[#009b5e] font-bold">
                  {correctCount} / {totalCount}
                </span>
                {savedNotice && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-[#009b5e]/12 px-2 py-0.5 text-[11px] font-bold text-[#009b5e]">
                    បានរក្សាទុក ✓
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Launch Full-Screen Glassmorphic Exam Layer */}
            <button
              type="button"
              onClick={handleOpenExam}
              className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Maximize2 className="h-4 w-4" />
              {hasSavedExamSession
                ? `បន្តប្រឡង Full Screen (${formatTime(elapsedSeconds)})`
                : "បើករបៀបប្រឡង Full Screen"}
            </button>

            <button
              type="button"
              onClick={handleResetRound}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white px-3.5 py-2 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              ធ្វើជុំនេះឡើងវិញ
            </button>
          </div>
        </div>

        {/* Mastery Round Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#fdbcbc]/60 pt-3">
          {renderRoundPills()}
          <span className="text-[11px] font-semibold text-[#7e021f]/80">
            ធ្វើត្រូវ ១០០% ដើម្បីដោះសោជុំលំហាត់បំប្លែងថ្មី
          </span>
        </div>
      </div>

      {renderMasteryBanner()}

      {/* In-Page Clean List of Exercises */}
      <div className="space-y-5">
        {activeExercises.map((ex, idx) => renderExerciseCard(ex, idx, false))}
      </div>

      {/* ================================================================= */}
      {/* FULL-SCREEN GLASSMORPHIC EXAM LAYER (Mounted to document.body)    */}
      {/* ================================================================= */}
      {isExamOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col exam-glass-overlay animate-exam-overlay overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="របៀបប្រឡងសាកល្បងពេញអេក្រង់"
          >
          {/* Ambient Soft Floating Glow Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#db073d]/10 blur-3xl" />
            <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[#0097a8]/10 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-[#009b5e]/10 blur-3xl" />
          </div>

          {/* Floating iOS-Glass Top Header Bar */}
          <div className="sticky top-0 z-20 px-3 pt-3 sm:px-6 sm:pt-4">
            <div className="mx-auto max-w-4xl rounded-2xl ios-glass px-3.5 py-2.5 sm:px-5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#160002] truncate">
                    របៀបប្រឡងសាកល្បង • ជុំទី {round}
                  </div>
                  <div className="text-[11px] font-semibold text-[#7e021f]">
                    ពិន្ទុ៖{" "}
                    <span className="text-[#009b5e] font-bold">
                      {correctCount}/{totalCount}
                    </span>{" "}
                    • បានធ្វើ {checkedCount}/{totalCount}
                  </div>
                </div>
              </div>

              {/* Center Timer Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd3d2] bg-white/80 px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-[#160002] shadow-2xs">
                <Clock className="h-4 w-4 text-[#db073d]" />
                <span>{formatTime(elapsedSeconds)}</span>
                {isPaused && (
                  <span className="ml-1 rounded-md bg-[#b95a00]/15 px-1.5 py-0.5 text-[10px] font-sans text-[#b95a00]">
                    ផ្អាក
                  </span>
                )}
              </div>

              {/* Right Controls: Pause, Reset, Exit */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {!isRoundFinished && (
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#fdbcbc] bg-white/85 px-3 py-1.5 text-xs font-bold text-[#9c0329] hover:bg-[#ffe9e8] active:scale-95 transition-all"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-3.5 w-3.5 text-[#009b5e]" />
                        <span className="hidden sm:inline">បន្ត</span>
                      </>
                    ) : (
                      <>
                        <Pause className="h-3.5 w-3.5 text-[#db073d]" />
                        <span className="hidden sm:inline">ផ្អាក</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetRound}
                  className="inline-flex items-center justify-center rounded-xl border border-[#ffd3d2] bg-white/80 p-2 text-[#47010d] hover:bg-[#ffe9e8] active:scale-95 transition-all"
                  title="ធ្វើជុំនេះឡើងវិញ"
                  aria-label="ធ្វើជុំនេះឡើងវិញ"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCloseExam}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#fdbcbc] bg-white/90 px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#ffe9e8] hover:text-[#db073d] active:scale-95 transition-all"
                  aria-label="ចាកចេញពីរបៀបប្រឡង"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">ចាកចេញ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Centered Floating Exam Stage */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-3 py-5 sm:px-6 sm:py-8">
            <div className="mx-auto w-full max-w-3xl space-y-4">
              {/* Round Pills + Progress Strip */}
              <div className="exam-glass-card rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {renderRoundPills()}
                  <span className="text-xs font-bold text-[#7e021f]">
                    {Math.round((checkedCount / Math.max(1, totalCount)) * 100)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#ffe9e8]/90">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#db073d] to-[#ff4d79] transition-all duration-500 ease-out"
                    style={{
                      width: `${(checkedCount / Math.max(1, totalCount)) * 100}%`,
                    }}
                  />
                </div>

                {/* Numbered Question Navigator */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeExercises.map((ex, idx) => {
                      const st = checked[ex.id];
                      const isActive = idx === safeIndex;
                      let pillClass =
                        "border-[#ffd3d2] bg-white/80 text-[#47010d] hover:bg-[#ffe9e8] hover:scale-105";
                      if (st === true) {
                        pillClass = "border-[#009b5e] bg-[#009b5e] text-white";
                      } else if (st === false) {
                        pillClass = "border-[#db073d] bg-[#db073d] text-white";
                      }
                      return (
                        <button
                          key={ex.id || idx}
                          type="button"
                          onClick={() => handleGoToQuestion(idx)}
                          className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-bold active:scale-90 transition-all ${pillClass} ${
                            isActive
                              ? "ring-2 ring-[#db073d] ring-offset-2 scale-105"
                              : ""
                          }`}
                          title={`លំហាត់ទី ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[11px] font-semibold text-[#7e021f]/80">
                    លំដាប់៖ ងាយ → មធ្យម → លំបាក
                  </span>
                </div>
              </div>

              {renderMasteryBanner()}

              {/* Paused Glass Card OR Active Floating Glass Question Card */}
              {isPaused ? (
                <div className="exam-glass-card rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-panel-enter">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffe9e8] text-[#db073d] border border-[#fdbcbc] shadow-xs animate-icon-pop">
                    <Pause className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-bold text-[#160002]">
                      ការប្រឡងសាកល្បងត្រូវបានផ្អាក
                    </h4>
                    <p className="text-sm text-[#47010d] max-w-md mx-auto">
                      វឌ្ឍនភាពជុំទី {round} (លំហាត់ទី {safeIndex + 1}/{totalCount} • ពេលវេលា{" "}
                      <span className="font-mono font-bold">
                        {formatTime(elapsedSeconds)}
                      </span>
                      ) ត្រូវបានរក្សាទុករួចរាល់។ អ្នកអាចសម្រាក ឬចាកចេញហើយត្រឡប់មកបន្តពេលក្រោយបាន។
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleTogglePause}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#db073d] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#bb0533] hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                      <Play className="h-4 w-4" />
                      បន្តការប្រឡង
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseExam}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#fdbcbc] bg-white/85 px-5 py-3 text-sm font-bold text-[#47010d] hover:bg-[#ffe9e8] active:scale-95 transition-all"
                    >
                      ចាកចេញសិន (រក្សាទុក)
                    </button>
                  </div>
                </div>
              ) : (
                activeExercises[safeIndex] &&
                renderExerciseCard(activeExercises[safeIndex], safeIndex, true)
              )}

              {/* Floating Bottom Prev / Next Bar */}
              {!isPaused && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    disabled={safeIndex === 0}
                    onClick={() => handleGoToQuestion(safeIndex - 1)}
                    className="inline-flex items-center gap-1.5 rounded-2xl exam-glass-card px-4 py-2.5 text-xs sm:text-sm font-bold text-[#160002] hover:bg-[#ffe9e8]/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4 text-[#db073d]" />
                    លំហាត់មុន
                  </button>

                  <span className="text-xs font-bold text-[#7e021f]">
                    {safeIndex + 1} / {totalCount}
                  </span>

                  <button
                    type="button"
                    disabled={safeIndex >= totalCount - 1}
                    onClick={() => handleGoToQuestion(safeIndex + 1)}
                    className="inline-flex items-center gap-1.5 rounded-2xl exam-glass-card px-4 py-2.5 text-xs sm:text-sm font-bold text-[#160002] hover:bg-[#ffe9e8]/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    លំហាត់បន្ទាប់
                    <ChevronRight className="h-4 w-4 text-[#db073d]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
