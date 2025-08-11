"use client";

import { useEffect, useState } from "react";

import ProjectCard from "@/components/project-card";

interface Project {
  id: string;
  title: string;
  description?: string | null;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data));
  }, []);

  return (
    <section className="grid gap-4 p-4 md:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
      {projects.length === 0 && (
        <p className="text-muted-foreground">No projects yet.</p>
      )}
    </section>
  );
}
