import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ kingdoms: [], concepts: [], questions: [] });

  const like = `%${q}%`;
  const db = getDb();

  const kingdoms = db
    .prepare("SELECT id, slug, title, subtitle FROM kingdoms WHERE title LIKE ? OR description LIKE ? LIMIT 5")
    .all(like, like);
  const concepts = db
    .prepare(
      `SELECT c.id, c.slug, c.title, c.difficulty, ch.title as chapter_title, k.slug as kingdom_slug, k.title as kingdom_title
       FROM concepts c
       JOIN chapters ch ON ch.id = c.chapter_id
       JOIN kingdoms k ON k.id = ch.kingdom_id
       WHERE c.title LIKE ? OR ch.title LIKE ? LIMIT 10`
    )
    .all(like, like);
  const questions = db
    .prepare("SELECT id, prompt, difficulty, is_pyq, kingdom_id FROM questions WHERE prompt LIKE ? OR explanation LIKE ? LIMIT 8")
    .all(like, like);

  return NextResponse.json({ kingdoms, concepts, questions });
}
