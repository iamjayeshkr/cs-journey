import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ user: null });
  }
  const db = getDb();
  const user = db
    .prepare(
      "SELECT id, email, full_name, avatar_key, role, xp, level, coins, streak_days, target_exam, daily_goal_minutes, sound_enabled FROM profiles WHERE id = ?"
    )
    .get(userId);
  return NextResponse.json({ user: user ?? null });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const db = getDb();
  const fullName = body.full_name !== undefined ? String(body.full_name).trim() : undefined;
  const avatarKey = body.avatar_key !== undefined ? String(body.avatar_key) : undefined;
  const targetExam = body.target_exam !== undefined ? String(body.target_exam) : undefined;
  const dailyGoal = body.daily_goal_minutes !== undefined ? Number(body.daily_goal_minutes) : undefined;
  const soundEnabled = body.sound_enabled !== undefined ? (body.sound_enabled ? 1 : 0) : undefined;

  const current = db.prepare("SELECT * FROM profiles WHERE id = ?").get(userId) as Record<string, unknown> | undefined;
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare(`
    UPDATE profiles
    SET full_name = ?, avatar_key = ?, target_exam = ?, daily_goal_minutes = ?, sound_enabled = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    fullName || current.full_name,
    avatarKey || current.avatar_key,
    targetExam || current.target_exam,
    Number.isFinite(dailyGoal) ? dailyGoal : current.daily_goal_minutes,
    soundEnabled !== undefined ? soundEnabled : current.sound_enabled,
    userId
  );

  const updated = db
    .prepare(
      "SELECT id, email, full_name, avatar_key, role, xp, level, coins, streak_days, target_exam, daily_goal_minutes, sound_enabled FROM profiles WHERE id = ?"
    )
    .get(userId);
  return NextResponse.json({ user: updated });
}
