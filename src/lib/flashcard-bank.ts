export type FlashcardCategory =
  | "Formula & Symbols"
  | "Core Concept"
  | "Exam Trap"
  | "Comparison"
  | "Complexity & Bounds"
  | "PYQ Recall"
  | "Interview";

export interface SymbolMeaning {
  symbol: string;
  name: string;
  meaning: string;
}

export interface RichFlashcard {
  id: string;
  cardNumber: number;
  conceptId: string;
  topicTitle: string;
  unitTitle: string;
  category: FlashcardCategory;
  difficulty: "Foundation" | "Exam Core" | "JRF / GATE";
  front: string;
  back: string;
  teacherNote: string;
  examTip: string;
  symbols: SymbolMeaning[];
}

export interface TopicFlashcardSeed {
  concept_id: string;
  title: string;
  slug?: string;
  kingdom_title: string;
  revision_summary: string;
  formal_definition: string;
}

export const SYMBOL_GLOSSARY: SymbolMeaning[] = [
  { symbol: "→", name: "Implies (If...Then)", meaning: "P → Q means 'If P is true, then Q must be true'. False ONLY when P is True and Q is False." },
  { symbol: "↔", name: "Biconditional (If and Only If)", meaning: "P ↔ Q is True when both P and Q have the exact same truth value." },
  { symbol: "≡", name: "Logically Equivalent / Congruent", meaning: "Both sides always produce the exact same truth table or remainder." },
  { symbol: "¬", name: "Logical NOT (Negation)", meaning: "Flips True to False and False to True (same as ! or ~)." },
  { symbol: "∨", name: "Logical OR (Disjunction)", meaning: "True if at least one operand is True." },
  { symbol: "∧", name: "Logical AND (Conjunction)", meaning: "True only when both operands are True." },
  { symbol: "⊕", name: "XOR (Exclusive OR)", meaning: "True when inputs are different (one True, one False)." },
  { symbol: "∀", name: "Universal Quantifier (For All)", meaning: "Statement holds for every single element in the domain." },
  { symbol: "∃", name: "Existential Quantifier (There Exists)", meaning: "There is at least one element in the domain for which it is True." },
  { symbol: "⊢", name: "Syntactic Turnstile (Proves)", meaning: "Can be derived step-by-step using formal inference rules." },
  { symbol: "⊨", name: "Semantic Turnstile (Entails)", meaning: "Whenever the left side is true in a model, the right side is also true." },
  { symbol: "⊆", name: "Subset or Equal", meaning: "Every element of the left set is also inside the right set." },
  { symbol: "⊂", name: "Proper Subset", meaning: "Subset, and the right set has at least one extra element." },
  { symbol: "∈", name: "Element Of", meaning: "Belongs to the set (x ∈ A means x is inside set A)." },
  { symbol: "∉", name: "Not an Element Of", meaning: "Does not belong to the set." },
  { symbol: "∪", name: "Set Union", meaning: "All elements in A, or in B, or in both." },
  { symbol: "∩", name: "Set Intersection", meaning: "Only elements that are in BOTH A and B." },
  { symbol: "∅", name: "Empty Set", meaning: "A set with zero elements (cardinality |∅| = 0)." },
  { symbol: "Σ", name: "Alphabet / Summation", meaning: "In Automata: finite set of input symbols. In Math: sum of terms." },
  { symbol: "δ", name: "Transition Function", meaning: "Rule telling an automaton which next state to go to on reading a symbol." },
  { symbol: "λ", name: "Lambda / Empty String", meaning: "In Automata: zero-length string (ε). In PL: anonymous function." },
  { symbol: "ε", name: "Epsilon (Empty String)", meaning: "String of length 0; ε-transition moves without reading input." },
  { symbol: "π", name: "Projection (Relational Algebra)", meaning: "Picks specific columns (attributes) from a database table." },
  { symbol: "σ", name: "Selection (Relational Algebra)", meaning: "Filters specific rows (tuples) that satisfy a condition." },
  { symbol: "⋈", name: "Natural Join", meaning: "Combines rows from two tables where common column values match." },
  { symbol: "ρ", name: "Rename Operator", meaning: "Renames a relation or its attributes in relational algebra." },
  { symbol: "Θ", name: "Big-Theta (Tight Bound)", meaning: "Exact asymptotic growth rate: bounded both above and below." },
  { symbol: "Ω", name: "Big-Omega (Lower Bound)", meaning: "Best-case or minimum growth rate (at least this fast/slow)." },
  { symbol: "O(", name: "Big-O (Upper Bound)", meaning: "Worst-case growth ceiling: grows no faster than this function." },
  { symbol: "≤", name: "Less Than or Equal / Reducible", meaning: "In Complexity: A ≤p B means A polynomial-time reduces to B." },
  { symbol: "≥", name: "Greater Than or Equal", meaning: "Left value is at least as large as the right value." },
  { symbol: "≠", name: "Not Equal", meaning: "Values on both sides are different." },
  { symbol: "⌊", name: "Floor Function ⌊x⌋", meaning: "Rounds x down to the nearest integer (e.g., ⌊3.9⌋ = 3)." },
  { symbol: "⌈", name: "Ceiling Function ⌈x⌉", meaning: "Rounds x up to the nearest integer (e.g., ⌈3.1⌉ = 4)." },
  { symbol: "|", name: "Cardinality / Divides / Given", meaning: "|A| is set size; a|b means a divides b; P(A|B) is probability of A given B." },
  { symbol: "^", name: "Exponent / Power", meaning: "a^b means 'a raised to the power b' (e.g., 2^n = 2 multiplied n times)." },
  { symbol: "×", name: "Cartesian Product", meaning: "All possible ordered pairs (a, b) with a ∈ A and b ∈ B." },
  { symbol: "∘", name: "Function / Relation Composition", meaning: "(f ∘ g)(x) = f(g(x)) — apply g first, then f." },
  { symbol: "⇒", name: "Derives / Implies", meaning: "In Grammars: left side rewrites to right side in one step." },
  { symbol: "∑", name: "Summation", meaning: "Add up all terms over the given index range." },
  { symbol: "∏", name: "Product", meaning: "Multiply all terms over the given index range." },
];

export function extractSymbolsFromText(text: string): SymbolMeaning[] {
  const found: SymbolMeaning[] = [];
  const seen = new Set<string>();
  for (const entry of SYMBOL_GLOSSARY) {
    if (text.includes(entry.symbol) && !seen.has(entry.symbol)) {
      seen.add(entry.symbol);
      found.push(entry);
    }
  }
  return found;
}

interface UnitAngle {
  subtopics: string[];
  formulas: { expr: string; answer: string; note: string; tip: string }[];
  traps: { trap: string; truth: string; note: string }[];
  comparisons: { a: string; b: string; diff: string; note: string }[];
  complexities: { item: string; metric: string; note: string }[];
}

const UNIT_ANGLES: Record<string, UnitAngle> = {
  "Discrete": {
    subtopics: [
      "Propositional Equivalences",
      "Predicate Quantifiers",
      "Set Identities & Power Sets",
      "Relations (Reflexive, Symmetric, Transitive)",
      "Posets & Hasse Diagrams",
      "Pigeonhole Principle",
      "Permutations & Combinations",
      "Recurrence Relations",
      "Graph Coloring & Planarity",
      "Euler & Hamiltonian Paths",
      "Groups, Rings & Monoids",
      "Boolean Algebra & Lattices",
    ],
    formulas: [
      { expr: "P → Q ≡ ¬P ∨ Q ≡ ¬Q → ¬P", answer: "Implication equals ¬P ∨ Q and its Contrapositive ¬Q → ¬P.", note: "Think of it like a promise: 'If it rains (P), I bring an umbrella (Q)'. The promise is ONLY broken when it rains AND you have no umbrella!", tip: "Converse (Q→P) and Inverse (¬P→¬Q) are NOT equivalent to P→Q." },
      { expr: "|A ∪ B| = |A| + |B| − |A ∩ B|", answer: "Inclusion-Exclusion for 2 sets prevents double-counting overlap.", note: "If 30 students like Tea and 20 like Coffee with 10 liking both, total is 30+20−10 = 40, not 50!", tip: "For 3 sets: add singles, subtract pairs, add triple intersection." },
      { expr: "|P(A)| = 2^n where n = |A|", answer: "A set with n elements has 2^n subsets in its power set.", note: "Each element has 2 choices: either it is inside the subset or it is out. Multiply 2 × 2 × ... n times = 2^n.", tip: "Proper subsets = 2^n − 1; non-empty proper subsets = 2^n − 2." },
      { expr: "v − e + f = 2 (Connected Planar Graph)", answer: "Euler's formula relates vertices (v), edges (e), and faces (f).", note: "Draw any planar map without crossing edges: Vertices minus Edges plus Regions (including outer space) always equals 2!", tip: "Simple planar graph edge bound: e ≤ 3v − 6 (or e ≤ 2v − 4 if triangle-free)." },
      { expr: "∑ deg(v) = 2|E| (Handshaking Lemma)", answer: "Sum of all vertex degrees equals twice the number of edges.", note: "Every edge has 2 endpoints, so every edge contributes 2 to the total degree count — therefore odd-degree vertices are always even in count!", tip: "Frequently tested in UGC NET graph theory MCQs." },
    ],
    traps: [
      { trap: "Assuming Converse (Q → P) equals Implication (P → Q)", truth: "Only Contrapositive (¬Q → ¬P) is equivalent to P → Q.", note: "'If you are in Delhi, you are in India' is True, but 'If you are in India, you are in Delhi' is False!" },
      { trap: "Counting ¬(∀x P(x)) as ∀x ¬P(x)", truth: "¬(∀x P(x)) ≡ ∃x ¬P(x) (De Morgan for Quantifiers).", note: "To disprove 'All students passed', you only need ONE student who failed!" },
      { trap: "Confusing Reflexive with Irreflexive", truth: "A relation can be NEITHER reflexive nor irreflexive.", note: "If some elements relate to themselves and some don't, the relation is neither reflexive nor irreflexive." },
    ],
    comparisons: [
      { a: "Euler Circuit", b: "Hamiltonian Circuit", diff: "Euler visits every EDGE once (even degrees); Hamiltonian visits every VERTEX once (NP-complete).", note: "E for Edge (Euler), H/V for Vertex (Hamiltonian)!" },
      { a: "Partial Order (Poset)", b: "Equivalence Relation", diff: "Poset is Reflexive, Antisymmetric, Transitive; Equivalence is Reflexive, Symmetric, Transitive.", note: "≤ is a Poset; = (or mod k) is an Equivalence relation." },
      { a: "Monoid", b: "Group", diff: "Monoid has closure, associativity, identity; Group adds inverse for every element.", note: "(ℕ, +) with 0 is a Monoid, while (ℤ, +) is a Group because negative numbers give inverses." },
    ],
    complexities: [
      { item: "Boolean functions of n variables", metric: "2^(2^n)", note: "n=2 gives 2^4 = 16 functions; n=3 gives 2^8 = 256 functions." },
      { item: "Number of reflexive relations on n elements", metric: "2^(n² − n)", note: "Diagonal (n pairs) are forced to 1; remaining n² − n pairs have 2 choices each." },
      { item: "Number of symmetric relations on n elements", metric: "2^(n(n+1)/2)", note: "Diagonal + upper triangle pairs decide the whole matrix." },
    ],
  },
  "Computer System": {
    subtopics: [
      "Logic Gates & Universal Gates",
      "K-Map & Minimization",
      "Combinational Circuits (MUX, Adder, Decoder)",
      "Sequential Circuits & Flip-Flops",
      "Number Systems & 2's Complement",
      "IEEE 754 Floating Point",
      "Instruction Cycle & Addressing Modes",
      "RISC vs CISC & Pipelining",
      "Pipeline Hazards & Forwarding",
      "Cache Mapping (Direct, Associative, Set-Assoc)",
      "Virtual Memory & TLB",
      "DMA & Interrupts",
    ],
    formulas: [
      { expr: "Speedup S = T_non-pipe / T_pipe ≈ k (ideal k-stage pipeline)", answer: "Ideal speedup of a k-stage pipeline is k; actual S = (k·n)/(k + n − 1).", note: "Like a 4-station car wash: one car takes 4 steps, but once full, 1 finished car rolls out every single step!", tip: "Stage delay = max(stage_i) + latch overhead." },
      { expr: "EMAT = h·(C + M) + (1 − h)·(C + M + ... ) or h·T_cache + (1−h)·T_mem", answer: "Effective Memory Access Time weights hit rate h and miss penalty.", note: "If 90% of the time you find your book on the desk (1ns) and 10% of the time you walk to the library (100ns), average = 0.9×1 + 0.1×100 = 10.9ns.", tip: "Watch whether question specifies simultaneous vs hierarchical cache lookup." },
      { expr: "2's Complement Range (n bits) = [−2^(n−1), +2^(n−1) − 1]", answer: "For 8 bits: −128 to +127, with a single unique zero.", note: "Invert all bits and add 1. Because −0 doesn't exist in 2's complement, you get one extra negative number (−128).", tip: "Overflow happens when two same-sign numbers produce an opposite-sign result." },
    ],
    traps: [
      { trap: "Thinking 2-input EXOR is universal", truth: "Only NAND and NOR are universal gates for general combinational logic.", note: "With only NAND (or only NOR), you can build NOT, AND, and OR." },
      { trap: "Forgetting 1 in IEEE 754 implicit mantissa", truth: "Normalized IEEE 754 value = (−1)^S × (1.M) × 2^(E − Bias).", note: "Single precision (32-bit): 1 sign, 8 exponent (Bias 127), 23 mantissa bits." },
    ],
    comparisons: [
      { a: "Direct Mapped Cache", b: "Set-Associative Cache", diff: "Direct maps each block to 1 fixed line (conflict misses); k-way allows k choices per set.", note: "Direct = 1 reserved parking spot; 4-way = any of 4 spots in your row." },
      { a: "Programmed I/O / Interrupt", b: "DMA (Direct Memory Access)", diff: "DMA transfers blocks directly between I/O and RAM without CPU per-byte involvement.", note: "CPU acts like a manager: gives DMA the start address & count, then does other work until done." },
    ],
    complexities: [
      { item: "n-to-2^n Decoder outputs", metric: "2^n output lines", note: "3-to-8 decoder has 3 inputs and 8 minterm outputs." },
      { item: "2^n-to-1 MUX select lines", metric: "n select lines", note: "8:1 MUX needs 3 select bits; 16:1 MUX needs 4 select bits." },
    ],
  },
  "Programming": {
    subtopics: [
      "Pointers & Pointer Arithmetic",
      "Recursion & Call Stack",
      "Storage Classes (auto, static, extern, register)",
      "OOP Polymorphism & Virtual Functions",
      "Parameter Passing (Value, Reference, Name)",
      "Memory Layout (Text, Data, Heap, Stack)",
      "HTML/CSS/DOM & Web Basics",
      "Computer Graphics Transformations",
    ],
    formulas: [
      { expr: "2D Row-Major: Addr(A[i][j]) = Base + ((i − L1)·N + (j − L2)) × size", answer: "Row-major stores one full row after another in contiguous RAM.", note: "C, C++, Java, Python use Row-Major; Fortran and MATLAB use Column-Major.", tip: "Always check if base index starts at 0 or 1 in UGC NET questions!" },
      { expr: "2D Homogeneous Rotation Matrix: [cosθ −sinθ 0; sinθ cosθ 0; 0 0 1]", answer: "3×3 homogeneous matrix combines translation, rotation, scaling via matrix multiplication.", note: "Adding the 3rd coordinate (w=1) lets us write Translation (addition) as Matrix Multiplication just like Scaling and Rotation.", tip: "Transformations are applied right-to-left in column-vector convention." },
    ],
    traps: [
      { trap: "Returning address of a local (auto) variable", truth: "Local stack frame is popped on return -> dangling pointer (UB).", note: "Use static variable or heap (malloc/new) if data must outlive the function." },
      { trap: "Forgetting virtual keyword in C++ base class", truth: "Without virtual, C++ uses static binding (base pointer calls base method).", note: "Java methods are virtual by default; C++ requires explicit 'virtual' for runtime polymorphism." },
    ],
    comparisons: [
      { a: "Call by Value", b: "Call by Reference", diff: "Value copies the argument; Reference passes an alias/address so caller's variable changes.", note: "Call by Value is like sending a photocopy; Call by Reference is sharing the Google Doc!" },
      { a: "Stack Memory", b: "Heap Memory", diff: "Stack is automatic LIFO for function frames; Heap is manual/GC dynamic allocation.", note: "Stack is fast and bounded; Heap is larger but risks fragmentation or leaks." },
    ],
    complexities: [
      { item: "Static variable lifetime", metric: "Entire program execution", note: "Initialized only once; retains value across function calls." },
      { item: "Tail Recursion space (with TCO)", metric: "O(1) stack space", note: "When recursive call is the very last operation, compiler can reuse the same stack frame." },
    ],
  },
  "Database": {
    subtopics: [
      "ER Model & Cardinality",
      "Relational Algebra (σ, π, ⋈, ÷)",
      "SQL Joins, Group By & Subqueries",
      "Functional Dependencies & Closure (X+)",
      "Normal Forms (1NF, 2NF, 3NF, BCNF, 4NF)",
      "Lossless Join & Dependency Preservation",
      "ACID Properties & Schedules",
      "Conflict Serializability & 2PL",
      "B-Tree & B+ Tree Indexing",
      "Data Warehousing & OLAP",
    ],
    formulas: [
      { expr: "Lossless Join Decomposition R = R1 ∪ R2 iff (R1 ∩ R2) → R1 OR (R1 ∩ R2) → R2", answer: "Common attributes must be a superkey of at least one decomposed table.", note: "If you split a table and the shared column isn't unique in either half, joining them back creates fake ghost rows!", tip: "BCNF is always lossless, though not always dependency-preserving." },
      { expr: "σ_cond(R), π_cols(R), R ⋈ S", answer: "σ selects rows, π projects columns, ⋈ joins on matching common columns.", note: "Easy trick: σ (sigma) = Select rows; π (pi) = Pick columns!", tip: "π removes duplicate rows in pure Relational Algebra (unlike SQL SELECT without DISTINCT)." },
    ],
    traps: [
      { trap: "WHERE vs HAVING in SQL", truth: "WHERE filters individual rows BEFORE GROUP BY; HAVING filters groups AFTER GROUP BY.", note: "You cannot put aggregate functions like COUNT(*) > 2 inside WHERE — always use HAVING." },
      { trap: "Assuming 3NF = BCNF", truth: "BCNF requires LHS of EVERY non-trivial FD X→Y to be a superkey; 3NF also allows Y to be prime.", note: "Every BCNF table is in 3NF, but not every 3NF table is in BCNF." },
    ],
    comparisons: [
      { a: "B-Tree", b: "B+ Tree", diff: "B-Tree stores data pointers in internal & leaf nodes; B+ Tree stores all data pointers only in linked leaves.", note: "B+ Tree leaves are linked like a chain, making SQL range queries (BETWEEN) super fast!" },
      { a: "Strict 2PL", b: "Basic 2PL", diff: "Strict 2PL holds all exclusive (X) locks until commit/abort, preventing cascading rollbacks.", note: "Basic 2PL guarantees conflict serializability, Strict 2PL adds recoverability." },
    ],
    complexities: [
      { item: "Max keys in B+ Tree node of order p", metric: "p − 1 keys (p children)", note: "Internal node has at least ⌈p/2⌉ children." },
      { item: "Conflict Serializability check", metric: "O(V + E) via Precedence Graph", note: "If the precedence graph has NO cycle, the schedule is conflict serializable." },
    ],
  },
  "Operating System": {
    subtopics: [
      "Process States & PCB",
      "CPU Scheduling (FCFS, SJF, SRTF, RR)",
      "Threads (User vs Kernel)",
      "Critical Section & Semaphores",
      "Deadlock (4 Conditions & Banker's Algo)",
      "Paging, Page Faults & Belady's Anomaly",
      "Page Replacement (FIFO, LRU, Optimal)",
      "Disk Scheduling (SCAN, C-SCAN, SSTF)",
      "File Allocation & Inodes",
    ],
    formulas: [
      { expr: "TAT = Completion − Arrival; WT = TAT − Burst", answer: "Turnaround Time is total time in system; Waiting Time is time spent waiting in ready queue.", note: "Think of a clinic: Arrival to Exit = Turnaround Time. Subtract the doctor's checkup time (Burst) = Waiting Time!", tip: "SRTF gives minimum average waiting time among all scheduling algorithms." },
      { expr: "Deadlock Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", answer: "All 4 Coffman conditions must hold simultaneously for deadlock.", note: "Break ANY one of the 4 legs of the table and deadlock collapses!", tip: "Resource ordering breaks Circular Wait." },
    ],
    traps: [
      { trap: "Expecting more RAM frames to always reduce FIFO page faults", truth: "FIFO suffers from Belady's Anomaly (more frames can cause MORE faults).", note: "LRU and Optimal are stack algorithms, so they NEVER suffer from Belady's Anomaly." },
      { trap: "Thinking semaphore wait() never blocks", truth: "wait(S) decrements S; if S < 0, the process sleeps in the waiting queue.", note: "Binary semaphore = 0/1 (mutex-like); Counting semaphore = resource count." },
    ],
    comparisons: [
      { a: "Paging", b: "Segmentation", diff: "Paging uses fixed-size frames (no external fragmentation); Segmentation uses logical variable-size units.", note: "Paging = cutting a book into equal 10-page chunks; Segmentation = chapters of different lengths." },
      { a: "SCAN (Elevator)", b: "C-SCAN (Circular SCAN)", diff: "SCAN reverses direction at both ends; C-SCAN jumps back to start for uniform wait time.", note: "C-SCAN treats disk cylinders like a circular loop, avoiding starvation at edges." },
    ],
    complexities: [
      { item: "Banker's Algorithm safety check", metric: "O(m · n²) for n processes, m resource types", note: "Finds a safe sequence where Need[i] ≤ Work for every process." },
      { item: "Page table lookup with TLB", metric: "O(1) on TLB hit", note: "Without TLB, multi-level paging requires k+1 memory accesses." },
    ],
  },
  "Software Engineering": {
    subtopics: [
      "SDLC Models (Waterfall, Spiral, Agile)",
      "SRS & Requirements Engineering",
      "Cohesion & Coupling",
      "COCOMO Estimation",
      "Cyclomatic Complexity V(G)",
      "Black-Box vs White-Box Testing",
      "Verification vs Validation",
      "CMMI Levels & Risk Management",
    ],
    formulas: [
      { expr: "V(G) = E − N + 2 = P + 1 = Regions", answer: "McCabe's Cyclomatic Complexity counts independent linear paths in CFG.", note: "Every if/while/for decision node adds 1 extra branch path: V(G) = predicate nodes + 1!", tip: "V(G) gives the minimum number of test cases for 100% branch coverage." },
      { expr: "COCOMO Effort E = a · (KLOC)^b", answer: "Estimates person-months from Thousands of Lines of Code (KLOC).", note: "Organic (small/familiar): a=2.4, b=1.05. Semi-detached: a=3.0, b=1.12. Embedded: a=3.6, b=1.20.", tip: "Higher coupling = worse; higher cohesion = better!" },
    ],
    traps: [
      { trap: "Confusing Verification and Validation", truth: "Verification: 'Are we building the product RIGHT?' Validation: 'Are we building the RIGHT product?'", note: "Verification = static reviews/specs; Validation = dynamic testing against user needs." },
      { trap: "Wanting High Coupling", truth: "Goal is LOW Coupling (independent modules) and HIGH Cohesion (focused module).", note: "Functional Cohesion is best; Content Coupling is worst." },
    ],
    comparisons: [
      { a: "Alpha Testing", b: "Beta Testing", diff: "Alpha is at developer site by internal users; Beta is at customer site by real end-users.", note: "Alpha happens before Beta release." },
      { a: "Equivalence Partitioning", b: "Boundary Value Analysis", diff: "Equivalence groups valid/invalid inputs; BVA specifically tests edges (min, min+1, max-1, max).", note: "Bugs love hiding right on boundaries like 0, 1, 99, 100!" },
    ],
    complexities: [
      { item: "CMMI Maturity Levels", metric: "5 Levels (Initial -> Optimizing)", note: "1: Initial, 2: Managed, 3: Defined, 4: Quantitatively Managed, 5: Optimizing." },
    ],
  },
  "Data Structures": {
    subtopics: [
      "Asymptotic Notation (O, Θ, Ω)",
      "Master Theorem & Recurrences",
      "Arrays, Linked Lists & Pointers",
      "Stacks, Queues & Priority Queues",
      "BST, AVL & Red-Black Trees",
      "Heaps & Heap Sort",
      "Hashing & Collision Resolution",
      "BFS, DFS & Topological Sort",
      "Dijkstra, Bellman-Ford & Floyd-Warshall",
      "Kruskal, Prim & Dynamic Programming",
    ],
    formulas: [
      { expr: "T(n) = aT(n/b) + f(n) (Master Theorem)", answer: "Compare f(n) against n^(log_b a) to find asymptotic Θ bound.", note: "Think of it as a tug-of-war between leaf work n^(log_b a) and root work f(n): whichever grows faster wins; if tied, multiply by log n!", tip: "Merge Sort: a=2, b=2, f(n)=n -> Case 2 -> Θ(n log n)." },
      { expr: "Catalan C_n = (1/(n+1)) · C(2n, n)", answer: "Counts structurally distinct BSTs with n nodes and valid parenthesis strings.", note: "For n=3 keys, C_3 = (1/4) × 20 = 5 distinct BST shapes!", tip: "Also equals number of full binary trees with n+1 leaves." },
    ],
    traps: [
      { trap: "Using Dijkstra on negative edge weights", truth: "Dijkstra fails on negative edges; use Bellman-Ford (O(VE)) instead.", note: "Dijkstra greedily locks finalized vertices assuming path lengths only grow." },
      { trap: "Deleting last node in Singly Linked List with tail pointer", truth: "Still takes O(n) because you must find the node BEFORE tail!", note: "Doubly Linked List fixes this to O(1) using tail.prev." },
    ],
    comparisons: [
      { a: "BFS (Queue)", b: "DFS (Stack / Recursion)", diff: "BFS finds shortest path in unweighted graphs; DFS detects cycles and does topological sort.", note: "BFS explores ripple-by-ripple like water; DFS dives deep down one tunnel first." },
      { a: "Quick Sort", b: "Merge Sort", diff: "Quick Sort is in-place O(n log n) avg / O(n²) worst; Merge Sort is stable O(n log n) always with O(n) extra space.", note: "Merge Sort is preferred for Linked Lists; Quick Sort for arrays in cache." },
    ],
    complexities: [
      { item: "Build-Heap on n elements", metric: "O(n) bottom-up", note: "Most nodes are near leaves and sift down very little!" },
      { item: "AVL Tree Search / Insert / Delete", metric: "O(log n) worst-case", note: "Balance factor at every node is restricted to {-1, 0, +1}." },
    ],
  },
  "Theory of Computation": {
    subtopics: [
      "DFA, NFA & Epsilon-NFA",
      "Regular Expressions & Pumping Lemma",
      "Myhill-Nerode Theorem",
      "CFG, Ambiguity & Chomsky Normal Form",
      "Pushdown Automata (DPDA vs NPDA)",
      "Turing Machines & Decidability",
      "Halting Problem & Rice's Theorem",
      "Chomsky Hierarchy & Closure Properties",
    ],
    formulas: [
      { expr: "DFA = (Q, Σ, δ, q₀, F), δ: Q × Σ → Q", answer: "5-tuple where every state has exactly 1 transition per input symbol.", note: "Q = states, Σ = alphabet, δ = transition rule, q₀ = start state, F = accepting final states.", tip: "Every NFA can be converted to DFA, possibly up to 2^n states." },
      { expr: "L(G) in Chomsky Hierarchy: Type 3 ⊂ Type 2 ⊂ Type 1 ⊂ Type 0", answer: "Regular ⊂ Context-Free ⊂ Context-Sensitive ⊂ Recursively Enumerable.", note: "Memory power grows up the ladder: DFA (no stack) -> PDA (1 stack) -> LBA (bounded tape) -> TM (infinite tape).", tip: "Context-Free Languages are NOT closed under Intersection or Complement!" },
    ],
    traps: [
      { trap: "Thinking Pumping Lemma proves a language IS regular", truth: "Pumping Lemma only proves a language is NOT regular (via contradiction).", note: "Failing to pump = Non-Regular. Passing pump test ≠ guaranteed Regular!" },
      { trap: "Assuming DPDA = NPDA in power", truth: "NPDA is strictly more powerful than DPDA (e.g., even-length palindromes need NPDA).", note: "Unlike DFA = NFA, determinism weakens PDAs!" },
    ],
    comparisons: [
      { a: "Recursive (Decidable)", b: "Recursively Enumerable (Semi-decidable)", diff: "Recursive TMs always halt (accept or reject); RE TMs may loop forever on rejected inputs.", note: "Halting Problem is RE, NOT Recursive!" },
      { a: "LL(1) Top-Down Parser", b: "LALR(1) Bottom-Up Parser", diff: "LL(1) cannot handle left recursion; LR/LALR(1) handles left recursion and larger grammar class.", note: "CLR(1) > LALR(1) > SLR(1) > LL(1) in grammar power." },
    ],
    complexities: [
      { item: "CYK Membership Algorithm for CFG in CNF", metric: "O(n³ · |G|)", note: "Uses dynamic programming table on Chomsky Normal Form." },
    ],
  },
  "Data Communication": {
    subtopics: [
      "OSI 7 Layers & TCP/IP Model",
      "Framing, Error Detection (CRC, Hamming)",
      "Stop-and-Wait, Go-Back-N, Selective Repeat",
      "CSMA/CD & CSMA/CA",
      "IPv4 Subnetting & CIDR",
      "Routing (Distance Vector vs Link State)",
      "TCP Congestion Control & 3-Way Handshake",
      "DNS, HTTP, SMTP, Cryptography & RSA",
    ],
    formulas: [
      { expr: "Efficiency η = 1 / (1 + 2a) where a = T_prop / T_trans", answer: "Stop-and-Wait utilization drops when propagation delay is large.", note: "If it takes 1 sec to put a letter in the postbox (T_trans) and 10 sec to travel (T_prop), waiting for reply wastes 20 sec!", tip: "Sliding Window with W = 1 + 2a achieves ~100% utilization." },
      { expr: "Hamming Distance d_min ≥ 2t + 1 (correct t errors), d_min ≥ d + 1 (detect d)", answer: "Minimum Hamming distance determines error detection and correction power.", note: "To detect 1-bit error need d_min=2; to correct 1-bit error need d_min=3.", tip: "Check parity bits r: 2^r ≥ m + r + 1." },
    ],
    traps: [
      { trap: "Confusing Go-Back-N and Selective Repeat window size", truth: "With k-bit sequence numbers: GBN max sender window = 2^k − 1; SR max = 2^(k−1).", note: "If SR uses > half the sequence space, old and new frames overlap ambiguously!" },
      { trap: "Using CSMA/CD in Wi-Fi", truth: "Ethernet uses CSMA/CD (collision detection); Wi-Fi uses CSMA/CA (collision avoidance).", note: "Wireless radios cannot transmit and listen for collisions on the same frequency simultaneously." },
    ],
    comparisons: [
      { a: "Distance Vector (RIP / Bellman-Ford)", b: "Link State (OSPF / Dijkstra)", diff: "Distance Vector shares table with neighbors (count-to-infinity risk); Link State floods topology to all.", note: "OSPF converges faster and avoids count-to-infinity." },
      { a: "TCP", b: "UDP", diff: "TCP is connection-oriented, reliable, ordered; UDP is connectionless, low-overhead, best-effort.", note: "Video streaming/DNS queries prefer UDP; HTTP/File transfer use TCP." },
    ],
    complexities: [
      { item: "RSA Private Key d", metric: "e · d ≡ 1 (mod φ(n)), φ(n) = (p−1)(q−1)", note: "Security relies on hardness of factoring n = p × q." },
    ],
  },
  "Artificial Intelligence": {
    subtopics: [
      "Uninformed Search (BFS, DFS, IDS)",
      "Informed Search (A*, Greedy Best-First)",
      "Adversarial Search & Alpha-Beta Pruning",
      "Propositional & First-Order Logic Resolution",
      "Bayes' Theorem & Bayesian Networks",
      "Fuzzy Logic & Membership Functions",
      "ANN, Perceptron & Backpropagation",
      "Genetic Algorithms (Selection, Crossover, Mutation)",
    ],
    formulas: [
      { expr: "f(n) = g(n) + h(n) (A* Search)", answer: "g(n) is actual cost so far; h(n) is estimated heuristic cost to goal.", note: "A* balances where you've already walked (g) with how far the goal looks (h). If h never overestimates (admissible), A* guarantees the shortest path!", tip: "Consistent heuristic guarantees optimality even in graph search." },
      { expr: "P(A|B) = [P(B|A) · P(A)] / P(B)", answer: "Bayes' Rule updates prior belief P(A) into posterior P(A|B) given evidence B.", note: "Start with base rate P(A), multiply by how well A explains the evidence P(B|A), and normalize by P(B).", tip: "Naive Bayes assumes features are conditionally independent given the class." },
    ],
    traps: [
      { trap: "Thinking single-layer Perceptron can solve XOR", truth: "Perceptron can only classify linearly separable data; XOR needs >= 2 layers (MLP).", note: "Minsky & Papert famously proved single-layer perceptrons fail on XOR." },
      { trap: "Assuming Fuzzy membership means probability", truth: "Fuzzy values measure degree of truth (0 to 1) and do NOT have to sum to 1.", note: "An element can be 0.7 'Tall' and 0.4 'Medium' at the same time!" },
    ],
    comparisons: [
      { a: "BFS", b: "Iterative Deepening DFS (IDDFS)", diff: "Both are complete & optimal for unit step costs, but IDDFS uses O(bd) space vs BFS O(b^d).", note: "IDDFS gives BFS optimality with DFS tiny memory footprint!" },
      { a: "Forward Chaining", b: "Backward Chaining", diff: "Forward is data-driven (facts -> goal); Backward is goal-driven (goal -> facts).", note: "Prolog uses Backward Chaining." },
    ],
    complexities: [
      { item: "Alpha-Beta Pruning best-case nodes", metric: "O(b^(d/2)) vs Minimax O(b^d)", note: "Good move ordering doubles the searchable game-tree depth!" },
    ],
  },
};

function resolveUnitAngle(kingdomTitle: string): UnitAngle {
  for (const key of Object.keys(UNIT_ANGLES)) {
    if (kingdomTitle.toLowerCase().includes(key.toLowerCase())) {
      return UNIT_ANGLES[key];
    }
  }
  return UNIT_ANGLES["Discrete"];
}

const CATEGORIES: FlashcardCategory[] = [
  "Formula & Symbols",
  "Core Concept",
  "Exam Trap",
  "Comparison",
  "Complexity & Bounds",
  "PYQ Recall",
  "Interview",
];

function cleanSentence(s: string): string {
  return (s || "").replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  return cleanSentence(text)
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 12);
}

/**
 * Deterministically generates `count` (default 520) rich, varied, topic-grounded
 * flashcards for ANY of the 90 CS topics, each with plain-English teacher notes
 * and automatic symbol decoding.
 */
export function generateTopicFlashcards(
  topic: TopicFlashcardSeed,
  count = 520
): RichFlashcard[] {
  const angle = resolveUnitAngle(topic.kingdom_title);
  const summarySentences = splitSentences(topic.revision_summary);
  const defSentences = splitSentences(topic.formal_definition);
  const baseSummary = cleanSentence(topic.revision_summary) || `${topic.title} is a core pillar of ${topic.kingdom_title}.`;
  const baseDef = cleanSentence(topic.formal_definition) || baseSummary;

  const cards: RichFlashcard[] = [];

  for (let i = 0; i < count; i++) {
    const cardNumber = i + 1;
    const category = CATEGORIES[i % CATEGORIES.length];
    const subtopic = angle.subtopics[i % angle.subtopics.length];
    const formula = angle.formulas[i % angle.formulas.length];
    const trap = angle.traps[i % angle.traps.length];
    const comp = angle.comparisons[i % angle.comparisons.length];
    const cx = angle.complexities[i % angle.complexities.length];
    const summaryPiece =
      summarySentences.length > 0
        ? summarySentences[i % summarySentences.length]
        : baseSummary;
    const defPiece =
      defSentences.length > 0 ? defSentences[i % defSentences.length] : baseDef;

    const difficulty: RichFlashcard["difficulty"] =
      i % 3 === 0 ? "Foundation" : i % 3 === 1 ? "Exam Core" : "JRF / GATE";

    const round = Math.floor(i / CATEGORIES.length) + 1;

    let front = "";
    let back = "";
    let teacherNote = "";
    let examTip = "";

    if (category === "Formula & Symbols") {
      if (i < 7) {
        front = `[${topic.title}] Decode this core formal statement & its symbols:\n\n${baseDef}`;
        back = `${summaryPiece}\n\nFormal Rule: ${baseDef}`;
        teacherNote = `Simple words: Don't get scared by the math symbols! Read each symbol from the Symbol Key below left-to-right like an English sentence about ${topic.title}.`;
        examTip = `UGC NET often tests the exact negation or contrapositive of ${topic.title} rules.`;
      } else {
        front = `[${topic.title} • ${subtopic}] Explain the meaning & symbols of:\n\n${formula.expr}`;
        back = formula.answer;
        teacherNote = `${formula.note} (Connecting this to ${topic.title}: ${summaryPiece})`;
        examTip = formula.tip;
      }
    } else if (category === "Core Concept") {
      const prompts = [
        `In simple words, what is the core idea behind "${topic.title}" (${subtopic})?`,
        `Why do we need "${topic.title}" when studying ${subtopic}?`,
        `Summarize the key rule of "${topic.title}" (Focus #${round}: ${subtopic}).`,
        `How does "${subtopic}" work inside "${topic.title}"?`,
      ];
      front = prompts[round % prompts.length];
      back = `${summaryPiece}\n\nFormal Anchor: ${defPiece}`;
      teacherNote = `Imagine explaining "${topic.title}" to a friend over chai: ${summaryPiece} Keep the formal rule "${defPiece}" as your exam anchor.`;
      examTip = `Link "${subtopic}" directly with "${topic.title}" keywords when eliminating MCQ options.`;
    } else if (category === "Exam Trap") {
      front = `⚠️ Exam Trap in ${topic.title} (${subtopic}):\nIs it safe to assume: "${trap.trap}"?`;
      back = `NO! ${trap.truth}`;
      teacherNote = `${trap.note} Remember this while solving "${topic.title}" questions so you never lose −10 XP or exam marks on tricky wording!`;
      examTip = `Check boundary conditions & quantifiers ("always", "only if", "never") in ${topic.title} MCQs.`;
    } else if (category === "Comparison") {
      front = `Compare in ${topic.title} (${subtopic}):\n${comp.a}  vs  ${comp.b}`;
      back = comp.diff;
      teacherNote = `${comp.note} Always ask yourself: in "${topic.title}", which one trades space/speed or guarantees correctness?`;
      examTip = `Match-the-following questions in UGC NET Paper-II love contrasting ${comp.a} with ${comp.b}.`;
    } else if (category === "Complexity & Bounds") {
      front = `Bound / Metric Check (${topic.title} • ${subtopic}):\nWhat is the standard bound or count for "${cx.item}"?`;
      back = `${cx.metric}\n\nContext: ${defPiece}`;
      teacherNote = `${cx.note} Memorize "${cx.item} -> ${cx.metric}" — numericals in ${topic.kingdom_title} frequently plug straight into this formula.`;
      examTip = `Double check base-2 logarithms, off-by-one (−1), and worst-case vs average-case assumptions.`;
    } else if (category === "PYQ Recall") {
      const pyqAngles = [
        `PYQ Style (#${cardNumber}): Which property of "${topic.title}" is highlighted by: "${defPiece}"?`,
        `UGC NET / GATE Recall (#${cardNumber}): In "${subtopic}" under ${topic.title}, what happens if the primary invariant is violated?`,
        `Assertion-Reason Check (#${cardNumber}): True or False — "${summaryPiece}" holds for ${topic.title}.`,
      ];
      front = pyqAngles[round % pyqAngles.length];
      back = `Verified Core Fact: ${summaryPiece}\n\nFormal Statement: ${defPiece}`;
      teacherNote = `Whenever you see a long Assertion-Reason question on ${topic.title}, break it into two independent checks: (1) is the formal definition "${defPiece}" true? (2) does it actually explain ${subtopic}?`;
      examTip = `Previous year papers repeat core invariants of ${topic.title} with fresh numerical values.`;
    } else {
      // Interview
      const interviewAngles = [
        `Corporate Interview (#${cardNumber}): How would you explain "${topic.title}" (${subtopic}) to a junior engineer without jargon?`,
        `System Design / Debug (#${cardNumber}): Where does "${topic.title}" matter in production systems (${subtopic})?`,
        `Rapid-Fire Check (#${cardNumber}): State one trade-off and one edge case of "${topic.title}" in ${subtopic}.`,
      ];
      front = interviewAngles[round % interviewAngles.length];
      back = `${summaryPiece}\n\nKey Trade-off / Rule: ${comp.diff}`;
      teacherNote = `Interviewers don't just want textbook definitions — start with a 1-line intuition ("${summaryPiece}"), then mention the edge case ("${trap.truth}").`;
      examTip = `Keep your answer crisp: Definition -> Example -> Complexity/Edge Case.`;
    }

    const combinedText = `${front}\n${back}\n${teacherNote}`;
    const symbols = extractSymbolsFromText(combinedText);

    cards.push({
      id: `${topic.concept_id}__fc_${cardNumber}`,
      cardNumber,
      conceptId: topic.concept_id,
      topicTitle: topic.title,
      unitTitle: topic.kingdom_title,
      category,
      difficulty,
      front,
      back,
      teacherNote,
      examTip,
      symbols,
    });
  }

  return cards;
}
