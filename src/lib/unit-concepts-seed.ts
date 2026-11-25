export interface RichConceptSeed {
  id: string;
  chapter_id: string;
  topic_id: string;
  order_index: number;
  slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "jrf";
  simulator_type:
    | "linked_list"
    | "stack_queue"
    | "cpu_scheduling"
    | "page_replacement"
    | "sql_playground"
    | "automata_dfa"
    | "sorting_arena"
    | "logic_gates"
    | "graph_search"
    | "none";
  estimated_minutes: number;
  xp_reward: number;
  prerequisites: string[];
  learning_objectives: string[];
  why_it_matters: string;
  level_1_beginner: string;
  level_2_foundation: string;
  level_3_intermediate: string;
  level_4_jrf: string;
  misconceptions: string[];
  pseudocode: string;
  complexity: { time: string; space: string; note: string };
  exam_relevance: string;
  teaching_methods: {
    feynman_prompt: string;
    feynman_keywords: string[];
    socratic_questions: { question: string; hint: string; answer: string }[];
    faded_example: { title: string; steps: { prompt: string; blank: string; hint: string }[] };
    prediction_challenge: { scenario: string; options: string[]; correct: string; explanation: string };
    compare_contrast: { leftTitle: string; rightTitle: string; rows: [string, string, string][] };
    error_analysis: { buggyClaim: string; whyPlausible: string; correction: string };
  };
  flashcards: { card_type: string; front: string; back: string }[];
}

export const RICH_CONCEPTS_PART1: RichConceptSeed[] = [
  // UNIT 1: Propositional Logic
  {
    id: "c-prop-logic",
    chapter_id: "ch-k1-logic",
    topic_id: "t-k1-1",
    order_index: 1,
    slug: "propositional-logic-equivalences",
    title: "Propositional Logic, Equivalences & Normal Forms",
    difficulty: "beginner",
    simulator_type: "logic_gates",
    estimated_minutes: 25,
    xp_reward: 75,
    prerequisites: [],
    learning_objectives: [
      "Distinguish propositions from non-propositional sentences.",
      "Construct truth tables for ∧, ∨, ¬, →, and ↔.",
      "Prove logical equivalence between P → Q and its contrapositive ¬Q → ¬P.",
      "Convert formulas into CNF and DNF for SAT and resolution.",
    ],
    why_it_matters:
      "Every conditional branch (`if/else`), SQL `WHERE` filter, digital circuit, and automated theorem prover rests on propositional logic.",
    level_1_beginner:
      "Think of a proposition as a light switch sentence: it is either ON (True) or OFF (False), never 'maybe'. 'Delhi is in India' is True. 'What time is it?' is a question, not a proposition. We combine simple switches using AND (both must be ON), OR (at least one ON), and IF-THEN (a promise: if you study, you pass).",
    level_2_foundation:
      "A proposition is a declarative statement with a unique truth value in {T, F}. Logical connectives: Negation (¬P), Conjunction (P ∧ Q), Disjunction (P ∨ Q), Implication (P → Q ≡ ¬P ∨ Q), Biconditional (P ↔ Q ≡ (P → Q) ∧ (Q → P)). A tautology is always T; a contradiction is always F.",
    level_3_intermediate:
      "Implication variants: Given P → Q, the Converse is Q → P, Inverse is ¬P → ¬Q, and Contrapositive is ¬Q → ¬P. Only the contrapositive is logically equivalent to P → Q. Any Boolean formula can be normalized to Disjunctive Normal Form (DNF, sum of minterms) or Conjunctive Normal Form (CNF, product of maxterms).",
    level_4_jrf:
      "For n Boolean variables, there are 2^n truth-table rows and 2^(2^n) distinct Boolean functions. A set of connectives is functionally complete if it can express all 2^(2^n) functions; {NAND} and {NOR} are each singleton complete (Post's Lattice). Resolution refutation operates on CNF clauses and is sound and refutation-complete.",
    misconceptions: [
      "Thinking P → Q is False when P is False. In fact, False → anything is vacuously True!",
      "Confusing the Converse (Q → P) with the Contrapositive (¬Q → ¬P).",
    ],
    pseudocode: "implies(P, Q) := (not P) or Q\ncontrapositive(P, Q) := (not Q) implies (not P) // identical truth value",
    complexity: { time: "O(2^n) truth table", space: "O(n) variables", note: "3-SAT on CNF is NP-Complete." },
    exam_relevance: "UGC NET Unit 1 staple: tautology checks, equivalence of quantified/propositional statements, counting 2^(2^n) Boolean functions.",
    teaching_methods: {
      feynman_prompt: "Explain in plain everyday language why 'If it rains, the ground is wet' is ONLY broken when it rains and the ground stays dry.",
      feynman_keywords: ["true", "false", "promise", "broken", "rain"],
      socratic_questions: [
        { question: "Suppose I promise: 'If you score 90%, I will buy you a book.' You score 70% and I still buy the book. Did I break my promise?", hint: "Was the condition (90%) triggered?", answer: "No! The promise was only binding if you scored 90%. Hence F → T is True." },
        { question: "What is the ONLY case where P → Q is False?", hint: "When is a promise broken?", answer: "When P is True and Q is False." },
      ],
      faded_example: {
        title: "Prove ¬(P → Q) ≡ P ∧ ¬Q",
        steps: [
          { prompt: "Step 1: Rewrite P → Q using ∨ and ¬:", blank: "¬P ∨ Q", hint: "Definition of implication" },
          { prompt: "Step 2: Apply De Morgan's Law to ¬(¬P ∨ Q):", blank: "P ∧ ¬Q", hint: "¬(A ∨ B) ≡ ¬A ∧ ¬B" },
        ],
      },
      prediction_challenge: {
        scenario: "Let P = False and Q = False. What is the truth value of (P → Q) ∧ (Q → P)?",
        options: ["True", "False"],
        correct: "True",
        explanation: "Both implications are vacuously True (F → F is T), so T ∧ T = True.",
      },
      compare_contrast: {
        leftTitle: "Contrapositive (¬Q → ¬P)",
        rightTitle: "Converse (Q → P)",
        rows: [
          ["Equivalence to P → Q", "Always equivalent", "Not equivalent"],
          ["Example (Rain → Wet)", "Not Wet → Not Rain", "Wet → Rain (sprinkler could be on!)"],
        ],
      },
      error_analysis: {
        buggyClaim: "Student writes: '¬(P → Q) is ¬P → ¬Q.'",
        whyPlausible: "Distributing ¬ across the arrow looks tempting like algebra.",
        correction: "¬(P → Q) ≡ ¬(¬P ∨ Q) ≡ P ∧ ¬Q. An implication is falsified only when P is True AND Q is False.",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "How many distinct Boolean functions exist on n variables?", back: "2^(2^n). For n=3, 2^8 = 256." },
      { card_type: "Definition", front: "What is the contrapositive of P → Q?", back: "¬Q → ¬P (logically equivalent to P → Q)." },
      { card_type: "Common Mistake", front: "When is P → Q False?", back: "ONLY when P is True and Q is False." },
    ],
  },
  // UNIT 1: Graph Theory
  {
    id: "c-k1-graph-theory",
    chapter_id: "ch-k1-graphs",
    topic_id: "t-k1-2",
    order_index: 1,
    slug: "euler-hamilton-planar-graphs",
    title: "Eulerian, Hamiltonian & Planar Graphs",
    difficulty: "intermediate",
    simulator_type: "graph_search",
    estimated_minutes: 30,
    xp_reward: 85,
    prerequisites: ["c-prop-logic"],
    learning_objectives: [
      "Apply the Handshaking Lemma to relate vertex degrees and edge counts.",
      "Determine whether a graph has an Euler circuit/path in O(V + E).",
      "Apply Euler's Planar Formula V - E + F = 2 and Kuratowski's K5 / K3,3 criteria.",
    ],
    why_it_matters:
      "Graph theory powers network routing, PCB circuit layout (planarity), DNA sequencing (Euler paths), and NP-completeness (Hamiltonian cycle).",
    level_1_beginner:
      "Imagine tracing a drawing without lifting your pen and without going over any line twice — that's an Euler path! By contrast, visiting every city on a map exactly once is a Hamiltonian path. A graph is 'planar' if you can draw its roads on flat paper with zero bridges crossing.",
    level_2_foundation:
      "Handshaking Lemma: Σ deg(v) = 2|E|, so the number of odd-degree vertices is always even. A connected graph has an Euler circuit iff every vertex has even degree, and an Euler path iff 0 or 2 vertices have odd degree.",
    level_3_intermediate:
      "For a connected planar graph with V ≥ 3: V - E + F = 2, and E ≤ 3V - 6 (or E ≤ 2V - 4 if triangle-free). Every planar graph is 4-colorable (4-Color Theorem) and 5-colorable (easy induction using minimum degree ≤ 5).",
    level_4_jrf:
      "Kuratowski's Theorem: A graph is planar iff it contains no subgraph homeomorphic to K_5 or K_{3,3}. Checking Eulerianity is in P, whereas Hamiltonian Cycle is NP-Complete. Dirac's sufficient condition: if deg(v) ≥ n/2 for all v (n ≥ 3), G is Hamiltonian.",
    misconceptions: [
      "Thinking Eulerian and Hamiltonian conditions are similar: Eulerian has a clean degree characterization (P), Hamiltonian does not (NP-Complete).",
    ],
    pseudocode: "isEulerCircuit(G): return isConnected(G) and all(deg(v) % 2 == 0 for v in G.V)",
    complexity: { time: "O(V + E) for Eulerian check", space: "O(V)", note: "Hamiltonian cycle is NP-Complete." },
    exam_relevance: "Frequently tested in UGC NET: Euler's formula V - E + F = 2, chromatic number of bipartite/cycle graphs, K_5 & K_{3,3} non-planarity.",
    teaching_methods: {
      feynman_prompt: "Why must every connected graph have an even number of vertices with odd degree?",
      feynman_keywords: ["handshaking", "edges", "twice", "even", "sum"],
      socratic_questions: [
        { question: "Each edge has 2 endpoints. If a graph has 5 edges, what is the sum of all vertex degrees?", hint: "Count endpoints.", answer: "2 × 5 = 10." },
      ],
      faded_example: {
        title: "Check if K_3,3 is Planar",
        steps: [
          { prompt: "K_3,3 has V = 6, E = 9, and is bipartite (triangle-free). What is the planar bound 2V - 4?", blank: "8", hint: "2(6) - 4" },
          { prompt: "Since E = 9 > 8, is K_3,3 planar?", blank: "No", hint: "Violates E <= 2V - 4" },
        ],
      },
      prediction_challenge: {
        scenario: "A connected planar graph has 8 vertices and 12 edges. How many faces (regions) does it have?",
        options: ["4", "6", "8", "10"],
        correct: "6",
        explanation: "V - E + F = 2 → 8 - 12 + F = 2 → F = 6.",
      },
      compare_contrast: {
        leftTitle: "Eulerian Circuit",
        rightTitle: "Hamiltonian Cycle",
        rows: [
          ["Visits every...", "Edge once", "Vertex once"],
          ["Complexity", "P — O(V + E)", "NP-Complete"],
        ],
      },
      error_analysis: {
        buggyClaim: "If a graph has E ≤ 3V - 6, it must be planar.",
        whyPlausible: "Confusing a necessary condition with a sufficient condition.",
        correction: "E ≤ 3V - 6 is NECESSARY for planarity, not sufficient (e.g., a large non-planar graph with extra isolated vertices satisfies it).",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "Euler's formula for connected planar graphs:", back: "V - E + F = 2." },
      { card_type: "Property", front: "Condition for an Eulerian circuit in a connected graph:", back: "Every vertex has even degree." },
      { card_type: "Distinction", front: "Chromatic number of any bipartite graph (with ≥1 edge):", back: "2." },
    ],
  },
  // UNIT 2: Instruction Pipelining
  {
    id: "c-k2-pipelining",
    chapter_id: "ch-k2-pipeline",
    topic_id: "t-k2-2",
    order_index: 1,
    slug: "instruction-pipelining-hazards",
    title: "Instruction Pipelining, Speedup & Hazards",
    difficulty: "intermediate",
    simulator_type: "cpu_scheduling",
    estimated_minutes: 25,
    xp_reward: 80,
    prerequisites: [],
    learning_objectives: [
      "Compute pipeline clock cycle time, total execution time, and speedup.",
      "Classify Structural, Data (RAW, WAR, WAW), and Control hazards.",
      "Explain how operand forwarding and branch prediction reduce stalls.",
    ],
    why_it_matters:
      "Every modern CPU (x86, ARM, RISC-V) relies on deep instruction pipelining to achieve high instruction throughput.",
    level_1_beginner:
      "Imagine washing 4 loads of laundry. If you wash, dry, AND fold Load 1 before starting Load 2, it takes forever. Instead, while Load 1 is in the dryer, you put Load 2 in the washer! Pipelining overlaps CPU steps (Fetch, Decode, Execute, Memory, Writeback) so a new instruction finishes almost every clock tick.",
    level_2_foundation:
      "A k-stage pipeline splits instruction execution into k sub-operations. Ideal clock cycle t_p = max(stage delays) + latch delay. Time for n instructions: T_pipe = (k + n - 1) × t_p. Throughput approaches 1 instruction per cycle as n → ∞.",
    level_3_intermediate:
      "Hazards prevent the next instruction from executing in its designated cycle: (1) Structural hazard (hardware resource conflict), (2) Data hazard — RAW (true dependency), WAR (anti-dependency), WAW (output dependency), (3) Control hazard (conditional branches).",
    level_4_jrf:
      "Speedup S = (n × T_nonpipe) / ((k + n - 1 + stall_cycles) × t_p). Operand forwarding (bypassing) eliminates stalls for ALU-to-ALU RAW hazards, but a Load-Use RAW hazard still incurs 1 stall cycle in a classic 5-stage RISC pipeline. Effective CPI = 1 + stall_cycles_per_instruction.",
    misconceptions: [
      "Believing pipelining reduces the latency of a single instruction. It actually slightly INCREASES single-instruction latency due to latch overhead while dramatically increasing THROUGHPUT.",
    ],
    pseudocode: "T_pipe(k, n, tp) := (k + n - 1) * tp\nSpeedup := (n * T_seq) / T_pipe",
    complexity: { time: "O(k + n) cycles", space: "k pipeline registers", note: "Ideal speedup approaches k." },
    exam_relevance: "Very high-frequency UGC NET Unit 2 numerical: pipeline speedup with latch delay, CPI with branch penalty.",
    teaching_methods: {
      feynman_prompt: "Why does pipelining speed up a program of 1,000 instructions even though it makes 1 instruction slightly slower?",
      feynman_keywords: ["throughput", "overlap", "parallel", "latency", "stages"],
      socratic_questions: [
        { question: "If 5 stages take 10, 12, 8, 11, 9 ns, why can't the pipeline clock be 8 ns?", hint: "Every stage must finish within one clock tick.", answer: "The slowest stage (12 ns) dictates the clock cycle!" },
      ],
      faded_example: {
        title: "5-Stage Pipeline Speedup",
        steps: [
          { prompt: "Non-pipelined = 50 ns. Stage delays = 10, 12, 8, 11, 9 ns + 1 ns latch. Find t_p:", blank: "13 ns", hint: "max(stages) + 1" },
          { prompt: "Max ideal speedup (n → ∞) = 50 / t_p =", blank: "3.85", hint: "50 / 13" },
        ],
      },
      prediction_challenge: {
        scenario: "Which data hazard is a TRUE dependency that cannot be removed by register renaming alone?",
        options: ["RAW (Read After Write)", "WAR (Write After Read)", "WAW (Write After Write)"],
        correct: "RAW (Read After Write)",
        explanation: "RAW means instruction 2 genuinely needs the value produced by instruction 1; WAR and WAW are false name dependencies.",
      },
      compare_contrast: {
        leftTitle: "RAW Hazard",
        rightTitle: "WAR / WAW Hazard",
        rows: [
          ["Nature", "True data dependency", "Name (false) dependency"],
          ["Solution", "Forwarding / Stalling", "Register Renaming"],
        ],
      },
      error_analysis: {
        buggyClaim: "Operand forwarding eliminates ALL data hazards with zero stalls.",
        whyPlausible: "Forwarding works for ALU-to-ALU chains.",
        correction: "A Load followed immediately by a dependent ALU instruction (Load-Use) still needs 1 stall cycle because memory data is only ready after MEM stage.",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "Clock cycles for n instructions in a k-stage ideal pipeline:", back: "k + n - 1 cycles." },
      { card_type: "Common Mistake", front: "Does pipelining reduce single-instruction latency?", back: "No — it increases throughput, not single-instruction latency." },
    ],
  },
  // UNIT 3: Pointers & Virtual Dispatch
  {
    id: "c-k3-pointers",
    chapter_id: "ch-k3-prog",
    topic_id: "t-k3-1",
    order_index: 1,
    slug: "pointers-and-virtual-dispatch",
    title: "Pointers, Parameter Passing & Virtual Dispatch",
    difficulty: "intermediate",
    simulator_type: "linked_list",
    estimated_minutes: 25,
    xp_reward: 75,
    prerequisites: [],
    learning_objectives: [
      "Trace pointer dereferencing and pointer arithmetic in C/C++.",
      "Compare Call-by-Value, Call-by-Reference, and Call-by-Name.",
      "Explain how vptr and vtable enable runtime polymorphism in C++.",
    ],
    why_it_matters:
      "Pointer output questions and virtual function dispatch are among the most tested C/C++ questions in UGC NET Unit 3.",
    level_1_beginner:
      "Think of a house vs a sticky note with its address. Passing by value hands someone a photocopy of the house; changing it doesn't touch the original. A pointer is the sticky note with the street address — anyone holding it can walk to the real house and repaint it!",
    level_2_foundation:
      "A pointer variable stores the memory address of another variable (`int *p = &x;`). `*p` dereferences the address to read/write `x`. In C++, a `virtual` member function is resolved at runtime based on the dynamic type of the object pointed to, rather than the static pointer type.",
    level_3_intermediate:
      "Every polymorphic class with at least one `virtual` function has a hidden `vtable` (array of function pointers). Each object stores a hidden `vptr` pointing to its class's `vtable`. Calling `basePtr->fn()` performs a two-step indirection: `basePtr->__vptr[slot]()`.",
    level_4_jrf:
      "Destructors in polymorphic base classes MUST be `virtual`; otherwise `delete basePtr` invokes only `~Base()`, leaking derived resources. Constructors cannot be virtual because the `vptr` is initialized during construction. Pure virtual functions (`= 0`) make a class abstract.",
    misconceptions: [
      "Thinking `int* a, b;` declares two pointers. In C/C++, `a` is `int*` and `b` is `int`!",
    ],
    pseudocode: "Base *b = new Derived();\nb->show(); // dynamic dispatch via b->__vptr -> Derived::show()",
    complexity: { time: "O(1) vtable lookup", space: "1 vptr per object", note: "Slight indirection prevents inlining." },
    exam_relevance: "Classic UGC NET Unit 3: C pointer arithmetic output, parameter passing (call by value vs reference), C++ virtual function output.",
    teaching_methods: {
      feynman_prompt: "Why should a polymorphic base class in C++ always have a virtual destructor?",
      feynman_keywords: ["derived", "delete", "memory", "leak", "destructor"],
      socratic_questions: [
        { question: "If `Base *p = new Derived()` and `~Base()` is NOT virtual, which destructor runs on `delete p`?", hint: "Static binding uses pointer type.", answer: "Only `~Base()` runs, skipping `~Derived()`!" },
      ],
      faded_example: {
        title: "Trace Pointer Arithmetic",
        steps: [
          { prompt: "int arr[] = {10, 20, 30, 40}; int *p = arr + 1; What is *p?", blank: "20", hint: "arr points to index 0." },
          { prompt: "What is *(p + 2)?", blank: "40", hint: "Index 1 + 2 = 3." },
        ],
      },
      prediction_challenge: {
        scenario: "In C++, can a constructor be declared `virtual`?",
        options: ["Yes", "No"],
        correct: "No",
        explanation: "A virtual call needs an existing object's vptr, which does not exist before the constructor runs.",
      },
      compare_contrast: {
        leftTitle: "Static Binding (Non-virtual)",
        rightTitle: "Dynamic Binding (Virtual)",
        rows: [
          ["Resolved at", "Compile time (pointer type)", "Runtime (actual object via vtable)"],
          ["Overhead", "Zero", "1 pointer dereference via vptr"],
        ],
      },
      error_analysis: {
        buggyClaim: "Returning a pointer to a local stack variable from a C function is safe.",
        whyPlausible: "It often prints the right number immediately before the stack frame is overwritten.",
        correction: "Local variables are popped when the function returns, leaving a dangling pointer (Undefined Behavior).",
      },
    },
    flashcards: [
      { card_type: "Property", front: "Why must a polymorphic base class have a virtual destructor?", back: "So `delete basePtr` invokes `~Derived()` before `~Base()`, preventing leaks." },
      { card_type: "Common Mistake", front: "In `int* a, b;`, what are the types of `a` and `b`?", back: "`a` is `int*` (pointer), `b` is `int`." },
    ],
  },
  // UNIT 4: Relational Algebra & SQL
  {
    id: "c-sql-relational",
    chapter_id: "ch-k4-relational",
    topic_id: "t-k4-1",
    order_index: 1,
    slug: "relational-algebra-and-sql",
    title: "Relational Algebra, Calculus & SQL Engine",
    difficulty: "intermediate",
    simulator_type: "sql_playground",
    estimated_minutes: 25,
    xp_reward: 80,
    prerequisites: [],
    learning_objectives: [
      "Distinguish procedural Relational Algebra from declarative SQL and Calculus.",
      "Apply the 5 fundamental RA operators: σ, π, ∪, −, ×.",
      "Write SQL queries using GROUP BY, HAVING, Joins, and NULL 3-valued logic.",
    ],
    why_it_matters:
      "Every relational database query optimizer translates SQL into an internal Relational Algebra tree.",
    level_1_beginner:
      "Imagine a neat spreadsheet table of students. Filtering rows (like 'age > 20') is Selection (σ). Picking only certain columns (like 'name') is Projection (π). Matching rows across two tables (Students + Grades) is Join (⋈). SQL is the English-like language we type to ask for these results.",
    level_2_foundation:
      "Fundamental RA operators: Selection σ_p(R), Projection π_A(R) (removes duplicates), Union R ∪ S, Set Difference R − S, Cartesian Product R × S. Derived operators: Intersection R ∩ S = R − (R − S), Natural Join R ⋈ S, Division R ÷ S.",
    level_3_intermediate:
      "SQL Logical Execution Order: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY. `WHERE` filters individual rows before grouping; `HAVING` filters groups after aggregation. `COUNT(*)` counts NULLs, whereas `COUNT(col)` ignores NULLs.",
    level_4_jrf:
      "Relational Division R(A,B) ÷ S(B) returns all A values paired with EVERY B value in S, expressed via fundamental ops as π_A(R) − π_A((π_A(R) × S) − R). Safe Tuple Relational Calculus expressions restrict variables to finite domains so queries always terminate.",
    misconceptions: [
      "Using `= NULL` in SQL `WHERE` clauses. Because SQL uses 3-valued logic (TRUE, FALSE, UNKNOWN), `x = NULL` always evaluates to UNKNOWN — you must use `IS NULL`.",
    ],
    pseudocode: "SELECT kingdom, AVG(score)\nFROM Mastery\nWHERE score > 0\nGROUP BY kingdom\nHAVING AVG(score) >= 80;",
    complexity: { time: "O(N log N) sort-merge join", space: "O(N)", note: "Hash join averages O(N + M)." },
    exam_relevance: "UGC NET Unit 4 favorite: identifying the 5 fundamental RA operators, Division queries, WHERE vs HAVING, NULL semantics.",
    teaching_methods: {
      feynman_prompt: "Why can't you put `COUNT(*) > 5` inside a SQL `WHERE` clause?",
      feynman_keywords: ["before", "group", "rows", "having", "aggregate"],
      socratic_questions: [
        { question: "Which runs first in SQL: `WHERE` or `GROUP BY`?", hint: "You filter individual rows before grouping them.", answer: "`WHERE` runs first, before groups exist — so aggregates aren't computed yet!" },
      ],
      faded_example: {
        title: "Express R ∩ S using only Set Difference (−)",
        steps: [
          { prompt: "Step 1: Find elements in R that are NOT in S:", blank: "R - S", hint: "Set difference" },
          { prompt: "Step 2: Remove those from R to keep only shared elements:", blank: "R - (R - S)", hint: "Double difference" },
        ],
      },
      prediction_challenge: {
        scenario: "If Table R has 4 rows and Table S has 3 rows with NO common column names, how many rows does `R NATURAL JOIN S` return?",
        options: ["0", "4", "7", "12"],
        correct: "12",
        explanation: "With no common attributes, Natural Join reduces to Cartesian Product: 4 × 3 = 12 rows.",
      },
      compare_contrast: {
        leftTitle: "WHERE",
        rightTitle: "HAVING",
        rows: [
          ["Runs...", "Before GROUP BY", "After GROUP BY"],
          ["Filters...", "Individual tuples", "Aggregated groups"],
        ],
      },
      error_analysis: {
        buggyClaim: "`SELECT * FROM Users WHERE email = NULL` finds users without an email.",
        whyPlausible: "In most programming languages `== null` is valid.",
        correction: "In SQL 3-valued logic, `email = NULL` evaluates to UNKNOWN (falsy). Always write `email IS NULL`.",
      },
    },
    flashcards: [
      { card_type: "Definition", front: "Name the 5 fundamental Relational Algebra operators.", back: "Selection (σ), Projection (π), Union (∪), Set Difference (−), Cartesian Product (×)." },
      { card_type: "Common Mistake", front: "Difference between COUNT(*) and COUNT(col)?", back: "COUNT(*) counts NULL rows; COUNT(col) ignores NULLs." },
    ],
  },
  // UNIT 4: Normalization & Transactions
  {
    id: "c-k4-normalization",
    chapter_id: "ch-k4-norm",
    topic_id: "t-k4-2",
    order_index: 1,
    slug: "normalization-bcnf-acid",
    title: "Functional Dependencies, Normal Forms (1NF–BCNF) & ACID",
    difficulty: "jrf",
    simulator_type: "sql_playground",
    estimated_minutes: 30,
    xp_reward: 90,
    prerequisites: ["c-sql-relational"],
    learning_objectives: [
      "Compute attribute closures X+ and find all Candidate Keys.",
      "Classify relations into 2NF, 3NF, and BCNF.",
      "Check Lossless-Join and Dependency-Preserving decompositions.",
      "Test Conflict Serializability using a Precedence Graph.",
    ],
    why_it_matters:
      "Normalization prevents update anomalies, while ACID & serializability guarantee bank-grade data consistency under concurrency.",
    level_1_beginner:
      "If you store a professor's office phone number in 500 student rows, updating that phone number requires editing 500 rows (an update anomaly)! Normalization splits tables cleanly so every fact lives in one place. Meanwhile, ACID transactions ensure a bank transfer never deducts money without crediting the receiver.",
    level_2_foundation:
      "A Functional Dependency X → Y means X uniquely determines Y. A Candidate Key K is a minimal superkey (K+ contains all attributes). 2NF eliminates partial dependencies on a candidate key; 3NF eliminates transitive dependencies; BCNF requires every non-trivial FD X → Y to have X as a superkey.",
    level_3_intermediate:
      "Decomposition of R into (R1, R2) is Lossless-Join iff (R1 ∩ R2) → R1 OR (R1 ∩ R2) → R2. Every relation has a lossless AND dependency-preserving 3NF decomposition, whereas BCNF guarantees lossless-join but may NOT preserve all dependencies.",
    level_4_jrf:
      "A schedule is Conflict Serializable iff its Precedence (Serialization) Graph is acyclic (has no cycle). Strict 2PL (holding exclusive locks until commit) guarantees both conflict serializability and cascadeless/recoverable schedules, though deadlocks are possible.",
    misconceptions: [
      "Thinking every 3NF relation can be decomposed to BCNF while preserving all FDs. False — dependency preservation is NOT always possible in BCNF!",
    ],
    pseudocode: "isLossless(R1, R2, F): common = R1 ∩ R2; return (R1 ⊆ closure(common, F)) or (R2 ⊆ closure(common, F))",
    complexity: { time: "O(|F| · |A|) for X+", space: "O(|A|)", note: "Precedence graph cycle check is O(V + E)." },
    exam_relevance: "Top UGC NET Unit 4 topic: finding candidate keys, highest normal form of R(A,B,C,D), and precedence graph serializability.",
    teaching_methods: {
      feynman_prompt: "Explain why storing redundant data causes insertion, deletion, and update anomalies.",
      feynman_keywords: ["duplicate", "update", "inconsistent", "delete", "anomaly"],
      socratic_questions: [
        { question: "In R(A, B, C) with A → B and B → C, what is the only candidate key?", hint: "Compute A+.", answer: "A+ = {A, B, C}, so A is the candidate key. Since B → C is transitive and B is not a superkey, R is in 2NF but not 3NF!" },
      ],
      faded_example: {
        title: "Check Normal Form of R(A, B, C) with AB → C, C → B",
        steps: [
          { prompt: "Candidate keys of R:", blank: "AB and AC", hint: "C determines B, so AC+ = ABC." },
          { prompt: "Is C → B allowed in 3NF? (B is prime!)", blank: "Yes, 3NF", hint: "Prime attributes on RHS satisfy 3NF." },
          { prompt: "Is C → B allowed in BCNF? (Is C a superkey?)", blank: "No, not BCNF", hint: "C+ = CB != ABC." },
        ],
      },
      prediction_challenge: {
        scenario: "Which normal form ALWAYS admits a lossless-join AND dependency-preserving decomposition?",
        options: ["3NF", "BCNF", "4NF", "5NF"],
        correct: "3NF",
        explanation: "3NF always guarantees both lossless-join and dependency preservation; BCNF can lose dependency preservation.",
      },
      compare_contrast: {
        leftTitle: "3NF",
        rightTitle: "BCNF",
        rows: [
          ["Rule for X → Y", "X is superkey OR Y is prime", "X MUST be a superkey"],
          ["Dependency Preserving?", "Always possible", "Not always possible"],
        ],
      },
      error_analysis: {
        buggyClaim: "If a schedule is Conflict Serializable, it cannot deadlock.",
        whyPlausible: "Both relate to concurrency control.",
        correction: "Conflict serializability is a property of schedule order; 2PL produces conflict-serializable schedules yet CAN still deadlock!",
      },
    },
    flashcards: [
      { card_type: "Property", front: "Condition for Lossless-Join decomposition of R into R1, R2:", back: "(R1 ∩ R2)+ must contain R1 or R2." },
      { card_type: "Definition", front: "When is a schedule Conflict Serializable?", back: "When its Precedence Graph has NO cycles (is a DAG)." },
    ],
  },
  // UNIT 5: CPU Scheduling
  {
    id: "c-cpu-scheduling",
    chapter_id: "ch-k5-sched",
    topic_id: "t-k5-1",
    order_index: 1,
    slug: "cpu-scheduling-algorithms",
    title: "CPU Scheduling: FCFS, SJF, SRTF & Round Robin",
    difficulty: "intermediate",
    simulator_type: "cpu_scheduling",
    estimated_minutes: 30,
    xp_reward: 90,
    prerequisites: [],
    learning_objectives: [
      "Compute Completion Time, Turnaround Time, and Waiting Time from a Gantt chart.",
      "Explain the Convoy Effect in FCFS and Starvation in SJF/Priority.",
      "Analyze Round Robin responsiveness as a function of time quantum q.",
    ],
    why_it_matters:
      "CPU scheduling determines system throughput, fairness, and interactive responsiveness in every OS kernel.",
    level_1_beginner:
      "Imagine one cashier at a grocery store. If someone with 100 items goes first while 3 people with 1 bottle of milk wait behind them, everyone gets frustrated (Convoy Effect!). Serving quick 1-item shoppers first (SJF) cuts average wait time. Giving everyone 2 minutes at a time (Round Robin) keeps everyone moving.",
    level_2_foundation:
      "Key metrics: Turnaround Time TAT = CT - AT; Waiting Time WT = TAT - BT; Response Time = First_Run - AT. Non-preemptive: FCFS, SJF. Preemptive: SRTF, Round Robin (RR).",
    level_3_intermediate:
      "SRTF is provably optimal for minimizing average waiting time. SJF/SRTF and Priority scheduling can starve long/low-priority jobs; Aging fixes starvation by gradually boosting priority over time.",
    level_4_jrf:
      "In Round Robin, if context-switch overhead is s and quantum is q, CPU efficiency ≈ q / (q + s). As q → ∞, RR behaves like FCFS; as q → 0, context-switch overhead dominates. Linux uses CFS (Completely Fair Scheduler) backed by a Red-Black Tree keyed by vruntime.",
    misconceptions: [
      "Thinking Round Robin minimizes average waiting time. RR minimizes RESPONSE TIME and ensures fairness, but SRTF minimizes average waiting time.",
    ],
    pseudocode: "TAT = CompletionTime - ArrivalTime\nWT  = TurnaroundTime - BurstTime",
    complexity: { time: "O(log N) in Linux CFS RB-Tree", space: "O(N) ready PCBs", note: "SJF requires burst prediction via exponential averaging." },
    exam_relevance: "Guaranteed UGC NET Unit 5 numerical: Gantt chart average WT/TAT for SRTF or Round Robin.",
    teaching_methods: {
      feynman_prompt: "Why does Round Robin feel snappy to a user typing in a text editor even when heavy background jobs are running?",
      feynman_keywords: ["quantum", "response", "turn", "preempt", "fair"],
      socratic_questions: [
        { question: "If P1(BT=24) arrives before P2(BT=3) and P3(BT=3) at t=0, what is FCFS average waiting time?", hint: "P1 waits 0, P2 waits 24, P3 waits 27.", answer: "(0 + 24 + 27) / 3 = 17 ms." },
      ],
      faded_example: {
        title: "Compute TAT & WT for P1(AT=1, BT=5, CT=9)",
        steps: [
          { prompt: "Turnaround Time = CT - AT =", blank: "8", hint: "9 - 1" },
          { prompt: "Waiting Time = TAT - BT =", blank: "3", hint: "8 - 5" },
        ],
      },
      prediction_challenge: {
        scenario: "What happens to Round Robin as the time quantum q approaches infinity?",
        options: ["Becomes FCFS", "Becomes SRTF", "Causes starvation", "Zero throughput"],
        correct: "Becomes FCFS",
        explanation: "Every process finishes within its very first quantum in arrival order, which is identical to FCFS.",
      },
      compare_contrast: {
        leftTitle: "SRTF",
        rightTitle: "Round Robin",
        rows: [
          ["Optimizes", "Average Waiting Time", "Response Time & Fairness"],
          ["Starvation?", "Possible (needs Aging)", "Starvation-free"],
        ],
      },
      error_analysis: {
        buggyClaim: "WT = CT - BT.",
        whyPlausible: "True ONLY when Arrival Time (AT) = 0.",
        correction: "Always use WT = TAT - BT = (CT - AT) - BT so non-zero arrival times are handled accurately.",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "Turnaround Time (TAT) and Waiting Time (WT):", back: "TAT = CT - AT; WT = TAT - BT." },
      { card_type: "Property", front: "Which algorithm minimizes average waiting time?", back: "SRTF (Shortest Remaining Time First)." },
    ],
  },
];
