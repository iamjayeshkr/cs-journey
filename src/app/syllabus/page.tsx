"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ChevronRight, Search } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KingdomIllustration } from "@/components/IllustratedAssets";

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
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [coverage, setCoverage] = useState<{
    totals: { units: number; chapters: number; subtopics: number; concepts_authored: number; chapters_covered: number };
    units: Array<{ kingdom_id: string; order_index: number; title: string; chapters_total: number; chapters_with_concepts: number; subtopics_total: number; concepts_authored: number; coverage_pct: number }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
    fetch("/api/kingdoms").then((r) => r.json()).then((d) => setKingdoms(d.kingdoms ?? []));
    fetch("/api/coverage").then((r) => r.json()).then((d) => setCoverage(d));
  }, []);

  const activeKingdom = kingdoms[activeUnitIdx];
  const filteredChapters =
    activeKingdom?.chapters.filter(
      (ch) =>
        !filterQuery.trim() ||
        ch.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        ch.summary.toLowerCase().includes(filterQuery.toLowerCase())
    ) ?? [];

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold">UGC NET CS (Code 087) — Organized Syllabus</h1>
            <p className="text-sm text-ink-muted mt-1">
              Select any unit below to browse its chapters, subtopics, and 8-stage interactive lessons.
            </p>
          </div>
          {coverage && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold px-3 py-1.5 rounded bg-parchment border border-ink/25">
              <span>{coverage.totals.units} Units</span>
              <span>•</span>
              <span>{coverage.totals.chapters} Chapters</span>
              <span>•</span>
              <span>{coverage.totals.subtopics} Subtopics</span>
              <span>•</span>
              <span className="text-forest">{coverage.totals.concepts_authored}/90 Authored</span>
            </div>
          )}
        </div>

        {/* Organized Unit Selector Tabs */}
        <div className="journal-card p-3 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {kingdoms.map((k, idx) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setActiveUnitIdx(idx)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  activeUnitIdx === idx ? "ink-btn" : "parchment-btn"
                }`}
              >
                Unit {k.order_index}
              </button>
            ))}
          </div>

          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter chapters in this unit..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-ivory border border-ink/25 focus:outline-none"
            />
          </div>
        </div>

        {/* Active Unit Card */}
        {activeKingdom && (
          <div className="journal-card p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/15 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md bg-parchment/50 border border-ink/20 flex items-center justify-center shrink-0 p-1">
                  <KingdomIllustration kingdomKey={activeKingdom.id} alt={activeKingdom.title} size={72} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-terracotta">
                    Unit {activeKingdom.order_index} • {activeKingdom.subtitle}
                  </span>
                  <h2 className="font-hand text-3xl font-bold">{activeKingdom.title}</h2>
                  <p className="text-xs text-ink-muted mt-0.5">{activeKingdom.description}</p>
                </div>
              </div>
              <Link href={`/kingdoms/${activeKingdom.slug}`} className="terracotta-btn px-4 py-2 rounded text-xs font-semibold shrink-0">
                Enter Kingdom →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredChapters.map((ch, cIdx) => (
                <div key={ch.id} className="p-4 rounded-md bg-ivory border border-ink/20 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-terracotta shrink-0" />
                        <span>{cIdx + 1}. {ch.title}</span>
                      </h3>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">{ch.summary}</p>
                  </div>

                  <div className="space-y-1.5">
                    {ch.concepts.map((c) => (
                      <Link
                        key={c.id}
                        href={`/concepts/${c.slug}`}
                        className="flex items-center justify-between p-2.5 rounded bg-[#FAF4E8] border border-ink/15 hover:bg-parchment text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {c.mastery.status === "mastered" ? (
                            <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-ink-muted shrink-0" />
                          )}
                          <span className="font-semibold truncate">{c.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-forest">{c.mastery.mastery_score}%</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </JournalShell>
  );
}
