'use client';

import useTaskStore from "@/lib/stores/task-store";

import type { Project } from "@/lib/types/todo";

const TaskBoard = () => {
  const { projects, tasks } = useTaskStore();

  return (
    <div className="flex gap-4">
      {projects.map((project: Project) => (
        <div
          key={project.id}
          className="bg-muted/50 rounded-xl p-4 w-60 min-h-60"
        >
          <h2 className="mb-2 font-semibold">{project.title}</h2>
          {project.taskIds.map((taskId: string) => {
            const task = tasks[taskId];
            return (
              <div
                key={taskId}
                className="bg-background rounded p-2 mb-2 shadow"
              >
                {task.title}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
