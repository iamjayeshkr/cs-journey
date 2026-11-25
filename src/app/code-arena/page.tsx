"use client";

import React, { useEffect, useState } from "react";
import { Code2, Play, RotateCcw, Sparkles } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { CodeBlock } from "@/components/CodeBlock";

const CHALLENGES = [
  {
    id: "two-sum",
    category: "Basics",
    title: "Two Sum (Hash Map — O(n))",
    description: "Write `solve(nums, target)` returning indices `[i, j]` of two numbers adding up to `target`.",
    starter: `function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], spread: true },
      { input: [[3, 2, 4], 6], expected: [1, 2], spread: true },
    ],
  },
  {
    id: "valid-parens",
    category: "Stack",
    title: "Valid Parentheses (Stack)",
    description: "Write `solve(s)` returning `true` if brackets `()[]{}` are balanced, else `false`.",
    starter: `function solve(s) {\n  const st = [];\n  const match = { ")": "(", "]": "[", "}": "{" };\n  for (const ch of s) {\n    if (ch === "(" || ch === "[" || ch === "{") st.push(ch);\n    else if (st.pop() !== match[ch]) return false;\n  }\n  return st.length === 0;\n}`,
    tests: [
      { input: "({[]})", expected: true },
      { input: "([)]", expected: false },
    ],
  },
  {
    id: "binary-search",
    category: "Searching",
    title: "Binary Search — O(log n)",
    description: "Write `solve(arr, target)` returning index of `target` in sorted array, or `-1`.",
    starter: `function solve(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}`,
    tests: [
      { input: [[2, 5, 8, 12, 16], 12], expected: 3, spread: true },
      { input: [[2, 5, 8, 12, 16], 7], expected: -1, spread: true },
    ],
  },
  {
    id: "bst-validate",
    category: "Trees",
    title: "Validate Binary Search Tree (Inorder)",
    description: "Given level/array inorder values `arr`, write `solve(arr)` returning `true` if strictly increasing (valid BST).",
    starter: `function solve(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] <= arr[i - 1]) return false;\n  }\n  return true;\n}`,
    tests: [
      { input: [2, 5, 9, 14], expected: true },
      { input: [2, 8, 5, 14], expected: false },
    ],
  },
  {
    id: "graph-bfs",
    category: "Graphs",
    title: "Graph BFS Shortest Hop Count",
    description: "Write `solve(adj, start, target)` returning shortest edge count in unweighted graph `adj` (object of arrays), or `-1`.",
    starter: `function solve(adj, start, target) {\n  const q = [[start, 0]];\n  const vis = new Set([start]);\n  while (q.length) {\n    const [u, d] = q.shift();\n    if (u === target) return d;\n    for (const v of (adj[u] || [])) {\n      if (!vis.has(v)) { vis.add(v); q.push([v, d + 1]); }\n    }\n  }\n  return -1;\n}`,
    tests: [
      { input: [{ 0: [1, 2], 1: [3], 2: [3], 3: [4] }, 0, 4], expected: 3, spread: true },
      { input: [{ 0: [1], 1: [], 2: [] }, 0, 2], expected: -1, spread: true },
    ],
  },
  {
    id: "dp-knapsack",
    category: "Dynamic Programming",
    title: "0/1 Knapsack Maximum Value (DP)",
    description: "Write `solve(weights, values, cap)` returning max value achievable within capacity `cap`.",
    starter: `function solve(weights, values, cap) {\n  const dp = new Array(cap + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    for (let w = cap; w >= weights[i]; w--) {\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  return dp[cap];\n}`,
    tests: [
      { input: [[1, 3, 4], [15, 20, 30], 4], expected: 35, spread: true },
      { input: [[2, 3, 5], [10, 20, 30], 5], expected: 30, spread: true },
    ],
  },
  {
    id: "dp-lcs",
    category: "Dynamic Programming",
    title: "Longest Common Subsequence (LCS)",
    description: "Write `solve(a, b)` returning length of the longest common subsequence of strings `a` and `b`.",
    starter: `function solve(a, b) {\n  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));\n  for (let i = 1; i <= a.length; i++) {\n    for (let j = 1; j <= b.length; j++) {\n      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[a.length][b.length];\n}`,
    tests: [
      { input: ["abcde", "ace"], expected: 3, spread: true },
      { input: ["abc", "def"], expected: 0, spread: true },
    ],
  },
  {
    id: "trie-prefix",
    category: "Tries",
    title: "Trie Insert & Prefix Search",
    description: "Write `solve(words, prefix)` building a Trie and returning count of words starting with `prefix`.",
    starter: `function solve(words, prefix) {\n  const root = {};\n  for (const w of words) {\n    let node = root;\n    for (const ch of w) {\n      node[ch] = node[ch] || { _cnt: 0 };\n      node = node[ch];\n      node._cnt++;\n    }\n  }\n  let cur = root;\n  for (const ch of prefix) {\n    if (!cur[ch]) return 0;\n    cur = cur[ch];\n  }\n  return cur._cnt || 0;\n}`,
    tests: [
      { input: [["net", "network", "node", "neural"], "ne"], expected: 3, spread: true },
      { input: [["tree", "trie"], "tr"], expected: 2, spread: true },
    ],
  },
];

const SYNTAX_SNIPPETS = [
  { label: "+ for loop", snippet: "\nfor (let i = 0; i < arr.length; i++) {\n  \n}" },
  { label: "+ HashMap", snippet: "\nconst map = new Map();" },
  { label: "+ DP Array", snippet: "\nconst dp = new Array(n + 1).fill(0);" },
  { label: "+ BFS Queue", snippet: "\nconst q = [start];\nconst vis = new Set([start]);" },
  { label: "+ Trie Node", snippet: "\nconst root = {};" },
];

export default function CodeArenaPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const challenge = CHALLENGES[selectedIdx];
  const [code, setCode] = useState(challenge.starter);
  const [output, setOutput] = useState<Array<{ passed: boolean; detail: string }>>([]);
  const [error, setError] = useState("");
  const [showSyntaxPreview, setShowSyntaxPreview] = useState(false);

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
        const actual = (t as { spread?: boolean }).spread ? fn(...(t.input as unknown[])) : fn(t.input);
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
            <Code2 className="w-7 h-7 text-terracotta" /> Code Arena — Basics to DP, Graphs & Tries
          </h1>
          <p className="text-sm text-ink-muted">
            Practice core programming, Stacks, Trees, Graphs, Dynamic Programming & Tries with syntax helpers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => switchChallenge(idx)}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                selectedIdx === idx ? "ink-btn" : "parchment-btn"
              }`}
            >
              <span className="opacity-70 mr-1">[{c.category}]</span>
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 journal-card p-5 space-y-3">
            <span className="text-[11px] font-bold uppercase text-terracotta">{challenge.category}</span>
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
            {/* Syntax Helper Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink/15">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-ink-muted flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-terracotta" /> Syntax Helper:
                </span>
                {SYNTAX_SNIPPETS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setCode((c) => c + s.snippet)}
                    className="px-2 py-0.5 rounded bg-parchment border border-ink/20 text-[11px] font-mono hover:bg-parchment/80"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowSyntaxPreview(!showSyntaxPreview)}
                className="text-[11px] font-semibold text-terracotta hover:underline"
              >
                {showSyntaxPreview ? "Edit Mode" : "Syntax Highlight View"}
              </button>
            </div>

            {showSyntaxPreview ? (
              <CodeBlock code={code} title={`${challenge.title} (Highlighted)`} />
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full p-3.5 rounded bg-[#241B14] text-[#F5EBD8] font-mono text-xs leading-6 focus:outline-none border-2 border-ink/30"
              />
            )}

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
