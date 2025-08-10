import { NextRequest, NextResponse } from "next/server";

import { signToken } from "@/lib/server/auth";
import { findUser } from "@/lib/server/user-store";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = findUser(email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signToken({ id: user.id, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", token, { httpOnly: true, path: "/" });
  return res;
}
