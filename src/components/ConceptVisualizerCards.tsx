"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Play, RotateCcw } from "lucide-react";

/* 1. LINKED LIST INTERACTIVE VISUAL DIAGRAM */
function LinkedListVisual() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Initial Railway Chain", nodes: [{ v: 10, addr: "0x104" }, { v: 20, addr: "0x208" }, { v: 30, addr: "0x312" }], hl: -1, note: "head points to 0x104. Node 30's next is NULL." },
    { label: "Step 1: Allocate Node 5", nodes: [{ v: 5, addr: "0x090" }, { v: 10, addr: "0x104" }, { v: 20, addr: "0x208" }, { v: 30, addr: "0x312" }], hl: 0, note: "Create newNode(5) at 0x090. Point 5.next = head (0x104)." },
    { label: "Step 2: Move head = 0x090", nodes: [{ v: 5, addr: "0x090" }, { v: 10, addr: "0x104" }, { v: 20, addr: "0x208" }, { v: 30, addr: "0x312" }], hl: 0, note: "head now points to 0x090. O(1) insertion complete!" },
  ];
  const cur = steps[step];

  return (
    <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase text-terracotta">Interactive Pointer & Memory Diagram</span>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <button key={i} type="button" onClick={() => setStep(i)} className={`px-2.5 py-1 rounded text-[11px] font-semibold ${step === i ? "ink-btn" : "parchment-btn"}`}>
              {i === 0 ? "Start" : `Step ${i}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-3 px-2 bg-[#FAF4E8] rounded border border-ink/20">
        <span className="px-2 py-1 rounded bg-ink text-ivory text-[11px] font-mono font-bold shrink-0">head</span>
        <ArrowRight className="w-4 h-4 shrink-0 text-ink" />
        {cur.nodes.map((n, i) => (
          <React.Fragment key={n.addr}>
            <div className={`rounded border-2 px-3 py-1.5 text-center shrink-0 transition-all ${cur.hl === i ? "bg-[#F7E396] border-terracotta scale-105" : "bg-ivory border-ink"}`}>
              <span className="block text-[9px] font-mono text-ink-muted">{n.addr}</span>
              <span className="font-mono font-bold text-sm">{n.v}</span>
              <span className="block text-[10px] font-mono text-terracotta">
                {i < cur.nodes.length - 1 ? `→ ${cur.nodes[i + 1].addr}` : "→ NULL"}
              </span>
            </div>
            {i < cur.nodes.length - 1 && <ArrowRight className="w-4 h-4 shrink-0 text-ink" />}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs font-medium text-ink">{cur.note}</p>
    </div>
  );
}

/* 2. PIPELINE WATERFALL VISUAL */
function PipelineVisual() {
  const [cycle, setCycle] = useState(5);
  const stages = ["IF", "ID", "EX", "MEM", "WB"];
  return (
    <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-terracotta">5-Stage Pipeline Overlap (Cycle {cycle})</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setCycle((c) => Math.max(1, c - 1))} className="parchment-btn px-2.5 py-1 rounded text-xs font-semibold">−1</button>
          <button type="button" onClick={() => setCycle((c) => Math.min(7, c + 1))} className="ink-btn px-2.5 py-1 rounded text-xs font-semibold">+1 Cycle</button>
        </div>
      </div>
      <div className="overflow-x-auto bg-[#FAF4E8] p-3 rounded border border-ink/20">
        <table className="w-full text-[11px] font-mono text-center border-collapse">
          <thead>
            <tr className="border-b border-ink/20">
              <th className="text-left py-1">Instr</th>
              {[1, 2, 3, 4, 5, 6, 7].map((t) => (
                <th key={t} className={t === cycle ? "text-terracotta font-bold" : ""}>T{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((inst) => (
              <tr key={inst} className="border-b border-ink/10">
                <td className="text-left font-bold py-1.5">I{inst + 1}</td>
                {[1, 2, 3, 4, 5, 6, 7].map((t) => {
                  const sIdx = t - 1 - inst;
                  const active = t <= cycle && sIdx >= 0 && sIdx < 5;
                  return (
                    <td key={t} className="p-1">
                      {active ? (
                        <span className={`px-1.5 py-0.5 rounded font-bold ${t === cycle ? "bg-terracotta text-ivory" : "bg-forest/25 text-ink"}`}>
                          {stages[sIdx]}
                        </span>
                      ) : (
                        <span className="text-ink/25">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 3. DFA STATE DIAGRAM VISUAL */
function DfaVisual() {
  const [state, setState] = useState<"q0" | "q1" | "q2">("q0");
  const [history, setHistory] = useState("");
  const feed = (bit: "0" | "1") => {
    setHistory((h) => h + bit);
    setState((s) => (s === "q0" ? (bit === "0" ? "q1" : "q0") : s === "q1" ? (bit === "0" ? "q1" : "q2") : bit === "0" ? "q1" : "q0"));
  };
  return (
    <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase text-terracotta">Interactive DFA State Hopping (Ends in &ldquo;01&rdquo;)</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => feed("0")} className="ink-btn px-3 py-1 rounded text-xs font-mono font-bold">Feed 0</button>
          <button type="button" onClick={() => feed("1")} className="forest-btn px-3 py-1 rounded text-xs font-mono font-bold">Feed 1</button>
          <button type="button" onClick={() => { setState("q0"); setHistory(""); }} className="parchment-btn px-2.5 py-1 rounded text-xs"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-4 bg-[#FAF4E8] rounded border border-ink/20">
        {(["q0", "q1", "q2"] as const).map((q, i) => (
          <React.Fragment key={q}>
            <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold transition-all ${state === q ? "bg-[#F7E396] border-terracotta scale-110 shadow" : "bg-ivory border-ink"} ${q === "q2" ? "ring-2 ring-offset-2 ring-forest" : ""}`}>
              <span className="text-sm">{q}</span>
              <span className="text-[9px] text-ink-muted">{q === "q2" ? "ACCEPT" : q === "q0" ? "START" : "saw 0"}</span>
            </div>
            {i < 2 && <span className="text-xs font-mono font-bold text-ink-muted">──{i === 0 ? "0" : "1"}──▶</span>}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs font-mono">Input so far: <strong>{history || "ε (empty)"}</strong> • Current State: <strong>{state}</strong></p>
    </div>
  );
}

/* 4. TCP CONGESTION SAWTOOTH VISUAL */
function TcpSawtoothVisual() {
  const [event, setEvent] = useState<"normal" | "dup3" | "timeout">("normal");
  return (
    <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase text-terracotta">TCP Reno Congestion Window (cwnd) Visual</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setEvent("normal")} className={`px-2.5 py-1 rounded text-xs font-semibold ${event === "normal" ? "forest-btn" : "parchment-btn"}`}>Growth</button>
          <button type="button" onClick={() => setEvent("dup3")} className={`px-2.5 py-1 rounded text-xs font-semibold ${event === "dup3" ? "ink-btn" : "parchment-btn"}`}>3 Dup ACKs</button>
          <button type="button" onClick={() => setEvent("timeout")} className={`px-2.5 py-1 rounded text-xs font-semibold ${event === "timeout" ? "terracotta-btn" : "parchment-btn"}`}>Timeout</button>
        </div>
      </div>
      <div className="bg-[#FAF4E8] p-3 rounded border border-ink/20">
        <svg viewBox="0 0 360 110" className="w-full h-28">
          <line x1="25" y1="92" x2="345" y2="92" stroke="#493426" strokeWidth="1.5" />
          <line x1="25" y1="10" x2="25" y2="92" stroke="#493426" strokeWidth="1.5" />
          <line x1="25" y1="52" x2="345" y2="52" stroke="#BD8068" strokeDasharray="4 4" strokeWidth="1.2" />
          <text x="270" y="48" fontSize="9" fill="#BD8068" fontWeight="700">ssthresh</text>
          {event === "normal" && (
            <polyline points="25,86 55,80 85,68 115,52 165,42 215,32 265,22" fill="none" stroke="#718568" strokeWidth="3" />
          )}
          {event === "dup3" && (
            <polyline points="25,86 85,68 115,52 215,22 215,56 290,42" fill="none" stroke="#493426" strokeWidth="3" />
          )}
          {event === "timeout" && (
            <polyline points="25,86 85,68 115,52 215,22 215,88 265,70 305,52" fill="none" stroke="#BD8068" strokeWidth="3" />
          )}
        </svg>
        <p className="text-xs font-medium mt-1">
          {event === "normal"
            ? "Slow Start doubles cwnd per RTT until ssthresh, then Congestion Avoidance grows linearly (+1 MSS/RTT)."
            : event === "dup3"
            ? "3 Duplicate ACKs: Mild loss! ssthresh = cwnd/2 and cwnd drops only to ssthresh (Fast Recovery)."
            : "Timeout: Severe congestion! ssthresh = cwnd/2 and cwnd resets all the way to 1 MSS."}
        </p>
      </div>
    </div>
  );
}

/* 5. GENERIC INTERACTIVE CONCEPT DIAGRAM & STEP WALKTHROUGH */
export function ConceptVisualizerCards({
  slug,
  examples,
}: {
  slug: string;
  examples: Array<{ title: string; problem: string; walkthrough: string }>;
}) {
  const [revealedSteps, setRevealedSteps] = useState<Record<number, number>>({});

  const renderDiagram = () => {
    if (slug.includes("linked-list")) return <LinkedListVisual />;
    if (slug.includes("pipelining")) return <PipelineVisual />;
    if (slug.includes("automata") || slug.includes("dfa")) return <DfaVisual />;
    if (slug.includes("tcp")) return <TcpSawtoothVisual />;
    if (slug.includes("logic")) {
      return (
        <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-2">
          <span className="text-xs font-bold uppercase text-terracotta">Implication Equivalence Visual</span>
          <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono bg-[#FAF4E8] p-3 rounded border border-ink/20">
            <div className="p-2 rounded bg-forest/15 border border-forest">P → Q ≡ ¬P ∨ Q (Original Promise)</div>
            <div className="p-2 rounded bg-forest/15 border border-forest">¬Q → ¬P (Contrapositive — Always Equivalent!)</div>
            <div className="p-2 rounded bg-terracotta/15 border border-terracotta">Q → P (Converse — NOT Equivalent)</div>
            <div className="p-2 rounded bg-terracotta/15 border border-terracotta">¬P → ¬Q (Inverse — NOT Equivalent)</div>
          </div>
        </div>
      );
    }
    if (slug.includes("sql") || slug.includes("normalization")) {
      return (
        <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-2">
          <span className="text-xs font-bold uppercase text-terracotta">SQL Execution Pipeline</span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono bg-[#FAF4E8] p-3 rounded border border-ink/20">
            {["1. FROM", "2. WHERE", "3. GROUP BY", "4. HAVING", "5. SELECT", "6. ORDER BY"].map((s, i) => (
              <React.Fragment key={s}>
                <span className="px-2 py-1 rounded bg-parchment border border-ink/25 font-bold">{s}</span>
                {i < 5 && <span>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/25 space-y-2">
        <span className="text-xs font-bold uppercase text-terracotta">Concept Flow Map</span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold bg-[#FAF4E8] p-3 rounded border border-ink/20">
          <span className="px-2.5 py-1 rounded bg-parchment border border-ink/25">Intuition</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-forest/20 border border-forest">Core Mechanism</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-[#F7E396] border border-ink/25">Edge Cases</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-terracotta/20 border border-terracotta">UGC NET Application</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {renderDiagram()}

      {/* Interactive Step-by-Step Visual Worked Example Cards */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase text-ink-muted">Interactive Step-by-Step Walkthrough Cards</span>
        {examples.map((ex, idx) => {
          const lines = ex.walkthrough.split("\n").filter(Boolean);
          const shown = revealedSteps[idx] ?? lines.length;
          return (
            <div key={idx} className="p-4 rounded-md bg-ivory border-2 border-ink/20 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-hand text-2xl font-bold leading-none">{ex.title}</h3>
                  <p className="text-xs text-terracotta font-semibold mt-1">{ex.problem}</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRevealedSteps((p) => ({ ...p, [idx]: 1 }))}
                    className="parchment-btn px-2.5 py-1 rounded text-[11px] font-semibold"
                  >
                    Step Mode
                  </button>
                  {shown < lines.length && (
                    <button
                      type="button"
                      onClick={() => setRevealedSteps((p) => ({ ...p, [idx]: shown + 1 }))}
                      className="forest-btn px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Next Step
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                {lines.slice(0, shown).map((line, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2 p-2 rounded bg-[#FAF4E8] border border-ink/15 text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
