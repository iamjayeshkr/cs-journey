"use client";

import React, { useState } from "react";

export type DiagramDomain =
  | "discrete"
  | "csa"
  | "programming"
  | "dbms"
  | "os"
  | "se"
  | "dsa"
  | "toc"
  | "cn"
  | "ai";

export function resolveDiagramDomain(unitTitle: string): DiagramDomain {
  const u = unitTitle.toLowerCase();
  if (u.includes("discrete")) return "discrete";
  if (u.includes("computer system")) return "csa";
  if (u.includes("programming")) return "programming";
  if (u.includes("database")) return "dbms";
  if (u.includes("operating")) return "os";
  if (u.includes("software")) return "se";
  if (u.includes("data structure")) return "dsa";
  if (u.includes("theory of computation")) return "toc";
  if (u.includes("communication") || u.includes("network")) return "cn";
  if (u.includes("artificial")) return "ai";
  return "dsa";
}

export function TextbookDiagram({
  domain,
  topicTitle,
}: {
  domain: DiagramDomain;
  topicTitle: string;
}) {
  const [highlight, setHighlight] = useState(0);

  if (domain === "discrete") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-serif text-sm font-bold text-ink">
            Figure 1.1 — Truth-Table &amp; Set Inclusion Model ({topicTitle})
          </h4>
          <span className="text-[11px] font-mono text-ink-muted">P → Q ≡ ¬P ∨ Q</span>
        </div>
        <svg viewBox="0 0 640 200" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          {/* Venn Diagram */}
          <rect x="20" y="18" width="260" height="164" rx="8" fill="#F5EBD8" stroke="#493426" strokeWidth="1.5" />
          <text x="32" y="36" fontSize="11" fontWeight="bold" fill="#493426">Universal Set U</text>
          <circle cx="125" cy="105" r="52" fill="rgba(113, 133, 104, 0.25)" stroke="#493426" strokeWidth="1.5" />
          <circle cx="180" cy="105" r="52" fill="rgba(189, 128, 104, 0.25)" stroke="#493426" strokeWidth="1.5" />
          <text x="95" y="108" fontSize="12" fontWeight="bold" fill="#493426">A</text>
          <text x="148" y="108" fontSize="11" fontWeight="bold" fill="#493426">A∩B</text>
          <text x="205" y="108" fontSize="12" fontWeight="bold" fill="#493426">B</text>
          <text x="72" y="172" fontSize="10" fill="#5A4636">|A ∪ B| = |A| + |B| − |A ∩ B|</text>

          {/* Truth Table */}
          <rect x="305" y="18" width="315" height="164" rx="8" fill="#FFFDF7" stroke="#493426" strokeWidth="1.5" />
          <line x1="305" y1="48" x2="620" y2="48" stroke="#493426" strokeWidth="1.2" />
          <text x="330" y="37" fontSize="11" fontWeight="bold" fill="#493426">P</text>
          <text x="385" y="37" fontSize="11" fontWeight="bold" fill="#493426">Q</text>
          <text x="440" y="37" fontSize="11" fontWeight="bold" fill="#BD8068">P → Q</text>
          <text x="515" y="37" fontSize="11" fontWeight="bold" fill="#718568">¬Q → ¬P</text>
          {[
            ["T", "T", "T", "T"],
            ["T", "F", "F", "F"],
            ["F", "T", "T", "T"],
            ["F", "F", "T", "T"],
          ].map((row, idx) => (
            <g key={idx} transform={`translate(0, ${idx * 30})`}>
              <rect
                x="306"
                y="50"
                width="313"
                height="28"
                fill={idx === 1 ? "rgba(189, 128, 104, 0.18)" : "transparent"}
              />
              <text x="330" y="68" fontSize="11" fill="#493426">{row[0]}</text>
              <text x="385" y="68" fontSize="11" fill="#493426">{row[1]}</text>
              <text x="452" y="68" fontSize="11" fontWeight="bold" fill={row[2] === "F" ? "#B8523E" : "#493426"}>{row[2]}</text>
              <text x="535" y="68" fontSize="11" fontWeight="bold" fill={row[3] === "F" ? "#B8523E" : "#493426"}>{row[3]}</text>
            </g>
          ))}
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> Left: Inclusion-Exclusion prevents double-counting elements in the overlap region{" "}
          <code>A ∩ B</code>. Right: Implication <code>P → Q</code> and its contrapositive <code>¬Q → ¬P</code> produce identical truth values across all 4 rows, failing only when <code>P = T</code> and <code>Q = F</code>.
        </p>
      </div>
    );
  }

  if (domain === "csa") {
    const stages = ["IF (Fetch)", "ID (Decode)", "EX (Execute)", "MEM (Access)", "WB (Writeback)"];
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-serif text-sm font-bold text-ink">
            Figure 2.1 — 5-Stage Instruction Pipeline &amp; Memory Hierarchy ({topicTitle})
          </h4>
          <button
            type="button"
            onClick={() => setHighlight((h) => (h + 1) % stages.length)}
            className="parchment-btn px-2.5 py-1 rounded text-[11px] font-semibold"
          >
            Advance Clock Cycle →
          </button>
        </div>
        <svg viewBox="0 0 640 190" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          {stages.map((st, idx) => {
            const x = 22 + idx * 122;
            const active = highlight === idx;
            return (
              <g key={st}>
                <rect
                  x={x}
                  y="32"
                  width="102"
                  height="54"
                  rx="6"
                  fill={active ? "#718568" : "#F5EBD8"}
                  stroke="#493426"
                  strokeWidth={active ? "2.2" : "1.4"}
                />
                <text
                  x={x + 51}
                  y="63"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={active ? "#FFFDF7" : "#493426"}
                >
                  {st}
                </text>
                {idx < stages.length - 1 && (
                  <line x1={x + 102} y1="59" x2={x + 122} y2="59" stroke="#493426" strokeWidth="2" markerEnd="url(#arrow)" />
                )}
              </g>
            );
          })}
          {/* Memory Hierarchy Bars */}
          <text x="24" y="114" fontSize="11" fontWeight="bold" fill="#493426">Memory Hierarchy (Fastest &amp; Smallest → Slowest &amp; Largest):</text>
          <rect x="24" y="126" width="110" height="36" rx="4" fill="#BD8068" stroke="#493426" />
          <text x="79" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFDF7">Registers (~1ns)</text>
          <rect x="144" y="126" width="130" height="36" rx="4" fill="#D5AE65" stroke="#493426" />
          <text x="209" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">L1/L2 Cache (~4ns)</text>
          <rect x="284" y="126" width="150" height="36" rx="4" fill="#91AFC0" stroke="#493426" />
          <text x="359" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">Main RAM (~60ns)</text>
          <rect x="444" y="126" width="172" height="36" rx="4" fill="#EAD9BA" stroke="#493426" />
          <text x="530" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">SSD / Disk (ms)</text>
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> Inter-stage pipeline registers isolate each hardware stage so 5 instructions execute concurrently at different stages. Below, the memory hierarchy illustrates the locality-of-reference trade-off between access latency and capacity.
        </p>
      </div>
    );
  }

  if (domain === "dsa" || domain === "programming") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          Figure 3.1 — Node Pointer Linkage &amp; Binary Search Tree Structure ({topicTitle})
        </h4>
        <svg viewBox="0 0 640 195" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          {/* Linked List */}
          <text x="20" y="26" fontSize="11" fontWeight="bold" fill="#493426">Singly Linked List (Non-contiguous Heap Nodes):</text>
          {[
            { val: "10", addr: "0x1A", x: 24 },
            { val: "25", addr: "0x4F", x: 140 },
            { val: "42", addr: "NULL", x: 256 },
          ].map((n, idx) => (
            <g key={n.val}>
              <rect x={n.x} y="38" width="84" height="38" rx="5" fill="#FFFDF7" stroke="#493426" strokeWidth="1.5" />
              <line x1={n.x + 44} y1="38" x2={n.x + 44} y2="76" stroke="#493426" strokeWidth="1.2" />
              <text x={n.x + 22} y="61" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#493426">{n.val}</text>
              <text x={n.x + 64} y="60" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#718568">{n.addr}</text>
              {idx < 2 && <line x1={n.x + 84} y1="57" x2={n.x + 116} y2="57" stroke="#BD8068" strokeWidth="2" />}
            </g>
          ))}
          {/* BST */}
          <text x="415" y="26" fontSize="11" fontWeight="bold" fill="#493426">BST Invariant (Left &lt; Root &lt; Right):</text>
          <line x1="515" y1="58" x2="465" y2="108" stroke="#493426" strokeWidth="1.6" />
          <line x1="515" y1="58" x2="565" y2="108" stroke="#493426" strokeWidth="1.6" />
          <line x1="465" y1="108" x2="438" y2="154" stroke="#493426" strokeWidth="1.4" />
          <line x1="465" y1="108" x2="492" y2="154" stroke="#493426" strokeWidth="1.4" />
          {[
            { x: 515, y: 58, v: "50", fill: "#718568", tc: "#FFFDF7" },
            { x: 465, y: 108, v: "30", fill: "#F5EBD8", tc: "#493426" },
            { x: 565, y: 108, v: "70", fill: "#F5EBD8", tc: "#493426" },
            { x: 438, y: 154, v: "20", fill: "#FFFDF7", tc: "#493426" },
            { x: 492, y: 154, v: "40", fill: "#FFFDF7", tc: "#493426" },
          ].map((node) => (
            <g key={node.v}>
              <circle cx={node.x} cy={node.y} r="16" fill={node.fill} stroke="#493426" strokeWidth="1.5" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={node.tc}>{node.v}</text>
            </g>
          ))}
          <rect x="24" y="106" width="335" height="62" rx="6" fill="#F5EBD8" stroke="#493426" strokeWidth="1.2" />
          <text x="36" y="128" fontSize="11" fontWeight="bold" fill="#493426">Stack Frame vs Heap Allocation</text>
          <text x="36" y="148" fontSize="10" fill="#5A4636">• Stack: LIFO local variables &amp; return addresses (automatic pop)</text>
          <text x="36" y="162" fontSize="10" fill="#5A4636">• Heap: Dynamic nodes linked via explicit memory references</text>
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> Each linked-list node stores payload data and the memory address of its successor, allowing <code>O(1)</code> structural re-linking without shifting contiguous elements. In a BST, every comparison halves the search space when balanced (<code>O(log n)</code>).
        </p>
      </div>
    );
  }

  if (domain === "dbms") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          Figure 4.1 — Relational Schema Decomposition &amp; B+ Tree Leaf Chaining ({topicTitle})
        </h4>
        <svg viewBox="0 0 640 190" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          <rect x="20" y="24" width="275" height="64" rx="6" fill="#FFFDF7" stroke="#493426" strokeWidth="1.5" />
          <text x="32" y="44" fontSize="11" fontWeight="bold" fill="#BD8068">R1 (Student): [RollNo PK, Name, DeptID FK]</text>
          <text x="32" y="64" fontSize="10" fill="#493426">Functional Dependency: RollNo → Name, DeptID</text>

          <rect x="20" y="106" width="275" height="64" rx="6" fill="#FFFDF7" stroke="#493426" strokeWidth="1.5" />
          <text x="32" y="126" fontSize="11" fontWeight="bold" fill="#718568">R2 (Department): [DeptID PK, HOD, Building]</text>
          <text x="32" y="146" fontSize="10" fill="#493426">Lossless Join: (R1 ∩ R2) = DeptID → R2</text>

          {/* B+ Tree */}
          <text x="330" y="28" fontSize="11" fontWeight="bold" fill="#493426">B+ Tree Index (Data Pointers Only in Leaves):</text>
          <rect x="435" y="42" width="80" height="28" rx="4" fill="#D5AE65" stroke="#493426" />
          <text x="475" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#493426">Key: 30</text>
          <line x1="455" y1="70" x2="390" y2="112" stroke="#493426" strokeWidth="1.5" />
          <line x1="495" y1="70" x2="555" y2="112" stroke="#493426" strokeWidth="1.5" />
          <rect x="330" y="112" width="120" height="36" rx="4" fill="#FFFDF7" stroke="#493426" />
          <text x="390" y="134" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">[10 | 20] →</text>
          <rect x="490" y="112" width="125" height="36" rx="4" fill="#FFFDF7" stroke="#493426" />
          <text x="552" y="134" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">[30 | 40 | 50]</text>
          <line x1="450" y1="130" x2="490" y2="130" stroke="#BD8068" strokeWidth="2" />
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> Decomposing transitive dependencies into <code>R1</code> and <code>R2</code> eliminates update anomalies while preserving lossless join via <code>DeptID</code>. In a B+ Tree, linked leaf nodes enable sequential range scans without re-traversing the root.
        </p>
      </div>
    );
  }

  if (domain === "os") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          Figure 5.1 — Process State Transition Diagram ({topicTitle})
        </h4>
        <svg viewBox="0 0 640 185" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          {[
            { x: 30, y: 72, w: 85, label: "New", fill: "#EAD9BA" },
            { x: 165, y: 72, w: 95, label: "Ready", fill: "#91AFC0" },
            { x: 325, y: 72, w: 105, label: "Running", fill: "#718568", tc: "#FFFDF7" },
            { x: 495, y: 72, w: 115, label: "Terminated", fill: "#BD8068", tc: "#FFFDF7" },
            { x: 325, y: 138, w: 105, label: "Waiting / I/O", fill: "#D5AE65" },
          ].map((s) => (
            <g key={s.label}>
              <rect x={s.x} y={s.y} width={s.w} height="36" rx="18" fill={s.fill} stroke="#493426" strokeWidth="1.5" />
              <text x={s.x + s.w / 2} y={s.y + 22} textAnchor="middle" fontSize="11" fontWeight="bold" fill={s.tc || "#493426"}>
                {s.label}
              </text>
            </g>
          ))}
          <line x1="115" y1="90" x2="165" y2="90" stroke="#493426" strokeWidth="1.6" />
          <line x1="260" y1="84" x2="325" y2="84" stroke="#493426" strokeWidth="1.6" />
          <text x="292" y="78" textAnchor="middle" fontSize="9" fill="#493426">Dispatch</text>
          <line x1="325" y1="98" x2="260" y2="98" stroke="#BD8068" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="292" y="112" textAnchor="middle" fontSize="9" fill="#BD8068">Preempt</text>
          <line x1="430" y1="90" x2="495" y2="90" stroke="#493426" strokeWidth="1.6" />
          <line x1="377" y1="108" x2="377" y2="138" stroke="#493426" strokeWidth="1.5" />
          <line x1="325" y1="156" x2="212" y2="108" stroke="#493426" strokeWidth="1.4" />
          <text x="242" y="148" textAnchor="middle" fontSize="9" fill="#493426">I/O Complete</text>
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> The short-term scheduler dispatches a process from <strong>Ready</strong> to <strong>Running</strong>. Time-quantum expiration preempts it back to <strong>Ready</strong>, whereas blocking system calls move it to <strong>Waiting</strong> until I/O completion.
        </p>
      </div>
    );
  }

  if (domain === "toc") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          Figure 8.1 — Deterministic Finite Automaton (DFA) Accepting Strings Ending in &ldquo;ab&rdquo;
        </h4>
        <svg viewBox="0 0 640 170" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          <line x1="40" y1="85" x2="90" y2="85" stroke="#493426" strokeWidth="2" />
          <circle cx="120" cy="85" r="26" fill="#FFFDF7" stroke="#493426" strokeWidth="1.8" />
          <text x="120" y="89" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#493426">q₀</text>

          <line x1="146" y1="85" x2="254" y2="85" stroke="#493426" strokeWidth="1.8" />
          <text x="200" y="76" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#BD8068">a</text>

          <circle cx="280" cy="85" r="26" fill="#FFFDF7" stroke="#493426" strokeWidth="1.8" />
          <text x="280" y="89" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#493426">q₁</text>

          <line x1="306" y1="85" x2="414" y2="85" stroke="#493426" strokeWidth="1.8" />
          <text x="360" y="76" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#718568">b</text>

          <circle cx="445" cy="85" r="28" fill="#718568" stroke="#493426" strokeWidth="2" />
          <circle cx="445" cy="85" r="22" fill="none" stroke="#FFFDF7" strokeWidth="1.5" />
          <text x="445" y="89" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FFFDF7">q₂</text>

          <text x="510" y="65" fontSize="10" fontWeight="bold" fill="#493426">5-Tuple: (Q, Σ, δ, q₀, F)</text>
          <text x="510" y="84" fontSize="10" fill="#5A4636">Q = &#123;q₀, q₁, q₂&#125;</text>
          <text x="510" y="100" fontSize="10" fill="#5A4636">Σ = &#123;a, b&#125;</text>
          <text x="510" y="116" fontSize="10" fill="#5A4636">F = &#123;q₂&#125;</text>
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> Each state encodes suffix progress: <code>q₀</code> (start), <code>q₁</code> (last symbol was <code>a</code>), and accepting state <code>q₂</code> (double circle, last two symbols were <code>ab</code>). Every state defines exactly one transition per symbol in <code>Σ</code>.
        </p>
      </div>
    );
  }

  if (domain === "cn") {
    return (
      <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
        <h4 className="font-serif text-sm font-bold text-ink">
          Figure 9.1 — TCP 3-Way Handshake &amp; OSI Encapsulation ({topicTitle})
        </h4>
        <svg viewBox="0 0 640 180" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
          <rect x="65" y="18" width="90" height="28" rx="4" fill="#91AFC0" stroke="#493426" />
          <text x="110" y="36" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#493426">Client</text>
          <rect x="265" y="18" width="90" height="28" rx="4" fill="#718568" stroke="#493426" />
          <text x="310" y="36" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FFFDF7">Server</text>
          <line x1="110" y1="46" x2="110" y2="165" stroke="#493426" strokeWidth="1.5" />
          <line x1="310" y1="46" x2="310" y2="165" stroke="#493426" strokeWidth="1.5" />

          <line x1="110" y1="62" x2="310" y2="88" stroke="#BD8068" strokeWidth="2" />
          <text x="210" y="68" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#BD8068">1. SYN (seq = x)</text>

          <line x1="310" y1="96" x2="110" y2="122" stroke="#718568" strokeWidth="2" />
          <text x="210" y="102" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#718568">2. SYN-ACK (seq = y, ack = x+1)</text>

          <line x1="110" y1="130" x2="310" y2="156" stroke="#493426" strokeWidth="2" />
          <text x="210" y="136" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">3. ACK (ack = y+1)</text>

          {/* Encapsulation */}
          <rect x="405" y="24" width="210" height="136" rx="6" fill="#FFFDF7" stroke="#493426" />
          <text x="510" y="44" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#493426">Packet Encapsulation</text>
          <text x="420" y="68" fontSize="10" fill="#493426">L7–L5: Application Data</text>
          <text x="420" y="90" fontSize="10" fill="#493426">L4: [TCP Header | Segment]</text>
          <text x="420" y="112" fontSize="10" fill="#493426">L3: [IP Header | Packet]</text>
          <text x="420" y="134" fontSize="10" fill="#493426">L2: [MAC Frame | FCS/CRC]</text>
        </svg>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Diagram Explanation:</strong> The TCP 3-way handshake synchronizes initial sequence numbers (<code>x</code> and <code>y</code>) in both directions before data transfer. On the right, each layer prepends its protocol header down the stack.
        </p>
      </div>
    );
  }

  // Default / SE / AI
  return (
    <div className="p-4 rounded-xl bg-ivory border border-ink/25 space-y-3">
      <h4 className="font-serif text-sm font-bold text-ink">
        Figure {domain === "se" ? "6.1 — Control Flow Graph V(G)" : "10.1 — Heuristic Search Tree f(n) = g(n) + h(n)"} ({topicTitle})
      </h4>
      <svg viewBox="0 0 640 175" className="w-full h-auto bg-[#FBF6EA] rounded-lg border border-ink/15">
        <line x1="320" y1="40" x2="210" y2="105" stroke="#493426" strokeWidth="1.6" />
        <line x1="320" y1="40" x2="430" y2="105" stroke="#718568" strokeWidth="2.4" />
        <circle cx="320" cy="40" r="22" fill="#EAD9BA" stroke="#493426" strokeWidth="1.6" />
        <text x="320" y="44" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">Start</text>

        <circle cx="210" cy="105" r="26" fill="#FFFDF7" stroke="#493426" strokeWidth="1.5" />
        <text x="210" y="109" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#493426">
          {domain === "se" ? "Branch F" : "f = 4+5 = 9"}
        </text>

        <circle cx="430" cy="105" r="26" fill="#718568" stroke="#493426" strokeWidth="1.8" />
        <text x="430" y="109" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFDF7">
          {domain === "se" ? "Branch T" : "f = 6+2 = 8"}
        </text>
        <text x="320" y="156" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#493426">
          {domain === "se"
            ? "V(G) = E − N + 2 = P + 1 (Independent Linear Paths)"
            : "Optimal Selection: Pick minimum f(n) = g(n) + h(n) when h(n) ≤ h*(n)"}
        </text>
      </svg>
      <p className="text-xs text-ink-muted leading-relaxed">
        <strong>Diagram Explanation:</strong>{" "}
        {domain === "se"
          ? "Each predicate node splits execution into two control-flow edges, establishing the minimum number of test cases required for 100% branch coverage."
          : "A* evaluates total estimated path cost f(n) = g(n) + h(n), expanding the lowest-cost frontier node first while guaranteeing optimality under an admissible heuristic."}
      </p>
    </div>
  );
}
