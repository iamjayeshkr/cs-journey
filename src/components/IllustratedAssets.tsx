"use client";

import React from "react";
import Image from "next/image";
import { Award, CheckCircle2 } from "lucide-react";

export function Illustration({
  src,
  alt,
  width = 180,
  height = 180,
  className = "",
  objectPosition = "center",
  animate = false,
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectPosition?: string;
  animate?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      style={{ objectPosition }}
      className={`object-contain select-none drop-shadow-[0_4px_8px_rgba(73,52,38,0.16)] ${animate ? "transition-transform duration-300 hover:scale-105" : ""} ${className}`}
    />
  );
}

const KINGDOM_IMAGE_MAP: Record<string, string> = {
  "k1-discrete": "/assets/kingdoms/k1-discrete.png",
  "discrete-structures": "/assets/kingdoms/k1-discrete.png",
  "k2-csa": "/assets/kingdoms/k2-csa.png",
  "computer-system-architecture": "/assets/kingdoms/k2-csa.png",
  "k3-prog": "/assets/kingdoms/k3-prog.png",
  "programming-and-graphics": "/assets/kingdoms/k3-prog.png",
  "k4-dbms": "/assets/kingdoms/k4-dbms.png",
  "database-management-systems": "/assets/kingdoms/k4-dbms.png",
  "k5-os": "/assets/kingdoms/k5-os.png",
  "operating-systems": "/assets/kingdoms/k5-os.png",
  "k6-se": "/assets/kingdoms/k6-se.png",
  "software-engineering": "/assets/kingdoms/k6-se.png",
  "k7-dsa": "/assets/kingdoms/k7-dsa.png",
  "data-structures-and-algorithms": "/assets/kingdoms/k7-dsa.png",
  "k8-toc": "/assets/kingdoms/k8-toc.png",
  "theory-of-computation-compilers": "/assets/kingdoms/k8-toc.png",
  "k9-cn": "/assets/kingdoms/k9-cn.png",
  "computer-networks": "/assets/kingdoms/k9-cn.png",
  "k10-ai": "/assets/kingdoms/k10-ai.png",
  "artificial-intelligence": "/assets/kingdoms/k10-ai.png",
};

export function KingdomIllustration({
  kingdomKey,
  alt,
  size = 110,
  className = "",
}: {
  kingdomKey: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const src = KINGDOM_IMAGE_MAP[kingdomKey] || "/assets/kingdoms/k7-dsa.png";
  return <Illustration src={src} alt={alt} width={size} height={size} animate className={className} />;
}

const AVATAR_IMAGE_MAP: Record<string, string> = {
  "explorer-1": "/assets/characters/explorer-back.png",
  "explorer-writing": "/assets/characters/explorer-writing.png",
  "explorer-reading": "/assets/characters/explorer-reading.png",
  "sage-1": "/assets/characters/mentor-sage.png",
  "architect-1": "/assets/characters/engineer.png",
  "automata-1": "/assets/characters/astronomer.png",
  "scholar-girl": "/assets/characters/scholar-girl.png",
  "scholar-books": "/assets/characters/scholar-books.png",
  "network-scout": "/assets/characters/network-scout.png",
  foxy: "/assets/companions/foxy.png",
  "byte-bird": "/assets/companions/byte-bird.png",
  kronos: "/assets/companions/kronos.png",
};

export function CharacterIllustration({
  characterKey = "explorer-1",
  alt = "Explorer Portrait",
  size = 64,
  className = "",
}: {
  characterKey?: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const src = AVATAR_IMAGE_MAP[characterKey] || "/assets/characters/explorer-back.png";
  return <Illustration src={src} alt={alt} width={size} height={size} className={className} />;
}

export function PaperCard({
  children,
  className = "",
  tape,
  parchment = false,
}: {
  children: React.ReactNode;
  className?: string;
  tape?: "mustard" | "blue" | "green" | "terracotta";
  parchment?: boolean;
}) {
  const tapeClass =
    tape === "blue"
      ? "washi-tape washi-tape-blue"
      : tape === "green"
      ? "washi-tape washi-tape-green"
      : tape === "terracotta"
      ? "washi-tape washi-tape-terracotta"
      : tape === "mustard"
      ? "washi-tape"
      : "";
  return (
    <div className={`${parchment ? "journal-parchment" : "journal-card"} ${tapeClass} ${className}`}>
      {children}
    </div>
  );
}

export function SectionRibbon({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/15 pb-3 mb-4">
      <div>
        <h2 className="font-hand text-3xl font-bold text-ink leading-none">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function AchievementStamp({
  title,
  description,
  unlocked,
}: {
  title: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-md border flex items-center gap-3 transition-all ${
        unlocked
          ? "bg-[#F7E9B4]/55 border-ink/30 shadow-sm"
          : "bg-ivory/60 border-ink/15 opacity-60"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 stamp-badge ${
          unlocked ? "bg-terracotta/15 text-terracotta" : "bg-parchment text-ink-muted"
        }`}
      >
        {unlocked ? <CheckCircle2 className="w-5 h-5 text-forest" /> : <Award className="w-5 h-5" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-ink truncate">{title}</p>
        <p className="text-[11px] text-ink-muted line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

export function IllustratedEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="journal-parchment p-6 text-center flex flex-col items-center gap-2">
      <Illustration src="/assets/companions/foxy.png" alt="Foxy Companion" width={84} height={84} />
      <h3 className="font-hand text-2xl font-bold">{title}</h3>
      <p className="text-xs text-ink-muted max-w-sm">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
