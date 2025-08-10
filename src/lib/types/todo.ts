export interface Task {
  id: string;
  title: string;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  taskIds: string[];
}
