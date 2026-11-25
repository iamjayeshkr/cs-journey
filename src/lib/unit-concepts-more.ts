import type { RichConceptSeed } from "./unit-concepts-seed";

export const RICH_CONCEPTS_PART2: RichConceptSeed[] = [
  // UNIT 6: Software Engineering
  {
    id: "c-k6-complexity",
    chapter_id: "ch-k6-se",
    topic_id: "t-k6-1",
    order_index: 1,
    slug: "cyclomatic-complexity-cocomo",
    title: "Cyclomatic Complexity, Testing & COCOMO Estimation",
    difficulty: "beginner",
    simulator_type: "none",
    estimated_minutes: 25,
    xp_reward: 70,
    prerequisites: [],
    learning_objectives: [
      "Calculate McCabe's Cyclomatic Complexity V(G) using three equivalent formulas.",
      "Distinguish White-Box (Basis Path) and Black-Box (Equivalence/BVA) testing.",
      "Compute software effort and duration using Basic COCOMO.",
    ],
    why_it_matters:
      "Directly predicts how hard code is to test and maintain, and how many person-months a software project requires.",
    level_1_beginner:
      "Imagine walking through a maze. Every `if` or `while` fork splits your path in two. Counting those forks tells you the minimum number of test runs needed to walk every corridor at least once!",
    level_2_foundation:
      "McCabe's Cyclomatic Complexity V(G) = E - N + 2P (edges E, nodes N, connected components P) = D + 1 (binary decisions D) = Regions in a planar CFG. COCOMO Effort E = a × (KLOC)^b person-months.",
    level_3_intermediate:
      "Good modular design targets High Cohesion (elements inside a module belong together) and Low Coupling (minimal inter-module dependency). Equivalence Partitioning + Boundary Value Analysis (BVA) catch off-by-one defects in Black-Box testing.",
    level_4_jrf:
      "COCOMO Modes: Organic (small, familiar: a=2.4, b=1.05), Semi-detached (medium: a=3.0, b=1.12), Embedded (tight hardware constraints: a=3.6, b=1.20). Verification ('building the product right') vs Validation ('building the right product').",
    misconceptions: [
      "Confusing Fault (bug in code) with Failure (observable incorrect behavior during execution).",
    ],
    pseudocode: "V(G) = E - N + 2*P\nEffort_PM = a * (KLOC ** b)",
    complexity: { time: "O(V + E) CFG analysis", space: "O(V)", note: "V(G) > 10 signals refactoring candidate." },
    exam_relevance: "UGC NET Unit 6 staple: V(G) numericals, Cohesion/Coupling ranking, COCOMO modes, Alpha vs Beta testing.",
    teaching_methods: {
      feynman_prompt: "Explain the difference between Verification and Validation using a simple real-world example.",
      feynman_keywords: ["requirements", "right", "build", "check", "user"],
      socratic_questions: [
        { question: "If a single function has 3 independent `if` statements (no `else`), how many linearly independent paths exist?", hint: "D + 1.", answer: "3 + 1 = 4 independent paths." },
      ],
      faded_example: {
        title: "Compute V(G) for E = 14, N = 10, P = 1",
        steps: [
          { prompt: "Apply E - N + 2P:", blank: "14 - 10 + 2(1) = 6", hint: "Plug in E, N, P." },
        ],
      },
      prediction_challenge: {
        scenario: "Which is the BEST form of Cohesion and BEST form of Coupling?",
        options: [
          "Functional Cohesion & Data Coupling",
          "Coincidental Cohesion & Content Coupling",
          "Temporal Cohesion & Common Coupling",
        ],
        correct: "Functional Cohesion & Data Coupling",
        explanation: "Functional cohesion is strongest; Data coupling (passing only needed parameters) is loosest/best.",
      },
      compare_contrast: {
        leftTitle: "White-Box Testing",
        rightTitle: "Black-Box Testing",
        rows: [
          ["Focus", "Internal code & paths", "External specs & I/O"],
          ["Techniques", "Basis Path, Branch Coverage", "Equivalence Partitioning, BVA"],
        ],
      },
      error_analysis: {
        buggyClaim: "High coupling and low cohesion makes software easier to maintain.",
        whyPlausible: "People often invert the pair.",
        correction: "You want HIGH Cohesion (focused modules) and LOW Coupling (minimal dependencies).",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "Three formulas for Cyclomatic Complexity V(G):", back: "E - N + 2P = D + 1 = Number of planar regions." },
      { card_type: "Distinction", front: "Alpha Testing vs Beta Testing:", back: "Alpha = at developer site; Beta = at customer site in real environment." },
    ],
  },
  // UNIT 7: Linked Lists (Flagship 4-Level Concept)
  {
    id: "c-linked-list-intro",
    chapter_id: "ch-k7-linked-list",
    topic_id: "t-k7-2",
    order_index: 1,
    slug: "singly-linked-list",
    title: "Singly Linked List & Pointer Mechanics",
    difficulty: "beginner",
    simulator_type: "linked_list",
    estimated_minutes: 30,
    xp_reward: 90,
    prerequisites: [],
    learning_objectives: [
      "Contrast contiguous arrays with pointer-linked nodes.",
      "Trace insertion at head O(1), middle/end O(n), and deletion.",
      "Perform in-place iterative reversal in O(n) time, O(1) space.",
      "Solve JRF-level pointer traps (tail deletion, O(1) middle-node deletion, cycle detection).",
    ],
    why_it_matters:
      "Linked lists are the foundation for Stacks, Queues, Adjacency Lists, Hash Chaining, and OS kernel queues.",
    level_1_beginner:
      "Think of a treasure hunt or a mountain railway line! In an Array, all houses sit side-by-side on one street. In a Linked List, each station can sit anywhere in the valley, as long as it holds two things: its cargo (`data`) and a signpost (`next`) pointing to the next station. The final station's signpost says `NULL` (end of line).",
    level_2_foundation:
      "A Singly Linked List consists of nodes `N_i = (data_i, next_i)` where `next_i = addr(N_{i+1})` and `next_k = NULL`. `head` points to `N_1`. Inserting or deleting at `head` only updates 1–2 pointers in O(1) time.",
    level_3_intermediate:
      "Searching or accessing the k-th element requires O(k) = O(n) traversal because nodes are non-contiguous. In-place reversal uses three pointers `(prev = NULL, curr = head, next = NULL)`: save `next = curr.next`, flip `curr.next = prev`, advance `prev = curr; curr = next`.",
    level_4_jrf:
      "Classic Traps: (1) Even with a `tail` pointer, deleting the LAST node of a singly linked list takes O(n) because you cannot step backwards from `tail` to find the penultimate node. (2) Given ONLY a pointer `p` to a non-last node, you can delete `p` in O(1) by copying `p.next.data` into `p.data` and bypassing `p.next`. (3) Floyd's Tortoise-and-Hare detects cycles in O(n) time, O(1) space.",
    misconceptions: [
      "Updating `prev.next = newNode` BEFORE `newNode.next = prev.next` — this drops the rest of the list and causes a memory leak!",
      "Assuming a `tail` pointer makes deleting the last node O(1) in a singly linked list.",
    ],
    pseudocode: "reverse(head):\n  prev = NULL; curr = head\n  while curr != NULL:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr; curr = nxt\n  return prev",
    complexity: { time: "Head Ins/Del: O(1) | Search/End-Del: O(n)", space: "O(1) aux for reversal", note: "Extra pointer field per node." },
    exam_relevance: "Top UGC NET Unit 7 topic: pointer-tracing output, complexity with head+tail pointers, Floyd's cycle detection.",
    teaching_methods: {
      feynman_prompt: "Explain to a non-programmer why inserting a new station in the middle of a railway linked list doesn't require moving any other stations.",
      feynman_keywords: ["pointer", "signpost", "redirect", "move", "address"],
      socratic_questions: [
        { question: "If we have both `head` and `tail` pointers, why is inserting at `tail` O(1) while deleting `tail` is O(n)?", hint: "Which direction do `next` pointers point?", answer: "Singly linked list pointers only go forward! You can't reach the node before `tail` without traversing from `head`." },
      ],
      faded_example: {
        title: "Insert `newNode` after `prev`",
        steps: [
          { prompt: "Step 1: Save the rest of the chain by linking `newNode.next =`", blank: "prev.next", hint: "Don't lose the suffix!" },
          { prompt: "Step 2: Now redirect `prev.next =`", blank: "newNode", hint: "Connect prev to newNode." },
        ],
      },
      prediction_challenge: {
        scenario: "You are given ONLY a pointer `p` to node 20 in [10 → 20 → 30 → 40 → NULL]. Can you delete node 20 in O(1)?",
        options: ["Yes, copy 30 into p and bypass node 30", "No, you always need head"],
        correct: "Yes, copy 30 into p and bypass node 30",
        explanation: "Copy `p.next.data` (30) into `p.data`, then set `p.next = p.next.next`!",
      },
      compare_contrast: {
        leftTitle: "Array",
        rightTitle: "Singly Linked List",
        rows: [
          ["Random Access arr[i]", "O(1)", "O(n)"],
          ["Insert at Front", "O(n) shift", "O(1)"],
          ["Memory", "Contiguous", "Scattered + pointer overhead"],
        ],
      },
      error_analysis: {
        buggyClaim: "With a `tail` pointer, deleting the last node of a singly linked list is O(1).",
        whyPlausible: "Inserting at `tail` IS O(1), so people assume deletion is too.",
        correction: "Deletion requires updating the SECOND-LAST node's `next` to NULL, which requires O(n) traversal from `head` (unless it's a Doubly Linked List).",
      },
    },
    flashcards: [
      { card_type: "Complexity", front: "Time complexity to delete the last node of a Singly Linked List (with head & tail):", back: "O(n), because you must find the second-last node." },
      { card_type: "Algorithm", front: "Three pointers used for O(1)-space linked list reversal:", back: "prev, curr, next." },
    ],
  },
  // UNIT 7: Sorting & Asymptotics
  {
    id: "c-sorting-arena",
    chapter_id: "ch-k7-trees-graphs",
    topic_id: "t-k7-3",
    order_index: 2,
    slug: "sorting-algorithms-analysis",
    title: "Comparison Sorting: QuickSort, MergeSort & HeapSort",
    difficulty: "intermediate",
    simulator_type: "sorting_arena",
    estimated_minutes: 25,
    xp_reward: 80,
    prerequisites: ["c-linked-list-intro"],
    learning_objectives: [
      "Prove the Ω(n log n) comparison sorting lower bound via decision trees.",
      "Compare stability, in-place behavior, and best/avg/worst cases of major sorts.",
    ],
    why_it_matters:
      "Sorting is a core building block for database joins, binary search, greedy algorithms, and Master Theorem recurrences.",
    level_1_beginner:
      "Sorting cards in your hand one by one is Insertion Sort. Splitting a giant stack in half, sorting each half, and zipping them together is MergeSort. Picking one 'pivot' card and putting smaller ones left and larger ones right is QuickSort!",
    level_2_foundation:
      "MergeSort: T(n) = 2T(n/2) + Θ(n) = Θ(n log n) always, Stable, O(n) extra space. QuickSort: Θ(n log n) average, Θ(n^2) worst case, Unstable, O(log n) stack space. HeapSort: Θ(n log n) worst, Unstable, O(1) space.",
    level_3_intermediate:
      "A comparison sort on n distinct elements corresponds to a binary decision tree with at least n! leaves. Its height h ≥ log2(n!) = Ω(n log n) by Stirling's approximation.",
    level_4_jrf:
      "Non-comparison sorts (Counting, Radix, Bucket) bypass Ω(n log n) in O(n + k) when keys are bounded integers. Radix sort requires a STABLE inner sort (like Counting Sort) to preserve digit ordering.",
    misconceptions: [
      "Thinking QuickSort's worst case is O(n log n). Deterministic QuickSort hits O(n^2) on already-sorted input with naive pivot selection!",
    ],
    pseudocode: "MergeSort(A): split -> sort left -> sort right -> merge in O(n)",
    complexity: { time: "Ω(n log n) comparison lower bound", space: "HeapSort O(1) | MergeSort O(n)", note: "Insertion sort is O(n) on sorted input." },
    exam_relevance: "UGC NET Unit 7 staple: stability comparisons, worst-case inputs for QuickSort, Master Theorem recurrences.",
    teaching_methods: {
      feynman_prompt: "Why does Radix Sort break if its digit-by-digit inner sort is unstable?",
      feynman_keywords: ["order", "previous", "tie", "preserve", "stable"],
      socratic_questions: [
        { question: "Which O(n log n) worst-case sort uses O(1) auxiliary space?", hint: "Uses a binary max-heap in-place.", answer: "HeapSort!" },
      ],
      faded_example: {
        title: "Master Theorem for MergeSort: T(n) = 2T(n/2) + n",
        steps: [
          { prompt: "Compute n^(log_b a) = n^(log_2 2) =", blank: "n", hint: "log_2(2) = 1." },
          { prompt: "Case 2 applies, so T(n) =", blank: "Θ(n log n)", hint: "Multiply by log n." },
        ],
      },
      prediction_challenge: {
        scenario: "Which sorting algorithm runs in O(n) time when the input array is already sorted?",
        options: ["Insertion Sort", "Selection Sort", "MergeSort", "HeapSort"],
        correct: "Insertion Sort",
        explanation: "Insertion Sort makes only n-1 comparisons and 0 shifts on an already-sorted array.",
      },
      compare_contrast: {
        leftTitle: "MergeSort",
        rightTitle: "QuickSort",
        rows: [
          ["Worst-case Time", "O(n log n)", "O(n^2)"],
          ["Stable?", "Yes", "No (standard)"],
          ["Extra Space", "O(n)", "O(log n) avg stack"],
        ],
      },
      error_analysis: {
        buggyClaim: "No algorithm can sort integers faster than O(n log n).",
        whyPlausible: "The decision-tree lower bound applies to COMPARISON sorts.",
        correction: "Counting Sort and Radix Sort run in O(n + k) linear time by using key values directly rather than pairwise comparisons.",
      },
    },
    flashcards: [
      { card_type: "Property", front: "Which sort is Stable AND O(n log n) worst-case?", back: "MergeSort." },
      { card_type: "Complexity", front: "Best-case time of Insertion Sort on sorted data:", back: "O(n)." },
    ],
  },
  // UNIT 8: DFA & Automata
  {
    id: "c-dfa-automata",
    chapter_id: "ch-k8-toc",
    topic_id: "t-k8-1",
    order_index: 1,
    slug: "deterministic-finite-automata",
    title: "Deterministic Finite Automata (DFA) & Closure",
    difficulty: "intermediate",
    simulator_type: "automata_dfa",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    learning_objectives: [
      "Define the 5-tuple M = (Q, Σ, δ, q0, F) of a DFA.",
      "Trace string acceptance and design minimal DFAs.",
      "Recall closure and decidability properties across Chomsky hierarchy.",
    ],
    why_it_matters:
      "Finite automata power compiler lexers, regex engines, and protocol state machines, and anchor the Chomsky Hierarchy.",
    level_1_beginner:
      "Picture a turnstile or a brass dial lock with a few numbered positions. Each 0 or 1 you feed in clicks the dial to a new position. If the dial lands on a 'gold' position when your input ends, the password is accepted!",
    level_2_foundation:
      "DFA M = (Q, Σ, δ, q0, F) where δ: Q × Σ → Q is a total function (every state has exactly one transition per symbol). NFA allows ε-transitions and multiple next states, but recognizes the exact same class of Regular Languages.",
    level_3_intermediate:
      "Regular Languages are closed under Union, Intersection, Complement (swap F and Q\\F in a complete DFA), Concatenation, and Kleene Star. Pumping Lemma proves languages like {a^n b^n} are non-regular.",
    level_4_jrf:
      "Myhill-Nerode Theorem: A language L is regular iff the equivalence relation ~_L has finite index (finitely many equivalence classes), and that index equals the exact number of states in the unique minimal DFA for L.",
    misconceptions: [
      "Thinking NFAs are strictly more powerful than DFAs. They are equivalent in recognition power (2^n state blowup worst case), unlike DPDA vs NPDA where NPDA is strictly more powerful!",
    ],
    pseudocode: "runDFA(M, w): q = M.q0; for ch in w: q = M.delta(q, ch); return q in M.F",
    complexity: { time: "O(|w|) acceptance", space: "O(1) finite state", note: "Subset construction DFA from NFA can take O(2^n) states." },
    exam_relevance: "High-frequency UGC NET Unit 8: minimal DFA state counts, closure properties of Regular vs CFL, DPDA vs NPDA.",
    teaching_methods: {
      feynman_prompt: "Why can't a DFA recognize {a^n b^n | n ≥ 0}?",
      feynman_keywords: ["finite", "memory", "count", "states", "unbounded"],
      socratic_questions: [
        { question: "If a complete DFA accepts language L, how do you construct a DFA for the complement L'?", hint: "Flip accepting and non-accepting states.", answer: "Keep Q, Σ, δ, q0 identical and replace F with Q \\ F!" },
      ],
      faded_example: {
        title: "Minimum states for DFA accepting strings of length ≥ 3 over {0,1}",
        steps: [
          { prompt: "States needed to count 0, 1, 2, ≥3 symbols:", blank: "4 states", hint: "q0 (len 0), q1 (len 1), q2 (len 2), q3 (len ≥3)." },
        ],
      },
      prediction_challenge: {
        scenario: "Which language class is NOT closed under Intersection?",
        options: ["Regular", "Context-Free (CFL)", "Recursive"],
        correct: "Context-Free (CFL)",
        explanation: "{a^n b^n c^m} ∩ {a^m b^n c^n} = {a^n b^n c^n}, which is NOT context-free!",
      },
      compare_contrast: {
        leftTitle: "Regular Languages",
        rightTitle: "Context-Free Languages",
        rows: [
          ["Machine", "DFA / NFA (equivalent)", "NPDA (strictly > DPDA)"],
          ["Closed under Intersection?", "Yes", "No"],
        ],
      },
      error_analysis: {
        buggyClaim: "To complement an NFA, just swap F and Q \\ F.",
        whyPlausible: "Works for complete DFAs!",
        correction: "An NFA accepts if ANY path reaches F; swapping F does not invert existential acceptance. Convert to a complete DFA first!",
      },
    },
    flashcards: [
      { card_type: "Theorem", front: "Myhill-Nerode Theorem states:", back: "Index of ~_L equals the number of states in the unique minimal DFA for L." },
      { card_type: "Common Mistake", front: "Are DPDA and NPDA equivalent in power?", back: "No! NPDA is strictly more powerful than DPDA (unlike DFA vs NFA)." },
    ],
  },
  // UNIT 9: Computer Networks — TCP Congestion Control
  {
    id: "c-k9-tcp",
    chapter_id: "ch-k9-net",
    topic_id: "t-k9-1",
    order_index: 1,
    slug: "tcp-congestion-control",
    title: "TCP Flow Control, Congestion Control & Subnetting",
    difficulty: "jrf",
    simulator_type: "none",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    learning_objectives: [
      "Distinguish Flow Control (rwnd) from Congestion Control (cwnd).",
      "Trace Slow Start, Congestion Avoidance (AIMD), Timeout, and 3-Duplicate-ACK.",
      "Compute CIDR subnet masks, network addresses, and usable host counts.",
    ],
    why_it_matters:
      "TCP keeps the global internet stable without collapsing under traffic spikes.",
    level_1_beginner:
      "Think of mailing packages across islands. Flow control makes sure the receiver's mailbox doesn't overflow. Congestion control makes sure the bridges between islands don't jam. TCP starts with 1 boat, doubles each round trip until it hits a limit, then adds 1 boat at a time.",
    level_2_foundation:
      "Effective send window = min(cwnd, rwnd). Slow Start doubles cwnd every RTT (+1 MSS per ACK) until cwnd ≥ ssthresh. Congestion Avoidance increases cwnd linearly (+1 MSS per RTT).",
    level_3_intermediate:
      "In TCP Reno: On 3 Duplicate ACKs (Fast Retransmit), ssthresh = cwnd/2 and cwnd = ssthresh (halved). On Retransmission Timeout (severe congestion), ssthresh = cwnd/2 and cwnd = 1 MSS (back to Slow Start).",
    level_4_jrf:
      "In CIDR `/p` subnetting, `32 - p` host bits yield `2^(32 - p) - 2` usable host addresses (excluding network & broadcast). TCP throughput ≈ (0.75 × W_max) / RTT; Bandwidth-Delay Product = Bandwidth × RTT.",
    misconceptions: [
      "Thinking 'Slow Start' grows linearly. It grows EXPONENTIALLY (1, 2, 4, 8...) per RTT!",
    ],
    pseudocode: "on_3_dup_ack: ssthresh = cwnd/2; cwnd = ssthresh\non_timeout:   ssthresh = cwnd/2; cwnd = 1 MSS",
    complexity: { time: "O(log W) Slow Start RTTs", space: "O(W) send buffer", note: "AIMD ensures fair bandwidth sharing." },
    exam_relevance: "UGC NET Unit 9 classic: TCP Reno cwnd after timeout vs 3-dup-ACK, CIDR `/26` host count.",
    teaching_methods: {
      feynman_prompt: "Why does TCP drop `cwnd` all the way to 1 MSS on a timeout, but only halve it on 3 duplicate ACKs?",
      feynman_keywords: ["duplicate", "ack", "delivering", "severe", "timeout"],
      socratic_questions: [
        { question: "If 3 duplicate ACKs arrive, are packets still reaching the receiver?", hint: "Each duplicate ACK means a later packet arrived!", answer: "Yes! So congestion is mild — halving cwnd suffices." },
      ],
      faded_example: {
        title: "TCP Reno cwnd=32 KB, Timeout occurs",
        steps: [
          { prompt: "New ssthresh = cwnd / 2 =", blank: "16 KB", hint: "32 / 2" },
          { prompt: "New cwnd after timeout =", blank: "1 MSS", hint: "Resets to Slow Start." },
        ],
      },
      prediction_challenge: {
        scenario: "How many usable host IPv4 addresses are in a `/26` CIDR subnet?",
        options: ["64", "62", "30", "126"],
        correct: "62",
        explanation: "32 - 26 = 6 host bits → 2^6 - 2 = 62 usable hosts.",
      },
      compare_contrast: {
        leftTitle: "3 Duplicate ACKs",
        rightTitle: "Timeout",
        rows: [
          ["Severity", "Mild packet loss", "Severe congestion"],
          ["New cwnd", "cwnd / 2", "1 MSS"],
        ],
      },
      error_analysis: {
        buggyClaim: "Slow Start increases cwnd by 1 MSS per RTT.",
        whyPlausible: "The name 'Slow Start' sounds linear!",
        correction: "Slow Start adds 1 MSS per ACK, which DOUBLES cwnd every RTT (exponential growth).",
      },
    },
    flashcards: [
      { card_type: "Formula", front: "Usable IPv4 hosts in a `/p` CIDR block:", back: "2^(32 - p) - 2." },
      { card_type: "Common Mistake", front: "Growth rate of TCP Slow Start per RTT:", back: "Exponential (doubles each RTT)." },
    ],
  },
  // UNIT 10: AI — Heuristic Search & A*
  {
    id: "c-k10-astar",
    chapter_id: "ch-k10-ai",
    topic_id: "t-k10-1",
    order_index: 1,
    slug: "heuristic-search-a-star",
    title: "Heuristic Search, A* Optimality & Alpha-Beta Pruning",
    difficulty: "jrf",
    simulator_type: "graph_search",
    estimated_minutes: 25,
    xp_reward: 85,
    prerequisites: [],
    learning_objectives: [
      "Evaluate f(n) = g(n) + h(n) in A* search.",
      "Prove why Admissibility (h(n) ≤ h*(n)) guarantees optimality.",
      "Trace Minimax and Alpha-Beta cutoff conditions (α ≥ β).",
    ],
    why_it_matters:
      "A* and Alpha-Beta pruning underpin GPS routing, robotics, and classical game-playing AI.",
    level_1_beginner:
      "Imagine hiking to a mountain hut. BFS checks every single trail in every direction. Greedy search sprints straight toward the hut even if a cliff blocks the way. A* is smart: it adds the distance you've ALREADY walked g(n) plus an optimistic guess of remaining distance h(n).",
    level_2_foundation:
      "A* expands the node with lowest f(n) = g(n) + h(n). A heuristic h(n) is admissible if it NEVER overestimates the true cost h*(n) to the goal: 0 ≤ h(n) ≤ h*(n).",
    level_3_intermediate:
      "A heuristic is consistent (monotonic) if h(n) ≤ c(n, n') + h(n') for every edge. Consistency implies admissibility. In two-player zero-sum games, Minimax explores the game tree and Alpha-Beta pruning cuts off branches whenever α ≥ β without changing the Minimax value.",
    level_4_jrf:
      "Special cases of A*: h(n) = 0 reduces A* to Uniform Cost Search (Dijkstra). If h1(n) ≤ h2(n) ≤ h*(n), then h2 dominates h1 and expands fewer or equal nodes. Optimal move ordering lets Alpha-Beta search depth d in O(b^(d/2)) instead of O(b^d).",
    misconceptions: [
      "Thinking an overestimating heuristic makes A* faster AND still optimal. Overestimating can find a suboptimal path!",
    ],
    pseudocode: "f(n) = g(n) + h(n)\nprune_branch when alpha >= beta",
    complexity: { time: "O(b^d) worst | O(b^(d/2)) Alpha-Beta best", space: "O(b^d) A* open list", note: "Consistent h guarantees optimal first goal expansion." },
    exam_relevance: "UGC NET Unit 10 core: A* admissibility, dominance of heuristics, Alpha-Beta pruning.",
    teaching_methods: {
      feynman_prompt: "Why must A*'s heuristic never overestimate the remaining distance to guarantee the shortest path?",
      feynman_keywords: ["overestimate", "optimal", "skip", "shorter", "true"],
      socratic_questions: [
        { question: "If h(n) = 0 for all nodes, which classic graph algorithm does A* become?", hint: "Only g(n) matters.", answer: "Dijkstra's / Uniform Cost Search!" },
      ],
      faded_example: {
        title: "Evaluate A* f(n)",
        steps: [
          { prompt: "If g(n) = 7 and admissible h(n) = 4, f(n) =", blank: "11", hint: "g(n) + h(n)" },
        ],
      },
      prediction_challenge: {
        scenario: "With perfect move ordering, Alpha-Beta pruning reduces the effective branching factor b to:",
        options: ["sqrt(b)", "b / 2", "log(b)", "b^2"],
        correct: "sqrt(b)",
        explanation: "Time drops from O(b^d) to O(b^(d/2)) = O((√b)^d).",
      },
      compare_contrast: {
        leftTitle: "Greedy Best-First (f = h)",
        rightTitle: "A* Search (f = g + h)",
        rows: [
          ["Optimal?", "No", "Yes (if h is admissible)"],
          ["Uses path cost so far?", "No", "Yes, g(n)"],
        ],
      },
      error_analysis: {
        buggyClaim: "Alpha-Beta pruning sometimes returns a slightly worse move than full Minimax in exchange for speed.",
        whyPlausible: "Pruning sounds like approximation.",
        correction: "Alpha-Beta is 100% EXACT — it guarantees the exact same Minimax decision by pruning only provably irrelevant branches.",
      },
    },
    flashcards: [
      { card_type: "Definition", front: "Admissible heuristic condition:", back: "0 ≤ h(n) ≤ h*(n) (never overestimates true goal cost)." },
      { card_type: "Property", front: "Does Alpha-Beta pruning change the Minimax outcome?", back: "No — it returns the exact same value as full Minimax." },
    ],
  },
];
