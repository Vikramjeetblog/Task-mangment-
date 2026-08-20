"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { useKanbanStore } from "../store/useKanbanStore";
import { useTaskViewStore } from "../store/useTaskViewStore";

// Scaled so the 16px icon draws a true 1.5px stroke (see TaskActionsBar).
const ACTION_STROKE = (1.5 * 24) / 16;

const priorityColors: Record<Priority, string> = {
  Urgent: "text-red-500",
  High: "text-red-500",
  Medium: "text-orange-500",
  Low: "text-[var(--base-muted-foreground)]",
};

// Each level draws its own signal glyph — the bars fill up as priority rises.
function PriorityCell({ priority }: { priority: Priority }) {
  const Icon = priorityIcons[priority];
  return (
    <span className={`flex items-center gap-2.5 ${priorityColors[priority]}`}>
      <Icon className="h-3.5 w-3.5" />
      {priority}
    </span>
  );
}

/** Row menu — deleting is the only action so far. */
function RowActions({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto block text-[var(--base-primary)] hover:opacity-70"
        aria-label="Task actions"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={ACTION_STROKE} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-32 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full rounded-md px-3 py-2 text-left font-sans text-xs font-medium text-[var(--base-destructive)] hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function TasksList() {
  const { query, visibleFields, priorityFilter } = useTaskViewStore();
  // The list is the same data as the board, grouped by column instead of
  // laid out in them — so a task added in either view shows up in both.
  const columns = useKanbanStore((state) => state.columns);
  const addTask = useKanbanStore((state) => state.addTask);
  const deleteTask = useKanbanStore((state) => state.deleteTask);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [addingIn, setAddingIn] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  function toggleGroup(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function commitDraft(columnId: string) {
    const title = draftTitle.trim();
    if (title) addTask(columnId, { title });
    setDraftTitle("");
    setAddingIn(null);
  }

  return (
    <div className="flex flex-col gap-6 px-6 pb-6">
      {columns.map((column) => {
        const isCollapsed = collapsed[column.id];
        const rows = column.tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) &&
            (!priorityFilter || task.priority === priorityFilter),
        );

        return (
          <div key={column.id}>
            <button
              onClick={() => toggleGroup(column.id)}
              className="font-sans mb-2 flex items-center gap-1 text-sm font-medium text-[var(--base-primary)]"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
              />
              {column.title}
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto rounded-lg border border-[var(--base-border)]">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--base-border)] bg-[var(--base-accent)]">
                      <th className="min-w-[85px] p-3 align-middle font-sans font-medium text-[var(--base-primary)]">
                        Task
                      </th>
                      {visibleFields.Priority && (
                        <th className="min-w-[85px] p-3 align-middle font-sans font-medium text-[var(--base-primary)]">
                          Priority
                        </th>
                      )}
                      {visibleFields.Members && (
                        <th className="min-w-[85px] p-3 align-middle font-sans font-medium text-[var(--base-primary)]">
                          Members
                        </th>
                      )}
                      {visibleFields["Due Date"] && (
                        <th className="min-w-[85px] p-3 align-middle font-sans font-medium text-[var(--base-primary)]">
                          Due Date
                        </th>
                      )}
                      <th className="min-w-[85px] p-3 text-right align-middle font-sans font-medium text-[var(--base-primary)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr className="border-b border-[var(--base-border)]">
                        <td
                          colSpan={5}
                          className="p-3 text-center align-middle font-sans text-sm text-[var(--base-muted-foreground)]"
                        >
                          {query || priorityFilter
                            ? "No tasks match the current filters"
                            : "No tasks yet"}
                        </td>
                      </tr>
                    )}

                    {rows.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-[var(--base-border)]"
                      >
                        <td className="min-w-[85px] p-3 align-middle text-[var(--base-primary)]">
                          <Link href={`/tasks/${task.id}`} className="hover:underline">
                            {task.title}
                          </Link>
                        </td>
                        {visibleFields.Priority && (
                          <td className="min-w-[85px] p-3 align-middle">
                            <PriorityCell priority={task.priority} />
                          </td>
                        )}
                        {visibleFields.Members && (
                          <td className="min-w-[85px] p-3 align-middle">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                          </td>
                        )}
                        {visibleFields["Due Date"] && (
                          <td className="min-w-[85px] p-3 align-middle text-[var(--base-primary)]">
                            {task.dueDate}
                          </td>
                        )}
                        <td className="min-w-[85px] p-3 text-right align-middle text-[var(--base-primary)]">
                          <RowActions
                            onDelete={() => deleteTask(column.id, task.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {addingIn === column.id ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onBlur={() => commitDraft(column.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commitDraft(column.id);
                      if (event.key === "Escape") {
                        setDraftTitle("");
                        setAddingIn(null);
                      }
                    }}
                    placeholder="Task name"
                    className="h-11 w-full p-3 font-sans text-xs font-medium text-[var(--base-primary)] outline-none placeholder:text-[var(--base-muted-foreground)]"
                  />
                ) : (
                  <button
                    onClick={() => setAddingIn(column.id)}
                    className="flex h-11 w-full items-center p-3 align-middle font-sans text-xs font-medium text-[var(--base-primary)] hover:underline"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
