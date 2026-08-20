"use client";

import { useState } from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { useKanbanStore } from "../store/useKanbanStore";
import { useTaskViewStore } from "../store/useTaskViewStore";
import { TaskCard } from "./TaskCard";

const assigneeOptions = [
  "Admin",
  "Designer",
  "QA Team",
  "Security",
  "Product",
  "Engineer",
];

export function Column({ id, title }: { id: string; title: string }) {
  const columns = useKanbanStore((state) => state.columns);
  const addTask = useKanbanStore((state) => state.addTask);
  const column = columns.find((c) => c.id === id);
  const query = useTaskViewStore((state) => state.query);
  const priorityFilter = useTaskViewStore((state) => state.priorityFilter);

  // The board honours the same search box and priority filter as the list view.
  const visibleTasks = (column?.tasks ?? []).filter(
    (task) =>
      task.title.toLowerCase().includes(query.toLowerCase()) &&
      (!priorityFilter || task.priority === priorityFilter),
  );

  const [adding, setAdding] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Admin");
  const [newTags, setNewTags] = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addTask(id, {
      title: newTitle.trim(),
      assignee: newAssignee,
      tags: tagsArray,
    });

    setNewTitle("");
    setNewAssignee("Admin");
    setNewTags("");
    setAdding(false);
  }

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
          <button
            onClick={() => setAdding(true)}
            className="hover:text-[var(--base-primary)]"
          >
            <Plus className="h-4 w-4" />
          </button>
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

      {adding ? (
        <div className="flex flex-col gap-2 rounded-md border bg-[var(--base-popover)] p-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title..."
            className="rounded-md border px-2 py-1 text-sm outline-none"
          />

          <select
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            className="rounded-md border px-2 py-1 text-sm outline-none"
          >
            {assigneeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <input
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="rounded-md border px-2 py-1 text-sm outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              style={{ background: "var(--accent)" }}
            className="flex-1 rounded-md py-1 text-sm font-medium text-white"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex-1 rounded-md border py-1 text-sm text-[var(--base-muted-foreground)] hover:bg-[var(--base-accent)]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 align-middle font-sans text-xs font-medium text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
        >
          <Plus className="h-3 w-3" />
          Add Task
        </button>
      )}
    </div>
  );
}
