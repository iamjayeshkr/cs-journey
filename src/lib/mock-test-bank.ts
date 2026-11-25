import { KINGDOMS } from "./curriculum-data";
import { generateGoldmineQuestion, QUESTIONS_PER_KINGDOM } from "./question-goldmine";

export interface MockTestMeta {
  id: string;
  title: string;
  description: string;
  kingdom_id: string | null;
  category: "Full Syllabus" | "Unit Sprint" | "JRF Challenge" | "GATE / Placement";
  duration_minutes: number;
  total_marks: number;
  question_ids: string[];
}

// 520 deterministic Mock Tests:
// - 50 Full-Syllabus UGC NET Sprints (20 questions each = 40 marks)
// - 470 Unit-Specific / JRF / Placement Mock Tests (47 per unit * 10 units = 470, 10 questions each = 20 marks)
export const TOTAL_MOCK_TESTS = 520;

export function getMockTestById(id: string): MockTestMeta | null {
  if (id === "mock-full-01" || id === "mock-dsa-01") return null; // handled by SQLite
  const fullMatch = /^mock-gm-full-(\d+)$/.exec(id);
  if (fullMatch) {
    const idx = Number(fullMatch[1]);
    if (idx < 1 || idx > 50) return null;
    const qIds: string[] = [];
    for (let k = 0; k < KINGDOMS.length; k++) {
      qIds.push(`q-gm-${k}-${(idx * 7 + k) % QUESTIONS_PER_KINGDOM}`);
      qIds.push(`q-gm-${k}-${(idx * 13 + k + 5) % QUESTIONS_PER_KINGDOM}`);
    }
    return {
      id,
      title: `UGC NET Full-Syllabus Mock Test #${String(idx).padStart(3, "0")}`,
      description: "20-question cross-kingdom Paper 2 simulation covering all 10 official units.",
      kingdom_id: null,
      category: "Full Syllabus",
      duration_minutes: 25,
      total_marks: 40,
      question_ids: qIds,
    };
  }

  const unitMatch = /^mock-gm-u(\d+)-(\d+)$/.exec(id);
  if (unitMatch) {
    const kIdx = Number(unitMatch[1]);
    const idx = Number(unitMatch[2]);
    if (kIdx < 0 || kIdx >= KINGDOMS.length || idx < 1 || idx > 47) return null;
    const k = KINGDOMS[kIdx];
    const isJrf = idx % 3 === 0;
    const isPlacement = idx % 5 === 0;
    const category: MockTestMeta["category"] = isJrf
      ? "JRF Challenge"
      : isPlacement
      ? "GATE / Placement"
      : "Unit Sprint";
    const qIds: string[] = [];
    for (let j = 0; j < 10; j++) {
      qIds.push(`q-gm-${kIdx}-${(idx * 11 + j * 3) % QUESTIONS_PER_KINGDOM}`);
    }
    return {
      id,
      title: `Unit ${k.order_index}: ${k.title} — ${category} #${idx}`,
      description: `Focused 10-question ${category.toLowerCase()} for ${k.title}.`,
      kingdom_id: k.id,
      category,
      duration_minutes: 12,
      total_marks: 20,
      question_ids: qIds,
    };
  }

  return null;
}

export function listMockTests({
  category = "all",
  kingdomId = "all",
  page = 1,
  limit = 18,
}: {
  category?: string;
  kingdomId?: string;
  page?: number;
  limit?: number;
}) {
  const all: MockTestMeta[] = [];
  for (let i = 1; i <= 50; i++) {
    const m = getMockTestById(`mock-gm-full-${i}`)!;
    all.push(m);
  }
  for (let k = 0; k < KINGDOMS.length; k++) {
    for (let i = 1; i <= 47; i++) {
      const m = getMockTestById(`mock-gm-u${k}-${i}`)!;
      all.push(m);
    }
  }

  const filtered = all.filter((m) => {
    if (category !== "all" && m.category !== category) return false;
    if (kingdomId !== "all" && m.kingdom_id !== kingdomId) return false;
    return true;
  });

  const start = Math.max(0, (page - 1) * limit);
  return {
    total: filtered.length,
    items: filtered.slice(start, start + limit),
  };
}

export function getQuestionsForMockIds(qIds: string[]) {
  return qIds
    .map((qid) => {
      const m = /^q-gm-(\d+)-(\d+)$/.exec(qid);
      if (!m) return null;
      return generateGoldmineQuestion(Number(m[1]), Number(m[2]));
    })
    .filter(Boolean);
}
