"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Heart, HelpCircle, Swords } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { Illustration, KingdomIllustration } from "@/components/IllustratedAssets";

interface PuzzleHouse {
  kingdom_id: string;
  order_index: number;
  title: string;
  subtitle: string;
  total_puzzles: number;
  solved_count: number;
}

interface PuzzleItem {
  id: string;
  kingdom_id: string;
  kingdom_title: string;
  title: string;
  prompt: string;
  puzzle_type: string;
  difficulty: string;
  config: { initialList?: number[]; insertValue?: number; choices?: string[] };
  hints: string[];
  xp_reward: number;
  solved: boolean;
}

const UNIT_BOSSES: Record<string, { name: string; img: string; desc: string }> = {
  "k1-discrete": { name: "The Syllogism Warden", img: "/assets/bosses/dark-wizard.png", desc: "Defeat logic & graph invariants." },
  "k2-csa": { name: "The Pipeline Overseer", img: "/assets/bosses/stone-golem.png", desc: "Outsmart hazards & cache traps." },
  "k3-prog": { name: "The Virtual Table Sage", img: "/assets/bosses/dark-wizard.png", desc: "Master pointers & vtables." },
  "k4-dbms": { name: "The Serializability Arbiter", img: "/assets/bosses/stone-golem.png", desc: "Conquer BCNF & ACID graphs." },
  "k5-os": { name: "The Scheduler Warden", img: "/assets/bosses/stone-golem.png", desc: "Beat SRTF & Belady's Anomaly." },
  "k6-se": { name: "The Quality Inspector", img: "/assets/bosses/dark-wizard.png", desc: "Solve COCOMO & McCabe paths." },
  "k7-dsa": { name: "The Pointer Lord", img: "/assets/bosses/dragon-boss.png", desc: "Conquer linked lists & DP." },
  "k8-toc": { name: "The Halting Oracle", img: "/assets/bosses/dark-wizard.png", desc: "Master DFA, CFL & decidability." },
  "k9-cn": { name: "The Packet Admiral", img: "/assets/bosses/dragon-boss.png", desc: "Master CIDR & TCP Reno." },
  "k10-ai": { name: "The Alpha-Beta Grandmaster", img: "/assets/bosses/dragon-boss.png", desc: "Solve A* & Alpha-Beta pruning." },
};

export default function PuzzlesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [houses, setHouses] = useState<PuzzleHouse[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<PuzzleHouse | null>(null);
  const [puzzles, setPuzzles] = useState<PuzzleItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  async function loadHouses() {
    const [me, puz] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/puzzles").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setHouses(puz.houses ?? []);
  }

  useEffect(() => {
    loadHouses();
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  async function enterHouse(house: PuzzleHouse) {
    setSelectedHouse(house);
    setSeconds(0);
    setTimerActive(true);
    setFeedback({});
    const res = await fetch(`/api/puzzles?kingdom_id=${house.kingdom_id}`);
    const data = await res.json();
    setPuzzles(data.puzzles ?? []);
  }

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
          ? `Solved in ${seconds}s! +${data.xp_awarded} XP earned!`
          : "Incorrect arrangement. Try revealing a hint or re-tracing!",
      }));
      if (data.is_correct && selectedHouse) {
        enterHouse(selectedHouse);
        loadHouses();
      }
    } else {
      alert(data.error || "Please sign in to submit puzzles.");
    }
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="journal-parchment p-5 flex flex-wrap items-center justify-between gap-4 washi-tape">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#FAF4E8] border border-ink/25 flex items-center justify-center p-1 shrink-0">
              <Illustration src="/assets/companions/foxy.png" alt="Puzzle Companion Foxy" width={58} height={58} />
            </div>
            <div>
              <h1 className="font-hand text-4xl font-bold leading-none">
                {selectedHouse ? `Unit ${selectedHouse.order_index} Puzzle House` : "Puzzle Houses — 10 CS Kingdoms"}
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                {selectedHouse
                  ? `${selectedHouse.title} • Solve unit-specific logic & architecture puzzles`
                  : "Select any of the 10 Units below to enter its dedicated Puzzle House and Boss Arena."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedHouse && (
              <>
                <span className="px-3 py-1.5 rounded bg-ink text-ivory font-mono text-xs font-bold inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-mustard" />
                  {mins}:{secs}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHouse(null);
                    setTimerActive(false);
                  }}
                  className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> All 10 Houses
                </button>
              </>
            )}
          </div>
        </div>

        {/* 10 Unit Puzzle Houses Grid */}
        {!selectedHouse ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {houses.map((h) => (
              <button
                key={h.kingdom_id}
                type="button"
                onClick={() => enterHouse(h)}
                className="journal-card p-4 text-center flex flex-col items-center justify-between hover:bg-[#F3E8D2] transition-all hover:-translate-y-0.5"
              >
                <div className="w-24 h-24 rounded-lg bg-[#FAF4E8] border border-ink/20 flex items-center justify-center p-1">
                  <KingdomIllustration kingdomKey={h.kingdom_id} alt={h.title} size={86} />
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-terracotta">
                    Unit {h.order_index} House
                  </span>
                  <h2 className="font-hand text-xl font-bold leading-snug">{h.title}</h2>
                  <p className="text-[11px] text-ink-muted">
                    {h.solved_count}/{h.total_puzzles} Puzzles Solved
                  </p>
                </div>
                <span className="mt-3 terracotta-btn w-full py-1.5 rounded text-xs font-semibold">
                  Enter House →
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Selected Unit Puzzle House */
          <div className="space-y-6">
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
                          <span className="px-2 py-0.5 rounded bg-parchment font-bold capitalize">
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

                      {feedback[p.id] && <p className="text-xs font-semibold text-terracotta">{feedback[p.id]}</p>}
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

            {/* Unit-Specific Boss Card */}
            {(() => {
              const boss = UNIT_BOSSES[selectedHouse.kingdom_id] || UNIT_BOSSES["k7-dsa"];
              return (
                <div className="journal-parchment p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-[#FAF4E8] border border-ink/25 flex items-center justify-center p-1 shrink-0">
                      <Illustration src={boss.img} alt={boss.name} width={88} height={88} animate />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-terracotta text-xs font-bold uppercase">
                        <span>Unit {selectedHouse.order_index} Guardian</span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3 fill-current" />
                          <Heart className="w-3 h-3 fill-current" />
                          <Heart className="w-3 h-3 fill-current" />
                        </span>
                      </div>
                      <h3 className="font-hand text-3xl font-bold">{boss.name}</h3>
                      <p className="text-xs text-ink-muted">{boss.desc}</p>
                    </div>
                  </div>
                  <a
                    href="/exam-arena"
                    className="terracotta-btn px-5 py-2.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                  >
                    <Swords className="w-4 h-4" /> Fight Unit Boss
                  </a>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </JournalShell>
  );
}
