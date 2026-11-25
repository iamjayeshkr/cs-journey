import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  const { message, concept_slug, hint_level = 1 } = await req.json();
  const prompt = String(message || "").trim();
  if (!prompt) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const db = getDb();
  const lower = prompt.toLowerCase();

  // Check if user is asking for a puzzle answer directly -> enforce progressive hints!
  if (lower.includes("answer") || lower.includes("solution") || lower.includes("solve it") || lower.includes("give me the")) {
    const hints = [
      "Hint 1 (Guiding Question): Before looking for the final answer, identify what state or pointer changes in the very first step. Which node or process is affected first?",
      "Hint 2 (Structural Clue): Trace the invariant! In a linked list, always link the new node's `next` before changing the previous node's `next`. In scheduling, check arrival times before burst times.",
      "Hint 3 (Near-Solution): Narrow it down to the remaining two choices by checking boundary conditions (empty input, last element, or tie-breaking). Try submitting your reasoning and I'll verify it!",
    ];
    const idx = Math.min(hints.length - 1, Math.max(0, Number(hint_level) - 1));
    return NextResponse.json({
      reply: `I won't spoil the puzzle by giving the final answer right away — real mastery comes from your own reasoning!\n\n**${hints[idx]}**\n\n*(Ask for another hint if you're still stuck, or tell me what step you're trying.)*`,
      mode: "progressive_hint",
    });
  }

  // Context-aware lookup from curriculum DB
  let conceptContext: { title: string; understand_intuition: string; formal_definition: string; revision_summary: string } | undefined;
  if (concept_slug) {
    conceptContext = db
      .prepare(
        `SELECT c.title, l.understand_intuition, l.formal_definition, l.revision_summary
         FROM concepts c JOIN lessons l ON l.concept_id = c.id
         WHERE c.slug = ? OR c.id = ?`
      )
      .get(concept_slug, concept_slug) as typeof conceptContext;
  }

  if (!conceptContext) {
    const keyword = lower.split(/\s+/).find((w) => w.length >= 3) || "linked";
    conceptContext = db
      .prepare(
        `SELECT c.title, l.understand_intuition, l.formal_definition, l.revision_summary
         FROM concepts c JOIN lessons l ON l.concept_id = c.id
         WHERE lower(c.title) LIKE ? OR lower(l.understand_intuition) LIKE ?
         LIMIT 1`
      )
      .get(`%${keyword}%`, `%${keyword}%`) as typeof conceptContext;
  }

  // Generate practice question if requested
  if (lower.includes("practice") || lower.includes("question") || lower.includes("quiz") || lower.includes("mcq")) {
    const q = db
      .prepare("SELECT prompt, explanation FROM questions ORDER BY RANDOM() LIMIT 1")
      .get() as { prompt: string; explanation: string } | undefined;
    if (q) {
      return NextResponse.json({
        reply: `Here is a UGC NET style check for you:\n\n**Question:** ${q.prompt}\n\nThink through the time/space or theoretical trade-off first! Tell me your reasoning or head to the **Practice Arena** to test yourself.`,
        mode: "practice_prompt",
      });
    }
  }

  if (conceptContext) {
    return NextResponse.json({
      reply: `Let's unpack **${conceptContext.title}** together:\n\n**Intuition:** ${conceptContext.understand_intuition}\n\n**Formal Core:** ${conceptContext.formal_definition}\n\n**Quick Takeaway:** ${conceptContext.revision_summary}\n\nWould you like a step-by-step example, a common UGC NET trap on this topic, or a practice question?`,
      mode: "explanation",
    });
  }

  return NextResponse.json({
    reply:
      "I am your **CS Mentor**! Ask me to explain any UGC NET CS concept (like Linked Lists, CPU Scheduling, BCNF, DFA, Pipelining, TCP Congestion Control, or A* Search), ask for a progressive hint on a puzzle, or request a practice question.",
    mode: "general",
  });
}
