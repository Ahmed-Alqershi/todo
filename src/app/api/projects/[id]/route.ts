import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const project = await prisma.project.findFirst({
    where: { id: params.id, user_id: user.id },
    include: { tasks: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exists = await prisma.project.findFirst({
    where: { id: params.id, user_id: user.id },
  });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = await req.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: { title: data.title, description: data.description },
  });
  return NextResponse.json(project);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exists = await prisma.project.findFirst({
    where: { id: params.id, user_id: user.id },
  });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
