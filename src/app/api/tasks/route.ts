import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = req.nextUrl.searchParams.get("projectId") || undefined;
  const tasks = await prisma.task.findMany({
    where: { user_id: user.id, project_id: projectId },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority ?? 1,
      criticality: data.criticality ?? 0,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      status: data.status || "todo",
      project_id: data.projectId,
      user_id: user.id,
    },
  });
  return NextResponse.json(task);
}
