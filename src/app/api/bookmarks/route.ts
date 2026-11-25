import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ bookmarks: [] });
  const db = getDb();
  const bookmarks = db.prepare("SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC").all(userId);
  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { target_type, target_id, label } = await req.json();
  const db = getDb();

  const existing = db
    .prepare("SELECT id FROM bookmarks WHERE user_id = ? AND target_type = ? AND target_id = ?")
    .get(userId, target_type, target_id) as { id: string } | undefined;

  if (existing) {
    db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
    return NextResponse.json({ bookmarked: false });
  }

  db.prepare("INSERT INTO bookmarks (id, user_id, target_type, target_id, label) VALUES (?, ?, ?, ?, ?)").run(
    crypto.randomUUID(),
    userId,
    target_type,
    target_id,
    label
  );
  return NextResponse.json({ bookmarked: true });
}
