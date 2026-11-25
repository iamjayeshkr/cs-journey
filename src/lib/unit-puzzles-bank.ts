import { KINGDOMS } from "./curriculum-data";

export interface UnitPuzzleItem {
  id: string;
  kingdom_id: string;
  kingdom_title: string;
  title: string;
  prompt: string;
  puzzle_type: "pointer_trace" | "sequence" | "logic_gate";
  difficulty: "easy" | "medium" | "hard";
  config: { initialList?: number[]; insertValue?: number; choices?: string[] };
  solution: { expectedList?: number[]; answer?: string };
  hints: string[];
  xp_reward: number;
}

export function getUnitPuzzleHouse(kingdomId: string): UnitPuzzleItem[] {
  const k = KINGDOMS.find((x) => x.id === kingdomId);
  if (!k) return [];

  const unitSpecific: Record<string, Omit<UnitPuzzleItem, "kingdom_id" | "kingdom_title">[]> = {
    "k1-discrete": [
      {
        id: "puz-u1-1",
        title: "The Contrapositive Bridge",
        prompt: "Which statement is logically equivalent to: 'If a graph is a tree (P), then it has no cycles (Q)'?",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["If a graph has a cycle (¬Q), then it is not a tree (¬P)", "If a graph has no cycles, it is a tree", "If a graph is not a tree, it has a cycle"] },
        solution: { answer: "If a graph has a cycle (¬Q), then it is not a tree (¬P)" },
        hints: ["P → Q is equivalent to ¬Q → ¬P."],
        xp_reward: 50,
      },
      {
        id: "puz-u1-2",
        title: "Euler's Planar Riddle",
        prompt: "A connected planar graph has 6 vertices and 9 edges. How many faces must it have?",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["5 faces", "4 faces", "6 faces", "3 faces"] },
        solution: { answer: "5 faces" },
        hints: ["Use V - E + F = 2."],
        xp_reward: 45,
      },
    ],
    "k2-csa": [
      {
        id: "puz-u2-1",
        title: "Clockwork Pipeline Overlap",
        prompt: "A 5-stage pipeline executes 100 independent instructions. How many clock cycles does it take ideally?",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["104 cycles", "500 cycles", "105 cycles", "100 cycles"] },
        solution: { answer: "104 cycles" },
        hints: ["Formula: k + n - 1."],
        xp_reward: 45,
      },
      {
        id: "puz-u2-2",
        title: "Load-Use Hazard Trap",
        prompt: "In a 5-stage RISC pipeline with forwarding, `LW R1, 0(R2)` followed immediately by `ADD R3, R1, R4` causes how many stall cycles?",
        puzzle_type: "sequence",
        difficulty: "hard",
        config: { choices: ["1 stall cycle", "0 stall cycles", "3 stall cycles", "5 stall cycles"] },
        solution: { answer: "1 stall cycle" },
        hints: ["Memory data from LW is only ready at the end of MEM stage."],
        xp_reward: 55,
      },
    ],
    "k3-prog": [
      {
        id: "puz-u3-1",
        title: "Vtable Dispatch Mystery",
        prompt: "`Base *p = new Derived(); p->speak();` where `speak()` is `virtual` in Base. Which method executes?",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["Derived::speak()", "Base::speak()", "Compile error", "Both run"] },
        solution: { answer: "Derived::speak()" },
        hints: ["Virtual functions use dynamic binding via vptr."],
        xp_reward: 40,
      },
      {
        id: "puz-u3-2",
        title: "Pointer Declaration Trap",
        prompt: "In C, `int* a, b;` declares `a` and `b` as:",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["a is int*, b is int", "Both are int*", "Both are int", "Syntax error"] },
        solution: { answer: "a is int*, b is int" },
        hints: ["The * binds to the declarator `a`, not to `int`."],
        xp_reward: 45,
      },
    ],
    "k4-dbms": [
      {
        id: "puz-u4-1",
        title: "Vault Filter Clause",
        prompt: "Which SQL clause filters groups AFTER `GROUP BY`?",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["HAVING", "WHERE", "DISTINCT", "ORDER BY"] },
        solution: { answer: "HAVING" },
        hints: ["WHERE runs before grouping."],
        xp_reward: 40,
      },
      {
        id: "puz-u4-2",
        title: "3NF vs BCNF Lock",
        prompt: "Which normal form ALWAYS guarantees both lossless-join AND dependency-preserving decomposition?",
        puzzle_type: "sequence",
        difficulty: "hard",
        config: { choices: ["3NF", "BCNF", "4NF", "5NF"] },
        solution: { answer: "3NF" },
        hints: ["BCNF can sacrifice dependency preservation."],
        xp_reward: 55,
      },
    ],
    "k5-os": [
      {
        id: "puz-u5-1",
        title: "Gearworks SJF Order",
        prompt: "Processes at t=0: P1(BT=8), P2(BT=2), P3(BT=5). Order for minimum average waiting time:",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["P2 -> P3 -> P1", "P1 -> P3 -> P2", "P3 -> P2 -> P1"] },
        solution: { answer: "P2 -> P3 -> P1" },
        hints: ["Pick smallest burst time first."],
        xp_reward: 45,
      },
      {
        id: "puz-u5-2",
        title: "Belady's Anomaly Suspect",
        prompt: "Which page replacement policy can suffer MORE page faults when given MORE frames?",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["FIFO", "LRU", "Optimal", "LFU Stack"] },
        solution: { answer: "FIFO" },
        hints: ["Stack algorithms never suffer Belady's Anomaly."],
        xp_reward: 50,
      },
    ],
    "k6-se": [
      {
        id: "puz-u6-1",
        title: "Blueprint Path Count",
        prompt: "A function has 12 edges, 10 nodes, and 1 connected component. Find McCabe's Cyclomatic Complexity V(G).",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["4", "2", "6", "5"] },
        solution: { answer: "4" },
        hints: ["V(G) = E - N + 2P."],
        xp_reward: 40,
      },
      {
        id: "puz-u6-2",
        title: "Ideal Modularity",
        prompt: "Which pair represents the strongest module design?",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["High Cohesion, Low Coupling", "Low Cohesion, High Coupling", "High Cohesion, High Coupling"] },
        solution: { answer: "High Cohesion, Low Coupling" },
        hints: ["Focused inside, independent outside."],
        xp_reward: 45,
      },
    ],
    "k7-dsa": [
      {
        id: "puz-ll-insert",
        title: "Railway Station Insertion",
        prompt: "Insert station 25 between 20 and 30 in [10 -> 20 -> 30 -> 40]. Click where to insert!",
        puzzle_type: "pointer_trace",
        difficulty: "easy",
        config: { initialList: [10, 20, 30, 40], insertValue: 25 },
        solution: { expectedList: [10, 20, 25, 30, 40] },
        hints: ["Insert right after node 20."],
        xp_reward: 45,
      },
      {
        id: "puz-u7-2",
        title: "Tail Pointer Trap",
        prompt: "With both `head` and `tail` pointers in a singly linked list, deleting the LAST node takes:",
        puzzle_type: "sequence",
        difficulty: "hard",
        config: { choices: ["O(n)", "O(1)", "O(log n)", "O(n log n)"] },
        solution: { answer: "O(n)" },
        hints: ["You cannot walk backwards from tail in a singly linked list."],
        xp_reward: 55,
      },
    ],
    "k8-toc": [
      {
        id: "puz-u8-1",
        title: "Automata String Lock",
        prompt: "A DFA accepts binary strings ending in '01'. Which string unlocks the gate?",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["11001", "10110", "0010", "111"] },
        solution: { answer: "11001" },
        hints: ["Look at the last 2 bits."],
        xp_reward: 40,
      },
      {
        id: "puz-u8-2",
        title: "CFL Closure Trap",
        prompt: "Are Context-Free Languages closed under Intersection?",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["No", "Yes, always", "Only for finite strings"] },
        solution: { answer: "No" },
        hints: ["Consider {a^n b^n c^m} ∩ {a^m b^n c^n}."],
        xp_reward: 50,
      },
    ],
    "k9-cn": [
      {
        id: "puz-u9-1",
        title: "CIDR Subnetting Lock",
        prompt: "How many usable host IPs exist in a `/27` subnet?",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["30", "32", "62", "14"] },
        solution: { answer: "30" },
        hints: ["32 - 27 = 5 host bits -> 2^5 - 2."],
        xp_reward: 50,
      },
      {
        id: "puz-u9-2",
        title: "TCP Reno Recovery",
        prompt: "cwnd = 16 MSS. On 3 duplicate ACKs, cwnd becomes:",
        puzzle_type: "sequence",
        difficulty: "medium",
        config: { choices: ["8 MSS", "1 MSS", "16 MSS", "32 MSS"] },
        solution: { answer: "8 MSS" },
        hints: ["3 dup ACKs halves cwnd; timeout resets to 1 MSS."],
        xp_reward: 50,
      },
    ],
    "k10-ai": [
      {
        id: "puz-u10-1",
        title: "A* Optimality Seal",
        prompt: "For A* to guarantee an optimal path, h(n) must satisfy:",
        puzzle_type: "sequence",
        difficulty: "easy",
        config: { choices: ["h(n) <= h*(n)", "h(n) > h*(n)", "h(n) = 2*g(n)"] },
        solution: { answer: "h(n) <= h*(n)" },
        hints: ["Admissible = never overestimates."],
        xp_reward: 45,
      },
      {
        id: "puz-u10-2",
        title: "Alpha-Beta Cutoff",
        prompt: "In Alpha-Beta pruning, a branch is pruned whenever:",
        puzzle_type: "sequence",
        difficulty: "hard",
        config: { choices: ["alpha >= beta", "alpha < beta", "h(n) == 0"] },
        solution: { answer: "alpha >= beta" },
        hints: ["The maximizer's guaranteed floor meets or exceeds the minimizer's ceiling."],
        xp_reward: 55,
      },
    ],
  };

  const list = unitSpecific[kingdomId] || [];
  return list.map((p) => ({
    ...p,
    kingdom_id: k.id,
    kingdom_title: k.title,
  }));
}
