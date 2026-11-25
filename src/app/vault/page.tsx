"use client";

import React, { useEffect, useState } from "react";
import { Layers, RotateCw } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface RevisionItem {
  id: string;
  concept_id: string;
  concept_title: string;
  kingdom_title: string;
  revision_summary: string;
  interval_days: number;
  next_review_at: string;
}

interface Flashcard {
  concept_id: string;
  title: string;
  kingdom_title: string;
  revision_summary: string;
  formal_definition: string;
}

export default function MemoryVaultPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [msg, setMsg] = useState("");

  async function loadVault() {
    const [me, rev] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setRevisions(rev.revisions ?? []);
    setFlashcards(rev.flashcards ?? []);
  }

  useEffect(() => {
    loadVault();
  }, []);

  async function reviewCard(conceptId: string, rating: "again" | "good" | "easy") {
    const res = await fetch("/api/revisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept_id: conceptId, rating }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Scheduled next review in ${data.next_interval_days} day(s)! +${data.xp_awarded} XP`);
      setFlipped(false);
      if (flashcards.length > 0) setCardIdx((i) => (i + 1) % flashcards.length);
      loadVault();
    }
  }

  const activeCard = flashcards[cardIdx];

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <Layers className="w-7 h-7 text-forest" /> Memory Vault — Spaced Repetition
          </h1>
          <p className="text-sm text-ink-muted">
            Retain concepts permanently with 1, 3, 7, 14, and 30-day review intervals.
          </p>
        </div>

        {msg && <div className="p-3 rounded bg-forest/15 border border-forest text-xs font-semibold">{msg}</div>}

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Interactive Flashcard Deck */}
          <div className="lg:col-span-7 journal-card p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Flashcard {flashcards.length ? cardIdx + 1 : 0} of {flashcards.length}</span>
              <button
                type="button"
                onClick={() => setFlipped(!flipped)}
                className="parchment-btn px-3 py-1 rounded font-semibold inline-flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> Flip Card
              </button>
            </div>

            {activeCard && (
              <div
                onClick={() => setFlipped(!flipped)}
                className="min-h-[210px] p-6 rounded-lg bg-[#F2E6CF] border-2 border-ink/30 flex flex-col justify-center items-center text-center cursor-pointer"
              >
                {!flipped ? (
                  <>
                    <span className="text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                      {activeCard.kingdom_title}
                    </span>
                    <h2 className="font-hand text-3xl font-bold">{activeCard.title}</h2>
                    <p className="text-xs text-ink-muted mt-3">(Click to reveal revision summary)</p>
                  </>
                ) : (
                  <div className="space-y-3 text-left w-full">
                    <p className="text-sm font-serif leading-relaxed">{activeCard.revision_summary}</p>
                    <p className="text-xs font-mono bg-[#FAF4E8] p-2.5 rounded border border-ink/20">
                      {activeCard.formal_definition}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeCard && (
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => reviewCard(activeCard.concept_id, "again")}
                  className="terracotta-btn py-2 rounded text-xs font-semibold"
                >
                  Again (1d)
                </button>
                <button
                  type="button"
                  onClick={() => reviewCard(activeCard.concept_id, "good")}
                  className="parchment-btn py-2 rounded text-xs font-semibold"
                >
                  Good (Next)
                </button>
                <button
                  type="button"
                  onClick={() => reviewCard(activeCard.concept_id, "easy")}
                  className="forest-btn py-2 rounded text-xs font-semibold"
                >
                  Easy (+2 steps)
                </button>
              </div>
            )}
          </div>

          {/* Revision Schedule */}
          <div className="lg:col-span-5 journal-card p-5">
            <h2 className="font-hand text-2xl font-bold mb-3">Spaced Revision Queue</h2>
            {revisions.length === 0 ? (
              <p className="text-xs text-ink-muted">Complete a concept stage to schedule spaced reviews.</p>
            ) : (
              <div className="space-y-2.5">
                {revisions.map((r) => (
                  <div key={r.id} className="p-3 rounded bg-ivory border border-ink/20 text-xs flex justify-between items-center gap-2">
                    <div>
                      <p className="font-semibold">{r.concept_title}</p>
                      <p className="text-[11px] text-ink-muted">
                        Day {r.interval_days} interval • Next: {new Date(r.next_review_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => reviewCard(r.concept_id, "good")}
                      className="forest-btn px-2.5 py-1 rounded text-[11px] font-semibold"
                    >
                      Revise
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
