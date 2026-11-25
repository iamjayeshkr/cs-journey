"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KINGDOMS } from "@/lib/curriculum-data";

interface PlanTask {
  id: string;
  scheduled_date: string;
  title: string;
  kingdom_id: string | null;
  task_type: string;
  completed: number;
}

export default function PlannerPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<PlanTask[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [kingdomId, setKingdomId] = useState("k7-dsa");

  async function loadPlans() {
    const [me, pl] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/study-plans").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setPlans(pl.plans ?? []);
  }

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
    loadPlans();
  }, []);

  async function addPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/study-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, scheduled_date: date, kingdom_id: kingdomId }),
    });
    if (res.ok) {
      setTitle("");
      loadPlans();
    }
  }

  async function togglePlan(id: string, completed: number) {
    await fetch("/api/study-plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    });
    loadPlans();
  }

  async function deletePlan(id: string) {
    await fetch(`/api/study-plans?id=${id}`, { method: "DELETE" });
    loadPlans();
  }

  return (
    <JournalShell user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-terracotta" /> Study Planner & Calendar
          </h1>
          <p className="text-sm text-ink-muted">Organize your daily UGC NET CS milestones across the ten kingdoms.</p>
        </div>

        <form onSubmit={addPlan} className="journal-card p-5 grid sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold mb-1">Study Task</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Solve 10 DBMS Normalization PYQs"
              className="w-full px-3 py-2 text-sm rounded bg-ivory border border-ink/25"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-ivory border border-ink/25"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1">Kingdom</label>
            <select
              value={kingdomId}
              onChange={(e) => setKingdomId(e.target.value)}
              className="w-full px-2 py-2 text-xs rounded bg-ivory border border-ink/25"
            >
              {KINGDOMS.map((k) => (
                <option key={k.id} value={k.id}>
                  Unit {k.order_index}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="sm:col-span-2 terracotta-btn py-2 px-3 rounded text-xs font-semibold inline-flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="journal-card p-5 space-y-2.5">
          {plans.length === 0 ? (
            <p className="text-sm text-ink-muted">No planned tasks yet. Add your first study goal above!</p>
          ) : (
            plans.map((p) => (
              <div key={p.id} className="p-3 rounded bg-ivory border border-ink/20 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => togglePlan(p.id, p.completed)}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {p.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-ink-muted shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${p.completed ? "line-through text-ink-muted" : ""}`}>
                      {p.title}
                    </p>
                    <p className="text-[11px] text-ink-muted">{p.scheduled_date}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deletePlan(p.id)}
                  className="p-1.5 text-ink-muted hover:text-terracotta"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </JournalShell>
  );
}
