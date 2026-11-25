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

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
    fetch("/api/kingdoms").then((r) => r.json()).then((d) => setKingdoms(d.kingdoms ?? []));
  }, []);

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold">UGC NET CS Paper 2 — Syllabus Explorer</h1>
          <p className="text-sm text-ink-muted mt-1">
            Complete hierarchy: Kingdom → Chapter → Concept. Concepts marked &ldquo;Needs Verification&rdquo; are syllabus outlines ready for deeper authoring in Admin CMS.
          </p>
        </div>

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
