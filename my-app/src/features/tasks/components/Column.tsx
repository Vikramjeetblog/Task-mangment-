"use client";

import { useState } from "react";
import Link from "next/link";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { useKanbanStore } from "../store/useKanbanStore";
import { useTaskViewStore } from "../store/useTaskViewStore";
import { TaskCard } from "./TaskCard";

export function Column({ id, title }: { id: string; title: string }) {
  const columns = useKanbanStore((state) => state.columns);
  const column = columns.find((c) => c.id === id);
  const query = useTaskViewStore((state) => state.query);
  const priorityFilter = useTaskViewStore((state) => state.priorityFilter);

  // The board honours the same search box and priority filter as the list view.
  const visibleTasks = (column?.tasks ?? []).filter(
    (task) =>
      task.title.toLowerCase().includes(query.toLowerCase()) &&
      (!priorityFilter || task.priority === priorityFilter),
  );

  const [dragOver, setDragOver] = useState(false);
  const moveTask = useKanbanStore((state) => state.moveTask);

  // Both add buttons open the full composer, pre-set to this column.
  const newTaskHref = `/tasks/new?status=${id}`;

  if (!column) return null;

  return (
    <div
      onDragOver={(event) => {
        // Without preventDefault the browser refuses the drop.
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        const payload = event.dataTransfer.getData("application/task");
        if (!payload) return;
        const { taskId, fromColumnId } = JSON.parse(payload) as {
          taskId: string;
          fromColumnId: string;
        };
        if (fromColumnId !== id) void moveTask(fromColumnId, id, taskId);
      }}
      className={`flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg p-3 ${
        dragOver ? "ring-2 ring-[var(--accent)]" : ""
      }`}
      style={{
        background: "var(--base-accent)",
        border: "1px solid var(--base-border)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-sans text-sm font-medium text-[var(--base-primary)]">
          <GripVertical className="h-4 w-4 text-[var(--base-muted-foreground)]" />
          {title}
        </div>
        <div className="flex items-center gap-1 text-[var(--base-muted-foreground)]">
          <Link
            href={newTaskHref}
            aria-label={`Add task to ${title}`}
            className="hover:text-[var(--base-primary)]"
          >
            <Plus className="h-4 w-4" />
          </Link>
          <button className="hover:text-[var(--base-primary)]">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {visibleTasks.map((task) => (
          <TaskCard key={task.id} columnId={id} task={task} />
        ))}
      </div>

      <Link
        href={newTaskHref}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 align-middle font-sans text-xs font-medium text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
      >
        <Plus className="h-3 w-3" />
        Add Task
      </Link>
    </div>
  );
}
