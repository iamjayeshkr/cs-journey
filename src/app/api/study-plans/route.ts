import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ plans: [] });
  const db = getDb();
  const plans = db
    .prepare("SELECT * FROM study_plans WHERE user_id = ? ORDER BY scheduled_date ASC, created_at ASC")
    .all(userId);
  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, scheduled_date, kingdom_id = null, task_type = "concept" } = await req.json();
  if (!title || !scheduled_date) return NextResponse.json({ error: "title and scheduled_date required" }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO study_plans (id, user_id, scheduled_date, title, kingdom_id, task_type, completed)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `).run(id, userId, scheduled_date, title, kingdom_id, task_type);
  const plan = db.prepare("SELECT * FROM study_plans WHERE id = ?").get(id);
  return NextResponse.json({ plan });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, completed } = await req.json();
  const db = getDb();
  db.prepare("UPDATE study_plans SET completed = ? WHERE id = ? AND user_id = ?").run(completed ? 1 : 0, id, userId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = getDb();
  db.prepare("DELETE FROM study_plans WHERE id = ? AND user_id = ?").run(id, userId);
  return NextResponse.json({ ok: true });
}
