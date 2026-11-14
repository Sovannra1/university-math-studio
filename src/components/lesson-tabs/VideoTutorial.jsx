"use client";

import React, { useState, useEffect } from "react";
import { Play, Clock, Video } from "lucide-react";

/**
 * Converts "MM:SS" or "HH:MM:SS" into total seconds.
 */
function parseTimestampToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const parts = timeStr.split(":").map((n) => parseInt(n, 10));
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function VideoTutorial({ videos = [] }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    setActiveVideoIndex(0);
    setStartSeconds(0);
    setAutoplay(false);
  }, [videos]);

  if (!videos.length) {
    return (
      <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 text-center text-[#47010d] font-medium">
        មិនទាន់មានវីដេអូបង្រៀនសម្រាប់មេរៀននេះទេ។
      </div>
    );
  }

  const activeVideo = videos[activeVideoIndex] || videos[0];
  const isPlaceholder =
    !activeVideo.youtubeId || activeVideo.youtubeId === "VIDEO_ID_HERE";

  const handleTimestampClick = (timeStr) => {
    const secs = parseTimestampToSeconds(timeStr);
    setStartSeconds(secs);
    setAutoplay(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Video Player */}
      <div className="lg:col-span-8 space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[#ffd3d2] bg-[#160002] shadow-xs">
          {isPlaceholder ? (
            <div className="aspect-video flex flex-col items-center justify-center p-8 text-center text-[#ffe9e8] bg-gradient-to-br from-[#2d0006] to-[#160002]">
              <Video className="h-12 w-12 text-[#f68f91] mb-3" />
              <p className="text-base font-bold text-white mb-1">
                {activeVideo.title}
              </p>
              <p className="text-xs text-[#ffd3d2] max-w-md">
                សូមបញ្ចូល YouTube Video ID ពិតប្រាកដនៅក្នុងឯកសារ JSON ដើម្បីចាក់វីដេអូនៅទីនេះ។
              </p>
            </div>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                key={`${activeVideo.youtubeId}-${startSeconds}`}
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?start=${startSeconds}&autoplay=${
                  autoplay ? 1 : 0
                }&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#ffd3d2] bg-white p-4">
          <h3 className="text-base md:text-lg font-bold text-[#160002]">
            {activeVideo.title}
          </h3>
          {videos.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {videos.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveVideoIndex(idx);
                    setStartSeconds(0);
                    setAutoplay(false);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    idx === activeVideoIndex
                      ? "bg-[#db073d] text-white"
                      : "bg-[#ffe9e8] text-[#7e021f] hover:bg-[#ffd3d2]"
                  }`}
                >
                  វីដេអូទី {idx + 1}: {v.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clickable Timestamps */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-[#ffd3d2] bg-white p-5 shadow-xs">
          <h4 className="flex items-center gap-2 text-sm font-bold text-[#160002] mb-4">
            <Clock className="h-4 w-4 text-[#db073d]" />
            ចំណុចសំខាន់ៗក្នុងវីដេអូ (Timestamps)
          </h4>

          <div className="space-y-2">
            {(activeVideo.timestamps || []).map((ts, idx) => {
              const secs = parseTimestampToSeconds(ts.time);
              const isActive = startSeconds === secs && autoplay;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTimestampClick(ts.time)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-[#db073d] bg-[#ffe9e8] text-[#7e021f]"
                      : "border-[#ffd3d2] bg-[#fffafa] text-[#160002] hover:border-[#f68f91] hover:bg-[#ffe9e8]/60"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#db073d] px-2.5 py-1 font-mono text-xs font-bold text-white shrink-0">
                    <Play className="h-3 w-3 fill-current" />
                    {ts.time}
                  </span>
                  <span className="text-sm font-bold khmer-prose">
                    {ts.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
