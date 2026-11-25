"use client";

import React, { useState } from "react";
import { Play, Plus, RotateCcw, Trash2, ArrowRightLeft, Search } from "lucide-react";

/* 1. LINKED LIST RAILWAY SIMULATOR */
export function LinkedListSimulator() {
  const [nodes, setNodes] = useState<number[]>([10, 20, 30, 40]);
  const [inputVal, setInputVal] = useState("25");
  const [position, setPosition] = useState<"head" | "end" | "after20">("end");
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [log, setLog] = useState<string>("Ready: head → [10] → [20] → [30] → [40] → NULL");

  function handleInsert() {
    const val = Number(inputVal);
    if (!Number.isFinite(val)) return;
    if (position === "head") {
      setNodes((prev) => [val, ...prev]);
      setHighlightIdx(0);
      setLog(`Inserted ${val} at head in O(1): newNode.next = head; head = newNode.`);
    } else if (position === "end") {
      setNodes((prev) => {
        setHighlightIdx(prev.length);
        return [...prev, val];
      });
      setLog(`Traversed to tail in O(n) and linked tail.next = ${val}.`);
    } else {
      const idx = nodes.indexOf(20);
      if (idx === -1) {
        setNodes((prev) => [...prev, val]);
        setLog(`20 not found; appended ${val} at end.`);
      } else {
        const copy = [...nodes];
        copy.splice(idx + 1, 0, val);
        setNodes(copy);
        setHighlightIdx(idx + 1);
        setLog(`Inserted ${val} after 20: newNode.next = node20.next; node20.next = newNode.`);
      }
    }
  }

  function handleDelete() {
    const val = Number(inputVal);
    const idx = nodes.indexOf(val);
    if (idx === -1) {
      setLog(`Value ${val} not found in list.`);
      return;
    }
    setNodes((prev) => prev.filter((_, i) => i !== idx));
    setHighlightIdx(null);
    setLog(`Deleted ${val}: bypassed node by updating previous.next.`);
  }

  function handleSearch() {
    const val = Number(inputVal);
    const idx = nodes.indexOf(val);
    setHighlightIdx(idx >= 0 ? idx : null);
    setLog(idx >= 0 ? `Found ${val} at station index ${idx} after ${idx + 1} hops.` : `${val} not found (reached NULL).`);
  }

  function handleReverse() {
    setNodes((prev) => [...prev].reverse());
    setHighlightIdx(null);
    setLog("Reversed list in-place in O(n) time, O(1) space using (prev, curr, next) pointers!");
  }

  return (
    <div className="journal-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-hand text-2xl font-bold">Interactive Railway Linked List Lab</h3>
        <button
          type="button"
          onClick={() => {
            setNodes([10, 20, 30, 40]);
            setHighlightIdx(null);
            setLog("Reset to [10 → 20 → 30 → 40 → NULL].");
          }}
          className="parchment-btn px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Visual Track */}
      <div className="p-4 rounded-md bg-[#F2E6CF] border border-ink/20 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max py-2">
          <span className="px-2.5 py-1 rounded bg-ink text-ivory text-xs font-mono font-bold">head</span>
          <span className="text-ink font-bold">→</span>
          {nodes.length === 0 ? (
            <span className="px-3 py-1.5 rounded bg-parchment border border-ink/25 font-mono text-xs">NULL</span>
          ) : (
            nodes.map((val, idx) => (
              <React.Fragment key={`${idx}-${val}`}>
                <div
                  className={`flex items-center rounded border-2 transition-all ${
                    highlightIdx === idx
                      ? "bg-[#F7E396] border-terracotta scale-105"
                      : "bg-[#FAF4E8] border-ink"
                  }`}
                >
                  <div className="px-3 py-2 font-mono font-bold text-sm border-r border-ink/30">{val}</div>
                  <div className="px-2 py-2 text-[11px] font-mono text-terracotta">next</div>
                </div>
                <span className="text-ink font-bold">→</span>
              </React.Fragment>
            ))
          )}
          {nodes.length > 0 && (
            <span className="px-2.5 py-1 rounded bg-parchment border border-ink/25 font-mono text-xs font-bold">
              NULL
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-24 px-2.5 py-1.5 text-sm font-mono rounded bg-ivory border border-ink/25"
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as "head" | "end" | "after20")}
          className="px-2.5 py-1.5 text-xs rounded bg-ivory border border-ink/25"
        >
          <option value="head">At Head O(1)</option>
          <option value="end">At End O(n)</option>
          <option value="after20">After 20</option>
        </select>
        <button type="button" onClick={handleInsert} className="forest-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Insert
        </button>
        <button type="button" onClick={handleDelete} className="terracotta-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
        <button type="button" onClick={handleSearch} className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1">
          <Search className="w-3.5 h-3.5" /> Search
        </button>
        <button type="button" onClick={handleReverse} className="ink-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1">
          <ArrowRightLeft className="w-3.5 h-3.5" /> Reverse
        </button>
      </div>

      <p className="text-xs font-mono bg-parchment/70 p-2.5 rounded border border-ink/15">{log}</p>
    </div>
  );
}

/* 2. CPU SCHEDULING SIMULATOR */
export function CpuSchedulingSimulator() {
  const [algo, setAlgo] = useState<"FCFS" | "SJF" | "RR">("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [procs] = useState([
    { id: "P1", at: 0, bt: 6 },
    { id: "P2", at: 1, bt: 3 },
    { id: "P3", at: 2, bt: 4 },
  ]);

  const gantt: Array<{ id: string; start: number; end: number }> = [];
  const metrics: Record<string, { ct: number; tat: number; wt: number }> = {};

  if (algo === "FCFS") {
    let t = 0;
    for (const p of procs) {
      if (t < p.at) t = p.at;
      gantt.push({ id: p.id, start: t, end: t + p.bt });
      t += p.bt;
      metrics[p.id] = { ct: t, tat: t - p.at, wt: t - p.at - p.bt };
    }
  } else if (algo === "SJF") {
    const rem = procs.map((p) => ({ ...p, done: false }));
    let t = 0;
    while (rem.some((p) => !p.done)) {
      const avail = rem.filter((p) => !p.done && p.at <= t).sort((a, b) => a.bt - b.bt);
      if (avail.length === 0) {
        t++;
        continue;
      }
      const p = avail[0];
      p.done = true;
      gantt.push({ id: p.id, start: t, end: t + p.bt });
      t += p.bt;
      metrics[p.id] = { ct: t, tat: t - p.at, wt: t - p.at - p.bt };
    }
  } else {
    const rem = procs.map((p) => ({ ...p, left: p.bt }));
    let t = 0;
    const q = Math.max(1, quantum);
    let safety = 0;
    while (rem.some((p) => p.left > 0) && safety < 100) {
      safety++;
      let progressed = false;
      for (const p of rem) {
        if (p.left > 0 && p.at <= t) {
          progressed = true;
          const run = Math.min(q, p.left);
          gantt.push({ id: p.id, start: t, end: t + run });
          t += run;
          p.left -= run;
          if (p.left === 0) {
            metrics[p.id] = { ct: t, tat: t - p.at, wt: t - p.at - p.bt };
          }
        }
      }
      if (!progressed) t++;
    }
  }

  const avgWt = (
    Object.values(metrics).reduce((acc, m) => acc + m.wt, 0) / Math.max(procs.length, 1)
  ).toFixed(2);

  return (
    <div className="journal-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-hand text-2xl font-bold">CPU Scheduler & Gantt Chart Lab</h3>
        <div className="flex items-center gap-2">
          {(["FCFS", "SJF", "RR"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlgo(a)}
              className={`px-3 py-1 rounded text-xs font-semibold ${algo === a ? "ink-btn" : "parchment-btn"}`}
            >
              {a}
            </button>
          ))}
          {algo === "RR" && (
            <label className="text-xs flex items-center gap-1">
              q=
              <input
                type="number"
                min={1}
                max={6}
                value={quantum}
                onChange={(e) => setQuantum(Number(e.target.value))}
                className="w-12 px-1.5 py-0.5 rounded bg-ivory border border-ink/25 font-mono"
              />
            </label>
          )}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="p-3 rounded bg-[#F2E6CF] border border-ink/20">
        <p className="text-xs font-semibold mb-2">Gantt Timeline</p>
        <div className="flex items-stretch overflow-x-auto">
          {gantt.map((g, i) => (
            <div
              key={i}
              style={{ flexGrow: g.end - g.start }}
              className="min-w-[52px] border border-ink bg-[#FAF4E8] p-2 text-center"
            >
              <span className="font-mono text-xs font-bold block">{g.id}</span>
              <span className="text-[10px] text-ink-muted">
                {g.start}–{g.end}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-ink/20 text-left">
              <th className="py-1.5">Process</th>
              <th>AT</th>
              <th>BT</th>
              <th>CT</th>
              <th>TAT</th>
              <th>WT</th>
            </tr>
          </thead>
          <tbody>
            {procs.map((p) => (
              <tr key={p.id} className="border-b border-ink/10 font-mono">
                <td className="py-1.5 font-bold">{p.id}</td>
                <td>{p.at}</td>
                <td>{p.bt}</td>
                <td>{metrics[p.id]?.ct ?? "-"}</td>
                <td>{metrics[p.id]?.tat ?? "-"}</td>
                <td>{metrics[p.id]?.wt ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs font-semibold text-forest">Average Waiting Time: {avgWt} ms</p>
    </div>
  );
}

/* 3. SQL PLAYGROUND SIMULATOR */
export function SqlPlaygroundSimulator() {
  const rows = [
    { id: 1, name: "Rudra", kingdom: "DSA", score: 88 },
    { id: 2, name: "Ananya", kingdom: "DBMS", score: 94 },
    { id: 3, name: "Kabir", kingdom: "DSA", score: 72 },
    { id: 4, name: "Meera", kingdom: "OS", score: 91 },
  ];
  const [preset, setPreset] = useState<"all" | "high" | "group">("all");

  return (
    <div className="journal-card p-5 space-y-4">
      <h3 className="font-hand text-2xl font-bold">Interactive SQL & Relational Algebra Vault</h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPreset("all")}
          className={`px-3 py-1.5 rounded text-xs font-mono ${preset === "all" ? "ink-btn" : "parchment-btn"}`}
        >
          SELECT * FROM Mastery;
        </button>
        <button
          type="button"
          onClick={() => setPreset("high")}
          className={`px-3 py-1.5 rounded text-xs font-mono ${preset === "high" ? "ink-btn" : "parchment-btn"}`}
        >
          σ score ≥ 85 (WHERE score &gt;= 85)
        </button>
        <button
          type="button"
          onClick={() => setPreset("group")}
          className={`px-3 py-1.5 rounded text-xs font-mono ${preset === "group" ? "ink-btn" : "parchment-btn"}`}
        >
          GROUP BY kingdom HAVING AVG(score) &gt; 80
        </button>
      </div>

      <div className="overflow-x-auto bg-ivory border border-ink/20 rounded p-3">
        {preset === "group" ? (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-1">kingdom</th>
                <th>AVG(score)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1">DBMS</td><td>94.0</td></tr>
              <tr><td className="py-1">OS</td><td>91.0</td></tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-1">id</th>
                <th>name</th>
                <th>kingdom</th>
                <th>score</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((r) => (preset === "high" ? r.score >= 85 : true))
                .map((r) => (
                  <tr key={r.id} className="border-b border-ink/10">
                    <td className="py-1">{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.kingdom}</td>
                    <td>{r.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* 4. DFA AUTOMATA SIMULATOR */
export function DfaSimulator() {
  const [tape, setTape] = useState("10101");
  // DFA accepting binary strings ending with "01"
  let state: "q0" | "q1" | "q2" = "q0";
  const trace: string[] = ["q0"];
  for (const ch of tape) {
    if (ch !== "0" && ch !== "1") continue;
    if (state === "q0") state = ch === "0" ? "q1" : "q0";
    else if (state === "q1") state = ch === "0" ? "q1" : "q2";
    else state = ch === "0" ? "q1" : "q0";
    trace.push(state);
  }
  const accepted = state === "q2";

  return (
    <div className="journal-card p-5 space-y-4">
      <h3 className="font-hand text-2xl font-bold">DFA Tape Simulator (Strings ending in &ldquo;01&rdquo;)</h3>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={tape}
          onChange={(e) => setTape(e.target.value.replace(/[^01]/g, ""))}
          placeholder="Enter 0s and 1s"
          className="px-3 py-1.5 rounded bg-ivory border border-ink/25 font-mono text-sm"
        />
        <span
          className={`px-3 py-1 rounded text-xs font-bold ${
            accepted ? "bg-forest text-ivory" : "bg-terracotta text-ivory"
          }`}
        >
          {accepted ? "ACCEPTED (q2 ∈ F)" : `REJECTED (ended at ${state})`}
        </span>
      </div>
      <p className="text-xs font-mono bg-parchment/70 p-2.5 rounded border border-ink/15">
        State Trace: {trace.join(" → ")}
      </p>
    </div>
  );
}

/* 5. SORTING ARENA SIMULATOR */
export function SortingArenaSimulator() {
  const [arr, setArr] = useState([38, 12, 45, 7, 29, 19]);
  const [stepMsg, setStepMsg] = useState("Click 'Step Bubble Pass' or 'QuickSort' to observe.");

  function bubblePass() {
    const copy = [...arr];
    let swapped = false;
    for (let i = 0; i < copy.length - 1; i++) {
      if (copy[i] > copy[i + 1]) {
        [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
        swapped = true;
      }
    }
    setArr(copy);
    setStepMsg(swapped ? "Performed one O(n) pass bubbling largest element rightward." : "Array is completely sorted!");
  }

  return (
    <div className="journal-card p-5 space-y-4">
      <h3 className="font-hand text-2xl font-bold">Sorting Bar Visualizer</h3>
      <div className="flex items-end gap-3 h-36 p-4 bg-[#F2E6CF] rounded border border-ink/20">
        {arr.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className="w-full bg-forest rounded-t border border-ink transition-all"
              style={{ height: `${(v / 50) * 100}%` }}
            />
            <span className="text-xs font-mono font-bold mt-1">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={bubblePass} className="ink-btn px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1">
          <Play className="w-3.5 h-3.5" /> Step Pass
        </button>
        <button
          type="button"
          onClick={() => {
            setArr([...arr].sort((a, b) => a - b));
            setStepMsg("Sorted in O(n log n)!");
          }}
          className="forest-btn px-3 py-1.5 rounded text-xs font-semibold"
        >
          Instant O(n log n) Sort
        </button>
        <button
          type="button"
          onClick={() => {
            setArr([38, 12, 45, 7, 29, 19]);
            setStepMsg("Reset array.");
          }}
          className="parchment-btn px-3 py-1.5 rounded text-xs font-semibold"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-ink-muted">{stepMsg}</p>
    </div>
  );
}

/* 6. LOGIC GATE SIMULATOR */
export function LogicGateSimulator() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);

  return (
    <div className="journal-card p-5 space-y-4">
      <h3 className="font-hand text-2xl font-bold">Truth Gate & Implication Lab</h3>
      <div className="flex gap-3">
        <button type="button" onClick={() => setP(!p)} className={`px-4 py-2 rounded text-xs font-mono font-bold ${p ? "forest-btn" : "parchment-btn"}`}>
          P = {p ? "TRUE (1)" : "FALSE (0)"}
        </button>
        <button type="button" onClick={() => setQ(!q)} className={`px-4 py-2 rounded text-xs font-mono font-bold ${q ? "forest-btn" : "parchment-btn"}`}>
          Q = {q ? "TRUE (1)" : "FALSE (0)"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-ivory border border-ink/20">P ∧ Q = {String(p && q)}</div>
        <div className="p-2.5 rounded bg-ivory border border-ink/20">P ∨ Q = {String(p || q)}</div>
        <div className="p-2.5 rounded bg-ivory border border-ink/20">P → Q = {String(!p || q)}</div>
        <div className="p-2.5 rounded bg-ivory border border-ink/20">¬Q → ¬P = {String(q || !p)}</div>
      </div>
    </div>
  );
}

export function ConceptSimulatorRouter({ type }: { type: string }) {
  switch (type) {
    case "linked_list":
      return <LinkedListSimulator />;
    case "cpu_scheduling":
      return <CpuSchedulingSimulator />;
    case "sql_playground":
      return <SqlPlaygroundSimulator />;
    case "automata_dfa":
      return <DfaSimulator />;
    case "sorting_arena":
      return <SortingArenaSimulator />;
    case "logic_gates":
      return <LogicGateSimulator />;
    default:
      return (
        <div className="journal-parchment p-5 text-sm">
          <p className="font-hand text-2xl font-bold mb-1">Interactive Thought Experiment</p>
          <p className="text-ink-muted">
            Trace the worked examples above in your notes, then test your understanding in the Practice & Challenge stages below!
          </p>
        </div>
      );
  }
}
