"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Calendar,
  Tag,
  Trash2,
  Pencil,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import { useKanbanStore } from "../store/useKanbanStore";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { UserAvatar } from "@/features/auth/components/UserAvatar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  tags: string[];
};

const assigneeOptions = [
  "Admin",
  "Designer",
  "QA Team",
  "Security",
  "Product",
  "Engineer",
];

export function TaskCard({ columnId, task }: { columnId: string; task: Task }) {
  const columns = useKanbanStore((state) => state.columns);
  const user = useAuthStore((state) => state.user);
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const menuRef = useDismiss(menuOpen, () => {
    setMenuOpen(false);
    setMoveMenuOpen(false);
  });
  const [editing, setEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editAssignee, setEditAssignee] = useState(task.assignee);
  const [editTags, setEditTags] = useState(task.tags.join(","));

  const otherColumns = columns.filter((c) => c.id !== columnId);

  function handleSave() {
    const tagsArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    updateTask(columnId, task.id, {
      title: editTitle,
      assignee: editAssignee,
      tags: tagsArray,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-[var(--base-popover)] p-3">
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm outline-none"
        />
        <select
          value={editAssignee}
          onChange={(e) => setEditAssignee(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm outline-none"
        >
          {assigneeOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input
          value={editTags}
          onChange={(e) => setEditTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="rounded-md border px-2 py-1 text-sm outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            style={{ background: "var(--accent)" }}
            className="flex-1 rounded-md py-1 text-sm font-medium text-white"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-md border py-1 text-sm text-[var(--base-muted-foreground)] hover:bg-[var(--base-accent)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      draggable
      onDragStart={(event) => {
        // The column id travels with the task so the drop target knows where
        // it came from.
        event.dataTransfer.setData(
          "application/task",
          JSON.stringify({ taskId: task.id, fromColumnId: columnId }),
        );
        event.dataTransfer.effectAllowed = "move";
      }}
      className="relative flex cursor-grab flex-col gap-2 rounded-md p-3 active:cursor-grabbing"
      style={{
        background: "var(--base-background)",
        border: "1px solid var(--base-border)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="align-middle font-sans text-sm font-medium text-[var(--base-foreground)] hover:underline"
        >
          {task.title}
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[var(--base-muted-foreground)] hover:text-[var(--base-primary)]"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-2 top-8 z-10 w-36 rounded-md border bg-[var(--base-popover)] p-1 shadow-lg">
          <button
            onClick={() => {
              setEditing(true);
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <div className="relative">
            <button
              onClick={() => setMoveMenuOpen(!moveMenuOpen)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
            >
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Move to
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {moveMenuOpen && (
              <div className="absolute left-full top-0 ml-1 w-36 rounded-md border bg-[var(--base-popover)] p-1 shadow-lg">
                {otherColumns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      moveTask(columnId, col.id, task.id);
                      setMoveMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              deleteTask(columnId, task.id);
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar user={user} size={32} />
          <span className="align-middle font-sans text-xs font-medium leading-none text-[var(--base-foreground)]">
            {task.assignee}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
          <Calendar className="h-3 w-3" />
          {task.dueDate}
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full bg-[var(--base-secondary)] px-3 py-1 align-middle font-sans text-xs font-medium leading-none text-[var(--base-foreground)]"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
