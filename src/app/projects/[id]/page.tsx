"use client";

import { useEffect, useState } from "react";

import TaskCard from "@/components/task-card";
import TaskModal, { TaskInput } from "@/components/task-modal";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  deadline?: string | null;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetch(`/api/tasks?projectId=${projectId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setTasks);
  };
  useEffect(load, [projectId]);

  const handleSave = async (data: TaskInput) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, projectId }),
    });
    setModalOpen(false);
    load();
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    load();
  };

  const statuses = [
    { key: "todo", label: "Todo" },
    { key: "in-progress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  return (
    <section className="p-4">
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        New Task
      </button>
      <div className="flex gap-4 overflow-x-auto">
        {statuses.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/plain");
              handleStatusChange(id, col.key);
            }}
            className="flex w-80 flex-col rounded bg-muted/50 p-2"
          >
            <h2 className="mb-2 font-semibold">{col.label}</h2>
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <TaskCard key={task.id} task={task} onDelete={handleDelete} />
              ))}
          </div>
        ))}
      </div>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
}
