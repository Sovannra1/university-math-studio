"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
  User,
  Loader2,
  Sigma,
} from "lucide-react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthContext";
import MathText from "@/components/common/MathText";

const LATEX_SNIPPETS = [
  { label: "$x^2$", insert: "$x^2$" },
  { label: "\\frac{a}{b}", insert: "$\\frac{a}{b}$" },
  { label: "\\lim", insert: "$\\lim_{x \\to a} f(x)$" },
  { label: "\\int", insert: "$\\int_{a}^{b} f(x)\\,dx$" },
  { label: "\\sum", insert: "$\\sum_{n=1}^{\\infty} a_n$" },
  { label: "\\sqrt{x}", insert: "$\\sqrt{x}$" },
];

const TYPING_TTL_MS = 8000;
const TYPING_HEARTBEAT_MS = 2500;

function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = sessionStorage.getItem("math_studio_session_id");
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("math_studio_session_id", id);
    }
    return id;
  } catch {
    return `mem-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export default function CommentSection({ contextId = "general", contextTitle = "" }) {
  const { user, isLoggedIn, openLoginModal } = useAuth();
  const [comments, setComments] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [text, setText] = useState("");
  const [likedIds, setLikedIds] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const sessionIdRef = useRef("");
  const lastTypingPingRef = useRef(0);
  const typingStopTimerRef = useRef(null);
  const textareaRef = useRef(null);

  if (!sessionIdRef.current && typeof window !== "undefined") {
    sessionIdRef.current = getSessionId();
  }

  const clearMyTyping = useCallback(async () => {
    if (!sessionIdRef.current) return;
    lastTypingPingRef.current = 0;
    try {
      await deleteDoc(
        doc(db, "comment_typing", `${contextId}__${sessionIdRef.current}`)
      );
    } catch {
      // Ignore if rules/offline
    }
  }, [contextId]);

  const pingTyping = useCallback(
    async (authorDisplayName) => {
      if (!sessionIdRef.current) return;
      const now = Date.now();
      if (now - lastTypingPingRef.current < TYPING_HEARTBEAT_MS) return;
      lastTypingPingRef.current = now;
      try {
        await setDoc(
          doc(db, "comment_typing", `${contextId}__${sessionIdRef.current}`),
          {
            contextId,
            sessionId: sessionIdRef.current,
            authorName: authorDisplayName,
            updatedAtMs: now,
          }
        );
      } catch {
        // Ignore if rules/offline
      }
    },
    [contextId]
  );

  // Listen to real-time comments & real-time typing indicators
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem(`math_studio_likes_${contextId}`);
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));
    } catch {
      // Ignore
    }

    setLoading(true);
    setErrorMsg("");

    const commentsQuery = query(
      collection(db, "comments"),
      where("contextId", "==", contextId)
    );
    const unsubComments = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        items.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
        setComments(items);
        setLoading(false);
      },
      () => {
        setErrorMsg("មិនអាចផ្ទុកមតិយោបល់ពី Firebase Firestore បានទេ។");
        setLoading(false);
      }
    );

    const typingQuery = query(
      collection(db, "comment_typing"),
      where("contextId", "==", contextId)
    );
    const unsubTyping = onSnapshot(
      typingQuery,
      (snapshot) => {
        const now = Date.now();
        const active = snapshot.docs
          .map((d) => d.data())
          .filter(
            (t) =>
              t.sessionId !== sessionIdRef.current &&
              now - (t.updatedAtMs || 0) < TYPING_TTL_MS
          );
        setTypingUsers(active);
      },
      () => {
        setTypingUsers([]);
      }
    );

    // Prune stale typing entries locally every 3s
    const pruneInterval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) =>
        prev.filter((t) => now - (t.updatedAtMs || 0) < TYPING_TTL_MS)
      );
    }, 3000);

    return () => {
      unsubComments();
      unsubTyping();
      clearInterval(pruneInterval);
      clearMyTyping();
    };
  }, [contextId, clearMyTyping]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }

    if (val.trim().length > 0) {
      const authorLabel = isLoggedIn
        ? user.name
        : guestName.trim() || "អ្នកសិក្សាម្នាក់";
      pingTyping(authorLabel);
      typingStopTimerRef.current = setTimeout(() => {
        clearMyTyping();
      }, 4500);
    } else {
      clearMyTyping();
    }
  };

  const handleInsertLatex = (snippet) => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => (prev ? `${prev} ${snippet}` : snippet));
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + snippet + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    await clearMyTyping();

    try {
      const now = Date.now();
      await addDoc(collection(db, "comments"), {
        contextId,
        author: isLoggedIn ? user.name : guestName.trim() || "អ្នកសិក្សា",
        authorEmail: isLoggedIn ? user.email : "",
        authorPicture: isLoggedIn ? user.picture : "",
        authorId: isLoggedIn ? user.id : "guest",
        text: trimmed,
        likes: 0,
        createdAtMs: now,
        createdAtLabel: new Date(now).toLocaleString("km-KH", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
      setText("");
    } catch {
      setErrorMsg("មិនអាចផ្ញើមតិយោបល់បានទេ។ សូមពិនិត្យ Firestore Rules ឬអ៊ីនធឺណិត។");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    const alreadyLiked = !!likedIds[commentId];
    const nextLiked = { ...likedIds, [commentId]: !alreadyLiked };
    setLikedIds(nextLiked);
    try {
      localStorage.setItem(
        `math_studio_likes_${contextId}`,
        JSON.stringify(nextLiked)
      );
      await updateDoc(doc(db, "comments", commentId), {
        likes: increment(alreadyLiked ? -1 : 1),
      });
    } catch {
      // Ignore transient errors
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch {
      setErrorMsg("មិនអាចលុបមតិនេះបានទេ។");
    }
  };

  const hasMathSyntax = /(\$|\\\(|\\\[)/.test(text);

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

        {/* Quick LaTeX Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7e021f] mr-1">
            <Sigma className="h-3.5 w-3.5 text-[#db073d]" />
            រូបមន្ត LaTeX:
          </span>
          {LATEX_SNIPPETS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleInsertLatex(item.insert)}
              className="rounded-lg border border-[#ffd3d2] bg-[#fffafa] px-2 py-1 font-mono text-[11px] font-semibold text-[#620116] transition-all duration-150 hover:border-[#fdbcbc] hover:bg-[#ffe9e8] hover:text-[#db073d] active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={handleTextChange}
            placeholder="សរសេរមតិយោបល់ ឬរូបមន្តគណិតវិទ្យាដោយប្រើ $...$ ឬ $$...$$..."
            className="flex-1 rounded-xl border border-[#ffd3d2] bg-[#fffafa] px-3.5 py-2.5 text-sm text-[#160002] outline-none focus:border-[#db073d] resize-y"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#db073d] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#bb0533] active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed sm:self-end"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{submitting ? "កំពុងផ្ញើ..." : "បញ្ចេញមតិ"}</span>
          </button>
        </div>

        {/* Live LaTeX Preview */}
        {hasMathSyntax && text.trim() && (
          <div className="rounded-xl border border-[#b2e4ea] bg-[#f4fbfc] px-3.5 py-2.5 text-xs sm:text-sm text-[#160002] animate-fade-fast">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#006b78] mb-1">
              មើលជាមុន (LaTeX Preview)
            </div>
            <div className="space-y-1">
              {text.split("\n").map((line, i) => (
                <div key={i}>
                  <MathText text={line} />
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs font-medium text-[#db073d]">{errorMsg}</p>
        )}
      </form>

      {/* Real-time Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#fdbcbc] bg-[#ffe9e8]/80 px-3.5 py-1.5 text-xs font-bold text-[#9c0329] animate-fade-fast">
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#db073d] animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#db073d] animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#db073d] animate-bounce [animation-delay:300ms]" />
          </span>
          <span>
            {typingUsers.length === 1
              ? `${typingUsers[0].authorName} កំពុងសរសេរ...`
              : `មាន ${typingUsers.length} នាក់កំពុងសរសេរ...`}
          </span>
        </div>
      )}

      {/* Comments List */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-[#fffafa] border border-[#ffe9e8] px-4 py-4 text-xs text-[#620116]">
            <Loader2 className="h-4 w-4 animate-spin text-[#db073d]" />
            <span>កំពុងផ្ទុកមតិយោបល់...</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="rounded-xl bg-[#fffafa] border border-[#ffe9e8] px-4 py-3 text-xs text-[#620116] text-center">
            មិនទាន់មានមតិយោបល់នៅឡើយទេ។ សូមជាអ្នកដំបូងដែលចែករំលែកមតិ!
          </p>
        ) : (
          comments.map((c) => {
            const isLiked = !!likedIds[c.id];
            const canDelete = user && c.authorId === user.id;

            return (
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
                        {c.createdAtLabel || ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(c.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all duration-150 active:scale-90 ${
                        isLiked
                          ? "bg-[#ffe9e8] text-[#db073d]"
                          : "text-[#620116] hover:bg-[#ffe9e8]/70"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{Math.max(0, c.likes || 0)}</span>
                    </button>

                    {canDelete && (
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

                <div className="mt-2.5 text-xs sm:text-sm text-[#2d0006] leading-relaxed space-y-1">
                  {(c.text || "").split("\n").map((line, i) => (
                    <div key={i}>
                      <MathText text={line} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
