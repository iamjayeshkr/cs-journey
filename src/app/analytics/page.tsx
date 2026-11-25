"use client";

import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { MapKingdom } from "@/components/WorldMapCanvas";

export default function AnalyticsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<MapKingdom[]>([]);
  const [overall, setOverall] = useState(0);
  const [mocks, setMocks] = useState<Array<{ id: string; mock_title: string; score: number; total_marks: number }>>([]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setKingdoms(d.kingdoms ?? []);
        setOverall(d.overall_progress ?? 0);
        setMocks(d.recent_mocks ?? []);
      });
  }, []);

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-terracotta" /> Learning Analytics & Mastery
          </h1>
          <p className="text-sm text-ink-muted">Track kingdom-wise readiness, accuracy, and mock exam trends.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="journal-card p-5 text-center">
            <p className="text-xs text-ink-muted uppercase font-semibold">Overall Preparation</p>
            <p className="font-hand text-5xl font-bold text-forest mt-1">{overall}%</p>
          </div>
          <div className="journal-card p-5 text-center">
            <p className="text-xs text-ink-muted uppercase font-semibold">Total Explorer XP</p>
            <p className="font-hand text-5xl font-bold text-ink mt-1">{user?.xp?.toLocaleString() ?? 0}</p>
          </div>
          <div className="journal-card p-5 text-center">
            <p className="text-xs text-ink-muted uppercase font-semibold">Current Level</p>
            <p className="font-hand text-5xl font-bold text-terracotta mt-1">Lv. {user?.level ?? 1}</p>
          </div>
        </div>

        <div className="journal-card p-6 space-y-4">
          <h2 className="font-hand text-2xl font-bold">Subject-Wise Mastery Breakdown</h2>
          <div className="space-y-3">
            {kingdoms.map((k) => (
              <div key={k.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>
                    {k.order_index}. {k.title}
                  </span>
                  <span>{k.progress_pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-parchment border border-ink/20 overflow-hidden">
                  <div className="h-full bg-forest transition-all" style={{ width: `${k.progress_pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="journal-parchment p-6 space-y-3">
          <h2 className="font-hand text-2xl font-bold">Personalized Learning Recommendations</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {kingdoms
              .filter((k) => k.progress_pct < 70)
              .slice(0, 4)
              .map((k) => (
                <div key={k.id} className="p-3 rounded bg-[#FAF4E8] border border-ink/20">
                  <p className="font-bold text-terracotta">Unit {k.order_index}: {k.title}</p>
                  <p className="text-ink-muted mt-1">
                    {k.progress_pct === 0
                      ? "Start with Level 1 (Absolute Beginner) intuition & visual simulation."
                      : "Practice worked examples + Memory Vault active recall to lift mastery above 70%."}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="journal-card p-6">
          <h2 className="font-hand text-2xl font-bold mb-3">Mock Test Performance</h2>
          {mocks.length === 0 ? (
            <p className="text-xs text-ink-muted">Complete a test in the Exam Arena to see performance trends.</p>
          ) : (
            <div className="space-y-2">
              {mocks.map((m) => (
                <div key={m.id} className="p-3 rounded bg-ivory border border-ink/20 flex justify-between text-xs">
                  <span className="font-semibold">{m.mock_title}</span>
                  <span className="font-bold text-forest">
                    {m.score} / {m.total_marks}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </JournalShell>
  );
}
