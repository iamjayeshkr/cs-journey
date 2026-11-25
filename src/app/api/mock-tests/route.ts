import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, unlockAchievementIfEligible } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getMockTestById, getQuestionsForMockIds, listMockTests } from "@/lib/mock-test-bank";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mockId = searchParams.get("id");
  const category = searchParams.get("category") || "all";
  const kingdomId = searchParams.get("kingdom_id") || "all";
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const db = getDb();
  const userId = await getSessionUserId();

  if (mockId) {
    // Check 520-test Goldmine Mock Bank first
    const gmMock = getMockTestById(mockId);
    if (gmMock) {
      const questions = getQuestionsForMockIds(gmMock.question_ids);
      return NextResponse.json({ mock_test: gmMock, questions });
    }

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

  const { total, items } = listMockTests({ category, kingdomId, page, limit: 12 });
  const attempts = userId
    ? db
        .prepare(
          `SELECT mta.*, COALESCE(mt.title, mta.mock_test_id) as mock_title
           FROM mock_test_attempts mta
           LEFT JOIN mock_tests mt ON mt.id = mta.mock_test_id
           WHERE mta.user_id = ?
           ORDER BY mta.completed_at DESC
           LIMIT 10`
        )
        .all(userId)
    : [];

  return NextResponse.json({ mock_tests: items, total, page, attempts });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to submit mock tests." }, { status: 401 });

  const { mock_test_id, answers, time_taken_sec = 0 } = await req.json();
  const db = getDb();

  const gmMock = getMockTestById(mock_test_id);
  let correctCount = 0;
  let wrongCount = 0;
  let qCount = 0;
  const breakdown: Record<string, { selected: string | null; correct_option_id: string; is_correct: boolean }> = {};

  if (gmMock) {
    const questions = getQuestionsForMockIds(gmMock.question_ids);
    qCount = questions.length;
    for (const q of questions) {
      if (!q) continue;
      const correctOpt = q.options.find((o) => o.is_correct === 1);
      const selected = answers?.[q.id] ?? null;
      const isCorrect = Boolean(selected && correctOpt && selected === correctOpt.id);
      if (selected) {
        if (isCorrect) correctCount++;
        else wrongCount++;
      }
      breakdown[q.id] = {
        selected,
        correct_option_id: correctOpt?.id ?? "",
        is_correct: isCorrect,
      };
    }
  } else {
    const test = db.prepare("SELECT * FROM mock_tests WHERE id = ?").get(mock_test_id) as
      | { id: string; question_ids_json: string }
      | undefined;
    if (!test) return NextResponse.json({ error: "Mock test not found" }, { status: 404 });

    const qIds: string[] = JSON.parse(test.question_ids_json || "[]");
    qCount = qIds.length;
    const optStmt = db.prepare("SELECT id, is_correct FROM question_options WHERE question_id = ? AND is_correct = 1");

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
  }

  const score = correctCount * 2;
  const totalMarks = qCount * 2;

  db.prepare(`
    INSERT OR IGNORE INTO mock_tests (id, title, description, duration_minutes, total_marks, question_ids_json)
    VALUES (?, ?, ?, ?, ?, '[]')
  `).run(mock_test_id, gmMock?.title || mock_test_id, gmMock?.description || "", gmMock?.duration_minutes || 15, totalMarks);

  db.prepare(`
    INSERT INTO mock_test_attempts (id, user_id, mock_test_id, score, total_marks, correct_count, wrong_count, time_taken_sec, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, mock_test_id, score, totalMarks, correctCount, wrongCount, time_taken_sec, JSON.stringify(answers || {}));

  const xpEarned = 40 + correctCount * 15;
  awardXp(userId, xpEarned, 20);
  unlockAchievementIfEligible(userId, "ach-mock-warrior");

  return NextResponse.json({
    score,
    total_marks: totalMarks,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unanswered_count: qCount - correctCount - wrongCount,
    xp_awarded: xpEarned,
    breakdown,
  });
}
