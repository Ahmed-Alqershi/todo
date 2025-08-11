import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Project, Task } from "@/lib/types/todo";

interface TaskInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  criticality: "normal" | "critical";
  deadline?: string;
}

type TaskState = {
  projects: Project[];
  tasks: Record<string, Task>;
  addProject: (title: string) => void;
  removeProject: (id: string) => void;
  addTask: (projectId: string, input: TaskInput) => void;
  updateTask: (taskId: string, input: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
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
      "task-1": {
        id: "task-1",
        title: "Set up project",
        description: "Initial repository setup",
        priority: "medium",
        criticality: "normal",
        projectId: "project-1",
      },
      "task-2": {
        id: "task-2",
        title: "Add drag-and-drop",
        description: "Allow moving tasks between columns",
        priority: "high",
        criticality: "critical",
        projectId: "project-1",
      },
    },
    addProject: (title) =>
      set(
        (state) => ({
          projects: [
            ...state.projects,
            { id: `project-${Date.now()}`, title, taskIds: [] },
          ],
        }),
        false,
        "addProject"
      ),
    removeProject: (id) =>
      set(
        (state) => {
          const project = state.projects.find((p) => p.id === id);
          const remainingTasks = { ...state.tasks };
          project?.taskIds.forEach((taskId) => delete remainingTasks[taskId]);
          return {
            projects: state.projects.filter((p) => p.id !== id),
            tasks: remainingTasks,
          };
        },
        false,
        "removeProject"
      ),
    addTask: (projectId, input) =>
      set(
        (state) => {
          const id = `task-${Date.now()}`;
          return {
            tasks: {
              ...state.tasks,
              [id]: { id, projectId, ...input },
            },
            projects: state.projects.map((p) =>
              p.id === projectId
                ? { ...p, taskIds: [...p.taskIds, id] }
                : p
            ),
          };
        },
        false,
        "addTask"
      ),
    updateTask: (taskId, input) =>
      set(
        (state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...input },
          },
        }),
        false,
        "updateTask"
      ),
    removeTask: (taskId) =>
      set(
        (state) => {
          const newTasks = { ...state.tasks };
          delete newTasks[taskId];
          return {
            tasks: newTasks,
            projects: state.projects.map((p) => ({
              ...p,
              taskIds: p.taskIds.filter((id) => id !== taskId),
            })),
          };
        },
        false,
        "removeTask"
      ),
    moveTask: (taskId, targetProjectId) =>
      set(
        (state) => {
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
        },
        false,
        "moveTask"
      ),
  }))
);

export default useTaskStore;
