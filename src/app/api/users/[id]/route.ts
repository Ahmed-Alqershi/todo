import { NextRequest, NextResponse } from "next/server";

import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const update: Partial<{ email: string; role: Role; hashed_password: string }> = {};
  if (data.email) update.email = data.email;
  if (data.role) update.role = data.role as Role;
  if (data.password)
    update.hashed_password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.update({ where: { id: params.id }, data: update });
  return NextResponse.json(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.task.deleteMany({ where: { user_id: params.id } });
  await prisma.project.deleteMany({ where: { user_id: params.id } });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
