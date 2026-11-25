import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, unlockAchievementIfEligible } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const db = getDb();
  const userId = await getSessionUserId();

  const puzzles = db
    .prepare(
      `SELECT p.*, k.title as kingdom_title
       FROM puzzles p
       JOIN kingdoms k ON k.id = p.kingdom_id
       ORDER BY p.id ASC`
    )
    .all() as Array<Record<string, unknown>>;

  let solvedIds = new Set<string>();
  if (userId) {
    const solved = db
      .prepare("SELECT DISTINCT target_id FROM attempts WHERE user_id = ? AND target_type = 'puzzle' AND is_correct = 1")
      .all(userId) as Array<{ target_id: string }>;
    solvedIds = new Set(solved.map((s) => s.target_id));
  }

  return NextResponse.json({
    puzzles: puzzles.map((p) => ({
      ...p,
      config: JSON.parse(String(p.config_json || "{}")),
      solution: JSON.parse(String(p.solution_json || "{}")),
      hints: JSON.parse(String(p.hints_json || "[]")),
      solved: solvedIds.has(String(p.id)),
    })),
  });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to solve puzzles." }, { status: 401 });

  const { puzzle_id, answer, hints_used = 0 } = await req.json();
  const db = getDb();
  const puzzle = db.prepare("SELECT * FROM puzzles WHERE id = ?").get(puzzle_id) as
    | { id: string; concept_id: string | null; puzzle_type: string; solution_json: string; xp_reward: number }
    | undefined;
  if (!puzzle) return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });

  const solution = JSON.parse(puzzle.solution_json);
  let isCorrect = false;
  if (puzzle.puzzle_type === "pointer_trace" && Array.isArray(answer) && Array.isArray(solution.expectedList)) {
    isCorrect = JSON.stringify(answer) === JSON.stringify(solution.expectedList);
  } else {
    isCorrect = String(answer).trim() === String(solution.answer).trim();
  }

  db.prepare(`
    INSERT INTO attempts (id, user_id, target_type, target_id, concept_id, is_correct, hints_used, submitted_answer)
    VALUES (?, ?, 'puzzle', ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, puzzle.id, puzzle.concept_id, isCorrect ? 1 : 0, hints_used, JSON.stringify(answer));

  let xpAwarded = 0;
  if (isCorrect) {
    xpAwarded = Math.max(15, puzzle.xp_reward - hints_used * 10);
    awardXp(userId, xpAwarded, 10);
    const totalSolved = (
      db
        .prepare("SELECT COUNT(DISTINCT target_id) as c FROM attempts WHERE user_id = ? AND target_type = 'puzzle' AND is_correct = 1")
        .get(userId) as { c: number }
    ).c;
    if (totalSolved >= 3) {
      unlockAchievementIfEligible(userId, "ach-puzzle-solver");
    }
  }

  return NextResponse.json({ is_correct: isCorrect, xp_awarded: xpAwarded });
}
