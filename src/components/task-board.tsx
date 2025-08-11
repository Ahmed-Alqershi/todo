'use client';

import { useState } from 'react';

import useTaskStore from '@/lib/stores/task-store';

import type { Project, Task } from '@/lib/types/todo';

const TaskBoard = () => {
  const {
    projects,
    tasks,
    addProject,
    removeProject,
    addTask,
    removeTask,
    moveTask,
  } = useTaskStore();

  const [projectTitle, setProjectTitle] = useState('');

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    addProject(projectTitle.trim());
    setProjectTitle('');
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleProjectSubmit} className="flex gap-2">
        <input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="New project title"
          className="flex-1 rounded border px-2 py-1"
        />
        <button
          type="submit"
          className="rounded bg-primary px-2 py-1 text-primary-foreground"
        >
          Add
        </button>
      </form>
      <div className="flex gap-4 overflow-x-auto">
        {projects.map((project) => (
          <ProjectColumn
            key={project.id}
            project={project}
            tasks={tasks}
            addTask={addTask}
            removeTask={removeTask}
            removeProject={removeProject}
            moveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
};

interface ColumnProps {
  project: Project;
  tasks: Record<string, Task>;
  addTask: (
    projectId: string,
    input: Omit<Task, "id" | "projectId">
  ) => void;
  removeTask: (taskId: string) => void;
  removeProject: (id: string) => void;
  moveTask: (taskId: string, targetProjectId: string) => void;
}

const ProjectColumn = ({
  project,
  tasks,
  addTask,
  removeTask,
  removeProject,
  moveTask,
}: ColumnProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [criticality, setCriticality] = useState<'normal' | 'critical'>('normal');
  const [deadline, setDeadline] = useState('');

  const projectTasks = project.taskIds
    .map((id) => tasks[id])
    .filter((t): t is Task => Boolean(t));
  const nextDeadline = projectTasks
    .filter((t) => t.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )[0]?.deadline;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(project.id, {
      title,
      description,
      priority,
      criticality,
      deadline,
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCriticality('normal');
    setDeadline('');
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    moveTask(taskId, project.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex w-72 flex-col rounded-xl bg-muted/50 p-4"
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{project.title}</h2>
          <p className="text-xs text-muted-foreground">
            {projectTasks.length} tasks
            {nextDeadline
              ? ` • next: ${new Date(nextDeadline).toLocaleDateString()}`
              : ''}
          </p>
        </div>
        <button
          onClick={() => removeProject(project.id)}
          className="text-xs text-red-600"
          aria-label="Delete project"
        >
          ✕
        </button>
      </div>
      <div className="flex-1">
        {projectTasks.map((task) => {
          const deadlineDate = task.deadline ? new Date(task.deadline) : null;
          let border = '';
          if (deadlineDate) {
            const now = new Date();
            if (deadlineDate < now) border = 'border-red-500';
            else if (
              deadlineDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000
            )
              border = 'border-yellow-500';
          }
          return (
            <div
              key={task.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData('text/plain', task.id)
              }
              className={`mb-2 rounded border bg-background p-2 shadow ${border}`}
            >
              <div className="flex items-center justify-between">
                <span>{task.title}</span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-xs text-red-600"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </div>
              {task.deadline && (
                <p className="text-xs text-muted-foreground">
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-1 text-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="rounded border px-2 py-1"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded border px-2 py-1"
        />
        <div className="flex gap-1">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value as 'low' | 'medium' | 'high'
              )
            }
            className="flex-1 rounded border px-2 py-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={criticality}
            onChange={(e) =>
              setCriticality(
                e.target.value as 'normal' | 'critical'
              )
            }
            className="flex-1 rounded border px-2 py-1"
          >
            <option value="normal">Normal</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <button
          type="submit"
          className="mt-1 rounded bg-primary px-2 py-1 text-primary-foreground"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskBoard;
