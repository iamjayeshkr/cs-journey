"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Puzzle, Swords } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface KingdomDetail {
  kingdom: {
    id: string;
    order_index: number;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
  };
  chapters: Array<{
    id: string;
    title: string;
    summary: string;
    boss_title: string;
    estimated_minutes: number;
    topics: Array<{ id: string; title: string; subtopics: string[] }>;
    concepts: Array<{
      id: string;
      slug: string;
      title: string;
      difficulty: string;
      simulator_type: string;
      mastery_score: number;
      status: string;
    }>;
  }>;
  questions_count: number;
  puzzles_count: number;
}

function KingdomDetailInner() {
  const params = useParams<{ slug: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [detail, setDetail] = useState<KingdomDetail | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
    if (params?.slug) {
      fetch(`/api/kingdoms/${params.slug}`).then((r) => r.json()).then((d) => setDetail(d));
    }
  }, [params?.slug]);

  if (!detail?.kingdom) {
    return (
      <JournalShell user={user}>
        <div className="p-8 text-center font-hand text-2xl">Loading kingdom scrolls...</div>
      </JournalShell>
    );
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <Link href="/world-map" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to World Map
        </Link>

        <div className="journal-parchment p-6 washi-tape">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                Kingdom {detail.kingdom.order_index} • {detail.kingdom.subtitle}
              </span>
              <h1 className="font-hand text-4xl sm:text-5xl font-bold mt-1">{detail.kingdom.title}</h1>
              <p className="font-serif text-sm text-ink-muted mt-2 max-w-2xl">{detail.kingdom.description}</p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link href="/practice" className="parchment-btn px-4 py-2 rounded-md text-xs font-semibold inline-flex items-center gap-1.5">
                <Swords className="w-4 h-4" /> Practice ({detail.questions_count})
              </Link>
              <Link href="/puzzles" className="terracotta-btn px-4 py-2 rounded-md text-xs font-semibold inline-flex items-center gap-1.5">
                <Puzzle className="w-4 h-4" /> Puzzles ({detail.puzzles_count})
              </Link>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-5">
          {detail.chapters.map((ch, idx) => (
            <div key={ch.id} className="journal-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/15 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-ink-muted">Chapter {idx + 1} • ~{ch.estimated_minutes} min</span>
                  <h2 className="font-hand text-3xl font-bold">{ch.title}</h2>
                  <p className="text-xs text-ink-muted mt-1">{ch.summary}</p>
                </div>
                <div className="px-3 py-1.5 rounded bg-[#F7E9B4]/60 border border-ink/20 text-xs font-semibold">
                  Boss: {ch.boss_title}
                </div>
              </div>

              {/* Syllabus Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {ch.topics.flatMap((t) =>
                  t.subtopics.map((sub) => (
                    <span key={`${t.id}-${sub}`} className="text-[11px] px-2.5 py-1 rounded-full bg-parchment border border-ink/15">
                      {sub}
                    </span>
                  ))
                )}
              </div>

              {/* Learning Path Concepts */}
              {ch.concepts.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {ch.concepts.map((c) => (
                    <Link
                      key={c.id}
                      href={`/concepts/${c.slug}`}
                      className="p-4 rounded-md bg-ivory border border-ink/25 hover:bg-parchment/70 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {c.status === "mastered" ? (
                            <CheckCircle2 className="w-4 h-4 text-forest" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-terracotta" />
                          )}
                          <span className="font-semibold text-sm">{c.title}</span>
                        </div>
                        <p className="text-[11px] text-ink-muted mt-1 capitalize">
                          {c.difficulty} • Mastery: {c.mastery_score}%
                          {c.simulator_type !== "none" && " • Interactive Lab"}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-muted italic">
                  Use Practice & PYQs or Admin CMS to expand concepts for this chapter.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </JournalShell>
  );
}

export default function KingdomDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center font-hand text-2xl">Opening kingdom...</div>}>
      <KingdomDetailInner />
    </Suspense>
  );
}
