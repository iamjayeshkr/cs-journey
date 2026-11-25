import { OFFICIAL_CHAPTERS } from "./official-syllabus-chapters";
import { RICH_CONCEPTS_PART1 } from "./unit-concepts-seed";
import { RICH_CONCEPTS_PART2 } from "./unit-concepts-more";

function pickSimulatorForChapter(kingdomId: string, slug: string): string {
  if (kingdomId === "k1-discrete") return "logic_gates";
  if (kingdomId === "k2-csa") return "cpu_scheduling";
  if (kingdomId === "k3-prog") return "linked_list";
  if (kingdomId === "k4-dbms") return "sql_playground";
  if (kingdomId === "k5-os") return slug.includes("mem") ? "page_replacement" : "cpu_scheduling";
  if (kingdomId === "k7-dsa") {
    if (slug.includes("sort") || slug.includes("design")) return "sorting_arena";
    if (slug.includes("stack") || slug.includes("queue")) return "stack_queue";
    return "linked_list";
  }
  if (kingdomId === "k8-toc") return "automata_dfa";
  if (kingdomId === "k10-ai") return "graph_search";
  return "linked_list";
}

export function buildMissingChapterConcepts() {
  const existingChapterIds = new Set([...RICH_CONCEPTS_PART1, ...RICH_CONCEPTS_PART2].map((c) => c.chapter_id));
  const generated = [];

  for (const ch of OFFICIAL_CHAPTERS) {
    if (existingChapterIds.has(ch.id)) continue;
    const subtopics = ch.topics.flatMap((t) => t.subtopics);
    const firstSub = subtopics[0] || ch.title;
    const secondSub = subtopics[1] || ch.title;
    const sim = pickSimulatorForChapter(ch.kingdom_id, ch.slug);
    const id = `c-auto-${ch.id}`;

    generated.push({
      id,
      chapter_id: ch.id,
      topic_id: ch.topics[0]?.id || null,
      order_index: 1,
      slug: ch.slug,
      title: ch.title,
      difficulty: "intermediate" as const,
      simulator_type: sim,
      estimated_minutes: ch.estimated_minutes,
      xp_reward: 75,
      learning_objectives: [
        `Understand ${firstSub} from first principles with everyday intuition.`,
        `Master the formal rules and properties of ${ch.title}.`,
        `Solve UGC NET & corporate interview twist problems on ${secondSub}.`,
      ],
      why_it_matters: `${ch.title} is a core pillar of the official UGC NET CS syllabus (${ch.kingdom_id.toUpperCase()}) and frequently appears in both conceptual and numerical exam questions.`,
      discover_story:
        `Imagine sitting at a quiet neighborhood chai stall while your favorite CS teacher opens a fresh notebook on **${ch.title}**.\n\nInstead of throwing heavy formulas at you right away, they sketch a simple everyday picture of **${firstSub}**: think of how real-world systems organize, verify, and optimize work without wasting a single step.\n\nOnce you see *why* engineers invented ${ch.title} (${ch.summary}), every formal rule in ${secondSub} will click naturally!`,
      level_1_beginner: `Think of ${ch.title} in simple everyday terms: before computers existed, people still needed reliable ways to handle ${firstSub.toLowerCase()}. Start by imagining a step-by-step checklist where every rule exists to prevent confusion or wasted effort.`,
      level_2_foundation: `Formally, ${ch.title} covers: ${ch.summary}. Key building blocks include ${subtopics.slice(0, 3).join(", ")}.`,
      level_3_intermediate: `At the problem-solving level, pay close attention to how ${firstSub} interacts with ${secondSub}, especially boundary cases, time/space trade-offs, and step-by-step execution traces.`,
      level_4_jrf: `For UGC NET JRF & advanced mastery, focus on edge-case proofs, equivalence conditions, and multi-concept combinations across ${subtopics.join("; ")}.`,
      examples: [
        {
          title: `Step-by-Step Walkthrough: ${firstSub}`,
          problem: `Trace the core mechanism of ${firstSub} on a small concrete input.`,
          walkthrough: `1. Identify the initial state and constraints of ${firstSub}.\n2. Apply the primary rule of ${ch.title} step by step.\n3. Verify the boundary condition (${secondSub}) before concluding.`,
        },
        {
          title: `Exam & Interview Twist: ${secondSub}`,
          problem: `What happens when input size grows or a tie/conflict occurs in ${secondSub}?`,
          walkthrough: `1. Check the invariant that must always hold.\n2. Handle the edge case cleanly without breaking correctness.\n3. Confirm optimal time and space complexity.`,
        },
      ],
      properties: subtopics.length > 0 ? subtopics : [ch.summary],
      edge_cases: [
        `Empty or minimal input in ${firstSub}.`,
        `Boundary / worst-case input triggering maximum overhead in ${secondSub}.`,
        `Confusing necessary conditions with sufficient conditions during UGC NET MCQs.`,
      ],
      applications: [
        `Core systems and software design involving ${ch.title}.`,
        `Direct UGC NET Paper 2 & JRF problem solving.`,
      ],
      misconceptions: [
        `Memorizing definitions of ${firstSub} without tracing an actual example by hand.`,
      ],
      pseudocode: `// Core workflow for ${ch.title}\nfunction solve_${ch.slug.replace(/-/g, "_")}(input) {\n  // 1. Validate base case\n  if (input == NULL) return defaultState;\n  // 2. Process ${firstSub}\n  result = applyRule(input);\n  return result;\n}`,
      complexity: {
        time: "Depends on input structure (analyze worst vs average)",
        space: "Check auxiliary memory overhead",
        note: `Master ${subtopics[0] || ch.title} before attempting JRF numericals.`,
      },
      exam_relevance: `Official UGC NET CS Unit chapter: ${ch.title}. Subtopics: ${subtopics.join(", ")}.`,
      teaching_methods: {
        feynman_prompt: `Explain ${ch.title} (${firstSub}) in 2–3 simple sentences as if teaching a friend who has never studied Computer Science.`,
        feynman_keywords: ch.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 4),
        socratic_questions: [
          {
            question: `What real problem would break if ${firstSub} did not exist?`,
            hint: `Think about ${ch.summary.slice(0, 80)}...`,
            answer: `Without ${firstSub}, systems lose either correctness, structure, or efficiency when handling ${secondSub}.`,
          },
        ],
        faded_example: {
          title: `Quick Check on ${ch.title}`,
          steps: [
            { prompt: `Primary focus of this chapter:`, blank: firstSub, hint: "First subtopic" },
            { prompt: `Key related subtopic:`, blank: secondSub, hint: "Second subtopic" },
          ],
        },
        prediction_challenge: {
          scenario: `When solving a ${ch.title} problem under tight constraints, what should you check FIRST?`,
          options: [
            "Base / boundary cases and invariants",
            "Guess the shortest formula immediately",
            "Skip tracing small examples",
          ],
          correct: "Base / boundary cases and invariants",
          explanation: "Checking invariants and boundary cases prevents 90% of exam traps and interview bugs.",
        },
        compare_contrast: {
          leftTitle: "Naive / Brute Approach",
          rightTitle: `Structured ${ch.title}`,
          rows: [
            ["Clarity & Correctness", "Ad-hoc, error-prone on edge cases", "Systematic and verifiable"],
            ["Exam & Interview Readiness", "Struggles with twists", "Handles constraints cleanly"],
          ],
        },
        error_analysis: {
          buggyClaim: `You only need to memorize the name of ${firstSub} for UGC NET.`,
          whyPlausible: "Direct definition questions occasionally appear.",
          correction: `UGC NET JRF questions twist ${firstSub} with edge cases and numericals — always trace examples!`,
        },
      },
      flashcards: [
        { card_type: "Core Topic", front: `What are the key subtopics of ${ch.title}?`, back: subtopics.join(", ") },
        { card_type: "Exam Tip", front: `First check when solving ${firstSub} problems:`, back: "Verify base cases, invariants, and worst-case bounds." },
      ],
    });
  }

  return generated;
}

export function buildTwistQuestionsForConcept(concept: {
  id: string;
  kingdom_id: string;
  chapter_id: string;
  title: string;
  slug: string;
}) {
  const twists = [
    {
      tag: "Core Principle",
      prompt: `[Core Check] Which statement best captures the primary goal of ${concept.title}?`,
      correct: `Organizing and solving problems systematically with clear invariants`,
      distractors: [
        `Bypassing correctness checks for random speedups`,
        `Avoiding formal definitions in system design`,
        `Replacing all algorithms with brute-force scans`,
      ],
      explanation: `${concept.title} establishes rigorous structure, invariants, and predictable performance.`,
      difficulty: "easy",
    },
    {
      tag: "Edge Case Twist",
      prompt: `[Edge Case Twist] When an empty, minimal, or single-element input is passed to ${concept.title}, what must an implementation do FIRST?`,
      correct: `Guard the base/boundary case before dereferencing or iterating`,
      distractors: [
        `Assume at least 10 elements exist`,
        `Skip validation to save 1 CPU cycle`,
        `Return an uninitialized memory address`,
      ],
      explanation: `Boundary guards prevent null dereferences, division by zero, and off-by-one failures.`,
      difficulty: "medium",
    },
    {
      tag: "Complexity Twist",
      prompt: `[Complexity Twist] In ${concept.title}, why do we analyze worst-case behavior alongside average-case?`,
      correct: `Adversarial or skewed inputs can degrade naive designs dramatically`,
      distractors: [
        `Worst-case and best-case are always identical`,
        `Space complexity is always O(1) regardless of input`,
        `Asymptotic notation ignores input size n`,
      ],
      explanation: `Worst-case analysis guarantees reliability even on adversarial inputs.`,
      difficulty: "medium",
    },
    {
      tag: "Debugging Twist",
      prompt: `[Debugging Twist] A colleague's solution for ${concept.title} works on sorted small inputs but fails on large unsorted or duplicate inputs. What is the most likely cause?`,
      correct: `An unverified assumption or broken invariant on ties/scale`,
      distractors: [
        `The CPU clock speed was too fast`,
        `Comments in the code slowed down execution`,
        `Variables were named too clearly`,
      ],
      explanation: `Small sorted tests often hide tie-handling bugs, O(n^2) blowups, and broken loop invariants.`,
      difficulty: "medium",
    },
    {
      tag: "Trade-off Twist",
      prompt: `[System Trade-off] When optimizing ${concept.title} for memory-constrained hardware, which trade-off is most realistic?`,
      correct: `Trading extra computation time or in-place updates to reduce auxiliary space`,
      distractors: [
        `Allocating infinite cache memory`,
        `Removing all error handling`,
        `Ignoring asymptotic space bounds`,
      ],
      explanation: `Time-space trade-offs are central to systems, OS, DBMS, and algorithm design.`,
      difficulty: "hard",
    },
    {
      tag: "Corporate Interview Twist",
      prompt: `[Interview Twist] An interviewer asks you to scale ${concept.title} to 10 million concurrent records. What is your strongest first step?`,
      correct: `Clarify constraints, bottlenecks, and asymptotic bounds before coding`,
      distractors: [
        `Immediately write nested loops without checking scale`,
        `Assume all 10 million records fit in L1 CPU cache`,
        `Hardcode the first 5 test cases`,
      ],
      explanation: `Senior engineers clarify constraints, throughput/latency targets, and bottlenecks first.`,
      difficulty: "jrf",
    },
    {
      tag: "Invariant Twist",
      prompt: `[Invariant Check] What is the role of a loop or structural invariant in ${concept.title}?`,
      correct: `It holds true before, during, and after every valid transition`,
      distractors: [
        `It only holds on the final line of the program`,
        `It changes randomly on each step`,
        `It disables compiler type checking`,
      ],
      explanation: `Invariants are the mathematical backbone of correctness proofs.`,
      difficulty: "medium",
    },
    {
      tag: "Comparison Twist",
      prompt: `[Compare & Contrast] Why is ${concept.title} preferred over ad-hoc brute force in production systems?`,
      correct: `Predictable scaling, formal guarantees, and cleaner maintainability`,
      distractors: [
        `It always uses zero CPU cycles`,
        `It eliminates the need for testing`,
        `It works only on 1-byte inputs`,
      ],
      explanation: `Predictable scaling and formal correctness make production systems resilient.`,
      difficulty: "easy",
    },
    {
      tag: "JRF Reasoning Twist",
      prompt: `[JRF Reasoning] If a problem combining ${concept.title} with another unit introduces a tight constraint, which verification technique catches subtle errors fastest?`,
      correct: `Dry-running a small counterexample with boundary values`,
      distractors: [
        `Assuming the first option that looks familiar is right`,
        `Ignoring units and constraints`,
        `Skipping step-by-step state tracing`,
      ],
      explanation: `Testing small counterexamples exposes false assumptions immediately.`,
      difficulty: "jrf",
    },
    {
      tag: "Application Twist",
      prompt: `[Real-World Application] Where does ${concept.title} directly impact real software engineering or UGC NET Paper 2 problems?`,
      correct: `Designing reliable, verifiable, and efficient computing systems`,
      distractors: [
        `Only in historical textbooks with no modern use`,
        `Solely for changing monitor brightness`,
        `Nowhere outside of syntax highlighting`,
      ],
      explanation: `Every unit in UGC NET Code 087 maps directly to real computing architecture and algorithms.`,
      difficulty: "easy",
    },
  ];

  return twists.map((tw, idx) => ({
    id: `q-twist-${concept.id}-${idx + 1}`,
    kingdom_id: concept.kingdom_id,
    chapter_id: concept.chapter_id,
    concept_id: concept.id,
    prompt: tw.prompt,
    explanation: tw.explanation,
    difficulty: tw.difficulty,
    is_pyq: 0,
    pyq_label: tw.tag,
    xp_reward: tw.difficulty === "jrf" ? 30 : 20,
    options: [
      { label: "A", text: tw.correct, is_correct: true },
      { label: "B", text: tw.distractors[0], is_correct: false },
      { label: "C", text: tw.distractors[1], is_correct: false },
      { label: "D", text: tw.distractors[2], is_correct: false },
    ],
  }));
}
