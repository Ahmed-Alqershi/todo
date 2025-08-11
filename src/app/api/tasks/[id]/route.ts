import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exists = await prisma.task.findFirst({
    where: { id: params.id, user_id: user.id },
  });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = await req.json();
  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      criticality: data.criticality,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      status: data.status,
      project_id: data.projectId,
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const exists = await prisma.task.findFirst({
    where: { id: params.id, user_id: user.id },
  });
  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
