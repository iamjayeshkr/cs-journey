"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Heart, HelpCircle, Swords } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { Illustration } from "@/components/IllustratedAssets";

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

const BOSS_BATTLES = [
  {
    id: "boss-pointer-lord",
    name: "The Pointer Lord",
    chapter: "Kingdom VII • Linked Lists & Pointers",
    img: "/assets/bosses/dragon-boss.png",
    description: "Defend the Mountain Express Railway by mastering insertion, deletion edge cases, and O(1) node tricks.",
    difficulty: "JRF Guardian",
    questionsCount: 3,
    timeLimit: "10 mins",
    mockId: "mock-dsa-01",
  },
  {
    id: "boss-scheduler",
    name: "The Scheduler Warden",
    chapter: "Kingdom V • CPU Scheduling & Memory",
    img: "/assets/bosses/stone-golem.png",
    description: "Outsmart the Gearworks Golem on SRTF optimality, Convoy Effect, and Belady's Anomaly.",
    difficulty: "Hard",
    questionsCount: 4,
    timeLimit: "12 mins",
    mockId: "mock-full-01",
  },
  {
    id: "boss-oracle",
    name: "The Halting Oracle",
    chapter: "Kingdom VIII • Automata & Compilers",
    img: "/assets/bosses/dark-wizard.png",
    description: "Prove your mastery over DFA minimization, CFL closure properties, and decidability.",
    difficulty: "JRF Guardian",
    questionsCount: 4,
    timeLimit: "15 mins",
    mockId: "mock-full-01",
  },
];

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
      <div className="space-y-8">
        {/* Illustrated Puzzle Dungeon Header */}
        <div className="journal-parchment p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 washi-tape">
          <div className="flex items-center gap-4">
            <Illustration src="/assets/puzzles/portal.png" alt="Dungeon Portal" width={78} height={78} />
            <div>
              <h1 className="font-hand text-4xl sm:text-5xl font-bold leading-none">Puzzle Dungeon</h1>
              <p className="text-sm text-ink-muted mt-1">
                Interactive CS reasoning challenges. Using fewer hints awards higher XP!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Illustration src="/assets/puzzles/treasure-chest.png" alt="Treasure Chest" width={54} height={54} />
            <Illustration src="/assets/puzzles/golden-key.png" alt="Golden Key" width={28} height={54} />
          </div>
        </div>

        {/* Puzzles Grid */}
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
                      <span className="px-2 py-0.5 rounded bg-parchment font-bold">
                        {p.difficulty} • +{p.xp_reward} XP
                      </span>
                    )}
                  </div>

                  <h2 className="font-hand text-2xl font-bold">{p.title}</h2>
                  <p className="text-sm font-serif">{p.prompt}</p>

                  {p.puzzle_type === "pointer_trace" && p.config.initialList && (
                    <div className="p-3 rounded bg-[#F2E6CF] border border-ink/20 space-y-2">
                      <p className="text-xs font-semibold">
                        Click the node AFTER which to insert {p.config.insertValue}:
                      </p>
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

        {/* Illustrated Boss Challenge Arena (Screen 09) */}
        <section id="boss-arena" className="space-y-4">
          <div className="flex items-center gap-3">
            <Illustration src="/assets/bosses/boss-banner.png" alt="Boss Challenge" width={92} height={58} />
            <div>
              <h2 className="font-hand text-3xl font-bold leading-none">Chapter Boss Challenges</h2>
              <p className="text-xs text-ink-muted mt-1">
                Prove multi-concept mastery against the Kingdom Guardians in timed evaluations.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {BOSS_BATTLES.map((boss) => (
              <div key={boss.id} className="journal-parchment p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-terracotta">{boss.difficulty}</span>
                    <div className="flex items-center gap-0.5 text-terracotta" aria-label="Boss Health">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-center py-2 bg-[#FAF4E8]/80 rounded border border-ink/20">
                    <Illustration src={boss.img} alt={boss.name} width={110} height={110} animate />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-ink-muted">{boss.chapter}</p>
                    <h3 className="font-hand text-2xl font-bold">{boss.name}</h3>
                    <p className="font-serif text-xs text-ink-muted mt-1 leading-relaxed">{boss.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-ink/15">
                  <div className="flex justify-between text-[11px] font-semibold text-ink-muted">
                    <span>{boss.questionsCount} Questions</span>
                    <span>Limit: {boss.timeLimit}</span>
                  </div>
                  <a
                    href="/exam-arena"
                    className="terracotta-btn w-full py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Start Boss Fight</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </JournalShell>
  );
}
