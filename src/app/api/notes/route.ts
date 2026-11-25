import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ notes: [] });
  const db = getDb();
  const notes = db
    .prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC")
    .all(userId);
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, content, kingdom_id = null, concept_id = null } = await req.json();
  if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO notes (id, user_id, kingdom_id, concept_id, title, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, userId, kingdom_id, concept_id, title, content);

  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  return NextResponse.json({ note });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, title, content, pinned } = await req.json();
  const db = getDb();
  const existing = db.prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?").get(id, userId) as
    | { title: string; content: string; pinned: number }
    | undefined;
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  db.prepare("UPDATE notes SET title = ?, content = ?, pinned = ?, updated_at = datetime('now') WHERE id = ?").run(
    title ?? existing.title,
    content ?? existing.content,
    pinned !== undefined ? (pinned ? 1 : 0) : existing.pinned,
    id
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = getDb();
  db.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").run(id, userId);
  return NextResponse.json({ ok: true });
}
