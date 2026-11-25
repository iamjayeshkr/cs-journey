"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  Code2,
  Compass,
  Flame,
  Home,
  Layers,
  LogOut,
  Map as MapIcon,
  Menu,
  NotebookPen,
  Puzzle,
  Search,
  Settings,
  Shield,
  Sparkles,
  Swords,
  X,
} from "lucide-react";
import { CSCompanionDrawer } from "./CSCompanionDrawer";
import { CharacterIllustration, Illustration } from "./IllustratedAssets";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_key: string;
  role: string;
  xp: number;
  level: number;
  coins: number;
  streak_days: number;
  target_exam?: string;
  daily_goal_minutes?: number;
  sound_enabled?: number;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/world-map", label: "World Map", icon: MapIcon },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/practice", label: "Practice & PYQs", icon: Swords },
  { href: "/puzzles", label: "Puzzle Dungeon", icon: Puzzle },
  { href: "/code-arena", label: "Code Arena", icon: Code2 },
  { href: "/exam-arena", label: "Exam Arena", icon: Award },
  { href: "/vault", label: "Memory Vault", icon: Layers },
  { href: "/planner", label: "Study Planner", icon: CalendarDays },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/notes", label: "My Notes", icon: NotebookPen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function JournalShell({
  user,
  children,
  conceptSlug,
}: {
  user: UserProfile | null;
  children: React.ReactNode;
  conceptSlug?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    kingdoms: Array<{ id: string; slug: string; title: string }>;
    concepts: Array<{ id: string; slug: string; title: string; kingdom_title: string }>;
    questions: Array<{ id: string; prompt: string }>;
  } | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) setSearchResults(await res.json());
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
    router.refresh();
  }

  const levelProgress = user ? ((user.xp % 250) / 250) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink">
      {/* Top Journal Header */}
      <header className="sticky top-0 z-30 border-b border-ink/20 bg-[#F2E6CF]/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded border border-ink/25 bg-parchment hover:bg-parchment/80"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-11 h-10 rounded-md bg-[#FAF4E8] border border-ink/25 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-0.5">
                <Illustration src="/assets/ui/logo-mark.png" alt="The CS Journey Logo" width={40} height={36} />
              </div>
              <div>
                <span className="font-hand text-2xl font-bold leading-none block text-ink">
                  The CS Journey
                </span>
                <span className="text-[11px] text-ink-muted tracking-wide uppercase">
                  UGC NET & JRF Journal
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kingdoms, concepts, PYQs..."
                className="w-full pl-9 pr-8 py-1.5 text-sm rounded-md bg-[#FAF4E8] border border-ink/25 focus:outline-none focus:border-ink"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchResults && (
              <div className="absolute left-0 right-0 mt-1.5 journal-card p-3 z-50 max-h-80 overflow-y-auto shadow-lg">
                {searchResults.kingdoms.length === 0 &&
                searchResults.concepts.length === 0 &&
                searchResults.questions.length === 0 ? (
                  <p className="text-xs text-ink-muted py-2 text-center">No matching entries in your journal.</p>
                ) : (
                  <div className="space-y-2.5 text-sm">
                    {searchResults.kingdoms.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-ink-muted mb-1">Kingdoms</p>
                        {searchResults.kingdoms.map((k) => (
                          <Link
                            key={k.id}
                            href={`/kingdoms/${k.slug}`}
                            onClick={() => setSearchQuery("")}
                            className="block px-2 py-1 rounded hover:bg-parchment font-medium"
                          >
                            {k.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.concepts.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-ink-muted mb-1">Concepts</p>
                        {searchResults.concepts.map((c) => (
                          <Link
                            key={c.id}
                            href={`/concepts/${c.slug}`}
                            onClick={() => setSearchQuery("")}
                            className="block px-2 py-1 rounded hover:bg-parchment"
                          >
                            <span className="font-medium">{c.title}</span>
                            <span className="text-xs text-ink-muted ml-2">({c.kingdom_title})</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.questions.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-ink-muted mb-1">Questions</p>
                        {searchResults.questions.map((q) => (
                          <Link
                            key={q.id}
                            href="/practice"
                            onClick={() => setSearchQuery("")}
                            className="block px-2 py-1 rounded hover:bg-parchment text-xs truncate"
                          >
                            {q.prompt}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Stats & AI Companion */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF4E8] border border-ink/20 text-xs font-semibold">
                  <span className="text-mustard">★</span>
                  <span>{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF4E8] border border-ink/20 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-terracotta" />
                  <span>{user.streak_days}d</span>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setCompanionOpen(true)}
              className="parchment-btn px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span className="hidden sm:inline">CS Mentor</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-2 rounded-md border border-ink/20 bg-[#FAF4E8] hover:bg-parchment text-ink-muted hover:text-ink"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link href="/auth" className="ink-btn px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* Left Journal Spine Sidebar */}
        <aside
          className={`${
            mobileOpen ? "fixed inset-y-0 left-0 z-40 w-64 pt-16" : "hidden"
          } lg:block lg:w-64 shrink-0 border-r border-ink/20 bg-[#EFE2C8]/80 p-4 overflow-y-auto`}
        >
          {/* Explorer Mini Card */}
          {user ? (
            <div className="journal-card p-3.5 mb-5 washi-tape">
              <div className="flex items-center gap-3 mt-1">
                <div className="w-14 h-14 rounded-md bg-[#F2E6CF] border border-ink/30 flex items-center justify-center overflow-hidden shrink-0">
                  <CharacterIllustration characterKey={user.avatar_key} alt={user.full_name} size={54} />
                </div>
                <div className="min-w-0">
                  <p className="font-hand text-xl font-bold leading-tight truncate">{user.full_name}</p>
                  <p className="text-xs text-ink-muted">
                    Lv. {user.level} • {user.role === "admin" ? "Curator" : "NET Explorer"}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-ink-muted mb-1">
                  <span>Level Progress</span>
                  <span>{user.xp % 250} / 250 XP</span>
                </div>
                <div className="h-2 rounded-full bg-parchment border border-ink/20 overflow-hidden">
                  <div
                    className="h-full bg-forest transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="journal-card p-3.5 mb-5 text-center">
              <p className="font-hand text-lg font-bold">Guest Explorer</p>
              <p className="text-xs text-ink-muted mt-1 mb-3">Sign in to save XP, mastery & spaced revisions.</p>
              <Link href="/auth" className="ink-btn block py-1.5 rounded text-xs font-semibold">
                Begin / Sign In
              </Link>
            </div>
          )}

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-ink text-ivory shadow-sm"
                      : "text-ink hover:bg-parchment/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-mustard" : "text-ink-muted"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium mt-3 border border-terracotta/40 ${
                  pathname.startsWith("/admin")
                    ? "bg-terracotta text-ivory"
                    : "bg-terracotta/15 text-ink hover:bg-terracotta/25"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS</span>
              </Link>
            )}
          </nav>

          <div className="mt-6 sticky-note p-3 rounded text-xs text-ink">
            <p className="font-hand text-base font-bold mb-0.5">Journal Motto</p>
            <p className="italic font-serif">&ldquo;One concept at a time, until UGC NET & JRF is mine.&rdquo;</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <CSCompanionDrawer
        open={companionOpen}
        onClose={() => setCompanionOpen(false)}
        conceptSlug={conceptSlug}
      />
    </div>
  );
}
