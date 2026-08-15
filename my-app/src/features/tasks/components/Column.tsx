"use client";

import { useState } from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { useKanbanStore } from "../store/useKanbanStore";
import { TaskCard } from "./TaskCard";

const assigneeOptions = ["Admin", "Designer", "QA Team", "Security", "Product", "Engineer"];

export function Column({ id, title }: { id: string; title: string }) {
  const columns = useKanbanStore((state) => state.columns);
  const addTask = useKanbanStore((state) => state.addTask);
  const column = columns.find((c) => c.id === id);

  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Admin");
  const [newTags, setNewTags] = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addTask(id, newTitle.trim(), newAssignee, tagsArray);

    setNewTitle("");
    setNewAssignee("Admin");
    setNewTags("");
    setAdding(false);
  }

  if (!column) return null;

  return (
    <div className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <GripVertical className="h-4 w-4 text-gray-400" />
          {title}
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <button onClick={() => setAdding(true)} className="hover:text-gray-600">
            <Plus className="h-4 w-4" />
          </button>
          <button className="hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} columnId={id} task={task} />
        ))}
      </div>

      {adding ? (
        <div className="flex flex-col gap-2 rounded-md border border-gray-300 bg-white p-2">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title..."
            className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
          />

          <select
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
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
            className="rounded-md border border-gray-200 px-2 py-1 text-sm outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 rounded-md bg-black py-1 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex-1 rounded-md border border-gray-300 py-1 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      )}
    </div>
  );
}