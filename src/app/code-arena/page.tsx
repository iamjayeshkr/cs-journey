"use client";

import React, { useEffect, useState } from "react";
import { Code2, Play, RotateCcw } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";

const CHALLENGES = [
  {
    id: "reverse-array-list",
    title: "Reverse a Linked List Array Representation",
    description: "Write `solve(arr)` that returns the reversed array in O(n) time without using `.reverse()`.",
    starter: `function solve(arr) {\n  const out = [];\n  for (let i = arr.length - 1; i >= 0; i--) {\n    out.push(arr[i]);\n  }\n  return out;\n}`,
    tests: [
      { input: [10, 20, 30, 40], expected: [40, 30, 20, 10] },
      { input: [1, 2], expected: [2, 1] },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search — O(log n)",
    description: "Write `solve(arr, target)` returning the index of `target` in a sorted array, or `-1` if absent.",
    starter: `function solve(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}`,
    tests: [
      { input: [[2, 5, 8, 12, 16], 12], expected: 3, spread: true },
      { input: [[2, 5, 8, 12, 16], 7], expected: -1, spread: true },
    ],
  },
];

export default function CodeArenaPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const challenge = CHALLENGES[selectedIdx];
  const [code, setCode] = useState(challenge.starter);
  const [output, setOutput] = useState<Array<{ passed: boolean; detail: string }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user ?? null));
  }, []);

  function switchChallenge(idx: number) {
    setSelectedIdx(idx);
    setCode(CHALLENGES[idx].starter);
    setOutput([]);
    setError("");
  }

  function runTests() {
    setError("");
    try {
      const fn = new Function(`${code}; return solve;`)();
      const results = challenge.tests.map((t, i) => {
        const actual = (t as { spread?: boolean }).spread
          ? fn(...(t.input as unknown[]))
          : fn(t.input);
        const passed = JSON.stringify(actual) === JSON.stringify(t.expected);
        return {
          passed,
          detail: `Test ${i + 1}: expected ${JSON.stringify(t.expected)}, got ${JSON.stringify(actual)}`,
        };
      });
      setOutput(results);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold flex items-center gap-2">
            <Code2 className="w-7 h-7 text-terracotta" /> Code Arena
          </h1>
          <p className="text-sm text-ink-muted">Write, run, and verify core CS algorithms live.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => switchChallenge(idx)}
              className={`px-3.5 py-2 rounded text-xs font-semibold ${
                selectedIdx === idx ? "ink-btn" : "parchment-btn"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 journal-card p-5 space-y-3">
            <h2 className="font-hand text-2xl font-bold">{challenge.title}</h2>
            <p className="font-serif text-sm text-ink-muted">{challenge.description}</p>
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase text-ink-muted">Test Output</p>
              {error && <p className="text-xs font-mono text-terracotta bg-terracotta/10 p-2 rounded">{error}</p>}
              {output.map((o, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded text-xs font-mono border ${
                    o.passed ? "bg-forest/15 border-forest" : "bg-terracotta/15 border-terracotta"
                  }`}
                >
                  {o.passed ? "✓ PASS — " : "✗ FAIL — "}
                  {o.detail}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 journal-card p-4 space-y-3">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full p-3 rounded bg-[#2B2118] text-[#F5EBD8] font-mono text-xs leading-relaxed focus:outline-none"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCode(challenge.starter)}
                className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Code
              </button>
              <button
                type="button"
                onClick={runTests}
                className="forest-btn px-5 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Run & Verify Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
