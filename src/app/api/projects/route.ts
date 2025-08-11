import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = await prisma.project.findMany({ where: { user_id: user.id } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      user_id: user.id,
    },
  });
  return NextResponse.json(project);
}
