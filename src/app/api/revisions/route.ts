import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, SPACED_INTERVALS_DAYS } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ revisions: [], flashcards: [] });

  const db = getDb();
  const revisions = db
    .prepare(
      `SELECT r.*, c.title as concept_title, c.slug as concept_slug, l.revision_summary, k.title as kingdom_title
       FROM revisions r
       JOIN concepts c ON c.id = r.concept_id
       JOIN chapters ch ON ch.id = c.chapter_id
       JOIN kingdoms k ON k.id = ch.kingdom_id
       LEFT JOIN lessons l ON l.concept_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.next_review_at ASC`
    )
    .all(userId);

  const flashcards = db
    .prepare(
      `SELECT c.id as concept_id, c.title, c.slug, l.revision_summary, l.formal_definition, k.title as kingdom_title
       FROM concepts c
       JOIN chapters ch ON ch.id = c.chapter_id
       JOIN kingdoms k ON k.id = ch.kingdom_id
       JOIN lessons l ON l.concept_id = c.id
       ORDER BY k.order_index ASC`
    )
    .all();

  return NextResponse.json({ revisions, flashcards });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { concept_id, rating } = await req.json(); // rating: 'again' | 'good' | 'easy'
  const db = getDb();

  const existing = db
    .prepare("SELECT * FROM revisions WHERE user_id = ? AND concept_id = ?")
    .get(userId, concept_id) as { id: string; interval_step: number } | undefined;

  let nextStep = 0;
  if (existing) {
    if (rating === "again") nextStep = 0;
    else if (rating === "good") nextStep = Math.min(SPACED_INTERVALS_DAYS.length - 1, existing.interval_step + 1);
    else nextStep = Math.min(SPACED_INTERVALS_DAYS.length - 1, existing.interval_step + 2);
  } else {
    nextStep = rating === "again" ? 0 : 1;
  }

  const nextDays = SPACED_INTERVALS_DAYS[nextStep];

  if (existing) {
    db.prepare(`
      UPDATE revisions
      SET interval_step = ?, interval_days = ?, last_reviewed_at = datetime('now'),
          next_review_at = datetime('now', '+' || ? || ' days'), status = 'completed'
      WHERE id = ?
    `).run(nextStep, nextDays, nextDays, existing.id);
  } else {
    db.prepare(`
      INSERT INTO revisions (id, user_id, concept_id, interval_days, interval_step, next_review_at, last_reviewed_at, status)
      VALUES (?, ?, ?, ?, ?, datetime('now', '+' || ? || ' days'), datetime('now'), 'completed')
    `).run(crypto.randomUUID(), userId, concept_id, nextDays, nextStep, nextDays);
  }

  awardXp(userId, 20, 5);
  return NextResponse.json({ ok: true, next_interval_days: nextDays, xp_awarded: 20 });
}
