"use client";

import { useState } from "react";

export interface TaskInput {
  title: string;
  description?: string;
  deadline?: string;
}

export default function TaskModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaskInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, deadline });
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded bg-background p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">New Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded border px-2 py-1"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded border px-2 py-1"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="rounded border px-2 py-1"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-2 py-1 text-primary-foreground"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
