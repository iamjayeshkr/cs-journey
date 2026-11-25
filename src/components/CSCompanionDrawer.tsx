"use client";

import React, { useState } from "react";
import { Send, X, HelpCircle } from "lucide-react";
import { Illustration } from "./IllustratedAssets";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function CSCompanionDrawer({
  open,
  onClose,
  conceptSlug,
}: {
  open: boolean;
  onClose: () => void;
  conceptSlug?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Namaste, Explorer! I am your **CS Mentor**. Ask me to explain any UGC NET concept, request a progressive hint for a puzzle (I won't spoil the answer!), or ask for a quick practice check.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [mood, setMood] = useState<"explaining" | "thinking" | "encouraging" | "confused">("explaining");

  if (!open) return null;

  const moodSrc =
    mood === "thinking"
      ? "/assets/companions/mentor-thinking.png"
      : mood === "encouraging"
      ? "/assets/companions/mentor-encouraging.png"
      : mood === "confused"
      ? "/assets/companions/mentor-confused.png"
      : "/assets/companions/mentor-explaining.png";

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    setMood("thinking");
    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          concept_slug: conceptSlug,
          hint_level: hintLevel,
        }),
      });
      const data = await res.json();
      if (data.mode === "progressive_hint") {
        setHintLevel((h) => Math.min(3, h + 1));
        setMood("encouraging");
      } else {
        setMood("explaining");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Let's reason through that step by step." },
      ]);
    } catch {
      setMood("confused");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Unable to reach the mentor desk right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-[1px]">
      <div className="w-full max-w-md bg-[#FAF4E8] border-l-2 border-ink/30 h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-ink/20 bg-parchment flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF4E8] border border-ink/30 flex items-center justify-center overflow-hidden">
              <Illustration src={moodSrc} alt="CS Mentor Companion" width={46} height={46} />
            </div>
            <div>
              <h3 className="font-hand text-2xl font-bold leading-none">CS Mentor</h3>
              <p className="text-xs text-ink-muted capitalize">
                {mood === "thinking" ? "Consulting scrolls..." : mood === "encouraging" ? "Guiding with hints" : "Ready to explain"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-ink/10"
            aria-label="Close CS Mentor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-ink text-ivory ml-8"
                  : "journal-parchment mr-6 text-ink"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="journal-parchment mr-12 p-3 rounded-md text-xs text-ink-muted italic">
              Consulting the study scrolls...
            </div>
          )}
        </div>

        <div className="p-3 border-t border-ink/20 bg-[#F2E6CF] space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => sendMessage("Explain this concept simply")}
              className="text-xs px-2.5 py-1 rounded bg-[#FAF4E8] border border-ink/20 hover:bg-parchment"
            >
              Explain simply
            </button>
            <button
              type="button"
              onClick={() => sendMessage("Give me a hint for the puzzle answer")}
              className="text-xs px-2.5 py-1 rounded bg-[#FAF4E8] border border-ink/20 hover:bg-parchment flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" /> Progressive Hint
            </button>
            <button
              type="button"
              onClick={() => sendMessage("Give me a practice question")}
              className="text-xs px-2.5 py-1 rounded bg-[#FAF4E8] border border-ink/20 hover:bg-parchment"
            >
              Practice Question
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a doubt or request a hint..."
              className="flex-1 px-3 py-2 text-sm rounded-md bg-[#FAF4E8] border border-ink/25 focus:outline-none focus:border-ink"
            />
            <button type="submit" disabled={loading} className="ink-btn px-3 py-2 rounded-md">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
