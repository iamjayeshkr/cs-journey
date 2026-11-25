export type LearnLang = "en" | "hinglish";

export interface TextbookExample {
  title: string;
  problem: string;
  steps: string[];
  answer: string;
}

export interface TextbookPracticeQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TextbookChapter {
  introduction: string;
  definition: string;
  principles: string[];
  terminology: { term: string; meaning: string }[];
  workingMechanism: string[];
  derivation: {
    formula: string;
    variables: { sym: string; desc: string }[];
    steps: string[];
    numericalExample: string;
    calculationMistake: string;
  };
  examples: TextbookExample[];
  properties: string[];
  comparison: {
    heading: string;
    rows: { feature: string; primary: string; related: string }[];
  };
  advantages: string[];
  limitations: string[];
  misconceptions: { myth: string; reality: string }[];
  examPoints: string[];
  summary: string;
  practiceQuestions: TextbookPracticeQ[];
  flashcards: { front: string; back: string }[];
  relatedTopics: string[];
}

interface UnitTextbookTemplate {
  principles: string[];
  terminology: { term: string; meaning: string }[];
  mechanism: string[];
  derivation: TextbookChapter["derivation"];
  comparison: TextbookChapter["comparison"];
  advantages: string[];
  limitations: string[];
  misconceptions: { myth: string; reality: string }[];
  examPoints: string[];
  relatedTopics: string[];
}

const UNIT_TEMPLATES: Record<string, UnitTextbookTemplate> = {
  Discrete: {
    principles: [
      "Formal truth values and set memberships must remain unambiguous under all domain assignments.",
      "Logical equivalence (≡) holds if and only if two compound expressions share identical truth tables across every valuation.",
      "Counting principles partition complex structures into disjoint subsets to avoid overcounting.",
    ],
    terminology: [
      { term: "Tautology (⊤)", meaning: "A compound proposition that evaluates to True under every possible truth assignment." },
      { term: "Contrapositive (¬Q → ¬P)", meaning: "Negating and reversing an implication; always logically equivalent to P → Q." },
      { term: "Cardinality (|A|)", meaning: "The exact number of distinct elements contained in set A." },
    ],
    mechanism: [
      "Identify atomic propositions, sets, or graph vertices and define the domain of discourse.",
      "Translate natural-language constraints into formal symbolic expressions using connectives (¬, ∧, ∨, →) or quantifiers (∀, ∃).",
      "Simplify expressions systematically via De Morgan's Laws, distributive laws, or Inclusion-Exclusion.",
    ],
    derivation: {
      formula: "|A ∪ B| = |A| + |B| − |A ∩ B|   and   P → Q ≡ ¬P ∨ Q",
      variables: [
        { sym: "|A|, |B|", desc: "Sizes of finite sets A and B respectively" },
        { sym: "|A ∩ B|", desc: "Number of elements present in both A and B" },
        { sym: "P, Q", desc: "Atomic Boolean propositions taking values in {True, False}" },
      ],
      steps: [
        "Summing |A| + |B| counts every element in the intersection A ∩ B twice.",
        "Subtracting |A ∩ B| once restores exact single-counting for every element in A ∪ B.",
        "Similarly, P → Q is false solely when P = T and Q = F, matching ¬P ∨ Q identically.",
      ],
      numericalExample:
        "If 45 students study DBMS (|A| = 45), 35 study OS (|B| = 35), and 15 study both (|A ∩ B| = 15), then total students = 45 + 35 − 15 = 65.",
      calculationMistake:
        "Forgetting to add back the triple intersection |A ∩ B ∩ C| when extending Inclusion-Exclusion to three sets.",
    },
    comparison: {
      heading: "Euler Path vs Hamiltonian Path",
      rows: [
        { feature: "Traversal Target", primary: "Visits every EDGE exactly once", related: "Visits every VERTEX exactly once" },
        { feature: "Decision Complexity", primary: "Polynomial time O(V + E)", related: "NP-Complete in general graphs" },
        { feature: "Degree Condition", primary: "0 or 2 vertices of odd degree", related: "No simple degree characterization" },
      ],
    },
    advantages: [
      "Provides rigorous, machine-verifiable foundations for algorithms, proofs, and digital circuits.",
      "Eliminates ambiguity in specification of database queries and formal verification.",
    ],
    limitations: [
      "Combinatorial state spaces grow exponentially (2^n), requiring heuristic pruning for large n.",
    ],
    misconceptions: [
      { myth: "Converse (Q → P) is equivalent to P → Q.", reality: "Only the Contrapositive (¬Q → ¬P) is logically equivalent to P → Q." },
      { myth: "¬(∀x P(x)) equals ∀x ¬P(x).", reality: "By quantifier negation, ¬(∀x P(x)) ≡ ∃x ¬P(x)." },
    ],
    examPoints: [
      "Number of Boolean functions of n variables is 2^(2^n).",
      "Handshaking Lemma: ∑ deg(v) = 2|E|, hence odd-degree vertices are always even in number.",
      "Connected planar graph satisfies Euler's formula: v − e + f = 2.",
    ],
    relatedTopics: ["Propositional Logic", "Graph Theory", "Combinatorics & Recurrences"],
  },
  "Computer System": {
    principles: [
      "All arithmetic, control, and memory operations reduce to binary switching circuits built from universal gates (NAND/NOR).",
      "Temporal and spatial locality allow small, fast caches to approximate the speed of registers at the cost of DRAM.",
      "Instruction-level parallelism overlaps Fetch, Decode, Execute, Memory, and Writeback across distinct clock cycles.",
    ],
    terminology: [
      { term: "CPI (Cycles Per Instruction)", meaning: "Average number of clock cycles consumed per executed instruction." },
      { term: "Cache Hit Ratio (h)", meaning: "Fraction of memory accesses satisfied directly by cache memory." },
      { term: "Pipeline Hazard", meaning: "Structural, Data, or Control dependency that stalls the next instruction." },
    ],
    mechanism: [
      "Program Counter (PC) supplies the instruction address; Control Unit fetches and decodes the opcode.",
      "ALU executes arithmetic/logical operations on register operands and updates status flags.",
      "Memory hierarchy resolves addresses through TLB and L1/L2 cache before accessing main RAM.",
    ],
    derivation: {
      formula: "S = (k · n) / (k + n − 1)   and   EMAT = h · T_cache + (1 − h) · (T_cache + T_mem)",
      variables: [
        { sym: "k", desc: "Number of stages in the instruction pipeline" },
        { sym: "n", desc: "Total number of instructions executed" },
        { sym: "h", desc: "Cache hit rate (0 ≤ h ≤ 1)" },
        { sym: "T_cache, T_mem", desc: "Access latency of cache and main memory respectively" },
      ],
      steps: [
        "Non-pipelined execution of n instructions requires k · n cycles.",
        "Pipelined execution fills the pipe in k cycles and completes the remaining (n − 1) instructions at 1 per cycle: total = k + n − 1.",
        "As n → ∞, speedup S approaches k (the ideal pipeline depth).",
      ],
      numericalExample:
        "For k = 5 stages and n = 100 instructions: S = (5 × 100) / (5 + 100 − 1) = 500 / 104 ≈ 4.81× speedup.",
      calculationMistake:
        "Using uniform stage time instead of max(stage_i) + latch_delay when computing the pipeline clock cycle.",
    },
    comparison: {
      heading: "Direct-Mapped Cache vs Set-Associative Cache",
      rows: [
        { feature: "Placement Rule", primary: "Each block maps to exactly 1 line", related: "Block maps to any of k lines in a set" },
        { feature: "Conflict Misses", primary: "High under stride collisions", related: "Significantly reduced" },
        { feature: "Comparator Hardware", primary: "1 tag comparator", related: "k parallel tag comparators" },
      ],
    },
    advantages: [
      "Pipelining increases instruction throughput without reducing individual instruction latency.",
      "DMA offloads bulk I/O transfers from the CPU.",
    ],
    limitations: [
      "Branch mispredictions and true data hazards (RAW) degrade ideal pipeline speedup.",
    ],
    misconceptions: [
      { myth: "Pipelining reduces the execution time of a single instruction.", reality: "Pipelining increases throughput (instructions/sec); single-instruction latency often increases slightly due to latch overhead." },
    ],
    examPoints: [
      "2's complement range for n bits is [−2^(n−1), +2^(n−1) − 1] with a unique zero.",
      "IEEE 754 Single Precision (32-bit): 1 sign bit, 8 exponent bits (bias 127), 23 mantissa bits.",
    ],
    relatedTopics: ["Digital Logic & K-Maps", "Pipelining & Hazards", "Cache & Virtual Memory"],
  },
  Database: {
    principles: [
      "Data independence separates logical schema design from physical file storage.",
      "Normalization decomposes relations along functional dependencies to eliminate insertion, deletion, and update anomalies.",
      "Concurrency control guarantees serializable execution while preserving ACID durability.",
    ],
    terminology: [
      { term: "Candidate Key", meaning: "A minimal superkey whose attributes uniquely identify every tuple in a relation." },
      { term: "BCNF", meaning: "Every non-trivial functional dependency X → Y has X as a superkey." },
      { term: "Conflict Serializability", meaning: "Schedule equivalence to a serial order verified by an acyclic precedence graph." },
    ],
    mechanism: [
      "Compute attribute closures (X+) to identify candidate keys and minimal covers of functional dependencies.",
      "Decompose relations into 3NF or BCNF while verifying lossless-join: (R1 ∩ R2) → R1 or R2.",
      "Index hot lookup keys using balanced B+ Trees where all record pointers reside in linked leaf nodes.",
    ],
    derivation: {
      formula: "Lossless Join: (R1 ∩ R2) → R1  ∨  (R1 ∩ R2) → R2",
      variables: [
        { sym: "R1, R2", desc: "Decomposed sub-relations of schema R = R1 ∪ R2" },
        { sym: "R1 ∩ R2", desc: "Common attributes shared between R1 and R2" },
      ],
      steps: [
        "When R1 and R2 are natural-joined, tuples match on shared attributes R1 ∩ R2.",
        "If R1 ∩ R2 uniquely determines all attributes of R1 (or R2), no spurious tuples can be synthesized.",
        "Therefore, R1 ⋈ R2 reconstructs the original relation R exactly.",
      ],
      numericalExample:
        "R(A, B, C) with FD A → B decomposed into R1(A, B) and R2(A, C): R1 ∩ R2 = {A}, and A → AB holds, so the decomposition is lossless.",
      calculationMistake:
        "Assuming every 3NF relation is automatically in BCNF; 3NF permits X → Y when Y is a prime attribute even if X is not a superkey.",
    },
    comparison: {
      heading: "B-Tree vs B+ Tree Indexing",
      rows: [
        { feature: "Data Pointer Location", primary: "Internal and leaf nodes", related: "Leaf nodes only" },
        { feature: "Range Queries", primary: "Requires tree traversal", related: "Fast sequential scan via leaf links" },
        { feature: "Internal Fan-out", primary: "Lower (pointers occupy space)", related: "Higher (keys only -> shallower tree)" },
      ],
    },
    advantages: [
      "ACID transactions guarantee consistency despite concurrent access and system crashes.",
      "Declarative SQL lets the query optimizer select optimal join orders and index scans.",
    ],
    limitations: [
      "Strict normalization can increase join overhead on read-heavy analytical workloads.",
    ],
    misconceptions: [
      { myth: "WHERE can filter aggregate results like COUNT(*) > 5.", reality: "WHERE filters rows prior to grouping; HAVING must be used for post-aggregation predicates." },
    ],
    examPoints: [
      "Every BCNF relation is in 3NF, but not every 3NF relation is in BCNF.",
      "Strict 2PL prevents cascading rollbacks by holding exclusive locks until commit.",
    ],
    relatedTopics: ["Normalization & FDs", "Relational Algebra & SQL", "Transactions & B+ Trees"],
  },
};

function resolveUnitTemplate(unitTitle: string): UnitTextbookTemplate {
  for (const key of Object.keys(UNIT_TEMPLATES)) {
    if (unitTitle.toLowerCase().includes(key.toLowerCase())) {
      return UNIT_TEMPLATES[key];
    }
  }
  // Structured fallback for OS, SE, DSA, TOC, CN, AI, Programming
  return {
    principles: [
      `Core invariants of ${unitTitle} govern correctness, resource efficiency, and worst-case behavior.`,
      "Formal models abstract implementation details so algorithms and protocols can be analyzed independently of hardware.",
      "Trade-offs between time complexity, space overhead, and implementation simplicity determine real-world selection.",
    ],
    terminology: [
      { term: "Invariant", meaning: "A condition that remains true before and after every valid operation step." },
      { term: "Asymptotic Bound", meaning: "Characterization of growth rate as input size n approaches infinity." },
      { term: "Edge Case", meaning: "Boundary input (empty, single-element, maximum, or cyclic) that tests correctness." },
    ],
    mechanism: [
      "Define the formal input specification, state representation, and termination condition.",
      "Execute state transitions or algorithmic steps while preserving the governing invariant.",
      "Verify correctness at boundary conditions and evaluate time/space complexity.",
    ],
    derivation: {
      formula: "T(n) = a · T(n / b) + f(n)   (Divide & Conquer Recurrence)",
      variables: [
        { sym: "n", desc: "Input size" },
        { sym: "a", desc: "Number of recursive subproblems generated per call (a ≥ 1)" },
        { sym: "n / b", desc: "Size of each subproblem (b > 1)" },
        { sym: "f(n)", desc: "Non-recursive work performed to divide and combine results" },
      ],
      steps: [
        "Recursion tree depth equals log_b(n) when problem size divides by b at each level.",
        "Total number of leaves at the bottom level is a^(log_b n) = n^(log_b a).",
        "Compare leaf work n^(log_b a) against root work f(n) to obtain the tight Θ bound.",
      ],
      numericalExample:
        "For Merge Sort: T(n) = 2T(n/2) + n. Here a = 2, b = 2, so n^(log_2 2) = n. Since f(n) = Θ(n), Master Theorem Case 2 yields T(n) = Θ(n log n).",
      calculationMistake:
        "Confusing base-2 logarithm log_2(n) with log_b(a) when b ≠ 2, or forgetting the extra log n factor in Case 2.",
    },
    comparison: {
      heading: "Theoretical Model vs Practical Trade-off",
      rows: [
        { feature: "Primary Objective", primary: "Provable worst-case guarantees", related: "Fast average-case throughput" },
        { feature: "Memory Overhead", primary: "Explicit auxiliary structures", related: "Cache-friendly in-place layouts" },
        { feature: "Exam Relevance", primary: "Exact asymptotic & state proofs", related: "Trace-based numericals" },
      ],
    },
    advantages: [
      `Provides systematic, reusable problem-solving patterns across ${unitTitle}.`,
      "Supports rigorous complexity and correctness verification.",
    ],
    limitations: [
      "Constant factors and hardware cache behavior are abstracted away by asymptotic bounds.",
    ],
    misconceptions: [
      { myth: "Worst-case O(n²) means an algorithm is always slow in practice.", reality: "Average-case and cache locality (e.g., QuickSort) can outperform O(n log n) algorithms with high constant factors." },
    ],
    examPoints: [
      `Always verify boundary inputs (n = 0, n = 1, negative weights, or empty sets) in ${unitTitle} numericals.`,
      "Distinguish clearly between necessary conditions and sufficient conditions in theorem statements.",
    ],
    relatedTopics: ["Core Algorithms", "Complexity Analysis", "UGC NET PYQ Patterns"],
  };
}

export function getTextbookChapter(
  unitTitle: string,
  topicTitle: string,
  lang: LearnLang,
  revisionSummary?: string,
  formalDefinition?: string
): TextbookChapter {
  const tpl = resolveUnitTemplate(unitTitle);
  const cleanSummary =
    (revisionSummary || "").trim() ||
    `${topicTitle} establishes foundational models, formal rules, and algorithmic techniques within ${unitTitle}.`;
  const cleanDef =
    (formalDefinition || "").trim() ||
    `${topicTitle} is formally defined by its state invariants, operational rules, and asymptotic behavior in ${unitTitle}.`;

  if (lang === "hinglish") {
    return {
      introduction: `${topicTitle}, ${unitTitle} ka ek core concept hai. Is chapter mein hum iski formal definition, working mechanism, mathematical derivation, aur UGC NET/JRF ke important points bilkul clear aur seedhe tareeke se samjhenge.`,
      definition: `Formal Definition: ${cleanDef} (Aasan shabdon mein: ${cleanSummary})`,
      principles: tpl.principles.map((p, i) => `Siddhant ${i + 1}: ${p}`),
      terminology: tpl.terminology,
      workingMechanism: tpl.mechanism.map((m, i) => `Step ${i + 1}: ${m}`),
      derivation: tpl.derivation,
      examples: [
        {
          title: `Solved Example 1 — ${topicTitle} Verification`,
          problem: `${topicTitle} ke rule ko ek standard input par apply karke step-by-step output verify karo.`,
          steps: [
            `Step 1: Sabse pehle core invariant check karo: ${cleanSummary}`,
            `Step 2: Formal rule apply karo: ${cleanDef}`,
            "Step 3: Boundary condition (n = 0 ya empty case) verify karke final answer confirm karo.",
          ],
          answer: `Verified: ${cleanSummary}`,
        },
        {
          title: `Solved Example 2 — Exam Numerical Approach`,
          problem: `UGC NET style MCQ mein ${topicTitle} par based options ko eliminate kaise karein?`,
          steps: [
            "Step 1: Question mein diye gaye constraints aur quantifiers (always, only if, never) mark karo.",
            "Step 2: Counter-example test karo — agar ek bhi case fail ho, woh option galat hai.",
            "Step 3: Complexity / count formula se exact value match karo.",
          ],
          answer: tpl.derivation.numericalExample,
        },
      ],
      properties: [
        `Deterministic & Verifiable: ${topicTitle} har valid input par consistent result deta hai.`,
        `Exam Anchor: ${cleanDef}`,
      ],
      comparison: tpl.comparison,
      advantages: tpl.advantages,
      limitations: tpl.limitations,
      misconceptions: tpl.misconceptions,
      examPoints: tpl.examPoints,
      summary: `${topicTitle} Summary: ${cleanSummary} Exam ke liye formal definition aur formula derivation ke saath edge cases zaroor yaad rakhein.`,
      practiceQuestions: [
        {
          question: `${topicTitle} ke context mein kaunsa statement bilkul sahi hai?`,
          options: [
            cleanSummary,
            "Boundary conditions check karne ki zaroorat nahi hoti",
            "Asymptotic bounds sirf chhote inputs par lagte hain",
            "Formal definition aur implementation mein koi relation nahi hota",
          ],
          correctIndex: 0,
          explanation: `Sahi jawab Option A hai kyunki ${cleanSummary}`,
        },
      ],
      flashcards: [
        { front: `${topicTitle} — Formal Definition`, back: cleanDef },
        { front: `${topicTitle} — Key Formula`, back: tpl.derivation.formula },
        { front: `${topicTitle} — Common Trap`, back: tpl.misconceptions[0]?.reality || cleanSummary },
      ],
      relatedTopics: tpl.relatedTopics,
    };
  }

  return {
    introduction: `${topicTitle} is a foundational topic within ${unitTitle}. A rigorous grasp of its formal definition, underlying invariants, and analytical bounds is essential both for systems engineering and for UGC NET/JRF examination problems.`,
    definition: cleanDef,
    principles: tpl.principles,
    terminology: tpl.terminology,
    workingMechanism: tpl.mechanism,
    derivation: tpl.derivation,
    examples: [
      {
        title: `Solved Example 1 — Applying ${topicTitle}`,
        problem: `Demonstrate how ${topicTitle} preserves its governing invariant on a canonical input.`,
        steps: [
          `Identify the formal specification: ${cleanDef}`,
          `Apply the core operational rule: ${cleanSummary}`,
          "Verify boundary conditions (minimum/empty input and maximum constraint) to ensure consistency.",
        ],
        answer: cleanSummary,
      },
      {
        title: `Solved Example 2 — Quantitative / Exam Analysis`,
        problem: `Evaluate the quantitative bound associated with ${topicTitle} under standard assumptions.`,
        steps: [
          `Select the governing equation: ${tpl.derivation.formula}`,
          "Substitute the given parameters and simplify intermediate terms carefully.",
          "Cross-check units, logarithm bases, and off-by-one boundary terms.",
        ],
        answer: tpl.derivation.numericalExample,
      },
    ],
    properties: [
      `Core Invariant: ${cleanSummary}`,
      `Formal Basis: ${cleanDef}`,
      "Deterministic Behavior: Identical inputs and initial states always produce reproducible outcomes.",
    ],
    comparison: tpl.comparison,
    advantages: tpl.advantages,
    limitations: tpl.limitations,
    misconceptions: tpl.misconceptions,
    examPoints: tpl.examPoints,
    summary: `${topicTitle} provides a structured framework within ${unitTitle}. Mastery requires knowing its formal definition (${cleanDef}), understanding the derivation steps, and avoiding boundary-case traps.`,
    practiceQuestions: [
      {
        question: `Which statement accurately characterizes ${topicTitle}?`,
        options: [
          cleanSummary,
          "It ignores boundary conditions and formal invariants",
          "Its asymptotic behavior depends only on constant factors",
          "It cannot be analyzed independently of specific hardware",
        ],
        correctIndex: 0,
        explanation: `Option A is correct: ${cleanSummary}`,
      },
    ],
    flashcards: [
      { front: `${topicTitle} — Formal Definition`, back: cleanDef },
      { front: `${topicTitle} — Key Formula`, back: tpl.derivation.formula },
      { front: `${topicTitle} — Misconception Check`, back: tpl.misconceptions[0]?.reality || cleanSummary },
    ],
    relatedTopics: tpl.relatedTopics,
  };
}
