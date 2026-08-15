"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Calendar, Tag, Trash2, Pencil, ArrowRightLeft, ChevronRight } from "lucide-react";
import { useKanbanStore } from "../store/useKanbanStore";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  tags: string[];
};

const assigneeOptions = ["Admin", "Designer", "QA Team", "Security", "Product", "Engineer"];

export function TaskCard({ columnId, task }: { columnId: string; task: Task }) {
  const columns = useKanbanStore((state) => state.columns);
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editAssignee, setEditAssignee] = useState(task.assignee);
  const [editTags, setEditTags] = useState(task.tags.join(", "));

  const otherColumns = columns.filter((c) => c.id !== columnId);

  function handleSave() {
    const tagsArray = editTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    updateTask(columnId, task.id, { title: editTitle, assignee: editAssignee, tags: tagsArray });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-3">
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
        />
        <select
          value={editAssignee}
          onChange={(e) => setEditAssignee(e.target.value)}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
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
          className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-md bg-black py-1 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-md border border-gray-300 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <Link href="/tasks/1" className="text-sm font-medium text-gray-900 hover:underline">
          {task.title}
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-2 top-8 z-10 w-36 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
          <button
            onClick={() => {
              setEditing(true);
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <div className="relative">
            <button
              onClick={() => setMoveMenuOpen(!moveMenuOpen)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-1.5">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Move to
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {moveMenuOpen && (
              <div className="absolute left-full top-0 ml-1 w-36 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
                {otherColumns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      moveTask(columnId, col.id, task.id);
                      setMoveMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
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
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
          <span className="text-xs text-gray-500">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
          <Calendar className="h-3 w-3" />
          {task.dueDate}
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}