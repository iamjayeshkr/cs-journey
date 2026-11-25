import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, SPACED_INTERVALS_DAYS, unlockAchievementIfEligible } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = getDb();
  const userId = await getSessionUserId();

  const concept = db
    .prepare("SELECT * FROM concepts WHERE slug = ? OR id = ?")
    .get(slug, slug) as Record<string, unknown> | undefined;
  if (!concept) return NextResponse.json({ error: "Concept not found" }, { status: 404 });

  const chapter = db.prepare("SELECT * FROM chapters WHERE id = ?").get(String(concept.chapter_id)) as Record<string, unknown>;
  const kingdom = db.prepare("SELECT * FROM kingdoms WHERE id = ?").get(String(chapter.kingdom_id)) as Record<string, unknown>;
  const lesson = db.prepare("SELECT * FROM lessons WHERE concept_id = ?").get(String(concept.id)) as Record<string, unknown> | undefined;

  const puzzles = db
    .prepare("SELECT * FROM puzzles WHERE concept_id = ? OR kingdom_id = ? LIMIT 3")
    .all(String(concept.id), String(kingdom.id)) as Array<Record<string, unknown>>;

  const questions = db
    .prepare("SELECT * FROM questions WHERE concept_id = ? OR kingdom_id = ? LIMIT 6")
    .all(String(concept.id), String(kingdom.id)) as Array<Record<string, unknown>>;

  const optionsStmt = db.prepare("SELECT id, label, option_text, is_correct FROM question_options WHERE question_id = ?");
  const enrichedQuestions = questions.map((q) => ({
    ...q,
    options: optionsStmt.all(String(q.id)),
  }));

  const prereqs = db
    .prepare(
      `SELECT c.id, c.slug, c.title
       FROM prerequisites p
       JOIN concepts c ON c.id = p.prerequisite_concept_id
       WHERE p.concept_id = ?`
    )
    .all(String(concept.id)) as Array<{ id: string; slug: string; title: string }>;

  let mastery = {
    stages_completed: [] as string[],
    mastery_score: 0,
    accuracy_pct: 0,
    status: "not_started",
  };
  let isBookmarked = false;
  let prereqsWithStatus = prereqs.map((p) => ({ ...p, mastered: false }));

  if (userId) {
    const m = db
      .prepare("SELECT * FROM concept_mastery WHERE user_id = ? AND concept_id = ?")
      .get(userId, String(concept.id)) as
      | { stages_completed_json: string; mastery_score: number; accuracy_pct: number; status: string }
      | undefined;
    if (m) {
      mastery = {
        stages_completed: JSON.parse(m.stages_completed_json || "[]"),
        mastery_score: m.mastery_score,
        accuracy_pct: m.accuracy_pct,
        status: m.status,
      };
    }
    const bm = db
      .prepare("SELECT id FROM bookmarks WHERE user_id = ? AND target_type = 'concept' AND target_id = ?")
      .get(userId, String(concept.id));
    isBookmarked = Boolean(bm);

    prereqsWithStatus = prereqs.map((p) => {
      const pm = db
        .prepare("SELECT status FROM concept_mastery WHERE user_id = ? AND concept_id = ?")
        .get(userId, p.id) as { status: string } | undefined;
      return { ...p, mastered: pm?.status === "mastered" || pm?.status === "practicing" };
    });
  }

  return NextResponse.json({
    concept,
    chapter,
    kingdom,
    prerequisites: prereqsWithStatus,
    lesson: lesson
      ? {
          ...lesson,
          examples: JSON.parse(String(lesson.examples_json || "[]")),
          properties: JSON.parse(String(lesson.properties_json || "[]")),
          edge_cases: JSON.parse(String(lesson.edge_cases_json || "[]")),
          applications: JSON.parse(String(lesson.applications_json || "[]")),
          learning_objectives: JSON.parse(String(lesson.learning_objectives_json || "[]")),
          misconceptions: JSON.parse(String(lesson.misconceptions_json || "[]")),
          complexity: JSON.parse(String(lesson.complexity_json || "{}")),
          teaching_methods: JSON.parse(String(lesson.teaching_methods_json || "{}")),
          flashcards: JSON.parse(String(lesson.flashcards_json || "[]")),
        }
      : null,
    puzzles: puzzles.map((p) => ({
      ...p,
      config: JSON.parse(String(p.config_json || "{}")),
      solution: JSON.parse(String(p.solution_json || "{}")),
      hints: JSON.parse(String(p.hints_json || "[]")),
    })),
    questions: enrichedQuestions,
    mastery,
    is_bookmarked: isBookmarked,
  });
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to save progress." }, { status: 401 });

  const { slug } = await context.params;
  const { stage } = await req.json();
  if (!stage) return NextResponse.json({ error: "stage is required" }, { status: 400 });

  const db = getDb();
  const concept = db
    .prepare("SELECT id, chapter_id, xp_reward FROM concepts WHERE slug = ? OR id = ?")
    .get(slug, slug) as { id: string; chapter_id: string; xp_reward: number } | undefined;
  if (!concept) return NextResponse.json({ error: "Concept not found" }, { status: 404 });

  const chapter = db.prepare("SELECT kingdom_id FROM chapters WHERE id = ?").get(concept.chapter_id) as { kingdom_id: string };

  const existing = db
    .prepare("SELECT * FROM concept_mastery WHERE user_id = ? AND concept_id = ?")
    .get(userId, concept.id) as
    | { id: string; stages_completed_json: string; mastery_score: number; accuracy_pct: number; attempts_count: number; correct_count: number }
    | undefined;

  const stages: string[] = existing ? JSON.parse(existing.stages_completed_json || "[]") : [];
  const isNewStage = !stages.includes(stage);
  if (isNewStage) stages.push(stage);

  // Mastery requires both stage completion AND practice/exam accuracy
  const stageWeight = Math.min(60, Math.round((stages.length / 8) * 60));
  const accWeight = existing && existing.attempts_count > 0 ? Math.round((existing.accuracy_pct / 100) * 40) : stages.includes("mastery") ? 30 : 10;
  const masteryScore = Math.min(100, stageWeight + accWeight);
  const status = masteryScore >= 85 && stages.length >= 6 ? "mastered" : stages.length >= 3 ? "practicing" : "learning";

  if (existing) {
    db.prepare(`
      UPDATE concept_mastery
      SET stages_completed_json = ?, mastery_score = ?, status = ?, last_practiced_at = datetime('now')
      WHERE id = ?
    `).run(JSON.stringify(stages), masteryScore, status, existing.id);
  } else {
    db.prepare(`
      INSERT INTO concept_mastery (id, user_id, concept_id, stages_completed_json, mastery_score, status, last_practiced_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(crypto.randomUUID(), userId, concept.id, JSON.stringify(stages), masteryScore, status);
  }

  let xpAwarded = 0;
  if (isNewStage) {
    xpAwarded = stage === "mastery" ? 30 : 15;
    awardXp(userId, xpAwarded, 5);
    db.prepare(`
      INSERT INTO learning_sessions (id, user_id, kingdom_id, concept_id, mode, duration_sec, xp_earned)
      VALUES (?, ?, ?, ?, ?, 180, ?)
    `).run(crypto.randomUUID(), userId, chapter.kingdom_id, concept.id, `stage:${stage}`, xpAwarded);
  }

  // Schedule initial spaced repetition if not yet scheduled
  const revExists = db.prepare("SELECT id FROM revisions WHERE user_id = ? AND concept_id = ?").get(userId, concept.id);
  if (!revExists) {
    db.prepare(`
      INSERT INTO revisions (id, user_id, concept_id, interval_days, interval_step, next_review_at, status)
      VALUES (?, ?, ?, ?, 0, datetime('now', '+1 day'), 'due')
    `).run(crypto.randomUUID(), userId, concept.id, SPACED_INTERVALS_DAYS[0]);
  }

  if (concept.id === "c-linked-list-intro" && status === "mastered") {
    unlockAchievementIfEligible(userId, "ach-pointer-master");
  }

  return NextResponse.json({
    stages_completed: stages,
    mastery_score: masteryScore,
    status,
    xp_awarded: xpAwarded,
  });
}
