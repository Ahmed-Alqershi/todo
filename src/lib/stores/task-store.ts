import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Project, Task } from "@/lib/types/todo";

type TaskState = {
  projects: Project[];
  tasks: Record<string, Task>;
  moveTask: (taskId: string, targetProjectId: string) => void;
};

export const useTaskStore = create<TaskState>()(
  devtools((set) => ({
    projects: [
      { id: "project-1", title: "Todo", taskIds: ["task-1", "task-2"] },
      { id: "project-2", title: "In Progress", taskIds: [] },
      { id: "project-3", title: "Done", taskIds: [] },
    ],
    tasks: {
      "task-1": { id: "task-1", title: "Set up project", projectId: "project-1" },
      "task-2": { id: "task-2", title: "Add drag-and-drop", projectId: "project-1" },
    },
    moveTask: (taskId, targetProjectId) =>
      set((state) => {
        const task = state.tasks[taskId];
        if (!task) return state;

        const sourceProjectId = task.projectId;
        if (sourceProjectId === targetProjectId) return state;

        const updatedProjects = state.projects.map((project) => {
          if (project.id === sourceProjectId) {
            return {
              ...project,
              taskIds: project.taskIds.filter((id) => id !== taskId),
            };
          }
          if (project.id === targetProjectId) {
            return { ...project, taskIds: [...project.taskIds, taskId] };
          }
          return project;
        });

        return {
          projects: updatedProjects,
          tasks: {
            ...state.tasks,
            [taskId]: { ...task, projectId: targetProjectId },
          },
        };
      }, false, "moveTask"),
  }))
);

export default useTaskStore;
