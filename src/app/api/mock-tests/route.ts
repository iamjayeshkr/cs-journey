import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, unlockAchievementIfEligible } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mockId = searchParams.get("id");
  const db = getDb();
  const userId = await getSessionUserId();

  if (mockId) {
    const test = db.prepare("SELECT * FROM mock_tests WHERE id = ?").get(mockId) as
      | { id: string; title: string; description: string; duration_minutes: number; total_marks: number; question_ids_json: string }
      | undefined;
    if (!test) return NextResponse.json({ error: "Mock test not found" }, { status: 404 });

    const qIds: string[] = JSON.parse(test.question_ids_json || "[]");
    const optStmt = db.prepare("SELECT id, label, option_text, is_correct FROM question_options WHERE question_id = ?");
    const qStmt = db.prepare("SELECT * FROM questions WHERE id = ?");
    const questions = qIds
      .map((qid) => {
        const q = qStmt.get(qid) as Record<string, unknown> | undefined;
        if (!q) return null;
        return { ...q, options: optStmt.all(qid) };
      })
      .filter(Boolean);

    return NextResponse.json({ mock_test: test, questions });
  }

  const tests = db.prepare("SELECT * FROM mock_tests").all();
  const attempts = userId
    ? db
        .prepare(
          `SELECT mta.*, mt.title as mock_title
           FROM mock_test_attempts mta
           JOIN mock_tests mt ON mt.id = mta.mock_test_id
           WHERE mta.user_id = ?
           ORDER BY mta.completed_at DESC`
        )
        .all(userId)
    : [];

  return NextResponse.json({ mock_tests: tests, attempts });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to submit mock tests." }, { status: 401 });

  const { mock_test_id, answers, time_taken_sec = 0 } = await req.json();
  const db = getDb();
  const test = db.prepare("SELECT * FROM mock_tests WHERE id = ?").get(mock_test_id) as
    | { id: string; question_ids_json: string }
    | undefined;
  if (!test) return NextResponse.json({ error: "Mock test not found" }, { status: 404 });

  const qIds: string[] = JSON.parse(test.question_ids_json || "[]");
  const optStmt = db.prepare("SELECT id, is_correct FROM question_options WHERE question_id = ? AND is_correct = 1");

  let correctCount = 0;
  let wrongCount = 0;
  const breakdown: Record<string, { selected: string | null; correct_option_id: string; is_correct: boolean }> = {};

  for (const qid of qIds) {
    const correctOpt = optStmt.get(qid) as { id: string } | undefined;
    const selected = answers?.[qid] ?? null;
    const isCorrect = Boolean(selected && correctOpt && selected === correctOpt.id);
    if (selected) {
      if (isCorrect) correctCount++;
      else wrongCount++;
    }
    breakdown[qid] = {
      selected,
      correct_option_id: correctOpt?.id ?? "",
      is_correct: isCorrect,
    };
  }

  // UGC NET Paper 2: +2 marks per correct answer, no negative marking
  const score = correctCount * 2;
  const totalMarks = qIds.length * 2;

  db.prepare(`
    INSERT INTO mock_test_attempts (id, user_id, mock_test_id, score, total_marks, correct_count, wrong_count, time_taken_sec, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, test.id, score, totalMarks, correctCount, wrongCount, time_taken_sec, JSON.stringify(answers || {}));

  const xpEarned = 40 + correctCount * 15;
  awardXp(userId, xpEarned, 20);
  unlockAchievementIfEligible(userId, "ach-mock-warrior");

  return NextResponse.json({
    score,
    total_marks: totalMarks,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unanswered_count: qIds.length - correctCount - wrongCount,
    xp_awarded: xpEarned,
    breakdown,
  });
}
