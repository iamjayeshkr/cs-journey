"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Compass,
  FlaskConical,
  Lightbulb,
  NotebookPen,
  Puzzle,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { ConceptSimulatorRouter } from "@/components/simulators/ConceptSimulators";
import { Illustration, KingdomIllustration } from "@/components/IllustratedAssets";

const STAGES = [
  { id: "discover", label: "1. Discover", icon: Compass },
  { id: "understand", label: "2. Understand", icon: Lightbulb },
  { id: "visualize", label: "3. Visualize", icon: FlaskConical },
  { id: "experiment", label: "4. Experiment", icon: FlaskConical },
  { id: "practice", label: "5. Practice", icon: Swords },
  { id: "challenge", label: "6. Challenge", icon: Puzzle },
  { id: "exam", label: "7. Exam Prep", icon: ShieldCheck },
  { id: "mastery", label: "8. Mastery", icon: CheckCircle2 },
];

interface ConceptPayload {
  concept: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    simulator_type: string;
    xp_reward: number;
  };
  chapter: { title: string; slug: string };
  kingdom: { id: string; title: string; slug: string };
  lesson: {
    discover_story: string;
    understand_intuition: string;
    formal_definition: string;
    examples: Array<{ title: string; problem: string; walkthrough: string }>;
    properties: string[];
    edge_cases: string[];
    applications: string[];
    revision_summary: string;
  } | null;
  puzzles: Array<{
    id: string;
    title: string;
    prompt: string;
    puzzle_type: string;
    config: { choices?: string[] };
    hints: string[];
    xp_reward: number;
  }>;
  questions: Array<{
    id: string;
    prompt: string;
    explanation: string;
    is_pyq: number;
    pyq_label: string | null;
    options: Array<{ id: string; label: string; option_text: string }>;
  }>;
  mastery: {
    stages_completed: string[];
    mastery_score: number;
    status: string;
  };
  is_bookmarked: boolean;
}

function ConceptPageInner() {
  const params = useParams<{ slug: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<ConceptPayload | null>(null);
  const [activeStage, setActiveStage] = useState("discover");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [questionFeedback, setQuestionFeedback] = useState<
    Record<string, { is_correct: boolean; explanation: string }>
  >({});
  const [puzzleChoice, setPuzzleChoice] = useState("");
  const [puzzleFeedback, setPuzzleFeedback] = useState<string>("");
  const [noteText, setNoteText] = useState("");
  const [toast, setToast] = useState("");

  async function loadAll() {
    const [meRes, cRes] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch(`/api/concepts/${params.slug}`).then((r) => r.json()),
    ]);
    setUser(meRes.user ?? null);
    setData(cRes);
  }

  useEffect(() => {
    if (params?.slug) loadAll();
  }, [params?.slug]);

  async function completeStage(stageId: string) {
    const res = await fetch(`/api/concepts/${params.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: stageId }),
    });
    const json = await res.json();
    if (res.ok) {
      setToast(json.xp_awarded > 0 ? `Stage stamped! +${json.xp_awarded} XP earned.` : "Stage recorded.");
      loadAll();
    } else {
      setToast(json.error || "Sign in to save your mastery progress.");
    }
  }

  async function submitQuestion(qId: string) {
    const optId = selectedAnswers[qId];
    if (!optId) return;
    const res = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: qId, selected_option_id: optId }),
    });
    const json = await res.json();
    if (res.ok) {
      setQuestionFeedback((prev) => ({ ...prev, [qId]: json }));
      loadAll();
    }
  }

  async function submitPuzzle(puzzleId: string) {
    if (!puzzleChoice) return;
    const res = await fetch("/api/puzzles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzle_id: puzzleId, answer: puzzleChoice }),
    });
    const json = await res.json();
    if (res.ok) {
      setPuzzleFeedback(
        json.is_correct
          ? `Solved! +${json.xp_awarded} XP awarded!`
          : "Not quite — re-check the pointer or state invariant and try again."
      );
      if (json.is_correct) loadAll();
    }
  }

  async function toggleBookmark() {
    if (!data?.concept) return;
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_type: "concept",
        target_id: data.concept.id,
        label: data.concept.title,
      }),
    });
    if (res.ok) loadAll();
  }

  async function saveQuickNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim() || !data?.concept) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Notes: ${data.concept.title}`,
        content: noteText,
        concept_id: data.concept.id,
        kingdom_id: data.kingdom.id,
      }),
    });
    if (res.ok) {
      setNoteText("");
      setToast("Margin note saved to My Notes!");
    }
  }

  if (!data?.concept) {
    return (
      <JournalShell user={user}>
        <div className="p-8 text-center font-hand text-2xl">Opening concept chapter...</div>
      </JournalShell>
    );
  }

  const completed = data.mastery.stages_completed || [];

  return (
    <JournalShell user={user} conceptSlug={data.concept.slug}>
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/kingdoms/${data.kingdom.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {data.kingdom.title} / {data.chapter.title}
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              className={`px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 ${
                data.is_bookmarked ? "ink-btn" : "parchment-btn"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {data.is_bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <div className="px-3 py-1.5 rounded bg-parchment border border-ink/25 text-xs font-bold">
              Mastery: {data.mastery.mastery_score}%
            </div>
          </div>
        </div>

        {/* Notebook Header */}
        <div className="journal-parchment p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-[#FAF4E8] border border-ink/25 flex items-center justify-center shrink-0 p-1">
              <KingdomIllustration kingdomKey={data.kingdom.id} alt={data.kingdom.title} size={58} />
            </div>
            <div>
              <h1 className="font-hand text-4xl sm:text-5xl font-bold leading-none">{data.concept.title}</h1>
              <p className="text-xs text-ink-muted mt-1.5 capitalize">
                Difficulty: {data.concept.difficulty} • Reward: +{data.concept.xp_reward} XP •{" "}
                {completed.length}/8 Stages Stamped
              </p>
            </div>
          </div>

          {/* 8-Stage Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {STAGES.map((st) => {
              const isDone = completed.includes(st.id);
              const isActive = activeStage === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStage(st.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors ${
                    isActive
                      ? "bg-ink text-ivory border-ink"
                      : isDone
                      ? "bg-forest/20 border-forest text-ink"
                      : "bg-[#FAF4E8] border-ink/20 hover:bg-parchment"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-forest" />}
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {toast && (
          <div className="p-3 rounded bg-forest/15 border border-forest text-xs font-semibold text-ink">
            {toast}
          </div>
        )}

        {/* Open Notebook Layout: Stage Content + Margin Notes */}
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-9 space-y-5">
            {data.lesson && (
              <>
                {activeStage === "discover" && (
                  <div className="journal-card p-6 washi-tape space-y-4">
                    <h2 className="font-hand text-3xl font-bold">Stage 1: Discover the Story</h2>
                    <div className="p-4 rounded-md bg-[#F2E6CF]/75 border border-ink/20 flex flex-col sm:flex-row items-center gap-4">
                      <Illustration
                        src={
                          data.concept.simulator_type === "linked_list"
                            ? "/assets/educational/railway-train.png"
                            : "/assets/characters/explorer-reading.png"
                        }
                        alt={data.concept.title}
                        width={data.concept.simulator_type === "linked_list" ? 180 : 110}
                        height={100}
                        className="shrink-0"
                      />
                      <p className="font-serif text-base leading-relaxed">{data.lesson.discover_story}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("discover")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Discover ✓
                      </button>
                      <button type="button" onClick={() => setActiveStage("understand")} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                        Next: Understand →
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "understand" && (
                  <div className="journal-card p-6 space-y-5">
                    <h2 className="font-hand text-3xl font-bold">Stage 2: First-Principles Understanding</h2>
                    <div className="p-4 rounded bg-ivory border border-ink/20">
                      <h3 className="font-semibold text-sm mb-1">Intuition</h3>
                      <p className="font-serif text-sm leading-relaxed">{data.lesson.understand_intuition}</p>
                    </div>
                    <div className="p-4 rounded bg-parchment/60 border border-ink/25">
                      <h3 className="font-semibold text-sm mb-1">Formal Definition</h3>
                      <p className="font-mono text-xs leading-relaxed">{data.lesson.formal_definition}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded bg-ivory border border-ink/20">
                        <h3 className="font-semibold text-sm mb-2">Important Properties</h3>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted">
                          {data.lesson.properties.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 rounded bg-ivory border border-ink/20">
                        <h3 className="font-semibold text-sm mb-2">Common Mistakes & Edge Cases</h3>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted">
                          {data.lesson.edge_cases.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div className="p-4 rounded bg-ivory border border-ink/20">
                      <h3 className="font-semibold text-sm mb-2">Real-World Applications</h3>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted">
                        {data.lesson.applications.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("understand")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Understand ✓
                      </button>
                      <button type="button" onClick={() => setActiveStage("visualize")} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                        Next: Visualize →
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "visualize" && (
                  <div className="journal-card p-6 space-y-4">
                    <h2 className="font-hand text-3xl font-bold">Stage 3: Hand-Drawn Analogy & Worked Examples</h2>
                    {data.concept.simulator_type === "linked_list" && (
                      <div className="p-3 rounded bg-[#F2E6CF] border border-ink/20 flex justify-center">
                        <Illustration
                          src="/assets/educational/railway-analogy-board.png"
                          alt="The Railway Analogy"
                          width={340}
                          height={220}
                          className="rounded border border-ink/20"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {data.lesson.examples.map((ex, i) => (
                        <div key={i} className="p-4 rounded bg-ivory border border-ink/20">
                          <h3 className="font-semibold text-sm">{ex.title}</h3>
                          <p className="text-xs text-terracotta font-medium mt-1">{ex.problem}</p>
                          <pre className="mt-2 p-3 rounded bg-[#F2E6CF] font-mono text-xs whitespace-pre-wrap">
                            {ex.walkthrough}
                          </pre>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("visualize")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Visualize ✓
                      </button>
                      <button type="button" onClick={() => setActiveStage("experiment")} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                        Next: Experiment →
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "experiment" && (
                  <div className="space-y-4">
                    <ConceptSimulatorRouter type={data.concept.simulator_type} />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("experiment")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Experiment ✓
                      </button>
                      <button type="button" onClick={() => setActiveStage("practice")} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                        Next: Practice →
                      </button>
                    </div>
                  </div>
                )}

                {(activeStage === "practice" || activeStage === "exam") && (
                  <div className="journal-card p-6 space-y-4">
                    <h2 className="font-hand text-3xl font-bold">
                      {activeStage === "exam" ? "Stage 7: UGC NET PYQs & Exam Check" : "Stage 5: Guided Practice"}
                    </h2>
                    {data.questions
                      .filter((q) => (activeStage === "exam" ? q.is_pyq === 1 : true))
                      .map((q) => {
                        const fb = questionFeedback[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded bg-ivory border border-ink/20 space-y-2.5">
                            <span className="text-xs font-bold text-terracotta">
                              {q.is_pyq ? q.pyq_label || "UGC NET PYQ" : "Concept Check"}
                            </span>
                            <p className="text-sm font-semibold">{q.prompt}</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {q.options.map((o) => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                                  className={`p-2.5 rounded border text-left text-xs ${
                                    selectedAnswers[q.id] === o.id
                                      ? "bg-ink text-ivory border-ink"
                                      : "bg-[#FAF4E8] border-ink/20 hover:bg-parchment"
                                  }`}
                                >
                                  <span className="font-bold mr-1.5">{o.label}.</span>
                                  {o.option_text}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => submitQuestion(q.id)}
                              className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold"
                            >
                              Check Answer
                            </button>
                            {fb && (
                              <div
                                className={`p-3 rounded text-xs ${
                                  fb.is_correct ? "bg-forest/15 border border-forest" : "bg-terracotta/15 border border-terracotta"
                                }`}
                              >
                                <p className="font-bold">{fb.is_correct ? "Correct!" : "Incorrect"}</p>
                                <p className="mt-1">{fb.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage(activeStage)} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp {activeStage === "exam" ? "Exam Prep" : "Practice"} ✓
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "challenge" && (
                  <div className="journal-card p-6 space-y-4">
                    <h2 className="font-hand text-3xl font-bold">Stage 6: Reasoning Puzzle Challenge</h2>
                    {data.puzzles.length === 0 ? (
                      <p className="text-sm text-ink-muted">Explore more puzzles in the Puzzle Dungeon!</p>
                    ) : (
                      data.puzzles.slice(0, 1).map((p) => (
                        <div key={p.id} className="p-4 rounded bg-ivory border border-ink/20 space-y-3">
                          <h3 className="font-semibold">{p.title}</h3>
                          <p className="text-sm">{p.prompt}</p>
                          {p.config.choices && (
                            <div className="grid sm:grid-cols-2 gap-2">
                              {p.config.choices.map((ch) => (
                                <button
                                  key={ch}
                                  type="button"
                                  onClick={() => setPuzzleChoice(ch)}
                                  className={`p-2.5 rounded border text-xs text-left ${
                                    puzzleChoice === ch ? "bg-ink text-ivory" : "bg-[#FAF4E8] border-ink/20"
                                  }`}
                                >
                                  {ch}
                                </button>
                              ))}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => submitPuzzle(p.id)}
                            className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold"
                          >
                            Submit Puzzle (+{p.xp_reward} XP)
                          </button>
                          {puzzleFeedback && <p className="text-xs font-semibold text-forest">{puzzleFeedback}</p>}
                        </div>
                      ))
                    )}
                    <div className="flex justify-end">
                      <button type="button" onClick={() => completeStage("challenge")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Challenge ✓
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "mastery" && (
                  <div className="journal-card p-6 washi-tape-green space-y-4">
                    <h2 className="font-hand text-3xl font-bold">Stage 8: Mastery & Spaced Revision Card</h2>
                    <div className="sticky-note p-4 rounded">
                      <p className="text-xs font-bold uppercase mb-1">Revision Summary</p>
                      <p className="font-serif text-sm">{data.lesson.revision_summary}</p>
                    </div>
                    <p className="text-xs text-ink-muted">
                      Stamping Mastery schedules this concept in your Memory Vault (1, 3, 7, 14, 30-day spaced repetition) and updates your Mastery Score.
                    </p>
                    <button
                      type="button"
                      onClick={() => completeStage("mastery")}
                      className="terracotta-btn px-5 py-2.5 rounded-md text-sm font-semibold"
                    >
                      Stamp Concept Mastery (+30 XP)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Margin Notebook Column */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="sticky-note p-4 rounded space-y-2">
              <div className="flex items-center gap-2">
                <NotebookPen className="w-4 h-4 text-terracotta" />
                <h3 className="font-hand text-xl font-bold">Margin Notes</h3>
              </div>
              <form onSubmit={saveQuickNote} className="space-y-2">
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Jot down a pointer trap or formula..."
                  className="w-full p-2 text-xs rounded bg-[#FAF4E8] border border-ink/20 focus:outline-none"
                />
                <button type="submit" className="ink-btn w-full py-1.5 rounded text-xs font-semibold">
                  Save to My Notes
                </button>
              </form>
            </div>

            <div className="journal-card p-4 text-center space-y-2">
              <Illustration src="/assets/companions/foxy.png" alt="Foxy Study Tip" width={72} height={72} className="mx-auto" />
              <p className="font-hand text-lg font-bold">Foxy&apos;s Tip</p>
              <p className="text-xs text-ink-muted">
                Manipulate the live simulator in Stage 4 before jumping to PYQs — hands-on experiments boost recall!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </JournalShell>
  );
}

export default function ConceptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center font-hand text-2xl">Opening concept...</div>}>
      <ConceptPageInner />
    </Suspense>
  );
}
