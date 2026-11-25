-- ============================================================================
-- THE CS JOURNEY — Complete PostgreSQL / Supabase Schema + Row Level Security
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  avatar_key TEXT NOT NULL DEFAULT 'explorer-1',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  coins INTEGER NOT NULL DEFAULT 50 CHECK (coins >= 0),
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  target_exam TEXT NOT NULL DEFAULT 'UGC NET JRF (Computer Science)',
  daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. KINGDOMS (The 10 UGC NET CS Units)
CREATE TABLE IF NOT EXISTS kingdoms (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  theme_color TEXT NOT NULL,
  illustration_key TEXT NOT NULL,
  map_x NUMERIC NOT NULL,
  map_y NUMERIC NOT NULL,
  unlock_xp INTEGER NOT NULL DEFAULT 0,
  syllabus_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. REGIONS
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 4. CHAPTERS
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  region_id TEXT REFERENCES regions(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  boss_title TEXT NOT NULL DEFAULT 'Chapter Guardian',
  estimated_minutes INTEGER NOT NULL DEFAULT 45,
  is_published BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. TOPICS
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtopics_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 6. CONCEPTS
CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'jrf')),
  simulator_type TEXT NOT NULL DEFAULT 'none',
  content_status TEXT NOT NULL DEFAULT 'authored' CHECK (content_status IN ('authored', 'draft', 'needs_verification')),
  estimated_minutes INTEGER NOT NULL DEFAULT 20,
  xp_reward INTEGER NOT NULL DEFAULT 60
);

-- 7. PREREQUISITES
CREATE TABLE IF NOT EXISTS prerequisites (
  concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  prerequisite_concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (concept_id, prerequisite_concept_id)
);

-- 8. LESSONS (8-stage structured content)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  concept_id TEXT NOT NULL UNIQUE REFERENCES concepts(id) ON DELETE CASCADE,
  discover_story TEXT NOT NULL,
  understand_intuition TEXT NOT NULL,
  formal_definition TEXT NOT NULL,
  visual_spec_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  examples_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  properties_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  edge_cases_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  applications_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  revision_summary TEXT NOT NULL
);

-- 9. LEARNING ACTIVITIES
CREATE TABLE IF NOT EXISTS learning_activities (
  id TEXT PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 10. PUZZLES
CREATE TABLE IF NOT EXISTS puzzles (
  id TEXT PRIMARY KEY,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  puzzle_type TEXT NOT NULL CHECK (puzzle_type IN ('sequence', 'pointer_trace', 'scheduling', 'sql_query', 'automata', 'logic_gate', 'code_debug')),
  difficulty TEXT NOT NULL DEFAULT 'medium',
  config_json JSONB NOT NULL,
  solution_json JSONB NOT NULL,
  hints_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  xp_reward INTEGER NOT NULL DEFAULT 40
);

-- 11. PYQ SOURCES
CREATE TABLE IF NOT EXISTS pyq_sources (
  id TEXT PRIMARY KEY,
  exam_name TEXT NOT NULL DEFAULT 'UGC NET CS',
  exam_year INTEGER NOT NULL,
  exam_session TEXT NOT NULL,
  paper TEXT NOT NULL DEFAULT 'Paper 2',
  verified BOOLEAN NOT NULL DEFAULT TRUE
);

-- 12. QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  kingdom_id TEXT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES chapters(id) ON DELETE SET NULL,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  pyq_source_id TEXT REFERENCES pyq_sources(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'jrf')),
  is_pyq BOOLEAN NOT NULL DEFAULT FALSE,
  xp_reward INTEGER NOT NULL DEFAULT 20
);

-- 13. QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- 14. ATTEMPTS
CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'puzzle', 'boss', 'code')),
  target_id TEXT NOT NULL,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_sec INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  submitted_answer_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CONCEPT MASTERY
CREATE TABLE IF NOT EXISTS concept_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  stages_completed_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  mastery_score NUMERIC NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  accuracy_pct NUMERIC NOT NULL DEFAULT 0,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'learning', 'practicing', 'mastered', 'needs_revision')),
  last_practiced_at TIMESTAMPTZ,
  UNIQUE (user_id, concept_id)
);

-- 16. LEARNING SESSIONS
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. REVISIONS (Spaced Repetition: 1, 3, 7, 14, 30 days)
CREATE TABLE IF NOT EXISTS revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  interval_days INTEGER NOT NULL DEFAULT 1,
  interval_step INTEGER NOT NULL DEFAULT 0,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  next_review_at TIMESTAMPTZ NOT NULL,
  last_reviewed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('due', 'completed', 'overdue')),
  UNIQUE (user_id, concept_id)
);

-- 18. QUESTS
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('daily', 'story', 'weekly')),
  metric_key TEXT NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  coin_reward INTEGER NOT NULL DEFAULT 15
);

-- 19. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  criteria_key TEXT NOT NULL
);

-- 20. STUDENT ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 21. REWARDS
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  title TEXT NOT NULL,
  xp_amount INTEGER NOT NULL DEFAULT 0,
  coins_amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. NOTES
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('concept', 'question', 'puzzle')),
  target_id TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id)
);

-- 24. MOCK TESTS
CREATE TABLE IF NOT EXISTS mock_tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 100,
  question_ids_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 25. MOCK TEST ATTEMPTS
CREATE TABLE IF NOT EXISTS mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mock_test_id TEXT NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  time_taken_sec INTEGER NOT NULL DEFAULT 0,
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. STUDY PLANS
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  title TEXT NOT NULL,
  kingdom_id TEXT REFERENCES kingdoms(id) ON DELETE SET NULL,
  concept_id TEXT REFERENCES concepts(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL DEFAULT 'concept',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mastery_user ON concept_mastery(user_id, status);
CREATE INDEX IF NOT EXISTS idx_revisions_user_due ON revisions(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON study_plans(user_id, scheduled_date);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read/write their own rows
CREATE POLICY "Own profile access" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Own attempts access" ON attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own mastery access" ON concept_mastery FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own sessions access" ON learning_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own revisions access" ON revisions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own achievements access" ON student_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own rewards access" ON rewards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own notes access" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own bookmarks access" ON bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own mock attempts access" ON mock_test_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own study plans access" ON study_plans FOR ALL USING (auth.uid() = user_id);
