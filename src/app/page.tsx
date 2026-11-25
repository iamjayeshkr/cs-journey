import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Map as MapIcon, Sparkles } from "lucide-react";
import { KINGDOMS } from "@/lib/curriculum-data";
import { getSessionUserId } from "@/lib/auth";
import { Illustration, KingdomIllustration } from "@/components/IllustratedAssets";

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
      <header className="border-b border-ink/20 bg-[#F2E6CF]/95 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-10 rounded-md bg-[#FAF4E8] border border-ink/25 flex items-center justify-center p-0.5">
              <Illustration src="/assets/ui/logo-mark.png" alt="The CS Journey Logo" width={40} height={36} />
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment border border-ink/25 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Handcrafted UGC NET & JRF Computer Science Adventure</span>
          </div>

          <h1 className="font-hand text-5xl sm:text-6xl font-bold leading-[1.05] text-ink">
            The CS Journey —{" "}
            <span className="marker-highlight">Master CS One Kingdom at a Time.</span>
          </h1>

          <p className="font-serif text-lg text-ink-muted leading-relaxed">
            Master Computer Science for UGC NET / JRF inside an interactive study journal.
            Every unit of the official Code 87 syllabus becomes an illustrated realm with
            simulations, reasoning puzzles, and spaced-repetition mastery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
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

          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">10</p>
              <p className="text-xs text-ink-muted">Official Units</p>
            </div>
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">90</p>
              <p className="text-xs text-ink-muted">Syllabus Chapters</p>
            </div>
            <div className="journal-card p-3 text-center">
              <p className="font-hand text-2xl font-bold text-ink">8-Stage</p>
              <p className="text-xs text-ink-muted">Learning Engine</p>
            </div>
          </div>
        </div>

        {/* Illustrated Landscape & Explorer Composition */}
        <div className="lg:col-span-6 space-y-4">
          <div className="journal-card p-5 washi-tape relative overflow-hidden bg-gradient-to-b from-[#FAF4E8] to-[#EFE2C6]">
            <div className="flex flex-col items-center">
              <Illustration
                src="/assets/ui/final-logo.png"
                alt="The CS Journey — Master Computer Science"
                width={280}
                height={186}
                priority
              />
              <div className="relative w-full flex items-end justify-between gap-2 mt-2 px-2">
                <Illustration
                  src="/assets/landscapes/hero-overlook.png"
                  alt="Explorer overlooking the CS Kingdoms"
                  width={180}
                  height={165}
                  priority
                  className="shrink-0"
                />
                <Illustration
                  src="/assets/landscapes/camp-mountains.png"
                  alt="Explorer camp and mountain peaks"
                  width={320}
                  height={150}
                  priority
                  className="hidden sm:block"
                />
              </div>
            </div>

            {/* Featured Railway Lesson Strip */}
            <div className="mt-4 pt-3 border-t border-ink/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Illustration
                  src="/assets/educational/railway-train.png"
                  alt="Mountain Express Railway"
                  width={110}
                  height={56}
                />
                <div>
                  <p className="text-[11px] uppercase font-bold text-terracotta">Featured Interactive Lesson</p>
                  <p className="font-hand text-xl font-bold">The Railway Linked List</p>
                </div>
              </div>
              <Link
                href="/concepts/singly-linked-list"
                className="forest-btn px-4 py-2 rounded-md text-xs font-semibold shrink-0"
              >
                Try Lesson →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Stage Method with Companions */}
      <section id="method" className="border-y border-ink/15 bg-[#EFE2C8]/75 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-hand text-4xl font-bold">Guided by Companions Through 8 Stages</h2>
            <p className="text-sm text-ink-muted mt-1">
              From first-principles intuition and live simulations to reasoning puzzles and spaced recall.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: "/assets/characters/explorer-writing.png", title: "1–2. Discover & Understand", desc: "Real-world analogies, first-principles intuition, and formal CS definitions." },
              { img: "/assets/companions/byte-bird.png", title: "3–4. Visualize & Experiment", desc: "Interactive Linked List, CPU Scheduler, SQL, and DFA sandboxes." },
              { img: "/assets/companions/foxy.png", title: "5–6. Practice & Challenge", desc: "Graded exercises and reasoning puzzles in the Puzzle Dungeon." },
              { img: "/assets/companions/kronos.png", title: "7–8. PYQs & Mastery", desc: "UGC NET previous-year questions and 1/3/7/14/30-day spaced recall." },
            ].map((item) => (
              <div key={item.title} className="journal-card p-4 flex flex-col items-center text-center">
                <Illustration src={item.img} alt={item.title} width={88} height={88} animate className="mb-2" />
                <h3 className="font-hand text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Kingdoms Illustrated Grid */}
      <section id="kingdoms" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-hand text-4xl font-bold">The Ten Kingdoms of UGC NET CS</h2>
            <p className="text-sm text-ink-muted">Complete Paper 2 (Code 87) syllabus mapped into ten illustrated realms.</p>
          </div>
          <Link href="/syllabus" className="text-sm font-semibold text-terracotta hover:underline inline-flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> Full Syllabus
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {KINGDOMS.map((k) => (
            <Link
              key={k.id}
              href={`/kingdoms/${k.slug}`}
              className="journal-card p-4 hover:bg-[#F3E8D2] transition-colors flex flex-col items-center text-center justify-between"
            >
              <KingdomIllustration kingdomKey={k.id} alt={k.title} size={112} />
              <div className="mt-2">
                <span className="text-[11px] font-bold uppercase text-terracotta">Unit {k.order_index}</span>
                <h3 className="font-hand text-xl font-bold leading-snug">{k.title}</h3>
                <p className="text-xs text-ink-muted mt-1 line-clamp-2">{k.subtitle}</p>
              </div>
              <span className="mt-3 text-xs font-semibold text-ink">Enter Realm →</span>
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
