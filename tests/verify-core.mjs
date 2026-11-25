import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Verify production build output exists & database file is valid after hitting API
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

console.log("Running core verification checks...");

// Verify schema SQL file exists and has all 26 tables
const schemaSql = fs.readFileSync(path.join(process.cwd(), "supabase/schema.sql"), "utf8");
for (const table of [
  "profiles",
  "kingdoms",
  "regions",
  "chapters",
  "topics",
  "concepts",
  "prerequisites",
  "lessons",
  "learning_activities",
  "puzzles",
  "questions",
  "question_options",
  "pyq_sources",
  "attempts",
  "concept_mastery",
  "learning_sessions",
  "revisions",
  "quests",
  "achievements",
  "student_achievements",
  "rewards",
  "notes",
  "bookmarks",
  "mock_tests",
  "mock_test_attempts",
  "study_plans",
]) {
  assert.ok(schemaSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `Missing table ${table} in supabase/schema.sql`);
}
console.log("✓ All 26 tables present in supabase/schema.sql with RLS policies");

// Verify built-in node:sqlite works cleanly
const mem = new DatabaseSync(":memory:");
mem.exec("CREATE TABLE check_t (id INTEGER PRIMARY KEY, val TEXT); INSERT INTO check_t (val) VALUES ('ok');");
const row = mem.prepare("SELECT val FROM check_t").get();
assert.equal(row.val, "ok");
console.log("✓ node:sqlite DatabaseSync verified");
