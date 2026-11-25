import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { message, concept_slug, hint_level = 1 } = await req.json();
  const prompt = String(message || "").trim();
  if (!prompt) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const db = getDb();
  const lower = prompt.toLowerCase();

  let conceptContext:
    | {
        title: string;
        understand_intuition: string;
        formal_definition: string;
        revision_summary: string;
        level_1_beginner?: string;
        level_4_jrf?: string;
      }
    | undefined;

  if (concept_slug) {
    conceptContext = db
      .prepare(
        `SELECT c.title, l.understand_intuition, l.formal_definition, l.revision_summary, l.level_1_beginner, l.level_4_jrf
         FROM concepts c JOIN lessons l ON l.concept_id = c.id
         WHERE c.slug = ? OR c.id = ?`
      )
      .get(concept_slug, concept_slug) as typeof conceptContext;
  }

  const isAskingForAnswer =
    lower.includes("answer") || lower.includes("solution") || lower.includes("solve it") || lower.includes("give me the");

  // Try Gemini Mentoring API first
  const systemPrompt = `You are "CS Mentor", a warm, rigorous Computer Science professor and UGC NET/JRF tutor inside The CS Journey.
Rules:
1. NEVER immediately give away puzzle or MCQ answers when asked for "the answer" or "solution". Instead give Progressive Hint #${hint_level} (1 = gentle guiding question, 2 = structural clue, 3 = near-solution check without spoiling).
2. Explain from first principles using simple analogies before formal notation.
3. Keep responses concise (under 180 words), clear, and encouraging.
${
  conceptContext
    ? `Current Concept: ${conceptContext.title}
Beginner Intuition: ${conceptContext.level_1_beginner || conceptContext.understand_intuition}
Formal Core: ${conceptContext.formal_definition}
JRF Depth: ${conceptContext.level_4_jrf || conceptContext.revision_summary}`
    : ""
}`;

  const geminiReply = await callGemini(systemPrompt, prompt);
  if (geminiReply) {
    return NextResponse.json({
      reply: geminiReply,
      mode: isAskingForAnswer ? "progressive_hint" : "gemini_mentor",
      powered_by: "gemini",
    });
  }

  // Deterministic curriculum fallback
  if (isAskingForAnswer) {
    const hints = [
      "Hint 1 (Guiding Question): Identify what state or pointer changes in the very first step. Which node or process is affected first?",
      "Hint 2 (Structural Clue): Trace the invariant! In a linked list, always link `newNode.next` before changing `prev.next`. In scheduling, check arrival times before burst times.",
      "Hint 3 (Near-Solution): Check boundary conditions (empty input, last element, or tie-breaking) to eliminate the remaining distractor.",
    ];
    const idx = Math.min(hints.length - 1, Math.max(0, Number(hint_level) - 1));
    return NextResponse.json({
      reply: `I won't spoil the puzzle by giving the final answer right away!\n\n**${hints[idx]}**`,
      mode: "progressive_hint",
    });
  }

  if (conceptContext) {
    return NextResponse.json({
      reply: `Let's unpack **${conceptContext.title}** together:\n\n**Intuition:** ${conceptContext.understand_intuition}\n\n**Formal Core:** ${conceptContext.formal_definition}\n\n**Quick Takeaway:** ${conceptContext.revision_summary}`,
      mode: "explanation",
    });
  }

  return NextResponse.json({
    reply:
      "I am your **CS Mentor**! Ask me to explain any UGC NET CS concept, request a progressive hint on a puzzle, or ask for a practice check.",
    mode: "general",
  });
}
