"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, KeyRound, Sparkles, UserPlus } from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function quickDemo(demoEmail: string, demoPassword: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Demo sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-md bg-ink text-ivory flex items-center justify-center">
          <Compass className="w-6 h-6 text-mustard" />
        </div>
        <span className="font-hand text-3xl font-bold">The CS Journey</span>
      </Link>

      <div className="w-full max-w-md journal-card p-6 sm:p-8 washi-tape">
        <div className="flex border-b border-ink/20 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === "login" ? "border-ink text-ink" : "border-transparent text-ink-muted"
            }`}
          >
            Explorer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === "register" ? "border-ink text-ink" : "border-transparent text-ink-muted"
            }`}
          >
            New Journal
          </button>
        </div>

        <h1 className="font-hand text-3xl font-bold mb-1">
          {mode === "login" ? "Open Your Study Journal" : "Create Your Explorer Profile"}
        </h1>
        <p className="text-xs text-ink-muted mb-5">
          {mode === "login"
            ? "Your XP, mastery scores, and spaced-repetition queue await."
            : "Start from fundamentals and progress to UGC NET JRF mastery."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-terracotta/15 border border-terracotta text-xs font-medium text-ink">
            {error}
          </div>
        )}

        <form onSubmit={submitAuth} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold mb-1">Explorer Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Rudra"
                className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25 focus:outline-none focus:border-ink"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@csjourney.in"
              className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25 focus:outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-md bg-ivory border border-ink/25 focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ink-btn w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
          >
            {mode === "login" ? <KeyRound className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? "Opening Journal..." : mode === "login" ? "Sign In" : "Create Explorer Account"}</span>
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-6 pt-5 border-t border-ink/15 space-y-2.5">
          <p className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" /> Quick Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => quickDemo("rudra@csjourney.in", "explorer123")}
              className="parchment-btn py-2 px-3 rounded text-xs font-semibold text-left"
            >
              <span className="block">Student: Rudra</span>
              <span className="text-[10px] text-ink-muted">Lv. 10 • 2,350 XP</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => quickDemo("admin@csjourney.in", "admin123")}
              className="parchment-btn py-2 px-3 rounded text-xs font-semibold text-left"
            >
              <span className="block">Admin Curator</span>
              <span className="text-[10px] text-ink-muted">Manage CMS & PYQs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
