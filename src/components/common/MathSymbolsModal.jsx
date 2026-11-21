"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Search, Sigma, Info } from "lucide-react";
import MathText from "@/components/common/MathText";
import { getSymbolGroupsForSubject } from "@/data/mathSymbols";

export default function MathSymbolsModal({
  isOpen,
  onClose,
  subjectId,
  subjectNameKh,
}) {
  const [query, setQuery] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("all");

  const groups = useMemo(
    () => getSymbolGroupsForSubject(subjectId),
    [subjectId]
  );

  // Reset active category when subject changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveGroupId("all");
    }
  }, [isOpen, subjectId]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => activeGroupId === "all" || g.id === activeGroupId)
      .map((g) => {
        if (!q) return g;
        const matchedItems = g.items.filter(
          (item) =>
            item.nameKh.toLowerCase().includes(q) ||
            item.meaningKh.toLowerCase().includes(q) ||
            item.symbol.toLowerCase().includes(q) ||
            (item.example && item.example.toLowerCase().includes(q))
        );
        return { ...g, items: matchedItems };
      })
      .filter((g) => g.items.length > 0);
  }, [groups, activeGroupId, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-2.5 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="និមិត្តសញ្ញាគណិតវិទ្យាប្រើប្រាស់ក្នុងមុខវិជ្ជានេះ"
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#fdbcbc] bg-[#fffafa] shadow-2xl animate-panel-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#ffd3d2] bg-white px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe9e8] text-[#db073d] border border-[#fdbcbc]">
              <Sigma className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#160002] truncate khmer-prose">
                និមិត្តសញ្ញាគណិតវិទ្យា
                {subjectNameKh ? ` — ${subjectNameKh}` : ""}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#620116] truncate">
                តារាងយោងរហ័សសម្រាប់សំណុំ ចន្លោះ និងនិមិត្តសញ្ញាក្នុងមេរៀន
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#ffd3d2] bg-[#fffafa] text-[#47010d] hover:bg-[#ffe9e8] hover:text-[#db073d] transition"
            aria-label="បិទផ្ទាំងនិមិត្តសញ្ញា"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search + Category Pills */}
        <div className="space-y-2.5 border-b border-[#ffd3d2] bg-[#fffafa] px-4 py-3 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7e021f]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ស្វែងរកនិមិត្តសញ្ញា ឬពាក្យគន្លឹះ (ឧ. ចន្លោះ, លីមីត, ដេរីវេ, forall)..."
              className="w-full rounded-xl border border-[#fdbcbc] bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-[#160002] placeholder:text-[#9c0329]/50 focus:border-[#db073d] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveGroupId("all")}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                activeGroupId === "all"
                  ? "bg-[#db073d] text-white shadow-2xs"
                  : "border border-[#ffd3d2] bg-white text-[#47010d] hover:bg-[#ffe9e8]"
              }`}
            >
              ទាំងអស់
            </button>
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroupId(g.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  activeGroupId === g.id
                    ? "bg-[#db073d] text-white shadow-2xs"
                    : "border border-[#ffd3d2] bg-white text-[#47010d] hover:bg-[#ffe9e8]"
                }`}
              >
                {g.titleKh}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Symbol Cards */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-5">
          {filteredGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#fdbcbc] bg-white p-8 text-center text-sm text-[#620116]">
              រកមិនឃើញនិមិត្តសញ្ញាដែលត្រូវនឹង «{query}» ទេ។
            </div>
          ) : (
            filteredGroups.map((group) => (
              <section key={group.id} className="space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#9c0329] khmer-prose">
                    {group.titleKh}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#7e021f]/75">
                    {group.titleEn}
                  </span>
                </div>

                {group.noteKh && (
                  <div className="flex items-start gap-2 rounded-xl border border-[#fdbcbc] bg-[#ffe9e8]/55 px-3 py-2 text-xs text-[#47010d] khmer-prose leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 text-[#db073d] mt-0.5" />
                    <span>{group.noteKh}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.items.map((item, idx) => (
                    <div
                      key={`${group.id}-${idx}`}
                      className="flex items-start gap-3 rounded-xl border border-[#ffd3d2] bg-white p-3 shadow-2xs hover:border-[#fdbcbc] transition"
                    >
                      <div className="flex min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-[#ffd3d2] bg-[#fffafa] px-2 py-2 text-sm sm:text-base text-[#160002]">
                        <MathText text={item.symbol} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-xs sm:text-sm font-bold text-[#160002] khmer-prose leading-snug">
                          <MathText text={item.nameKh} />
                        </div>
                        <div className="text-xs text-[#47010d] khmer-prose leading-relaxed">
                          <MathText text={item.meaningKh} />
                        </div>
                        {item.example && (
                          <div className="pt-0.5 text-[11px] sm:text-xs text-[#7e021f]">
                            <span className="font-semibold">ឧ. </span>
                            <MathText text={item.example} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
