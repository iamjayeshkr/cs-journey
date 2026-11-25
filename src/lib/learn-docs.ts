export type LearnLang = "en" | "hinglish";

export type VisualKind =
  | "logic_gate"
  | "pipeline"
  | "memory_stack"
  | "sql_table"
  | "cpu_gantt"
  | "cfg_graph"
  | "tree_heap"
  | "automata"
  | "osi_layers"
  | "ai_search";

export interface TopicDocContent {
  visualKind: VisualKind;
  visualTitle: string;
  en: {
    tldr: string;
    story: string;
    steps: { heading: string; detail: string }[];
    exampleTitle: string;
    exampleBody: string;
    mistakeToAvoid: string;
    shortcut: string;
  };
  hinglish: {
    tldr: string;
    story: string;
    steps: { heading: string; detail: string }[];
    exampleTitle: string;
    exampleBody: string;
    mistakeToAvoid: string;
    shortcut: string;
  };
  keySymbols: { sym: string; meaningEn: string; meaningHi: string }[];
}

interface UnitDocProfile {
  visualKind: VisualKind;
  visualTitle: string;
  enStory: (topic: string) => string;
  hiStory: (topic: string) => string;
  enSteps: (topic: string) => { heading: string; detail: string }[];
  hiSteps: (topic: string) => { heading: string; detail: string }[];
  enExample: (topic: string) => { title: string; body: string };
  hiExample: (topic: string) => { title: string; body: string };
  enMistake: (topic: string) => string;
  hiMistake: (topic: string) => string;
  enShortcut: (topic: string) => string;
  hiShortcut: (topic: string) => string;
  symbols: { sym: string; meaningEn: string; meaningHi: string }[];
}

const UNIT_PROFILES: Record<string, UnitDocProfile> = {
  Discrete: {
    visualKind: "logic_gate",
    visualTitle: "Interactive Truth & Logic Explorer",
    enStory: (t) =>
      `Think of ${t} like the grammar rules of mathematics. Just as English needs clear rules so two people don't misunderstand a sentence, computers need ${t} so every True/False decision, set grouping, or network graph is 100% unambiguous.`,
    hiStory: (t) =>
      `${t} ko maths ki grammar samjho! Jaise baat karte waqt clear rules chahiye taaki koi confusion na ho, waise hi computer ko ${t} chahiye taaki har True/False, set ya graph ka decision bilkul pakka aur exact ho.`,
    enSteps: (t) => [
      { heading: "1. Spot the Building Blocks", detail: `Break ${t} into basic elements: statements (P, Q), sets (A, B), or vertices & edges (V, E).` },
      { heading: "2. Apply the Core Rule", detail: `Check how elements combine — e.g., P → Q is only false when P is True and Q is False.` },
      { heading: "3. Verify Edge Cases", detail: `Test empty sets (∅), zero-degree nodes, or boundary values before picking an MCQ answer.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Basic Pieces Pehchano", detail: `${t} ko chhote hisson mein todo: statements (P, Q), sets (A, B), ya graph ke nodes aur edges.` },
      { heading: "2. Main Rule Lagao", detail: `Dekho elements kaise judte hain — jaise P → Q sirf tab False hota hai jab P True ho aur Q False.` },
      { heading: "3. Edge Cases Check Karo", detail: `MCQ mark karne se pehle empty set (∅) ya boundary values zaroor check karo.` },
    ],
    enExample: (t) => ({
      title: `Quick Walkthrough: ${t}`,
      body: `Suppose "If it rains (P), I carry an umbrella (Q)". If it rains (T) and I have NO umbrella (F), the promise breaks (False). In all other 3 cases, the promise holds (True)!`,
    }),
    hiExample: (t) => ({
      title: `Asaan Example: ${t}`,
      body: `Maan lo promise hai: "Agar baarish hui (P), toh chhata launga (Q)". Promise sirf tab tootega jab baarish ho (True) aur chhata na ho (False). Baaki sab cases mein promise True rahega!`,
    }),
    enMistake: () => "Students often confuse Converse (Q → P) with Contrapositive (¬Q → ¬P). Only Contrapositive is equivalent to P → Q!",
    hiMistake: () => "Sabse badi galti: Converse (Q → P) ko P → Q ke barabar maan lena. Sirf Contrapositive (¬Q → ¬P) hi barabar hota hai!",
    enShortcut: () => "For '¬(∀x P(x))', flip ∀ to ∃ and push ¬ inside: ∃x ¬P(x).",
    hiShortcut: () => "Trick: Jab bhi 'Sabhi (∀)' ka NOT nikalna ho, toh 'Kam se kam ek (∃)' kar do aur andar NOT laga do!",
    symbols: [
      { sym: "→", meaningEn: "If ... then (Implies)", meaningHi: "Agar ... toh (Implication)" },
      { sym: "≡", meaningEn: "Logically equal (same truth table)", meaningHi: "Bilkul barabar (same output)" },
      { sym: "¬", meaningEn: "NOT (flips True/False)", meaningHi: "Ulta kar do (True ko False)" },
      { sym: "∀ / ∃", meaningEn: "For All / There Exists", meaningHi: "Sabhi ke liye / Kam se kam ek" },
    ],
  },
  "Computer System": {
    visualKind: "pipeline",
    visualTitle: "Interactive CPU Pipeline & Gate Flow",
    enStory: (t) =>
      `Imagine a busy car wash with 4 stations: Soap, Scrub, Rinse, and Dry. Instead of waiting for one car to finish all 4 steps before starting the next, ${t} keeps every hardware station busy at the same time so work finishes much faster!`,
    hiStory: (t) =>
      `Ek car-wash ki line socho jisme 4 stations hain: Soap, Wash, Rinse, Dry. Agar ek gaadi ke poora nikalne ka wait karenge toh bahut time lagega. ${t} mein har station ek saath alag gaadi par kaam karta hai — speed 4x ho jaati hai!`,
    enSteps: (t) => [
      { heading: "1. Bits & Signals (0 and 1)", detail: `Everything inside ${t} runs on binary voltage levels (0 = LOW, 1 = HIGH).` },
      { heading: "2. Hardware Stages", detail: `Instructions flow through Fetch -> Decode -> Execute -> Memory -> Writeback.` },
      { heading: "3. Speed vs Cost Trade-off", detail: `Fastest memory (Registers/Cache) is tiny; slower memory (RAM/Disk) is huge.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Sab Kuch 0 aur 1 Hai", detail: `${t} ke andar saare signals sirf 0 (OFF) aur 1 (ON) mein chalte hain.` },
      { heading: "2. Step-by-Step Hardware Flow", detail: `Har instruction Fetch -> Decode -> Execute -> Memory -> Writeback stages se guzarta hai.` },
      { heading: "3. Fast vs Sasta Memory", detail: `Cache aur Registers super fast par chhote hote hain; RAM/Disk bade par thode slow.` },
    ],
    enExample: (t) => ({
      title: `Hardware Example: ${t}`,
      body: `With a 5-stage pipeline running 100 instructions (1 cycle/stage): non-pipelined takes 500 cycles, pipelined takes only 5 + 99 = 104 cycles (~4.8x faster)!`,
    }),
    hiExample: (t) => ({
      title: `Real Calculation: ${t}`,
      body: `Agar 5-stage pipeline mein 100 instructions chalani hain: bina pipeline 500 cycles lagenge, par pipeline ke saath sirf 5 + 99 = 104 cycles (~4.8x fast)!`,
    }),
    enMistake: () => "Forgetting that pipeline clock period is limited by the SLOWEST stage plus latch delay.",
    hiMistake: () => "Yeh mat bhoolna ki pipeline ki speed hamesha sabse SLOW stage par depend karti hai!",
    enShortcut: () => "NAND & NOR are Universal Gates; 2's complement of N is (~N + 1).",
    hiShortcut: () => "Yaad rakho: NAND aur NOR Universal Gates hain — inse koi bhi gate ban sakta hai.",
    symbols: [
      { sym: "⊕", meaningEn: "XOR: 1 when inputs differ", meaningHi: "XOR: Alag inputs par 1 deta hai" },
      { sym: "2^n", meaningEn: "Addressable locations with n bits", meaningHi: "n bits se kitne addresses banenge" },
      { sym: "h", meaningEn: "Cache Hit Ratio (0 to 1)", meaningHi: "Cache mein data milne ka chance" },
    ],
  },
  Programming: {
    visualKind: "memory_stack",
    visualTitle: "Interactive Stack Frame & Pointer Visualizer",
    enStory: (t) =>
      `Think of ${t} like writing a recipe with sticky notes on your kitchen wall. Functions put their local ingredients on top of a Stack of plates — when a function finishes, its plate is removed automatically!`,
    hiStory: (t) =>
      `${t} ko kitchen mein plates ke stack jaisa samjho! Jab bhi naya function call hota hai, ek nayi plate upar rakhi jaati hai (Stack Frame). Kaam khatam hote hi woh plate hat jaati hai!`,
    enSteps: (t) => [
      { heading: "1. Where Data Lives", detail: `Stack holds local variables automatically; Heap holds dynamic objects until freed/GC'd.` },
      { heading: "2. Pointers & References", detail: `A pointer stores a memory address (like a house number), not the value itself.` },
      { heading: "3. Clean Abstraction", detail: `Functions, recursion, and OOP classes break big programs into reusable pieces.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Data Kahan Rehta Hai", detail: `Local variables Stack mein rehte hain; dynamic data (new/malloc) Heap mein banta hai.` },
      { heading: "2. Pointer = Ghar Ka Address", detail: `Pointer khud value nahi rakhta, balki uss value ka RAM address store karta hai.` },
      { heading: "3. Code Reuse", detail: `Functions, recursion aur OOP bade code ko chhote manageable parts mein baant dete hain.` },
    ],
    enExample: (t) => ({
      title: `Code Trace: ${t}`,
      body: `In Call by Value, changing parameter x inside a helper does NOT change caller's variable. In Call by Reference, both point to the same box, so changes stick!`,
    }),
    hiExample: (t) => ({
      title: `Code Samjho: ${t}`,
      body: `Call by Value mein photocopy jaati hai — function ke andar change karne se asli variable nahi badalta. Call by Reference mein asli address jaata hai!`,
    }),
    enMistake: () => "Returning the address of a local stack variable creates a dangling pointer!",
    hiMistake: () => "Kabhi bhi local variable ka address function se return mat karo — stack pop hote hi woh invalid ho jaata hai!",
    enShortcut: () => "C/Java/Python = Row-Major; static variables keep their value across calls.",
    hiShortcut: () => "Trick: static variable ek hi baar initialize hota hai aur poore program tak value yaad rakhta hai.",
    symbols: [
      { sym: "*p", meaningEn: "Dereference: value at address p", meaningHi: "p address par rakhi asli value" },
      { sym: "&x", meaningEn: "Address-of operator", meaningHi: "x ka RAM address" },
      { sym: "O(1)", meaningEn: "Constant time/space", meaningHi: "Fix time — input size se farq nahi" },
    ],
  },
  Database: {
    visualKind: "sql_table",
    visualTitle: "Interactive SQL Filter (σ) & Projection (π) Table",
    enStory: (t) =>
      `Think of a Database like a super-disciplined school register. If you write a student's phone number in 50 places and they change their number, updating it everywhere is a nightmare. ${t} keeps data clean, linked, and safe even if the power goes out mid-save!`,
    hiStory: (t) =>
      `Database ko ek smart school register samjho! Agar ek student ka phone number 50 jagah likha ho aur woh badal jaaye, toh har jagah update karna mushkil hai. ${t} data ko clean, bina duplicate aur bilkul safe rakhta hai — chahe light chali jaaye!`,
    enSteps: (t) => [
      { heading: "1. Tables, Rows & Keys", detail: `Primary Key uniquely identifies each row; Foreign Key links two tables cleanly.` },
      { heading: "2. Relational Operations", detail: `σ filters rows (WHERE), π picks columns (SELECT), and ⋈ joins matching tables.` },
      { heading: "3. ACID & Normalization", detail: `Normalization removes redundancy; ACID guarantees safe concurrent transactions.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Table, Row aur Key", detail: `Primary Key har row ko unique banati hai; Foreign Key do tables ko jodti hai.` },
      { heading: "2. σ aur π Ka Khel", detail: `σ (Sigma) = rows filter karo (WHERE); π (Pi) = columns chuno (SELECT); ⋈ = Join karo.` },
      { heading: "3. Clean & Safe Data", detail: `Normalization duplicate data hatata hai, aur ACID transactions ko crash se bachata hai.` },
    ],
    enExample: (t) => ({
      title: `SQL & Normalization: ${t}`,
      body: `To find CS students with marks > 80: Relational Algebra writes π_name(σ_dept='CS' ∧ marks>80(Student)). Filter rows first, then pick the name column!`,
    }),
    hiExample: (t) => ({
      title: `Easy Example: ${t}`,
      body: `Agar CS branch ke >80 marks wale students chahiye: pehle σ se rows filter karo (WHERE dept='CS' AND marks>80), phir π se sirf Name column nikalo!`,
    }),
    enMistake: () => "Putting COUNT(*) > 2 inside WHERE instead of HAVING — WHERE runs BEFORE GROUP BY!",
    hiMistake: () => "WHERE ke andar kabhi COUNT(*) ya SUM() mat lagao — groups filter karne ke liye hamesha HAVING use karo!",
    enShortcut: () => "1NF (Atomic) -> 2NF (No Partial) -> 3NF (No Transitive) -> BCNF (LHS is Superkey).",
    hiShortcut: () => "Trick: σ = Select rows, π = Pick columns! Aur BCNF matlab har arrow ke left side Superkey honi chahiye.",
    symbols: [
      { sym: "σ", meaningEn: "Select rows matching condition", meaningHi: "Condition se rows chhantna (WHERE)" },
      { sym: "π", meaningEn: "Project specific columns", meaningHi: "Sirf chune hue columns dikhana" },
      { sym: "⋈", meaningEn: "Join two tables on common key", meaningHi: "Do tables ko common column se jodna" },
      { sym: "→", meaningEn: "Functional Dependency (X determines Y)", meaningHi: "X pata ho toh Y pakka pata chalega" },
    ],
  },
  "Operating System": {
    visualKind: "cpu_gantt",
    visualTitle: "Interactive CPU Scheduling Gantt Explorer",
    enStory: (t) =>
      `The Operating System is like the Traffic Police + Kitchen Manager of your computer. Ten apps want the CPU, RAM, and Disk at the exact same time — ${t} decides who goes next so nobody crashes or starves!`,
    hiStory: (t) =>
      `Operating System tumhare computer ka Traffic Police aur Manager hai! Jab 10 apps ek saath CPU aur RAM maangti hain, toh ${t} decide karta hai kiski baari kab aayegi taaki system hang ya deadlock na ho!`,
    enSteps: (t) => [
      { heading: "1. Process Lifecycle", detail: `A program in execution moves between New -> Ready -> Running -> Waiting -> Terminated.` },
      { heading: "2. Fair & Fast Scheduling", detail: `SJF/SRTF minimizes average wait time; Round Robin gives everyone a fair time quantum.` },
      { heading: "3. Memory & Deadlocks", detail: `Paging avoids external fragmentation; breaking any 1 of 4 Coffman conditions prevents deadlock.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Process Ke States", detail: `Chalta hua program Ready -> Running -> Waiting states ke beech ghoomta rehta hai.` },
      { heading: "2. Scheduling Rules", detail: `SRTF sabse kam wait time deta hai; Round Robin har app ko barabar time-slice deta hai.` },
      { heading: "3. RAM aur Deadlock", detail: `Paging se RAM waste nahi hoti; Deadlock rokne ke liye 4 conditions mein se koi ek tod do.` },
    ],
    enExample: (t) => ({
      title: `Scheduling Snapshot: ${t}`,
      body: `If P1 needs 8ms and P2 needs 2ms arriving together: FCFS makes P2 wait 8ms (avg 4ms). SJF runs P2 first, so avg wait drops to 1ms!`,
    }),
    hiExample: (t) => ({
      title: `Real Life Example: ${t}`,
      body: `Dukaan par kisi ko 8 minute ka kaam hai aur kisi ko sirf 2 minute ka: chhote kaam (SJF) ko pehle nipatao toh sabka average waiting time bahut kam ho jaata hai!`,
    }),
    enMistake: () => "Thinking adding more RAM frames ALWAYS lowers page faults — FIFO suffers from Belady's Anomaly!",
    hiMistake: () => "FIFO page replacement mein kabhi-kabhi zyada RAM frames dene par bhi page faults badh jaate hain (Belady's Anomaly)!",
    enShortcut: () => "TAT = Completion − Arrival; Waiting Time = TAT − Burst.",
    hiShortcut: () => "Formula yaad rakho: TAT = Exit − Entry, aur Wait = TAT − Kaam ka time (Burst).",
    symbols: [
      { sym: "WT", meaningEn: "Waiting Time in Ready Queue", meaningHi: "Queue mein kitni der wait kiya" },
      { sym: "TAT", meaningEn: "Turnaround Time (Exit − Arrival)", meaningHi: "Aane se jaane tak ka total time" },
    ],
  },
  "Software Engineering": {
    visualKind: "cfg_graph",
    visualTitle: "Interactive Control Flow & Cyclomatic Complexity V(G)",
    enStory: (t) =>
      `Building software without ${t} is like building a 10-story apartment without a blueprint or safety inspection. ${t} helps teams estimate cost, test every branch, and keep modules clean so fixing one bug doesn't create three new ones!`,
    hiStory: (t) =>
      `Bina ${t} ke bada software banana bina naksha banaye 10-manzila building banane jaisa hai! ${t} humein sikhata hai ki time/cost kaise estimate karein, bugs kaise pakdein aur code clean kaise rakhein.`,
    enSteps: (t) => [
      { heading: "1. Right Process Model", detail: `Waterfall for fixed specs; Agile/Spiral when requirements evolve rapidly.` },
      { heading: "2. Clean Architecture", detail: `Aim for HIGH Cohesion (focused module) and LOW Coupling (minimal interdependence).` },
      { heading: "3. Systematic Testing", detail: `Measure independent paths with McCabe's V(G) = P + 1 and test boundaries.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Sahi Model Chuno", detail: `Requirements fix hain toh Waterfall; baar-baar badalti hain toh Agile/Spiral best hai.` },
      { heading: "2. High Cohesion, Low Coupling", detail: `Har module apna kaam pakke se kare (High Cohesion) aur doosron par kam depend kare (Low Coupling).` },
      { heading: "3. Smart Testing", detail: `Cyclomatic Complexity V(G) = P + 1 se pata chalta hai kam se kam kitne test cases chahiye.` },
    ],
    enExample: (t) => ({
      title: `Testing Metric: ${t}`,
      body: `A function with 2 'if' statements and 1 'while' loop has P = 3 predicate nodes, so Cyclomatic Complexity V(G) = 3 + 1 = 4 independent test paths!`,
    }),
    hiExample: (t) => ({
      title: `Asaan Hisab: ${t}`,
      body: `Agar code mein 2 'if' aur 1 'while' loop hai, toh total decision points P = 3 hue. Isliye V(G) = 3 + 1 = 4 test cases zaroori hain!`,
    }),
    enMistake: () => "Confusing Verification ('building it right' — reviews) with Validation ('building the right thing' — user testing).",
    hiMistake: () => "Verification = specs ke hisab se sahi banana; Validation = customer ko jo chahiye wohi banana!",
    enShortcut: () => "Best Cohesion = Functional; Best Coupling = Data Coupling.",
    hiShortcut: () => "Golden Rule: Cohesion HIGH hona chahiye, Coupling LOW hona chahiye!",
    symbols: [
      { sym: "V(G)", meaningEn: "Cyclomatic Complexity = E − N + 2 = P + 1", meaningHi: "Independent paths ki ginti (P + 1)" },
      { sym: "KLOC", meaningEn: "Thousands of Lines of Code", meaningHi: "Hazaar lines of code" },
    ],
  },
  "Data Structures": {
    visualKind: "tree_heap",
    visualTitle: "Interactive Tree, Heap & Complexity Visualizer",
    enStory: (t) =>
      `Suppose you have 10 lakh books. If you dump them in one big pile, finding one book takes hours. If you arrange them alphabetically or in a Binary Search Tree, you find any book in just 20 steps! That's the magic of ${t}.`,
    hiStory: (t) =>
      `Socho tumhare paas 10 lakh kitaabein hain. Agar dher laga kar rakhoge toh ek kitaab dhoondhne mein ghante lagenge. Agar unhe Binary Search Tree ya Sorted order mein rakhoge, toh sirf 20 steps mein mil jaayegi! Yahi ${t} ka jaadu hai.`,
    enSteps: (t) => [
      { heading: "1. Pick the Right Container", detail: `Arrays for O(1) index access; Linked Lists for O(1) splices; Hash Tables for O(1) avg lookup.` },
      { heading: "2. Measure Growth (O, Θ, Ω)", detail: `Ignore constants and small terms — focus on how runtime scales as n -> ∞.` },
      { heading: "3. Divide, Conquer & Balance", detail: `Balanced trees (AVL/RB) and Divide-and-Conquer keep operations at O(log n) or O(n log n).` },
    ],
    hiSteps: (t) => [
      { heading: "1. Sahi Data Structure Chuno", detail: `Fast index ke liye Array, fast insert/delete ke liye Linked List, aur fast search ke liye Hash Map / BST.` },
      { heading: "2. Speed Naapo (Big-O)", detail: `Chhote numbers chhodo — dekho jab data (n) bahut bada hoga tab time kitni tezi se badhega.` },
      { heading: "3. Balance Rakho", detail: `AVL/Red-Black tree height ko O(log n) par control rakhte hain taaki search slow na ho.` },
    ],
    enExample: (t) => ({
      title: `Speed Comparison: ${t}`,
      body: `Searching 1,000,000 sorted items: Linear Scan takes up to 1,000,000 steps (O(n)), while Binary Search cuts the problem in half each step and finishes in ≤ 20 steps (O(log n))!`,
    }),
    hiExample: (t) => ({
      title: `Power of O(log n): ${t}`,
      body: `10 lakh sorted items mein ek item dhoondhna hai: Linear search mein 10 lakh steps lag sakte hain, par Binary Search har baar aadha karke sirf 20 steps mein dhoondh leta hai!`,
    }),
    enMistake: () => "Assuming Build-Heap takes O(n log n) — bottom-up Build-Heap actually runs in O(n) linear time!",
    hiMistake: () => "Build-Heap O(n log n) nahi balki O(n) hota hai, kyunki neeche ke zyada nodes ko kam swap karna padta hai!",
    enShortcut: () => "Master Theorem: T(n) = aT(n/b) + f(n) compares leaf work n^(log_b a) vs root work f(n).",
    hiShortcut: () => "Master Theorem mein bas n^(log_b a) aur f(n) ki race karao — jo bada woh jeeta, barabar toh log n lagao!",
    symbols: [
      { sym: "O()", meaningEn: "Upper bound (worst-case ceiling)", meaningHi: "Zyada se zyada itna time lagega" },
      { sym: "Θ()", meaningEn: "Tight bound (exact growth)", meaningHi: "Bilkul exact growth rate" },
      { sym: "Ω()", meaningEn: "Lower bound (best-case floor)", meaningHi: "Kam se kam itna time lagega" },
    ],
  },
  "Theory of Computation": {
    visualKind: "automata",
    visualTitle: "Interactive Finite Automaton (DFA) State Stepper",
    enStory: (t) =>
      `Think of ${t} like a Metro Ticket Gate or Vending Machine. It doesn't have an infinite brain — it only remembers its current State (Locked or Unlocked) and moves to the next state when you tap a coin or card!`,
    hiStory: (t) =>
      `${t} ko Metro ke Ticket Gate ya Vending Machine jaisa samjho! Iske paas bahut bada dimaag nahi hota — bas current State yaad rakhta hai (Locked/Unlocked) aur input milte hi agli state par jump karta hai!`,
    enSteps: (t) => [
      { heading: "1. The 5-Tuple Machine", detail: `Every machine has States (Q), Alphabet (Σ), Transition rule (δ), Start (q₀), and Final states (F).` },
      { heading: "2. Memory Power Ladder", detail: `DFA (no extra memory) < PDA (1 Stack) < Turing Machine (Infinite Tape).` },
      { heading: "3. What Can Never Be Solved", detail: `Even a Turing Machine cannot solve the Halting Problem (Undecidable).` },
    ],
    hiSteps: (t) => [
      { heading: "1. Machine Ke 5 Hissay", detail: `Q (States), Σ (Input letters), δ (Transition arrow), q₀ (Start), aur F (Final goal state).` },
      { heading: "2. Power Ki Seedhi", detail: `DFA (bina memory) < PDA (ek Stack) < Turing Machine (unlimited Tape).` },
      { heading: "3. Limits of Computing", detail: `Halting Problem jaisi kuch cheezein Turing Machine bhi kabhi solve nahi kar sakti (Undecidable).` },
    ],
    enExample: (t) => ({
      title: `Machine Example: ${t}`,
      body: `To accept strings ending in 'ab': stay in q0 until 'a' moves to q1, then 'b' moves to accepting state q2. Any other letter loops back cleanly!`,
    }),
    hiExample: (t) => ({
      title: `Asaan Machine: ${t}`,
      body: `Agar 'ab' par khatam hone wali string accept karni hai: 'a' milne par q1 jao, phir 'b' milte hi Final state q2 pahunch jao!`,
    }),
    enMistake: () => "Thinking Context-Free Languages are closed under Intersection or Complement — they are NOT!",
    hiMistake: () => "Yaad rakhna: Context-Free Languages Intersection aur Complement ke under closed NAHI hoti!",
    enShortcut: () => "Chomsky Hierarchy: Regular (Type 3) ⊂ CFL (Type 2) ⊂ CSL (Type 1) ⊂ RE (Type 0).",
    hiShortcut: () => "Trick: Regular -> DFA, Context-Free -> PDA, Recursively Enumerable -> Turing Machine!",
    symbols: [
      { sym: "Σ", meaningEn: "Finite input alphabet", meaningHi: "Allowed input letters ka set" },
      { sym: "δ", meaningEn: "Transition function (state + input -> next state)", meaningHi: "Agli state batane wala rule" },
      { sym: "ε", meaningEn: "Empty string (length 0)", meaningHi: "Khaali string (bina character ke)" },
    ],
  },
  "Data Communication": {
    visualKind: "osi_layers",
    visualTitle: "Interactive OSI 7-Layer Packet Journey",
    enStory: (t) =>
      `Sending a WhatsApp message across the internet is like mailing a parcel across countries. You write the letter (Application), pack & address it (TCP/IP), hand it to the courier truck (Data Link), and it travels over wires/Wi-Fi (Physical)!`,
    hiStory: (t) =>
      `Internet par ek message bhejna courier parcel bhejne jaisa hai! Pehle letter likho (Application), uspe pin-code aur address likho (TCP/IP), courier truck mein daalo (Data Link), aur road/wires par bhej do (Physical)!`,
    enSteps: (t) => [
      { heading: "1. Layered Encapsulation", detail: `Each OSI layer wraps the data with its own header on send and unwraps it on receive.` },
      { heading: "2. Reliable Delivery", detail: `CRC/Hamming catches bit errors; TCP ACKs and Sliding Window retransmit lost packets.` },
      { heading: "3. Smart Routing", detail: `IP addresses route packets globally across networks; MAC addresses deliver inside a local LAN.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Har Layer Ka Lifafa", detail: `Bhejte waqt har OSI layer apna header (label) chipkati hai; milte waqt ek-ek karke kholti hai.` },
      { heading: "2. Error Aur Lost Packets", detail: `CRC galti pakadta hai; TCP ACK aur Sliding Window khoe hue packets dubara bhejte hain.` },
      { heading: "3. IP vs MAC", detail: `IP address poore internet par rasta dhoondhta hai; MAC address local Wi-Fi/LAN mein ghar tak pahunchata hai.` },
    ],
    enExample: (t) => ({
      title: `Network Formula: ${t}`,
      body: `If subnet mask is /26, 26 bits are Network and 6 bits are Host. Total IPs = 2^6 = 64, and usable hosts = 64 − 2 = 62!`,
    }),
    hiExample: (t) => ({
      title: `Subnetting Trick: ${t}`,
      body: `Agar /26 diya hai, toh 32 − 26 = 6 host bits bache. Total IPs = 2^6 = 64, aur usable hosts = 64 − 2 = 62 (Network aur Broadcast hata kar)!`,
    }),
    enMistake: () => "Using CSMA/CD in Wi-Fi — Ethernet uses CSMA/CD, while Wi-Fi uses CSMA/CA (Collision Avoidance)!",
    hiMistake: () => "Wi-Fi mein CSMA/CD nahi chalta — Wi-Fi CSMA/CA (Collision Avoidance) use karta hai!",
    enShortcut: () => "OSI Top-to-Bottom: All People Seem To Need Data Processing (App, Pres, Sess, Trans, Net, Data, Phys).",
    hiShortcut: () => "Trick: 'Please Do Not Throw Sausage Pizza Away' = Physical, Data, Network, Transport, Session, Presentation, Application!",
    symbols: [
      { sym: "/n", meaningEn: "CIDR prefix (n network bits)", meaningHi: "Shuru ke n bits Network ke liye fix" },
      { sym: "η", meaningEn: "Channel Utilization / Efficiency", meaningHi: "Network link kitna efficiently use hua" },
    ],
  },
  "Artificial Intelligence": {
    visualKind: "ai_search",
    visualTitle: "Interactive A* Heuristic (f = g + h) Explorer",
    enStory: (t) =>
      `Suppose you're driving to an unfamiliar city. You know how far you've already driven (g) AND Google Maps estimates how far the destination still is (h). Combining both (f = g + h) helps A* find the shortest route without exploring every dead-end road!`,
    hiStory: (t) =>
      `Socho tum kisi nayi city drive kar rahe ho. Tumhe pata hai tum abhi tak kitna chal chuke ho (g), aur Google Maps batata hai manzil abhi aur kitni door hai (h). Dono ko jodkar (f = g + h) A* sabse chhota rasta fatafat dhoondh leta hai!`,
    enSteps: (t) => [
      { heading: "1. Search & Heuristics", detail: `Uninformed search explores blindly; Informed search (A*) uses heuristic h(n) to steer toward the goal.` },
      { heading: "2. Reasoning Under Uncertainty", detail: `Bayes' rule updates probabilities with new evidence; Fuzzy logic handles degrees of truth.` },
      { heading: "3. Learning from Data", detail: `Neural networks adjust weights via backpropagation; Genetic algorithms evolve solutions.` },
    ],
    hiSteps: (t) => [
      { heading: "1. Smart Search", detail: `BFS/DFS andhe hokar dhoondhte hain; A* heuristic h(n) ki madad se seedha goal ki taraf badhta hai.` },
      { heading: "2. Probability & Fuzzy Logic", detail: `Bayes' rule naya saboot milne par chance update karta hai; Fuzzy logic 0 se 1 ke beech degree deta hai.` },
      { heading: "3. Machine Learning", detail: `Neural Networks error kam karne ke liye weights update karte hain (Backprop).` },
    ],
    enExample: (t) => ({
      title: `A* Decision: ${t}`,
      body: `Path A has g=4, h=5 -> f=9. Path B has g=6, h=2 -> f=8. A* picks Path B because total estimated cost f=8 is smaller!`,
    }),
    hiExample: (t) => ({
      title: `A* Kaise Chunta Hai: ${t}`,
      body: `Rasta A: g=4 + h=5 = 9. Rasta B: g=6 + h=2 = 8. A* Rasta B chunega kyunki uska total score f = 8 kam hai!`,
    }),
    enMistake: () => "Thinking a single-layer Perceptron can solve XOR — XOR is NOT linearly separable and needs >= 2 layers!",
    hiMistake: () => "Single-layer Perceptron XOR solve NAHI kar sakta — uske liye kam se kam 2 layers (MLP) chahiye!",
    enShortcut: () => "A* is Optimal when h(n) is Admissible (never overestimates true cost).",
    hiShortcut: () => "Yaad rakho: Agar h(n) kabhi jhoota bada estimate na de (Admissible), toh A* hamesha best rasta dega!",
    symbols: [
      { sym: "f(n)", meaningEn: "g(n) + h(n): total estimated path cost", meaningHi: "Ab tak ka kharch + aage ka andaaza" },
      { sym: "P(A|B)", meaningEn: "Probability of A given B happened", meaningHi: "Agar B ho chuka hai toh A ka chance" },
    ],
  },
};

export function getTopicDoc(unitTitle: string, topicTitle: string): TopicDocContent {
  let profile = UNIT_PROFILES["Discrete"];
  for (const key of Object.keys(UNIT_PROFILES)) {
    if (unitTitle.toLowerCase().includes(key.toLowerCase())) {
      profile = UNIT_PROFILES[key];
      break;
    }
  }

  const enEx = profile.enExample(topicTitle);
  const hiEx = profile.hiExample(topicTitle);

  return {
    visualKind: profile.visualKind,
    visualTitle: profile.visualTitle,
    en: {
      tldr: `${topicTitle} made simple — understand the intuition first, then see how it works visually.`,
      story: profile.enStory(topicTitle),
      steps: profile.enSteps(topicTitle),
      exampleTitle: enEx.title,
      exampleBody: enEx.body,
      mistakeToAvoid: profile.enMistake(topicTitle),
      shortcut: profile.enShortcut(topicTitle),
    },
    hinglish: {
      tldr: `${topicTitle} bilkul aasan bhasha mein — pehle logic samjho, phir visual dekho!`,
      story: profile.hiStory(topicTitle),
      steps: profile.hiSteps(topicTitle),
      exampleTitle: hiEx.title,
      exampleBody: hiEx.body,
      mistakeToAvoid: profile.hiMistake(topicTitle),
      shortcut: profile.hiShortcut(topicTitle),
    },
    keySymbols: profile.symbols,
  };
}
