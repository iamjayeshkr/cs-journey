import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { concept_title, explanation, keywords = [] } = await req.json();
  const text = String(explanation || "").trim();
  if (text.length < 10) {
    return NextResponse.json({
      understood: false,
      feedback: "Please write at least a couple of sentences explaining the concept in your own words.",
      follow_up: "How would you describe what this concept does to a friend who has never coded?",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `You are a Computer Science professor verifying whether a student genuinely understands "${concept_title}".
Student's Feynman explanation: "${text}"

Respond strictly as JSON with keys:
- "understood": boolean (true if the student demonstrates genuine conceptual grasp, false if superficial or inaccurate)
- "feedback": string (2 concise sentences praising what is accurate and pointing out any missing or wrong idea)
- "follow_up": string (1 targeted Socratic follow-up question to deepen their reasoning)`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          return NextResponse.json({
            understood: Boolean(parsed.understood),
            feedback: String(parsed.feedback || ""),
            follow_up: String(parsed.follow_up || ""),
            verified_by: "gemini",
          });
        }
      }
    } catch {
      // Fall through to deterministic check
    }
  }

  // Deterministic fallback
  const lower = text.toLowerCase();
  const matched = (keywords as string[]).filter((k) => lower.includes(k.toLowerCase()));
  const missing = (keywords as string[]).filter((k) => !lower.includes(k.toLowerCase()));
  return NextResponse.json({
    understood: missing.length <= 1 && matched.length >= 2,
    feedback:
      missing.length === 0
        ? `Strong Feynman explanation! You covered all key ideas (${matched.join(", ")}).`
        : `Good start (${matched.join(", ") || "core idea"}). Try also explaining: ${missing.join(", ")}.`,
    follow_up: "What happens at the boundary or edge case for this concept?",
    verified_by: "local",
  });
}
