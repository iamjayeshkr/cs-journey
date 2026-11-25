"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Languages,
  Layers,
  Lightbulb,
  Search,
  Sparkles,
  Swords,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KingdomIllustration } from "@/components/IllustratedAssets";
import { getTopicDoc, LearnLang, VisualKind } from "@/lib/learn-docs";

interface ConceptSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  estimated_minutes: number;
  mastery?: { mastery_score: number; status: string };
}

interface ChapterWithConcepts {
  id: string;
  title: string;
  summary: string;
  concepts: ConceptSummary[];
}

interface KingdomItem {
  id: string;
  order_index: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  chapters: ChapterWithConcepts[];
}

function InteractiveDocVisual({
  kind,
  lang,
}: {
  kind: VisualKind;
  lang: LearnLang;
}) {
  const [pVal, setPVal] = useState(true);
  const [qVal, setQVal] = useState(false);
  const [step, setStep] = useState(0);

  if (kind === "logic_gate") {
    const implies = !pVal || qVal;
    const andVal = pVal && qVal;
    const orVal = pVal || qVal;
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-ink">
            {lang === "hinglish"
              ? "Buttons dabao aur Truth Values live dekho:"
              : "Toggle P and Q to see Logic Outputs live:"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPVal((v) => !v)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                pVal ? "bg-forest text-ivory border-forest" : "bg-terracotta/20 text-terracotta border-terracotta"
              }`}
            >
              P = {pVal ? "TRUE" : "FALSE"}
            </button>
            <button
              type="button"
              onClick={() => setQVal((v) => !v)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                qVal ? "bg-forest text-ivory border-forest" : "bg-terracotta/20 text-terracotta border-terracotta"
              }`}
            >
              Q = {qVal ? "TRUE" : "FALSE"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded bg-parchment/70 border border-ink/15">
            <p className="font-mono font-bold">P → Q</p>
            <p className={`font-bold mt-1 ${implies ? "text-forest" : "text-terracotta"}`}>
              {implies ? "TRUE" : "FALSE (Broken!)"}
            </p>
          </div>
          <div className="p-2.5 rounded bg-parchment/70 border border-ink/15">
            <p className="font-mono font-bold">P ∧ Q (AND)</p>
            <p className={`font-bold mt-1 ${andVal ? "text-forest" : "text-ink-muted"}`}>
              {andVal ? "TRUE" : "FALSE"}
            </p>
          </div>
          <div className="p-2.5 rounded bg-parchment/70 border border-ink/15">
            <p className="font-mono font-bold">P ∨ Q (OR)</p>
            <p className={`font-bold mt-1 ${orVal ? "text-forest" : "text-ink-muted"}`}>
              {orVal ? "TRUE" : "FALSE"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stagesByKind: Record<string, { label: string; descEn: string; descHi: string }[]> = {
    pipeline: [
      { label: "IF (Fetch)", descEn: "CPU fetches instruction from Cache/RAM.", descHi: "CPU instruction ko Memory se uthata hai." },
      { label: "ID (Decode)", descEn: "Control Unit decodes opcode & reads registers.", descHi: "Samajhta hai ki kaunsa operation karna hai." },
      { label: "EX (Execute)", descEn: "ALU performs arithmetic or branch check.", descHi: "ALU asli calculation karta hai." },
      { label: "MEM / WB", descEn: "Writes result back to memory or register.", descHi: "Final answer register mein save hota hai." },
    ],
    memory_stack: [
      { label: "main()", descEn: "Bottom stack frame created when program starts.", descHi: "Program start hote hi main() ki plate neeche lagti hai." },
      { label: "solve(n)", descEn: "Pushed on top with its own local variables.", descHi: "Nayi plate upar aati hai apne local variables ke saath." },
      { label: "solve(n-1)", descEn: "Recursive call pushes another frame on top.", descHi: "Recursion mein ek aur plate upar chadh jaati hai." },
      { label: "return", descEn: "Top frame pops off cleanly (LIFO order).", descHi: "Kaam khatam hote hi upar wali plate hat jaati hai." },
    ],
    sql_table: [
      { label: "Raw Table", descEn: "All 4 rows: (Amit, CS, 88), (Riya, CS, 72), (Dev, EC, 91), (Neha, CS, 95)", descHi: "Poori table: 4 students alag-alag branches aur marks ke saath." },
      { label: "σ (Filter Rows)", descEn: "Keep only dept='CS' AND marks>80 -> Amit (88), Neha (95).", descHi: "σ ne sirf CS ke >80 marks wale rows rakhe: Amit aur Neha." },
      { label: "π (Pick Columns)", descEn: "Show only Name column -> [Amit, Neha].", descHi: "π ne sirf Name column nikala: [Amit, Neha]." },
    ],
    cpu_gantt: [
      { label: "0–2ms: P2", descEn: "Shortest job P2 (burst 2ms) runs first!", descHi: "Chhota kaam P2 (2ms) sabse pehle nipat gaya!" },
      { label: "2–10ms: P1", descEn: "Longer job P1 (burst 8ms) runs next; avg wait = 1ms.", descHi: "Ab P1 (8ms) chalta hai; average wait sirf 1ms!" },
    ],
    cfg_graph: [
      { label: "Start Node", descEn: "Program enters the function.", descHi: "Function yahan se shuru hota hai." },
      { label: "Decision (if/while)", descEn: "Each condition splits flow into True/False branches (+1 to V(G)).", descHi: "Har 'if' ya loop 2 raste banata hai (+1 to V(G))." },
      { label: "Exit Node", descEn: "Branches merge back; V(G) = Predicates + 1.", descHi: "Sab raste milte hain; V(G) = Decision nodes + 1." },
    ],
    tree_heap: [
      { label: "Root (50)", descEn: "Compare target (35) with 50: 35 < 50, go LEFT!", descHi: "35 ko 50 se compare karo: chhota hai, LEFT jao!" },
      { label: "Left Child (30)", descEn: "Compare 35 with 30: 35 > 30, go RIGHT!", descHi: "35 > 30 hai, ab RIGHT jao!" },
      { label: "Found (35)", descEn: "Found in just 3 comparisons instead of scanning all nodes!", descHi: "Sirf 3 steps mein mil gaya — poora tree nahi dekhna pada!" },
    ],
    automata: [
      { label: "q₀ (Start)", descEn: "Waiting for 'a'. Reading 'b' stays at q₀.", descHi: "Start state: 'a' ka wait kar raha hai." },
      { label: "q₁ (Saw 'a')", descEn: "Saw 'a'! Now reading 'b' moves to Final state.", descHi: "'a' mil gaya! Ab 'b' aate hi jeet jaayenge." },
      { label: "q₂ (Accept ✅)", descEn: "String ends in 'ab' — Accepted!", descHi: "String 'ab' par khatam hui — Accept ho gayi ✅!" },
    ],
    osi_layers: [
      { label: "7. Application", descEn: "Creates HTTP/WhatsApp data message.", descHi: "Tumhara message yahan banta hai." },
      { label: "4. Transport (TCP)", descEn: "Adds Port numbers + reliable sequence.", descHi: "Port number aur reliability tag lagta hai." },
      { label: "3. Network (IP)", descEn: "Adds Source & Destination IP for routing.", descHi: "Destination IP address lagta hai." },
      { label: "2-1. Link & Physical", descEn: "Adds MAC address & sends bits over wire/Wi-Fi.", descHi: "MAC address lagta hai aur bits wire/Wi-Fi par jaate hain." },
    ],
    ai_search: [
      { label: "Start (g=0, h=7)", descEn: "Total f = 0 + 7 = 7.", descHi: "Shuruwat: g=0, andaaza h=7, total f=7." },
      { label: "Road A (g=4, h=5)", descEn: "Total f = 9 (looks longer).", descHi: "Rasta A: total f = 9 (thoda lamba lag raha hai)." },
      { label: "Road B (g=6, h=2)", descEn: "Total f = 8 -> A* picks Road B!", descHi: "Rasta B: total f = 8 -> A* isko chunega!" },
    ],
  };

  const stages = stagesByKind[kind] ?? stagesByKind.pipeline;
  const activeStage = stages[step % stages.length];

  return (
    <div className="p-4 rounded-xl bg-ivory border border-ink/20 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-ink">
          {lang === "hinglish" ? "Step par click karke flow dekho:" : "Click any stage to trace the flow:"}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % stages.length)}
          className="parchment-btn px-2.5 py-1 rounded text-[11px] font-semibold"
        >
          {lang === "hinglish" ? "Agla Step →" : "Next Step →"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {stages.map((st, idx) => (
          <button
            key={st.label}
            type="button"
            onClick={() => setStep(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              step % stages.length === idx
                ? "bg-forest text-ivory border-forest shadow-sm"
                : "bg-parchment/70 text-ink border-ink/20 hover:bg-parchment"
            }`}
          >
            {idx + 1}. {st.label}
          </button>
        ))}
      </div>
      <div className="p-3 rounded-lg bg-[#FAF4E8] border border-ink/15 text-xs font-serif text-ink">
        <strong>{activeStage.label}:</strong>{" "}
        {lang === "hinglish" ? activeStage.descHi : activeStage.descEn}
      </div>
    </div>
  );
}

export default function LearnDocsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<KingdomItem[]>([]);
  const [selectedUnitSlug, setSelectedUnitSlug] = useState<string | null>(null);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState<string | null>(null);
  const [lang, setLang] = useState<LearnLang>("en");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/kingdoms").then((r) => r.json()),
    ])
      .then(([me, kRes]) => {
        setUser(me.user ?? null);
        setKingdoms(kRes.kingdoms ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeUnit = useMemo(
    () => kingdoms.find((k) => k.slug === selectedUnitSlug) ?? null,
    [kingdoms, selectedUnitSlug]
  );

  const unitTopics = useMemo(() => {
    if (!activeUnit) return [];
    const list: ConceptSummary[] = [];
    for (const ch of activeUnit.chapters) {
      for (const co of ch.concepts) {
        list.push(co);
      }
    }
    return list;
  }, [activeUnit]);

  const activeTopic = useMemo(() => {
    if (!unitTopics.length) return null;
    return unitTopics.find((c) => c.slug === selectedConceptSlug) ?? unitTopics[0];
  }, [unitTopics, selectedConceptSlug]);

  const allTopicsMatchingSearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const matches: { unit: KingdomItem; topic: ConceptSummary }[] = [];
    for (const k of kingdoms) {
      for (const ch of k.chapters) {
        for (const co of ch.concepts) {
          if (co.title.toLowerCase().includes(q) || k.title.toLowerCase().includes(q)) {
            matches.push({ unit: k, topic: co });
          }
        }
      }
    }
    return matches.slice(0, 18);
  }, [kingdoms, search]);

  const doc = useMemo(() => {
    if (!activeUnit || !activeTopic) return null;
    return getTopicDoc(activeUnit.title, activeTopic.title);
  }, [activeUnit, activeTopic]);

  const copy = doc ? (lang === "hinglish" ? doc.hinglish : doc.en) : null;

  return (
    <JournalShell user={user}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2 text-ink">
              <GraduationCap className="w-8 h-8 text-terracotta" /> Learn — Concept Docs (10 Units • 90 Topics)
            </h1>
            <p className="text-sm text-ink-muted">
              Learn any concept from zero before practicing — explained in{" "}
              <strong className="text-ink">Easy English</strong> &amp;{" "}
              <strong className="text-ink">Hinglish</strong> with interactive visuals.
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 bg-ivory border border-ink/25 rounded-full p-1 shadow-sm">
            <Languages className="w-4 h-4 text-terracotta ml-2" />
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "en" ? "bg-ink text-ivory" : "text-ink-muted hover:text-ink"
              }`}
            >
              Easy English
            </button>
            <button
              type="button"
              onClick={() => setLang("hinglish")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "hinglish" ? "bg-terracotta text-ivory" : "text-ink-muted hover:text-ink"
              }`}
            >
              Hinglish (Aasan)
            </button>
          </div>
        </div>

        {/* Search Across All 90 Topics */}
        <div className="journal-card p-3 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any of the 90 CS topics (e.g., Normalization, Paging, Deadlock, Master Theorem, DFA)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded bg-ivory border border-ink/20 focus:outline-none focus:border-terracotta"
            />
          </div>
          {allTopicsMatchingSearch.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {allTopicsMatchingSearch.map(({ unit, topic }) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedUnitSlug(unit.slug);
                    setSelectedConceptSlug(topic.slug);
                    setSearch("");
                  }}
                  className="text-left p-2.5 rounded bg-ivory border border-ink/20 hover:bg-parchment transition text-xs"
                >
                  <p className="font-bold text-ink truncate">{topic.title}</p>
                  <p className="text-[10px] text-ink-muted truncate">{unit.title}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="journal-card p-8 text-center text-sm text-ink-muted">
            Loading 10 units and 90 concept docs...
          </div>
        ) : !activeUnit ? (
          /* VIEW 1: 10 UNIT CARDS */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kingdoms.map((unit) => {
              const topicCount = unit.chapters.reduce((acc, ch) => acc + ch.concepts.length, 0);
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => {
                    setSelectedUnitSlug(unit.slug);
                    const first = unit.chapters[0]?.concepts[0];
                    if (first) setSelectedConceptSlug(first.slug);
                  }}
                  className="journal-card p-5 text-left hover:-translate-y-1 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-ivory border border-ink/20 p-1.5 shrink-0 flex items-center justify-center">
                      <KingdomIllustration kingdomKey={unit.slug} alt={unit.title} size={72} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                        Unit {unit.order_index} • {topicCount} Topics
                      </span>
                      <h2 className="font-hand text-2xl font-bold text-ink leading-tight mt-0.5 group-hover:text-terracotta transition">
                        {unit.title}
                      </h2>
                      <p className="text-xs text-ink-muted mt-1 line-clamp-2">{unit.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-xs font-semibold">
                    <span className="text-ink-muted">Easy English + Hinglish + Visuals</span>
                    <span className="text-forest">Open Docs →</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: INSIDE SELECTED UNIT -> 9 TOPICS + FULL INTERACTIVE DOCS */
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedUnitSlug(null);
                  setSelectedConceptSlug(null);
                }}
                className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All 10 Units
              </button>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
                Unit {activeUnit.order_index}: {activeUnit.title} ({unitTopics.length} Topics)
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-5 items-start">
              {/* Sub-topic Sidebar (9 topics in this unit) */}
              <div className="lg:col-span-4 journal-card p-4 space-y-2">
                <h3 className="font-hand text-2xl font-bold text-ink px-1">
                  Unit {activeUnit.order_index} Topics ({unitTopics.length})
                </h3>
                <div className="space-y-1.5">
                  {unitTopics.map((topic, idx) => {
                    const isSelected = activeTopic?.id === topic.id;
                    const done = (topic.mastery?.mastery_score ?? 0) >= 80;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedConceptSlug(topic.slug)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-[#FFF3D1] border-terracotta text-ink font-bold shadow-sm"
                            : "bg-ivory border-ink/15 text-ink hover:bg-parchment/70"
                        }`}
                      >
                        <span className="truncate">
                          {idx + 1}. {topic.title}
                        </span>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Concept Doc Reader */}
              {activeTopic && doc && copy && (
                <div className="lg:col-span-8 journal-card p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-ink/15">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                        {activeUnit.title} • {lang === "hinglish" ? "Hinglish Guide" : "Easy English Guide"}
                      </span>
                      <h2 className="font-hand text-3xl sm:text-4xl font-bold text-ink mt-0.5">
                        {activeTopic.title}
                      </h2>
                      <p className="text-xs text-ink-muted mt-1">{copy.tldr}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/concepts/${activeTopic.slug}`}
                        className="terracotta-btn px-3.5 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Swords className="w-3.5 h-3.5" /> Practice Topic →
                      </Link>
                      <Link
                        href="/vault"
                        className="parchment-btn px-3 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" /> 520 Flashcards
                      </Link>
                    </div>
                  </div>

                  {/* Story / Real-Life Intuition */}
                  <div className="sticky-note p-4 rounded-xl border border-[#D5AE65] space-y-1.5">
                    <h3 className="font-hand text-2xl font-bold flex items-center gap-1.5 text-ink">
                      <Lightbulb className="w-5 h-5 text-terracotta" />
                      {lang === "hinglish" ? "Real-Life Kahani (Asaan Intuition)" : "Real-Life Intuition"}
                    </h3>
                    <p className="text-sm font-serif leading-relaxed text-ink">{copy.story}</p>
                  </div>

                  {/* Interactive Visualization */}
                  <div className="space-y-2">
                    <h3 className="font-hand text-2xl font-bold flex items-center gap-1.5 text-ink">
                      <Sparkles className="w-5 h-5 text-forest" /> {doc.visualTitle}
                    </h3>
                    <InteractiveDocVisual kind={doc.visualKind} lang={lang} />
                  </div>

                  {/* Step-by-Step Breakdown */}
                  <div className="space-y-2.5">
                    <h3 className="font-hand text-2xl font-bold flex items-center gap-1.5 text-ink">
                      <BookOpen className="w-5 h-5 text-terracotta" />
                      {lang === "hinglish" ? "Step-by-Step Samjho" : "Step-by-Step Breakdown"}
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {copy.steps.map((s) => (
                        <div key={s.heading} className="p-3.5 rounded-lg bg-ivory border border-ink/20 space-y-1">
                          <p className="text-xs font-bold text-terracotta">{s.heading}</p>
                          <p className="text-xs text-ink leading-relaxed">{s.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Worked Example */}
                  <div className="p-4 rounded-xl bg-[#F4EAD5] border border-ink/20 space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                      {copy.exampleTitle}
                    </h4>
                    <p className="text-sm font-serif text-ink leading-relaxed">{copy.exampleBody}</p>
                  </div>

                  {/* Symbols Key */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      {lang === "hinglish" ? "Symbols Ka Matlab (No Confusion)" : "Symbol Decoder"}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {doc.keySymbols.map((sym) => (
                        <div
                          key={sym.sym}
                          className="p-2.5 rounded-lg bg-ivory border border-ink/20 flex items-center gap-2.5 text-xs"
                        >
                          <span className="px-2 py-1 rounded bg-parchment border border-ink/25 font-mono font-bold text-terracotta">
                            {sym.sym}
                          </span>
                          <span className="text-ink">
                            {lang === "hinglish" ? sym.meaningHi : sym.meaningEn}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mistake & Exam Shortcut */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-terracotta/10 border border-terracotta/30 space-y-1">
                      <p className="text-xs font-bold text-terracotta flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {lang === "hinglish" ? "Yeh Galti Mat Karna" : "Common Mistake to Avoid"}
                      </p>
                      <p className="text-xs text-ink leading-relaxed">{copy.mistakeToAvoid}</p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-forest/10 border border-forest/30 space-y-1">
                      <p className="text-xs font-bold text-forest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {lang === "hinglish" ? "Exam Yaad Rakhne Ki Trick" : "Exam Shortcut"}
                      </p>
                      <p className="text-xs text-ink leading-relaxed">{copy.shortcut}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </JournalShell>
  );
}
