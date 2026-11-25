export interface KingdomSeed {
  id: string;
  order_index: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  theme_color: string;
  illustration_key: string;
  map_x: number;
  map_y: number;
  unlock_xp: number;
  syllabus_verified: boolean;
}

export interface ChapterSeed {
  id: string;
  kingdom_id: string;
  order_index: number;
  slug: string;
  title: string;
  summary: string;
  boss_title: string;
  estimated_minutes: number;
  topics: { id: string; title: string; subtopics: string[] }[];
}

export interface ConceptSeed {
  id: string;
  chapter_id: string;
  topic_id: string;
  order_index: number;
  slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "jrf";
  simulator_type:
    | "linked_list"
    | "cpu_scheduling"
    | "sql_playground"
    | "automata_dfa"
    | "sorting_arena"
    | "logic_gates"
    | "graph_search"
    | "none";
  content_status: "authored" | "needs_verification";
  estimated_minutes: number;
  xp_reward: number;
  prerequisites: string[];
  lesson: {
    discover_story: string;
    understand_intuition: string;
    formal_definition: string;
    examples: { title: string; problem: string; walkthrough: string }[];
    properties: string[];
    edge_cases: string[];
    applications: string[];
    revision_summary: string;
  };
}

export interface PuzzleSeed {
  id: string;
  concept_id: string | null;
  kingdom_id: string;
  title: string;
  prompt: string;
  puzzle_type:
    | "pointer_trace"
    | "scheduling"
    | "sql_query"
    | "automata"
    | "logic_gate"
    | "sequence"
    | "code_debug";
  difficulty: "easy" | "medium" | "hard";
  config: Record<string, unknown>;
  solution: Record<string, unknown>;
  hints: string[];
  xp_reward: number;
}

export interface QuestionSeed {
  id: string;
  kingdom_id: string;
  chapter_id: string | null;
  concept_id: string | null;
  prompt: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard" | "jrf";
  is_pyq: boolean;
  pyq_label?: string;
  xp_reward: number;
  options: { label: string; text: string; is_correct: boolean }[];
}

export const KINGDOMS: KingdomSeed[] = [
  {
    id: "k1-discrete",
    order_index: 1,
    slug: "discrete-structures",
    title: "Discrete Structures & Optimization",
    subtitle: "The Citadel of Logic & Bridges",
    description:
      "Mathematical Logic, Sets & Relations, Counting, Group Theory, Graph Theory, Boolean Algebra, and Linear Programming.",
    theme_color: "#91AFC0",
    illustration_key: "citadel",
    map_x: 18,
    map_y: 24,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k2-csa",
    order_index: 2,
    slug: "computer-system-architecture",
    title: "Computer System Architecture",
    subtitle: "The Clockwork Processor Keep",
    description:
      "Digital Logic Circuits, Data Representation, Register Transfer, Microprogrammed Control, CPU Pipelining, and Memory Hierarchy.",
    theme_color: "#D5AE65",
    illustration_key: "clockwork",
    map_x: 42,
    map_y: 22,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k3-prog",
    order_index: 3,
    slug: "programming-and-graphics",
    title: "Programming Languages & Graphics",
    subtitle: "The Artisan's Scroll Village",
    description:
      "C, C++, Object-Oriented Programming, Web Programming, 2D/3D Transformations, Clipping, and Viewing Pipelines.",
    theme_color: "#BD8068",
    illustration_key: "village",
    map_x: 65,
    map_y: 20,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k4-dbms",
    order_index: 4,
    slug: "database-management-systems",
    title: "Database Management Systems",
    subtitle: "The Ancient Data Vaults",
    description:
      "ER Model, Relational Algebra & Calculus, SQL, Normalization (1NF–BCNF–5NF), Transactions, Concurrency Control, and NoSQL/Big Data.",
    theme_color: "#718568",
    illustration_key: "library",
    map_x: 84,
    map_y: 26,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k5-os",
    order_index: 5,
    slug: "operating-systems",
    title: "System Software & Operating Systems",
    subtitle: "The Scheduler's Gearworks",
    description:
      "Process Management, CPU Scheduling, Synchronization & Deadlocks, Memory Management, Virtual Memory, File Systems, and Distributed OS.",
    theme_color: "#91AFC0",
    illustration_key: "gearworks",
    map_x: 16,
    map_y: 54,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k6-se",
    order_index: 6,
    slug: "software-engineering",
    title: "Software Engineering",
    subtitle: "The Blueprint Pavilion",
    description:
      "Process Models (Agile, Spiral), Requirements Engineering, Software Design, Testing Strategies, Estimation (COCOMO), and Quality Assurance.",
    theme_color: "#D5AE65",
    illustration_key: "pavilion",
    map_x: 34,
    map_y: 56,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k7-dsa",
    order_index: 7,
    slug: "data-structures-and-algorithms",
    title: "Data Structures & Algorithms",
    subtitle: "The Forest of Trees & Paths",
    description:
      "Arrays, Linked Lists, Stacks, Queues, Trees, Heaps, Graphs, Hashing, Asymptotic Analysis, Dynamic Programming, Greedy, and NP-Completeness.",
    theme_color: "#718568",
    illustration_key: "forest",
    map_x: 64,
    map_y: 54,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k8-toc",
    order_index: 8,
    slug: "theory-of-computation-compilers",
    title: "Theory of Computation & Compilers",
    subtitle: "The Automata Observatory",
    description:
      "Finite Automata, Regular Languages, Context-Free Grammars, Pushdown Automata, Turing Machines, Decidability, Lexical/Syntax/Semantic Analysis, Code Optimization.",
    theme_color: "#BD8068",
    illustration_key: "observatory",
    map_x: 84,
    map_y: 56,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k9-cn",
    order_index: 9,
    slug: "computer-networks",
    title: "Data Communication & Networks",
    subtitle: "The Archipelago of Signals",
    description:
      "OSI & TCP/IP Models, Physical & Data Link Layers, MAC Protocols, IPv4/IPv6 Routing, TCP/UDP Congestion Control, DNS/HTTP, Network Security.",
    theme_color: "#91AFC0",
    illustration_key: "archipelago",
    map_x: 28,
    map_y: 80,
    unlock_xp: 0,
    syllabus_verified: true,
  },
  {
    id: "k10-ai",
    order_index: 10,
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    subtitle: "The Heuristic Sanctuary",
    description:
      "State Space Search (BFS, DFS, A*, Alpha-Beta), Knowledge Representation, First-Order Logic, Planning, Fuzzy Logic, Genetic Algorithms, Neural Networks & NLP.",
    theme_color: "#D5AE65",
    illustration_key: "sanctuary",
    map_x: 72,
    map_y: 80,
    unlock_xp: 0,
    syllabus_verified: true,
  },
];

export const CHAPTERS: ChapterSeed[] = [
  // K1: Discrete Structures
  {
    id: "ch-k1-logic",
    kingdom_id: "k1-discrete",
    order_index: 1,
    slug: "mathematical-logic",
    title: "Mathematical Logic & Proofs",
    summary: "Propositional logic, equivalences, normal forms, predicates, quantifiers, and rules of inference.",
    boss_title: "The Syllogism Warden",
    estimated_minutes: 50,
    topics: [
      { id: "t-k1-1", title: "Propositional & Predicate Logic", subtopics: ["Truth Tables & Tautologies", "CNF & DNF", "First-Order Quantifiers", "Rules of Inference"] },
    ],
  },
  {
    id: "ch-k1-graphs",
    kingdom_id: "k1-discrete",
    order_index: 2,
    slug: "sets-relations-graphs",
    title: "Sets, Relations, Counting & Graphs",
    summary: "POSETs, Lattices, Pigeonhole Principle, Recurrence Relations, Eulerian/Hamiltonian Graphs, Planar Graphs & Coloring.",
    boss_title: "The Konigsberg Bridge Keeper",
    estimated_minutes: 65,
    topics: [
      { id: "t-k1-2", title: "Graph Theory & Combinatorics", subtopics: ["Handshaking Lemma", "Euler & Hamilton Paths", "Chromatic Number", "Generating Functions"] },
    ],
  },
  {
    id: "ch-k1-opt",
    kingdom_id: "k1-discrete",
    order_index: 3,
    slug: "groups-and-optimization",
    title: "Group Theory & Linear Programming",
    summary: "Groups, Subgroups, Lagrange's Theorem, Simplex Method, Duality, Transportation & Assignment Problems.",
    boss_title: "The Simplex Architect",
    estimated_minutes: 55,
    topics: [
      { id: "t-k1-3", title: "Algebra & Optimization", subtopics: ["Abelian Groups & Rings", "Simplex Algorithm", "PERT/CPM"] },
    ],
  },

  // K2: CSA
  {
    id: "ch-k2-digital",
    kingdom_id: "k2-csa",
    order_index: 1,
    slug: "digital-logic-circuits",
    title: "Digital Logic & Number Systems",
    summary: "Logic gates, K-map minimization, Combinational & Sequential circuits, IEEE-754 floating point, Booth's algorithm.",
    boss_title: "The Karnaugh Alchemist",
    estimated_minutes: 55,
    topics: [
      { id: "t-k2-1", title: "Boolean & Sequential Logic", subtopics: ["K-Map Reduction", "Multiplexers & Decoders", "Flip-Flops & Counters", "2's Complement & IEEE-754"] },
    ],
  },
  {
    id: "ch-k2-pipeline",
    kingdom_id: "k2-csa",
    order_index: 2,
    slug: "cpu-pipelining-memory",
    title: "CPU Pipelining & Memory Hierarchy",
    summary: "Instruction cycle, RISC vs CISC, Pipeline hazards, Cache mapping (Direct, Associative, Set-Associative), Virtual memory & DMA.",
    boss_title: "The Pipeline Overseer",
    estimated_minutes: 60,
    topics: [
      { id: "t-k2-2", title: "Pipelining & Cache", subtopics: ["Speedup & Hazards", "Cache Hit Ratio & AMAT", "Interrupts & DMA"] },
    ],
  },

  // K3: Programming & Graphics
  {
    id: "ch-k3-prog",
    kingdom_id: "k3-prog",
    order_index: 1,
    slug: "c-cpp-oop",
    title: "C, C++ & Object-Oriented Paradigms",
    summary: "Pointers, recursion, storage classes, virtual functions, polymorphism, templates, and exception handling.",
    boss_title: "The Virtual Table Sage",
    estimated_minutes: 55,
    topics: [
      { id: "t-k3-1", title: "Memory, Pointers & OOP", subtopics: ["Pointer Arithmetic", "Vtables & Dynamic Binding", "Parameter Passing"] },
    ],
  },
  {
    id: "ch-k3-graphics",
    kingdom_id: "k3-prog",
    order_index: 2,
    slug: "computer-graphics",
    title: "2D/3D Computer Graphics",
    summary: "Bresenham line/circle algorithms, 2D/3D homogeneous transformations, Cohen-Sutherland clipping, Bezier & B-Spline curves.",
    boss_title: "The Matrix Painter",
    estimated_minutes: 50,
    topics: [
      { id: "t-k3-2", title: "Rasterization & Transformations", subtopics: ["DDA & Bresenham", "Homogeneous Matrices", "Cohen-Sutherland Clipping"] },
    ],
  },

  // K4: DBMS
  {
    id: "ch-k4-relational",
    kingdom_id: "k4-dbms",
    order_index: 1,
    slug: "relational-model-sql",
    title: "ER Model, Relational Algebra & SQL",
    summary: "ER to relational mapping, Relational Algebra operators, Tuple/Domain Calculus, SQL joins, nested queries, and views.",
    boss_title: "The Vault Querymaster",
    estimated_minutes: 55,
    topics: [
      { id: "t-k4-1", title: "Relational Algebra & SQL", subtopics: ["Select, Project, Join, Division", "GROUP BY & HAVING", "Correlated Subqueries"] },
    ],
  },
  {
    id: "ch-k4-norm",
    kingdom_id: "k4-dbms",
    order_index: 2,
    slug: "normalization-transactions",
    title: "Normalization, Indexing & Transactions",
    summary: "Functional dependencies, Armstrong's axioms, 1NF to BCNF/4NF, B/B+ Trees, ACID, Conflict Serializability, 2PL & Timestamping.",
    boss_title: "The Serializability Arbiter",
    estimated_minutes: 65,
    topics: [
      { id: "t-k4-2", title: "FDs, Normal Forms & ACID", subtopics: ["Candidate Keys & Closure", "Lossless & Dependency Preserving", "Precedence Graph", "B+ Tree Order"] },
    ],
  },

  // K5: Operating Systems
  {
    id: "ch-k5-sched",
    kingdom_id: "k5-os",
    order_index: 1,
    slug: "process-scheduling-sync",
    title: "Processes, CPU Scheduling & Deadlocks",
    summary: "Process states, PCB, FCFS, SJF, SRTF, Round Robin, Semaphores, Producer-Consumer, Banker's Algorithm.",
    boss_title: "The Scheduler Warden",
    estimated_minutes: 60,
    topics: [
      { id: "t-k5-1", title: "Scheduling & Synchronization", subtopics: ["Gantt Charts & Turnaround Time", "Critical Section & Semaphores", "Banker's Safety Algorithm"] },
    ],
  },
  {
    id: "ch-k5-mem",
    kingdom_id: "k5-os",
    order_index: 2,
    slug: "memory-and-storage",
    title: "Memory Management & Disk Scheduling",
    summary: "Paging, Segmentation, TLB, Page Replacement (FIFO, LRU, Optimal), Belady's Anomaly, Thrashing, Disk Scheduling (SCAN, C-SCAN).",
    boss_title: "The Page Fault Phantom",
    estimated_minutes: 55,
    topics: [
      { id: "t-k5-2", title: "Virtual Memory & Disks", subtopics: ["Multi-level Paging", "Page Replacement Faults", "SSTF & SCAN Seek Time"] },
    ],
  },

  // K6: Software Engineering
  {
    id: "ch-k6-se",
    kingdom_id: "k6-se",
    order_index: 1,
    slug: "sdlc-testing-metrics",
    title: "SDLC, Design, Testing & Estimation",
    summary: "Waterfall, Spiral, Agile/Scrum, Coupling & Cohesion, Cyclomatic Complexity, Black/White-box testing, COCOMO & Function Points.",
    boss_title: "The Quality Inspector",
    estimated_minutes: 50,
    topics: [
      { id: "t-k6-1", title: "Process, Metrics & Testing", subtopics: ["McCabe Cyclomatic Complexity", "Equivalence Partitioning", "COCOMO Effort Estimation"] },
    ],
  },

  // K7: Data Structures & Algorithms
  {
    id: "ch-k7-basics",
    kingdom_id: "k7-dsa",
    order_index: 1,
    slug: "asymptotics-arrays",
    title: "Asymptotic Complexity & Arrays",
    summary: "Big-O, Omega, Theta, Master Theorem, Recurrences, Row/Column-major array addressing, Sparse Matrices.",
    boss_title: "The Recurrence Sentinel",
    estimated_minutes: 45,
    topics: [
      { id: "t-k7-1", title: "Complexity & Linear Memory", subtopics: ["Master Theorem", "Address Calculation"] },
    ],
  },
  {
    id: "ch-k7-linked-list",
    kingdom_id: "k7-dsa",
    order_index: 2,
    slug: "linked-lists",
    title: "Linked Lists & Pointer Mastery",
    summary: "Singly, Doubly, and Circular Linked Lists: traversal, insertion, deletion, reversal, cycle detection, and pointer puzzles.",
    boss_title: "The Pointer Lord",
    estimated_minutes: 55,
    topics: [
      { id: "t-k7-2", title: "Linked List Operations", subtopics: ["Node & Pointer Anatomy", "Insertion & Deletion", "In-place Reversal", "Floyd's Cycle Detection"] },
    ],
  },
  {
    id: "ch-k7-trees-graphs",
    kingdom_id: "k7-dsa",
    order_index: 3,
    slug: "trees-graphs-algorithms",
    title: "Trees, Graphs, Sorting & DP",
    summary: "BST, AVL, Red-Black, Binary Heaps, BFS/DFS, Dijkstra, Kruskal/Prim, QuickSort/MergeSort, Knapsack & LCS, P vs NP.",
    boss_title: "The Spanning Tree Sovereign",
    estimated_minutes: 75,
    topics: [
      { id: "t-k7-3", title: "Trees, Graphs & Paradigms", subtopics: ["AVL Rotations", "Heapify & Priority Queues", "Shortest Paths & MST", "Dynamic Programming"] },
    ],
  },

  // K8: TOC & Compilers
  {
    id: "ch-k8-toc",
    kingdom_id: "k8-toc",
    order_index: 1,
    slug: "automata-and-grammars",
    title: "Finite Automata, CFGs & Turing Machines",
    summary: "DFA, NFA, Regular Expressions, Pumping Lemma, PDA, Chomsky Hierarchy, Halting Problem & Decidability.",
    boss_title: "The Halting Oracle",
    estimated_minutes: 65,
    topics: [
      { id: "t-k8-1", title: "Automata & Computability", subtopics: ["DFA Minimization", "Myhill-Nerode Theorem", "Decidable vs RE Languages"] },
    ],
  },
  {
    id: "ch-k8-compilers",
    kingdom_id: "k8-toc",
    order_index: 2,
    slug: "compiler-phases",
    title: "Compiler Design & Parsing",
    summary: "Lexical Analysis, LL(1), LR(0), SLR, LALR parsers, Syntax-Directed Translation, Three-Address Code, DAG & Loop Optimization.",
    boss_title: "The Shift-Reduce Tactician",
    estimated_minutes: 55,
    topics: [
      { id: "t-k8-2", title: "Parsing & Code Generation", subtopics: ["FIRST & FOLLOW Sets", "LL(1) vs LALR(1)", "Peephole Optimization"] },
    ],
  },

  // K9: Computer Networks
  {
    id: "ch-k9-net",
    kingdom_id: "k9-cn",
    order_index: 1,
    slug: "osi-routing-tcp",
    title: "OSI/TCP-IP, Subnetting, Routing & Security",
    summary: "Error detection (CRC), Sliding Window, CSMA/CD, IPv4 Subnetting/CIDR, Distance Vector vs Link State, TCP Congestion Control, RSA.",
    boss_title: "The Packet Admiral",
    estimated_minutes: 65,
    topics: [
      { id: "t-k9-1", title: "Data Link, Network & Transport", subtopics: ["Stop-and-Wait & Go-Back-N", "CIDR Subnetting", "TCP Slow Start & AIMD", "RSA & Cryptography"] },
    ],
  },

  // K10: AI
  {
    id: "ch-k10-ai",
    kingdom_id: "k10-ai",
    order_index: 1,
    slug: "search-logic-ml",
    title: "Heuristic Search, Logic & Neural Nets",
    summary: "BFS, DFS, A* admissibility, Minimax & Alpha-Beta Pruning, Resolution in FOL, Fuzzy Sets, Perceptron & Backpropagation.",
    boss_title: "The Alpha-Beta Grandmaster",
    estimated_minutes: 60,
    topics: [
      { id: "t-k10-1", title: "Search, Reasoning & Learning", subtopics: ["A* & Admissible Heuristics", "Alpha-Beta Pruning", "Skolemization & Resolution", "Fuzzy Membership"] },
    ],
  },
];

export const CONCEPTS: ConceptSeed[] = [
  // Deeply authored flagship concept: Linked Lists (K7)
  {
    id: "c-linked-list-intro",
    chapter_id: "ch-k7-linked-list",
    topic_id: "t-k7-2",
    order_index: 1,
    slug: "singly-linked-list",
    title: "Singly Linked List & Pointer Mechanics",
    difficulty: "beginner",
    simulator_type: "linked_list",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 80,
    prerequisites: [],
    lesson: {
      discover_story:
        "Imagine you are the Chief Stationmaster of the Mountain Express Railway. Unlike a rigid row of numbered parking stalls (an Array), your railway stations sit across valleys and ridges. Station A doesn't need to sit physically next to Station B — it only needs a signpost (a pointer) telling the train which track leads to the next station. When a new town opens between Station 20 and Station 30, you don't demolish the whole valley; you simply redirect Station 20's signpost to Station 25, and point Station 25 to Station 30!",
      understand_intuition:
        "A Linked List stores elements in non-contiguous memory blocks called Nodes. Each node has two compartments: (1) `data` — the payload value, and (2) `next` — the memory address (reference) of the succeeding node. A special reference called `head` points to the first node, and the final node's `next` points to `NULL`, marking the end of the chain.",
      formal_definition:
        "A Singly Linked List L is a linear dynamic data structure consisting of a finite sequence of nodes N_1, N_2, ..., N_k, where each node N_i = (data_i, next_i) satisfies next_i = addr(N_{i+1}) for 1 <= i < k, and next_k = NULL. Access begins exclusively at head = addr(N_1).",
      examples: [
        {
          title: "Inserting at Head — O(1)",
          problem: "Insert value 5 at the beginning of list [10 -> 20 -> 30 -> NULL].",
          walkthrough:
            "1. Allocate newNode(5).\n2. Set newNode.next = head (10).\n3. Update head = newNode.\nResult: [5 -> 10 -> 20 -> 30 -> NULL]. Only 2 pointer assignments — constant time O(1)!",
        },
        {
          title: "Deleting a Middle Node — O(n)",
          problem: "Delete node 30 from [10 -> 20 -> 30 -> 40 -> NULL].",
          walkthrough:
            "1. Traverse from head until prev.next.data == 30 (prev is 20).\n2. Save temp = prev.next (30).\n3. Redirect prev.next = temp.next (40).\n4. Free temp.\nResult: [10 -> 20 -> 40 -> NULL].",
        },
        {
          title: "Iterative In-Place Reversal — O(n) time, O(1) space",
          problem: "Reverse [10 -> 20 -> 30 -> NULL] without allocating a new list.",
          walkthrough:
            "Maintain three pointers: prev = NULL, curr = head, next = NULL.\nAt each step: next = curr.next; curr.next = prev; prev = curr; curr = next.\nWhen curr becomes NULL, head = prev -> [30 -> 20 -> 10 -> NULL].",
        },
      ],
      properties: [
        "Dynamic size: grows and shrinks at runtime without contiguous reallocation.",
        "Insertion/Deletion at head takes O(1) time; at a given node pointer takes O(1) time.",
        "Random access (indexing arr[i]) is NOT supported in O(1); kth element lookup takes O(k) = O(n).",
        "Extra memory overhead per node for storing the `next` pointer (4 or 8 bytes).",
        "Cache locality is lower than arrays because nodes are scattered in heap memory.",
      ],
      edge_cases: [
        "Empty list (head == NULL): dereferencing head->data causes segmentation fault / NullPointerException.",
        "Single-node list (head->next == NULL): deletion must reset head to NULL.",
        "Deleting the head node itself: must update head pointer before freeing.",
        "Order of pointer updates during insertion: ALWAYS link newNode->next BEFORE overwriting prev->next, otherwise you lose the rest of the list!",
      ],
      applications: [
        "Implementing Stacks, Queues, and Adjacency Lists for Graphs.",
        "Operating System process ready queues and free memory block lists.",
        "Undo/Redo history and browser navigation (Doubly Linked List).",
        "Separate chaining in Hash Tables to resolve collisions.",
      ],
      revision_summary:
        "Singly Linked List: Node(data, next). Head insert/delete = O(1). Search/End-access (without tail) = O(n). Reverse in-place with 3 pointers (prev, curr, next) in O(n) time, O(1) space.",
    },
  },
  // Concept 2: CPU Scheduling (K5)
  {
    id: "c-cpu-scheduling",
    chapter_id: "ch-k5-sched",
    topic_id: "t-k5-1",
    order_index: 1,
    slug: "cpu-scheduling-algorithms",
    title: "CPU Scheduling: FCFS, SJF, SRTF & Round Robin",
    difficulty: "intermediate",
    simulator_type: "cpu_scheduling",
    content_status: "authored",
    estimated_minutes: 30,
    xp_reward: 90,
    prerequisites: [],
    lesson: {
      discover_story:
        "At the Gearworks of the Operating Systems Kingdom, a single master clockwork CPU must serve dozens of impatient travelers (processes). If a giant wagon with a 50-minute job arrives first and blocks tiny 2-minute messengers behind it (the Convoy Effect), the whole kingdom stalls! The Scheduler's art is deciding who gets the CPU next and for how long.",
      understand_intuition:
        "CPU scheduling decides which Ready-queue process runs on the CPU. Non-preemptive algorithms (FCFS, non-preemptive SJF) let a process hold the CPU until it finishes or blocks for I/O. Preemptive algorithms (SRTF, Round Robin) can interrupt a running process when a shorter job arrives or when a time quantum expires.",
      formal_definition:
        "Given processes P_i with Arrival Time (AT_i) and Burst Time (BT_i): Completion Time (CT_i) is when P_i finishes; Turnaround Time TAT_i = CT_i - AT_i; Waiting Time WT_i = TAT_i - BT_i. SRTF minimizes average waiting time across all preemptive schedules.",
      examples: [
        {
          title: "Convoy Effect in FCFS",
          problem: "P1(AT=0, BT=24), P2(AT=0, BT=3), P3(AT=0, BT=3). Compare FCFS vs SJF.",
          walkthrough:
            "FCFS order P1->P2->P3: WT = (0 + 24 + 27)/3 = 17 ms.\nSJF order P2->P3->P1: WT = (0 + 3 + 6)/3 = 3 ms. SJF cuts waiting time by over 5x!",
        },
        {
          title: "Round Robin Time Quantum Trade-off",
          problem: "What happens if quantum q is too large vs too small?",
          walkthrough:
            "If q -> infinity, Round Robin degenerates into FCFS. If q -> 0, context-switch overhead dominates CPU time. Rule of thumb: 80% of CPU bursts should be shorter than q.",
        },
      ],
      properties: [
        "SJF / SRTF is provably optimal for minimizing average waiting time.",
        "FCFS is starvation-free but suffers from the Convoy Effect.",
        "SJF, SRTF, and Priority Scheduling can cause starvation (solved via Aging).",
        "Round Robin guarantees bounded response time and is starvation-free.",
      ],
      edge_cases: [
        "Processes arriving at different times (AT > 0): CPU may sit idle if ready queue is empty.",
        "Tie-breaking in SJF/SRTF: usually lower arrival time, then lower Process ID.",
        "In Round Robin, a newly arrived process at time t vs a preempted process at time t: standard convention queues newly arrived processes before re-queuing the preempted process.",
      ],
      applications: [
        "Linux CFS (Completely Fair Scheduler) using Red-Black Trees.",
        "Interactive desktop & mobile OS responsiveness (Round Robin / Multi-Level Feedback Queue).",
        "Batch supercomputing job queues.",
      ],
      revision_summary:
        "TAT = CT - AT; WT = TAT - BT. SRTF = optimal avg WT. FCFS = convoy effect, no starvation. RR = fair response time, sensitive to quantum q.",
    },
  },
  // Concept 3: Relational Algebra & SQL (K4)
  {
    id: "c-sql-relational",
    chapter_id: "ch-k4-relational",
    topic_id: "t-k4-1",
    order_index: 1,
    slug: "relational-algebra-and-sql",
    title: "Relational Algebra & SQL Query Engine",
    difficulty: "intermediate",
    simulator_type: "sql_playground",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 80,
    prerequisites: [],
    lesson: {
      discover_story:
        "Deep inside the Ancient Data Vaults, scribes store millions of parchment scrolls in neat tables: Students, Kingdoms, and Enrollments. Rather than reading every scroll by hand, the Vault Master uses a mathematical algebra of six fundamental operations — and its declarative cousin, SQL — to summon exact answers in milliseconds.",
      understand_intuition:
        "Relational Algebra is procedural (you specify HOW to combine relations using Selection σ, Projection π, Union ∪, Set Difference −, Cartesian Product ×, and Join ⋈). SQL is declarative (you specify WHAT you want with SELECT-FROM-WHERE-GROUP BY-HAVING, and the query optimizer chooses the execution plan).",
      formal_definition:
        "Selection σ_p(R) = { t ∈ R | p(t) is true }. Projection π_A(R) = { t[A] | t ∈ R } (eliminating duplicates in pure relational algebra, whereas SQL retains duplicates unless DISTINCT is used). Division R ÷ S finds tuples in R associated with ALL tuples in S.",
      examples: [
        {
          title: "Relational Division for 'ALL' Queries",
          problem: "Find students who have mastered ALL kingdoms in the Kingdoms table.",
          walkthrough:
            "In Relational Algebra: π_{sid, kid}(Mastered) ÷ π_{kid}(Kingdoms).\nIn SQL: Use NOT EXISTS with double negation (find students for whom NO kingdom exists that they haven't mastered).",
        },
      ],
      properties: [
        "Five fundamental RA operators: σ, π, ∪, −, ×. Join (⋈), Intersection (∩), and Division (÷) are derived.",
        "SQL execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY.",
        "WHERE filters rows BEFORE grouping; HAVING filters groups AFTER aggregation.",
      ],
      edge_cases: [
        "NULL comparisons in SQL use three-valued logic (TRUE, FALSE, UNKNOWN); always use IS NULL, never = NULL.",
        "COUNT(*) counts NULLs; COUNT(col) ignores NULLs.",
        "Natural Join on tables with no common attributes behaves like Cartesian Product.",
      ],
      applications: [
        "Query optimizers in PostgreSQL, MySQL, and Oracle.",
        "Data warehousing, OLAP cubes, and analytical reporting.",
      ],
      revision_summary:
        "RA fundamental ops: σ, π, ∪, −, ×. SQL order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY. NULLs follow 3-valued logic.",
    },
  },
  // Concept 4: Deterministic Finite Automata (K8)
  {
    id: "c-dfa-automata",
    chapter_id: "ch-k8-toc",
    topic_id: "t-k8-1",
    order_index: 1,
    slug: "deterministic-finite-automata",
    title: "Deterministic Finite Automata (DFA)",
    difficulty: "intermediate",
    simulator_type: "automata_dfa",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    lesson: {
      discover_story:
        "High in the Automata Observatory sits a brass mechanical lock with a handful of numbered dials and one glowing emerald lamp. As you feed a ribbon of 0s and 1s into its slot, each symbol clicks the dial to a new state. If the lamp glows emerald when the ribbon ends, the secret is accepted!",
      understand_intuition:
        "A DFA is the simplest mathematical model of computation with finite memory. Because it has no external tape or stack, it can only remember which state it is currently in. Every state must have exactly one outgoing arrow for every symbol in the alphabet.",
      formal_definition:
        "A DFA is a 5-tuple M = (Q, Σ, δ, q_0, F) where Q is a finite set of states, Σ is a finite input alphabet, δ: Q × Σ → Q is the total transition function, q_0 ∈ Q is the start state, and F ⊆ Q is the set of accepting (final) states.",
      examples: [
        {
          title: "Binary Strings Divisible by 3",
          problem: "Design a DFA over Σ = {0, 1} accepting binary numbers divisible by 3.",
          walkthrough:
            "States represent remainder mod 3: q0 (rem 0, start & final), q1 (rem 1), q2 (rem 2).\nReading bit b transforms value n to 2n + b.\nSo δ(q_r, b) = q_{(2r + b) mod 3}.",
        },
      ],
      properties: [
        "Every DFA has a unique minimal DFA (up to state isomorphism) via Myhill-Nerode theorem.",
        "Regular languages are closed under Union, Intersection, Complement, Concatenation, and Kleene Star.",
        "Complement of a DFA is obtained simply by swapping F and Q \\ F.",
      ],
      edge_cases: [
        "Empty string ε: accepted if and only if q_0 ∈ F.",
        "Dead (trap) state: required in a complete DFA whenever an invalid prefix is read.",
        "Minimum states to accept strings of length >= k or divisible by n.",
      ],
      applications: [
        "Lexical analyzers (tokenizers) in compilers.",
        "Regular expression engines and network protocol state machines.",
      ],
      revision_summary:
        "DFA = (Q, Σ, δ, q0, F). Total transition δ: Q×Σ→Q. Regular languages closed under complement, union, intersection. Minimal DFA unique by Myhill-Nerode.",
    },
  },
  // Concept 5: Propositional Logic & Gates (K1)
  {
    id: "c-prop-logic",
    chapter_id: "ch-k1-logic",
    topic_id: "t-k1-1",
    order_index: 1,
    slug: "propositional-logic-equivalences",
    title: "Propositional Logic, Implications & Normal Forms",
    difficulty: "beginner",
    simulator_type: "logic_gates",
    content_status: "authored",
    estimated_minutes: 20,
    xp_reward: 65,
    prerequisites: [],
    lesson: {
      discover_story:
        "Before crossing the Bridges of Discrete Structures, every traveler must pass the Gate of Truth. The gatekeepers speak only in implications ('If the key is brass, then the door opens') and contrapositives. Mistaking a converse for a contrapositive will send you straight into the moat!",
      understand_intuition:
        "Propositional logic lets us reason unambiguously about True/False statements using connectives: ¬ (NOT), ∧ (AND), ∨ (OR), → (IMPLIES), and ↔ (IFF). An implication P → Q is only false when P is True and Q is False.",
      formal_definition:
        "P → Q ≡ ¬P ∨ Q. Its contrapositive is ¬Q → ¬P (logically equivalent to P → Q). Its converse is Q → P and inverse is ¬P → ¬Q (neither is equivalent to P → Q).",
      examples: [
        {
          title: "Modus Tollens",
          problem: "Given (P → Q) and ¬Q, what can we conclude?",
          walkthrough: "Since P → Q ≡ ¬Q → ¬P and ¬Q is true, ¬P must be true.",
        },
      ],
      properties: [
        "De Morgan's Laws: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q and ¬(P ∨ Q) ≡ ¬P ∧ ¬Q.",
        "Number of distinct boolean functions of n variables is 2^(2^n).",
        "Functional completeness: {NAND} alone and {NOR} alone are functionally complete.",
      ],
      edge_cases: [
        "Vacuous truth: False → anything is always True!",
        "Exclusive OR (XOR) is associative and commutative.",
      ],
      applications: [
        "SAT solvers, hardware verification, and digital circuit synthesis.",
        "SQL WHERE predicates and compiler branch optimization.",
      ],
      revision_summary:
        "P→Q ≡ ¬P∨Q ≡ ¬Q→¬P. Boolean functions of n vars = 2^(2^n). {NAND} and {NOR} are universal.",
    },
  },
  // Concept 6: Sorting & Asymptotics (K7)
  {
    id: "c-sorting-arena",
    chapter_id: "ch-k7-trees-graphs",
    topic_id: "t-k7-3",
    order_index: 2,
    slug: "sorting-algorithms-analysis",
    title: "Comparison Sorting: QuickSort, MergeSort & HeapSort",
    difficulty: "intermediate",
    simulator_type: "sorting_arena",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 75,
    prerequisites: ["c-linked-list-intro"],
    lesson: {
      discover_story:
        "In the Forest of Algorithms, merchants must sort thousands of enchanted scrolls by weight. Bubble Sort swaps neighbors one by one and takes all week. Divide-and-Conquer sorcerers split the pile in half (MergeSort) or pick a pivot stone (QuickSort) and finish before tea!",
      understand_intuition:
        "Any comparison-based sorting algorithm must make at least Ω(n log n) comparisons in the worst case (decision tree lower bound). MergeSort guarantees O(n log n) always and is stable, while QuickSort averages O(n log n) in-place with great cache locality.",
      formal_definition:
        "Decision tree of n! leaves has height h >= log2(n!) = Ω(n log n). MergeSort: T(n) = 2T(n/2) + Θ(n) = Θ(n log n). QuickSort worst case: T(n) = T(n-1) + Θ(n) = Θ(n^2).",
      examples: [
        {
          title: "QuickSort Worst Case",
          problem: "When does standard deterministic QuickSort degrade to O(n^2)?",
          walkthrough:
            "When the array is already sorted (or reverse sorted) and the first/last element is always chosen as the pivot.",
        },
      ],
      properties: [
        "MergeSort: O(n log n) worst, Stable, O(n) auxiliary space.",
        "QuickSort: O(n log n) avg, O(n^2) worst, Unstable, O(log n) stack space.",
        "HeapSort: O(n log n) worst, Unstable, O(1) auxiliary space.",
        "Insertion Sort: O(n) best case on nearly sorted arrays, Stable, In-place.",
      ],
      edge_cases: [
        "Stability matters when sorting records by multiple keys (e.g., Radix Sort requires a stable inner sort).",
        "All elements equal: naive Lomuto partition still takes O(n^2) unless 3-way partitioning is used.",
      ],
      applications: [
        "TimSort (Merge + Insertion) in Python and Java.",
        "Introsort (Quick + Heap + Insertion) in C++ std::sort.",
      ],
      revision_summary:
        "Comparison lower bound: Ω(n log n). MergeSort = stable, O(n) space. HeapSort = O(1) space, O(n log n) worst. QuickSort = fastest in practice, O(n^2) worst.",
    },
  },
  // Additional syllabus concepts (marked clearly with content_status)
  {
    id: "c-k2-pipelining",
    chapter_id: "ch-k2-pipeline",
    topic_id: "t-k2-2",
    order_index: 1,
    slug: "instruction-pipelining-hazards",
    title: "Instruction Pipelining & Hazards",
    difficulty: "intermediate",
    simulator_type: "none",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 75,
    prerequisites: [],
    lesson: {
      discover_story:
        "In the Clockwork Processor Keep, a laundry master realized you don't wait for Load 1 to be washed, dried, AND folded before starting Load 2. Overlapping stages (Fetch, Decode, Execute, Memory, Writeback) keeps every station busy simultaneously!",
      understand_intuition:
        "Pipelining increases instruction throughput (instructions per second) without reducing the latency of a single instruction. A k-stage pipeline ideally achieves speedup k, limited by pipeline latch overhead and hazards.",
      formal_definition:
        "Time for n instructions in a k-stage pipeline with cycle time t_p: T = (k + n - 1) * t_p. Speedup S = (n * k * t_np) / ((k + n - 1) * t_p). As n -> ∞, S -> t_np / t_p.",
      examples: [
        {
          title: "Pipeline Speedup Calculation",
          problem: "A 5-stage pipeline has stage delays 10, 12, 8, 11, 9 ns with 1 ns latch delay. Find clock cycle and max speedup.",
          walkthrough: "t_p = max(10,12,8,11,9) + 1 = 13 ns. Non-pipelined = 50 ns. Max speedup = 50 / 13 ≈ 3.85x.",
        },
      ],
      properties: [
        "Three hazard types: Structural (hardware conflict), Data (RAW, WAR, WAW), Control (branches).",
        "Operand forwarding (bypassing) resolves most RAW hazards without stalling.",
        "Branch prediction and delayed branching mitigate Control hazards.",
      ],
      edge_cases: [
        "Load-use data hazard still requires 1 stall cycle even with forwarding.",
      ],
      applications: ["Modern x86-64 and ARM superscalar CPUs."],
      revision_summary: "T = (k + n - 1) * t_p. Hazards: Structural, Data (RAW/WAR/WAW), Control.",
    },
  },
  {
    id: "c-k9-tcp",
    chapter_id: "ch-k9-net",
    topic_id: "t-k9-1",
    order_index: 1,
    slug: "tcp-congestion-control",
    title: "TCP Flow & Congestion Control",
    difficulty: "jrf",
    simulator_type: "none",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    lesson: {
      discover_story:
        "Across the Archipelago of Signals, cargo boats carry packets between islands. If every island launches boats at full speed, the harbor clogs and packets sink! TCP teaches every sender to probe the waters gently (Slow Start) and back off immediately when a boat goes missing.",
      understand_intuition:
        "Flow control (rwnd) protects the receiver from overflowing; Congestion control (cwnd) protects the network routers from overloading. Effective window = min(cwnd, rwnd).",
      formal_definition:
        "Slow Start increases cwnd exponentially (+1 MSS per ACK, doubling per RTT) until cwnd >= ssthresh, then switches to Congestion Avoidance (AIMD: +1 MSS per RTT). On triple duplicate ACK (TCP Reno): ssthresh = cwnd/2, cwnd = ssthresh. On Timeout: ssthresh = cwnd/2, cwnd = 1 MSS.",
      examples: [
        {
          title: "TCP Reno Timeout vs Triple Dup ACK",
          problem: "cwnd = 32 KB, MSS = 1 KB, timeout occurs. What are new ssthresh and cwnd?",
          walkthrough: "ssthresh = 32 / 2 = 16 KB. cwnd resets to 1 MSS = 1 KB (Slow Start).",
        },
      ],
      properties: [
        "Slow Start is actually exponential growth per RTT.",
        "AIMD (Additive Increase, Multiplicative Decrease) ensures fairness across competing flows.",
      ],
      edge_cases: ["Timeout is treated as severe congestion; 3 duplicate ACKs indicate mild congestion."],
      applications: ["All reliable internet traffic (HTTP/2, SSH, TLS)."],
      revision_summary: "EffWin = min(cwnd, rwnd). Slow Start = exp; Cong Avoid = linear. Timeout -> cwnd=1; 3-DupACK -> cwnd=cwnd/2.",
    },
  },
  {
    id: "c-k10-astar",
    chapter_id: "ch-k10-ai",
    topic_id: "t-k10-1",
    order_index: 1,
    slug: "heuristic-search-a-star",
    title: "Heuristic Search & A* Optimality",
    difficulty: "jrf",
    simulator_type: "graph_search",
    content_status: "authored",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    lesson: {
      discover_story:
        "In the Heuristic Sanctuary, a traveler seeks the shortest mountain pass to the JRF Summit. Blindly exploring every valley (BFS) wastes days, while rushing toward the peak ignoring cliffs (Greedy) can trap you. A* balances distance walked so far g(n) with an honest estimate of distance remaining h(n).",
      understand_intuition:
        "A* evaluates f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is the heuristic estimate from n to the goal. If h(n) never overestimates the true remaining cost (admissible), A* is guaranteed to find the optimal path.",
      formal_definition:
        "Heuristic h(n) is admissible if 0 <= h(n) <= h*(n) for all n. It is consistent (monotonic) if h(n) <= c(n, n') + h(n') for every edge (n, n'). Consistency implies admissibility.",
      examples: [
        {
          title: "Admissible vs Inadmissible",
          problem: "Is Euclidean distance admissible for 2D grid pathfinding?",
          walkthrough: "Yes! Straight-line distance is always <= actual path length along grid edges.",
        },
      ],
      properties: [
        "If h(n) = 0, A* reduces to Uniform Cost Search (Dijkstra).",
        "With a consistent heuristic, the first time A* expands the goal node, it has found the optimal path.",
      ],
      edge_cases: ["If h(n) overestimates h*(n), A* can return a suboptimal path."],
      applications: ["GPS navigation, game AI pathfinding, robotics motion planning."],
      revision_summary: "f(n) = g(n) + h(n). Admissible: h(n) <= h*(n). Consistent: h(n) <= c(n,n') + h(n').",
    },
  },
  // Outline concepts to ensure every kingdom is navigable
  {
    id: "c-k3-pointers",
    chapter_id: "ch-k3-prog",
    topic_id: "t-k3-1",
    order_index: 1,
    slug: "pointers-and-virtual-dispatch",
    title: "Pointers, Recursion & Virtual Dispatch",
    difficulty: "intermediate",
    simulator_type: "none",
    content_status: "needs_verification",
    estimated_minutes: 20,
    xp_reward: 65,
    prerequisites: [],
    lesson: {
      discover_story: "In the Artisan's Scroll Village, master scribes reference scrolls by their shelf address rather than copying entire volumes.",
      understand_intuition: "Pointers store memory addresses; virtual functions use a vptr/vtable to resolve overridden methods at runtime (dynamic polymorphism).",
      formal_definition: "If Base *b = new Derived(), calling b->fn() dispatches to Derived::fn() iff fn is declared virtual in Base.",
      examples: [{ title: "Vtable Lookup", problem: "Base *p = new Derived(); p->show();", walkthrough: "Follows p->__vptr to Derived's vtable entry for show()." }],
      properties: ["Constructors cannot be virtual; destructors in polymorphic base classes SHOULD be virtual."],
      edge_cases: ["Dangling pointers after free/delete; memory leaks."],
      applications: ["GUI frameworks, game engines, C++ runtime polymorphism."],
      revision_summary: "Virtual functions -> runtime binding via vptr/vtable. Always make base destructors virtual.",
    },
  },
  {
    id: "c-k6-complexity",
    chapter_id: "ch-k6-se",
    topic_id: "t-k6-1",
    order_index: 1,
    slug: "cyclomatic-complexity-cocomo",
    title: "Cyclomatic Complexity & COCOMO Estimation",
    difficulty: "beginner",
    simulator_type: "none",
    content_status: "needs_verification",
    estimated_minutes: 20,
    xp_reward: 65,
    prerequisites: [],
    lesson: {
      discover_story: "Before raising a stone pavilion, the master builder counts every fork in the blueprint to know how many test inspections are required.",
      understand_intuition: "McCabe's Cyclomatic Complexity V(G) counts the number of linearly independent paths through a program's control flow graph — giving the minimum number of test cases for branch coverage.",
      formal_definition: "V(G) = E - N + 2P (where E = edges, N = nodes, P = connected components), or simply V(G) = D + 1 (where D = number of binary decision predicates).",
      examples: [{ title: "CFG Calculation", problem: "A single-function program has 10 nodes and 12 edges. Find V(G).", walkthrough: "V(G) = 12 - 10 + 2(1) = 4 independent paths." }],
      properties: ["High cohesion + low coupling = maintainable modular design."],
      edge_cases: ["Switch/case with k branches counts as k-1 binary decisions."],
      applications: ["Static code analysis (SonarQube), test suite sizing."],
      revision_summary: "V(G) = E - N + 2P = D + 1. Measures independent paths & minimum test cases.",
    },
  },
];

export const PUZZLES: PuzzleSeed[] = [
  {
    id: "puz-ll-insert",
    concept_id: "c-linked-list-intro",
    kingdom_id: "k7-dsa",
    title: "Railway Station Insertion",
    prompt: "Insert a new station with value 25 between 20 and 30 in the list [10 -> 20 -> 30 -> 40 -> NULL]. Click the correct target position!",
    puzzle_type: "pointer_trace",
    difficulty: "easy",
    config: {
      initialList: [10, 20, 30, 40],
      insertValue: 25,
      targetAfterValue: 20,
    },
    solution: { expectedList: [10, 20, 25, 30, 40] },
    hints: [
      "Find the station with value 20 first — its `next` pointer currently points to 30.",
      "To place 25 between 20 and 30, 25 must be inserted right after 20.",
    ],
    xp_reward: 45,
  },
  {
    id: "puz-ll-corrupt",
    concept_id: "c-linked-list-intro",
    kingdom_id: "k7-dsa",
    title: "Broken Chain Recovery",
    prompt: "A corrupted node (30) has disrupted the railway line [10 -> 20 -> 30 -> 40 -> 50]. After deleting node 30, what is the resulting sequence?",
    puzzle_type: "sequence",
    difficulty: "easy",
    config: {
      choices: [
        "10 -> 20 -> 40 -> 50",
        "10 -> 20 -> 30 -> 50",
        "20 -> 40 -> 50",
        "10 -> 40 -> 50",
      ],
    },
    solution: { answer: "10 -> 20 -> 40 -> 50" },
    hints: [
      "When deleting node 30, we update node 20's `next` pointer.",
      "Node 20 should point directly to what 30 used to point to (40).",
    ],
    xp_reward: 40,
  },
  {
    id: "puz-os-sjf",
    concept_id: "c-cpu-scheduling",
    kingdom_id: "k5-os",
    title: "The Gearworks Scheduling Order",
    prompt: "Three processes arrive at t=0: P1(BT=8), P2(BT=2), P3(BT=5). Arrange them in Shortest Job First (SJF) execution order to minimize average waiting time.",
    puzzle_type: "sequence",
    difficulty: "easy",
    config: {
      choices: ["P2 -> P3 -> P1", "P1 -> P3 -> P2", "P3 -> P2 -> P1", "P1 -> P2 -> P3"],
    },
    solution: { answer: "P2 -> P3 -> P1" },
    hints: [
      "SJF picks the process with the smallest burst time first.",
      "Compare burst times: 2 < 5 < 8.",
    ],
    xp_reward: 45,
  },
  {
    id: "puz-db-sql",
    concept_id: "c-sql-relational",
    kingdom_id: "k4-dbms",
    title: "Vault Filter Clause",
    prompt: "Which SQL clause filters groups AFTER aggregation (e.g. kingdoms with more than 3 mastered concepts)?",
    puzzle_type: "sequence",
    difficulty: "medium",
    config: {
      choices: ["HAVING", "WHERE", "GROUP BY", "DISTINCT"],
    },
    solution: { answer: "HAVING" },
    hints: [
      "WHERE runs before GROUP BY and cannot use aggregate functions like COUNT(*).",
      "Think of the clause that comes right after GROUP BY.",
    ],
    xp_reward: 45,
  },
  {
    id: "puz-toc-dfa",
    concept_id: "c-dfa-automata",
    kingdom_id: "k8-toc",
    title: "Automata String Acceptance",
    prompt: "A DFA over {0,1} accepts all strings ending with '01'. Which string is ACCEPTED?",
    puzzle_type: "sequence",
    difficulty: "easy",
    config: {
      choices: ["11001", "10110", "0010", "111"],
    },
    solution: { answer: "11001" },
    hints: ["Check the last two characters of each binary string."],
    xp_reward: 40,
  },
  {
    id: "puz-k1-logic",
    concept_id: "c-prop-logic",
    kingdom_id: "k1-discrete",
    title: "The Contrapositive Bridge",
    prompt: "Which statement is logically equivalent to: 'If a graph is a tree (P), then it has no cycles (Q)'?",
    puzzle_type: "sequence",
    difficulty: "medium",
    config: {
      choices: [
        "If a graph has a cycle (¬Q), then it is not a tree (¬P)",
        "If a graph has no cycles (Q), then it is a tree (P)",
        "If a graph is not a tree (¬P), then it has a cycle (¬Q)",
        "A graph is a tree if and only if it has cycles",
      ],
    },
    solution: { answer: "If a graph has a cycle (¬Q), then it is not a tree (¬P)" },
    hints: [
      "An implication P → Q is always equivalent to its contrapositive, NOT its converse.",
      "Contrapositive of P → Q is ¬Q → ¬P.",
    ],
    xp_reward: 50,
  },
];

export const QUESTIONS: QuestionSeed[] = [
  {
    id: "q-ll-1",
    kingdom_id: "k7-dsa",
    chapter_id: "ch-k7-linked-list",
    concept_id: "c-linked-list-intro",
    prompt: "Which operation has O(1) worst-case time complexity in a standard singly linked list (with only a `head` pointer)?",
    explanation: "Insertion at the head only requires creating a node, setting newNode.next = head, and updating head = newNode — all O(1). Traversal, search, and deletion at end (without tail) require O(n).",
    difficulty: "easy",
    is_pyq: false,
    xp_reward: 20,
    options: [
      { label: "A", text: "Traversal of all nodes", is_correct: false },
      { label: "B", text: "Insertion at the head", is_correct: true },
      { label: "C", text: "Searching for a key", is_correct: false },
      { label: "D", text: "Deletion of the last node", is_correct: false },
    ],
  },
  {
    id: "q-ll-2",
    kingdom_id: "k7-dsa",
    chapter_id: "ch-k7-linked-list",
    concept_id: "c-linked-list-intro",
    prompt: "In a singly linked list, what does the `next` field of the last node contain?",
    explanation: "The final node in a non-circular singly linked list points to NULL (or nullptr/None) to signal termination.",
    difficulty: "easy",
    is_pyq: false,
    xp_reward: 20,
    options: [
      { label: "A", text: "Address of head node", is_correct: false },
      { label: "B", text: "NULL", is_correct: true },
      { label: "C", text: "Address of itself", is_correct: false },
      { label: "D", text: "Garbage value", is_correct: false },
    ],
  },
  {
    id: "q-ll-3",
    kingdom_id: "k7-dsa",
    chapter_id: "ch-k7-linked-list",
    concept_id: "c-linked-list-intro",
    prompt: "What is the worst-case time complexity to delete the last node of a singly linked list if both `head` and `tail` pointers are maintained?",
    explanation: "Even with a `tail` pointer, in a singly linked list you cannot step backwards from `tail` to the second-last node! You must still traverse from `head` in O(n) time to update the second-last node's `next` to NULL.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET Pattern (Classic Pointer Trap)",
    xp_reward: 30,
    options: [
      { label: "A", text: "O(1)", is_correct: false },
      { label: "B", text: "O(log n)", is_correct: false },
      { label: "C", text: "O(n)", is_correct: true },
      { label: "D", text: "O(n log n)", is_correct: false },
    ],
  },
  {
    id: "q-ll-4",
    kingdom_id: "k7-dsa",
    chapter_id: "ch-k7-linked-list",
    concept_id: "c-linked-list-intro",
    prompt: "Given a pointer ONLY to a middle node `p` (not the last node) in a singly linked list, how can you delete `p` in O(1) time?",
    explanation: "Copy `p->next->data` into `p->data`, then bypass `p->next` (`p->next = p->next->next`) and free the bypassed node. This fails only if `p` is the last node.",
    difficulty: "jrf",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ Concept",
    xp_reward: 35,
    options: [
      { label: "A", text: "It is impossible without head pointer", is_correct: false },
      { label: "B", text: "Copy next node's data into p and delete the next node", is_correct: true },
      { label: "C", text: "Set p = NULL directly", is_correct: false },
      { label: "D", text: "Reverse the entire list first", is_correct: false },
    ],
  },
  {
    id: "q-os-1",
    kingdom_id: "k5-os",
    chapter_id: "ch-k5-sched",
    concept_id: "c-cpu-scheduling",
    prompt: "Which CPU scheduling algorithm achieves the minimum possible average waiting time for a given set of processes?",
    explanation: "Shortest Remaining Time First (SRTF), the preemptive version of SJF, is provably optimal for minimizing average waiting time.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 25,
    options: [
      { label: "A", text: "First-Come, First-Served (FCFS)", is_correct: false },
      { label: "B", text: "Round Robin (RR)", is_correct: false },
      { label: "C", text: "Shortest Remaining Time First (SRTF)", is_correct: true },
      { label: "D", text: "Multi-Level Queue", is_correct: false },
    ],
  },
  {
    id: "q-os-2",
    kingdom_id: "k5-os",
    chapter_id: "ch-k5-mem",
    concept_id: "c-cpu-scheduling",
    prompt: "Belady's Anomaly — where increasing the number of page frames increases page faults — can occur in which page replacement algorithm?",
    explanation: "FIFO suffers from Belady's Anomaly because it is not a stack algorithm. LRU and Optimal are stack algorithms and never suffer from Belady's Anomaly.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 30,
    options: [
      { label: "A", text: "LRU (Least Recently Used)", is_correct: false },
      { label: "B", text: "Optimal Page Replacement", is_correct: false },
      { label: "C", text: "FIFO (First-In, First-Out)", is_correct: true },
      { label: "D", text: "LFU with stack property", is_correct: false },
    ],
  },
  {
    id: "q-db-1",
    kingdom_id: "k4-dbms",
    chapter_id: "ch-k4-norm",
    concept_id: "c-sql-relational",
    prompt: "Every relation in BCNF is guaranteed to be in:",
    explanation: "The normal form hierarchy is: 1NF ⊃ 2NF ⊃ 3NF ⊃ BCNF. Thus every BCNF relation is automatically in 3NF, 2NF, and 1NF.",
    difficulty: "easy",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 25,
    options: [
      { label: "A", text: "4NF", is_correct: false },
      { label: "B", text: "5NF", is_correct: false },
      { label: "C", text: "3NF", is_correct: true },
      { label: "D", text: "None of these", is_correct: false },
    ],
  },
  {
    id: "q-db-2",
    kingdom_id: "k4-dbms",
    chapter_id: "ch-k4-relational",
    concept_id: "c-sql-relational",
    prompt: "Which of the following is NOT one of the five basic operators of Relational Algebra?",
    explanation: "The five fundamental operators are Selection (σ), Projection (π), Union (∪), Set Difference (−), and Cartesian Product (×). Natural Join (⋈) is derived from ×, σ, and π.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 25,
    options: [
      { label: "A", text: "Selection (σ)", is_correct: false },
      { label: "B", text: "Set Difference (−)", is_correct: false },
      { label: "C", text: "Natural Join (⋈)", is_correct: true },
      { label: "D", text: "Cartesian Product (×)", is_correct: false },
    ],
  },
  {
    id: "q-toc-1",
    kingdom_id: "k8-toc",
    chapter_id: "ch-k8-toc",
    concept_id: "c-dfa-automata",
    prompt: "Which class of languages is NOT closed under intersection?",
    explanation: "Context-Free Languages (CFLs) are closed under union, concatenation, and Kleene star, but NOT closed under intersection or complementation.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 30,
    options: [
      { label: "A", text: "Regular Languages", is_correct: false },
      { label: "B", text: "Context-Free Languages", is_correct: true },
      { label: "C", text: "Recursive Languages", is_correct: false },
      { label: "D", text: "Recursively Enumerable Languages", is_correct: false },
    ],
  },
  {
    id: "q-k1-1",
    kingdom_id: "k1-discrete",
    chapter_id: "ch-k1-logic",
    concept_id: "c-prop-logic",
    prompt: "How many distinct Boolean functions exist for n = 3 Boolean variables?",
    explanation: "With n variables there are 2^n truth-table rows, and each row can output 0 or 1, giving 2^(2^n) functions. For n=3: 2^(2^3) = 2^8 = 256.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 25,
    options: [
      { label: "A", text: "8", is_correct: false },
      { label: "B", text: "64", is_correct: false },
      { label: "C", text: "256", is_correct: true },
      { label: "D", text: "512", is_correct: false },
    ],
  },
  {
    id: "q-k2-1",
    kingdom_id: "k2-csa",
    chapter_id: "ch-k2-pipeline",
    concept_id: "c-k2-pipelining",
    prompt: "In a 5-stage instruction pipeline, if a load instruction is immediately followed by an instruction that uses the loaded register, what is this hazard called?",
    explanation: "The second instruction attempts to read the register before the load writes it back — a Read-After-Write (RAW) true data dependency.",
    difficulty: "medium",
    is_pyq: false,
    xp_reward: 25,
    options: [
      { label: "A", text: "WAR (Write After Read)", is_correct: false },
      { label: "B", text: "RAW (Read After Write)", is_correct: true },
      { label: "C", text: "WAW (Write After Write)", is_correct: false },
      { label: "D", text: "Structural Hazard", is_correct: false },
    ],
  },
  {
    id: "q-k9-1",
    kingdom_id: "k9-cn",
    chapter_id: "ch-k9-net",
    concept_id: "c-k9-tcp",
    prompt: "In TCP Reno, when a sender receives 3 duplicate ACKs, how does it adjust its congestion window (cwnd)?",
    explanation: "On 3 duplicate ACKs (Fast Retransmit/Fast Recovery), ssthresh = cwnd/2 and cwnd is set to ssthresh (halved), unlike a timeout which resets cwnd to 1 MSS.",
    difficulty: "jrf",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 35,
    options: [
      { label: "A", text: "Resets cwnd to 1 MSS", is_correct: false },
      { label: "B", text: "Halves cwnd (cwnd / 2)", is_correct: true },
      { label: "C", text: "Doubles cwnd", is_correct: false },
      { label: "D", text: "Keeps cwnd unchanged", is_correct: false },
    ],
  },
  {
    id: "q-k10-1",
    kingdom_id: "k10-ai",
    chapter_id: "ch-k10-ai",
    concept_id: "c-k10-astar",
    prompt: "For A* search to be guaranteed optimal on a graph, the heuristic function h(n) must be:",
    explanation: "An admissible heuristic never overestimates the true cost to reach the goal (h(n) <= h*(n)), which guarantees A* finds an optimal path.",
    difficulty: "medium",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 25,
    options: [
      { label: "A", text: "Always equal to 0", is_correct: false },
      { label: "B", text: "Overestimating h*(n)", is_correct: false },
      { label: "C", text: "Admissible (h(n) <= h*(n))", is_correct: true },
      { label: "D", text: "Exponentially growing", is_correct: false },
    ],
  },
  {
    id: "q-k6-1",
    kingdom_id: "k6-se",
    chapter_id: "ch-k6-se",
    concept_id: "c-k6-complexity",
    prompt: "A program flow graph has 14 edges, 10 nodes, and 1 connected component. What is its McCabe Cyclomatic Complexity?",
    explanation: "V(G) = E - N + 2P = 14 - 10 + 2(1) = 6.",
    difficulty: "easy",
    is_pyq: true,
    pyq_label: "UGC NET CS PYQ",
    xp_reward: 20,
    options: [
      { label: "A", text: "4", is_correct: false },
      { label: "B", text: "5", is_correct: false },
      { label: "C", text: "6", is_correct: true },
      { label: "D", text: "8", is_correct: false },
    ],
  },
];

export const QUESTS = [
  {
    id: "qst-daily-concept",
    title: "Study a New Concept",
    description: "Complete at least 1 concept stage in any kingdom.",
    quest_type: "daily",
    metric_key: "concepts_studied_today",
    target_count: 1,
    xp_reward: 50,
    coin_reward: 15,
  },
  {
    id: "qst-daily-practice",
    title: "Solve 5 Practice Questions",
    description: "Answer 5 UGC NET questions or PYQs with reasoning.",
    quest_type: "daily",
    metric_key: "questions_answered_today",
    target_count: 5,
    xp_reward: 60,
    coin_reward: 20,
  },
  {
    id: "qst-daily-puzzle",
    title: "Complete Today's Puzzle",
    description: "Solve a logic, pointer, or scheduling puzzle in the Dungeon.",
    quest_type: "daily",
    metric_key: "puzzles_solved_today",
    target_count: 1,
    xp_reward: 40,
    coin_reward: 15,
  },
  {
    id: "qst-daily-revise",
    title: "Revise an Older Concept",
    description: "Review a due card in the Memory Vault.",
    quest_type: "daily",
    metric_key: "revisions_completed_today",
    target_count: 1,
    xp_reward: 35,
    coin_reward: 10,
  },
];

export const ACHIEVEMENTS = [
  {
    id: "ach-first-step",
    title: "First Footstep",
    description: "Began your UGC NET CS Journal adventure.",
    badge_icon: "compass",
    xp_reward: 50,
    criteria_key: "first_login",
  },
  {
    id: "ach-pointer-master",
    title: "Railway Architect",
    description: "Mastered Singly Linked Lists & Pointer Mechanics.",
    badge_icon: "train",
    xp_reward: 120,
    criteria_key: "master_linked_list",
  },
  {
    id: "ach-puzzle-solver",
    title: "Dungeon Tactician",
    description: "Solved 3+ interactive CS puzzles.",
    badge_icon: "puzzle",
    xp_reward: 100,
    criteria_key: "puzzles_3",
  },
  {
    id: "ach-mock-warrior",
    title: "Exam Arena Challenger",
    description: "Completed a timed UGC NET Mock Test.",
    badge_icon: "award",
    xp_reward: 150,
    criteria_key: "mock_1",
  },
  {
    id: "ach-streak-7",
    title: "7-Day Scholar Streak",
    description: "Maintained a consistent 7-day study habit.",
    badge_icon: "flame",
    xp_reward: 200,
    criteria_key: "streak_7",
  },
];

export const MOCK_TESTS = [
  {
    id: "mock-full-01",
    title: "UGC NET CS Full-Syllabus Sprint — 01",
    description: "Cross-kingdom timed examination covering DSA, OS, DBMS, TOC, Logic, CSA, Networks, SE & AI.",
    kingdom_id: null,
    duration_minutes: 20,
    total_marks: 28,
    question_ids: [
      "q-ll-1",
      "q-ll-3",
      "q-ll-4",
      "q-os-1",
      "q-os-2",
      "q-db-1",
      "q-db-2",
      "q-toc-1",
      "q-k1-1",
      "q-k2-1",
      "q-k9-1",
      "q-k10-1",
      "q-k6-1",
      "q-ll-2",
    ],
  },
  {
    id: "mock-dsa-01",
    title: "Kingdom VII: DSA & Pointer Mastery Test",
    description: "Focused timed challenge on Linked Lists, Complexity, and Pointer Edge Cases.",
    kingdom_id: "k7-dsa",
    duration_minutes: 10,
    total_marks: 8,
    question_ids: ["q-ll-1", "q-ll-2", "q-ll-3", "q-ll-4"],
  },
];
