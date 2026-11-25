"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS = new Set([
  "function", "return", "while", "for", "if", "else", "in", "and", "or", "not",
  "SELECT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER", "JOIN", "ON", "NULL",
  "true", "false", "new", "var", "let", "const", "int", "class", "virtual", "all",
]);

export function CodeBlock({ code, title = "Pseudocode / Implementation" }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const lines = code.split("\n");

  function copyCode() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function renderTokens(line: string) {
    const commentIdx = line.indexOf("//");
    const mainPart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
    const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : "";

    const tokens = mainPart.split(/(\s+|[(){}[\].,:;=<>\+\-\*\/]+|"[^"]*"|'[^']*')/g).filter(Boolean);

    return (
      <>
        {tokens.map((tok, i) => {
          if (KEYWORDS.has(tok)) {
            return (
              <span key={i} className="text-[#E6A85C] font-bold">
                {tok}
              </span>
            );
          }
          if (/^["'].*["']$/.test(tok)) {
            return (
              <span key={i} className="text-[#9EC48B]">
                {tok}
              </span>
            );
          }
          if (/^\d+$/.test(tok)) {
            return (
              <span key={i} className="text-[#91AFC0] font-semibold">
                {tok}
              </span>
            );
          }
          if (/^[A-Za-z_]\w*(?=\()/.test(tok)) {
            return (
              <span key={i} className="text-[#7CC5D9] font-semibold">
                {tok}
              </span>
            );
          }
          return <span key={i}>{tok}</span>;
        })}
        {commentPart && <span className="text-[#A89984] italic">{commentPart}</span>}
      </>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border-2 border-ink/30 shadow-sm bg-[#241B14] text-[#F5EBD8]">
      <div className="px-3.5 py-2 bg-[#33261D] border-b border-[#493426] flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold text-[#D5AE65]">{title}</span>
        <button
          type="button"
          onClick={copyCode}
          className="text-[11px] text-[#EAD9BA] hover:text-white inline-flex items-center gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#9EC48B]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-xs leading-6">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-[#765E4D] select-none w-5 text-right shrink-0">{idx + 1}</span>
            <span className="whitespace-pre">{renderTokens(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
