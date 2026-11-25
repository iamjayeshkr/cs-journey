import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { awardXp, getDb, unlockAchievementIfEligible } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getUnitPuzzleHouse } from "@/lib/unit-puzzles-bank";
import { KINGDOMS } from "@/lib/curriculum-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kingdomId = searchParams.get("kingdom_id");
  const db = getDb();
  const userId = await getSessionUserId();

  let solvedIds = new Set<string>();
  if (userId) {
    const solved = db
      .prepare("SELECT DISTINCT target_id FROM attempts WHERE user_id = ? AND target_type = 'puzzle' AND is_correct = 1")
      .all(userId) as Array<{ target_id: string }>;
    solvedIds = new Set(solved.map((s) => s.target_id));
  }

  if (kingdomId) {
    const housePuzzles = getUnitPuzzleHouse(kingdomId).map((p) => ({
      ...p,
      solved: solvedIds.has(p.id),
    }));
    return NextResponse.json({ puzzles: housePuzzles });
  }

  const houses = KINGDOMS.map((k) => {
    const puz = getUnitPuzzleHouse(k.id);
    return {
      kingdom_id: k.id,
      order_index: k.order_index,
      title: k.title,
      subtitle: k.subtitle,
      total_puzzles: puz.length,
      solved_count: puz.filter((p) => solvedIds.has(p.id)).length,
    };
  });

  const puzzles = db
    .prepare(
      `SELECT p.*, k.title as kingdom_title
       FROM puzzles p
       JOIN kingdoms k ON k.id = p.kingdom_id
       ORDER BY p.id ASC`
    )
    .all() as Array<Record<string, unknown>>;

  return NextResponse.json({
    houses,
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

  // Check unit puzzle houses first
  let foundHousePuzzle = null;
  for (const k of KINGDOMS) {
    const match = getUnitPuzzleHouse(k.id).find((p) => p.id === puzzle_id);
    if (match) {
      foundHousePuzzle = match;
      break;
    }
  }

  let isCorrect = false;
  let xpReward = 40;
  let conceptId: string | null = null;

  if (foundHousePuzzle) {
    xpReward = foundHousePuzzle.xp_reward;
    if (
      foundHousePuzzle.puzzle_type === "pointer_trace" &&
      Array.isArray(answer) &&
      Array.isArray(foundHousePuzzle.solution.expectedList)
    ) {
      isCorrect = JSON.stringify(answer) === JSON.stringify(foundHousePuzzle.solution.expectedList);
    } else {
      isCorrect = String(answer).trim() === String(foundHousePuzzle.solution.answer).trim();
    }
  } else {
    const puzzle = db.prepare("SELECT * FROM puzzles WHERE id = ?").get(puzzle_id) as
      | { id: string; concept_id: string | null; puzzle_type: string; solution_json: string; xp_reward: number }
      | undefined;
    if (!puzzle) return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    xpReward = puzzle.xp_reward;
    conceptId = puzzle.concept_id;
    const solution = JSON.parse(puzzle.solution_json);
    if (puzzle.puzzle_type === "pointer_trace" && Array.isArray(answer) && Array.isArray(solution.expectedList)) {
      isCorrect = JSON.stringify(answer) === JSON.stringify(solution.expectedList);
    } else {
      isCorrect = String(answer).trim() === String(solution.answer).trim();
    }
  }

  db.prepare(`
    INSERT INTO attempts (id, user_id, target_type, target_id, concept_id, is_correct, hints_used, submitted_answer)
    VALUES (?, ?, 'puzzle', ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), userId, puzzle_id, conceptId, isCorrect ? 1 : 0, hints_used, JSON.stringify(answer));

  let xpAwarded = 0;
  if (isCorrect) {
    xpAwarded = Math.max(15, xpReward - hints_used * 10);
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
