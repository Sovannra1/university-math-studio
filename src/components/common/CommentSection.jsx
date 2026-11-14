"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, ThumbsUp, Trash2, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";

export default function CommentSection({ contextId = "general", contextTitle = "" }) {
  const { user, isLoggedIn, openLoginModal } = useAuth();
  const storageKey = `math_studio_comments_${contextId}`;

  const [comments, setComments] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setComments(saved ? JSON.parse(saved) : []);
    } catch {
      setComments([]);
    }
  }, [storageKey]);

  const saveComments = (next) => {
    setComments(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: isLoggedIn ? user.name : guestName.trim() || "អ្នកសិក្សា",
      authorEmail: isLoggedIn ? user.email : "",
      authorPicture: isLoggedIn ? user.picture : "",
      authorId: isLoggedIn ? user.id : "guest",
      text: trimmed,
      likes: 0,
      liked: false,
      createdAt: new Date().toLocaleString("km-KH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    saveComments([newComment, ...comments]);
    setText("");
  };

  const handleToggleLike = (id) => {
    const next = comments.map((c) => {
      if (c.id !== id) return c;
      const liked = !c.liked;
      return {
        ...c,
        liked,
        likes: Math.max(0, (c.likes || 0) + (liked ? 1 : -1)),
      };
    });
    saveComments(next);
  };

  const handleDelete = (id) => {
    saveComments(comments.filter((c) => c.id !== id));
  };

  return (
    <section className="mt-8 rounded-2xl border border-[#ffd3d2] bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ffe9e8] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffe9e8] text-[#db073d]">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#160002]">
              មតិយោបល់ និងសំណួរ ({comments.length})
            </h3>
            {contextTitle && (
              <p className="text-[11px] text-[#620116] truncate max-w-md">
                ប្រធានបទ៖ {contextTitle}
              </p>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <button
            type="button"
            onClick={openLoginModal}
            className="text-xs font-bold text-[#db073d] hover:underline"
          >
            ចូលគណនី Google ដើម្បីបង្ហាញឈ្មោះផ្លូវការ
          </button>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {!isLoggedIn && (
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="ឈ្មោះរបស់អ្នក (ទុកទំនេរដើម្បីដាក់ថា អ្នកសិក្សា)"
            className="w-full sm:w-72 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3.5 py-2 text-xs sm:text-sm text-[#160002] outline-none focus:border-[#db073d]"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="សរសេរមតិយោបល់ សំណួរ ឬសំណូមពរកែលម្អ..."
            className="flex-1 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3.5 py-2.5 text-sm text-[#160002] outline-none focus:border-[#db073d] resize-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#db073d] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#bb0533] active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed sm:self-end"
          >
            <Send className="h-4 w-4" />
            <span>បញ្ចេញមតិ</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-5 space-y-3">
        {comments.length === 0 ? (
          <p className="rounded-xl bg-[#fffafa] border border-[#ffe9e8] px-4 py-3 text-xs text-[#620116] text-center">
            មិនទាន់មានមតិយោបល់នៅឡើយទេ។ សូមជាអ្នកដំបូងដែលចែករំលែកមតិ!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[#ffe9e8] bg-[#fffafa] p-3.5 transition-all duration-150 hover:border-[#ffd3d2] animate-panel-enter"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {c.authorPicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.authorPicture}
                      alt={c.author}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe9e8] text-[#9c0329]">
                      <User className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#160002] truncate">
                      {c.author}
                    </div>
                    <div className="text-[10px] text-[#620116]">
                      {c.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(c.id)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all duration-150 active:scale-90 ${
                      c.liked
                        ? "bg-[#ffe9e8] text-[#db073d]"
                        : "text-[#620116] hover:bg-[#ffe9e8]/70"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{c.likes || 0}</span>
                  </button>

                  {(c.authorId === "guest" || (user && c.authorId === user.id)) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      aria-label="លុបមតិ"
                      className="rounded-lg p-1 text-[#620116] hover:bg-[#ffe9e8] hover:text-[#db073d] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-2.5 text-xs sm:text-sm text-[#2d0006] leading-relaxed whitespace-pre-line">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
