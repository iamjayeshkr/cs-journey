import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

async function requireAdmin() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const db = getDb();
  const user = db.prepare("SELECT id, role FROM profiles WHERE id = ?").get(userId) as { id: string; role: string } | undefined;
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const db = getDb();
  const stats = {
    students: (db.prepare("SELECT COUNT(*) as c FROM profiles WHERE role = 'student'").get() as { c: number }).c,
    kingdoms: (db.prepare("SELECT COUNT(*) as c FROM kingdoms").get() as { c: number }).c,
    chapters: (db.prepare("SELECT COUNT(*) as c FROM chapters").get() as { c: number }).c,
    concepts: (db.prepare("SELECT COUNT(*) as c FROM concepts").get() as { c: number }).c,
    questions: (db.prepare("SELECT COUNT(*) as c FROM questions").get() as { c: number }).c,
    pyqs: (db.prepare("SELECT COUNT(*) as c FROM questions WHERE is_pyq = 1").get() as { c: number }).c,
    puzzles: (db.prepare("SELECT COUNT(*) as c FROM puzzles").get() as { c: number }).c,
  };

  const kingdoms = db.prepare("SELECT id, order_index, title, slug FROM kingdoms ORDER BY order_index ASC").all();
  const chapters = db.prepare("SELECT id, kingdom_id, title, slug FROM chapters ORDER BY order_index ASC").all();
  const concepts = db.prepare("SELECT id, chapter_id, title, slug, difficulty, content_status FROM concepts ORDER BY id ASC").all();
  const students = db
    .prepare("SELECT id, full_name, email, level, xp, streak_days FROM profiles WHERE role = 'student' ORDER BY xp DESC LIMIT 20")
    .all();

  return NextResponse.json({ stats, kingdoms, chapters, concepts, students });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await req.json();
  const db = getDb();

  if (body.action === "create_concept") {
    const { chapter_id, title, difficulty = "intermediate", discover_story, understand_intuition, formal_definition, revision_summary } = body;
    if (!chapter_id || !title) return NextResponse.json({ error: "chapter_id and title required" }, { status: 400 });

    const id = `c-custom-${crypto.randomUUID().slice(0, 8)}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    db.prepare(`
      INSERT INTO concepts (id, chapter_id, order_index, slug, title, difficulty, simulator_type, content_status, estimated_minutes, xp_reward)
      VALUES (?, ?, 99, ?, ?, ?, 'none', 'authored', 20, 70)
    `).run(id, chapter_id, slug, title, difficulty);

    db.prepare(`
      INSERT INTO lessons (id, concept_id, discover_story, understand_intuition, formal_definition, revision_summary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `les-${id}`,
      id,
      discover_story || "Explore this core Computer Science concept.",
      understand_intuition || "Understand the underlying mechanism from first principles.",
      formal_definition || "Formal specification to be expanded.",
      revision_summary || title
    );
    return NextResponse.json({ ok: true, id, slug });
  }

  if (body.action === "create_question") {
    const { kingdom_id, prompt, explanation, difficulty = "medium", is_pyq = false, pyq_label = "", options = [] } = body;
    if (!kingdom_id || !prompt || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "kingdom_id, prompt, and at least 2 options required" }, { status: 400 });
    }

    const qId = `q-custom-${crypto.randomUUID().slice(0, 8)}`;
    db.prepare(`
      INSERT INTO questions (id, kingdom_id, prompt, explanation, difficulty, is_pyq, pyq_label, xp_reward)
      VALUES (?, ?, ?, ?, ?, ?, ?, 25)
    `).run(qId, kingdom_id, prompt, explanation || "Verified solution.", difficulty, is_pyq ? 1 : 0, pyq_label || null);

    const optStmt = db.prepare("INSERT INTO question_options (id, question_id, label, option_text, is_correct) VALUES (?, ?, ?, ?, ?)");
    options.forEach((o: { label: string; text: string; is_correct: boolean }, idx: number) => {
      optStmt.run(`${qId}-opt-${idx}`, qId, o.label, o.text, o.is_correct ? 1 : 0);
    });

    return NextResponse.json({ ok: true, id: qId });
  }

  if (body.action === "create_chapter") {
    const { kingdom_id, title, summary, boss_title = "Chapter Guardian" } = body;
    if (!kingdom_id || !title) return NextResponse.json({ error: "kingdom_id and title required" }, { status: 400 });
    const id = `ch-custom-${crypto.randomUUID().slice(0, 8)}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    db.prepare(`
      INSERT INTO chapters (id, kingdom_id, order_index, slug, title, summary, boss_title)
      VALUES (?, ?, 99, ?, ?, ?, ?)
    `).run(id, kingdom_id, slug, title, summary || "Newly authored chapter.", boss_title);
    return NextResponse.json({ ok: true, id, slug });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
