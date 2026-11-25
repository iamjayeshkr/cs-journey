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
import { JourneyTraveler } from "@/components/JourneyTraveler";
import { TeachingMethodsData, TeachingMethodsPanel } from "@/components/TeachingMethodsPanel";
import { ConceptVisualizerCards } from "@/components/ConceptVisualizerCards";
import { CodeBlock } from "@/components/CodeBlock";
import { InlineMarkdown, MarkdownText } from "@/components/MarkdownText";

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
  prerequisites?: Array<{ id: string; slug: string; title: string; mastered: boolean }>;
  lesson: {
    discover_story: string;
    understand_intuition: string;
    formal_definition: string;
    learning_objectives?: string[];
    why_it_matters?: string;
    level_1_beginner?: string;
    level_2_foundation?: string;
    level_3_intermediate?: string;
    level_4_jrf?: string;
    misconceptions?: string[];
    pseudocode?: string;
    complexity?: { time?: string; space?: string; note?: string };
    exam_relevance?: string;
    teaching_methods?: TeachingMethodsData;
    flashcards?: Array<{ card_type: string; front: string; back: string }>;
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
  const [learningLevel, setLearningLevel] = useState<1 | 2 | 3 | 4>(1);
  const [showPauseThink, setShowPauseThink] = useState(false);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<{ understood: boolean; feedback: string; follow_up?: string } | null>(null);
  const [interviewHint, setInterviewHint] = useState(0);
  const [showInterviewSolution, setShowInterviewSolution] = useState(false);
  const [masteryIdx, setMasteryIdx] = useState(0);
  const [masteryStreak, setMasteryStreak] = useState(0);
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

        {/* Prerequisite Check Banner */}
        {data.prerequisites && data.prerequisites.some((p) => !p.mastered) && (
          <div className="p-3.5 rounded-md bg-[#F7E9B4]/75 border border-ink/25 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span>
              <strong>Recommended Prerequisite:</strong> Build your foundation first before diving deep:
            </span>
            <div className="flex flex-wrap gap-2">
              {data.prerequisites
                .filter((p) => !p.mastered)
                .map((p) => (
                  <Link key={p.id} href={`/concepts/${p.slug}`} className="ink-btn px-3 py-1 rounded font-semibold">
                    Learn {p.title} →
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Animated 2D Character Stage Trail */}
        <JourneyTraveler
          progressPct={Math.round((completed.length / 8) * 100)}
          label={`Concept Trail (${completed.length}/8 Stages)`}
          characterSrc="/assets/companions/foxy.png"
        />

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
                  <div className="journal-card p-6 washi-tape space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-terracotta">Story Blog • Why This Exists</span>
                        <h2 className="font-hand text-3xl font-bold mt-0.5">Stage 1: Discover the Story</h2>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded bg-parchment border border-ink/20 font-semibold">
                        2 min read
                      </span>
                    </div>

                    <div className="p-4 rounded-md bg-[#F2E6CF]/75 border border-ink/20 flex flex-col sm:flex-row items-center gap-5">
                      <div className="rounded border border-ink/25 overflow-hidden shrink-0">
                        <Illustration
                          src={
                            data.concept.simulator_type === "linked_list"
                              ? "/assets/educational/railway-scene-hq.png"
                              : "/assets/characters/explorer-reading.png"
                          }
                          alt={data.concept.title}
                          width={data.concept.simulator_type === "linked_list" ? 260 : 120}
                          height={145}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <MarkdownText content={data.lesson.discover_story} />
                      </div>
                    </div>

                    {data.lesson.why_it_matters && (
                      <div className="sticky-note p-3.5 rounded text-xs">
                        <strong>Takeaway before we begin:</strong>{" "}
                        <InlineMarkdown text={data.lesson.why_it_matters} />
                      </div>
                    )}

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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-hand text-3xl font-bold">Stage 2: 4-Level Progressive Understanding</h2>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { lvl: 1 as const, label: "Lv 1: Absolute Beginner" },
                          { lvl: 2 as const, label: "Lv 2: Foundation" },
                          { lvl: 3 as const, label: "Lv 3: Intermediate" },
                          { lvl: 4 as const, label: "Lv 4: Advanced / JRF" },
                        ].map((b) => (
                          <button
                            key={b.lvl}
                            type="button"
                            onClick={() => setLearningLevel(b.lvl)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                              learningLevel === b.lvl ? "ink-btn" : "parchment-btn"
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {data.lesson.why_it_matters && (
                      <div className="p-3.5 rounded bg-[#F7E9B4]/50 border border-ink/20 text-xs">
                        <strong>Why It Matters:</strong> {data.lesson.why_it_matters}
                      </div>
                    )}

                    {/* Selected Learning Level Content — Teacher-Led Step-by-Step Formatting */}
                    {(() => {
                      const rawText =
                        learningLevel === 1
                          ? data.lesson.level_1_beginner || data.lesson.discover_story
                          : learningLevel === 2
                          ? data.lesson.level_2_foundation || data.lesson.understand_intuition
                          : learningLevel === 3
                          ? data.lesson.level_3_intermediate || data.lesson.formal_definition
                          : data.lesson.level_4_jrf || data.lesson.formal_definition;
                      const sentences = rawText
                        .split(/(?<=[.!?])\s+/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const teacherIntro =
                        learningLevel === 1
                          ? "Sit back and picture this simply — no heavy words yet:"
                          : learningLevel === 2
                          ? "Now that the picture is clear, let's learn the proper CS names for what you just imagined:"
                          : learningLevel === 3
                          ? "Let's roll up our sleeves and trace how this actually works step by step:"
                          : "Here is the exact UGC NET / JRF depth that separates top rankers:";
                      return (
                        <div className="p-5 rounded-md bg-ivory border-2 border-ink/25 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] uppercase font-bold text-terracotta">
                              {learningLevel === 1
                                ? "Level 1 — Absolute Beginner (Zero Jargon)"
                                : learningLevel === 2
                                ? "Level 2 — Foundation (Formal Terms & Rules)"
                                : learningLevel === 3
                                ? "Level 3 — Intermediate (Algorithms & Analysis)"
                                : "Level 4 — Advanced / UGC NET JRF Mastery"}
                            </span>
                            <span className="text-[11px] font-semibold text-forest">Teacher&apos;s Explanation</span>
                          </div>

                          <p className="font-hand text-xl text-ink font-semibold">{teacherIntro}</p>

                          <div className="space-y-2">
                            {sentences.map((sent, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded bg-[#FAF4E8] border border-ink/15">
                                <span className="w-5 h-5 rounded-full bg-parchment border border-ink/25 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="font-serif text-sm leading-relaxed text-ink">
                                  <InlineMarkdown text={sent} />
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Interactive Pause & Think Check */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setShowPauseThink(!showPauseThink)}
                              className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold"
                            >
                              {showPauseThink ? "Hide Quick Check" : "Wait — Quick 5-Second Check!"}
                            </button>
                            {showPauseThink && (
                              <div className="mt-2 sticky-note p-3 rounded text-xs space-y-1">
                                <p className="font-bold">Before moving on, ask yourself:</p>
                                <p>
                                  Can I explain <strong>{data.concept.title}</strong> in one simple sentence without reading the screen? Try the <strong>Feynman Teach-Back</strong> below!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {data.lesson.pseudocode && (
                      <CodeBlock code={data.lesson.pseudocode} title={`${data.concept.title} — Pseudocode`} />
                    )}

                    {data.lesson.learning_objectives && data.lesson.learning_objectives.length > 0 && (
                      <div className="p-4 rounded bg-ivory border border-ink/20">
                        <h3 className="font-semibold text-sm mb-2">Learning Objectives</h3>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-ink-muted">
                          {data.lesson.learning_objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                      </div>
                    )}

                    {data.lesson.teaching_methods && (
                      <TeachingMethodsPanel methods={data.lesson.teaching_methods} conceptTitle={data.concept.title} />
                    )}

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
                    <h2 className="font-hand text-3xl font-bold">Stage 3: Interactive Diagrams & Visual Walkthroughs</h2>
                    <ConceptVisualizerCards slug={data.concept.slug} examples={data.lesson.examples || []} />
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

                {activeStage === "practice" && (
                  <div className="journal-card p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-terracotta">One-by-One Twist Practice</span>
                        <h2 className="font-hand text-3xl font-bold">
                          Stage 5: Guided Practice ({data.questions.length} Questions)
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded bg-parchment border border-ink/25 text-xs font-bold">
                        Question {Math.min(practiceIdx + 1, Math.max(1, data.questions.length))} of {data.questions.length}
                      </span>
                    </div>

                    {data.questions.length > 0 && (() => {
                      const q = data.questions[Math.min(practiceIdx, data.questions.length - 1)];
                      const fb = questionFeedback[q.id];
                      return (
                        <div className="p-5 rounded-md bg-ivory border-2 border-ink/25 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-[#F7E9B4] border border-ink/20 font-bold text-ink">
                              {q.pyq_label || "Concept Twist"}
                            </span>
                            <span className="text-ink-muted font-semibold">Choose the best reasoning</span>
                          </div>
                          <p className="font-serif text-base font-semibold">{q.prompt}</p>
                          <div className="grid sm:grid-cols-2 gap-2.5">
                            {q.options.map((o) => (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                                className={`p-3 rounded border text-left text-xs transition-colors ${
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

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => submitQuestion(q.id)}
                              className="terracotta-btn px-4 py-2 rounded text-xs font-semibold"
                            >
                              Check Answer
                            </button>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={practiceIdx === 0}
                                onClick={() => setPracticeIdx((i) => Math.max(0, i - 1))}
                                className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
                              >
                                ← Previous
                              </button>
                              <button
                                type="button"
                                disabled={practiceIdx >= data.questions.length - 1}
                                onClick={() => setPracticeIdx((i) => Math.min(data.questions.length - 1, i + 1))}
                                className="ink-btn px-4 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
                              >
                                Next Question →
                              </button>
                            </div>
                          </div>

                          {fb && (
                            <div
                              className={`p-3.5 rounded text-xs ${
                                fb.is_correct ? "bg-forest/15 border border-forest" : "bg-terracotta/15 border border-terracotta"
                              }`}
                            >
                              <p className="font-bold">{fb.is_correct ? "Correct! Great reasoning." : "Not quite — look at why:"}</p>
                              <p className="mt-1">{fb.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("practice")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Practice ✓
                      </button>
                      <button type="button" onClick={() => setActiveStage("challenge")} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold">
                        Next: Interview Challenge →
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "exam" && (
                  <div className="journal-card p-6 space-y-4">
                    <h2 className="font-hand text-3xl font-bold">Stage 7: UGC NET Exam Prep Bank</h2>
                    <p className="text-xs text-ink-muted">
                      All exam-relevant questions & PYQ patterns for {data.concept.title} ({data.questions.length} available).
                    </p>
                    <div className="space-y-3">
                      {data.questions.map((q, qIdx) => {
                        const fb = questionFeedback[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded bg-ivory border border-ink/20 space-y-2.5">
                            <span className="text-xs font-bold text-terracotta">
                              Q{qIdx + 1} • {q.is_pyq ? q.pyq_label || "UGC NET PYQ" : q.pyq_label || "UGC NET Pattern"}
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
                              <div className={`p-3 rounded text-xs ${fb.is_correct ? "bg-forest/15 border border-forest" : "bg-terracotta/15 border border-terracotta"}`}>
                                <p className="font-bold">{fb.is_correct ? "Correct!" : "Incorrect"}</p>
                                <p className="mt-1">{fb.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => completeStage("exam")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Exam Prep ✓
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "challenge" && (
                  <div className="journal-card p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-terracotta">Corporate Engineering Interview Round</span>
                        <h2 className="font-hand text-3xl font-bold">Stage 6: Corporate Interview Challenge</h2>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#F7E9B4] border border-ink/25 text-xs font-bold">
                        45-Min System & Algo Round
                      </span>
                    </div>

                    <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-2.5">
                      <p className="text-sm font-semibold">
                        Interview Prompt: Design & defend a production-ready solution for <span className="text-terracotta">{data.concept.title}</span> under strict latency & memory constraints (10M+ operations, adversarial edge cases).
                      </p>
                      <ul className="list-disc pl-5 text-xs text-ink-muted space-y-1">
                        <li><strong>Constraint 1:</strong> Handle empty, single-element, and duplicate/tie edge cases cleanly.</li>
                        <li><strong>Constraint 2:</strong> Justify your exact time & space complexity and explain any trade-off.</li>
                        <li><strong>Follow-up Twist:</strong> How would your approach change if memory is strictly bounded (O(1) extra space)?</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold">Write Your Interview Approach & Complexity Justification:</label>
                      <textarea
                        rows={4}
                        value={interviewAnswer}
                        onChange={(e) => setInterviewAnswer(e.target.value)}
                        placeholder="Explain your data structures, invariants, edge-case handling, and O(...) bounds as you would to an interviewer..."
                        className="w-full p-3 text-xs rounded journal-ruled border border-ink/25"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await fetch("/api/verify-understanding", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                concept_title: `${data.concept.title} (Corporate Interview)`,
                                explanation: interviewAnswer,
                              }),
                            });
                            if (res.ok) setInterviewFeedback(await res.json());
                          }}
                          className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold"
                        >
                          Evaluate Interview Answer (AI)
                        </button>
                        <button
                          type="button"
                          onClick={() => setInterviewHint((h) => Math.min(2, h + 1))}
                          className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold"
                        >
                          Interviewer Hint ({interviewHint}/2)
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInterviewSolution(!showInterviewSolution)}
                          className="ink-btn px-3 py-1.5 rounded text-xs font-semibold"
                        >
                          {showInterviewSolution ? "Hide Model Approach" : "Show Model Approach"}
                        </button>
                      </div>
                    </div>

                    {interviewHint >= 1 && (
                      <div className="sticky-note p-3 rounded text-xs space-y-1">
                        <p><strong>Hint 1:</strong> Always state your base/empty-input guard and loop invariant before writing logic.</p>
                        {interviewHint >= 2 && (
                          <p><strong>Hint 2:</strong> Mention worst-case vs average-case complexity and how in-place pointer/state updates save memory.</p>
                        )}
                      </div>
                    )}

                    {interviewFeedback && (
                      <div className={`p-3 rounded text-xs border ${interviewFeedback.understood ? "bg-forest/15 border-forest" : "bg-parchment border-ink/25"}`}>
                        <p className="font-bold">{interviewFeedback.feedback}</p>
                        {interviewFeedback.follow_up && <p className="mt-1 italic">Interviewer Follow-up: {interviewFeedback.follow_up}</p>}
                      </div>
                    )}

                    {showInterviewSolution && data.lesson.pseudocode && (
                      <CodeBlock code={data.lesson.pseudocode} title="Model Interview Approach" />
                    )}

                    <div className="flex justify-end">
                      <button type="button" onClick={() => completeStage("challenge")} className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                        Stamp Interview Challenge ✓
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === "mastery" && (
                  <div className="journal-card p-6 washi-tape-green space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-forest">Maths-Style Confidence Drill</span>
                        <h2 className="font-hand text-3xl font-bold">Stage 8: Practice Until 100% Confident</h2>
                      </div>
                      <span className="px-3 py-1 rounded bg-forest/20 border border-forest text-xs font-bold">
                        Confidence Streak: {masteryStreak} / 3
                      </span>
                    </div>

                    <div className="sticky-note p-4 rounded">
                      <p className="text-xs font-bold uppercase mb-1">Revision Summary</p>
                      <p className="font-serif text-sm">{data.lesson.revision_summary}</p>
                    </div>

                    {data.questions.length > 0 && (() => {
                      const mq = data.questions[masteryIdx % data.questions.length];
                      const mfb = questionFeedback[`m-${mq.id}`];
                      return (
                        <div className="p-4 rounded bg-ivory border border-ink/25 space-y-3">
                          <p className="text-xs font-bold text-ink-muted">Confidence Drill #{masteryIdx + 1}</p>
                          <p className="text-sm font-semibold">{mq.prompt}</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {mq.options.map((o) => (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => setSelectedAnswers((p) => ({ ...p, [`m-${mq.id}`]: o.id }))}
                                className={`p-2.5 rounded border text-left text-xs ${
                                  selectedAnswers[`m-${mq.id}`] === o.id ? "bg-ink text-ivory" : "bg-[#FAF4E8] border-ink/20"
                                }`}
                              >
                                <strong className="mr-1.5">{o.label}.</strong>{o.option_text}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                const optId = selectedAnswers[`m-${mq.id}`];
                                if (!optId) return;
                                const res = await fetch("/api/practice", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ question_id: mq.id, selected_option_id: optId }),
                                });
                                const json = await res.json();
                                if (res.ok) {
                                  setQuestionFeedback((p) => ({ ...p, [`m-${mq.id}`]: json }));
                                  setMasteryStreak((s) => (json.is_correct ? s + 1 : 0));
                                }
                              }}
                              className="forest-btn px-4 py-1.5 rounded text-xs font-semibold"
                            >
                              Verify Drill
                            </button>
                            <button
                              type="button"
                              onClick={() => setMasteryIdx((i) => i + 1)}
                              className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold"
                            >
                              Try Another Similar Problem →
                            </button>
                          </div>
                          {mfb && (
                            <p className={`text-xs font-semibold ${mfb.is_correct ? "text-forest" : "text-terracotta"}`}>
                              {mfb.is_correct ? "✓ Nailed it! " : "✗ Review: "}{mfb.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    <button
                      type="button"
                      onClick={() => completeStage("mastery")}
                      className="terracotta-btn px-5 py-2.5 rounded-md text-sm font-semibold"
                    >
                      I Feel Confident — Stamp Mastery (+30 XP)
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
