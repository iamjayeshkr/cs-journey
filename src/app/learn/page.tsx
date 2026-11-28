"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FlaskConical,
  GraduationCap,
  Languages,
  Layers,
  ListChecks,
  Search,
  Sparkles,
  Swords,
} from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { KingdomIllustration } from "@/components/IllustratedAssets";
import { resolveDiagramDomain, TextbookDiagram } from "@/components/TextbookDiagrams";
import { getTextbookChapter, LearnLang } from "@/lib/learn-docs";

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

interface RevisionTopicMeta {
  concept_id: string;
  revision_summary: string;
  formal_definition: string;
}

type DocTab = "notes" | "illustrations" | "examples" | "practice" | "flashcards" | "more";

const DOC_TABS: { id: DocTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "illustrations", label: "Illustrations", icon: Compass },
  { id: "examples", label: "Examples", icon: FlaskConical },
  { id: "practice", label: "Practice", icon: Swords },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "more", label: "More", icon: ListChecks },
];

export default function LearnDocsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kingdoms, setKingdoms] = useState<KingdomItem[]>([]);
  const [metaMap, setMetaMap] = useState<Record<string, RevisionTopicMeta>>({});
  const [selectedUnitSlug, setSelectedUnitSlug] = useState<string | null>(null);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DocTab>("notes");
  const [lang, setLang] = useState<LearnLang>("en");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/kingdoms").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
    ])
      .then(([me, kRes, revRes]) => {
        setUser(me.user ?? null);
        setKingdoms(kRes.kingdoms ?? []);
        const map: Record<string, RevisionTopicMeta> = {};
        for (const fc of revRes.flashcards ?? []) {
          map[fc.concept_id] = {
            concept_id: fc.concept_id,
            revision_summary: fc.revision_summary,
            formal_definition: fc.formal_definition,
          };
        }
        setMetaMap(map);
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

  const chapter = useMemo(() => {
    if (!activeUnit || !activeTopic) return null;
    const meta = metaMap[activeTopic.id];
    return getTextbookChapter(
      activeUnit.title,
      activeTopic.title,
      lang,
      meta?.revision_summary,
      meta?.formal_definition
    );
  }, [activeUnit, activeTopic, lang, metaMap]);

  const diagramDomain = activeUnit ? resolveDiagramDomain(activeUnit.title) : "dsa";

  return (
    <JournalShell user={user}>
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-hand text-4xl font-bold flex items-center gap-2 text-ink">
              <GraduationCap className="w-8 h-8 text-terracotta" /> Learn — CS Textbook &amp; Docs
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Structured Computer Science textbook across all 10 units and 90 official topics — with precision diagrams, derivations, and solved examples.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-ivory border border-ink/25 rounded-full p-1 shadow-sm">
            <Languages className="w-4 h-4 text-terracotta ml-2" />
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "en" ? "bg-ink text-ivory" : "text-ink-muted hover:text-ink"
              }`}
            >
              Textbook English
            </button>
            <button
              type="button"
              onClick={() => setLang("hinglish")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "hinglish" ? "bg-terracotta text-ivory" : "text-ink-muted hover:text-ink"
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* Search Across All 90 Topics */}
        {!activeUnit && (
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
                      setActiveTab("notes");
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
        )}

        {loading ? (
          <div className="journal-card p-8 text-center text-sm text-ink-muted">
            Loading 10 units and 90 textbook chapters...
          </div>
        ) : !activeUnit ? (
          /* VIEW 1: ALL 10 UNIT MODULES */
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
                    setActiveTab("notes");
                    setSelectedPracticeOption(null);
                    setFlippedCardIdx(null);
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
                    <span className="text-ink-muted">Textbook • Diagrams • Examples</span>
                    <span className="text-forest">Open Unit →</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: STILL-SCREEN SPLIT-PANE TEXTBOOK READER (Only inner panes scroll) */
          <div className="space-y-3">
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

            <div className="grid lg:grid-cols-12 gap-4 lg:h-[calc(100vh-14.5rem)]">
              {/* LEFT PANE: Fixed Numbered Topic List (01 .. 09) */}
              <div className="lg:col-span-4 journal-card p-4 flex flex-col overflow-hidden">
                <h3 className="font-hand text-2xl font-bold text-ink px-1 pb-2 border-b border-ink/15 shrink-0">
                  Unit {activeUnit.order_index} Topics ({unitTopics.length})
                </h3>
                <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
                  {unitTopics.map((topic, idx) => {
                    const isSelected = activeTopic?.id === topic.id;
                    const done = (topic.mastery?.mastery_score ?? 0) >= 80;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          setSelectedConceptSlug(topic.slug);
                          setSelectedPracticeOption(null);
                          setFlippedCardIdx(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-[#FFF3D1] border-terracotta text-ink font-bold shadow-sm"
                            : "bg-ivory border-ink/15 text-ink hover:bg-parchment/70"
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono text-ink-muted mr-1.5">
                            {String(idx + 1).padStart(2, "0")}.
                          </span>
                          {topic.title}
                        </span>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT PANE: Independently Scrollable Textbook Reader */}
              {activeTopic && chapter && (
                <div className="lg:col-span-8 journal-card flex flex-col overflow-hidden">
                  {/* Sticky Reader Header + 6 Section Tabs */}
                  <div className="p-4 sm:p-5 border-b border-ink/15 bg-[#F8EFE0] shrink-0 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                            {activeUnit.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment border border-ink/15 text-ink-muted">
                            Topic {String(unitTopics.findIndex((t) => t.id === activeTopic.id) + 1).padStart(2, "0")} / {String(unitTopics.length).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="font-hand text-3xl font-bold text-ink leading-tight">
                          {activeTopic.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={unitTopics.findIndex((t) => t.id === activeTopic.id) <= 0}
                          onClick={() => {
                            const idx = unitTopics.findIndex((t) => t.id === activeTopic.id);
                            if (idx > 0) {
                              setSelectedConceptSlug(unitTopics[idx - 1].slug);
                              setSelectedPracticeOption(null);
                              setFlippedCardIdx(null);
                            }
                          }}
                          className="parchment-btn px-2.5 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                          title="Previous topic in unit"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Prev
                        </button>
                        <button
                          type="button"
                          disabled={unitTopics.findIndex((t) => t.id === activeTopic.id) >= unitTopics.length - 1}
                          onClick={() => {
                            const idx = unitTopics.findIndex((t) => t.id === activeTopic.id);
                            if (idx >= 0 && idx < unitTopics.length - 1) {
                              setSelectedConceptSlug(unitTopics[idx + 1].slug);
                              setSelectedPracticeOption(null);
                              setFlippedCardIdx(null);
                            }
                          }}
                          className="parchment-btn px-2.5 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-40"
                          title="Next topic in unit"
                        >
                          Next <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/concepts/${activeTopic.slug}`}
                          className="terracotta-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                        >
                          <Swords className="w-3.5 h-3.5" /> Interactive Stage →
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {DOC_TABS.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveTab(t.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                              activeTab === t.id ? "ink-btn" : "parchment-btn"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scrollable Textbook Content Body */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {activeTab === "notes" && (
                      <>
                        <section className="space-y-2">
                          <h3 className="font-serif text-base font-bold text-terracotta uppercase tracking-wider">
                            1. Introduction &amp; Formal Definition
                          </h3>
                          <p className="font-serif text-sm sm:text-base leading-relaxed text-ink">
                            {chapter.introduction}
                          </p>
                          <div className="p-4 rounded-lg bg-ivory border-l-4 border-forest font-serif text-sm leading-relaxed text-ink">
                            <strong>Formal Definition:</strong> {chapter.definition}
                          </div>
                        </section>

                        <section className="space-y-2">
                          <h3 className="font-serif text-base font-bold text-terracotta uppercase tracking-wider">
                            2. Fundamental Principles &amp; Working Mechanism
                          </h3>
                          <ul className="list-disc pl-5 space-y-1.5 font-serif text-sm text-ink">
                            {chapter.principles.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                          <div className="grid sm:grid-cols-3 gap-3 pt-2">
                            {chapter.workingMechanism.map((step, i) => (
                              <div key={i} className="p-3 rounded-lg bg-ivory border border-ink/20 text-xs leading-relaxed">
                                <span className="font-bold text-forest block mb-1">Phase {i + 1}</span>
                                {step}
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-2">
                          <h3 className="font-serif text-base font-bold text-terracotta uppercase tracking-wider">
                            3. Important Terminology
                          </h3>
                          <div className="grid sm:grid-cols-3 gap-2.5">
                            {chapter.terminology.map((t) => (
                              <div key={t.term} className="p-3 rounded-lg bg-[#FAF4E8] border border-ink/15 text-xs space-y-1">
                                <p className="font-bold text-ink">{t.term}</p>
                                <p className="text-ink-muted leading-snug">{t.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-2">
                          <h3 className="font-serif text-base font-bold text-terracotta uppercase tracking-wider">
                            4. Mathematical Formulation &amp; Derivation
                          </h3>
                          <div className="p-4 rounded-lg bg-ivory border border-ink/20 space-y-3">
                            <p className="font-mono text-sm font-bold text-ink bg-parchment/70 p-2.5 rounded border border-ink/15">
                              {chapter.derivation.formula}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs">
                              {chapter.derivation.variables.map((v) => (
                                <div key={v.sym} className="flex items-start gap-2">
                                  <code className="px-1.5 py-0.5 rounded bg-parchment font-mono font-bold text-terracotta shrink-0">
                                    {v.sym}
                                  </code>
                                  <span className="text-ink-muted">{v.desc}</span>
                                </div>
                              ))}
                            </div>
                            <ol className="list-decimal pl-5 space-y-1 text-xs font-serif text-ink">
                              {chapter.derivation.steps.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ol>
                            <div className="p-3 rounded bg-forest/10 border border-forest/30 text-xs">
                              <strong>Worked Numerical:</strong> {chapter.derivation.numericalExample}
                            </div>
                            <div className="p-3 rounded bg-terracotta/10 border border-terracotta/30 text-xs">
                              <strong>Calculation Pitfall:</strong> {chapter.derivation.calculationMistake}
                            </div>
                          </div>
                        </section>

                        <section className="space-y-2">
                          <h3 className="font-serif text-base font-bold text-terracotta uppercase tracking-wider">
                            5. Comparison &amp; Examination Points
                          </h3>
                          <div className="overflow-x-auto rounded-lg border border-ink/20">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-parchment font-bold">
                                <tr>
                                  <th className="p-2.5 border-b border-ink/15">Dimension</th>
                                  <th className="p-2.5 border-b border-ink/15">{chapter.comparison.heading.split(" vs ")[0]}</th>
                                  <th className="p-2.5 border-b border-ink/15">{chapter.comparison.heading.split(" vs ")[1] || "Alternative"}</th>
                                </tr>
                              </thead>
                              <tbody className="bg-ivory divide-y divide-ink/10">
                                {chapter.comparison.rows.map((r) => (
                                  <tr key={r.feature}>
                                    <td className="p-2.5 font-semibold">{r.feature}</td>
                                    <td className="p-2.5">{r.primary}</td>
                                    <td className="p-2.5 text-ink-muted">{r.related}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-4 rounded-lg bg-[#FFF8E2] border border-[#D5AE65] space-y-1.5 text-xs">
                            <p className="font-bold text-ink flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-terracotta" /> UGC NET / JRF Examination Points
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-ink">
                              {chapter.examPoints.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        </section>

                        <section className="p-4 rounded-lg bg-parchment/60 border border-ink/20 text-xs font-serif leading-relaxed text-ink">
                          <strong>Chapter Summary:</strong> {chapter.summary}
                        </section>
                      </>
                    )}

                    {activeTab === "illustrations" && (
                      <div className="space-y-4">
                        <TextbookDiagram domain={diagramDomain} topicTitle={activeTopic.title} />
                        <div className="p-4 rounded-lg bg-ivory border border-ink/20 space-y-2 text-xs">
                          <h4 className="font-bold text-ink">Key Properties Illustrated</h4>
                          <ul className="list-disc pl-4 space-y-1 text-ink-muted">
                            {chapter.properties.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "examples" && (
                      <div className="space-y-4">
                        {chapter.examples.map((ex, i) => (
                          <div key={i} className="p-4 rounded-xl bg-ivory border border-ink/20 space-y-2.5">
                            <h4 className="font-serif text-base font-bold text-terracotta">{ex.title}</h4>
                            <p className="text-xs font-semibold text-ink">{ex.problem}</p>
                            <ol className="list-decimal pl-5 space-y-1 text-xs font-serif text-ink-muted">
                              {ex.steps.map((s, si) => (
                                <li key={si}>{s}</li>
                              ))}
                            </ol>
                            <div className="p-2.5 rounded bg-forest/15 border border-forest/30 text-xs font-semibold text-ink">
                              Result: {ex.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "practice" && (
                      <div className="space-y-4">
                        {chapter.practiceQuestions.map((pq, qi) => (
                          <div key={qi} className="p-4 rounded-xl bg-ivory border border-ink/20 space-y-3">
                            <p className="font-serif text-sm font-bold text-ink">{pq.question}</p>
                            <div className="space-y-2">
                              {pq.options.map((opt, oi) => {
                                const picked = selectedPracticeOption === oi;
                                const isRight = oi === pq.correctIndex;
                                return (
                                  <button
                                    key={oi}
                                    type="button"
                                    onClick={() => setSelectedPracticeOption(oi)}
                                    className={`w-full text-left p-3 rounded-lg border text-xs transition ${
                                      selectedPracticeOption === null
                                        ? "bg-[#FAF4E8] border-ink/20 hover:bg-parchment"
                                        : isRight
                                        ? "bg-forest/20 border-forest font-semibold"
                                        : picked
                                        ? "bg-terracotta/20 border-terracotta"
                                        : "bg-[#FAF4E8] border-ink/15 opacity-75"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oi)}. {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {selectedPracticeOption !== null && (
                              <div className="p-3 rounded bg-parchment/70 border border-ink/15 text-xs text-ink">
                                {pq.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex justify-end">
                          <Link
                            href="/practice"
                            className="terracotta-btn px-4 py-2 rounded text-xs font-semibold"
                          >
                            Open Full 10,000+ MCQ Arena →
                          </Link>
                        </div>
                      </div>
                    )}

                    {activeTab === "flashcards" && (
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-3 gap-3">
                          {chapter.flashcards.map((fc, idx) => {
                            const isFlipped = flippedCardIdx === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFlippedCardIdx(isFlipped ? null : idx)}
                                className={`p-4 rounded-xl border-2 text-left min-h-[140px] flex flex-col justify-between transition ${
                                  isFlipped
                                    ? "bg-[#FAF4E8] border-forest"
                                    : "bg-ivory border-ink/25 hover:border-terracotta"
                                }`}
                              >
                                <span className="text-[10px] font-bold uppercase text-terracotta">
                                  {isFlipped ? "Answer" : "Tap to Flip"}
                                </span>
                                <p className="font-serif text-xs font-semibold text-ink leading-relaxed">
                                  {isFlipped ? fc.back : fc.front}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-end">
                          <Link href="/vault" className="forest-btn px-4 py-2 rounded text-xs font-semibold">
                            Open 520 Flashcards for this Topic →
                          </Link>
                        </div>
                      </div>
                    )}

                    {activeTab === "more" && (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="p-4 rounded-lg bg-forest/10 border border-forest/30 space-y-1.5 text-xs">
                            <p className="font-bold text-forest">Advantages</p>
                            <ul className="list-disc pl-4 space-y-1 text-ink">
                              {chapter.advantages.map((a, i) => (
                                <li key={i}>{a}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-terracotta/10 border border-terracotta/30 space-y-1.5 text-xs">
                            <p className="font-bold text-terracotta flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Limitations &amp; Misconceptions
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-ink">
                              {chapter.limitations.map((l, i) => (
                                <li key={i}>{l}</li>
                              ))}
                              {chapter.misconceptions.map((m, i) => (
                                <li key={`m-${i}`}>
                                  <strong>Myth:</strong> {m.myth} — <strong>Fact:</strong> {m.reality}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-ivory border border-ink/20 text-xs space-y-2">
                          <p className="font-bold text-ink">Related Topics</p>
                          <div className="flex flex-wrap gap-2">
                            {chapter.relatedTopics.map((rt) => (
                              <span key={rt} className="px-2.5 py-1 rounded bg-parchment border border-ink/15 font-semibold">
                                {rt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
