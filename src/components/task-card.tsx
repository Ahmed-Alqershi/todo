"use client";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
}

export default function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete?: (id: string) => void;
}) {
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const now = new Date();
  let border = "";
  if (deadline) {
    if (deadline < now) border = "border-red-500";
    else if (deadline.getTime() - now.getTime() < 24 * 60 * 60 * 1000)
      border = "border-yellow-500";
  }
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
      className={`mb-2 rounded border bg-background p-2 shadow ${border}`}
    >
      <div className="flex items-center justify-between">
        <span>{task.title}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-red-600"
            aria-label="Delete task"
          >
            ✕
          </button>
        )}
      </div>
      {deadline && (
        <p className="text-xs text-muted-foreground">
          {deadline.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
