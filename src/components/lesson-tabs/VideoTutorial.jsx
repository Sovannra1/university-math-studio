"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Play,
  Clock,
  Film,
  Maximize2,
  X,
  Sparkles,
  ExternalLink,
  ListVideo,
  Moon,
  Sun,
  Clapperboard,
  Tv,
  ChevronRight,
} from "lucide-react";

/**
 * Converts "MM:SS" or "HH:MM:SS" into total seconds.
 */
function parseTimestampToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const parts = timeStr.trim().split(":").map((n) => parseInt(n, 10));
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/**
 * Normalizes video items across all lesson schemas (title/titleKh, timestamps/outline, etc.)
 */
function normalizeVideo(raw, idx, fallbackTitle) {
  const youtubeId =
    typeof raw?.youtubeId === "string" ? raw.youtubeId.trim() : "";
  const isAvailable =
    youtubeId.length >= 8 &&
    youtubeId !== "VIDEO_ID_HERE" &&
    !youtubeId.includes(" ");

  const title =
    raw?.titleKh ||
    raw?.title ||
    fallbackTitle ||
    `វីដេអូបង្រៀនទី ${idx + 1}`;
  const description = raw?.descriptionKh || raw?.description || "";
  const duration = raw?.duration || "";

  let chapters = [];
  if (Array.isArray(raw?.timestamps) && raw.timestamps.length > 0) {
    chapters = raw.timestamps.map((ts) => ({
      time: ts.time || "00:00",
      label: ts.label || "",
    }));
  } else if (Array.isArray(raw?.outline) && raw.outline.length > 0) {
    chapters = raw.outline.map((line) => {
      const m = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—:]\s*(.+)$/.exec(
        String(line).trim()
      );
      if (m) return { time: m[1], label: m[2] };
      return { time: "", label: String(line).trim() };
    });
  }

  return {
    id: raw?.id || `vid-${idx}`,
    youtubeId,
    isAvailable,
    title,
    description,
    duration,
    chapters,
  };
}

/**
 * Reusable Dark Cinema "In Production / Coming Soon" Stage Screen
 */
function ComingSoonStage({ title, subTopicTitle, description, duration, compact = false }) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden flex flex-col items-center justify-center text-center select-none bg-[#0b0608] ${
        compact ? "p-5 sm:p-8" : "p-6 sm:p-10"
      }`}
    >
      {/* Subtle cinema projector light beams */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 25%, rgba(219,7,61,0.22), transparent 70%), radial-gradient(ellipse 60% 45% at 50% 90%, rgba(255,140,168,0.10), transparent 70%)",
        }}
      />
      {/* Subtle filmstrip top/bottom border accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#db073d]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#db073d]/40 to-transparent" />

      <div className="relative z-10 flex flex-col items-center max-w-lg space-y-3 sm:space-y-4">
        {/* Status pill */}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#ff5c82]/35 bg-[#db073d]/18 px-3.5 py-1 text-[11px] sm:text-xs font-bold tracking-wide text-[#ffb3c1]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5c82] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff5c82]" />
          </span>
          កំពុងរៀបចំវីដេអូបង្រៀន • Coming Soon
        </span>

        {/* Cinema Clapperboard Emblem */}
        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/12 bg-white/5 shadow-[0_0_40px_rgba(219,7,61,0.3)]">
          <Clapperboard className="h-7 w-7 sm:h-8 sm:w-8 text-[#ff6b8b]" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-xl font-extrabold text-white khmer-prose leading-snug">
            {title || subTopicTitle || "វីដេអូបង្រៀនប្រចាំមេរៀន"}
          </h3>
          <p className="text-xs sm:text-sm text-[#e6c4cb] khmer-prose leading-relaxed">
            {description
              ? `${description} — ក្រុមការងារកំពុងរៀបចំថត និងកាត់តវីដេអូនេះឱ្យបានច្បាស់លាស់ និងងាយយល់បំផុត។`
              : "ក្រុមការងារកំពុងរៀបចំថត និងកាត់តវីដេអូបង្រៀនសម្រាប់ចំណុចនេះ។ ក្នុងពេលរង់ចាំ អ្នកអាចសិក្សាតាមស្លាយបង្ហាញ ឯកសារអានលម្អិត និងលំហាត់អនុវត្តជាមុនសិន!"}
          </p>
        </div>

        {duration && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-[#ffd3d2]">
            <Clock className="h-3.5 w-3.5 text-[#ff6b8b]" />
            <span>រយៈពេលគ្រោងទុក៖ {duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoTutorial({
  videos = [],
  lessonTitle = "",
  subTopicTitle = "",
}) {
  const normalizedVideos = useMemo(
    () => videos.map((v, idx) => normalizeVideo(v, idx, subTopicTitle)),
    [videos, subTopicTitle]
  );

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isLightsOff, setIsLightsOff] = useState(false);
  const [showCinemaSidebar, setShowCinemaSidebar] = useState(true);

  useEffect(() => {
    setActiveVideoIndex(0);
    setStartSeconds(0);
    setIsInlinePlaying(false);
    setIsCinemaOpen(false);
  }, [videos]);

  // Lock page scroll & support Escape key when Floating Cinema Pop-up is open
  useEffect(() => {
    if (!isCinemaOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsCinemaOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isCinemaOpen]);

  // Empty video array -> Friendly Cinema "Coming Soon" Card
  if (!normalizedVideos.length) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[#3a1620] bg-[#0b0608] cinema-stage-glow">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#12090c] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#ff6b8b]">
            <Film className="h-4 w-4" />
            <span>MATH CINEMA STUDIO</span>
          </div>
          <span className="rounded-full bg-[#db073d]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#ffb3c1]">
            កំពុងរៀបចំ
          </span>
        </div>
        <ComingSoonStage
          title={subTopicTitle || lessonTitle || "វីដេអូបង្រៀនប្រចាំមេរៀន"}
          subTopicTitle={subTopicTitle}
        />
      </div>
    );
  }

  const activeVideo = normalizedVideos[activeVideoIndex] || normalizedVideos[0];
  const hasChapters = activeVideo.chapters.length > 0;
  const hasMultipleVideos = normalizedVideos.length > 1;
  const thumbnailUrl = activeVideo.isAvailable
    ? `https://i.ytimg.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`
    : "";

  const openCinemaAt = (secs = startSeconds) => {
    setStartSeconds(secs);
    setIsInlinePlaying(false); // Never double-play audio
    setIsCinemaOpen(true);
  };

  const handleTimestampClick = (timeStr) => {
    const secs = parseTimestampToSeconds(timeStr);
    if (!activeVideo.isAvailable) {
      setIsCinemaOpen(true);
      return;
    }
    setStartSeconds(secs);
    if (!isCinemaOpen) {
      setIsInlinePlaying(false);
      setIsCinemaOpen(true);
    }
  };

  const selectVideo = (idx) => {
    setActiveVideoIndex(idx);
    setStartSeconds(0);
    setIsInlinePlaying(false);
  };

  const embedUrl = activeVideo.isAvailable
    ? `https://www.youtube.com/embed/${activeVideo.youtubeId}?start=${startSeconds}&autoplay=1&rel=0&modestbranding=1`
    : "";

  return (
    <div className="space-y-5">
      {/* ================================================================= */}
      {/* IN-PAGE CINEMA THEATER STAGE                                      */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Cinema Screen + Controls */}
        <div className={hasChapters || hasMultipleVideos ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
          <div className="overflow-hidden rounded-3xl border border-[#3a1620] bg-[#0b0608] cinema-stage-glow">
            {/* Cinema Top Marquee Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#140a0e] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#db073d] text-white shrink-0">
                  <Film className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ff8ca8] truncate">
                  MATH CINEMA • រោងកុនសិក្សា
                </span>
                {activeVideo.duration && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-white/8 px-2 py-0.5 font-mono text-[11px] font-bold text-[#ffd3d2]">
                    <Clock className="h-3 w-3 text-[#ff6b8b]" />
                    {activeVideo.duration}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeVideo.isAvailable && !isInlinePlaying && (
                  <button
                    type="button"
                    onClick={() => setIsInlinePlaying(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#f5dce1] hover:bg-white/12 transition"
                  >
                    <Tv className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">ចាក់ក្នុងទំព័រ</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCinemaAt(startSeconds)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#db073d] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm hover:bg-[#ff1c55] active:scale-95 transition"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>បើករោងកុនអណ្តែត</span>
                </button>
              </div>
            </div>

            {/* Main 16:9 Screen */}
            {!activeVideo.isAvailable ? (
              <ComingSoonStage
                title={activeVideo.title}
                subTopicTitle={subTopicTitle}
                description={activeVideo.description}
                duration={activeVideo.duration}
                compact
              />
            ) : isInlinePlaying && !isCinemaOpen ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={`inline-${activeVideo.youtubeId}-${startSeconds}`}
                  className="h-full w-full"
                  src={embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Lightning-fast Cinema Poster Preview (0 iframe lag on tab open) */
              <button
                type="button"
                onClick={() => openCinemaAt(startSeconds)}
                className="group relative block aspect-video w-full overflow-hidden bg-[#0b0608] text-left focus:outline-none"
                aria-label={`ចាក់វីដេអូ ${activeVideo.title} ក្នុងរោងកុនអណ្តែត`}
              >
                <img
                  src={thumbnailUrl}
                  alt={activeVideo.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-75 transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-85"
                />
                {/* Cinema vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090406] via-[#090406]/35 to-[#090406]/30" />

                {/* Center Glowing Cinema Play Orb */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#db073d] text-white shadow-[0_0_50px_rgba(219,7,61,0.75)] ring-4 ring-white/25 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#f0134b]">
                    <Play className="h-7 w-7 sm:h-9 sm:w-9 fill-current ml-1" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#ff6b8b]" />
                    ចុចដើម្បីមើលក្នុងរោងកុនអណ្តែត (HD)
                  </span>
                </div>

                {/* Bottom Title Overlay inside Theater Frame */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#ff8ca8] truncate">
                        {subTopicTitle || lessonTitle}
                      </div>
                      <h3 className="text-sm sm:text-lg font-extrabold text-white khmer-prose line-clamp-2">
                        {activeVideo.title}
                      </h3>
                    </div>
                    {activeVideo.duration && (
                      <span className="shrink-0 rounded-md bg-black/80 px-2 py-0.5 font-mono text-xs font-bold text-white border border-white/15">
                        {activeVideo.duration}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Cinema Info Footer Strip */}
            <div className="border-t border-white/10 bg-[#140a0e] px-4 py-3.5 sm:px-5 space-y-2.5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-white khmer-prose">
                    {activeVideo.title}
                  </h3>
                  {activeVideo.description && (
                    <p className="text-xs sm:text-sm text-[#d9b6be] khmer-prose leading-relaxed">
                      {activeVideo.description}
                    </p>
                  )}
                </div>

                {activeVideo.isAvailable && (
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}${
                      startSeconds > 0 ? `&t=${startSeconds}s` : ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#ffd3d2] hover:bg-white/12 transition shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>

              {/* Multi-video selector pills */}
              {hasMultipleVideos && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {normalizedVideos.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => selectVideo(idx)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        idx === activeVideoIndex
                          ? "bg-[#db073d] text-white"
                          : "bg-white/8 text-[#e6c4cb] hover:bg-white/15"
                      }`}
                    >
                      <span>វីដេអូទី {idx + 1}: {v.title}</span>
                      {!v.isAvailable && (
                        <span className="rounded bg-black/35 px-1.5 py-0.5 text-[10px] text-[#ffb3c1]">
                          កំពុងរៀបចំ
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Chapters / Outline Panel */}
        {(hasChapters || hasMultipleVideos) && (
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-[#ffd3d2] bg-white p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 text-sm font-extrabold text-[#160002]">
                  <ListVideo className="h-4 w-4 text-[#db073d]" />
                  <span>
                    {activeVideo.isAvailable
                      ? "ជំពូកសំខាន់ៗក្នុងវីដេអូ"
                      : "គ្រោងខ្លឹមសារវីដេអូដែលកំពុងរៀបចំ"}
                  </span>
                </h4>
                {hasChapters && (
                  <span className="rounded-full bg-[#ffe9e8] px-2 py-0.5 text-[11px] font-bold text-[#9c0329]">
                    {activeVideo.chapters.length} ផ្នែក
                  </span>
                )}
              </div>

              {hasChapters ? (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
                  {activeVideo.chapters.map((ch, idx) => {
                    const secs = parseTimestampToSeconds(ch.time);
                    const isActive =
                      activeVideo.isAvailable &&
                      startSeconds === secs &&
                      (isCinemaOpen || isInlinePlaying);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleTimestampClick(ch.time)}
                        className={`group flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                          isActive
                            ? "border-[#db073d] bg-[#ffe9e8] text-[#7e021f]"
                            : "border-[#ffd3d2] bg-[#fffafa] text-[#160002] hover:border-[#f68f91] hover:bg-[#ffe9e8]/60"
                        }`}
                      >
                        {ch.time ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2 py-1 font-mono text-[11px] font-bold text-white shrink-0 mt-0.5">
                            <Play className="h-2.5 w-2.5 fill-current" />
                            {ch.time}
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#ffe9e8] text-[11px] font-bold text-[#db073d] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-bold khmer-prose flex-1 leading-relaxed">
                          {ch.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#db073d] opacity-0 group-hover:opacity-100 transition shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#620116] khmer-prose leading-relaxed">
                  ចុច «បើករោងកុនអណ្តែត» ដើម្បីទស្សនាវីដេអូលើផ្ទាំងធំងងឹតជ្រៅ ងាយស្រួលផ្តោតអារម្មណ៍។
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* FLOATING POP-UP CINEMA THEATER (Portal on document.body, z-[9999])*/}
      {/* ================================================================= */}
      {isCinemaOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="រោងកុនសិក្សាអណ្តែត"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsCinemaOpen(false);
            }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 md:p-8 transition-colors duration-300 ${
              isLightsOff ? "bg-[#020102]" : "bg-[#070305]/95"
            }`}
          >
            {/* Ambient subtle crimson screen aura (GPU-only, no backdrop-blur lag) */}
            {!isLightsOff && (
              <div
                className="pointer-events-none fixed inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 65% 50% at 50% 45%, rgba(219,7,61,0.16), transparent 72%)",
                }}
              />
            )}

            {/* Floating Cinema Window */}
            <div
              className={`relative z-10 flex w-full max-w-6xl max-h-[94vh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl border animate-cinema-pop ${
                isLightsOff
                  ? "border-white/10 bg-[#050304] shadow-2xl"
                  : "border-[#54212f] bg-[#11080b] cinema-stage-glow"
              }`}
            >
              {/* Floating Theater Header Bar */}
              <div
                className={`flex items-center justify-between gap-2 border-b px-3.5 py-2.5 sm:px-5 sm:py-3 transition-opacity ${
                  isLightsOff
                    ? "border-white/8 bg-[#080406] opacity-75 hover:opacity-100"
                    : "border-white/10 bg-[#180c10]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[#db073d] text-white shrink-0">
                    <Film className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff7b9b]">
                        MATH CINEMA POP-UP
                      </span>
                      {activeVideo.isAvailable ? (
                        <span className="rounded bg-[#009b5e]/25 px-1.5 py-0.5 text-[10px] font-bold text-[#5ef0b5]">
                          HD
                        </span>
                      ) : (
                        <span className="rounded bg-[#db073d]/25 px-1.5 py-0.5 text-[10px] font-bold text-[#ffb3c1]">
                          កំពុងរៀបចំ
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white truncate khmer-prose">
                      {activeVideo.title}
                    </h3>
                  </div>
                </div>

                {/* Theater Toolbar Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Ambient Lights Dimmer */}
                  <button
                    type="button"
                    onClick={() => setIsLightsOff((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition ${
                      isLightsOff
                        ? "border-[#ff5c82]/40 bg-[#db073d]/25 text-[#ffb3c1]"
                        : "border-white/12 bg-white/5 text-[#e6c4cb] hover:bg-white/12"
                    }`}
                    title="បិទ/បើកភ្លើងរោងកុន"
                  >
                    {isLightsOff ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden md:inline">
                      {isLightsOff ? "បើកភ្លើងស្រទន់" : "បិទភ្លើងរោងកុន"}
                    </span>
                  </button>

                  {/* Toggle Chapters Drawer */}
                  {(hasChapters || hasMultipleVideos) && (
                    <button
                      type="button"
                      onClick={() => setShowCinemaSidebar((v) => !v)}
                      className={`hidden lg:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition ${
                        showCinemaSidebar
                          ? "border-[#ff5c82]/40 bg-[#db073d]/25 text-white"
                          : "border-white/12 bg-white/5 text-[#e6c4cb] hover:bg-white/12"
                      }`}
                    >
                      <ListVideo className="h-3.5 w-3.5" />
                      <span>ជំពូក</span>
                    </button>
                  )}

                  {/* Open on YouTube */}
                  {activeVideo.isAvailable && (
                    <a
                      href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}${
                        startSeconds > 0 ? `&t=${startSeconds}s` : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-white/12 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-[#e6c4cb] hover:bg-white/12 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>YouTube</span>
                    </a>
                  )}

                  {/* Close Cinema Button */}
                  <button
                    type="button"
                    onClick={() => setIsCinemaOpen(false)}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#db073d] active:scale-95 transition"
                    aria-label="បិទរោងកុន"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">បិទ</span>
                  </button>
                </div>
              </div>

              {/* Floating Cinema Body: 16:9 Screen + Optional Chapters Sidebar */}
              <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                {/* Screen Column */}
                <div className="flex-1 flex flex-col justify-center bg-black min-w-0">
                  {activeVideo.isAvailable ? (
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        key={`cinema-${activeVideo.youtubeId}-${startSeconds}`}
                        className="h-full w-full"
                        src={embedUrl}
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <ComingSoonStage
                      title={activeVideo.title}
                      subTopicTitle={subTopicTitle}
                      description={activeVideo.description}
                      duration={activeVideo.duration}
                    />
                  )}

                  {/* Compact Description Bar under Screen */}
                  {!isLightsOff && (activeVideo.description || lessonTitle) && (
                    <div className="border-t border-white/10 bg-[#140a0e] px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-[#d9b6be] khmer-prose leading-relaxed">
                        {activeVideo.description || `${lessonTitle} — ${subTopicTitle}`}
                      </p>
                      <span className="text-[11px] font-mono text-[#a67b86]">
                        ចុច Esc ដើម្បីបិទ
                      </span>
                    </div>
                  )}
                </div>

                {/* Dark-Cinema Chapters & Playlist Sidebar */}
                {(hasChapters || hasMultipleVideos) && showCinemaSidebar && !isLightsOff && (
                  <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#160b0f] flex flex-col max-h-[36vh] lg:max-h-none">
                    <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-extrabold text-white">
                        <ListVideo className="h-4 w-4 text-[#ff5c82]" />
                        {activeVideo.isAvailable
                          ? "ជំពូកវីដេអូ (ចុចដើម្បីលោតទៅ)"
                          : "គ្រោងមាតិកាវីដេអូ"}
                      </span>
                      {activeVideo.duration && (
                        <span className="font-mono text-[11px] font-bold text-[#ff8ca8]">
                          {activeVideo.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {hasMultipleVideos && (
                        <div className="space-y-1.5 pb-2.5 mb-2.5 border-b border-white/10">
                          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#c995a1] px-1">
                            បញ្ជីវីដេអូ ({normalizedVideos.length})
                          </div>
                          {normalizedVideos.map((v, idx) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => selectVideo(idx)}
                              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                                idx === activeVideoIndex
                                  ? "bg-[#db073d] text-white"
                                  : "bg-white/5 text-[#e6c4cb] hover:bg-white/10"
                              }`}
                            >
                              <span className="truncate khmer-prose">
                                {idx + 1}. {v.title}
                              </span>
                              {!v.isAvailable && (
                                <span className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-[#ffb3c1]">
                                  កំពុងរៀបចំ
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeVideo.chapters.map((ch, idx) => {
                        const secs = parseTimestampToSeconds(ch.time);
                        const isActive =
                          activeVideo.isAvailable && startSeconds === secs;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleTimestampClick(ch.time)}
                            className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                              isActive
                                ? "border-[#ff5c82] bg-[#db073d]/22 text-white"
                                : "border-white/8 bg-white/[0.04] text-[#ecd5da] hover:border-[#ff5c82]/40 hover:bg-white/[0.08]"
                            }`}
                          >
                            {ch.time ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#db073d] px-2 py-0.5 font-mono text-[11px] font-bold text-white shrink-0 mt-0.5">
                                <Play className="h-2.5 w-2.5 fill-current" />
                                {ch.time}
                              </span>
                            ) : (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[11px] font-bold text-[#ff8ca8] shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className="text-xs font-bold khmer-prose leading-relaxed">
                              {ch.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
