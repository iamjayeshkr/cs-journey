"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Check,
  FilePlus2,
  NotebookPen,
  Pin,
  Save,
  Search,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { playPageTurn, playPencilStroke, playPinClick } from "@/lib/notebook-sound";

interface NoteItem {
  id: string;
  title: string;
  content: string;
  pinned: number;
  updated_at: string;
}

interface BookmarkItem {
  id: string;
  target_type: string;
  target_id: string;
  label: string;
}

type InkStyle = "blue" | "sepia" | "graphite";

const INK_STYLES: Record<InkStyle, { label: string; color: string; dot: string }> = {
  blue: { label: "Blue Pen", color: "#1E3A6D", dot: "#1E3A6D" },
  sepia: { label: "Fountain Ink", color: "#3D2618", dot: "#493426" },
  graphite: { label: "HB Pencil", color: "#4A4E54", dot: "#646970" },
};

const SPIRAL_RINGS = Array.from({ length: 14 }, (_, i) => i);

export default function NotesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Active page state (either editing an existing note id, or null for a fresh blank page)
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Notebook UI state
  const [leftTab, setLeftTab] = useState<"notes" | "bookmarks">("notes");
  const [search, setSearch] = useState("");
  const [inkStyle, setInkStyle] = useState<InkStyle>("blue");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pageFlipAnim, setPageFlipAnim] = useState(false);
  const [todayLabel, setTodayLabel] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function loadAll(selectId?: string | null) {
    const [me, nRes, bRes] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/notes").then((r) => r.json()),
      fetch("/api/bookmarks").then((r) => r.json()),
    ]);
    const fetchedUser: UserProfile | null = me.user ?? null;
    const fetchedNotes: NoteItem[] = nRes.notes ?? [];
    setUser(fetchedUser);
    if (fetchedUser && typeof fetchedUser.sound_enabled === "number") {
      setSoundEnabled(fetchedUser.sound_enabled !== 0);
    }
    setNotes(fetchedNotes);
    setBookmarks(bRes.bookmarks ?? []);

    if (selectId) {
      const target = fetchedNotes.find((n) => n.id === selectId);
      if (target) {
        setActiveId(target.id);
        setTitle(target.title);
        setContent(target.content);
        setDirty(false);
      }
    }
  }

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
    loadAll();
  }, []);

  function triggerFlipAnim() {
    setPageFlipAnim(true);
    setTimeout(() => setPageFlipAnim(false), 240);
  }

  function openNote(note: NoteItem) {
    if (soundEnabled) playPageTurn();
    triggerFlipAnim();
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setDirty(false);
  }

  function startBlankPage() {
    if (soundEnabled) playPageTurn();
    triggerFlipAnim();
    setActiveId(null);
    setTitle("");
    setContent("");
    setDirty(false);
    setTimeout(() => textareaRef.current?.focus(), 60);
  }

  async function saveCurrentPage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cleanTitle = title.trim() || "Untitled Page";
    if (!content.trim() && !title.trim()) return;

    setSaving(true);
    try {
      if (activeId) {
        const res = await fetch("/api/notes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeId, title: cleanTitle, content }),
        });
        if (res.ok) {
          if (soundEnabled) playPinClick();
          setTitle(cleanTitle);
          setDirty(false);
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 1800);
          await loadAll(activeId);
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: cleanTitle, content }),
        });
        if (res.ok) {
          const data = await res.json();
          const newId = data.note?.id ?? null;
          if (soundEnabled) playPinClick();
          setTitle(cleanTitle);
          setDirty(false);
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 1800);
          await loadAll(newId);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function togglePin(n: NoteItem, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (soundEnabled) playPinClick();
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: n.id, pinned: !n.pinned }),
    });
    await loadAll(activeId);
  }

  async function deleteNote(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (soundEnabled) playPageTurn();
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if (activeId === id) {
      setActiveId(null);
      setTitle("");
      setContent("");
      setDirty(false);
    }
    await loadAll();
  }

  function handleTypingKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveCurrentPage();
      return;
    }
    if (!soundEnabled) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "Backspace" || e.key === "Delete") {
      playPencilStroke("backspace");
    } else if (e.key === "Enter") {
      playPencilStroke("enter");
    } else if (e.key === " ") {
      playPencilStroke("space");
    } else if (e.key.length === 1) {
      playPencilStroke("char");
    }
  }

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeId) ?? null,
    [notes, activeId]
  );

  const activePageNumber = useMemo(() => {
    if (!activeId) return notes.length + 1;
    const idx = notes.findIndex((n) => n.id === activeId);
    return idx >= 0 ? idx + 1 : notes.length + 1;
  }, [notes, activeId]);

  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [content]);

  const inkColor = INK_STYLES[inkStyle].color;

  return (
    <JournalShell user={user}>
      <div className="space-y-4">
        {/* Top Desk Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2 text-ink">
              <NotebookPen className="w-7 h-7 text-terracotta" /> Student Notebook &amp; Marks
            </h1>
            <p className="text-xs text-ink-muted">
              Ruled pages, handwritten ink, pencil-on-paper sound, and ribbon-marked concepts. Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-parchment border border-ink/20 font-mono text-[10px]">
                ⌘/Ctrl + S
              </kbd>{" "}
              to save a page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ink Selector */}
            <div className="flex items-center gap-1 bg-ivory border border-ink/20 rounded-full px-2.5 py-1 shadow-sm">
              {(Object.keys(INK_STYLES) as InkStyle[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInkStyle(key)}
                  title={INK_STYLES[key].label}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition ${
                    inkStyle === key
                      ? "bg-parchment text-ink border border-ink/30 shadow-inner"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: INK_STYLES[key].dot }}
                  />
                  <span className="hidden sm:inline">{INK_STYLES[key].label}</span>
                </button>
              ))}
            </div>

            {/* Pencil Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                soundEnabled
                  ? "bg-sage/20 border-sage/50 text-ink"
                  : "bg-ivory border-ink/20 text-ink-muted"
              }`}
              title="Toggle pencil-on-paper typing sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-sage" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{soundEnabled ? "Paper Sound: ON" : "Muted"}</span>
            </button>
          </div>
        </div>

        {/* Physical Hardcover Spiral Notebook Spread */}
        <div
          className="relative rounded-2xl p-2 sm:p-3.5 shadow-[0_18px_40px_rgba(73,52,38,0.22)] border-2 border-[#3E2A1E]"
          style={{
            background:
              "linear-gradient(135deg, #6A4935 0%, #4E3426 50%, #3E281C 100%)",
          }}
        >
          {/* Decorative stitched leather border */}
          <div className="rounded-xl border border-dashed border-[#D5AE65]/40 p-1 sm:p-2">
            <div className="relative grid lg:grid-cols-12 rounded-lg overflow-hidden bg-[#F9F1DF] shadow-inner min-h-[620px]">
              {/* LEFT PAGE: Notebook Index & Ribbon Bookmarks */}
              <div
                className="lg:col-span-4 relative flex flex-col border-b lg:border-b-0 lg:border-r border-[#D6C3A5] min-h-[340px] lg:min-h-[620px]"
                style={{
                  backgroundColor: "#F6ECD6",
                  backgroundImage:
                    "radial-gradient(rgba(73,52,38,0.03) 1px, transparent 0), repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(145, 175, 192, 0.28) 31px, rgba(145, 175, 192, 0.28) 32px)",
                  backgroundSize: "16px 16px, 100% 32px",
                }}
              >
                {/* Red Bookmark Ribbon hanging from top */}
                <div
                  className="absolute right-5 top-0 w-4 h-12 shadow-sm pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, #B8523E 0%, #9E3F2D 100%)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                  }}
                />

                {/* Index Header + Sticky Tabs */}
                <div className="px-4 pt-4 pb-2 border-b-2 border-[#D66853]/45 bg-[#F4E7CE]/80">
                  <div className="flex items-center justify-between gap-2 pr-6">
                    <span className="font-hand text-2xl font-bold text-ink tracking-wide">
                      Notebook Index
                    </span>
                    <button
                      type="button"
                      onClick={startBlankPage}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#493426] text-[#F9F1DF] text-[11px] font-semibold hover:bg-[#3A281E] transition shadow-sm"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" /> New Page
                    </button>
                  </div>

                  {/* Sticky Note Tabs */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPageTurn();
                        setLeftTab("notes");
                      }}
                      className={`px-3 py-1 rounded-t-md text-xs font-hand text-lg font-bold border border-b-0 transition ${
                        leftTab === "notes"
                          ? "bg-[#FAF3E3] text-ink border-[#C9B391] -mb-[9px] pb-2 z-10 shadow-sm"
                          : "bg-[#EAD9BA]/70 text-ink-muted border-transparent hover:bg-[#EAD9BA]"
                      }`}
                    >
                      Pages ({notes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPageTurn();
                        setLeftTab("bookmarks");
                      }}
                      className={`px-3 py-1 rounded-t-md text-xs font-hand text-lg font-bold border border-b-0 transition flex items-center gap-1 ${
                        leftTab === "bookmarks"
                          ? "bg-[#FFF6CC] text-ink border-[#D5AE65] -mb-[9px] pb-2 z-10 shadow-sm"
                          : "bg-[#EAD9BA]/70 text-ink-muted border-transparent hover:bg-[#EAD9BA]"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-terracotta" /> Marks ({bookmarks.length})
                    </button>
                  </div>
                </div>

                {/* Left Page Body */}
                {leftTab === "notes" ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 py-2 border-b border-ink/10 bg-[#F9F1DF]/60">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Find a page in index..."
                          className="w-full pl-8 pr-3 py-1 text-xs rounded bg-[#FAF4E8] border border-ink/20 focus:outline-none focus:border-terracotta"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-ink/10">
                      {filteredNotes.length === 0 ? (
                        <div className="p-6 text-center space-y-2">
                          <p className="font-hand text-2xl text-ink-muted">
                            {notes.length === 0
                              ? "Your notebook is fresh and blank!"
                              : "No matching pages found."}
                          </p>
                          <p className="text-xs text-ink-muted">
                            Start writing on the right page and save your first study note.
                          </p>
                        </div>
                      ) : (
                        filteredNotes.map((n, index) => {
                          const isSelected = n.id === activeId;
                          return (
                            <div
                              key={n.id}
                              onClick={() => openNote(n)}
                              className={`group cursor-pointer px-4 py-2.5 transition flex items-start justify-between gap-2 ${
                                isSelected
                                  ? "bg-[#FFF4D2]/85 border-l-4 border-l-terracotta"
                                  : "hover:bg-[#FAF3E3]/80"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] text-ink-muted bg-parchment px-1.5 py-0.5 rounded border border-ink/10">
                                    P.{String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h3
                                    className="font-hand text-xl font-bold truncate"
                                    style={{ color: inkColor }}
                                  >
                                    {n.title}
                                  </h3>
                                </div>
                                <p className="font-hand text-base text-ink-muted truncate mt-0.5 pl-9">
                                  {n.content || "Empty page..."}
                                </p>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0 pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => togglePin(n, e)}
                                  className={`p-1 rounded transition ${
                                    n.pinned
                                      ? "text-terracotta"
                                      : "text-ink-muted/40 opacity-0 group-hover:opacity-100 hover:text-terracotta"
                                  }`}
                                  title={n.pinned ? "Unpin page" : "Pin page"}
                                >
                                  <Pin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => deleteNote(n.id, e)}
                                  className="p-1 rounded text-ink-muted/40 opacity-0 group-hover:opacity-100 hover:text-terracotta transition"
                                  title="Tear out page"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    {bookmarks.length === 0 ? (
                      <div className="sticky-note p-4 rounded text-center space-y-1.5">
                        <p className="font-hand text-2xl font-bold text-ink">No Marks Yet</p>
                        <p className="text-xs text-ink-muted">
                          Click the bookmark icon on any concept lesson to pin it here like a sticky tab.
                        </p>
                      </div>
                    ) : (
                      bookmarks.map((b) => (
                        <Link
                          key={b.id}
                          href={`/concepts/${b.target_id}`}
                          className="block sticky-note p-3 rounded hover:-translate-y-0.5 transition shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-hand text-xl font-bold text-ink leading-tight">
                              {b.label}
                            </span>
                            <Bookmark className="w-3.5 h-3.5 text-terracotta shrink-0" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                            Jump to concept →
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* CENTER SPIRAL WIRE BINDING (Desktop) */}
              <div
                aria-hidden="true"
                className="hidden lg:flex flex-col justify-between items-center py-5 w-7 pointer-events-none absolute left-[33.3333%] -translate-x-1/2 top-0 bottom-0 z-20"
              >
                {SPIRAL_RINGS.map((ring) => (
                  <div key={ring} className="relative flex items-center justify-center w-full h-5">
                    {/* Punched paper holes */}
                    <span className="absolute left-0.5 w-2 h-2 rounded-full bg-[#493426]/75 shadow-inner" />
                    <span className="absolute right-0.5 w-2 h-2 rounded-full bg-[#493426]/75 shadow-inner" />
                    {/* Metallic wire loop */}
                    <span
                      className="w-6 h-2.5 rounded-full border-2 border-[#5D493B] shadow-sm"
                      style={{
                        background:
                          "linear-gradient(180deg, #B9A795 0%, #6E5847 65%, #3C2C22 100%)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* RIGHT PAGE: Authentic Ruled Writing Sheet */}
              <form
                onSubmit={saveCurrentPage}
                className={`lg:col-span-8 relative flex flex-col transition-all duration-200 ${
                  pageFlipAnim ? "opacity-75 translate-x-1" : "opacity-100 translate-x-0"
                }`}
                style={{
                  backgroundColor: "#FBF5E6",
                  backgroundImage:
                    "radial-gradient(rgba(73,52,38,0.025) 1px, transparent 0), repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(132, 169, 191, 0.38) 31px, rgba(132, 169, 191, 0.38) 32px)",
                  backgroundSize: "18px 18px, 100% 32px",
                  backgroundPosition: "0 0, 0 76px",
                }}
              >
                {/* Classic Double Vertical Red Margin Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 left-10 sm:left-14 w-[4px] border-l border-r border-[#D66853]/55"
                />

                {/* Notebook Top Header Block (above the top ruled line) */}
                <div className="pl-14 sm:pl-20 pr-5 pt-4 pb-2.5 border-b-2 border-[#D66853]/55 flex flex-wrap items-center justify-between gap-2 bg-[#FAF2DF]/70">
                  <div className="flex items-center gap-3 text-xs text-ink-muted">
                    <span className="font-hand text-xl font-bold text-ink">
                      Page {String(activePageNumber).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-mono border border-ink/20 rounded px-2 py-0.5 bg-ivory/80">
                      Date: {activeNote ? activeNote.updated_at.slice(0, 10) : todayLabel || "Today"}
                    </span>
                    {activeNote?.pinned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {savedToast ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage">
                        <Check className="w-3.5 h-3.5" /> Saved!
                      </span>
                    ) : dirty ? (
                      <span className="text-[11px] italic text-terracotta">Unsaved ink...</span>
                    ) : null}

                    {activeNote && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => togglePin(activeNote, e)}
                          className={`p-1.5 rounded border text-xs transition ${
                            activeNote.pinned
                              ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                              : "bg-ivory border-ink/20 text-ink-muted hover:text-ink"
                          }`}
                          title={activeNote.pinned ? "Unpin note" : "Pin note"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => deleteNote(activeNote.id, e)}
                          className="p-1.5 rounded border bg-ivory border-ink/20 text-ink-muted hover:text-terracotta transition"
                          title="Delete this page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={saving || (!title.trim() && !content.trim())}
                      className="terracotta-btn px-3.5 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? "Saving..." : activeId ? "Update Page" : "Save Page"}
                    </button>
                  </div>
                </div>

                {/* Title Line (Handwritten Header) */}
                <div className="pl-14 sm:pl-20 pr-6 pt-2">
                  <input
                    type="text"
                    value={title}
                    onKeyDown={handleTypingKeyDown}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setDirty(true);
                    }}
                    placeholder="Chapter / Topic Heading (e.g., Master Theorem & Recurrence)..."
                    style={{ color: inkColor }}
                    className="w-full bg-transparent font-hand text-3xl font-bold leading-[32px] h-[36px] focus:outline-none placeholder:text-ink-muted/45"
                  />
                </div>

                {/* Ruled Handwriting Body Area */}
                <div className="relative flex-1 pl-14 sm:pl-20 pr-6 pb-6 pt-1">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onKeyDown={handleTypingKeyDown}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setDirty(true);
                    }}
                    placeholder="Write your notes here just like on ruled paper... formulas, shortcuts, mnemonics, PYQ tricks..."
                    style={{ color: inkColor }}
                    className="w-full h-full min-h-[450px] resize-none bg-transparent font-hand text-[23px] leading-[32px] focus:outline-none placeholder:text-ink-muted/40"
                  />
                </div>

                {/* Bottom Margin Footer */}
                <div className="pl-14 sm:pl-20 pr-6 py-2.5 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted bg-[#F9F1DF]/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    Tip: Choose Blue Pen, Fountain Ink, or HB Pencil above.
                  </span>
                  <span className="font-mono">{wordCount} words on this page</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
