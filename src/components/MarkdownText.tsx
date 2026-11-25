"use client";

import React from "react";
import { CodeBlock } from "@/components/CodeBlock";

/**
 * Renders inline markdown tokens: **bold**, *italic*, and `inline code`.
 */
export function InlineMarkdown({ text }: { text: string }) {
  const tokens: React.ReactNode[] = [];
  // Match `code`, **bold**, or *italic*
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      tokens.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-parchment/90 border border-ink/20 font-mono text-[0.85em] text-terracotta font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong key={keyIdx++} className="font-bold text-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      tokens.push(
        <em key={keyIdx++} className="italic text-ink">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return <>{tokens}</>;
}

/**
 * Renders full Markdown blocks cleanly (headings, lists, blockquotes,
 * fenced code blocks, and rich paragraphs) for lesson sections.
 */
export function MarkdownText({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  if (!content) return null;

  // Split out fenced code blocks first
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 ${className}`}>
      {segments.map((seg, sIdx) => {
        if (seg.startsWith("```") && seg.endsWith("```")) {
          const inner = seg.slice(3, -3).replace(/^\w*\n/, "");
          return <CodeBlock key={sIdx} code={inner.trim()} />;
        }

        // Split remaining text into blocks by blank lines
        const blocks = seg
          .split(/\n{2,}/)
          .map((b) => b.trim())
          .filter(Boolean);

        return blocks.map((block, bIdx) => {
          const lines = block.split("\n").map((l) => l.trimEnd());

          // Heading
          const headingMatch = lines[0]?.match(/^(#{1,3})\s+(.+)$/);
          if (headingMatch && lines.length === 1) {
            const level = headingMatch[1].length;
            const title = headingMatch[2];
            if (level === 1) {
              return (
                <h3 key={`${sIdx}-${bIdx}`} className="font-hand text-2xl font-bold text-ink pt-1">
                  <InlineMarkdown text={title} />
                </h3>
              );
            }
            return (
              <h4 key={`${sIdx}-${bIdx}`} className="font-serif text-base font-bold text-terracotta pt-1">
                <InlineMarkdown text={title} />
              </h4>
            );
          }

          // Blockquote
          if (lines.every((l) => l.trimStart().startsWith(">"))) {
            const quoteText = lines.map((l) => l.replace(/^\s*>\s?/, "")).join(" ");
            return (
              <blockquote
                key={`${sIdx}-${bIdx}`}
                className="pl-3.5 border-l-4 border-terracotta/70 bg-parchment/40 py-2 pr-3 rounded-r font-serif text-sm italic text-ink"
              >
                <InlineMarkdown text={quoteText} />
              </blockquote>
            );
          }

          // Unordered list
          if (lines.every((l) => /^[-*•]\s+/.test(l.trimStart()))) {
            return (
              <ul key={`${sIdx}-${bIdx}`} className="list-disc pl-5 space-y-1.5 font-serif text-sm sm:text-base text-ink">
                {lines.map((l, lIdx) => (
                  <li key={lIdx} className="leading-relaxed">
                    <InlineMarkdown text={l.trimStart().replace(/^[-*•]\s+/, "")} />
                  </li>
                ))}
              </ul>
            );
          }

          // Ordered list
          if (lines.every((l) => /^\d+[.)]\s+/.test(l.trimStart()))) {
            return (
              <ol key={`${sIdx}-${bIdx}`} className="list-decimal pl-5 space-y-1.5 font-serif text-sm sm:text-base text-ink">
                {lines.map((l, lIdx) => (
                  <li key={lIdx} className="leading-relaxed">
                    <InlineMarkdown text={l.trimStart().replace(/^\d+[.)]\s+/, "")} />
                  </li>
                ))}
              </ol>
            );
          }

          // Regular paragraph (render single linebreaks nicely)
          return (
            <p key={`${sIdx}-${bIdx}`} className="font-serif text-sm sm:text-base leading-relaxed text-ink">
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  <InlineMarkdown text={line} />
                </React.Fragment>
              ))}
            </p>
          );
        });
      })}
    </div>
  );
}
