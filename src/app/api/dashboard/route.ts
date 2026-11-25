import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const userId = await getSessionUserId();
  const db = getDb();

  const kingdoms = db
    .prepare("SELECT * FROM kingdoms ORDER BY order_index ASC")
    .all() as Array<Record<string, unknown>>;

  const concepts = db.prepare("SELECT id, chapter_id, title, slug, content_status FROM concepts").all() as Array<{
    id: string;
    chapter_id: string;
    title: string;
    slug: string;
    content_status: string;
  }>;
  const chapters = db.prepare("SELECT id, kingdom_id, title, slug FROM chapters").all() as Array<{
    id: string;
    kingdom_id: string;
    title: string;
    slug: string;
  }>;

  const chapterToKingdom = new Map(chapters.map((c) => [c.id, c.kingdom_id]));

  if (!userId) {
    return NextResponse.json({
      user: null,
      kingdoms: kingdoms.map((k) => ({ ...k, progress_pct: 0, concepts_total: 0, concepts_mastered: 0 })),
    });
  }

  const user = db
    .prepare(
      "SELECT id, email, full_name, avatar_key, role, xp, level, coins, streak_days, target_exam, daily_goal_minutes, sound_enabled FROM profiles WHERE id = ?"
    )
    .get(userId);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const masteryRows = db
    .prepare("SELECT concept_id, mastery_score, status FROM concept_mastery WHERE user_id = ?")
    .all(userId) as Array<{ concept_id: string; mastery_score: number; status: string }>;
  const masteryMap = new Map(masteryRows.map((m) => [m.concept_id, m]));

  const kingdomStats = kingdoms.map((k) => {
    const kConcepts = concepts.filter((c) => chapterToKingdom.get(c.chapter_id) === k.id);
    const total = Math.max(kConcepts.length, 1);
    const sumScore = kConcepts.reduce((acc, c) => acc + (masteryMap.get(c.id)?.mastery_score ?? 0), 0);
    const mastered = kConcepts.filter((c) => masteryMap.get(c.id)?.status === "mastered").length;
    return {
      ...k,
      concepts_total: kConcepts.length,
      concepts_mastered: mastered,
      progress_pct: Math.round(sumScore / total),
    };
  });

  const overallProgress = Math.round(
    kingdomStats.reduce((acc, k) => acc + k.progress_pct, 0) / Math.max(kingdomStats.length, 1)
  );
  const kingdomsExplored = kingdomStats.filter((k) => k.progress_pct > 0).length;

  // Daily quest metrics for today
  const today = new Date().toISOString().slice(0, 10);
  const studiedToday = (
    db
      .prepare("SELECT COUNT(*) as c FROM learning_sessions WHERE user_id = ? AND date(created_at) = ?")
      .get(userId, today) as { c: number }
  ).c;
  const questionsToday = (
    db
      .prepare("SELECT COUNT(*) as c FROM attempts WHERE user_id = ? AND target_type = 'question' AND date(created_at) = ?")
      .get(userId, today) as { c: number }
  ).c;
  const puzzlesToday = (
    db
      .prepare("SELECT COUNT(*) as c FROM attempts WHERE user_id = ? AND target_type = 'puzzle' AND is_correct = 1 AND date(created_at) = ?")
      .get(userId, today) as { c: number }
  ).c;
  const revisionsToday = (
    db
      .prepare("SELECT COUNT(*) as c FROM revisions WHERE user_id = ? AND date(last_reviewed_at) = ?")
      .get(userId, today) as { c: number }
  ).c;

  const metricValues: Record<string, number> = {
    concepts_studied_today: studiedToday,
    questions_answered_today: questionsToday,
    puzzles_solved_today: puzzlesToday,
    revisions_completed_today: revisionsToday,
  };

  const quests = db.prepare("SELECT * FROM quests").all() as Array<{
    id: string;
    title: string;
    description: string;
    quest_type: string;
    metric_key: string;
    target_count: number;
    xp_reward: number;
    coin_reward: number;
  }>;
  const claimedRows = db
    .prepare("SELECT quest_id FROM quest_claims WHERE user_id = ? AND claim_date = ?")
    .all(userId, today) as Array<{ quest_id: string }>;
  const claimedSet = new Set(claimedRows.map((r) => r.quest_id));

  const dailyQuests = quests.map((q) => {
    const current = metricValues[q.metric_key] ?? 0;
    return {
      ...q,
      current_count: Math.min(current, q.target_count),
      completed: current >= q.target_count,
      claimed: claimedSet.has(q.id),
    };
  });

  const dueRevisions = db
    .prepare(
      `SELECT r.*, c.title as concept_title, c.slug as concept_slug
       FROM revisions r
       JOIN concepts c ON c.id = r.concept_id
       WHERE r.user_id = ? AND datetime(r.next_review_at) <= datetime('now')
       ORDER BY r.next_review_at ASC`
    )
    .all(userId);

  const achievements = db
    .prepare(
      `SELECT a.*, sa.unlocked_at
       FROM achievements a
       LEFT JOIN student_achievements sa ON sa.achievement_id = a.id AND sa.user_id = ?
       ORDER BY sa.unlocked_at DESC NULLS LAST`
    )
    .all(userId);

  const studyPlans = db
    .prepare("SELECT * FROM study_plans WHERE user_id = ? AND scheduled_date = ? ORDER BY created_at ASC")
    .all(userId, today);

  const mockAttempts = db
    .prepare(
      `SELECT mta.*, mt.title as mock_title
       FROM mock_test_attempts mta
       JOIN mock_tests mt ON mt.id = mta.mock_test_id
       WHERE mta.user_id = ?
       ORDER BY mta.completed_at DESC
       LIMIT 5`
    )
    .all(userId);

  return NextResponse.json({
    user,
    overall_progress: overallProgress,
    kingdoms_explored: kingdomsExplored,
    kingdoms: kingdomStats,
    daily_quests: dailyQuests,
    due_revisions: dueRevisions,
    achievements,
    study_plans: studyPlans,
    recent_mocks: mockAttempts,
  });
}
