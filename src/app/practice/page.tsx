"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Lock,
  Sparkles,
  Swords,
  XCircle,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KINGDOMS } from "@/lib/curriculum-data";

interface Question {
  id: string;
  kingdom_id: string;
  kingdom_title: string;
  prompt: string;
  explanation: string;
  difficulty: string;
  is_pyq: number;
  pyq_label: string | null;
  exam_source?: string;
  xp_reward: number;
  attempts_used?: number;
  locked?: boolean;
  solved?: boolean;
  options: Array<{ id: string; label: string; option_text: string }>;
}

interface FeedbackState {
  is_correct: boolean;
  xp_delta: number;
  attempts_used: number;
  attempts_remaining: number;
  locked: boolean;
  correct_option_id: string | null;
  correct_answer_text: string | null;
  explanation: string;
}

export default function PracticePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [kingdomFilter, setKingdomFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [pyqOnly, setPyqOnly] = useState(false);

  const [selectedOpt, setSelectedOpt] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [animState, setAnimState] = useState<"idle" | "correct" | "wrong">("idle");
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function loadQuestion(targetPage: number) {
    setLoading(true);
    setSelectedOpt("");
    setFeedback(null);
    setAnimState("idle");
    const params = new URLSearchParams({
      page: String(targetPage),
      limit: "1",
    });
    if (kingdomFilter !== "all") params.set("kingdom_id", kingdomFilter);
    if (sourceFilter !== "all") params.set("source", sourceFilter);
    if (difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
    if (pyqOnly) params.set("pyq", "true");

    const res = await fetch(`/api/practice?${params.toString()}`);
    const data = await res.json();
    setTotal(data.total ?? 0);
    setQuestion(data.questions?.[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
  }, []);

  useEffect(() => {
    setPage(1);
    loadQuestion(1);
  }, [kingdomFilter, sourceFilter, difficultyFilter, pyqOnly]);

  function goToPage(nextPage: number) {
    const clamped = Math.max(1, Math.min(total || 1, nextPage));
    setPage(clamped);
    loadQuestion(clamped);
  }

  async function submitAnswer() {
    if (!question || !selectedOpt) return;
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: question.id, selected_option_id: selectedOpt }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Please sign in to submit answers.");
      return;
    }
    setFeedback(data);
    setAnimState(data.is_correct ? "correct" : "wrong");
    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            attempts_used: data.attempts_used,
            locked: data.locked,
            solved: data.is_correct,
          }
        : null
    );
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
  }

  const attemptsUsed = feedback?.attempts_used ?? question?.attempts_used ?? 0;
  const isLocked = feedback?.locked ?? question?.locked ?? false;

  return (
    <JournalShell user={user}>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
              <Swords className="w-7 h-7 text-terracotta" /> Practice Goldmine ({total.toLocaleString()} MCQs)
            </h1>
            <p className="text-sm text-ink-muted">
              UGC NET, GATE CS, TCS NQT, Wipro & Interview questions • <strong>2 attempts max</strong> •{" "}
              <span className="text-terracotta font-semibold">−10 XP on wrong answer</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded bg-ink text-ivory font-mono text-xs font-bold inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-mustard" />
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </span>
            <div className="px-3 py-1.5 rounded bg-parchment border border-ink/25 text-xs font-bold">
              Question {page.toLocaleString()} of {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="journal-card p-3.5 flex flex-wrap items-center gap-2.5">
          <Filter className="w-4 h-4 text-ink-muted" />
          <select
            value={kingdomFilter}
            onChange={(e) => setKingdomFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
          >
            <option value="all">All 10 Kingdoms (10,500+)</option>
            {KINGDOMS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.order_index}. {k.title}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
          >
            <option value="all">All Exam Sources</option>
            <option value="UGC NET">UGC NET</option>
            <option value="GATE CS">GATE CS</option>
            <option value="TCS NQT">TCS NQT</option>
            <option value="Wipro / Infosys">Wipro / Infosys</option>
            <option value="Product Interview">Product Interview</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="jrf">JRF / Hard</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={pyqOnly}
              onChange={(e) => setPyqOnly(e.target.checked)}
              className="accent-ink"
            />
            <span>Curated PYQs Only</span>
          </label>
        </div>

        {/* Single Interactive Question Card with Animations */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="journal-card p-10 text-center font-hand text-2xl">
              Drawing next question from the Goldmine...
            </div>
          ) : !question ? (
            <div className="journal-card p-8 text-center text-sm text-ink-muted">
              No questions match your current filters.
            </div>
          ) : (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={
                animState === "wrong"
                  ? { opacity: 1, y: 0, x: [-8, 8, -6, 6, -3, 3, 0] }
                  : animState === "correct"
                  ? { opacity: 1, y: 0, scale: [1, 1.015, 1] }
                  : { opacity: 1, y: 0, x: 0 }
              }
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`journal-card p-6 space-y-4 border-2 ${
                animState === "correct"
                  ? "border-forest bg-forest/5"
                  : animState === "wrong"
                  ? "border-terracotta bg-terracotta/5"
                  : "border-ink/25"
              }`}
            >
              {/* Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-ink-muted">{question.kingdom_title}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#F7E9B4] border border-ink/25 font-bold">
                    {question.pyq_label || question.exam_source || "Practice"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-parchment font-semibold capitalize">
                    {question.difficulty} • +{question.xp_reward} XP
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold border ${
                      isLocked
                        ? "bg-ink text-ivory border-ink"
                        : attemptsUsed === 1
                        ? "bg-terracotta/20 text-ink border-terracotta"
                        : "bg-ivory border-ink/25"
                    }`}
                  >
                    Attempts: {attemptsUsed}/2
                  </span>
                </div>
              </div>

              <p className="font-serif text-lg font-medium leading-relaxed">{question.prompt}</p>

              {/* Options */}
              <div className="grid sm:grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isChosen = selectedOpt === opt.id;
                  const isCorrectOpt = feedback?.correct_option_id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => setSelectedOpt(opt.id)}
                      className={`p-3.5 rounded-md border text-left text-sm transition-all ${
                        isCorrectOpt
                          ? "bg-forest/20 border-forest font-bold"
                          : isChosen
                          ? "bg-ink text-ivory border-ink"
                          : "bg-ivory border-ink/25 hover:bg-parchment"
                      } disabled:cursor-not-allowed`}
                    >
                      <span className="font-bold mr-2">{opt.label}.</span>
                      {opt.option_text}
                    </button>
                  );
                })}
              </div>

              {/* Action & Navigation Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink/15">
                {isLocked ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
                    <Lock className="w-4 h-4" />
                    {question.solved ? "Solved!" : "2/2 Attempts Used — Locked (0 XP)"}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!selectedOpt}
                    onClick={submitAnswer}
                    className="terracotta-btn px-5 py-2 rounded-md text-xs font-semibold disabled:opacity-50"
                  >
                    Submit Answer ({2 - attemptsUsed} {2 - attemptsUsed === 1 ? "attempt" : "attempts"} left)
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={page >= total}
                    onClick={() => goToPage(page + 1)}
                    className="ink-btn px-4 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Animated Feedback Banner */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-md border text-xs space-y-1.5 ${
                    feedback.is_correct ? "bg-forest/15 border-forest" : "bg-terracotta/15 border-terracotta"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      {feedback.is_correct ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-forest" />
                          <Sparkles className="w-4 h-4 text-mustard" />
                          Correct! +{feedback.xp_delta} XP
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-terracotta" />
                          Wrong Answer! {feedback.xp_delta} XP
                        </>
                      )}
                    </span>
                    {!feedback.is_correct && feedback.attempts_remaining > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-ivory border border-terracotta">
                        1 Attempt Remaining
                      </span>
                    )}
                  </div>
                  {feedback.correct_answer_text && !feedback.is_correct && (
                    <p className="font-bold text-ink">
                      Correct Answer Revealed: {feedback.correct_answer_text} (No XP awarded)
                    </p>
                  )}
                  <p className="text-ink leading-relaxed">{feedback.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </JournalShell>
  );
}
