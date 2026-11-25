import { getDb } from "./db";

export interface UnitCoverage {
  kingdom_id: string;
  order_index: number;
  title: string;
  slug: string;
  chapters_total: number;
  chapters_with_concepts: number;
  subtopics_total: number;
  concepts_authored: number;
  concepts_outline: number;
  coverage_pct: number;
  missing_chapters: string[];
}

export function computeCurriculumCoverage() {
  const db = getDb();
  const kingdoms = db.prepare("SELECT id, order_index, title, slug FROM kingdoms ORDER BY order_index ASC").all() as Array<{
    id: string;
    order_index: number;
    title: string;
    slug: string;
  }>;
  const chapters = db.prepare("SELECT id, kingdom_id, title FROM chapters").all() as Array<{
    id: string;
    kingdom_id: string;
    title: string;
  }>;
  const topics = db.prepare("SELECT chapter_id, subtopics_json FROM topics").all() as Array<{
    chapter_id: string;
    subtopics_json: string;
  }>;
  const concepts = db.prepare("SELECT id, chapter_id, content_status FROM concepts").all() as Array<{
    id: string;
    chapter_id: string;
    content_status: string;
  }>;

  const units: UnitCoverage[] = kingdoms.map((k) => {
    const kChapters = chapters.filter((c) => c.kingdom_id === k.id);
    const kChapterIds = new Set(kChapters.map((c) => c.id));
    const kTopics = topics.filter((t) => kChapterIds.has(t.chapter_id));
    const subtopicsTotal = kTopics.reduce((acc, t) => acc + JSON.parse(t.subtopics_json || "[]").length, 0);

    const kConcepts = concepts.filter((c) => kChapterIds.has(c.chapter_id));
    const authored = kConcepts.filter((c) => c.content_status === "authored").length;
    const outline = kConcepts.length - authored;

    const chaptersWithConcepts = kChapters.filter((ch) => kConcepts.some((c) => c.chapter_id === ch.id)).length;
    const missingChapters = kChapters
      .filter((ch) => !kConcepts.some((c) => c.chapter_id === ch.id && c.content_status === "authored"))
      .map((ch) => ch.title);

    const coveragePct = Math.round((chaptersWithConcepts / Math.max(kChapters.length, 1)) * 100);

    return {
      kingdom_id: k.id,
      order_index: k.order_index,
      title: k.title,
      slug: k.slug,
      chapters_total: kChapters.length,
      chapters_with_concepts: chaptersWithConcepts,
      subtopics_total: subtopicsTotal,
      concepts_authored: authored,
      concepts_outline: outline,
      coverage_pct: coveragePct,
      missing_chapters: missingChapters,
    };
  });

  const totals = {
    units: units.length,
    chapters: chapters.length,
    subtopics: units.reduce((a, u) => a + u.subtopics_total, 0),
    concepts_authored: units.reduce((a, u) => a + u.concepts_authored, 0),
    chapters_covered: units.reduce((a, u) => a + u.chapters_with_concepts, 0),
  };

  return { units, totals };
}
