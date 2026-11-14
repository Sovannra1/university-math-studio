"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sigma,
  TrendingUp,
  Grid3X3,
  Orbit,
  ChevronRight,
  BookOpen,
  GraduationCap,
  X,
  Binary,
  GitBranch,
  Activity,
  BarChart3,
  Hash,
  Boxes,
  Compass,
  Calculator,
  Shapes,
  Waves,
  Layers,
} from "lucide-react";
import { APP_VERSION, BRAND_NAME } from "@/lib/appConfig";

const SUBJECT_ICONS = {
  "logic-proofs": Binary,
  calculus: TrendingUp,
  "linear-algebra": Grid3X3,
  "discrete-math": GitBranch,
  ode: Activity,
  "probability-statistics": BarChart3,
  "number-theory": Hash,
  "real-analysis": Sigma,
  "abstract-algebra": Boxes,
  "complex-analysis": Compass,
  "numerical-analysis": Calculator,
  topology: Orbit,
  "differential-geometry": Shapes,
  pde: Waves,
  "functional-analysis": Layers,
};

function groupLessonsByPart(lessons) {
  const groups = [];
  lessons.forEach((lesson) => {
    const key = lesson.partKh || "__default__";
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.lessons.push(lesson);
    } else {
      groups.push({ key, partKh: lesson.partKh || null, lessons: [lesson] });
    }
  });
  return groups;
}

export default function Sidebar({
  subjects = [],
  activeLessonId,
  activeSubjectId,
  activeSubTopicId,
  onSelectSubTopic,
  isOpenMobile,
  onCloseMobile,
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    const initial = {};
    subjects.forEach((subj) => {
      initial[subj.id] = subj.id === activeSubjectId || subj.id === "calculus";
    });
    return initial;
  });

  const [expandedParts, setExpandedParts] = useState(() => {
    const initial = {};
    subjects.forEach((subj) => {
      const lessons = subj.lessons || [];
      const activeLesson = lessons.find((l) => l.id === activeLessonId);
      const defaultPart = activeLesson?.partKh || lessons[0]?.partKh;
      if (defaultPart) {
        initial[`${subj.id}::${defaultPart}`] = true;
      }
    });
    return initial;
  });

  useEffect(() => {
    if (!activeLessonId) return;
    subjects.forEach((subj) => {
      const match = (subj.lessons || []).find((l) => l.id === activeLessonId);
      if (match) {
        setExpandedSubjects((prev) =>
          prev[subj.id] ? prev : { ...prev, [subj.id]: true }
        );
        if (match.partKh) {
          const partKey = `${subj.id}::${match.partKh}`;
          setExpandedParts((prev) =>
            prev[partKey] ? prev : { ...prev, [partKey]: true }
          );
        }
      }
    });
  }, [activeLessonId, subjects]);

  const toggleSubject = (id) => {
    setExpandedSubjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePart = (partKey) => {
    setExpandedParts((prev) => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  const renderLessonItem = (lesson) => {
    const isActive = lesson.id === activeLessonId;
    const subTopics = lesson.subTopics || [];

    return (
      <div key={lesson.id} className="space-y-1">
        <Link
          href={`/?lesson=${encodeURIComponent(lesson.id)}`}
          prefetch={true}
          onClick={onCloseMobile}
          className={`block rounded-lg px-3 py-2 text-xs transition-all duration-150 active:scale-[0.98] ${
            isActive
              ? "bg-[#db073d] font-bold text-white shadow-xs"
              : "text-[#160002] font-medium hover:bg-[#ffe9e8] hover:text-[#7e021f]"
          }`}
        >
          <div className="leading-relaxed">{lesson.titleKh}</div>
          {(lesson.titleEn || lesson.isAvailable === false) && (
            <div
              className={`mt-0.5 flex items-center justify-between gap-1.5 text-[10px] ${
                isActive ? "text-[#ffe9e8]" : "text-[#620116]"
              }`}
            >
              <span className="truncate">{lesson.titleEn}</span>
              {lesson.isAvailable === false && (
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#ffe9e8] text-[#7e021f]"
                  }`}
                >
                  កំពុងរៀបចំ
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Nested Sub-topics with smooth accordion when this lesson is active */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isActive && subTopics.length > 0
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {subTopics.length > 0 && (
              <div className="ml-2.5 border-l-2 border-[#fdbcbc] pl-2.5 space-y-1 py-0.5">
                {subTopics.map((sub) => {
                  const isSubActive = sub.id === activeSubTopicId;
                  if (isActive && onSelectSubTopic) {
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          onSelectSubTopic(sub.id);
                          onCloseMobile?.();
                        }}
                        className={`block w-full text-left rounded-md px-2.5 py-1.5 text-[11px] leading-relaxed transition-all duration-150 active:scale-[0.98] ${
                          isSubActive
                            ? "bg-[#ffe9e8] font-bold text-[#9c0329] border border-[#fdbcbc]"
                            : "text-[#2d0006] font-medium hover:bg-[#ffe9e8]/70 hover:text-[#7e021f]"
                        }`}
                      >
                        {sub.titleKh}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={sub.id}
                      href={`/?lesson=${encodeURIComponent(
                        lesson.id
                      )}&subtopic=${encodeURIComponent(sub.id)}`}
                      prefetch={true}
                      onClick={onCloseMobile}
                      className={`block rounded-md px-2.5 py-1.5 text-[11px] leading-relaxed transition-all duration-150 active:scale-[0.98] ${
                        isSubActive
                          ? "bg-[#ffe9e8] font-bold text-[#9c0329] border border-[#fdbcbc]"
                          : "text-[#2d0006] font-medium hover:bg-[#ffe9e8]/70 hover:text-[#7e021f]"
                      }`}
                    >
                      {sub.titleKh}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#160002]/60 backdrop-blur-xs lg:hidden animate-fade-fast"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-76 flex-col border-r border-[#ffd3d2] bg-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#ffd3d2] px-5 py-4 bg-[#fffafa]">
          <Link
            href="/"
            prefetch={true}
            onClick={onCloseMobile}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#db073d] text-white shadow-xs transition-transform duration-150 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#160002] leading-snug group-hover:text-[#db073d] transition-colors">
                គណិតវិទ្យាសាកលវិទ្យាល័យ
              </div>
              <div className="text-[11px] font-semibold text-[#7e021f]">
                University Math Studio
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-[#47010d] hover:bg-[#ffe9e8] transition-colors lg:hidden"
            aria-label="បិទម៉ឺនុយ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subjects & Lessons Navigation */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-2">
          <div className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#7e021f]">
            {activeSubjectId ? "មាតិកាសៀវភៅបច្ចុប្បន្ន" : `សៀវភៅមុខវិជ្ជា (${subjects.length})`}
          </div>

          {(activeSubjectId
            ? subjects.filter((s) => s.id === activeSubjectId)
            : subjects
          ).map((subject) => {
            const Icon = SUBJECT_ICONS[subject.id] || BookOpen;
            const isExpanded = !!expandedSubjects[subject.id];
            const lessons = subject.lessons || [];
            const isCurrentSubject = subject.id === activeSubjectId;
            const partGroups = groupLessonsByPart(lessons);

            return (
              <div key={subject.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  aria-expanded={isExpanded}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.98] ${
                    isCurrentSubject
                      ? "bg-[#ffe9e8] text-[#7e021f] border border-[#fdbcbc]"
                      : "text-[#160002] hover:bg-[#ffe9e8]/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                        isCurrentSubject ? "text-[#db073d]" : "text-[#47010d]"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">
                        {subject.nameKh}
                      </div>
                      <div
                        className={`text-[11px] truncate font-medium ${
                          isCurrentSubject ? "text-[#9c0329]" : "text-[#620116]"
                        }`}
                      >
                        {subject.nameEn}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-[#7e021f] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Animated Subject Accordion */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-4 border-l-2 border-[#ffd3d2] pl-3 space-y-1.5 py-1">
                      {lessons.length === 0 ? (
                        <div className="px-2.5 py-2 text-xs italic text-[#620116]">
                          នឹងមកដល់ឆាប់ៗនេះ...
                        </div>
                      ) : (
                        partGroups.map((group) => {
                          if (!group.partKh) {
                            return group.lessons.map(renderLessonItem);
                          }

                          const partKey = `${subject.id}::${group.partKh}`;
                          const isPartExpanded = !!expandedParts[partKey];
                          const hasActiveLesson = group.lessons.some(
                            (l) => l.id === activeLessonId
                          );

                          return (
                            <div key={partKey} className="space-y-1">
                              <button
                                type="button"
                                onClick={() => togglePart(partKey)}
                                aria-expanded={isPartExpanded}
                                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left transition-all duration-150 active:scale-[0.98] ${
                                  hasActiveLesson
                                    ? "bg-[#ffe9e8] text-[#9c0329]"
                                    : "bg-[#fff5f5] text-[#7e021f] hover:bg-[#ffe9e8]/80"
                                }`}
                              >
                                <span className="text-[11px] font-bold leading-snug">
                                  {group.partKh}
                                </span>
                                <ChevronRight
                                  className={`h-3.5 w-3.5 shrink-0 text-[#9c0329] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    isPartExpanded ? "rotate-90" : "rotate-0"
                                  }`}
                                />
                              </button>

                              {/* Animated Part Accordion */}
                              <div
                                className={`grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                  isPartExpanded
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <div className="space-y-1 pl-1 pt-0.5">
                                    {group.lessons.map(renderLessonItem)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="border-t border-[#ffd3d2] bg-[#fffafa] px-4 py-3 text-[11px] text-[#47010d]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#160002]">
              អភិវឌ្ឍន៍ដោយ៖ {BRAND_NAME}
            </span>
            <span className="rounded-full border border-[#fdbcbc] bg-[#ffe9e8] px-2 py-0.5 text-[10px] font-bold text-[#9c0329]">
              {APP_VERSION}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-[#7e021f]">
            <Link href="/about" onClick={onCloseMobile} className="hover:underline">
              អំពីយើង
            </Link>
            <span className="text-[#fdbcbc]">•</span>
            <Link href="/privacy" onClick={onCloseMobile} className="hover:underline">
              គោលការណ៍ឯកជនភាព
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
