import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { signToken } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await signToken({ id: user.id, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", token, { httpOnly: true, path: "/" });
  return res;
}
