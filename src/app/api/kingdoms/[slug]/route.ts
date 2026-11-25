import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = getDb();
  const userId = await getSessionUserId();

  const kingdom = db.prepare("SELECT * FROM kingdoms WHERE slug = ? OR id = ?").get(slug, slug) as
    | Record<string, unknown>
    | undefined;
  if (!kingdom) {
    return NextResponse.json({ error: "Kingdom not found" }, { status: 404 });
  }

  const chapters = db
    .prepare("SELECT * FROM chapters WHERE kingdom_id = ? ORDER BY order_index ASC")
    .all(String(kingdom.id)) as Array<Record<string, unknown>>;

  const topics = db.prepare("SELECT * FROM topics ORDER BY order_index ASC").all() as Array<{
    id: string;
    chapter_id: string;
    order_index: number;
    title: string;
    subtopics_json: string;
  }>;

  const concepts = db
    .prepare("SELECT * FROM concepts ORDER BY order_index ASC")
    .all() as Array<Record<string, unknown>>;

  let masteryMap = new Map<string, { mastery_score: number; status: string; stages_completed_json: string }>();
  if (userId) {
    const rows = db
      .prepare("SELECT concept_id, mastery_score, status, stages_completed_json FROM concept_mastery WHERE user_id = ?")
      .all(userId) as Array<{ concept_id: string; mastery_score: number; status: string; stages_completed_json: string }>;
    masteryMap = new Map(rows.map((r) => [r.concept_id, r]));
  }

  const enrichedChapters = chapters.map((ch) => {
    const chTopics = topics
      .filter((t) => t.chapter_id === ch.id)
      .map((t) => ({
        ...t,
        subtopics: JSON.parse(t.subtopics_json || "[]"),
      }));
    const chConcepts = concepts
      .filter((c) => c.chapter_id === ch.id)
      .map((c) => {
        const m = masteryMap.get(String(c.id));
        return {
          ...c,
          mastery_score: m?.mastery_score ?? 0,
          status: m?.status ?? "not_started",
          stages_completed: m ? JSON.parse(m.stages_completed_json || "[]") : [],
        };
      });
    return { ...ch, topics: chTopics, concepts: chConcepts };
  });

  const questionsCount = (
    db.prepare("SELECT COUNT(*) as c FROM questions WHERE kingdom_id = ?").get(String(kingdom.id)) as { c: number }
  ).c;
  const puzzlesCount = (
    db.prepare("SELECT COUNT(*) as c FROM puzzles WHERE kingdom_id = ?").get(String(kingdom.id)) as { c: number }
  ).c;

  return NextResponse.json({
    kingdom,
    chapters: enrichedChapters,
    questions_count: questionsCount,
    puzzles_count: puzzlesCount,
  });
}
