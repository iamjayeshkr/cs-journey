"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface SyllabusKingdom {
  id: string;
  order_index: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  chapters: Array<{
    id: string;
    title: string;
    summary: string;
    concepts: Array<{
      id: string;
      slug: string;
      title: string;
      difficulty: string;
      content_status: string;
      mastery: { mastery_score: number; status: string };
    }>;
  }>;
}

export default function SyllabusPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<SyllabusKingdom[]>([]);
  const [coverage, setCoverage] = useState<{
    totals: { units: number; chapters: number; subtopics: number; concepts_authored: number; chapters_covered: number };
    units: Array<{ kingdom_id: string; order_index: number; title: string; chapters_total: number; chapters_with_concepts: number; subtopics_total: number; concepts_authored: number; coverage_pct: number }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
    fetch("/api/kingdoms").then((r) => r.json()).then((d) => setKingdoms(d.kingdoms ?? []));
    fetch("/api/coverage").then((r) => r.json()).then((d) => setCoverage(d));
  }, []);

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold">UGC NET CS (Code 087) — Syllabus & Coverage Matrix</h1>
          <p className="text-sm text-ink-muted mt-1">
            Official 10-Unit hierarchy. Chapters with authored 4-level lessons are directly playable; remaining official syllabus chapters are tracked honestly below.
          </p>
        </div>

        {/* Live Curriculum Coverage Matrix */}
        {coverage && (
          <div className="journal-parchment p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-hand text-2xl font-bold">Curriculum Coverage Matrix (Verified)</h2>
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                <span>{coverage.totals.units} Official Units</span>
                <span>•</span>
                <span>{coverage.totals.chapters} Official Chapters</span>
                <span>•</span>
                <span>{coverage.totals.subtopics} Subtopics</span>
                <span>•</span>
                <span className="text-forest">{coverage.totals.concepts_authored} Authored 4-Level Concepts</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {coverage.units.map((u) => (
                <div key={u.kingdom_id} className="p-2.5 rounded bg-[#FAF4E8] border border-ink/20 text-xs">
                  <p className="font-bold truncate">Unit {u.order_index}: {u.title}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {u.chapters_with_concepts}/{u.chapters_total} chapters authored • {u.subtopics_total} subtopics
                  </p>
                  <div className="h-1.5 rounded-full bg-parchment mt-1.5 overflow-hidden">
                    <div className="h-full bg-forest" style={{ width: `${u.coverage_pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {kingdoms.map((k) => (
            <div key={k.id} className="journal-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-terracotta">Unit {k.order_index}</span>
                  <h2 className="font-hand text-3xl font-bold">{k.title}</h2>
                  <p className="text-xs text-ink-muted">{k.description}</p>
                </div>
                <Link href={`/kingdoms/${k.slug}`} className="parchment-btn px-3.5 py-1.5 rounded text-xs font-semibold">
                  Open Kingdom →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {k.chapters.map((ch) => (
                  <div key={ch.id} className="p-3.5 rounded-md bg-ivory border border-ink/20">
                    <h3 className="font-semibold text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-terracotta" />
                      {ch.title}
                    </h3>
                    <p className="text-xs text-ink-muted mt-1 mb-3">{ch.summary}</p>
                    <div className="space-y-1.5">
                      {ch.concepts.length === 0 ? (
                        <p className="text-[11px] italic text-ink-muted">Syllabus outline chapter — add concepts in Admin CMS.</p>
                      ) : (
                        ch.concepts.map((c) => (
                          <Link
                            key={c.id}
                            href={`/concepts/${c.slug}`}
                            className="flex items-center justify-between p-2 rounded bg-[#FAF4E8] border border-ink/15 hover:bg-parchment text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {c.mastery.status === "mastered" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                              )}
                              <span className="font-medium truncate">{c.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {c.content_status !== "authored" && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-mustard/30 text-ink">
                                  Outline
                                </span>
                              )}
                              <span className="text-[11px] font-bold">{c.mastery.mastery_score}%</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </JournalShell>
  );
}
