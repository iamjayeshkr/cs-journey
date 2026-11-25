import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getGoldmineQuestionById, queryGoldmineQuestions } from "@/lib/question-goldmine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kingdomId = searchParams.get("kingdom_id") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const source = searchParams.get("source") || "all";
  const pyqOnly = searchParams.get("pyq") === "true";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 1)));

  const db = getDb();
  const userId = await getSessionUserId();

  if (pyqOnly) {
    let query = `
      SELECT q.*, k.title as kingdom_title, k.slug as kingdom_slug
      FROM questions q
      JOIN kingdoms k ON k.id = q.kingdom_id
      WHERE q.is_pyq = 1
    `;
    const params: (string | number)[] = [];
    if (kingdomId !== "all") {
      query += " AND q.kingdom_id = ?";
      params.push(kingdomId);
    }
    if (difficulty !== "all") {
      query += " AND q.difficulty = ?";
      params.push(difficulty);
    }
    query += " ORDER BY q.id ASC";
    const allPyqs = db.prepare(query).all(...params) as Array<Record<string, unknown>>;
    const total = allPyqs.length;
    const sliced = allPyqs.slice((page - 1) * limit, page * limit);
    const optStmt = db.prepare("SELECT id, label, option_text, is_correct FROM question_options WHERE question_id = ?");
    return NextResponse.json({
      total,
      page,
      questions: sliced.map((q) => ({ ...q, options: optStmt.all(String(q.id)) })),
    });
  }

  // Serve from 10,500+ Goldmine Question Bank (one-by-one or paginated)
  const { total, items } = queryGoldmineQuestions({ kingdomId, difficulty, source, page, limit });

  // Attach user's attempt count & lock state for these questions
  const enriched = items.map((q) => {
    let attemptsUsed = 0;
    let solved = false;
    if (userId) {
      const rows = db
        .prepare("SELECT is_correct FROM attempts WHERE user_id = ? AND target_type = 'question' AND target_id = ?")
        .all(userId, q.id) as Array<{ is_correct: number }>;
      attemptsUsed = rows.length;
      solved = rows.some((r) => r.is_correct === 1);
    }
    return {
      ...q,
      attempts_used: attemptsUsed,
      locked: solved || attemptsUsed >= 2,
      solved,
    };
  });

  return NextResponse.json({ total, page, questions: enriched });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to submit answers." }, { status: 401 });

  const { question_id, selected_option_id, time_taken_sec = 0 } = await req.json();
  if (!question_id || !selected_option_id) {
    return NextResponse.json({ error: "question_id and selected_option_id required" }, { status: 400 });
  }

  const db = getDb();

  // Check prior attempts for 2-attempt limit enforcement
  const prior = db
    .prepare("SELECT is_correct FROM attempts WHERE user_id = ? AND target_type = 'question' AND target_id = ?")
    .all(userId, question_id) as Array<{ is_correct: number }>;

  if (prior.some((r) => r.is_correct === 1)) {
    return NextResponse.json({ error: "You already solved this question!" }, { status: 400 });
  }
  if (prior.length >= 2) {
    return NextResponse.json({ error: "Maximum 2 attempts reached. Answer already revealed." }, { status: 400 });
  }

  // Resolve question from Goldmine or SQLite
  const gmQ = getGoldmineQuestionById(question_id);
  let explanation = "";
  let xpReward = 20;
  let conceptId: string | null = null;
  let isCorrect = false;
  let correctOptionId = "";
  let correctOptionText = "";

  if (gmQ) {
    explanation = gmQ.explanation;
    xpReward = gmQ.xp_reward;
    const chosen = gmQ.options.find((o) => o.id === selected_option_id);
    const correctOpt = gmQ.options.find((o) => o.is_correct === 1)!;
    if (!chosen) return NextResponse.json({ error: "Option not found" }, { status: 404 });
    isCorrect = chosen.is_correct === 1;
    correctOptionId = correctOpt.id;
    correctOptionText = `${correctOpt.label}. ${correctOpt.option_text}`;
  } else {
    const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(question_id) as
      | { id: string; concept_id: string | null; explanation: string; xp_reward: number }
      | undefined;
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
    explanation = question.explanation;
    xpReward = question.xp_reward;
    conceptId = question.concept_id;

    const selected = db
      .prepare("SELECT id, is_correct FROM question_options WHERE id = ? AND question_id = ?")
      .get(selected_option_id, question_id) as { id: string; is_correct: number } | undefined;
    if (!selected) return NextResponse.json({ error: "Option not found" }, { status: 404 });
    const correctOpt = db
      .prepare("SELECT id, label, option_text FROM question_options WHERE question_id = ? AND is_correct = 1")
      .get(question_id) as { id: string; label: string; option_text: string } | undefined;
    isCorrect = selected.is_correct === 1;
    correctOptionId = correctOpt?.id || "";
    correctOptionText = correctOpt ? `${correctOpt.label}. ${correctOpt.option_text}` : "";
  }

  db.prepare(`
    INSERT INTO attempts (id, user_id, target_type, target_id, concept_id, is_correct, time_taken_sec, submitted_answer)
    VALUES (?, ?, 'question', ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, question_id, conceptId, isCorrect ? 1 : 0, time_taken_sec, selected_option_id);

  const attemptsUsed = prior.length + 1;
  let xpDelta = 0;

  if (isCorrect) {
    xpDelta = xpReward;
    awardXp(userId, xpDelta, 5);
  } else {
    // Deduct 10 XP on wrong attempt!
    xpDelta = -10;
    awardXp(userId, -10, 0);
  }

  if (conceptId) {
    const existing = db
      .prepare("SELECT * FROM concept_mastery WHERE user_id = ? AND concept_id = ?")
      .get(userId, conceptId) as
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
      `).run(crypto.randomUUID(), userId, conceptId, attemptsCount, correctCount, accuracyPct, masteryScore, status);
    }
  }

  const revealAnswer = isCorrect || attemptsUsed >= 2;
  return NextResponse.json({
    is_correct: isCorrect,
    xp_delta: xpDelta,
    attempts_used: attemptsUsed,
    attempts_remaining: Math.max(0, 2 - attemptsUsed),
    locked: revealAnswer,
    correct_option_id: revealAnswer ? correctOptionId : null,
    correct_answer_text: revealAnswer ? correctOptionText : null,
    explanation: revealAnswer ? explanation : "Incorrect! -10 XP deducted. You have 1 attempt left — think carefully!",
  });
}
