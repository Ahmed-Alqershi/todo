import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/server/auth";
import { getUsers, createUser, Role } from "@/lib/server/user-store";

function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getUsers());
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const newUser = createUser({
    email: data.email,
    password: data.password,
    role: (data.role as Role) || "user",
  });
  return NextResponse.json(newUser);
}
