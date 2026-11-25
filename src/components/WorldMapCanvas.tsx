"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, ArrowRight, CheckCircle2 } from "lucide-react";

export interface MapKingdom {
  id: string;
  order_index: number;
  slug: string;
  title: string;
  subtitle: string;
  theme_color: string;
  map_x: number;
  map_y: number;
  progress_pct: number;
  concepts_total?: number;
  concepts_mastered?: number;
}

export function WorldMapCanvas({ kingdoms }: { kingdoms: MapKingdom[] }) {
  const [selected, setSelected] = useState<MapKingdom | null>(kingdoms[6] || kingdoms[0] || null);

  return (
    <div className="journal-card p-4 sm:p-6 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-hand text-3xl font-bold text-ink leading-none">
            The 10 Kingdoms of Computer Science
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Click any kingdom landmark on the parchment map to enter its chapters, visualizers, and Boss Challenge.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md bg-parchment border border-ink/25">
          <Compass className="w-4 h-4 text-terracotta" />
          <span>Target: UGC NET & JRF Summit</span>
        </div>
      </div>

      {/* Illustrated SVG Parchment Map */}
      <div className="relative w-full aspect-[16/10] min-h-[340px] rounded-lg border-2 border-ink/30 bg-[#EFE2C6] overflow-hidden shadow-inner">
        <svg viewBox="0 0 1000 620" className="w-full h-full select-none" aria-label="Illustrated World Map of The CS Journey">
          <defs>
            <radialGradient id="parchmentGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#F7EEDB" />
              <stop offset="100%" stopColor="#E4CFA9" />
            </radialGradient>
            <pattern id="gridDots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="#493426" opacity="0.08" />
            </pattern>
          </defs>

          {/* Base Parchment & Terrain */}
          <rect width="1000" height="620" fill="url(#parchmentGlow)" />
          <rect width="1000" height="620" fill="url(#gridDots)" />

          {/* Hand-drawn Coastline / River */}
          <path
            d="M 40 430 Q 220 390, 350 470 T 680 460 T 960 400"
            fill="none"
            stroke="#91AFC0"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M 40 430 Q 220 390, 350 470 T 680 460 T 960 400"
            fill="none"
            stroke="#493426"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.3"
          />

          {/* Decorative Mountain Ranges */}
          <g opacity="0.35" stroke="#493426" strokeWidth="2" fill="#D9C39E">
            <polygon points="440,360 500,255 560,360" />
            <polygon points="485,360 535,280 585,360" />
            <polygon points="410,360 460,290 510,360" />
          </g>

          {/* Central JRF Summit Banner */}
          <g transform="translate(500, 330)">
            <circle r="54" fill="#FAF4E8" stroke="#493426" strokeWidth="2.5" strokeDasharray="5 3" />
            <text y="-8" textAnchor="middle" className="font-hand" fill="#493426" fontSize="22" fontWeight="700">
              UGC NET
            </text>
            <text y="14" textAnchor="middle" fill="#BD8068" fontSize="14" fontWeight="700">
              JRF SUMMIT
            </text>
          </g>

          {/* Compass Rose */}
          <g transform="translate(90, 82)" opacity="0.75">
            <circle r="28" fill="#FAF4E8" stroke="#493426" strokeWidth="1.5" />
            <path d="M0,-24 L6,-6 L24,0 L6,6 L0,24 L-6,6 L-24,0 L-6,-6 Z" fill="#D5AE65" stroke="#493426" strokeWidth="1.2" />
            <text y="-32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#493426">N</text>
          </g>

          {/* Winding Quest Trail connecting kingdoms 1..10 */}
          <polyline
            points={kingdoms.map((k) => `${k.map_x * 10},${k.map_y * 6}`).join(" ")}
            fill="none"
            stroke="#493426"
            strokeWidth="3"
            strokeDasharray="8 7"
            opacity="0.45"
          />

          {/* Interactive Kingdom Landmarks */}
          {kingdoms.map((k) => {
            const cx = k.map_x * 10;
            const cy = k.map_y * 6;
            const isSelected = selected?.id === k.id;
            return (
              <g
                key={k.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => setSelected(k)}
                className="cursor-pointer group"
              >
                {/* Selection Halo */}
                {isSelected && (
                  <circle r="40" fill="none" stroke="#BD8068" strokeWidth="3" strokeDasharray="5 4" />
                )}

                {/* Illustrated Landmark Medallion */}
                <circle
                  r="30"
                  fill="#FAF4E8"
                  stroke="#493426"
                  strokeWidth={isSelected ? "3" : "2"}
                />
                <circle r="23" fill={k.theme_color} opacity="0.35" />

                {/* Unit Number */}
                <text
                  y="-4"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#493426"
                >
                  {k.order_index}
                </text>
                <text
                  y="13"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#493426"
                >
                  {k.progress_pct}%
                </text>

                {/* Parchment Label Pill */}
                <g transform="translate(0, 44)">
                  <rect
                    x="-76"
                    y="-12"
                    width="152"
                    height="24"
                    rx="4"
                    fill={isSelected ? "#493426" : "#FAF4E8"}
                    stroke="#493426"
                    strokeWidth="1.2"
                  />
                  <text
                    y="4"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={isSelected ? "#F5EBD8" : "#493426"}
                  >
                    {k.title.length > 22 ? `${k.title.slice(0, 21)}…` : k.title}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Kingdom Preview Bar */}
      {selected && (
        <div className="mt-4 journal-parchment p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-ink text-ivory">
                Kingdom {selected.order_index}
              </span>
              <span className="text-xs font-semibold text-ink-muted">{selected.subtitle}</span>
              {selected.progress_pct >= 80 && (
                <span className="inline-flex items-center gap-1 text-xs text-forest font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Explored
                </span>
              )}
            </div>
            <h3 className="font-hand text-2xl font-bold text-ink">{selected.title}</h3>
            <p className="text-xs text-ink-muted">
              Progress: {selected.progress_pct}%{" "}
              {selected.concepts_total !== undefined && `• ${selected.concepts_mastered ?? 0}/${selected.concepts_total} concepts mastered`}
            </p>
          </div>

          <Link
            href={`/kingdoms/${selected.slug}`}
            className="terracotta-btn px-5 py-2.5 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0"
          >
            <span>Enter Kingdom</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
