export type CodingLanguage = "javascript" | "python" | "cpp" | "java";

export interface CodingChapter {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  kingdomKey: string;
  problemCount: number;
  topics: string[];
}

export interface CodingProblem {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  runnableJs?: {
    starter: string;
    tests: { input: unknown; expected: unknown; spread?: boolean }[];
  };
  starters: Record<CodingLanguage, string>;
}

export const CODING_CHAPTERS: CodingChapter[] = [
  { id: "cc-if-else", order: 1, title: "Basics, I/O & If-Else", subtitle: "Conditionals, Operators & Branching", kingdomKey: "k3-prog", problemCount: 60, topics: ["Even/Odd", "Leap Year", "Grade Logic", "Bitwise Flags"] },
  { id: "cc-loops", order: 2, title: "Loops & Pattern Logic", subtitle: "For, While, Digits & Number Theory", kingdomKey: "k1-discrete", problemCount: 65, topics: ["Prime Check", "Reverse Digits", "Armstrong", "GCD/LCM"] },
  { id: "cc-recursion", order: 3, title: "Functions & Recursion", subtitle: "Call Stack, Base Cases & Backtracking", kingdomKey: "k8-toc", problemCount: 70, topics: ["Factorial", "Fibonacci", "Power(x,n)", "Subsets"] },
  { id: "cc-arrays", order: 4, title: "1D Arrays & Prefix Sums", subtitle: "Two Pointers, Sliding Window & Kadane", kingdomKey: "k7-dsa", problemCount: 80, topics: ["Two Sum", "Max Subarray", "Rotate Array", "Prefix Sum"] },
  { id: "cc-2d-strings", order: 5, title: "2D Arrays & Strings", subtitle: "Matrices, Palindromes & Anagrams", kingdomKey: "k3-prog", problemCount: 75, topics: ["Matrix Transpose", "Spiral Order", "Palindrome", "Anagram"] },
  { id: "cc-search-sort", order: 6, title: "Searching & Sorting", subtitle: "Binary Search, MergeSort & QuickSort", kingdomKey: "k7-dsa", problemCount: 70, topics: ["Binary Search", "Lower Bound", "Merge Intervals", "Kth Largest"] },
  { id: "cc-linked-list", order: 7, title: "Linked Lists & Pointers", subtitle: "Singly, Doubly, Reversal & Cycle", kingdomKey: "k7-dsa", problemCount: 65, topics: ["Reverse List", "Middle Node", "Detect Cycle", "Merge Sorted"] },
  { id: "cc-stack-queue", order: 8, title: "Stacks & Queues", subtitle: "Monotonic Stack, Parens & Deque", kingdomKey: "k5-os", problemCount: 60, topics: ["Valid Parentheses", "Next Greater", "Min Stack", "Sliding Max"] },
  { id: "cc-trees", order: 9, title: "Trees & Binary Search Trees", subtitle: "Traversals, Height, LCA & Validate BST", kingdomKey: "k7-dsa", problemCount: 75, topics: ["Max Depth", "Inorder", "Validate BST", "Lowest Common Ancestor"] },
  { id: "cc-tries-heaps", order: 10, title: "Heaps, Hashing & Tries", subtitle: "Priority Queue, Prefix Trie & Frequency", kingdomKey: "k4-dbms", problemCount: 65, topics: ["Trie Prefix Count", "Top K Frequent", "Group Anagrams", "Median Stream"] },
  { id: "cc-graphs", order: 11, title: "Graphs (BFS, DFS & Paths)", subtitle: "Connected Components, Topo Sort & Dijkstra", kingdomKey: "k9-cn", problemCount: 75, topics: ["BFS Shortest Path", "Cycle Detection", "Topological Sort", "Islands"] },
  { id: "cc-dp", order: 12, title: "Dynamic Programming", subtitle: "Memoization, Tabulation, Knapsack & LCS", kingdomKey: "k10-ai", problemCount: 80, topics: ["Climbing Stairs", "0/1 Knapsack", "Coin Change", "Longest Common Subseq"] },
];

const TEMPLATES_BY_CHAPTER: Record<
  string,
  Array<{
    title: string;
    diff: "Easy" | "Medium" | "Hard";
    desc: string;
    inEx: string;
    outEx: string;
    js: string;
    py: string;
    cpp: string;
    java: string;
    tests: { input: unknown; expected: unknown; spread?: boolean }[];
  }>
> = {
  "cc-if-else": [
    {
      title: "Maximum of Three Numbers",
      diff: "Easy",
      desc: "Given three integers `a, b, c`, return the largest using conditional branching.",
      inEx: "a = 12, b = 27, c = 19",
      outEx: "27",
      js: `function solve(a, b, c) {\n  if (a >= b && a >= c) return a;\n  if (b >= a && b >= c) return b;\n  return c;\n}`,
      py: `def solve(a: int, b: int, c: int) -> int:\n    if a >= b and a >= c:\n        return a\n    elif b >= a and b >= c:\n        return b\n    return c`,
      cpp: `int solve(int a, int b, int c) {\n    if (a >= b && a >= c) return a;\n    if (b >= a && b >= c) return b;\n    return c;\n}`,
      java: `static int solve(int a, int b, int c) {\n    if (a >= b && a >= c) return a;\n    if (b >= a && b >= c) return b;\n    return c;\n}`,
      tests: [{ input: [12, 27, 19], expected: 27, spread: true }, { input: [5, 5, 2], expected: 5, spread: true }],
    },
    {
      title: "Leap Year Validator",
      diff: "Easy",
      desc: "Return `true` if `year` is a leap year (divisible by 400, or divisible by 4 and not 100).",
      inEx: "year = 2024",
      outEx: "true",
      js: `function solve(year) {\n  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);\n}`,
      py: `def solve(year: int) -> bool:\n    return (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)`,
      cpp: `bool solve(int year) {\n    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n}`,
      java: `static boolean solve(int year) {\n    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n}`,
      tests: [{ input: 2024, expected: true }, { input: 1900, expected: false }],
    },
  ],
  "cc-loops": [
    {
      title: "Sum of Digits",
      diff: "Easy",
      desc: "Given a non-negative integer `n`, return the sum of its decimal digits using a `while` loop.",
      inEx: "n = 4729",
      outEx: "22",
      js: `function solve(n) {\n  let sum = 0;\n  while (n > 0) {\n    sum += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return sum;\n}`,
      py: `def solve(n: int) -> int:\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total`,
      cpp: `int solve(int n) {\n    int sum = 0;\n    while (n > 0) { sum += n % 10; n /= 10; }\n    return sum;\n}`,
      java: `static int solve(int n) {\n    int sum = 0;\n    while (n > 0) { sum += n % 10; n /= 10; }\n    return sum;\n}`,
      tests: [{ input: 4729, expected: 22 }, { input: 105, expected: 6 }],
    },
  ],
  "cc-recursion": [
    {
      title: "Fast Modular Power (Divide & Conquer)",
      diff: "Medium",
      desc: "Compute `x^n` in O(log n) recursive calls.",
      inEx: "x = 2, n = 10",
      outEx: "1024",
      js: `function solve(x, n) {\n  if (n === 0) return 1;\n  const half = solve(x, Math.floor(n / 2));\n  return n % 2 === 0 ? half * half : half * half * x;\n}`,
      py: `def solve(x: int, n: int) -> int:\n    if n == 0: return 1\n    half = solve(x, n // 2)\n    return half * half if n % 2 == 0 else half * half * x`,
      cpp: `long long solve(long long x, int n) {\n    if (n == 0) return 1;\n    long long half = solve(x, n / 2);\n    return (n % 2 == 0) ? half * half : half * half * x;\n}`,
      java: `static long solve(long x, int n) {\n    if (n == 0) return 1;\n    long half = solve(x, n / 2);\n    return (n % 2 == 0) ? half * half : half * half * x;\n}`,
      tests: [{ input: [2, 10], expected: 1024, spread: true }, { input: [3, 4], expected: 81, spread: true }],
    },
  ],
  "cc-arrays": [
    {
      title: "Two Sum (O(n) Hash Map)",
      diff: "Easy",
      desc: "Return indices `[i, j]` of two numbers in `nums` that add up to `target`.",
      inEx: "nums = [2,7,11,15], target = 9",
      outEx: "[0, 1]",
      js: `function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      py: `def solve(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i\n    return []`,
      cpp: `vector<int> solve(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        if (seen.count(target - nums[i])) return {seen[target - nums[i]], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `static int[] solve(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        if (map.containsKey(target - nums[i])) return new int[]{map.get(target - nums[i]), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
      tests: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1], spread: true }],
    },
  ],
};

export function getProblemsForChapter(chapterId: string, page = 1, limit = 6) {
  const ch = CODING_CHAPTERS.find((c) => c.id === chapterId) || CODING_CHAPTERS[0];
  const baseTemplates = TEMPLATES_BY_CHAPTER[ch.id] || TEMPLATES_BY_CHAPTER["cc-arrays"];
  const total = ch.problemCount;
  const start = Math.max(0, (page - 1) * limit);
  const items: CodingProblem[] = [];

  for (let i = start; i < Math.min(total, start + limit); i++) {
    const tpl = baseTemplates[i % baseTemplates.length];
    const topicName = ch.topics[i % ch.topics.length];
    const diff: CodingProblem["difficulty"] = i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard";
    const num = i + 1;
    items.push({
      id: `${ch.id}-p-${num}`,
      chapterId: ch.id,
      number: num,
      title: i < baseTemplates.length ? tpl.title : `${topicName} — Drill #${num}`,
      difficulty: i < baseTemplates.length ? tpl.diff : diff,
      description: tpl.desc,
      constraints: `1 ≤ N ≤ 10^5 • Expected Time: O(N) or O(N log N)`,
      sampleInput: tpl.inEx,
      sampleOutput: tpl.outEx,
      runnableJs: { starter: tpl.js, tests: tpl.tests },
      starters: {
        javascript: tpl.js,
        python: tpl.py,
        cpp: tpl.cpp,
        java: tpl.java,
      },
    });
  }
  return { chapter: ch, total, items };
}
