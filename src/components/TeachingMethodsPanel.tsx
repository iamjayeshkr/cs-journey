"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, GitCompare, HelpCircle, MessageSquare, Sparkles } from "lucide-react";

export interface TeachingMethodsData {
  feynman_prompt?: string;
  feynman_keywords?: string[];
  socratic_questions?: Array<{ question: string; hint: string; answer: string }>;
  faded_example?: {
    title: string;
    steps: Array<{ prompt: string; blank: string; hint: string }>;
  };
  prediction_challenge?: {
    scenario: string;
    options: string[];
    correct: string;
    explanation: string;
  };
  compare_contrast?: {
    leftTitle: string;
    rightTitle: string;
    rows: [string, string, string][];
  };
  error_analysis?: {
    buggyClaim: string;
    whyPlausible: string;
    correction: string;
  };
}

export function TeachingMethodsPanel({
  methods,
  conceptTitle = "this concept",
}: {
  methods: TeachingMethodsData;
  conceptTitle?: string;
}) {
  const [tab, setTab] = useState<"feynman" | "socratic" | "faded" | "predict" | "compare" | "error">("feynman");

  // Feynman state
  const [feynmanText, setFeynmanText] = useState("");
  const [feynmanChecking, setFeynmanChecking] = useState(false);
  const [feynmanResult, setFeynmanResult] = useState<{
    understood: boolean;
    feedback: string;
    follow_up?: string;
    verified_by?: string;
  } | null>(null);

  // Socratic state
  const [socraticIdx, setSocraticIdx] = useState(0);
  const [showSocraticHint, setShowSocraticHint] = useState(false);
  const [showSocraticAns, setShowSocraticAns] = useState(false);

  // Faded example state
  const [fadedInputs, setFadedInputs] = useState<Record<number, string>>({});
  const [fadedChecked, setFadedChecked] = useState(false);

  // Prediction state
  const [predChoice, setPredChoice] = useState("");
  const [predSubmitted, setPredSubmitted] = useState(false);

  // Error analysis state
  const [showCorrection, setShowCorrection] = useState(false);

  if (!methods || Object.keys(methods).length === 0) return null;

  async function evaluateFeynman() {
    if (feynmanText.trim().length < 10) {
      setFeynmanResult({
        understood: false,
        feedback: "Write at least a couple of sentences in your own words so we can verify your understanding!",
      });
      return;
    }
    setFeynmanChecking(true);
    try {
      const res = await fetch("/api/verify-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept_title: conceptTitle,
          explanation: feynmanText,
          keywords: methods.feynman_keywords || [],
        }),
      });
      if (res.ok) {
        setFeynmanResult(await res.json());
      }
    } finally {
      setFeynmanChecking(false);
    }
  }

  return (
    <div className="journal-card p-5 space-y-4">
      <div>
        <span className="text-[11px] font-bold uppercase text-terracotta">Active Learning Studio</span>
        <h3 className="font-hand text-3xl font-bold leading-none mt-0.5">
          Interactive Teaching Methods
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          { id: "feynman", label: "Feynman Teach-Back", icon: MessageSquare },
          { id: "socratic", label: "Socratic Guide", icon: HelpCircle },
          { id: "faded", label: "Faded Example", icon: Sparkles },
          { id: "predict", label: "Predict Outcome", icon: CheckCircle2 },
          { id: "compare", label: "Compare & Contrast", icon: GitCompare },
          { id: "error", label: "Error Analysis", icon: AlertTriangle },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 ${
                tab === t.id ? "ink-btn" : "parchment-btn"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Feynman Technique */}
      {tab === "feynman" && methods.feynman_prompt && (
        <div className="p-4 rounded bg-ivory border border-ink/20 space-y-3">
          <p className="text-sm font-semibold">{methods.feynman_prompt}</p>
          <textarea
            rows={3}
            value={feynmanText}
            onChange={(e) => setFeynmanText(e.target.value)}
            placeholder="Explain this concept as if teaching a 12-year-old..."
            className="w-full p-2.5 text-xs rounded journal-ruled border border-ink/25"
          />
          <button type="button" disabled={feynmanChecking} onClick={evaluateFeynman} className="forest-btn px-4 py-1.5 rounded text-xs font-semibold">
            {feynmanChecking ? "Verifying with AI Mentor..." : "Verify My Understanding"}
          </button>
          {feynmanResult && (
            <div className={`text-xs p-3 rounded border space-y-1 ${feynmanResult.understood ? "bg-forest/15 border-forest" : "bg-parchment/80 border-ink/25"}`}>
              <p className="font-semibold">{feynmanResult.feedback}</p>
              {feynmanResult.follow_up && (
                <p className="text-ink-muted italic">Follow-up: {feynmanResult.follow_up}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Socratic Questioning */}
      {tab === "socratic" && methods.socratic_questions && methods.socratic_questions.length > 0 && (
        <div className="p-4 rounded bg-ivory border border-ink/20 space-y-3">
          <p className="text-xs font-bold text-ink-muted">
            Question {socraticIdx + 1} of {methods.socratic_questions.length}
          </p>
          <p className="text-sm font-semibold">{methods.socratic_questions[socraticIdx].question}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowSocraticHint(true)} className="parchment-btn px-3 py-1 rounded text-xs font-semibold">
              Reveal Hint
            </button>
            <button type="button" onClick={() => setShowSocraticAns(true)} className="terracotta-btn px-3 py-1 rounded text-xs font-semibold">
              Reveal Reasoning
            </button>
            {methods.socratic_questions.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setSocraticIdx((i) => (i + 1) % methods.socratic_questions!.length);
                  setShowSocraticHint(false);
                  setShowSocraticAns(false);
                }}
                className="ink-btn px-3 py-1 rounded text-xs font-semibold"
              >
                Next Question →
              </button>
            )}
          </div>
          {showSocraticHint && (
            <p className="text-xs sticky-note p-2.5 rounded">Hint: {methods.socratic_questions[socraticIdx].hint}</p>
          )}
          {showSocraticAns && (
            <p className="text-xs bg-forest/15 border border-forest p-2.5 rounded">
              {methods.socratic_questions[socraticIdx].answer}
            </p>
          )}
        </div>
      )}

      {/* 3. Faded Example */}
      {tab === "faded" && methods.faded_example && (
        <div className="p-4 rounded bg-ivory border border-ink/20 space-y-3">
          <h4 className="text-sm font-bold">{methods.faded_example.title}</h4>
          <div className="space-y-2.5">
            {methods.faded_example.steps.map((st, i) => (
              <div key={i} className="p-2.5 rounded bg-[#FAF4E8] border border-ink/15 space-y-1.5">
                <p className="text-xs font-medium">{st.prompt}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={fadedInputs[i] || ""}
                    onChange={(e) => setFadedInputs((p) => ({ ...p, [i]: e.target.value }))}
                    placeholder={`Hint: ${st.hint}`}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-ivory border border-ink/25 flex-1 min-w-[160px]"
                  />
                  {fadedChecked && (
                    <span className="text-xs font-mono font-bold text-forest">Expected: {st.blank}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setFadedChecked(true)} className="terracotta-btn px-4 py-1.5 rounded text-xs font-semibold">
            Verify Steps
          </button>
        </div>
      )}

      {/* 4. Prediction-Based Learning */}
      {tab === "predict" && methods.prediction_challenge && (
        <div className="p-4 rounded bg-ivory border border-ink/20 space-y-3">
          <p className="text-sm font-semibold">{methods.prediction_challenge.scenario}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {methods.prediction_challenge.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPredChoice(opt)}
                className={`p-2.5 rounded border text-xs text-left ${
                  predChoice === opt ? "bg-ink text-ivory border-ink" : "bg-[#FAF4E8] border-ink/20"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setPredSubmitted(true)} className="forest-btn px-4 py-1.5 rounded text-xs font-semibold">
            Lock Prediction & Reveal
          </button>
          {predSubmitted && (
            <div className={`p-3 rounded text-xs ${predChoice === methods.prediction_challenge.correct ? "bg-forest/15 border border-forest" : "bg-terracotta/15 border border-terracotta"}`}>
              <p className="font-bold">
                {predChoice === methods.prediction_challenge.correct ? "Spot on!" : `Correct Answer: ${methods.prediction_challenge.correct}`}
              </p>
              <p className="mt-1">{methods.prediction_challenge.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* 5. Compare & Contrast */}
      {tab === "compare" && methods.compare_contrast && (
        <div className="p-4 rounded bg-ivory border border-ink/20 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-ink/25">
                <th className="py-1.5 pr-3">Dimension</th>
                <th className="py-1.5 pr-3 text-forest">{methods.compare_contrast.leftTitle}</th>
                <th className="py-1.5 text-terracotta">{methods.compare_contrast.rightTitle}</th>
              </tr>
            </thead>
            <tbody>
              {methods.compare_contrast.rows.map((r, i) => (
                <tr key={i} className="border-b border-ink/10">
                  <td className="py-2 pr-3 font-semibold">{r[0]}</td>
                  <td className="py-2 pr-3">{r[1]}</td>
                  <td className="py-2">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Error Analysis */}
      {tab === "error" && methods.error_analysis && (
        <div className="p-4 rounded bg-ivory border border-ink/20 space-y-2.5">
          <p className="text-xs font-bold uppercase text-terracotta">Common Misconception to Diagnose</p>
          <p className="text-sm font-serif italic">&ldquo;{methods.error_analysis.buggyClaim}&rdquo;</p>
          <p className="text-xs text-ink-muted">
            <strong>Why it seems plausible:</strong> {methods.error_analysis.whyPlausible}
          </p>
          <button type="button" onClick={() => setShowCorrection(!showCorrection)} className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold">
            {showCorrection ? "Hide Correction" : "Reveal Rigorous Correction"}
          </button>
          {showCorrection && (
            <p className="text-xs bg-forest/15 border border-forest p-3 rounded font-medium">
              {methods.error_analysis.correction}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
