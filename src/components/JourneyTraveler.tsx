"use client";

import React from "react";
import { motion } from "framer-motion";
import { Illustration } from "./IllustratedAssets";

export function JourneyTraveler({
  progressPct,
  label = "Your CS Journey",
  characterSrc = "/assets/characters/explorer-writing.png",
}: {
  progressPct: number;
  label?: string;
  characterSrc?: string;
}) {
  const clamped = Math.max(0, Math.min(100, progressPct));

  return (
    <div className="journal-card p-4 sm:p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="font-hand text-2xl font-bold text-ink">{label}</span>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-parchment border border-ink/25">
          {clamped}% to JRF Summit
        </span>
      </div>

      {/* Animated 2D Trail */}
      <div className="relative pt-14 pb-6 px-4">
        {/* Dotted Parchment Road */}
        <div className="relative h-2.5 rounded-full bg-[#EAD9BA] border border-ink/25 overflow-hidden">
          <motion.div
            className="h-full bg-forest"
            initial={{ width: "0%" }}
            animate={{ width: `${clamped}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
          />
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between text-[10px] font-semibold text-ink-muted mt-1.5">
          <span>0% Start</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className="text-terracotta font-bold">100% JRF</span>
        </div>

        {/* Moving 2D Little Explorer Character */}
        <motion.div
          className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          initial={{ left: "2%" }}
          animate={{ left: `${Math.max(3, Math.min(97, clamped))}%` }}
          transition={{ type: "spring", stiffness: 65, damping: 15 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <Illustration src={characterSrc} alt="2D Explorer Traveler" width={48} height={48} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
