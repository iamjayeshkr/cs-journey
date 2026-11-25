import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kingdomId = searchParams.get("kingdom_id");
  const difficulty = searchParams.get("difficulty");
  const pyqOnly = searchParams.get("pyq") === "true";

  const db = getDb();
  let query = `
    SELECT q.*, k.title as kingdom_title, k.slug as kingdom_slug
    FROM questions q
    JOIN kingdoms k ON k.id = q.kingdom_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (kingdomId && kingdomId !== "all") {
    query += " AND q.kingdom_id = ?";
    params.push(kingdomId);
  }
  if (difficulty && difficulty !== "all") {
    query += " AND q.difficulty = ?";
    params.push(difficulty);
  }
  if (pyqOnly) {
    query += " AND q.is_pyq = 1";
  }
  query += " ORDER BY q.is_pyq DESC, q.id ASC";

  const questions = db.prepare(query).all(...params) as Array<Record<string, unknown>>;
  const optStmt = db.prepare("SELECT id, label, option_text, is_correct FROM question_options WHERE question_id = ?");

  return NextResponse.json({
    questions: questions.map((q) => ({
      ...q,
      options: optStmt.all(String(q.id)),
    })),
  });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to submit answers." }, { status: 401 });

  const { question_id, selected_option_id, time_taken_sec = 0 } = await req.json();
  if (!question_id || !selected_option_id) {
    return NextResponse.json({ error: "question_id and selected_option_id required" }, { status: 400 });
  }

  const db = getDb();
  const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(question_id) as
    | { id: string; concept_id: string | null; explanation: string; xp_reward: number }
    | undefined;
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const selected = db
    .prepare("SELECT id, is_correct FROM question_options WHERE id = ? AND question_id = ?")
    .get(selected_option_id, question_id) as { id: string; is_correct: number } | undefined;
  if (!selected) return NextResponse.json({ error: "Option not found" }, { status: 404 });

  const isCorrect = selected.is_correct === 1;

  db.prepare(`
    INSERT INTO attempts (id, user_id, target_type, target_id, concept_id, is_correct, time_taken_sec, submitted_answer)
    VALUES (?, ?, 'question', ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, question_id, question.concept_id, isCorrect ? 1 : 0, time_taken_sec, selected_option_id);

  let xpAwarded = 0;
  if (isCorrect) {
    xpAwarded = question.xp_reward;
    awardXp(userId, xpAwarded, 5);
  }

  if (question.concept_id) {
    const existing = db
      .prepare("SELECT * FROM concept_mastery WHERE user_id = ? AND concept_id = ?")
      .get(userId, question.concept_id) as
      | { id: string; stages_completed_json: string; attempts_count: number; correct_count: number }
      | undefined;

    const attemptsCount = (existing?.attempts_count ?? 0) + 1;
    const correctCount = (existing?.correct_count ?? 0) + (isCorrect ? 1 : 0);
    const accuracyPct = Math.round((correctCount / attemptsCount) * 100);
    const stages: string[] = existing ? JSON.parse(existing.stages_completed_json || "[]") : [];
    const stageWeight = Math.min(60, Math.round((stages.length / 8) * 60));
    const accWeight = Math.round((accuracyPct / 100) * 40);
    const masteryScore = Math.min(100, stageWeight + accWeight);
    const status = masteryScore >= 85 && stages.length >= 6 ? "mastered" : masteryScore >= 40 ? "practicing" : "learning";

    if (existing) {
      db.prepare(`
        UPDATE concept_mastery
        SET attempts_count = ?, correct_count = ?, accuracy_pct = ?, mastery_score = ?, status = ?, last_practiced_at = datetime('now')
        WHERE id = ?
      `).run(attemptsCount, correctCount, accuracyPct, masteryScore, status, existing.id);
    } else {
      db.prepare(`
        INSERT INTO concept_mastery (id, user_id, concept_id, attempts_count, correct_count, accuracy_pct, mastery_score, status, last_practiced_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(crypto.randomUUID(), userId, question.concept_id, attemptsCount, correctCount, accuracyPct, masteryScore, status);
    }
  }

  return NextResponse.json({
    is_correct: isCorrect,
    explanation: question.explanation,
    xp_awarded: xpAwarded,
  });
}
