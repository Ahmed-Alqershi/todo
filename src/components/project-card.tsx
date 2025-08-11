import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description?: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg border bg-background p-4 shadow hover:bg-muted"
    >
      <h3 className="font-semibold">{project.title}</h3>
      {project.description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {project.description}
        </p>
      )}
    </Link>
  );
}
