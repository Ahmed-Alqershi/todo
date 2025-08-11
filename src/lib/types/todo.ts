export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  criticality: "normal" | "critical";
  deadline?: string;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  taskIds: string[];
}
