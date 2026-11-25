import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb, unlockAchievementIfEligible } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const fullName = String(body.full_name || "").trim();
    const avatarKey = String(body.avatar_key || "explorer-1");

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM profiles WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "An explorer with this email already exists." }, { status: 409 });
    }

    const id = `usr-${crypto.randomUUID()}`;
    const today = new Date().toISOString().slice(0, 10);

    db.prepare(`
      INSERT INTO profiles (id, email, password_hash, full_name, avatar_key, role, xp, level, coins, streak_days, last_active_date)
      VALUES (?, ?, ?, ?, ?, 'student', 50, 1, 50, 1, ?)
    `).run(id, email, hashPassword(password), fullName, avatarKey, today);

    unlockAchievementIfEligible(id, "ach-first-step");

    // Seed initial due revision & study plan so new user has an actionable journal
    db.prepare(`
      INSERT INTO study_plans (id, user_id, scheduled_date, title, kingdom_id, concept_id, task_type, completed)
      VALUES (?, ?, ?, ?, ?, ?, 'concept', 0)
    `).run(crypto.randomUUID(), id, today, "Begin Kingdom VII: Singly Linked List", "k7-dsa", "c-linked-list-intro");

    await setSessionCookie(id);

    return NextResponse.json({
      user: {
        id,
        email,
        full_name: fullName,
        avatar_key: avatarKey,
        role: "student",
        xp: 100,
        level: 1,
        coins: 75,
        streak_days: 1,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
