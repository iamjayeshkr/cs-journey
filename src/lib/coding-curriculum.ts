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

export interface CodingSample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string;
  constraintList: string[];
  expectedTime: string;
  expectedSpace: string;
  sampleInput: string;
  sampleOutput: string;
  samples: CodingSample[];
  hint: string;
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

interface ProblemTemplate {
  title: string;
  diff: "Easy" | "Medium" | "Hard";
  desc: string;
  constraints: string[];
  expectedTime: string;
  expectedSpace: string;
  samples: CodingSample[];
  hint: string;
  js: string;
  py: string;
  cpp: string;
  java: string;
  tests: { input: unknown; expected: unknown; spread?: boolean }[];
}

const TEMPLATES_BY_CHAPTER: Record<string, ProblemTemplate[]> = {
  "cc-if-else": [
    {
      title: "Maximum of Three Numbers",
      diff: "Easy",
      desc: "Given three integers `a`, `b`, and `c`, return the largest value using conditional branching (`if` / `else`).",
      constraints: ["-10^9 <= a, b, c <= 10^9", "Do not use built-in Math.max() if practicing raw conditionals."],
      expectedTime: "O(1)",
      expectedSpace: "O(1)",
      samples: [
        { input: "a = 12, b = 27, c = 19", output: "27", explanation: "27 is greater than both 12 and 19." },
        { input: "a = 5, b = 5, c = 2", output: "5", explanation: "Ties between largest values still return 5." },
      ],
      hint: "Compare `a >= b && a >= c` first; otherwise compare `b` against `c`.",
      js: `function solve(a, b, c) {\n  // Write your conditional logic here\n  \n}`,
      py: `def solve(a: int, b: int, c: int) -> int:\n    # Write your conditional logic here\n    pass`,
      cpp: `int solve(int a, int b, int c) {\n    // Write your conditional logic here\n    return 0;\n}`,
      java: `static int solve(int a, int b, int c) {\n    // Write your conditional logic here\n    return 0;\n}`,
      tests: [
        { input: [12, 27, 19], expected: 27, spread: true },
        { input: [5, 5, 2], expected: 5, spread: true },
        { input: [-4, -1, -9], expected: -1, spread: true },
      ],
    },
    {
      title: "Leap Year Validator",
      diff: "Easy",
      desc: "Given an integer `year`, return `true` if it is a leap year, or `false` otherwise.\n\nA year is a leap year if it is divisible by `400`, OR divisible by `4` and **not** divisible by `100`.",
      constraints: ["1 <= year <= 10^5"],
      expectedTime: "O(1)",
      expectedSpace: "O(1)",
      samples: [
        { input: "year = 2024", output: "true", explanation: "2024 is divisible by 4 and not by 100." },
        { input: "year = 1900", output: "false", explanation: "1900 is divisible by 100 but not by 400." },
      ],
      hint: "Combine `(year % 400 === 0)` with `(year % 4 === 0 && year % 100 !== 0)`.",
      js: `function solve(year) {\n  // Return true or false\n  \n}`,
      py: `def solve(year: int) -> bool:\n    # Return True or False\n    pass`,
      cpp: `bool solve(int year) {\n    // Return true or false\n    return false;\n}`,
      java: `static boolean solve(int year) {\n    // Return true or false\n    return false;\n}`,
      tests: [
        { input: 2024, expected: true },
        { input: 1900, expected: false },
        { input: 2000, expected: true },
      ],
    },
  ],
  "cc-loops": [
    {
      title: "Sum of Digits",
      diff: "Easy",
      desc: "Given a non-negative integer `n`, return the sum of all its decimal digits using a `while` loop.",
      constraints: ["0 <= n <= 10^9"],
      expectedTime: "O(log10 n)",
      expectedSpace: "O(1)",
      samples: [
        { input: "n = 4729", output: "22", explanation: "4 + 7 + 2 + 9 = 22." },
        { input: "n = 105", output: "6", explanation: "1 + 0 + 5 = 6." },
      ],
      hint: "Extract the last digit with `n % 10`, add to `sum`, and drop it using integer division by `10`.",
      js: `function solve(n) {\n  // Use a while loop to sum digits of n\n  let sum = 0;\n  \n  return sum;\n}`,
      py: `def solve(n: int) -> int:\n    # Use a while loop to sum digits of n\n    total = 0\n    \n    return total`,
      cpp: `int solve(int n) {\n    // Use a while loop to sum digits of n\n    int sum = 0;\n    \n    return sum;\n}`,
      java: `static int solve(int n) {\n    // Use a while loop to sum digits of n\n    int sum = 0;\n    \n    return sum;\n}`,
      tests: [
        { input: 4729, expected: 22 },
        { input: 105, expected: 6 },
        { input: 0, expected: 0 },
      ],
    },
  ],
  "cc-recursion": [
    {
      title: "Fast Modular Power (Divide & Conquer)",
      diff: "Medium",
      desc: "Given base `x` and non-negative exponent `n`, compute `x^n` using recursion in `O(log n)` time.",
      constraints: ["1 <= x <= 100", "0 <= n <= 30"],
      expectedTime: "O(log n)",
      expectedSpace: "O(log n)",
      samples: [
        { input: "x = 2, n = 10", output: "1024", explanation: "2^10 = 1024 using binary exponentiation." },
        { input: "x = 3, n = 4", output: "81", explanation: "3^4 = (3^2)^2 = 9 * 9 = 81." },
      ],
      hint: "Base case: `n === 0` returns `1`. Compute `half = solve(x, Math.floor(n / 2))`, then square it.",
      js: `function solve(x, n) {\n  // Base case + recursive divide-and-conquer\n  \n}`,
      py: `def solve(x: int, n: int) -> int:\n    # Base case + recursive divide-and-conquer\n    pass`,
      cpp: `long long solve(long long x, int n) {\n    // Base case + recursive divide-and-conquer\n    return 1;\n}`,
      java: `static long solve(long x, int n) {\n    // Base case + recursive divide-and-conquer\n    return 1;\n}`,
      tests: [
        { input: [2, 10], expected: 1024, spread: true },
        { input: [3, 4], expected: 81, spread: true },
        { input: [5, 0], expected: 1, spread: true },
      ],
    },
  ],
  "cc-arrays": [
    {
      title: "Two Sum (O(n) Hash Map)",
      diff: "Easy",
      desc: "Given an integer array `nums` and an integer `target`, return the **indices** `[i, j]` of the two numbers such that `nums[i] + nums[j] == target`.",
      constraints: ["2 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "Exactly one valid pair exists."],
      expectedTime: "O(n)",
      expectedSpace: "O(n)",
      samples: [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
      ],
      hint: "Store each visited number and its index in a `Map`. For each `nums[i]`, check if `target - nums[i]` is already in the map.",
      js: `function solve(nums, target) {\n  // Return [i, j] such that nums[i] + nums[j] === target\n  const map = new Map();\n  \n  return [];\n}`,
      py: `def solve(nums: list[int], target: int) -> list[int]:\n    # Return [i, j] such that nums[i] + nums[j] == target\n    seen = {}\n    \n    return []`,
      cpp: `vector<int> solve(vector<int>& nums, int target) {\n    // Return {i, j} such that nums[i] + nums[j] == target\n    unordered_map<int, int> seen;\n    \n    return {};\n}`,
      java: `static int[] solve(int[] nums, int target) {\n    // Return new int[]{i, j}\n    Map<Integer, Integer> map = new HashMap<>();\n    \n    return new int[]{};\n}`,
      tests: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1], spread: true },
        { input: [[3, 2, 4], 6], expected: [1, 2], spread: true },
      ],
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
      constraints: `${tpl.constraints[0]} • Expected Time: ${tpl.expectedTime}`,
      constraintList: tpl.constraints,
      expectedTime: tpl.expectedTime,
      expectedSpace: tpl.expectedSpace,
      sampleInput: tpl.samples[0].input,
      sampleOutput: tpl.samples[0].output,
      samples: tpl.samples,
      hint: tpl.hint,
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
