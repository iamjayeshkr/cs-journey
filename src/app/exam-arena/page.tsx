"use client";

import React, { useEffect, useState } from "react";
import { Award, Clock, Flag, Play, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KINGDOMS } from "@/lib/curriculum-data";

interface MockTest {
  id: string;
  title: string;
  description: string;
  category?: string;
  duration_minutes: number;
  total_marks: number;
}

interface MockQuestion {
  id: string;
  prompt: string;
  explanation: string;
  options: Array<{ id: string; label: string; option_text: string }>;
}

export default function ExamArenaPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [totalTests, setTotalTests] = useState(520);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [kingdomFilter, setKingdomFilter] = useState("all");
  const [attempts, setAttempts] = useState<Array<{ id: string; mock_title: string; score: number; total_marks: number; completed_at: string }>>([]);

  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    total_marks: number;
    correct_count: number;
    wrong_count: number;
    xp_awarded: number;
  } | null>(null);

  async function loadList(p = page) {
    const params = new URLSearchParams({ page: String(p), category, kingdom_id: kingdomFilter });
    const [me, list] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/mock-tests?${params.toString()}`).then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setTests(list.mock_tests ?? []);
    setTotalTests(list.total ?? 520);
    setAttempts(list.attempts ?? []);
  }

  useEffect(() => {
    setPage(1);
    loadList(1);
  }, [category, kingdomFilter]);

  useEffect(() => {
    if (!activeTest || result || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [activeTest, result, secondsLeft]);

  async function startTest(id: string) {
    const res = await fetch(`/api/mock-tests?id=${id}`);
    const data = await res.json();
    setActiveTest(data.mock_test);
    setQuestions(data.questions ?? []);
    setCurrentIdx(0);
    setAnswers({});
    setMarked({});
    setResult(null);
    setSecondsLeft((data.mock_test?.duration_minutes ?? 12) * 60);
  }

  async function submitTest() {
    if (!activeTest) return;
    const totalSec = activeTest.duration_minutes * 60;
    const res = await fetch("/api/mock-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mock_test_id: activeTest.id,
        answers,
        time_taken_sec: Math.max(1, totalSec - secondsLeft),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(data);
      loadList(page);
    } else {
      alert(data.error || "Please sign in to submit mock tests.");
    }
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const activeQ = questions[currentIdx];
  const totalPages = Math.max(1, Math.ceil(totalTests / 4));

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-terracotta" /> Exam Arena — {totalTests} Mock Tests
            </h1>
            <p className="text-sm text-ink-muted">
              50 Full-Syllabus UGC NET Sprints + 470 Unit, JRF & Placement Timed Mock Tests.
            </p>
          </div>
        </div>

        {activeTest ? (
          <div className="space-y-5">
            <div className="journal-parchment p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-hand text-2xl font-bold">{activeTest.title}</h2>
                <p className="text-xs text-ink-muted">
                  Question {currentIdx + 1} of {questions.length} • {activeTest.total_marks} Marks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded bg-ink text-ivory font-mono text-sm font-bold inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-mustard" />
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </span>
                {!result && (
                  <button type="button" onClick={submitTest} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                    Submit Exam
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTest(null)}
                  className="parchment-btn px-3 py-2 rounded text-xs font-semibold"
                >
                  Exit
                </button>
              </div>
            </div>

            {result && (
              <div className="journal-card p-5 bg-forest/15 border-forest space-y-2">
                <h3 className="font-hand text-3xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-forest" />
                  Exam Evaluated: {result.score} / {result.total_marks} Marks
                </h3>
                <p className="text-sm">
                  Correct: <strong>{result.correct_count}</strong> • Wrong: <strong>{result.wrong_count}</strong> • Earned{" "}
                  <strong>+{result.xp_awarded} XP</strong>
                </p>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-4">
                {result ? (
                  questions.map((q, idx) => (
                    <div key={q.id} className="journal-card p-5 space-y-3">
                      <p className="text-sm font-semibold">
                        {idx + 1}. {q.prompt}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {q.options.map((o) => (
                          <div
                            key={o.id}
                            className={`p-2.5 rounded border text-xs ${
                              answers[q.id] === o.id ? "bg-ink text-ivory border-ink" : "bg-ivory border-ink/20"
                            }`}
                          >
                            <strong className="mr-1.5">{o.label}.</strong>
                            {o.option_text}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs bg-parchment/70 p-2.5 rounded">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  ))
                ) : (
                  activeQ && (
                    <div className="journal-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink-muted">Question {currentIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setMarked((p) => ({ ...p, [activeQ.id]: !p[activeQ.id] }))}
                          className={`px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${
                            marked[activeQ.id] ? "bg-mustard text-ink border border-ink" : "parchment-btn"
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          {marked[activeQ.id] ? "Marked for Review" : "Mark for Review"}
                        </button>
                      </div>
                      <p className="font-serif text-base font-medium">{activeQ.prompt}</p>
                      <div className="space-y-2">
                        {activeQ.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [activeQ.id]: o.id }))}
                            className={`w-full p-3 rounded border text-left text-xs ${
                              answers[activeQ.id] === o.id
                                ? "bg-ink text-ivory border-ink"
                                : "bg-ivory border-ink/20 hover:bg-parchment"
                            }`}
                          >
                            <strong className="mr-2">{o.label}.</strong>
                            {o.option_text}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          disabled={currentIdx === 0}
                          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                          className="parchment-btn px-4 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
                        >
                          ← Previous
                        </button>
                        <button
                          type="button"
                          disabled={currentIdx >= questions.length - 1}
                          onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                          className="ink-btn px-4 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="lg:col-span-4 journal-card p-5 h-fit space-y-3">
                <h3 className="font-hand text-2xl font-bold">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAns = Boolean(answers[q.id]);
                    const isMarked = Boolean(marked[q.id]);
                    const isCurr = idx === currentIdx;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 rounded text-xs font-bold border ${
                          isCurr ? "ring-2 ring-terracotta border-ink" : "border-ink/25"
                        } ${isMarked ? "bg-mustard text-ink" : isAns ? "bg-forest text-ivory" : "bg-ivory text-ink"}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Filters */}
            <div className="journal-card p-3.5 flex flex-wrap items-center gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
              >
                <option value="all">All Categories (520 Tests)</option>
                <option value="Full Syllabus">Full Syllabus (50)</option>
                <option value="Unit Sprint">Unit Sprint</option>
                <option value="JRF Challenge">JRF Challenge</option>
                <option value="GATE / Placement">GATE / Placement</option>
              </select>

              <select
                value={kingdomFilter}
                onChange={(e) => setKingdomFilter(e.target.value)}
                className="px-3 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
              >
                <option value="all">All 10 Units</option>
                {KINGDOMS.map((k) => (
                  <option key={k.id} value={k.id}>
                    Unit {k.order_index}: {k.title}
                  </option>
                ))}
              </select>

              <div className="ml-auto flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    const np = page - 1;
                    setPage(np);
                    loadList(np);
                  }}
                  className="parchment-btn px-2.5 py-1 rounded disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span>
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const np = page + 1;
                    setPage(np);
                    loadList(np);
                  }}
                  className="parchment-btn px-2.5 py-1 rounded disabled:opacity-40"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4 h-fit">
                {tests.map((t) => (
                  <div key={t.id} className="journal-card p-4 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F7E9B4] border border-ink/20">
                        {t.category || "Mock Test"}
                      </span>
                      <h2 className="font-hand text-2xl font-bold mt-1.5 leading-snug">{t.title}</h2>
                      <p className="text-xs text-ink-muted mt-1">{t.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-ink/15">
                      <span className="text-[11px] font-semibold">
                        {t.duration_minutes}m • {t.total_marks} Marks
                      </span>
                      <button
                        type="button"
                        onClick={() => startTest(t.id)}
                        className="terracotta-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 journal-card p-5 h-fit">
                <h2 className="font-hand text-2xl font-bold mb-3">Recent Attempts</h2>
                {attempts.length === 0 ? (
                  <p className="text-xs text-ink-muted">No mock exams completed yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {attempts.map((a) => (
                      <div key={a.id} className="p-3 rounded bg-ivory border border-ink/20 text-xs flex justify-between items-center">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold truncate">{a.mock_title}</p>
                          <p className="text-[11px] text-ink-muted">{new Date(a.completed_at).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-forest shrink-0">
                          {a.score} / {a.total_marks}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </JournalShell>
  );
}
