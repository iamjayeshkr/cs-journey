import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./auth";
import {
  ACHIEVEMENTS,
  CHAPTERS,
  CONCEPTS,
  KINGDOMS,
  MOCK_TESTS,
  PUZZLES,
  QUESTIONS,
  QUESTS,
} from "./curriculum-data";

let _db: DatabaseSync | null = null;
let _initialized = false;

export const SPACED_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

export function getDb(): DatabaseSync {
  if (!_db) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "cs-journey.db");
    _db = new DatabaseSync(dbPath);
    _db.exec("PRAGMA journal_mode = WAL;");
    _db.exec("PRAGMA foreign_keys = ON;");
  }
  if (!_initialized) {
    initSchema(_db);
    seedIfEmpty(_db);
    _initialized = true;
  }
  return _db;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      avatar_key TEXT NOT NULL DEFAULT 'explorer-1',
      role TEXT NOT NULL DEFAULT 'student',
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      coins INTEGER NOT NULL DEFAULT 50,
      streak_days INTEGER NOT NULL DEFAULT 1,
      last_active_date TEXT,
      target_exam TEXT NOT NULL DEFAULT 'UGC NET JRF (Computer Science)',
      daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
      sound_enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS kingdoms (
      id TEXT PRIMARY KEY,
      order_index INTEGER NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      theme_color TEXT NOT NULL,
      illustration_key TEXT NOT NULL,
      map_x REAL NOT NULL,
      map_y REAL NOT NULL,
      unlock_xp INTEGER NOT NULL DEFAULT 0,
      syllabus_verified INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
      order_index INTEGER NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      boss_title TEXT NOT NULL DEFAULT 'Chapter Guardian',
      estimated_minutes INTEGER NOT NULL DEFAULT 45,
      is_published INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      order_index INTEGER NOT NULL,
      title TEXT NOT NULL,
      subtopics_json TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
      order_index INTEGER NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'beginner',
      simulator_type TEXT NOT NULL DEFAULT 'none',
      content_status TEXT NOT NULL DEFAULT 'authored',
      estimated_minutes INTEGER NOT NULL DEFAULT 20,
      xp_reward INTEGER NOT NULL DEFAULT 60
    );

    CREATE TABLE IF NOT EXISTS prerequisites (
      concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      prerequisite_concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      PRIMARY KEY (concept_id, prerequisite_concept_id)
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      concept_id TEXT NOT NULL UNIQUE REFERENCES concepts(id) ON DELETE CASCADE,
      discover_story TEXT NOT NULL,
      understand_intuition TEXT NOT NULL,
      formal_definition TEXT NOT NULL,
      examples_json TEXT NOT NULL DEFAULT '[]',
      properties_json TEXT NOT NULL DEFAULT '[]',
      edge_cases_json TEXT NOT NULL DEFAULT '[]',
      applications_json TEXT NOT NULL DEFAULT '[]',
      revision_summary TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS puzzles (
      id TEXT PRIMARY KEY,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      puzzle_type TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      config_json TEXT NOT NULL,
      solution_json TEXT NOT NULL,
      hints_json TEXT NOT NULL DEFAULT '[]',
      xp_reward INTEGER NOT NULL DEFAULT 40
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
      chapter_id TEXT REFERENCES chapters(id) ON DELETE SET NULL,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      prompt TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      is_pyq INTEGER NOT NULL DEFAULT 0,
      pyq_label TEXT,
      xp_reward INTEGER NOT NULL DEFAULT 20
    );

    CREATE TABLE IF NOT EXISTS question_options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      option_text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      is_correct INTEGER NOT NULL,
      time_taken_sec INTEGER NOT NULL DEFAULT 0,
      hints_used INTEGER NOT NULL DEFAULT 0,
      submitted_answer TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS concept_mastery (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      stages_completed_json TEXT NOT NULL DEFAULT '[]',
      mastery_score REAL NOT NULL DEFAULT 0,
      accuracy_pct REAL NOT NULL DEFAULT 0,
      attempts_count INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'not_started',
      last_practiced_at TEXT,
      UNIQUE (user_id, concept_id)
    );

    CREATE TABLE IF NOT EXISTS learning_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      mode TEXT NOT NULL,
      duration_sec INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS revisions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      interval_days INTEGER NOT NULL DEFAULT 1,
      interval_step INTEGER NOT NULL DEFAULT 0,
      next_review_at TEXT NOT NULL,
      last_reviewed_at TEXT,
      status TEXT NOT NULL DEFAULT 'due',
      UNIQUE (user_id, concept_id)
    );

    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      quest_type TEXT NOT NULL,
      metric_key TEXT NOT NULL,
      target_count INTEGER NOT NULL DEFAULT 1,
      xp_reward INTEGER NOT NULL DEFAULT 50,
      coin_reward INTEGER NOT NULL DEFAULT 15
    );

    CREATE TABLE IF NOT EXISTS quest_claims (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
      claim_date TEXT NOT NULL,
      UNIQUE (user_id, quest_id, claim_date)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      xp_reward INTEGER NOT NULL DEFAULT 100,
      criteria_key TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS student_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, achievement_id)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      label TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, target_type, target_id)
    );

    CREATE TABLE IF NOT EXISTS mock_tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 20,
      total_marks INTEGER NOT NULL DEFAULT 20,
      question_ids_json TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS mock_test_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      mock_test_id TEXT NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
      score INTEGER NOT NULL DEFAULT 0,
      total_marks INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      time_taken_sec INTEGER NOT NULL DEFAULT 0,
      answers_json TEXT NOT NULL DEFAULT '{}',
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS study_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      scheduled_date TEXT NOT NULL,
      title TEXT NOT NULL,
      kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
      concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
      task_type TEXT NOT NULL DEFAULT 'concept',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function seedIfEmpty(db: DatabaseSync) {
  const existing = db.prepare("SELECT COUNT(*) as c FROM kingdoms").get() as { c: number };
  if (existing.c > 0) return;

  const insertKingdom = db.prepare(`
    INSERT INTO kingdoms (id, order_index, slug, title, subtitle, description, theme_color, illustration_key, map_x, map_y, unlock_xp, syllabus_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const k of KINGDOMS) {
    insertKingdom.run(
      k.id,
      k.order_index,
      k.slug,
      k.title,
      k.subtitle,
      k.description,
      k.theme_color,
      k.illustration_key,
      k.map_x,
      k.map_y,
      k.unlock_xp,
      k.syllabus_verified ? 1 : 0
    );
  }

  const insertChapter = db.prepare(`
    INSERT INTO chapters (id, kingdom_id, order_index, slug, title, summary, boss_title, estimated_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTopic = db.prepare(`
    INSERT INTO topics (id, chapter_id, order_index, title, subtopics_json)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const ch of CHAPTERS) {
    insertChapter.run(ch.id, ch.kingdom_id, ch.order_index, ch.slug, ch.title, ch.summary, ch.boss_title, ch.estimated_minutes);
    ch.topics.forEach((t, idx) => {
      insertTopic.run(t.id, ch.id, idx + 1, t.title, JSON.stringify(t.subtopics));
    });
  }

  const insertConcept = db.prepare(`
    INSERT INTO concepts (id, chapter_id, topic_id, order_index, slug, title, difficulty, simulator_type, content_status, estimated_minutes, xp_reward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, concept_id, discover_story, understand_intuition, formal_definition, examples_json, properties_json, edge_cases_json, applications_json, revision_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPrereq = db.prepare(`
    INSERT OR IGNORE INTO prerequisites (concept_id, prerequisite_concept_id) VALUES (?, ?)
  `);

  for (const c of CONCEPTS) {
    insertConcept.run(
      c.id,
      c.chapter_id,
      c.topic_id,
      c.order_index,
      c.slug,
      c.title,
      c.difficulty,
      c.simulator_type,
      c.content_status,
      c.estimated_minutes,
      c.xp_reward
    );
    insertLesson.run(
      `les-${c.id}`,
      c.id,
      c.lesson.discover_story,
      c.lesson.understand_intuition,
      c.lesson.formal_definition,
      JSON.stringify(c.lesson.examples),
      JSON.stringify(c.lesson.properties),
      JSON.stringify(c.lesson.edge_cases),
      JSON.stringify(c.lesson.applications),
      c.lesson.revision_summary
    );
    for (const p of c.prerequisites) {
      insertPrereq.run(c.id, p);
    }
  }

  const insertPuzzle = db.prepare(`
    INSERT INTO puzzles (id, concept_id, kingdom_id, title, prompt, puzzle_type, difficulty, config_json, solution_json, hints_json, xp_reward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of PUZZLES) {
    insertPuzzle.run(
      p.id,
      p.concept_id,
      p.kingdom_id,
      p.title,
      p.prompt,
      p.puzzle_type,
      p.difficulty,
      JSON.stringify(p.config),
      JSON.stringify(p.solution),
      JSON.stringify(p.hints),
      p.xp_reward
    );
  }

  const insertQ = db.prepare(`
    INSERT INTO questions (id, kingdom_id, chapter_id, concept_id, prompt, explanation, difficulty, is_pyq, pyq_label, xp_reward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertOpt = db.prepare(`
    INSERT INTO question_options (id, question_id, label, option_text, is_correct)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const q of QUESTIONS) {
    insertQ.run(
      q.id,
      q.kingdom_id,
      q.chapter_id,
      q.concept_id,
      q.prompt,
      q.explanation,
      q.difficulty,
      q.is_pyq ? 1 : 0,
      q.pyq_label ?? null,
      q.xp_reward
    );
    q.options.forEach((opt, idx) => {
      insertOpt.run(`${q.id}-opt-${idx}`, q.id, opt.label, opt.text, opt.is_correct ? 1 : 0);
    });
  }

  const insertQuest = db.prepare(`
    INSERT INTO quests (id, title, description, quest_type, metric_key, target_count, xp_reward, coin_reward)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const qst of QUESTS) {
    insertQuest.run(qst.id, qst.title, qst.description, qst.quest_type, qst.metric_key, qst.target_count, qst.xp_reward, qst.coin_reward);
  }

  const insertAch = db.prepare(`
    INSERT INTO achievements (id, title, description, badge_icon, xp_reward, criteria_key)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const a of ACHIEVEMENTS) {
    insertAch.run(a.id, a.title, a.description, a.badge_icon, a.xp_reward, a.criteria_key);
  }

  const insertMock = db.prepare(`
    INSERT INTO mock_tests (id, title, description, kingdom_id, duration_minutes, total_marks, question_ids_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const m of MOCK_TESTS) {
    insertMock.run(m.id, m.title, m.description, m.kingdom_id, m.duration_minutes, m.total_marks, JSON.stringify(m.question_ids));
  }

  // Seed Demo Explorer & Admin accounts
  const rudraId = "usr-rudra-explorer";
  const adminId = "usr-admin-curator";
  const today = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO profiles (id, email, password_hash, full_name, avatar_key, role, xp, level, coins, streak_days, last_active_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(rudraId, "rudra@csjourney.in", hashPassword("explorer123"), "Rudra", "explorer-1", "student", 2350, 10, 145, 24, today);

  db.prepare(`
    INSERT INTO profiles (id, email, password_hash, full_name, avatar_key, role, xp, level, coins, streak_days, last_active_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(adminId, "admin@csjourney.in", hashPassword("admin123"), "Curriculum Curator", "sage-1", "admin", 5000, 21, 500, 30, today);

  // Seed starter mastery, revisions, notes, bookmarks & study plans for Rudra
  db.prepare(`
    INSERT INTO concept_mastery (id, user_id, concept_id, stages_completed_json, mastery_score, accuracy_pct, attempts_count, correct_count, status, last_practiced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))
  `).run(crypto.randomUUID(), rudraId, "c-linked-list-intro", JSON.stringify(["discover", "understand", "visualize", "experiment"]), 68, 80, 5, 4, "practicing");

  db.prepare(`
    INSERT INTO concept_mastery (id, user_id, concept_id, stages_completed_json, mastery_score, accuracy_pct, attempts_count, correct_count, status, last_practiced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-4 days'))
  `).run(crypto.randomUUID(), rudraId, "c-prop-logic", JSON.stringify(["discover", "understand", "visualize", "experiment", "practice", "challenge", "exam", "mastery"]), 92, 95, 6, 6, "mastered");

  db.prepare(`
    INSERT INTO concept_mastery (id, user_id, concept_id, stages_completed_json, mastery_score, accuracy_pct, attempts_count, correct_count, status, last_practiced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-1 days'))
  `).run(crypto.randomUUID(), rudraId, "c-cpu-scheduling", JSON.stringify(["discover", "understand", "visualize"]), 45, 70, 3, 2, "learning");

  // Due spaced-repetition items
  db.prepare(`
    INSERT INTO revisions (id, user_id, concept_id, interval_days, interval_step, next_review_at, last_reviewed_at, status)
    VALUES (?, ?, ?, ?, ?, datetime('now', '-1 hour'), datetime('now', '-3 days'), 'due')
  `).run(crypto.randomUUID(), rudraId, "c-linked-list-intro", 3, 1);

  db.prepare(`
    INSERT INTO revisions (id, user_id, concept_id, interval_days, interval_step, next_review_at, last_reviewed_at, status)
    VALUES (?, ?, ?, ?, ?, datetime('now', '+2 days'), datetime('now', '-5 days'), 'due')
  `).run(crypto.randomUUID(), rudraId, "c-prop-logic", 7, 2);

  db.prepare(`
    INSERT INTO student_achievements (id, user_id, achievement_id)
    VALUES (?, ?, ?)
  `).run(crypto.randomUUID(), rudraId, "ach-first-step");

  db.prepare(`
    INSERT INTO notes (id, user_id, concept_id, kingdom_id, title, content, pinned)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    rudraId,
    "c-linked-list-intro",
    "k7-dsa",
    "Linked List Pointer Traps",
    "- Always link newNode.next BEFORE updating prev.next!\n- Deleting last node even with tail pointer is O(n) in Singly Linked List.\n- Reverse in-place uses 3 pointers: prev, curr, next.",
    1
  );

  db.prepare(`
    INSERT INTO bookmarks (id, user_id, target_type, target_id, label)
    VALUES (?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), rudraId, "concept", "c-linked-list-intro", "Singly Linked List & Pointer Mechanics");

  db.prepare(`
    INSERT INTO study_plans (id, user_id, scheduled_date, title, kingdom_id, concept_id, task_type, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), rudraId, today, "Complete Linked List Reversal & PYQs", "k7-dsa", "c-linked-list-intro", "concept", 0);

  db.prepare(`
    INSERT INTO study_plans (id, user_id, scheduled_date, title, kingdom_id, concept_id, task_type, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), rudraId, today, "CPU Scheduling Gantt Chart Practice", "k5-os", "c-cpu-scheduling", "concept", 1);
}

export function awardXp(userId: string, xpDelta: number, coinDelta = 0) {
  const db = getDb();
  const user = db.prepare("SELECT xp, coins FROM profiles WHERE id = ?").get(userId) as
    | { xp: number; coins: number }
    | undefined;
  if (!user) return null;
  const nextXp = Math.max(0, user.xp + xpDelta);
  const nextCoins = Math.max(0, user.coins + coinDelta);
  const nextLevel = computeLevel(nextXp);
  const today = new Date().toISOString().slice(0, 10);
  db.prepare(`
    UPDATE profiles SET xp = ?, level = ?, coins = ?, last_active_date = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(nextXp, nextLevel, nextCoins, today, userId);
  return { xp: nextXp, level: nextLevel, coins: nextCoins };
}

export function unlockAchievementIfEligible(userId: string, achievementId: string) {
  const db = getDb();
  const exists = db
    .prepare("SELECT id FROM student_achievements WHERE user_id = ? AND achievement_id = ?")
    .get(userId, achievementId);
  if (exists) return false;
  const ach = db.prepare("SELECT xp_reward FROM achievements WHERE id = ?").get(achievementId) as
    | { xp_reward: number }
    | undefined;
  if (!ach) return false;
  db.prepare("INSERT INTO student_achievements (id, user_id, achievement_id) VALUES (?, ?, ?)").run(
    crypto.randomUUID(),
    userId,
    achievementId
  );
  awardXp(userId, ach.xp_reward, 25);
  return true;
}
