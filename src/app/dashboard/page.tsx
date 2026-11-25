"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Layers,
  Puzzle,
  Swords,
  Trophy,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { MapKingdom, WorldMapCanvas } from "@/components/WorldMapCanvas";

interface DashboardData {
  user: UserProfile | null;
  overall_progress: number;
  kingdoms_explored: number;
  kingdoms: MapKingdom[];
  daily_quests: Array<{
    id: string;
    title: string;
    description: string;
    current_count: number;
    target_count: number;
    completed: boolean;
    claimed: boolean;
    xp_reward: number;
    coin_reward: number;
  }>;
  due_revisions: Array<{ id: string; concept_id: string; concept_title: string; concept_slug: string; interval_days: number }>;
  achievements: Array<{ id: string; title: string; description: string; unlocked_at: string | null }>;
  study_plans: Array<{ id: string; title: string; completed: number }>;
  recent_mocks: Array<{ id: string; mock_title: string; score: number; total_marks: number }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    if (!json.user) {
      router.push("/auth");
      return;
    }
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function claimQuest(questId: string) {
    const res = await fetch("/api/quests/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: questId }),
    });
    if (res.ok) loadDashboard();
  }

  async function togglePlan(id: string, completed: boolean) {
    await fetch("/api/study-plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    loadDashboard();
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center font-hand text-2xl">
        Opening your study journal...
      </div>
    );
  }

  return (
    <JournalShell user={data.user}>
      <div className="space-y-6">
        {/* Top Welcome & Overall Preparation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-hand text-4xl font-bold text-ink leading-none">
              Namaste, {data.user?.full_name}!
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Ready for today&apos;s quest? Target: <span className="font-semibold text-ink">{data.user?.target_exam}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="journal-card px-4 py-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-terracotta" />
              <div>
                <p className="text-[11px] text-ink-muted">Streak</p>
                <p className="text-sm font-bold">{data.user?.streak_days} Days</p>
              </div>
            </div>
            <div className="journal-card px-4 py-2 min-w-[190px]">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Overall Readiness</span>
                <span>{data.overall_progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-parchment border border-ink/20 overflow-hidden">
                <div className="h-full bg-forest" style={{ width: `${data.overall_progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 10 Kingdoms Quick Cards */}
        <section className="journal-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-hand text-2xl font-bold">My Subjects — 10 Kingdoms</h2>
            <span className="text-xs font-semibold text-ink-muted">
              {data.kingdoms_explored} / 10 Kingdoms Explored
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.kingdoms.map((k) => (
              <Link
                key={k.id}
                href={`/kingdoms/${k.slug}`}
                className="p-3 rounded-md bg-ivory border border-ink/20 hover:bg-parchment/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border border-ink/25"
                    style={{ backgroundColor: `${k.theme_color}55` }}
                  >
                    {k.order_index}
                  </span>
                  <span className="text-xs font-bold text-ink">{k.progress_pct}%</span>
                </div>
                <p className="text-xs font-semibold leading-snug line-clamp-2 min-h-[32px]">{k.title}</p>
                <div className="h-1.5 rounded-full bg-parchment border border-ink/15 mt-2 overflow-hidden">
                  <div className="h-full bg-forest" style={{ width: `${k.progress_pct}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Middle Grid: Current Mission + Quick Actions + Today's Plan */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* Current Story Mission */}
          <div className="lg:col-span-5 journal-parchment p-5 washi-tape-terracotta flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-terracotta">
                Current Story Mission
              </span>
              <h3 className="font-hand text-3xl font-bold mt-1">
                Linked List Mastery (Kingdom VII)
              </h3>
              <p className="font-serif text-sm text-ink-muted mt-2 leading-relaxed">
                The Mountain Express Railway needs your pointer skills! Master node insertion,
                deletion, in-place reversal, and conquer the Pointer Lord.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-ink/15 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted">+80 XP • Interactive Simulator</span>
              <Link
                href="/concepts/singly-linked-list"
                className="terracotta-btn px-4 py-2 rounded-md text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>Continue Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 journal-card p-5">
            <h3 className="font-hand text-2xl font-bold mb-3">Quick Adventures</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/puzzles"
                className="p-3 rounded-md bg-[#F7E9B4]/55 border border-ink/20 hover:bg-[#F7E9B4]/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Puzzle className="w-5 h-5 text-ink" />
                  <div>
                    <p className="text-sm font-semibold">Puzzle Dungeon</p>
                    <p className="text-[11px] text-ink-muted">Pointer, scheduling & logic challenges</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/vault"
                className="p-3 rounded-md bg-forest/15 border border-ink/20 hover:bg-forest/25 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-forest" />
                  <div>
                    <p className="text-sm font-semibold">Memory Vault</p>
                    <p className="text-[11px] text-ink-muted">
                      {data.due_revisions.length} due for spaced recall
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/exam-arena"
                className="p-3 rounded-md bg-dusty-blue/20 border border-ink/20 hover:bg-dusty-blue/35 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Swords className="w-5 h-5 text-ink" />
                  <div>
                    <p className="text-sm font-semibold">Exam Arena</p>
                    <p className="text-[11px] text-ink-muted">Timed UGC NET mocks & PYQs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Today's Plan */}
          <div className="lg:col-span-3 journal-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-hand text-2xl font-bold">Today&apos;s Plan</h3>
              <Link href="/planner" className="text-xs font-semibold text-terracotta hover:underline">
                Edit
              </Link>
            </div>
            {data.study_plans.length === 0 ? (
              <p className="text-xs text-ink-muted">No tasks scheduled for today. Add one in Study Planner.</p>
            ) : (
              <div className="space-y-2">
                {data.study_plans.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => togglePlan(t.id, Boolean(t.completed))}
                    className="w-full text-left flex items-start gap-2 p-2 rounded hover:bg-parchment/60 text-xs"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-ink-muted shrink-0 mt-0.5" />
                    )}
                    <span className={t.completed ? "line-through text-ink-muted" : "font-medium"}>
                      {t.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Quests & Revisions / Achievements */}
        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 journal-card p-5">
            <h3 className="font-hand text-2xl font-bold mb-3">Daily Quests</h3>
            <div className="space-y-2.5">
              {data.daily_quests.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-md bg-ivory border border-ink/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{q.title}</p>
                    <p className="text-xs text-ink-muted">
                      {q.current_count}/{q.target_count} completed • +{q.xp_reward} XP
                    </p>
                  </div>
                  {q.claimed ? (
                    <span className="text-xs font-bold text-forest px-2.5 py-1 rounded bg-forest/15">
                      Claimed ✓
                    </span>
                  ) : q.completed ? (
                    <button
                      type="button"
                      onClick={() => claimQuest(q.id)}
                      className="terracotta-btn px-3 py-1.5 rounded text-xs font-semibold"
                    >
                      Claim +{q.xp_reward} XP
                    </button>
                  ) : (
                    <span className="text-xs text-ink-muted px-2.5 py-1 rounded bg-parchment">
                      In Progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 journal-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-hand text-2xl font-bold">Due Revisions</h3>
              <Clock className="w-4 h-4 text-terracotta" />
            </div>
            {data.due_revisions.length === 0 ? (
              <p className="text-xs text-ink-muted">All spaced-repetition reviews are caught up!</p>
            ) : (
              <div className="space-y-2">
                {data.due_revisions.map((r) => (
                  <Link
                    key={r.id}
                    href="/vault"
                    className="block p-2.5 rounded bg-parchment/60 border border-ink/15 hover:bg-parchment text-xs"
                  >
                    <p className="font-semibold">{r.concept_title}</p>
                    <p className="text-[11px] text-ink-muted">Interval: Day {r.interval_days}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 journal-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-hand text-2xl font-bold">Achievements</h3>
              <Trophy className="w-4 h-4 text-mustard" />
            </div>
            <div className="space-y-2">
              {data.achievements.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className={`p-2.5 rounded border text-xs flex items-center gap-2.5 ${
                    a.unlocked_at
                      ? "bg-[#F7E9B4]/50 border-ink/25"
                      : "bg-ivory/60 border-ink/10 opacity-60"
                  }`}
                >
                  <Award className={`w-4 h-4 shrink-0 ${a.unlocked_at ? "text-terracotta" : "text-ink-muted"}`} />
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-[10px] text-ink-muted">{a.unlocked_at ? "Unlocked!" : a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded Interactive World Map */}
        <WorldMapCanvas kingdoms={data.kingdoms} />
      </div>
    </JournalShell>
  );
}
