"use client";

import React, { useEffect, useState } from "react";
import { Plus, Shield } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface AdminPayload {
  stats: {
    students: number;
    kingdoms: number;
    chapters: number;
    concepts: number;
    questions: number;
    pyqs: number;
    puzzles: number;
  };
  kingdoms: Array<{ id: string; order_index: number; title: string }>;
  chapters: Array<{ id: string; kingdom_id: string; title: string }>;
  concepts: Array<{ id: string; title: string; difficulty: string; content_status: string }>;
  students: Array<{ id: string; full_name: string; email: string; level: number; xp: number; streak_days: number }>;
}

export default function AdminPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // New Concept Form
  const [chapterId, setChapterId] = useState("");
  const [conceptTitle, setConceptTitle] = useState("");
  const [story, setStory] = useState("");
  const [intuition, setIntuition] = useState("");

  // New Question Form
  const [qKingdomId, setQKingdomId] = useState("k7-dsa");
  const [qPrompt, setQPrompt] = useState("");
  const [qExplanation, setQExplanation] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [isPyq, setIsPyq] = useState(false);

  async function loadAdmin() {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    setUser(me.user ?? null);
    const res = await fetch("/api/admin");
    if (!res.ok) {
      setError("Admin privileges required. Sign in with the Admin Curator account on /auth.");
      return;
    }
    const json = await res.json();
    setData(json);
    if (json.chapters?.length && !chapterId) setChapterId(json.chapters[0].id);
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  async function createConcept(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_concept",
        chapter_id: chapterId,
        title: conceptTitle,
        discover_story: story,
        understand_intuition: intuition,
      }),
    });
    if (res.ok) {
      setMsg("Concept authored and added to curriculum!");
      setConceptTitle("");
      setStory("");
      setIntuition("");
      loadAdmin();
    }
  }

  async function createQuestion(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_question",
        kingdom_id: qKingdomId,
        prompt: qPrompt,
        explanation: qExplanation,
        is_pyq: isPyq,
        options: [
          { label: "A", text: optA, is_correct: true },
          { label: "B", text: optB, is_correct: false },
        ],
      }),
    });
    if (res.ok) {
      setMsg("Question added to Practice Bank!");
      setQPrompt("");
      setQExplanation("");
      setOptA("");
      setOptB("");
      loadAdmin();
    }
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-terracotta" /> Curriculum & Content Management (Admin CMS)
          </h1>
          <p className="text-sm text-ink-muted">
            Author chapters, concepts, verified PYQs, and review student progress.
          </p>
        </div>

        {error && <div className="journal-card p-5 text-sm font-semibold text-terracotta">{error}</div>}
        {msg && <div className="p-3 rounded bg-forest/15 border border-forest text-xs font-semibold">{msg}</div>}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(data.stats).map(([k, v]) => (
                <div key={k} className="journal-card p-3 text-center">
                  <p className="text-[11px] uppercase text-ink-muted font-semibold">{k}</p>
                  <p className="font-hand text-3xl font-bold">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <form onSubmit={createConcept} className="journal-card p-5 space-y-3">
                <h2 className="font-hand text-2xl font-bold">Author New Concept</h2>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-ivory border border-ink/25"
                >
                  {data.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={conceptTitle}
                  onChange={(e) => setConceptTitle(e.target.value)}
                  placeholder="Concept Title"
                  className="w-full px-3 py-2 text-sm rounded bg-ivory border border-ink/25"
                />
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Stage 1: Discover Story"
                  className="w-full p-2.5 text-xs rounded bg-ivory border border-ink/25"
                />
                <textarea
                  rows={2}
                  value={intuition}
                  onChange={(e) => setIntuition(e.target.value)}
                  placeholder="Stage 2: First-Principles Intuition"
                  className="w-full p-2.5 text-xs rounded bg-ivory border border-ink/25"
                />
                <button type="submit" className="terracotta-btn px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Publish Concept
                </button>
              </form>

              <form onSubmit={createQuestion} className="journal-card p-5 space-y-3">
                <h2 className="font-hand text-2xl font-bold">Add Question / Verified PYQ</h2>
                <select
                  value={qKingdomId}
                  onChange={(e) => setQKingdomId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-ivory border border-ink/25"
                >
                  {data.kingdoms.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.order_index}. {k.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={qPrompt}
                  onChange={(e) => setQPrompt(e.target.value)}
                  placeholder="Question prompt"
                  className="w-full px-3 py-2 text-sm rounded bg-ivory border border-ink/25"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Option A (Correct)"
                    className="px-3 py-2 text-xs rounded bg-ivory border border-ink/25"
                  />
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Option B (Distractor)"
                    className="px-3 py-2 text-xs rounded bg-ivory border border-ink/25"
                  />
                </div>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Solution explanation"
                  className="w-full px-3 py-2 text-xs rounded bg-ivory border border-ink/25"
                />
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={isPyq} onChange={(e) => setIsPyq(e.target.checked)} />
                  <span>Mark as Verified PYQ</span>
                </label>
                <button type="submit" className="forest-btn px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </form>
            </div>

            <div className="journal-card p-5">
              <h2 className="font-hand text-2xl font-bold mb-3">Explorer Leaderboard & Progress</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-ink/20">
                      <th className="py-2">Explorer</th>
                      <th>Email</th>
                      <th>Level</th>
                      <th>XP</th>
                      <th>Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((s) => (
                      <tr key={s.id} className="border-b border-ink/10">
                        <td className="py-2 font-semibold">{s.full_name}</td>
                        <td>{s.email}</td>
                        <td>Lv. {s.level}</td>
                        <td>{s.xp}</td>
                        <td>{s.streak_days} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </JournalShell>
  );
}
