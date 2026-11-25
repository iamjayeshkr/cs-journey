import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Map as MapIcon, Puzzle, ShieldCheck, Sparkles } from "lucide-react";
import { KINGDOMS } from "@/lib/curriculum-data";
import { getSessionUserId } from "@/lib/auth";

async function HeaderAuthActions() {
  const userId = await getSessionUserId();
  return userId ? (
    <Link href="/dashboard" className="terracotta-btn px-4 py-2 rounded-md text-sm font-semibold">
      Open My Journal →
    </Link>
  ) : (
    <>
      <Link href="/auth" className="parchment-btn px-3.5 py-2 rounded-md text-sm font-semibold">
        Sign In
      </Link>
      <Link href="/auth?mode=register" className="ink-btn px-4 py-2 rounded-md text-sm font-semibold">
        Begin Journey
      </Link>
    </>
  );
}

async function HeroCTA() {
  const userId = await getSessionUserId();
  return (
    <Link
      href={userId ? "/dashboard" : "/auth"}
      className="terracotta-btn px-6 py-3 rounded-md text-base font-semibold inline-flex items-center gap-2"
    >
      <span>{userId ? "Continue Your Quest" : "Begin Your Journey"}</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col">
      {/* Top Journal Ribbon */}
      <header className="border-b border-ink/20 bg-[#F2E6CF]/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-ink text-ivory flex items-center justify-center">
              <Compass className="w-5 h-5 text-mustard" />
            </div>
            <span className="font-hand text-2xl font-bold">The CS Journey</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a href="#kingdoms" className="hover:underline">10 Kingdoms</a>
            <a href="#method" className="hover:underline">8-Stage Method</a>
            <Link href="/syllabus" className="hover:underline">Syllabus</Link>
            <Link href="/practice" className="hover:underline">PYQ Bank</Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <Suspense fallback={<Link href="/auth" className="ink-btn px-4 py-2 rounded-md text-sm font-semibold">Begin Journey</Link>}>
              <HeaderAuthActions />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Hero Journal Cover */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment border border-ink/25 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Handcrafted UGC NET & JRF Computer Science Adventure</span>
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl font-bold leading-[1.05] text-ink">
            Master Computer Science{" "}
            <span className="marker-highlight">One Kingdom at a Time.</span>
          </h1>

          <p className="font-serif text-lg text-ink-muted leading-relaxed max-w-2xl">
            Step inside an interactive study journal where every unit of the official UGC NET Paper 2
            syllabus becomes an illustrated realm—complete with railway-station pointer visualizers,
            CPU schedulers, SQL vaults, logic puzzles, and spaced-repetition memory cards.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Suspense
              fallback={
                <Link href="/auth" className="terracotta-btn px-6 py-3 rounded-md text-base font-semibold inline-flex items-center gap-2">
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            >
              <HeroCTA />
            </Suspense>
            <Link
              href="/world-map"
              className="parchment-btn px-5 py-3 rounded-md text-base font-semibold inline-flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              <span>Explore World Map</span>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">10</p>
              <p className="text-xs text-ink-muted">Official Units</p>
            </div>
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">8-Stage</p>
              <p className="text-xs text-ink-muted">Learning Engine</p>
            </div>
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">1–30d</p>
              <p className="text-xs text-ink-muted">Spaced Recall</p>
            </div>
          </div>
        </div>

        {/* Illustrated Journal Preview Card */}
        <div className="lg:col-span-5">
          <div className="journal-card p-6 washi-tape relative">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                  Featured Quest • Kingdom VII
                </p>
                <h2 className="font-hand text-3xl font-bold">The Railway Linked List</h2>
              </div>
              <span className="stamp-badge px-2.5 py-1 text-xs font-bold text-forest">
                +80 XP
              </span>
            </div>

            {/* Hand-drawn style SVG Railway Diagram */}
            <div className="rounded-md bg-[#F2E6CF] border border-ink/20 p-4 mb-4">
              <svg viewBox="0 0 380 110" className="w-full h-auto">
                <line x1="20" y1="82" x2="360" y2="82" stroke="#493426" strokeWidth="2.5" strokeDasharray="6 4" />
                {[
                  { x: 30, val: "10", label: "head" },
                  { x: 135, val: "20", label: "station B" },
                  { x: 240, val: "30", label: "station C" },
                ].map((n, i) => (
                  <g key={n.val} transform={`translate(${n.x}, 20)`}>
                    <rect width="74" height="44" rx="4" fill="#FAF4E8" stroke="#493426" strokeWidth="2" />
                    <line x1="44" y1="0" x2="44" y2="44" stroke="#493426" strokeWidth="1.5" />
                    <text x="22" y="27" textAnchor="middle" fontSize="15" fontWeight="700" fill="#493426">
                      {n.val}
                    </text>
                    <text x="59" y="27" textAnchor="middle" fontSize="12" fill="#BD8068">
                      {i < 2 ? "•→" : "NULL"}
                    </text>
                    <text x="37" y="82" textAnchor="middle" fontSize="10" fill="#765E4D">
                      {n.label}
                    </text>
                  </g>
                ))}
                <path d="M 105 42 L 132 42" stroke="#493426" strokeWidth="2" markerEnd="url(#arrow)" />
                <path d="M 210 42 L 237 42" stroke="#493426" strokeWidth="2" />
              </svg>
            </div>

            <p className="font-serif text-sm text-ink-muted leading-relaxed mb-4">
              Learn pointers through the Mountain Express Railway analogy, insert and reverse nodes live,
              solve pointer-tracing puzzles, and conquer UGC NET PYQs.
            </p>

            <Link
              href="/concepts/singly-linked-list"
              className="forest-btn w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Try Interactive Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8-Stage Method */}
      <section id="method" className="border-y border-ink/15 bg-[#EFE2C8]/70 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-hand text-4xl font-bold">Not Another Static Quiz App</h2>
            <p className="text-sm text-ink-muted mt-1">
              Every concept guides you through eight deliberate stages from intuition to JRF mastery.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Compass, title: "1–2. Discover & Understand", desc: "Real-world analogies, first-principles intuition, and formal CS definitions." },
              { icon: Sparkles, title: "3–4. Visualize & Experiment", desc: "Interactive Linked List, CPU Scheduler, SQL, and DFA sandboxes." },
              { icon: Puzzle, title: "5–6. Practice & Challenge", desc: "Graded exercises and reasoning puzzles in the Puzzle Dungeon." },
              { icon: ShieldCheck, title: "7–8. PYQs & Mastery", desc: "UGC NET previous-year questions and 1/3/7/14/30-day spaced recall." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="journal-card p-4">
                  <Icon className="w-6 h-6 text-terracotta mb-2" />
                  <h3 className="font-hand text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 Kingdoms Grid */}
      <section id="kingdoms" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-hand text-4xl font-bold">The Ten Kingdoms of UGC NET CS</h2>
            <p className="text-sm text-ink-muted">Complete Paper 2 syllabus mapped into ten navigable realms.</p>
          </div>
          <Link href="/syllabus" className="text-sm font-semibold text-terracotta hover:underline inline-flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> Full Syllabus
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {KINGDOMS.map((k) => (
            <Link
              key={k.id}
              href={`/kingdoms/${k.slug}`}
              className="journal-card p-4 hover:bg-[#F3E8D2] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-7 h-7 rounded-full border border-ink/30 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${k.theme_color}55` }}
                  >
                    {k.order_index}
                  </span>
                  <span className="text-[11px] text-ink-muted font-medium">Unit {k.order_index}</span>
                </div>
                <h3 className="font-hand text-xl font-bold leading-snug">{k.title}</h3>
                <p className="text-xs text-ink-muted mt-1 line-clamp-2">{k.subtitle}</p>
              </div>
              <span className="mt-3 text-xs font-semibold text-terracotta">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-ink/20 bg-[#EFE2C8] py-6 text-center text-xs text-ink-muted">
        The CS Journey • Handcrafted UGC NET Computer Science & Applications Learning Platform
      </footer>
    </div>
  );
}
