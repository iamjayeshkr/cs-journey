"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, NotebookPen, Pin, Plus, Trash2 } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

interface NoteItem {
  id: string;
  title: string;
  content: string;
  pinned: number;
  updated_at: string;
}

interface BookmarkItem {
  id: string;
  target_type: string;
  target_id: string;
  label: string;
}

export default function NotesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function loadAll() {
    const [me, nRes, bRes] = await Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/notes").then((r) => r.json()),
      fetch("/api/bookmarks").then((r) => r.json()),
    ]);
    setUser(me.user ?? null);
    setNotes(nRes.notes ?? []);
    setBookmarks(bRes.bookmarks ?? []);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      loadAll();
    }
  }

  async function togglePin(n: NoteItem) {
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: n.id, pinned: !n.pinned }),
    });
    loadAll();
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    loadAll();
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <NotebookPen className="w-7 h-7 text-terracotta" /> Personal Notes & Bookmarks
          </h1>
          <p className="text-sm text-ink-muted">Your handwritten margin notes, formulas, and bookmarked concepts.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <form onSubmit={createNote} className="journal-card p-5 space-y-3">
              <h2 className="font-hand text-2xl font-bold">Write a Journal Note</h2>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title (e.g., Master Theorem Cases)"
                className="w-full px-3 py-2 text-sm rounded bg-ivory border border-ink/25"
              />
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write key formulas, edge cases, or mnemonics..."
                className="w-full p-3 text-sm rounded journal-ruled border border-ink/25"
              />
              <button type="submit" className="terracotta-btn px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Save Note
              </button>
            </form>

            <div className="grid sm:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div key={n.id} className="journal-card p-4 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-hand text-2xl font-bold leading-snug">{n.title}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePin(n)}
                          className={`p-1 rounded ${n.pinned ? "text-terracotta" : "text-ink-muted"}`}
                          title="Pin note"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNote(n.id)}
                          className="p-1 rounded text-ink-muted hover:text-terracotta"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-serif whitespace-pre-wrap text-ink-muted mt-1">{n.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 journal-card p-5 h-fit">
            <h2 className="font-hand text-2xl font-bold flex items-center gap-2 mb-3">
              <Bookmark className="w-5 h-5 text-terracotta" /> Bookmarks
            </h2>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-ink-muted">Bookmark concepts from any lesson page to find them quickly here.</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((b) => (
                  <Link
                    key={b.id}
                    href={`/concepts/${b.target_id}`}
                    className="block p-3 rounded bg-ivory border border-ink/20 hover:bg-parchment text-xs font-semibold"
                  >
                    {b.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
