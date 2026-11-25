"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass } from "lucide-react";
import { Illustration, KingdomIllustration } from "./IllustratedAssets";

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

export function WorldMapCanvas({
  kingdoms,
  overallProgress = 0,
}: {
  kingdoms: MapKingdom[];
  overallProgress?: number;
}) {
  const [selected, setSelected] = useState<MapKingdom | null>(kingdoms[6] || kingdoms[0] || null);

  // Interpolate Foxy Pet position along the 10-kingdom treasure trail from 0% to 100%
  const clampedPct = Math.max(0, Math.min(100, overallProgress));
  let travelerX = 8;
  let travelerY = 24;
  if (kingdoms.length > 0) {
    const exactIdx = (clampedPct / 100) * (kingdoms.length - 1);
    const i0 = Math.floor(exactIdx);
    const i1 = Math.min(kingdoms.length - 1, i0 + 1);
    const t = exactIdx - i0;
    travelerX = kingdoms[i0].map_x + (kingdoms[i1].map_x - kingdoms[i0].map_x) * t;
    travelerY = kingdoms[i0].map_y + (kingdoms[i1].map_y - kingdoms[i0].map_y) * t;
  }

  return (
    <div className="journal-card p-4 sm:p-6 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-hand text-3xl font-bold text-ink leading-none">
            The CS Treasure Map — 10 Kingdoms
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Follow Foxy along the treasure trail. Click any kingdom to explore its chapters and puzzles.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md bg-parchment border border-ink/25">
          <Compass className="w-4 h-4 text-terracotta" />
          <span>JRF Summit • {clampedPct}% Explored</span>
        </div>
      </div>

      {/* Full-Bleed Hand-Painted Watercolor Treasure Map */}
      <div className="relative w-full aspect-[16/10] min-h-[380px] rounded-lg border-2 border-ink/35 bg-[#EFE2C6] overflow-hidden shadow-inner">
        <img
          src="/assets/backgrounds/treasure-map-bg.png"
          alt="Illustrated Treasure Map"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Subtle dotted SVG treasure route connecting kingdoms */}
        <svg viewBox="0 0 1000 620" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <polyline
            points={kingdoms.map((k) => `${k.map_x * 10},${k.map_y * 6}`).join(" ")}
            fill="none"
            stroke="#493426"
            strokeWidth="3.5"
            strokeDasharray="9 8"
            opacity="0.55"
          />
        </svg>

        {/* Animated 2D Pet Companion (Foxy) moving along the treasure map */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
          initial={{ left: "8%", top: "24%" }}
          animate={{ left: `${travelerX}%`, top: `${Math.max(10, travelerY - 8)}%` }}
          transition={{ type: "spring", stiffness: 55, damping: 14 }}
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Illustration
              src="/assets/companions/foxy.png"
              alt="Foxy Pet Companion"
              width={52}
              height={52}
            />
          </motion.div>
          <span className="px-2 py-0.5 rounded-full bg-terracotta text-ivory text-[10px] font-bold shadow border border-ink whitespace-nowrap">
            Foxy • {clampedPct}%
          </span>
        </motion.div>

        {/* Interactive Kingdom Landmarks */}
        {kingdoms.map((k) => {
          const isSelected = selected?.id === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => setSelected(k)}
              style={{ left: `${k.map_x}%`, top: `${k.map_y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                isSelected ? "scale-110 z-20" : "hover:scale-105 z-10"
              }`}
            >
              <div
                className={`rounded-full p-1 transition-all ${
                  isSelected
                    ? "ring-2 ring-terracotta bg-[#FAF4E8]/85 shadow-md"
                    : "bg-[#FAF4E8]/45 group-hover:bg-[#FAF4E8]/80"
                }`}
              >
                <KingdomIllustration
                  kingdomKey={k.id}
                  alt={k.title}
                  size={74}
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[74px] lg:h-[74px]"
                />
              </div>

              <span
                className={`mt-0.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold border border-ink/30 shadow-sm whitespace-nowrap ${
                  isSelected ? "bg-ink text-ivory" : "bg-[#FAF4E8]/95 text-ink"
                }`}
              >
                {k.order_index}. {k.title.length > 18 ? `${k.title.slice(0, 17)}…` : k.title} • {k.progress_pct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Kingdom Preview Bar */}
      {selected && (
        <div className="mt-4 journal-parchment p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-md bg-[#FAF4E8] border border-ink/25 flex items-center justify-center shrink-0 p-1">
              <KingdomIllustration kingdomKey={selected.id} alt={selected.title} size={72} />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
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
              <h3 className="font-hand text-2xl sm:text-3xl font-bold text-ink">{selected.title}</h3>
              <p className="text-xs text-ink-muted">
                Progress: {selected.progress_pct}%{" "}
                {selected.concepts_total !== undefined &&
                  `• ${selected.concepts_mastered ?? 0}/${selected.concepts_total} concepts mastered`}
              </p>
            </div>
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
