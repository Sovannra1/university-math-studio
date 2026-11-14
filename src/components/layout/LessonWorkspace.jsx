"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Presentation,
  Video,
  BookOpen,
  ClipboardCheck,
  LayoutGrid,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SlideViewer from "@/components/lesson-tabs/SlideViewer";
import VideoTutorial from "@/components/lesson-tabs/VideoTutorial";
import DetailedReading from "@/components/lesson-tabs/DetailedReading";
import PracticeQuiz from "@/components/lesson-tabs/PracticeQuiz";
import CommentSection from "@/components/common/CommentSection";
import Footer from "@/components/layout/Footer";

const TABS = [
  {
    id: "slides",
    labelKh: "ស្លាយបង្រៀន",
    labelEn: "Slides",
    icon: Presentation,
  },
  {
    id: "reading",
    labelKh: "ឯកសារអានលម្អិត",
    labelEn: "Reading",
    icon: BookOpen,
  },
  {
    id: "practice",
    labelKh: "លំហាត់អនុវត្តន៍",
    labelEn: "Practice",
    icon: ClipboardCheck,
  },
  {
    id: "video",
    labelKh: "វីដេអូបង្រៀន",
    labelEn: "Video",
    icon: Video,
  },
];

export default function LessonWorkspace({
  subjects = [],
  lesson = null,
  activeSubjectId = undefined,
  initialSubTopicId = undefined,
}) {
  const [activeTab, setActiveTab] = useState("slides");
  const [tabDirection, setTabDirection] = useState("fade");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const tabButtonRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, ready: false });

  const handleSelectTab = useCallback(
    (nextTabId) => {
      if (nextTabId === activeTab) return;
      const prevIdx = TABS.findIndex((t) => t.id === activeTab);
      const nextIdx = TABS.findIndex((t) => t.id === nextTabId);
      setTabDirection(nextIdx > prevIdx ? "next" : "prev");
      setActiveTab(nextTabId);
    },
    [activeTab]
  );

  const updatePillPosition = useCallback(() => {
    const activeEl = tabButtonRefs.current[activeTab];
    if (activeEl) {
      setPillStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        ready: true,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updatePillPosition();
    window.addEventListener("resize", updatePillPosition);
    return () => window.removeEventListener("resize", updatePillPosition);
  }, [updatePillPosition]);

  const subTopics = lesson?.subTopics || [];
  const [activeSubTopicId, setActiveSubTopicId] = useState(() => {
    if (initialSubTopicId && subTopics.some((s) => s.id === initialSubTopicId)) {
      return initialSubTopicId;
    }
    return subTopics[0]?.id || null;
  });

  useEffect(() => {
    const list = lesson?.subTopics || [];
    if (initialSubTopicId && list.some((s) => s.id === initialSubTopicId)) {
      setActiveSubTopicId(initialSubTopicId);
    } else {
      setActiveSubTopicId(list[0]?.id || null);
    }
  }, [lesson?.id, initialSubTopicId, lesson?.subTopics]);

  const handleSelectSubTopic = useCallback(
    (subId) => {
      setTabDirection("fade");
      setActiveSubTopicId(subId);
      if (typeof window !== "undefined" && lesson?.id) {
        const url = new URL(window.location.href);
        url.searchParams.set("lesson", lesson.id);
        url.searchParams.set("subtopic", subId);
        window.history.replaceState(null, "", url.toString());
      }
    },
    [lesson?.id]
  );

  const activeSubTopic =
    subTopics.find((s) => s.id === activeSubTopicId) || subTopics[0] || null;

  // Use sub-topic content when available, otherwise fall back to top-level lesson content
  const contentSource = activeSubTopic || lesson || {};

  const resolvedSubjectId = activeSubjectId || lesson?.subject;
  const activeSubject =
    subjects.find((s) => s.id === resolvedSubjectId) || subjects[0] || {};

  return (
    <div className="flex min-h-screen bg-[#fffafa]">
      {/* Left Sidebar */}
      <Sidebar
        subjects={subjects}
        activeLessonId={lesson?.id}
        activeSubjectId={resolvedSubjectId}
        activeSubTopicId={activeSubTopic?.id}
        onSelectSubTopic={handleSelectSubTopic}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          subjectNameKh={activeSubject.nameKh}
          subjectNameEn={activeSubject.nameEn}
          lessonTitleKh={lesson?.titleKh}
          lessonTitleEn={lesson?.titleEn}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Clean 4-Tab Navigation Bar with Sliding Active Pill */}
        <div className="border-b border-[#ffd3d2] bg-white/95 px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
            {pillStyle.ready && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-2.5 bottom-2.5 rounded-xl bg-[#db073d] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(${pillStyle.left}px)`,
                  width: `${pillStyle.width}px`,
                }}
              />
            )}
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabButtonRefs.current[tab.id] = el;
                  }}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative z-10 inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-colors duration-200 active:scale-95 ${
                    isActive
                      ? `text-white ${!pillStyle.ready ? "bg-[#db073d] shadow-xs" : ""}`
                      : "text-[#2d0006] hover:bg-[#ffe9e8]/80 hover:text-[#9c0329]"
                  }`}
                >
                  <Icon
                    key={isActive ? `${tab.id}-active` : tab.id}
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "animate-icon-pop" : ""
                    }`}
                  />
                  <span>{tab.labelKh}</span>
                  <span
                    className={`hidden xl:inline text-[11px] font-medium transition-colors duration-200 ${
                      isActive ? "text-[#ffe9e8]" : "text-[#620116]"
                    }`}
                  >
                    ({tab.labelEn})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {!lesson ? (
            <div className="rounded-2xl border border-[#ffd3d2] bg-white p-10 sm:p-12 text-center animate-panel-enter shadow-xs">
              <div className="mx-auto max-w-md space-y-3">
                <div className="inline-flex rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-3 py-1 text-xs font-bold text-[#9c0329]">
                  កំពុងរៀបចំខ្លឹមសារសៀវភៅ
                </div>
                <h2 className="text-xl font-bold text-[#160002]">
                  {activeSubject.nameKh || "មុខវិជ្ជានេះ"} ({activeSubject.nameEn})
                </h2>
                <p className="text-sm text-[#47010d] leading-relaxed">
                  {activeSubject.descriptionKh ||
                    "មេរៀនសម្រាប់មុខវិជ្ជានេះកំពុងស្ថិតក្នុងដំណាក់កាលរៀបចំ និងនឹងបន្ថែមក្នុងពេលឆាប់ៗនេះ។"}
                </p>
                <div className="pt-2">
                  <Link
                    href="/"
                    prefetch={true}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#bb0533] active:scale-95"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>ត្រឡប់ទៅធ្នើរសៀវភៅ</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={`${lesson.id}-${activeSubTopic?.id || "root"}-${activeTab}`}
              className={
                tabDirection === "next"
                  ? "animate-tab-next"
                  : tabDirection === "prev"
                  ? "animate-tab-prev"
                  : "animate-panel-enter"
              }
            >
              {activeTab === "slides" && (
                <SlideViewer
                  slides={contentSource.slides || []}
                  lessonTitle={
                    activeSubTopic
                      ? `${lesson.titleKh} — ${activeSubTopic.titleKh}`
                      : lesson.titleKh
                  }
                />
              )}
              {activeTab === "reading" && (
                <DetailedReading
                  detailedReading={contentSource.detailedReading}
                  workedExamples={contentSource.workedExamples || []}
                />
              )}
              {activeTab === "practice" && (
                <PracticeQuiz
                  practiceExercises={contentSource.practiceExercises || []}
                />
              )}
              {activeTab === "video" && (
                <VideoTutorial videos={contentSource.videos || []} />
              )}
            </div>
          )}

          {lesson && (
            <CommentSection
              contextId={`${lesson.id}-${activeSubTopic?.id || "root"}`}
              contextTitle={
                activeSubTopic
                  ? `${lesson.titleKh} — ${activeSubTopic.titleKh}`
                  : lesson.titleKh
              }
            />
          )}
        </main>

        {/* Clean Workspace Footer */}
        <Footer maxWidthClass="max-w-7xl" />
      </div>
    </div>
  );
}
