"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MousePointer,
  PenTool,
  Sparkles,
  Trash2,
  StickyNote,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import MathText from "@/components/common/MathText";
import SlideGraph from "@/components/lesson-tabs/SlideGraph";

const PEN_COLORS = [
  { id: "crimson", value: "#db073d", label: "ក្រហមដិត" },
  { id: "teal", value: "#0097a8", label: "ខៀវបៃតង" },
  { id: "amber", value: "#b95a00", label: "ទឹកក្រូច" },
];

const SLIDE_TYPE_META = {
  objective: {
    label: "គោលបំណងសិក្សា",
    bg: "bg-[#0085dd]",
    softBg: "bg-[#0085dd]/10 border-[#0085dd]/30",
    accent: "from-[#0085dd] via-[#0097a8] to-[#db073d]",
    icon: Target,
  },
  intuition: {
    label: "គោលគំនិត (Concept)",
    bg: "bg-[#0097a8]",
    softBg: "bg-[#0097a8]/10 border-[#0097a8]/30",
    accent: "from-[#0097a8] via-[#0085dd] to-[#009b5e]",
    icon: Lightbulb,
  },
  definition: {
    label: "និយមន័យ និងទ្រឹស្តីបទ",
    bg: "bg-[#db073d]",
    softBg: "bg-[#ffe9e8] border-[#fdbcbc]",
    accent: "from-[#db073d] via-[#cc1a8b] to-[#0097a8]",
    icon: BookOpen,
  },
  example: {
    label: "លំហាត់គំរូក្នុងថ្នាក់",
    bg: "bg-[#009b5e]",
    softBg: "bg-[#009b5e]/10 border-[#009b5e]/30",
    accent: "from-[#009b5e] via-[#0097a8] to-[#0085dd]",
    icon: CheckCircle2,
  },
  practice: {
    label: "លំហាត់អនុវត្តន៍សម្រាប់និស្សិត",
    bg: "bg-[#b95a00]",
    softBg: "bg-[#b95a00]/10 border-[#b95a00]/30",
    accent: "from-[#b95a00] via-[#db073d] to-[#cc1a8b]",
    icon: HelpCircle,
  },
  summary: {
    label: "សង្ខេប និងចំណុចគួរប្រយ័ត្ន",
    bg: "bg-[#7950ee]",
    softBg: "bg-[#7950ee]/10 border-[#7950ee]/30",
    accent: "from-[#7950ee] via-[#db073d] to-[#0097a8]",
    icon: Sparkles,
  },
};

export default function SlideViewer({ slides = [], lessonTitle = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [tool, setTool] = useState("pointer"); // "pointer" | "laser" | "pen"
  const [penColor, setPenColor] = useState(PEN_COLORS[0].value);
  const [laserPos, setLaserPos] = useState(null);

  // Pedagogical interactive states per slide
  const [navDirection, setNavDirection] = useState("next");
  const [revealedStepsCount, setRevealedStepsCount] = useState(0);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setRevealedStepsCount(0);
    setShowPracticeAnswer(false);
    clearCanvas();
  }, [slides, clearCanvas]);

  useEffect(() => {
    setRevealedStepsCount(0);
    setShowPracticeAnswer(false);
  }, [currentIndex]);

  const totalSlides = slides.length;
  const activeSlide = slides[currentIndex] || null;

  useEffect(() => {
    setRevealedStepsCount(0);
    setShowPracticeAnswer(false);
  }, [currentIndex, slides]);
  const slideMeta =
    SLIDE_TYPE_META[activeSlide?.slideType] || SLIDE_TYPE_META.definition;
  const SlideTypeIcon = slideMeta.icon;

  const goPrev = useCallback(() => {
    setNavDirection("prev");
    setCurrentIndex((prev) => {
      if (prev > 0) {
        clearCanvas();
        return prev - 1;
      }
      return prev;
    });
  }, [clearCanvas]);

  const goNext = useCallback(() => {
    setNavDirection("next");
    setCurrentIndex((prev) => {
      if (prev < totalSlides - 1) {
        clearCanvas();
        return prev + 1;
      }
      return prev;
    });
  }, [totalSlides, clearCanvas]);

  useEffect(() => {
    const syncSize = () => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;
      const rect = stage.getBoundingClientRect();
      if (
        canvas.width !== Math.floor(rect.width) ||
        canvas.height !== Math.floor(rect.height)
      ) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
      }
    };
    syncSize();
    window.addEventListener("resize", syncSize);
    return () => window.removeEventListener("resize", syncSize);
  }, [isFullscreen, currentIndex, revealedStepsCount, showPracticeAnswer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, isFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current?.requestFullscreen) {
        try {
          await containerRef.current.requestFullscreen();
        } catch {
          // Fallback to fixed overlay fullscreen
        }
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // ignore
        }
      }
    }
  };

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    if (tool !== "pen" || !canvasRef.current) return;
    isDrawingRef.current = true;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const handlePointerMove = (e) => {
    if (!stageRef.current) return;
    if (tool === "laser") {
      const rect = stageRef.current.getBoundingClientRect();
      setLaserPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setLaserPos(null);
    }

    if (tool === "pen" && isDrawingRef.current && canvasRef.current) {
      const { x, y } = getCoords(e);
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  if (!activeSlide) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានស្លាយបង្រៀនសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  const exampleSteps = activeSlide.exampleSteps || [];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen overflow-hidden bg-[#160002] p-3 md:p-5 gap-3"
          : "gap-4"
      }`}
    >
      {/* Presentation Toolbar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 ${
          isFullscreen
            ? "border-[#47010d] bg-[#2d0006] text-white"
            : "border-[#ffd3d2] bg-white text-[#160002] shadow-xs"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-[#ffe9e8] border border-[#fdbcbc] px-2.5 py-1 text-xs font-bold text-[#7e021f]">
            ស្លាយ {currentIndex + 1} / {totalSlides}
          </span>
          {isFullscreen && lessonTitle && (
            <span className="hidden sm:inline text-sm font-bold text-[#ffe9e8] truncate max-w-xs">
              {lessonTitle}
            </span>
          )}
        </div>

        {/* Annotation & Presentation Tools */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool("pointer")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              tool === "pointer"
                ? "bg-[#db073d] text-white"
                : isFullscreen
                ? "hover:bg-[#47010d] text-[#ffe9e8]"
                : "hover:bg-[#ffe9e8] text-[#160002]"
            }`}
            title="ទ្រនិចធម្មតា (Pointer)"
          >
            <MousePointer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ទ្រនិច</span>
          </button>

          <button
            type="button"
            onClick={() => setTool("laser")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              tool === "laser"
                ? "bg-[#db073d] text-white"
                : isFullscreen
                ? "hover:bg-[#47010d] text-[#ffe9e8]"
                : "hover:bg-[#ffe9e8] text-[#160002]"
            }`}
            title="ឡាស៊ែរ (Laser Pointer)"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ឡាស៊ែរ</span>
          </button>

          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              tool === "pen"
                ? "bg-[#b95a00] text-white"
                : isFullscreen
                ? "hover:bg-[#47010d] text-[#ffe9e8]"
                : "hover:bg-[#ffe9e8] text-[#160002]"
            }`}
            title="ប៊ិកគូសចំណាំ (Pen)"
          >
            <PenTool className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">គូសចំណាំ</span>
          </button>

          {tool === "pen" && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#fdbcbc]">
              {PEN_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPenColor(c.value)}
                  className={`h-5 w-5 rounded-full border-2 transition ${
                    penColor === c.value
                      ? "border-[#160002] scale-110 ring-2 ring-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={clearCanvas}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              isFullscreen
                ? "hover:bg-[#47010d] text-[#ffe9e8]"
                : "hover:bg-[#ffe9e8] text-[#47010d]"
            }`}
            title="លុបគំនូស (Clear Annotations)"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-[#fdbcbc] mx-1" />

          <button
            type="button"
            onClick={() => setShowNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              showNotes
                ? "bg-[#0097a8] text-white"
                : isFullscreen
                ? "hover:bg-[#47010d] text-[#ffe9e8]"
                : "hover:bg-[#ffe9e8] text-[#160002]"
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span className="hidden md:inline">ការពន្យល់បន្ថែម</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              isFullscreen
                ? "bg-[#db073d] text-white hover:bg-[#bb0533]"
                : "bg-[#160002] text-white hover:bg-[#2d0006]"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ចេញពីពេញអេក្រង់</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ពេញអេក្រង់</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div
        ref={stageRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          handlePointerUp();
          setLaserPos(null);
        }}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
          isFullscreen
            ? "flex-1 min-h-0 overflow-y-auto border-[#47010d] p-8 md:p-14 flex flex-col justify-center"
            : "min-h-[420px] md:min-h-[480px] border-[#ffd3d2] p-6 md:p-10 flex flex-col justify-center"
        } ${tool === "pen" ? "cursor-crosshair" : tool === "laser" ? "cursor-none" : ""}`}
      >
        {/* Top Accent Strip */}
        <div
          className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${slideMeta.accent}`}
        />

        {/* Subtle Decorative Watermark Grid */}
        <div
          className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #db073d 0%, transparent 70%)" }}
        />

        {/* Slide Body with automatic modern transition & staggered object assembly */}
        <div
          key={`${activeSlide.slideNumber || currentIndex}-${currentIndex}-${isFullscreen ? "fs" : "norm"}`}
          className={`${
            navDirection === "prev" ? "animate-slide-prev" : "animate-slide-next"
          } relative z-10 mx-auto w-full select-text my-auto ${
            isFullscreen ? "max-w-none px-2 md:px-10 space-y-7 md:space-y-9" : "max-w-5xl space-y-5"
          }`}
        >
          {/* Pedagogical Badge Row */}
          <div
            className="animate-obj-up flex flex-wrap items-center justify-between gap-2"
            style={{ animationDelay: "40ms" }}
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full font-bold text-white shadow-2xs ${slideMeta.bg} ${
                isFullscreen ? "px-4 py-1.5 text-sm md:text-base" : "px-3 py-1 text-xs"
              }`}
            >
              <SlideTypeIcon className={isFullscreen ? "h-4 w-4 md:h-5 md:w-5" : "h-3.5 w-3.5"} />
              {slideMeta.label}
            </span>
            <span className={`font-bold text-[#7e021f] ${isFullscreen ? "text-sm md:text-base" : "text-xs"}`}>
              ស្លាយទី {activeSlide.slideNumber || currentIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Slide Heading */}
          <h2
            className={`animate-obj-up font-bold text-[#160002] khmer-prose ${
              isFullscreen ? "text-3xl md:text-5xl leading-snug" : "text-xl md:text-2xl"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            <MathText text={activeSlide.heading} />
          </h2>

          {/* Optional Highlighted Formula Box */}
          {activeSlide.formulaBox && (
            <div
              className={`animate-obj-scale rounded-2xl border text-[#160002] shadow-2xs ${slideMeta.softBg} ${
                isFullscreen ? "p-5 md:p-7" : "p-4 md:p-5"
              }`}
              style={{ animationDelay: "170ms" }}
            >
              <div
                className={`khmer-prose font-semibold ${
                  isFullscreen ? "text-xl md:text-3xl" : "text-base md:text-lg"
                }`}
              >
                <MathText text={activeSlide.formulaBox} />
              </div>
            </div>
          )}

          {/* Bullets + Optional Visual Graph (2-column when graph is present) */}
          <div
            className={
              activeSlide.visualGraph
                ? "grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center"
                : ""
            }
          >
            {(activeSlide.bullets || []).length > 0 && (
              <ul
                className={`${
                  isFullscreen ? "space-y-5 md:space-y-6" : "space-y-3.5"
                } ${activeSlide.visualGraph ? "lg:col-span-7" : ""}`}
              >
                {activeSlide.bullets.map((bullet, idx) => (
                  <li
                    key={`${currentIndex}-b-${idx}`}
                    className={`animate-obj-bullet flex items-start gap-4 text-[#160002] khmer-prose ${
                      isFullscreen ? "text-xl md:text-3xl leading-relaxed" : "text-base md:text-lg"
                    }`}
                    style={{ animationDelay: `${220 + idx * 90}ms` }}
                  >
                    <span
                      className={`shrink-0 rounded-full bg-[#db073d] ${
                        isFullscreen ? "mt-3.5 h-3.5 w-3.5" : "mt-2.5 h-2.5 w-2.5"
                      }`}
                    />
                    <div className="flex-1">
                      <MathText text={bullet} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {activeSlide.visualGraph && (
              <div
                className="animate-obj-right relative z-30 lg:col-span-5"
                style={{ animationDelay: "260ms" }}
              >
                <SlideGraph
                  visualGraph={activeSlide.visualGraph}
                  height={isFullscreen ? 400 : 250}
                />
              </div>
            )}
          </div>

          {/* Optional Interactive Step-by-Step Worked Example on Slide */}
          {exampleSteps.length > 0 && (
            <div className="relative z-30 rounded-2xl border border-[#009b5e]/30 bg-[#009b5e]/5 p-4 md:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#009b5e]">
                  ដំណោះស្រាយតាមជំហាន ({revealedStepsCount} / {exampleSteps.length})
                </span>
                <div className="flex items-center gap-2">
                  {revealedStepsCount < exampleSteps.length ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedStepsCount((c) =>
                            Math.min(c + 1, exampleSteps.length)
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#009b5e] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        បង្ហាញជំហានបន្ទាប់
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedStepsCount(exampleSteps.length)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#009b5e]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#009b5e]/10 transition"
                      >
                        បង្ហាញទាំងអស់
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRevealedStepsCount(0)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#009b5e]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#160002] hover:bg-[#009b5e]/10 transition"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      លាក់ជំហាន
                    </button>
                  )}
                </div>
              </div>

              {revealedStepsCount > 0 && (
                <div className="space-y-2.5">
                  {exampleSteps.slice(0, revealedStepsCount).map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className={`rounded-xl border border-[#009b5e]/25 bg-white font-medium text-[#160002] khmer-prose ${
                        isFullscreen ? "p-4 md:p-5 text-lg md:text-2xl" : "p-3.5 text-sm md:text-base"
                      }`}
                    >
                      <MathText text={step} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Optional Quick Practice Answer Toggle on Slide */}
          {activeSlide.practiceAnswer && (
            <div className="relative z-30 pt-1 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowPracticeAnswer((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#b95a00] px-4 py-2 text-xs md:text-sm font-bold text-white shadow-xs hover:opacity-90 transition"
              >
                {showPracticeAnswer ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    លាក់ចម្លើយផ្ទៀងផ្ទាត់
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    បង្ហាញចម្លើយផ្ទៀងផ្ទាត់
                  </>
                )}
              </button>

              {showPracticeAnswer && (
                <div
                  className={`rounded-xl border border-[#b95a00]/40 bg-[#b95a00]/10 font-medium text-[#160002] khmer-prose ${
                    isFullscreen ? "p-5 text-lg md:text-2xl" : "p-4 text-sm md:text-base"
                  }`}
                >
                  <MathText text={activeSlide.practiceAnswer} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawing Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 z-20 ${
            tool === "pen" ? "pointer-events-auto" : "pointer-events-none"
          }`}
        />

        {/* Laser Pointer Dot */}
        {tool === "laser" && laserPos && (
          <div
            className="pointer-events-none absolute z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#db073d] shadow-[0_0_16px_6px_rgba(219,7,61,0.75)]"
            style={{ left: laserPos.x, top: laserPos.y }}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[#fdbcbc] bg-white px-4 py-2.5 text-sm font-bold text-[#160002] shadow-xs transition hover:bg-[#ffe9e8] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          ស្លាយមុន
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                clearCanvas();
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-[#db073d]"
                  : "w-2.5 bg-[#faa6a6] hover:bg-[#e33f52]"
              }`}
              aria-label={`ទៅស្លាយទី ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex === totalSlides - 1}
          className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#bb0533] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ស្លាយបន្ទាប់
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Teacher Notes */}
      {showNotes && activeSlide.teacherNotes && (
        <div
          className={`rounded-xl border border-[#fdbcbc] bg-[#ffe9e8] text-[#160002] ${
            isFullscreen ? "px-4 py-2.5" : "p-4"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9c0329] mb-1">
            <StickyNote className="h-4 w-4" />
            ការពន្យល់បន្ថែមតាមស្លាយ (Slide Explanation &amp; Teaching Notes)
          </div>
          <p
            className={`font-medium khmer-prose text-[#2d0006] ${
              isFullscreen ? "text-xs md:text-sm" : "text-sm md:text-base"
            }`}
          >
            <MathText text={activeSlide.teacherNotes} />
          </p>
        </div>
      )}
    </div>
  );
}
