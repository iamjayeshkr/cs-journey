import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const db = getDb();
  const userId = await getSessionUserId();
  const kingdoms = db.prepare("SELECT * FROM kingdoms ORDER BY order_index ASC").all() as Array<Record<string, unknown>>;
  const chapters = db.prepare("SELECT * FROM chapters ORDER BY order_index ASC").all() as Array<Record<string, unknown>>;
  const concepts = db
    .prepare("SELECT id, chapter_id, topic_id, order_index, slug, title, difficulty, simulator_type, content_status, estimated_minutes, xp_reward FROM concepts ORDER BY order_index ASC")
    .all() as Array<Record<string, unknown>>;

  let masteryMap = new Map<string, { mastery_score: number; status: string }>();
  if (userId) {
    const rows = db
      .prepare("SELECT concept_id, mastery_score, status FROM concept_mastery WHERE user_id = ?")
      .all(userId) as Array<{ concept_id: string; mastery_score: number; status: string }>;
    masteryMap = new Map(rows.map((r) => [r.concept_id, r]));
  }

  const enriched = kingdoms.map((k) => {
    const kChapters = chapters
      .filter((c) => c.kingdom_id === k.id)
      .map((ch) => ({
        ...ch,
        concepts: concepts
          .filter((co) => co.chapter_id === ch.id)
          .map((co) => ({
            ...co,
            mastery: masteryMap.get(String(co.id)) ?? { mastery_score: 0, status: "not_started" },
          })),
      }));
    return { ...k, chapters: kChapters };
  });

  return NextResponse.json({ kingdoms: enriched });
}
