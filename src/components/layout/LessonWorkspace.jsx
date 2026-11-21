"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Presentation,
  Video,
  BookOpen,
  ClipboardCheck,
  LayoutGrid,
  Crown,
  CreditCard,
  Clock,
  Send,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SlideViewer from "@/components/lesson-tabs/SlideViewer";
import VideoTutorial from "@/components/lesson-tabs/VideoTutorial";
import DetailedReading from "@/components/lesson-tabs/DetailedReading";
import PracticeQuiz from "@/components/lesson-tabs/PracticeQuiz";
import ChapterChallengeView from "@/components/lesson-tabs/ChapterChallengeView";
import CommentSection from "@/components/common/CommentSection";
import MathSymbolsModal from "@/components/common/MathSymbolsModal";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthContext";

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
  const [isSymbolsOpen, setIsSymbolsOpen] = useState(false);
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
  const hasChallenge = !!lesson?.chapterChallenge;
  const [activeSubTopicId, setActiveSubTopicId] = useState(() => {
    if (
      initialSubTopicId === "__chapter_challenge__" &&
      hasChallenge
    ) {
      return "__chapter_challenge__";
    }
    if (initialSubTopicId && subTopics.some((s) => s.id === initialSubTopicId)) {
      return initialSubTopicId;
    }
    return subTopics[0]?.id || null;
  });

  useEffect(() => {
    const list = lesson?.subTopics || [];
    if (
      initialSubTopicId === "__chapter_challenge__" &&
      lesson?.chapterChallenge
    ) {
      setActiveSubTopicId("__chapter_challenge__");
    } else if (initialSubTopicId && list.some((s) => s.id === initialSubTopicId)) {
      setActiveSubTopicId(initialSubTopicId);
    } else {
      setActiveSubTopicId(list[0]?.id || null);
    }
  }, [lesson?.id, initialSubTopicId, lesson?.subTopics, lesson?.chapterChallenge]);

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

  const isChallengeMode =
    activeSubTopicId === "__chapter_challenge__" && !!lesson?.chapterChallenge;
  const activeSubTopic = isChallengeMode
    ? null
    : subTopics.find((s) => s.id === activeSubTopicId) || subTopics[0] || null;

  // Use sub-topic content when available, otherwise fall back to top-level lesson content
  const contentSource = activeSubTopic || lesson || {};

  const resolvedSubjectId = activeSubjectId || lesson?.subject;
  const activeSubject =
    subjects.find((s) => s.id === resolvedSubjectId) || subjects[0] || {};

  const { checkAccess, openUpgradeModal, pendingPayments } = useAuth();
  const activeFeatureKey = isChallengeMode ? "challenge" : activeTab;
  const accessResult = checkAccess({
    subjectId: resolvedSubjectId,
    featureKey: activeFeatureKey,
  });
  const matchingPending = (pendingPayments || []).find(
    (p) =>
      p.purchaseType === "all-pro" ||
      (p.purchaseType === "subject" && p.subjectId === resolvedSubjectId)
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fffafa]">
      {/* Floating Sticky Top Header (Logo + Web App Name + Lesson Title) */}
      <Header
        subjectNameKh={activeSubject.nameKh}
        subjectNameEn={activeSubject.nameEn}
        lessonTitleKh={lesson?.titleKh}
        lessonTitleEn={lesson?.titleEn}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onOpenSymbols={() => setIsSymbolsOpen(true)}
      />

      {/* Workspace Body: Main Content (Left) + Table of Contents (Right) */}
      <div className="flex flex-1 items-start gap-0 lg:gap-5 lg:px-6 pt-[4.5rem] sm:pt-[5.5rem]">
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Clean 4-Tab Navigation Bar with Sliding Active Pill (hidden in Chapter Challenge mode) */}
          {!isChallengeMode && (
            <div className="mx-2 sm:mx-5 lg:mx-0 mt-2 sm:mt-3 lg:mt-0 rounded-2xl border border-[#ffd3d2] bg-white/95 px-2 sm:px-4 shadow-xs">
              <div className="relative flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 no-scrollbar snap-x">
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
          )}

        {/* Tab Content */}
        <main className="flex-1 p-2.5 sm:p-5 lg:p-6 max-w-5xl w-full mx-auto overflow-x-hidden">
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
          ) : !accessResult.allowed ? (
            matchingPending ? (
              <div className="rounded-2xl border border-[#b3e6d1] bg-[#e7f7f0]/80 p-6 sm:p-10 text-center animate-panel-enter shadow-xs space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009b5e] text-white shadow-xs">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="mx-auto max-w-lg space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#007a49] border border-[#b3e6d1]">
                    កំពុងដំណើរការស្នើសុំទិញ (Pending Verification)
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#160002]">
                    ប្រព័ន្ធកំពុងផ្ទៀងផ្ទាត់ការបង់ប្រាក់ ABA របស់អ្នក
                  </h2>
                  <p className="text-xs sm:text-sm text-[#005936] leading-relaxed">
                    លេខយោងប្រតិបត្តិការ៖{" "}
                    <strong className="font-mono">{matchingPending.abaReference}</strong>{" "}
                    (${matchingPending.amountUsd} USD)។ ការបើកសិទ្ធិអាចចំណាយពេល{" "}
                    <strong>យ៉ាងយូរ ២៤ ម៉ោង</strong>។
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href="https://t.me/sovannra1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0085dd] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 transition"
                    >
                      <Send className="h-4 w-4" />
                      <span>ចង់បានឆាប់រហ័ស? ទាក់ទង Telegram @sovannra1</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#fdbcbc] bg-white p-8 sm:p-12 text-center animate-panel-enter shadow-xs space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe9e8] text-[#db073d]">
                  <Crown className="h-7 w-7" />
                </div>
                <div className="mx-auto max-w-md space-y-2">
                  <h2 className="text-xl font-bold text-[#160002]">
                    មាតិកានេះតម្រូវឱ្យមានគណនី Pro
                  </h2>
                  <p className="text-xs sm:text-sm text-[#47010d] leading-relaxed">
                    Admin បានកំណត់ផ្នែក ឬមុខវិជ្ជានេះសម្រាប់សមាជិក Pro។ អ្នកអាចដំឡើងគណនីដោយបង់ប្រាក់តាម ABA PayWay ដើម្បីដោះសោរ។
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        openUpgradeModal({
                          subjectId: resolvedSubjectId,
                          subjectNameKh: activeSubject.nameKh,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#db073d] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#bb0533] transition"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>ដោះសោរដោយបង់ប្រាក់ ABA</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : isChallengeMode ? (
            <div key={`${lesson.id}-challenge`} className="animate-panel-enter">
              <ChapterChallengeView
                challenge={lesson.chapterChallenge}
                progressKey={`${lesson.id}-challenge`}
              />
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
                  lessonTitle={lesson.titleKh}
                  subTopicTitle={activeSubTopic?.titleKh || ""}
                />
              )}
              {activeTab === "practice" && (
                <PracticeQuiz
                  practiceExercises={contentSource.practiceExercises || []}
                  progressKey={`${lesson.id}-${activeSubTopic?.id || "root"}`}
                />
              )}
              {activeTab === "video" && (
                <VideoTutorial
                  videos={contentSource.videos || []}
                  lessonTitle={lesson.titleKh}
                  subTopicTitle={activeSubTopic?.titleKh || ""}
                />
              )}
            </div>
          )}

          {lesson && (
            <CommentSection
              contextId={`${lesson.id}-${
                isChallengeMode
                  ? "challenge"
                  : activeSubTopic?.id || "root"
              }`}
              contextTitle={
                isChallengeMode
                  ? `${lesson.titleKh} — ${lesson.chapterChallenge.titleKh}`
                  : activeSubTopic
                  ? `${lesson.titleKh} — ${activeSubTopic.titleKh}`
                  : lesson.titleKh
              }
            />
          )}
        </main>

          {/* Clean Workspace Footer */}
          <Footer maxWidthClass="max-w-7xl" />
        </div>

        {/* Right Sidebar (Table of Contents) */}
        <Sidebar
          subjects={subjects}
          activeLessonId={lesson?.id}
          activeLessonHasChallenge={!!lesson?.chapterChallenge}
          activeSubjectId={resolvedSubjectId}
          activeSubTopicId={
            isChallengeMode ? "__chapter_challenge__" : activeSubTopic?.id
          }
          onSelectSubTopic={handleSelectSubTopic}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Quick-Access Mathematical Symbols Modal */}
      <MathSymbolsModal
        isOpen={isSymbolsOpen}
        onClose={() => setIsSymbolsOpen(false)}
        subjectId={resolvedSubjectId}
        subjectNameKh={activeSubject.nameKh}
      />
    </div>
  );
}
