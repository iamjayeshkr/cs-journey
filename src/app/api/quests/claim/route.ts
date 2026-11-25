import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { awardXp, getDb } from "@/lib/db";

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quest_id } = await req.json();
  if (!quest_id) return NextResponse.json({ error: "quest_id required" }, { status: 400 });

  const db = getDb();
  const quest = db.prepare("SELECT * FROM quests WHERE id = ?").get(quest_id) as
    | { id: string; xp_reward: number; coin_reward: number }
    | undefined;
  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const already = db
    .prepare("SELECT id FROM quest_claims WHERE user_id = ? AND quest_id = ? AND claim_date = ?")
    .get(userId, quest.id, today);
  if (already) return NextResponse.json({ error: "Quest already claimed today" }, { status: 400 });

  db.prepare("INSERT INTO quest_claims (id, user_id, quest_id, claim_date) VALUES (?, ?, ?, ?)").run(
    crypto.randomUUID(),
    userId,
    quest.id,
    today
  );
  const updated = awardXp(userId, quest.xp_reward, quest.coin_reward);
  return NextResponse.json({ ok: true, profile: updated, xp_awarded: quest.xp_reward, coins_awarded: quest.coin_reward });
}
