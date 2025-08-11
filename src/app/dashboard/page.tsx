/* eslint-disable import/order */
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ProjectCard from "@/components/project-card";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/server/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) redirect("/login");
  let user;
  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }
  if (user.role !== "user") redirect("/admin/users");

  async function addProject(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    if (!token) return;
    const user = await verifyToken(token);
    if (user.role !== "user") return;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    await prisma.project.create({
      data: { title, description, user_id: user.id },
    });
    revalidatePath("/dashboard");
  }

  const projects = await prisma.project.findMany({
    where: { user_id: user.id },
  });

  return (
    <section className="p-4">
      <form action={addProject} className="mb-4 flex flex-col gap-2 max-w-md">
        <input
          className="border p-2"
          name="title"
          type="text"
          placeholder="Project title"
          required
        />
        <input
          className="border p-2"
          name="description"
          type="text"
          placeholder="Description"
        />
        <button className="bg-blue-500 text-white p-2" type="submit">
          New Project
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground">No projects yet.</p>
        )}
      </div>
    </section>
  );
}
