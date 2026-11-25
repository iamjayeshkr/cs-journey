"use client";

import React, { useEffect, useState } from "react";
import { Award, Clock, Flag, Play, CheckCircle2 } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface MockTest {
  id: string;
  title: string;
  description: string;
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

  async function loadList() {
    const [me, list] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/mock-tests").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setTests(list.mock_tests ?? []);
    setAttempts(list.attempts ?? []);
  }

  useEffect(() => {
    loadList();
  }, []);

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
    setSecondsLeft((data.mock_test?.duration_minutes ?? 10) * 60);
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
      loadList();
    } else {
      alert(data.error || "Please sign in to submit mock tests.");
    }
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const activeQ = questions[currentIdx];

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <Award className="w-7 h-7 text-terracotta" /> Exam Arena — UGC NET Mock Tests
          </h1>
          <p className="text-sm text-ink-muted">
            Timed Paper 2 examinations (+2 marks per correct answer, no negative marking).
          </p>
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
              {/* Active Question or Full Review */}
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

              {/* Question Navigation Palette */}
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
                          isCurr
                            ? "ring-2 ring-terracotta border-ink"
                            : "border-ink/25"
                        } ${
                          isMarked
                            ? "bg-mustard text-ink"
                            : isAns
                            ? "bg-forest text-ivory"
                            : "bg-ivory text-ink"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-ink-muted pt-2 border-t border-ink/15">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-forest inline-block" /> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-mustard inline-block" /> Marked</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-ivory border border-ink/30 inline-block" /> Unvisited</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-4">
              {tests.map((t) => (
                <div key={t.id} className="journal-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-hand text-2xl font-bold">{t.title}</h2>
                    <p className="text-xs text-ink-muted mt-1">{t.description}</p>
                    <p className="text-xs font-semibold mt-2">
                      Duration: {t.duration_minutes} mins • Max Marks: {t.total_marks}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startTest(t.id)}
                    className="terracotta-btn px-4 py-2.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Test
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 journal-card p-5">
              <h2 className="font-hand text-2xl font-bold mb-3">Past Mock Attempts</h2>
              {attempts.length === 0 ? (
                <p className="text-xs text-ink-muted">No mock exams completed yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {attempts.map((a) => (
                    <div key={a.id} className="p-3 rounded bg-ivory border border-ink/20 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{a.mock_title}</p>
                        <p className="text-[11px] text-ink-muted">{new Date(a.completed_at).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-forest">
                        {a.score} / {a.total_marks}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </JournalShell>
  );
}
