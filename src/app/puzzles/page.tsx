"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, HelpCircle, Puzzle as PuzzleIcon } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface PuzzleItem {
  id: string;
  kingdom_title: string;
  title: string;
  prompt: string;
  puzzle_type: string;
  difficulty: string;
  config: {
    initialList?: number[];
    insertValue?: number;
    choices?: string[];
  };
  hints: string[];
  xp_reward: number;
  solved: boolean;
}

export default function PuzzlesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [puzzles, setPuzzles] = useState<PuzzleItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  async function loadPuzzles() {
    const [me, puz] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/puzzles").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setPuzzles(puz.puzzles ?? []);
  }

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function solvePuzzle(p: PuzzleItem) {
    const ans = answers[p.id];
    if (!ans) return;
    const res = await fetch("/api/puzzles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        puzzle_id: p.id,
        answer: ans,
        hints_used: hintsShown[p.id] ?? 0,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setFeedback((prev) => ({
        ...prev,
        [p.id]: data.is_correct
          ? `Solved! +${data.xp_awarded} XP earned!`
          : "Incorrect arrangement. Try revealing a hint or re-tracing!",
      }));
      if (data.is_correct) loadPuzzles();
    } else {
      alert(data.error || "Please sign in to submit puzzles.");
    }
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <PuzzleIcon className="w-7 h-7 text-terracotta" /> Puzzle Dungeon
          </h1>
          <p className="text-sm text-ink-muted">
            Interactive CS reasoning challenges. Using fewer hints awards higher XP!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {puzzles.map((p) => {
            const hintCount = hintsShown[p.id] ?? 0;
            return (
              <div key={p.id} className="journal-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-muted">{p.kingdom_title}</span>
                    {p.solved ? (
                      <span className="inline-flex items-center gap-1 text-forest font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Solved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-parchment font-bold">+{p.xp_reward} XP</span>
                    )}
                  </div>

                  <h2 className="font-hand text-2xl font-bold">{p.title}</h2>
                  <p className="text-sm font-serif">{p.prompt}</p>

                  {/* Pointer Trace Interactive UI */}
                  {p.puzzle_type === "pointer_trace" && p.config.initialList && (
                    <div className="p-3 rounded bg-[#F2E6CF] border border-ink/20 space-y-2">
                      <p className="text-xs font-semibold">Click the node AFTER which to insert {p.config.insertValue}:</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {p.config.initialList.map((val, idx) => {
                          const candidate = [...p.config.initialList!];
                          candidate.splice(idx + 1, 0, p.config.insertValue!);
                          const isChosen = JSON.stringify(answers[p.id]) === JSON.stringify(candidate);
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [p.id]: candidate }))}
                              className={`px-3 py-1.5 rounded font-mono text-xs border ${
                                isChosen ? "bg-ink text-ivory border-ink" : "bg-[#FAF4E8] border-ink/30"
                              }`}
                            >
                              After {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Multiple choice sequence/logic puzzle */}
                  {p.config.choices && (
                    <div className="space-y-2">
                      {p.config.choices.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [p.id]: ch }))}
                          className={`w-full p-2.5 rounded border text-left text-xs ${
                            answers[p.id] === ch
                              ? "bg-ink text-ivory border-ink"
                              : "bg-ivory border-ink/20 hover:bg-parchment"
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Progressive Hints */}
                  {hintCount > 0 && (
                    <div className="sticky-note p-3 rounded text-xs space-y-1">
                      {p.hints.slice(0, hintCount).map((h, i) => (
                        <p key={i}>
                          <strong>Hint {i + 1}:</strong> {h}
                        </p>
                      ))}
                    </div>
                  )}

                  {feedback[p.id] && (
                    <p className="text-xs font-semibold text-terracotta">{feedback[p.id]}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ink/15">
                  <button
                    type="button"
                    disabled={hintCount >= p.hints.length}
                    onClick={() => setHintsShown((prev) => ({ ...prev, [p.id]: hintCount + 1 }))}
                    className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Hint ({hintCount}/{p.hints.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => solvePuzzle(p)}
                    className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold"
                  >
                    Check Solution
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </JournalShell>
  );
}
