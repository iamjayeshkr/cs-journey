"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Filter, Swords, XCircle } from "lucide-react";
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
  xp_reward: number;
  options: Array<{ id: string; label: string; option_text: string }>;
}

export default function PracticePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [kingdomFilter, setKingdomFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [pyqOnly, setPyqOnly] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { is_correct: boolean; explanation: string; xp_awarded: number }>>({});

  async function loadQuestions() {
    const params = new URLSearchParams();
    if (kingdomFilter !== "all") params.set("kingdom_id", kingdomFilter);
    if (difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
    if (pyqOnly) params.set("pyq", "true");
    const res = await fetch(`/api/practice?${params.toString()}`);
    const data = await res.json();
    setQuestions(data.questions ?? []);
  }

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [kingdomFilter, difficultyFilter, pyqOnly]);

  async function submitAnswer(qId: string) {
    const optId = selected[qId];
    if (!optId) return;
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: qId, selected_option_id: optId }),
    });
    const data = await res.json();
    if (res.ok) {
      setResults((prev) => ({ ...prev, [qId]: data }));
      fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
    } else {
      alert(data.error || "Please sign in to submit answers.");
    }
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
              <Swords className="w-7 h-7 text-terracotta" /> Practice Arena & PYQ Library
            </h1>
            <p className="text-sm text-ink-muted">
              Solve UGC NET Computer Science questions and verified PYQ-pattern problems.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded bg-parchment border border-ink/25 text-xs font-bold">
            Showing {questions.length} Questions
          </span>
        </div>

        {/* Filters */}
        <div className="journal-card p-4 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-ink-muted" />
          <select
            value={kingdomFilter}
            onChange={(e) => setKingdomFilter(e.target.value)}
            className="px-3 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
          >
            <option value="all">All 10 Kingdoms</option>
            {KINGDOMS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.order_index}. {k.title}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1.5 rounded bg-ivory border border-ink/25 text-xs font-medium"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="jrf">JRF Level</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={pyqOnly}
              onChange={(e) => setPyqOnly(e.target.checked)}
              className="accent-ink"
            />
            <span>UGC NET PYQs Only</span>
          </label>
        </div>

        {/* Question Cards */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const fb = results[q.id];
            return (
              <div key={q.id} className="journal-card p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-ink-muted">
                    Q{idx + 1} • {q.kingdom_title}
                  </span>
                  <div className="flex items-center gap-2">
                    {q.is_pyq === 1 && (
                      <span className="px-2 py-0.5 rounded bg-[#F7E9B4] border border-ink/25 font-bold">
                        {q.pyq_label || "UGC NET PYQ"}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-parchment capitalize font-semibold">
                      {q.difficulty} • +{q.xp_reward} XP
                    </span>
                  </div>
                </div>

                <p className="font-serif text-base font-medium">{q.prompt}</p>

                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected((prev) => ({ ...prev, [q.id]: opt.id }))}
                      className={`p-3 rounded-md border text-left text-xs transition-colors ${
                        selected[q.id] === opt.id
                          ? "bg-ink text-ivory border-ink"
                          : "bg-ivory border-ink/20 hover:bg-parchment"
                      }`}
                    >
                      <span className="font-bold mr-2">{opt.label}.</span>
                      {opt.option_text}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => submitAnswer(q.id)}
                    className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold"
                  >
                    Evaluate Answer
                  </button>
                </div>

                {fb && (
                  <div
                    className={`p-3.5 rounded-md border text-xs space-y-1 ${
                      fb.is_correct ? "bg-forest/15 border-forest" : "bg-terracotta/15 border-terracotta"
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      {fb.is_correct ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-forest" />
                          Correct! {fb.xp_awarded > 0 && `+${fb.xp_awarded} XP`}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-terracotta" />
                          Not quite — review the explanation below:
                        </>
                      )}
                    </p>
                    <p className="text-ink leading-relaxed">{fb.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </JournalShell>
  );
}
