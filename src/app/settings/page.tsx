"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Save } from "lucide-react";
import { JournalShell, UserProfile } from "@/components/JournalShell";
import { AchievementStamp, CharacterIllustration } from "@/components/IllustratedAssets";

const AVATARS = [
  { key: "explorer-1", label: "Mountain Explorer" },
  { key: "explorer-writing", label: "Field Scribe" },
  { key: "scholar-girl", label: "Journal Scholar" },
  { key: "architect-1", label: "Clockwork Engineer" },
  { key: "automata-1", label: "Observatory Scholar" },
  { key: "sage-1", label: "Library Mentor" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Array<{ id: string; title: string; description: string; unlocked_at: string | null }>>([]);
  const [fullName, setFullName] = useState("");
  const [avatarKey, setAvatarKey] = useState("explorer-1");
  const [targetExam, setTargetExam] = useState("UGC NET JRF (Computer Science)");
  const [dailyGoal, setDailyGoal] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/auth");
          return;
        }
        setUser(d.user);
        setAchievements(d.achievements ?? []);
        setFullName(d.user.full_name || "");
        setAvatarKey(d.user.avatar_key || "explorer-1");
        setTargetExam(d.user.target_exam || "UGC NET JRF (Computer Science)");
        setDailyGoal(d.user.daily_goal_minutes || 60);
        setSoundEnabled(Boolean(d.user.sound_enabled));
      });
  }, [router]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          avatar_key: avatarKey,
          target_exam: targetExam,
          daily_goal_minutes: dailyGoal,
          sound_enabled: soundEnabled,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setSavedMsg("Journal settings saved!");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <JournalShell user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-hand text-4xl font-bold">Explorer Profile, Achievements & Settings</h1>
          <p className="text-sm text-ink-muted">Customize your character portrait, study target, and view collectible stamps.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <form onSubmit={saveSettings} className="lg:col-span-7 journal-card p-6 space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-ink/15">
              <div className="w-16 h-16 rounded-lg bg-[#F2E6CF] border-2 border-ink/30 flex items-center justify-center overflow-hidden">
                <CharacterIllustration characterKey={avatarKey} alt={fullName || "Explorer"} size={60} />
              </div>
              <div>
                <p className="font-hand text-2xl font-bold">{user?.full_name}</p>
                <p className="text-xs text-ink-muted">
                  {user?.email} • Lv. {user?.level} • {user?.xp.toLocaleString()} XP
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Display Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">Choose Explorer Portrait</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVATARS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => setAvatarKey(a.key)}
                    className={`p-2.5 rounded-md border text-center text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                      avatarKey === a.key
                        ? "bg-ink text-ivory border-ink"
                        : "bg-ivory border-ink/25 hover:bg-parchment"
                    }`}
                  >
                    <CharacterIllustration characterKey={a.key} alt={a.label} size={46} />
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Target Milestone</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25"
                >
                  <option>UGC NET JRF (Computer Science)</option>
                  <option>UGC NET Assistant Professor</option>
                  <option>CS Fundamentals + GATE/NET</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Daily Study Goal (minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-ink"
              />
              <span>Enable subtle journal feedback cues</span>
            </label>

            <div className="flex items-center justify-between pt-2">
              {savedMsg ? (
                <span className="text-xs font-semibold text-forest flex items-center gap-1">
                  <Check className="w-4 h-4" /> {savedMsg}
                </span>
              ) : (
                <span />
              )}
              <button type="submit" disabled={saving} className="terracotta-btn px-5 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>

          {/* Collectible Achievement Stamps */}
          <div className="lg:col-span-5 journal-parchment p-5 space-y-3">
            <h2 className="font-hand text-3xl font-bold">Achievement Stamps</h2>
            <p className="text-xs text-ink-muted">Collectible seals earned across your UGC NET CS adventure.</p>
            <div className="space-y-2.5">
              {achievements.map((a) => (
                <AchievementStamp
                  key={a.id}
                  title={a.title}
                  description={a.description}
                  unlocked={Boolean(a.unlocked_at)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </JournalShell>
  );
}
