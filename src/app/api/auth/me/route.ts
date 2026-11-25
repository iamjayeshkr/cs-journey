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
