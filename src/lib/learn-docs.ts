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

interface BilingualUnitContent {
  en: {
    storyIntro: (topic: string) => string;
    simpleDef: (topic: string, summary: string, formal: string) => string;
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
  };
  hi: {
    storyIntro: (topic: string) => string;
    simpleDef: (topic: string, summary: string, formal: string) => string;
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
  };
}

const BILINGUAL_UNITS: Record<string, BilingualUnitContent> = {
  Discrete: {
    en: {
      storyIntro: (t) =>
        `Forget heavy math for two minutes. Suppose a friend promises you: "If it rains today (P), I will bring an umbrella (Q)." When can you catch your friend lying? ONLY if it actually rains (True) AND they show up with NO umbrella (False)! If it doesn't rain, they didn't break any promise whether they brought an umbrella or not. That exact everyday common sense is the heart of ${t} — turning human promises, groups, and connections into crystal-clear rules that a computer can never misread.`,
      simpleDef: (t, summary, formal) =>
        `In plain words: ${summary} (Official exam line for ${t}: ${formal})`,
      principles: [
        "Rule 1 — No guesswork: Every statement is either 100% True or 100% False, never 'maybe'.",
        "Rule 2 — Don't double-count: When two groups overlap (like students who drink both tea and coffee), subtract the overlap once.",
        "Rule 3 — Contrapositive is your best friend: 'If P then Q' always means the exact same thing as 'If NOT Q then NOT P'.",
      ],
      terminology: [
        { term: "P → Q (Implies)", meaning: "A promise: 'If P happens, Q must happen.' Only false when P is True and Q is False." },
        { term: "¬ (Negation / NOT)", meaning: "Simply flips True to False and False to True." },
        { term: "A ∩ B (Intersection)", meaning: "Only the items that are present inside BOTH group A and group B." },
      ],
      mechanism: [
        "First, give simple letter names (like P, Q, or sets A, B) to the things in the question.",
        "Second, apply the basic truth rule or counting rule step by step without skipping any case.",
        "Third, test one extreme case (like an empty set ∅ or P=True, Q=False) to be 100% sure.",
      ],
      derivation: {
        formula: "|A ∪ B| = |A| + |B| − |A ∩ B|",
        variables: [
          { sym: "|A|", desc: "Total people/items in the first group A" },
          { sym: "|B|", desc: "Total people/items in the second group B" },
          { sym: "|A ∩ B|", desc: "People/items counted in BOTH A and B" },
        ],
        steps: [
          "Suppose 30 students like Cricket (A) and 20 like Football (B).",
          "If 10 students like BOTH games, adding 30 + 20 = 50 counts those 10 students twice!",
          "So we subtract the 10 common students once: 30 + 20 − 10 = 40 actual students.",
        ],
        numericalExample: "45 students study DBMS, 35 study OS, and 15 study both -> Total = 45 + 35 − 15 = 65 students.",
        calculationMistake: "Students often forget to subtract the overlap, or for 3 sets they forget to ADD back the triple overlap |A ∩ B ∩ C|.",
      },
      comparison: {
        heading: "Euler Path vs Hamiltonian Path",
        rows: [
          { feature: "What you must visit once", primary: "Every ROAD (Edge) once", related: "Every CITY (Vertex) once" },
          { feature: "How to check quickly", primary: "Count odd roads: 0 or 2 odd vertices", related: "No easy shortcut (hard problem!)" },
          { feature: "Memory trick", primary: "E for Edge = Euler", related: "H/V for Vertex = Hamiltonian" },
        ],
      },
      advantages: [
        "Makes confusing word problems simple using small truth tables or circles.",
        "Forms the direct foundation for digital circuits, SQL queries, and algorithms.",
      ],
      limitations: [
        "Truth tables double in size for every extra variable (n variables = 2^n rows).",
      ],
      misconceptions: [
        { myth: "'If I am in Delhi, I am in India' means 'If I am in India, I am in Delhi.'", reality: "False! Reversing the arrow (Q → P) is NOT equal to P → Q." },
        { myth: "Opposite of 'All students passed' is 'All students failed.'", reality: "Wrong! To prove 'All passed' false, you only need ONE student who failed (∃x ¬P(x))." },
      ],
      examPoints: [
        "Boolean functions with n variables = 2^(2^n) (for n=2 it is 16, for n=3 it is 256).",
        "Sum of all degrees in any graph = 2 × number of edges (so odd-degree vertices are always even in count).",
        "Connected planar graph: Vertices − Edges + Faces = 2.",
      ],
      relatedTopics: ["Propositional Logic", "Sets & Relations", "Graph Theory"],
    },
    hi: {
      storyIntro: (t) =>
        `Do minute ke liye heavy maths bhool jao! Maan lo tumhare dost ne vaada kiya: "Agar aaj baarish hui (P), toh main chhata launga (Q)." Tum apne dost ko jhootha kab pakad sakte ho? SIRF tab jab sach mein baarish ho (True) AUR woh bina chhate ke aa jaaye (False)! Agar baarish hi nahi hui, toh usne vaada nahi toda — chahe woh chhata laaye ya na laaye. Bas yahi roz-marra ka common sense ${t} ki jaan hai!`,
      simpleDef: (t, summary, formal) =>
        `Bilkul aasan matlab: ${summary} (${t} ki exam definition: ${formal})`,
      principles: [
        "Niyam 1 — Koi 'shayad' nahi: Har baat ya toh 100% Sach (True) hoti hai ya 100% Jhooth (False).",
        "Niyam 2 — Do baar mat gino: Agar 10 log Chai aur Coffee dono peete hain, toh unhe ek baar ghatana (minus karna) zaroori hai.",
        "Niyam 3 — Contrapositive hamesha barabar hota hai: 'Agar P toh Q' ka matlab wahi hai jo 'Agar Q nahi toh P bhi nahi' ka hai.",
      ],
      terminology: [
        { term: "P → Q (Implies)", meaning: "Ek vaada: 'Agar P hua, toh Q hoga.' Yeh sirf tab False hota hai jab P True aur Q False ho." },
        { term: "¬ (NOT / Ulta)", meaning: "True ko False bana deta hai aur False ko True." },
        { term: "A ∩ B (Common hissa)", meaning: "Sirf woh cheezein jo Group A aur Group B DONO mein maujood hain." },
      ],
      mechanism: [
        "Step 1: Question ki har baat ko chhote naam do (jaise P, Q, ya set A, B).",
        "Step 2: Dheere-dheere basic rule lagao — koi bhi case skip mat karo.",
        "Step 3: Ek extreme case (jaise khaali set ∅ ya P=T, Q=F) daal kar apna answer check karo.",
      ],
      derivation: {
        formula: "|A ∪ B| = |A| + |B| − |A ∩ B|",
        variables: [
          { sym: "|A|", desc: "Pehle group A mein kitne log hain" },
          { sym: "|B|", desc: "Doosre group B mein kitne log hain" },
          { sym: "|A ∩ B|", desc: "Kitne log DONO groups (A aur B) mein common hain" },
        ],
        steps: [
          "Maan lo 30 bacche Cricket pasand karte hain aur 20 Football.",
          "Agar 10 bacche DONO pasand karte hain, toh 30 + 20 = 50 mein woh 10 bacche do baar gin liye gaye!",
          "Isliye un 10 common bacchon ko ek baar minus kar do: 30 + 20 − 10 = 40 asli bacche.",
        ],
        numericalExample: "45 students DBMS padhte hain, 35 OS padhte hain, aur 15 dono -> Total = 45 + 35 − 15 = 65 students.",
        calculationMistake: "Bacche aksar common hissa minus karna bhool jaate hain, ya 3 sets wale question mein teeno ka common |A ∩ B ∩ C| wapas jodne bhool jaate hain.",
      },
      comparison: {
        heading: "Euler Path vs Hamiltonian Path",
        rows: [
          { feature: "Kya ek baar ghoomna hai", primary: "Har SADAK (Edge) ek baar", related: "Har SHEHAR (Vertex) ek baar" },
          { feature: "Pehchanne ka tareeka", primary: "Odd degree nodes gino (0 ya 2 hone chahiye)", related: "Koi aasan formula nahi (Hard problem)" },
          { feature: "Yaad rakhne ki trick", primary: "E se Edge = Euler", related: "H/V se Vertex = Hamiltonian" },
        ],
      },
      advantages: [
        "Mushkil word problems ko golon (Venn diagram) aur chhoti tables se chutki mein solve karta hai.",
        "Digital logic gates, SQL queries aur algorithms ki asli neev hai.",
      ],
      limitations: [
        "Har naya variable aane par truth table ki rows double ho jaati hain (2^n).",
      ],
      misconceptions: [
        { myth: "'Agar main Delhi mein hoon toh India mein hoon' ka matlab 'Agar main India mein hoon toh Delhi mein hoon' hota hai.", reality: "Galat! Teer ulta karne (Q → P) se baat badal jaati hai." },
        { myth: "'Sabhi bacche pass ho gaye' ka ulta 'Sabhi bacche fail ho gaye' hota hai.", reality: "Nahi! Is baat ko jhootha saabit karne ke liye sirf EK bacche ka fail hona kaafi hai (∃x ¬P(x))." },
      ],
      examPoints: [
        "n variables ke saath total Boolean functions = 2^(2^n) (n=2 -> 16, n=3 -> 256).",
        "Handshaking Lemma: Sabhi degrees ka sum = 2 × edges (odd degree wale nodes hamesha even ginti mein hote hain).",
        "Connected planar graph: v − e + f = 2.",
      ],
      relatedTopics: ["Propositional Logic", "Sets & Relations", "Graph Theory"],
    },
  },
  "Computer System": {
    en: {
      storyIntro: (t) =>
        `Picture a busy car wash with 5 stations: Water Spray, Soap, Scrub, Rinse, and Dry. If the owner waits for Car #1 to finish ALL 5 stations before letting Car #2 enter, only 1 car gets washed every 5 minutes! Instead, as soon as Car #1 moves to Soap, Car #2 enters Water Spray. Soon all 5 stations are working at once, and a clean car rolls out every single minute! That smart teamwork is how ${t} makes your CPU blazingly fast.`,
      simpleDef: (t, summary, formal) =>
        `In plain words: ${summary} (Official exam line for ${t}: ${formal})`,
      principles: [
        "Everything inside hardware is just switches turning ON (1) and OFF (0).",
        "Keep frequently used data close to the CPU (Registers & Cache) so you don't walk all the way to slow RAM.",
        "Overlap work in stages (Pipelining) so the processor finishes more instructions per second.",
      ],
      terminology: [
        { term: "Clock Cycle", meaning: "One heartbeat of the CPU — the smallest tick of time in hardware." },
        { term: "Cache Hit (h)", meaning: "Happiness! The CPU found the data right inside fast Cache without going to slow RAM." },
        { term: "Hazard", meaning: "A traffic jam inside the pipeline when one instruction needs a result not ready yet." },
      ],
      mechanism: [
        "Fetch: CPU grabs the next instruction from memory using the Program Counter (PC).",
        "Decode: Control Unit reads the instruction to see what operation (ADD, LOAD, JUMP) is needed.",
        "Execute & Save: The ALU does the math and saves the answer back into a Register or Memory.",
      ],
      derivation: {
        formula: "Speedup S = (k · n) / (k + n − 1)",
        variables: [
          { sym: "k", desc: "Number of pipeline stations (stages)" },
          { sym: "n", desc: "Total number of instructions to run" },
          { sym: "S", desc: "How many times faster the pipeline is compared to doing one-by-one" },
        ],
        steps: [
          "Without a pipeline, n instructions × k stages each = k · n total cycles.",
          "With a pipeline, the first instruction takes k cycles to come out, and every remaining (n − 1) instruction comes out 1 cycle later.",
          "So total pipeline time = k + (n − 1). Divide old time by new time to get Speedup!",
        ],
        numericalExample: "With k = 5 stages and n = 100 instructions: Old = 500 cycles, Pipeline = 5 + 99 = 104 cycles -> 500/104 ≈ 4.81× faster!",
        calculationMistake: "When stages have different speeds (e.g. 2ns, 5ns, 3ns), the pipeline clock MUST wait for the slowest stage (5ns) + latch delay!",
      },
      comparison: {
        heading: "Direct Mapped Cache vs Set-Associative Cache",
        rows: [
          { feature: "Parking Rule", primary: "Only 1 fixed parking spot per block", related: "Any of k spots in your assigned row" },
          { feature: "Chance of collision", primary: "High (two blocks fight for 1 spot)", related: "Much lower" },
          { feature: "Hardware cost", primary: "Cheapest & simplest", related: "Needs k comparators" },
        ],
      },
      advantages: [
        "Multiplies CPU work done per second without making individual circuits wildly expensive.",
        "Cache + DMA prevent the fast CPU from sitting idle waiting for slow memory or disks.",
      ],
      limitations: [
        "Conditional jumps (if/else) can flush the pipeline if the CPU guesses the wrong branch.",
      ],
      misconceptions: [
        { myth: "Pipelining makes a single instruction run faster.", reality: "No! One instruction still takes all k stages (actually slightly longer due to latches), but total instructions finished per second jumps up by ~k×." },
      ],
      examPoints: [
        "NAND and NOR are the two Universal Gates (any circuit can be built using only NAND or only NOR).",
        "2's complement of n bits stores −2^(n−1) to +2^(n−1) − 1 with only one zero.",
        "IEEE 754 Single Precision (32-bit): 1 Sign + 8 Exponent (Bias 127) + 23 Mantissa.",
      ],
      relatedTopics: ["Logic Gates & K-Maps", "CPU Pipelining", "Cache & Virtual Memory"],
    },
    hi: {
      storyIntro: (t) =>
        `Ek car-wash shop socho jisme 5 stations hain: Paani, Sabun, Safai, Dhulai, aur Sukhana. Agar malik ek gaadi ke poore 5 stations khatam hone ka wait karega tabhi doosri gaadi andar lega, toh 5 minute mein sirf 1 gaadi niklegi! Par agar jaise hi pehli gaadi Sabun par jaaye aur doosri Paani par aa jaaye, toh thodi der mein har 1 minute mein ek chamakti gaadi bahar aayegi! Bas yahi smart teamwork ${t} mein CPU ko super fast banata hai.`,
      simpleDef: (t, summary, formal) =>
        `Aasan shabdon mein: ${summary} (${t} ki exam definition: ${formal})`,
      principles: [
        "Hardware ke andar sab kuch sirf ON (1) aur OFF (0) switches par chalta hai.",
        "Jo data baar-baar chahiye use CPU ke paas (Registers/Cache) mein rakho taaki slow RAM tak na daudna pade.",
        "Kaam ko stages mein baant kar ek saath chalao (Pipelining) taaki har clock tick par ek kaam poora ho.",
      ],
      terminology: [
        { term: "Clock Cycle", meaning: "CPU ke dil ki ek dhadkan — hardware ka sabse chhota time step." },
        { term: "Cache Hit (h)", meaning: "Khushkhabri! CPU ko data turant paas wale Cache mein hi mil gaya." },
        { term: "Hazard", meaning: "Pipeline mein traffic jam jab agle instruction ko pichhle ka result abhi mila hi nahi." },
      ],
      mechanism: [
        "Fetch: CPU memory se agla instruction uthata hai (Program Counter ki madad se).",
        "Decode: Control Unit padhta hai ki karna kya hai (ADD, SUB, LOAD).",
        "Execute & Save: ALU calculation karta hai aur answer Register ya RAM mein save kar deta hai.",
      ],
      derivation: {
        formula: "Speedup S = (k · n) / (k + n − 1)",
        variables: [
          { sym: "k", desc: "Pipeline mein kitne stations (stages) hain" },
          { sym: "n", desc: "Total kitne instructions chalane hain" },
          { sym: "S", desc: "Pehle ke muqable kitni guna speed badh gayi" },
        ],
        steps: [
          "Bina pipeline ke, n instructions × k cycles = k · n total time lagta hai.",
          "Pipeline mein pehle instruction ko k cycles lagte hain, uske baad baaki (n − 1) har ek cycle mein nikalte hain.",
          "Toh naya time = k + (n − 1). Purane time ko naye time se divide karo — Speedup mil gaya!",
        ],
        numericalExample: "Agar k = 5 stages aur n = 100 instructions hain: Bina pipeline 500 cycles, Pipeline mein 5 + 99 = 104 cycles (~4.81× fast)!",
        calculationMistake: "Agar alag-alag stages ki speed alag ho (jaise 2ns, 5ns, 3ns), toh poori pipeline ko sabse SLOW stage (5ns) + latch delay ke hisab se chalna padega!",
      },
      comparison: {
        heading: "Direct Mapped Cache vs Set-Associative Cache",
        rows: [
          { feature: "Parking Rule", primary: "Har block ki sirf 1 fix jagah", related: "Apni row mein k mein se koi bhi jagah" },
          { feature: "Takkar (Miss) ka dar", primary: "Zyada (do log ek hi seat par ladte hain)", related: "Bahut kam" },
          { feature: "Kharcha", primary: "Sabse sasta aur simple", related: "Thoda zyada hardware lagta hai" },
        ],
      },
      advantages: [
        "Bina mehenga CPU lagaye kaam karne ki raftaar kai guna badha deta hai.",
        "Cache aur DMA CPU ko slow memory/disk ke liye khaali baithne se bachate hain.",
      ],
      limitations: [
        "Agar code mein 'if/else' jump galat guess ho jaaye, toh pipeline khali karni padti hai.",
      ],
      misconceptions: [
        { myth: "Pipelining se ek akela instruction jaldi khatam hota hai.", reality: "Nahi! Ek instruction ko toh poori k stages lagengi hi, par har second mein nikalne wale instructions k guna badh jaate hain." },
      ],
      examPoints: [
        "NAND aur NOR sirf yeh do Universal Gates hain (inse koi bhi circuit ban sakta hai).",
        "n-bit 2's complement ki range: −2^(n−1) se +2^(n−1) − 1 (sirf ek zero).",
        "IEEE 754 (32-bit): 1 Sign + 8 Exponent (Bias 127) + 23 Mantissa.",
      ],
      relatedTopics: ["Logic Gates & K-Maps", "CPU Pipelining", "Cache & Virtual Memory"],
    },
  },
};

function getBilingualFallback(unitTitle: string, topicTitle: string, summary: string, formal: string): BilingualUnitContent {
  return {
    en: {
      storyIntro: (t) =>
        `Don't worry if ${t} sounds scary at first — every big Computer Science idea is just a neat solution to an everyday problem. Think about organizing 10 lakh books, managing 10 people waiting in a line, or sending a parcel safely across cities: ${t} gives us a clean, step-by-step recipe so the computer never gets confused, never wastes memory, and always gives the right answer.`,
      simpleDef: (_t, s, f) => `In simple words: ${s} (Exam textbook wording: ${f})`,
      principles: [
        `Step-by-step clarity: ${topicTitle} follows a strict rule (invariant) that never breaks during execution.`,
        "Smart trade-offs: Every design balances Speed (Time) against Memory (Space).",
        "Check the edges: Always test what happens on empty input (0 items), 1 item, or huge input.",
      ],
      terminology: [
        { term: "Invariant", meaning: "A promise that stays true before and after every step." },
        { term: "Big-O / Time Bound", meaning: "A simple measure of how fast work grows as input size N gets huge." },
        { term: "Edge Case", meaning: "A tricky corner input (like 0, NULL, or negative numbers) that breaks careless code." },
      ],
      mechanism: [
        "Look at the input and identify what structure or rule fits best.",
        "Walk through one small example by hand (3 or 4 items) before writing formulas.",
        "Check the corner cases and confirm your final time/space complexity.",
      ],
      derivation: {
        formula: "T(n) = a · T(n / b) + f(n)   (Divide & Conquer Growth)",
        variables: [
          { sym: "n", desc: "How many items you have in your input" },
          { sym: "a", desc: "How many smaller pieces you split the problem into" },
          { sym: "n / b", desc: "Size of each smaller piece" },
          { sym: "f(n)", desc: "Extra work done to split and merge the pieces" },
        ],
        steps: [
          "Every time you cut a problem in half (b = 2), the tree depth is only log₂(n) — for 1,000,000 items, that's just 20 steps!",
          "Compare the work at the bottom leaves n^(log_b a) against the work at the top f(n).",
          "Whichever side is bigger wins; if both tie, multiply by log n.",
        ],
        numericalExample: "Merge Sort splits into 2 halves (a=2, b=2) and merges in n steps (f(n)=n). Leaves = n¹ = n (tie!) -> Θ(n log n).",
        calculationMistake: "Forgetting that log₂(1024) = 10, or forgetting the extra log n factor when leaf work and root work tie.",
      },
      comparison: {
        heading: "Careful Design vs Brute Force",
        rows: [
          { feature: "How it thinks", primary: "Uses structure/invariants to skip wasted work", related: "Checks every single possibility blindly" },
          { feature: "Speed on 10^5 items", primary: "Finishes in milliseconds", related: "Can freeze or time out (O(n²))" },
          { feature: "Exam value", primary: "Preferred answer in UGC NET & interviews", related: "Only a starting baseline" },
        ],
      },
      advantages: [
        `Makes ${topicTitle} predictable, testable, and fast even when data grows huge.`,
        "Gives you a repeatable mental checklist for solving exam numericals.",
      ],
      limitations: [
        "Needs careful handling of corner cases (like empty input or duplicates).",
      ],
      misconceptions: [
        { myth: "Memorizing definitions without tracing an example is enough.", reality: "Always trace 1 small 3-element example by hand — exam questions test the trace, not just the name!" },
      ],
      examPoints: [
        `In ${unitTitle}, always check boundary values (n = 0, n = 1, off-by-one) before locking your option.`,
        "Read words like 'always', 'necessary', and 'sufficient' very carefully in Assertion-Reason questions.",
      ],
      relatedTopics: ["Core Fundamentals", "Complexity & Bounds", "UGC NET PYQ Patterns"],
    },
    hi: {
      storyIntro: (t) =>
        `Bilkul tension mat lo agar ${t} sunne mein bhaari lagta hai! Computer Science ka har bada topic kisi roz-marra ki problem ka ek smart aur aasan hal hota hai. Chahe 10 lakh kitaabein dhoondhni hon, dukaan ki line manage karni ho, ya ek shehar se doosre shehar parcel bhejna ho — ${t} humein ek pakka step-by-step tareeka deta hai taaki computer kabhi confuse na ho aur hamesha sahi jawab de.`,
      simpleDef: (_t, s, f) => `Bilkul aasan matlab: ${s} (Exam textbook line: ${f})`,
      principles: [
        `Pakka Niyam: ${topicTitle} ek fix rule par chalta hai jo kisi bhi step par toot-ta nahi hai.`,
        "Speed aur Memory ka balance: Har achha design Time bachane aur Space bachane ke beech sahi balance banata hai.",
        "Corner cases zaroor check karo: Khaali input (0), 1 item, ya bahut bada input daal kar dekhna mat bhoolna.",
      ],
      terminology: [
        { term: "Invariant (Pakka Niyam)", meaning: "Aisi condition jo har step ke pehle aur baad hamesha sach rehti hai." },
        { term: "Big-O (Speed ka naap)", meaning: "Batata hai ki jab data bahut bada (N) ho jaaye, toh time kitni tezi se badhega." },
        { term: "Edge Case", meaning: "Aisa tedha input (jaise 0, NULL, ya negative number) jahan jaldbazi mein galti ho jaati hai." },
      ],
      mechanism: [
        "Step 1: Pehle dekho question mein kya input diya hai aur kaunsa rule fit baithega.",
        "Step 2: Haath se ek chhota 3-4 items ka example chala kar dekho — sab clear ho jaayega.",
        "Step 3: Corner cases aur Time/Space complexity check karke answer lock karo.",
      ],
      derivation: {
        formula: "T(n) = a · T(n / b) + f(n)   (Divide & Conquer Formula)",
        variables: [
          { sym: "n", desc: "Input mein total kitne items hain" },
          { sym: "a", desc: "Problem ko kitne chhote hisson mein toda gaya" },
          { sym: "n / b", desc: "Har chhote hisse ka size" },
          { sym: "f(n)", desc: "Todne aur wapas jodne mein laga extra kaam" },
        ],
        steps: [
          "Har baar problem aadhi (b = 2) karne par sirf log₂(n) steps lagte hain — 10 lakh items ke liye sirf 20 steps!",
          "Neeche ke leaves ka kaam n^(log_b a) aur upar ka kaam f(n) compare karo.",
          "Jo bada woh jeeta; agar dono barabar hon toh log n se multiply kar do!",
        ],
        numericalExample: "Merge Sort 2 hisson mein todta hai (a=2, b=2) aur n steps mein jodta hai (f(n)=n). Dono barabar -> Θ(n log n).",
        calculationMistake: "log₂(1024) = 10 yaad na rakhna, ya barabar hone par extra log n lagana bhool jaana.",
      },
      comparison: {
        heading: "Smart Tareeka vs Andha Tareeka (Brute Force)",
        rows: [
          { feature: "Sochne ka dhang", primary: "Structure use karke faltu kaam skip karta hai", related: "Har ek option bina soche check karta hai" },
          { feature: "10^5 items par speed", primary: "Milliseconds mein khatam", related: "Hang ya Time Limit Exceeded (O(n²))" },
          { feature: "Exam mein value", primary: "UGC NET aur interviews mein yahi chahiye", related: "Sirf shuruwat samajhne ke liye" },
        ],
      },
      advantages: [
        `${topicTitle} ko bilkul predictable, fast aur bade data ke liye ready banata hai.`,
        "Exam ke numericals solve karne ke liye ek pakki checklist deta hai.",
      ],
      limitations: [
        "Corner cases (khaali input ya duplicate values) dhyan se handle karne padte hain.",
      ],
      misconceptions: [
        { myth: "Sirf definition ratne se kaam chal jaayega.", reality: "Nahi dost! Hamesha 3 items ka ek chhota example haath se trace karo — exam mein trace hi poochte hain!" },
      ],
      examPoints: [
        `${unitTitle} mein option lock karne se pehle n = 0, n = 1 aur off-by-one zaroor check karo.`,
        "Assertion-Reason mein 'always', 'only if' aur 'never' jaise shabdon par khaas dhyan do.",
      ],
      relatedTopics: ["Core Fundamentals", "Complexity & Bounds", "UGC NET PYQ Patterns"],
    },
  };
}

export function getTextbookChapter(
  unitTitle: string,
  topicTitle: string,
  lang: LearnLang,
  revisionSummary?: string,
  formalDefinition?: string
): TextbookChapter {
  const cleanSummary =
    (revisionSummary || "").trim() ||
    `${topicTitle} gives a clear, reliable method to organize and solve problems in ${unitTitle}.`;
  const cleanDef =
    (formalDefinition || "").trim() ||
    `${topicTitle} is defined by its core rules, step-by-step mechanism, and performance bounds in ${unitTitle}.`;

  let unitContent: BilingualUnitContent | null = null;
  for (const key of Object.keys(BILINGUAL_UNITS)) {
    if (unitTitle.toLowerCase().includes(key.toLowerCase())) {
      unitContent = BILINGUAL_UNITS[key];
      break;
    }
  }
  if (!unitContent) {
    unitContent = getBilingualFallback(unitTitle, topicTitle, cleanSummary, cleanDef);
  }

  const c = lang === "hinglish" ? unitContent.hi : unitContent.en;

  if (lang === "hinglish") {
    return {
      introduction: c.storyIntro(topicTitle),
      definition: c.simpleDef(topicTitle, cleanSummary, cleanDef),
      principles: c.principles,
      terminology: c.terminology,
      workingMechanism: c.mechanism,
      derivation: c.derivation,
      examples: [
        {
          title: `Aasan Example 1 — ${topicTitle} Haath Se Trace Karo`,
          problem: `Chhote input par ${topicTitle} ka main rule kaise kaam karta hai?`,
          steps: [
            `Step 1 (Asaan Idea): ${cleanSummary}`,
            `Step 2 (Pakka Rule): ${cleanDef}`,
            "Step 3 (Check): Boundary value (0 ya 1 item) par check karo ki koi galti toh nahi.",
          ],
          answer: `Bilkul clear: ${cleanSummary}`,
        },
        {
          title: `Aasan Example 2 — Exam Numerical Trick`,
          problem: `UGC NET ke numerical mein ${topicTitle} ka formula kaise lagayein?`,
          steps: [
            `Step 1: Formula likho: ${c.derivation.formula}`,
            "Step 2: Question mein diye numbers formula mein dalo.",
            "Step 3: Calculation check karo ki koi off-by-one (−1) galti na ho.",
          ],
          answer: c.derivation.numericalExample,
        },
      ],
      properties: [
        `Asaan Niyam: ${cleanSummary}`,
        `Exam Definition: ${cleanDef}`,
        "Hamesha same input par same pakka result deta hai.",
      ],
      comparison: c.comparison,
      advantages: c.advantages,
      limitations: c.limitations,
      misconceptions: c.misconceptions,
      examPoints: c.examPoints,
      summary: `Ek Line Mein Yaad Rakho: ${cleanSummary} Exam ke liye formula aur corner cases zaroor revise karein.`,
      practiceQuestions: [
        {
          question: `${topicTitle} ke baare mein kaunsi baat bilkul sahi hai?`,
          options: [
            cleanSummary,
            "Isme edge cases check karne ki koi zaroorat nahi hoti",
            "Yeh har baar alag random answer deta hai",
            "Iska complexity ya memory se koi lena-dena nahi hai",
          ],
          correctIndex: 0,
          explanation: `Sahi jawab Option A hai! Kyunki ${cleanSummary}`,
        },
      ],
      flashcards: [
        { front: `${topicTitle} — Simple Matlab`, back: cleanSummary },
        { front: `${topicTitle} — Yaad Rakhne Wala Formula`, back: c.derivation.formula },
        { front: `${topicTitle} — Exam Trap Se Bacho`, back: c.misconceptions[0]?.reality || cleanSummary },
      ],
      relatedTopics: c.relatedTopics,
    };
  }

  return {
    introduction: c.storyIntro(topicTitle),
    definition: c.simpleDef(topicTitle, cleanSummary, cleanDef),
    principles: c.principles,
    terminology: c.terminology,
    workingMechanism: c.mechanism,
    derivation: c.derivation,
    examples: [
      {
        title: `Easy Example 1 — Tracing ${topicTitle} by Hand`,
        problem: `Walk through how ${topicTitle} works on a tiny, everyday example.`,
        steps: [
          `Step 1 (Plain Idea): ${cleanSummary}`,
          `Step 2 (Exact Rule): ${cleanDef}`,
          "Step 3 (Sanity Check): Test what happens at the edge (0 items or 1 item).",
        ],
        answer: cleanSummary,
      },
      {
        title: `Easy Example 2 — Exam Numerical Walkthrough`,
        problem: `Apply the formula for ${topicTitle} cleanly without calculation slips.`,
        steps: [
          `Write the formula first: ${c.derivation.formula}`,
          "Plug in the numbers from the question one variable at a time.",
          "Double-check any −1 or base-2 logarithm before picking your answer.",
        ],
        answer: c.derivation.numericalExample,
      },
    ],
    properties: [
      `Core Idea: ${cleanSummary}`,
      `Exam Anchor: ${cleanDef}`,
      "Predictable: Same input always produces the exact same output.",
    ],
    comparison: c.comparison,
    advantages: c.advantages,
    limitations: c.limitations,
    misconceptions: c.misconceptions,
    examPoints: c.examPoints,
    summary: `One-Line Takeaway: ${cleanSummary} Remember the formula and always check the edge case!`,
    practiceQuestions: [
      {
        question: `Which statement best describes ${topicTitle} in simple terms?`,
        options: [
          cleanSummary,
          "You never need to check boundary or empty inputs",
          "It gives a different random answer every time you run it",
          "It has no effect on time or memory usage",
        ],
        correctIndex: 0,
        explanation: `Option A is right! ${cleanSummary}`,
      },
    ],
    flashcards: [
      { front: `${topicTitle} — Simple Meaning`, back: cleanSummary },
      { front: `${topicTitle} — Key Formula`, back: c.derivation.formula },
      { front: `${topicTitle} — Watch Out!`, back: c.misconceptions[0]?.reality || cleanSummary },
    ],
    relatedTopics: c.relatedTopics,
  };
}
