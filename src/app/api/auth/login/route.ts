import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, email, password_hash, full_name, avatar_key, role, xp, level, coins, streak_days FROM profiles WHERE email = ?")
      .get(email) as
      | {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          avatar_key: string;
          role: string;
          xp: number;
          level: number;
          coins: number;
          streak_days: number;
        }
      | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_key: user.avatar_key,
        role: user.role,
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        streak_days: user.streak_days,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
