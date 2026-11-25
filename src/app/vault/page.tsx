"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers,
  Lightbulb,
  NotebookPen,
  RotateCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import {
  FlashcardCategory,
  generateTopicFlashcards,
  RichFlashcard,
  TopicFlashcardSeed,
} from "@/lib/flashcard-bank";

interface RevisionItem {
  id: string;
  concept_id: string;
  concept_title: string;
  kingdom_title: string;
  revision_summary: string;
  interval_days: number;
  next_review_at: string;
}

const CARDS_PER_TOPIC = 520;

const CATEGORY_OPTIONS: Array<"All" | FlashcardCategory> = [
  "All",
  "Formula & Symbols",
  "Core Concept",
  "Exam Trap",
  "Comparison",
  "Complexity & Bounds",
  "PYQ Recall",
  "Interview",
];

export default function MemoryVaultPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [topics, setTopics] = useState<TopicFlashcardSeed[]>([]);
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string }>>([]);
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; target_id: string; label: string }>>([]);

  // Topic & Deck Controls
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | FlashcardCategory>("All");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showSymbolHintOnFront, setShowSymbolHintOnFront] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [jumpInput, setJumpInput] = useState("");
  const [msg, setMsg] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [savedCardId, setSavedCardId] = useState<string | null>(null);

  async function loadVault() {
    const [me, rev, nRes, bRes] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
      fetch("/api/notes").then((r) => r.json()),
      fetch("/api/bookmarks").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setRevisions(rev.revisions ?? []);
    const fetchedTopics: TopicFlashcardSeed[] = rev.flashcards ?? [];
    setTopics(fetchedTopics);
    setSelectedTopicId((prev) => prev || fetchedTopics[0]?.concept_id || "");
    setNotes(nRes.notes ?? []);
    setBookmarks(bRes.bookmarks ?? []);
  }

  useEffect(() => {
    loadVault();
  }, []);

  const units = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const t of topics) {
      if (!seen.has(t.kingdom_title)) {
        seen.add(t.kingdom_title);
        list.push(t.kingdom_title);
      }
    }
    return list;
  }, [topics]);

  const filteredTopics = useMemo(() => {
    if (selectedUnit === "ALL") return topics;
    return topics.filter((t) => t.kingdom_title === selectedUnit);
  }, [topics, selectedUnit]);

  const activeTopic = useMemo(() => {
    return (
      filteredTopics.find((t) => t.concept_id === selectedTopicId) ||
      filteredTopics[0] ||
      topics[0] ||
      null
    );
  }, [filteredTopics, topics, selectedTopicId]);

  const topicDeck: RichFlashcard[] = useMemo(() => {
    if (!activeTopic) return [];
    const all = generateTopicFlashcards(activeTopic, CARDS_PER_TOPIC);
    const byCat =
      selectedCategory === "All"
        ? all
        : all.filter((c) => c.category === selectedCategory);

    if (shuffleSeed === 0) return byCat;
    // Deterministic Fisher-Yates shuffle based on shuffleSeed
    const copy = [...byCat];
    let s = shuffleSeed * 9301 + 49297;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = s % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [activeTopic, selectedCategory, shuffleSeed]);

  const activeCard = topicDeck[cardIdx] ?? topicDeck[0] ?? null;

  // Keyboard shortcuts: Space to flip, Left/Right arrows to navigate
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setFlipped(false);
        setCardIdx((i) => (topicDeck.length ? (i + 1) % topicDeck.length : 0));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setFlipped(false);
        setCardIdx((i) =>
          topicDeck.length ? (i - 1 + topicDeck.length) % topicDeck.length : 0
        );
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [topicDeck.length]);

  async function reviewCard(conceptId: string, rating: "again" | "good" | "easy") {
    const res = await fetch("/api/revisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept_id: conceptId, rating }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Scheduled next review in ${data.next_interval_days} day(s)! +${data.xp_awarded} XP`);
      setFlipped(false);
      if (topicDeck.length > 0) setCardIdx((i) => (i + 1) % topicDeck.length);
      loadVault();
    }
  }

  async function saveCardToNotebook(card: RichFlashcard) {
    setSavingNote(true);
    try {
      const symbolLines =
        card.symbols.length > 0
          ? "\n\nSymbol Key:\n" +
            card.symbols.map((s) => `• ${s.symbol} (${s.name}): ${s.meaning}`).join("\n")
          : "";
      const bodyContent = `Question:\n${card.front}\n\nAnswer:\n${card.back}\n\nTeacher Note:\n${card.teacherNote}\n\nExam Tip: ${card.examTip}${symbolLines}`;
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${card.topicTitle} — Card #${card.cardNumber}`,
          content: bodyContent,
        }),
      });
      if (res.ok) {
        setSavedCardId(card.id);
        setMsg(`Saved Flashcard #${card.cardNumber} with its notes & symbol key to your Notebook!`);
        loadVault();
      }
    } finally {
      setSavingNote(false);
    }
  }

  function handleJump(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!Number.isNaN(num) && num >= 1 && num <= topicDeck.length) {
      setCardIdx(num - 1);
      setFlipped(false);
      setJumpInput("");
    }
  }

  const progressPct = topicDeck.length
    ? Math.round(((cardIdx + 1) / topicDeck.length) * 100)
    : 0;

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2 text-ink">
              <Layers className="w-7 h-7 text-forest" /> Memory Vault — Flashcards &amp; Spaced Repetition
            </h1>
            <p className="text-sm text-ink-muted">
              <strong className="text-ink">{CARDS_PER_TOPIC}+ flashcards per topic</strong> across all{" "}
              <strong className="text-ink">{topics.length || 90} topics</strong> (
              {((topics.length || 90) * CARDS_PER_TOPIC).toLocaleString()}+ cards total) — every card includes
              plain-English teacher notes &amp; a symbol decoder.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-forest/15 border border-forest/30 font-semibold text-ink">
              {topics.length || 90} Topics × {CARDS_PER_TOPIC} Cards
            </span>
          </div>
        </div>

        {msg && (
          <div className="p-3 rounded-lg bg-forest/15 border border-forest/50 text-xs font-semibold flex items-center justify-between">
            <span>{msg}</span>
            <button type="button" onClick={() => setMsg("")} className="text-ink-muted hover:text-ink ml-3">
              ✕
            </button>
          </div>
        )}

        {/* Topic & Unit Selector Card */}
        <div className="journal-card p-4 space-y-3">
          <div className="grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                1. Choose Unit (10 Units)
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  const u = e.target.value;
                  setSelectedUnit(u);
                  const nextTopic =
                    u === "ALL" ? topics[0] : topics.find((t) => t.kingdom_title === u);
                  if (nextTopic) {
                    setSelectedTopicId(nextTopic.concept_id);
                    setCardIdx(0);
                    setFlipped(false);
                  }
                }}
                className="w-full px-3 py-2 rounded bg-ivory border border-ink/25 text-xs font-semibold"
              >
                <option value="ALL">All 10 Units ({topics.length} Topics)</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                2. Choose Topic ({filteredTopics.length} available • {CARDS_PER_TOPIC} cards each)
              </label>
              <select
                value={activeTopic?.concept_id || ""}
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  setCardIdx(0);
                  setFlipped(false);
                }}
                className="w-full px-3 py-2 rounded bg-ivory border border-ink/25 text-xs font-semibold"
              >
                {filteredTopics.map((t, idx) => (
                  <option key={t.concept_id} value={t.concept_id}>
                    {idx + 1}. {t.title} ({CARDS_PER_TOPIC} cards)
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <form onSubmit={handleJump} className="flex items-center gap-1.5 flex-1">
                <input
                  type="number"
                  min={1}
                  max={topicDeck.length || CARDS_PER_TOPIC}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder={`Card # (1-${topicDeck.length || CARDS_PER_TOPIC})`}
                  className="w-full px-2.5 py-2 rounded bg-ivory border border-ink/25 text-xs"
                />
                <button type="submit" className="parchment-btn px-2.5 py-2 rounded text-xs font-semibold">
                  Go
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setShuffleSeed((s) => s + 1);
                  setCardIdx(0);
                  setFlipped(false);
                }}
                title="Shuffle this topic's 520-card deck"
                className="parchment-btn p-2 rounded text-xs font-semibold"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCardIdx(0);
                  setFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                  selectedCategory === cat
                    ? "bg-ink text-ivory border-ink"
                    : "bg-ivory text-ink-muted border-ink/20 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: Beautiful Tactile Flashcard + Attached Notes & Symbol Decoder */}
          <div className="lg:col-span-8 space-y-4">
            {/* Progress & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">
                  Card {topicDeck.length ? cardIdx + 1 : 0} of {topicDeck.length}
                </span>
                {activeCard && (
                  <span className="px-2 py-0.5 rounded bg-parchment border border-ink/20 text-[11px] font-semibold text-ink">
                    {activeCard.category}
                  </span>
                )}
                {activeCard && (
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      activeCard.difficulty === "Foundation"
                        ? "bg-sage/20 text-ink"
                        : activeCard.difficulty === "Exam Core"
                        ? "bg-amber-200/60 text-ink"
                        : "bg-terracotta/20 text-terracotta"
                    }`}
                  >
                    {activeCard.difficulty}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSymbolHintOnFront((v) => !v)}
                  className="parchment-btn px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-terracotta" />
                  {showSymbolHintOnFront ? "Hide Symbol Help" : "Show Symbol Help"}
                </button>
                <button
                  type="button"
                  onClick={() => setFlipped(!flipped)}
                  className="parchment-btn px-3 py-1 rounded font-semibold inline-flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Flip (Space)
                </button>
              </div>
            </div>

            {/* Thin Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-parchment overflow-hidden border border-ink/10">
              <div
                className="h-full bg-forest transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Physical Index-Card Flashcard */}
            {activeCard && (
              <div
                onClick={() => setFlipped(!flipped)}
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 shadow-[0_10px_24px_rgba(73,52,38,0.12)] overflow-hidden ${
                  flipped
                    ? "bg-[#FAF4E8] border-forest/60"
                    : "bg-[#FFFDF7] border-ink/30 hover:border-terracotta/60"
                }`}
              >
                {/* Classic Index Card Red Top Ruled Line + Ruled Lines */}
                <div
                  className="px-6 pt-3 pb-2 border-b-2 border-[#D66853]/65 flex items-center justify-between bg-[#F7EEDB]/70"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                    {activeCard.unitTitle} • {activeCard.topicTitle}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    #{String(activeCard.cardNumber).padStart(3, "0")} • {flipped ? "ANSWER & NOTES" : "PROMPT"}
                  </span>
                </div>

                <div
                  className="p-6 sm:p-8 min-h-[240px] flex flex-col justify-center"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(145, 175, 192, 0.25) 31px, rgba(145, 175, 192, 0.25) 32px)",
                    backgroundSize: "100% 32px",
                  }}
                >
                  {!flipped ? (
                    <div className="space-y-4 text-center">
                      <p className="font-serif text-lg sm:text-xl font-semibold text-ink whitespace-pre-line leading-relaxed">
                        {activeCard.front}
                      </p>
                      <p className="text-xs text-ink-muted">
                        Click card or press <kbd className="px-1.5 py-0.5 rounded bg-parchment border border-ink/20 font-mono text-[10px]">Space</kbd> to reveal answer &amp; attached study note
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                          Precise Answer
                        </span>
                        <p className="font-serif text-base sm:text-lg text-ink whitespace-pre-line leading-relaxed mt-1">
                          {activeCard.back}
                        </p>
                      </div>

                      {/* Attached Teacher Note right inside the back face */}
                      <div className="sticky-note p-4 rounded-lg border border-[#D5AE65] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                          <Lightbulb className="w-4 h-4 text-terracotta" />
                          <span>Attached Note (Simple Words)</span>
                        </div>
                        <p className="font-hand text-xl text-ink leading-snug">
                          {activeCard.teacherNote}
                        </p>
                        <p className="text-[11px] text-ink-muted pt-1 border-t border-ink/10">
                          <strong>Exam Tip:</strong> {activeCard.examTip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Symbol Decoder Box (always accessible if symbols exist OR show general note) */}
            {activeCard && (showSymbolHintOnFront || flipped) && (
              <div className="journal-card p-4 space-y-3 bg-[#FBF4E4]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-hand text-2xl font-bold flex items-center gap-1.5 text-ink">
                    <BookOpen className="w-4 h-4 text-terracotta" />
                    Attached Study Note &amp; Symbol Decoder
                  </h3>
                  <button
                    type="button"
                    disabled={savingNote}
                    onClick={() => saveCardToNotebook(activeCard)}
                    className="parchment-btn px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    {savedCardId === activeCard.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-forest" /> Saved to Notebook
                      </>
                    ) : (
                      <>
                        <NotebookPen className="w-3.5 h-3.5 text-terracotta" /> Save Note to Notebook
                      </>
                    )}
                  </button>
                </div>

                {activeCard.symbols.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activeCard.symbols.map((sym) => (
                      <div
                        key={sym.symbol}
                        className="p-2.5 rounded-lg bg-ivory border border-ink/20 flex items-start gap-2.5"
                      >
                        <span className="w-9 h-9 rounded bg-parchment border border-ink/25 flex items-center justify-center font-mono text-base font-bold text-terracotta shrink-0">
                          {sym.symbol}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink">{sym.name}</p>
                          <p className="text-[11px] text-ink-muted leading-snug mt-0.5">
                            {sym.meaning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">
                    No special math symbols on this card — use the Teacher Note below for quick intuition!
                  </p>
                )}

                {!flipped && (
                  <div className="p-3 rounded-lg bg-ivory border border-ink/15 text-xs text-ink-muted flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-ink">Hint Note:</strong> {activeCard.examTip}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation + Spaced Repetition Buttons */}
            {activeCard && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFlipped(false);
                      setCardIdx((i) =>
                        topicDeck.length ? (i - 1 + topicDeck.length) % topicDeck.length : 0
                      );
                    }}
                    className="parchment-btn px-3 py-2 rounded text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlipped(false);
                      setCardIdx((i) => (topicDeck.length ? (i + 1) % topicDeck.length : 0));
                    }}
                    className="parchment-btn px-3 py-2 rounded text-xs font-semibold inline-flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 flex-1 sm:flex-initial">
                  <button
                    type="button"
                    onClick={() => reviewCard(activeCard.conceptId, "again")}
                    className="terracotta-btn px-3 py-2 rounded text-xs font-semibold"
                  >
                    Again (1d)
                  </button>
                  <button
                    type="button"
                    onClick={() => reviewCard(activeCard.conceptId, "good")}
                    className="parchment-btn px-3 py-2 rounded text-xs font-semibold"
                  >
                    Good (Next)
                  </button>
                  <button
                    type="button"
                    onClick={() => reviewCard(activeCard.conceptId, "easy")}
                    className="forest-btn px-3 py-2 rounded text-xs font-semibold"
                  >
                    Easy (+2 steps)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Spaced Revision Queue + Recent Notes + Bookmarks */}
          <div className="lg:col-span-4 space-y-5">
            <div className="journal-card p-5">
              <h2 className="font-hand text-2xl font-bold mb-3">Spaced Revision Queue</h2>
              {revisions.length === 0 ? (
                <p className="text-xs text-ink-muted">
                  Rate any flashcard (Again / Good / Easy) to schedule spaced reviews.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {revisions.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded bg-ivory border border-ink/20 text-xs flex justify-between items-center gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{r.concept_title}</p>
                        <p className="text-[11px] text-ink-muted">
                          Day {r.interval_days} • Next:{" "}
                          {new Date(r.next_review_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => reviewCard(r.concept_id, "good")}
                        className="forest-btn px-2.5 py-1 rounded text-[11px] font-semibold shrink-0"
                      >
                        Revise
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="journal-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-hand text-2xl font-bold flex items-center gap-2">
                  <NotebookPen className="w-5 h-5 text-terracotta" /> Recent Notes
                </h2>
                <Link href="/notes" className="text-xs font-semibold text-terracotta hover:underline">
                  Open Notebook →
                </Link>
              </div>
              {notes.length === 0 ? (
                <p className="text-xs text-ink-muted">
                  Click &ldquo;Save Note to Notebook&rdquo; on any flashcard to keep it in your spiral notebook.
                </p>
              ) : (
                notes.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-3 rounded bg-ivory border border-ink/15 text-xs">
                    <p className="font-bold">{n.title}</p>
                    <p className="text-ink-muted line-clamp-2 mt-0.5">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="journal-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-hand text-2xl font-bold flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-terracotta" /> Bookmarked Concepts
                </h2>
                <Link href="/notes" className="text-xs font-semibold text-terracotta hover:underline">
                  View All →
                </Link>
              </div>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-ink-muted">No bookmarks yet.</p>
              ) : (
                bookmarks.slice(0, 4).map((b) => (
                  <Link
                    key={b.id}
                    href={`/concepts/${b.target_id}`}
                    className="block p-3 rounded bg-ivory border border-ink/15 hover:bg-parchment text-xs font-semibold"
                  >
                    {b.label}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
