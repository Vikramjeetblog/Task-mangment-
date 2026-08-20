"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useKanbanStore, type Subtask } from "../store/useKanbanStore";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { DatePickerField } from "@/shared/components/DatePickerField";
import { SelectMenu } from "@/shared/components/SelectMenu";

// Scaled so the 16px icon draws a true 1.5px stroke (see TaskActionsBar).
const ACTION_STROKE = (1.5 * 24) / 16;



const priorityColors: Record<Priority, string> = {
  Urgent: "text-red-500",
  High: "text-red-500",
  Medium: "text-orange-500",
  Low: "text-[var(--base-muted-foreground)]",
};

const priorityOptions = (["Urgent", "High", "Medium", "Low"] as Priority[]).map(
  (level) => {
    const Icon = priorityIcons[level];
    return {
      value: level,
      label: level,
      className: priorityColors[level],
      adornment: <Icon className="h-3.5 w-3.5" />,
    };
  },
);

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

/** Subtasks inherit the task's assignee — the API has no per-subtask member. */
function MemberCell({ member }: { member: string }) {
  if (!member || member === "Unassigned") {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--base-secondary)] text-[var(--base-muted-foreground)]">
        +
      </div>
    );
  }
  return (
    <div
      title={member}
      className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-medium text-white"
    >
      {member.charAt(0).toUpperCase()}
    </div>
  );
}

/** Row menu — the only action so far is removing the subtask. */
function RowActions({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto block text-[var(--base-primary)] hover:opacity-70"
        aria-label="Subtask actions"
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

export function SubtasksTable({
  taskId,
  subtasks,
  assignee,
}: {
  taskId: string;
  subtasks: Subtask[];
  assignee: string;
}) {
  const addSubtask = useKanbanStore((state) => state.addSubtask);
  const removeSubtask = useKanbanStore((state) => state.removeSubtask);
  const setSubtaskDueDate = useKanbanStore((state) => state.setSubtaskDueDate);
  const setSubtaskPriority = useKanbanStore(
    (state) => state.setSubtaskPriority,
  );
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  function commitDraft() {
    const title = draftTitle.trim();
    if (title) addSubtask(taskId, title);
    setDraftTitle("");
    setAdding(false);
  }

  return (
    // 633px wide in the design; capped rather than fixed so it reflows on
    // narrow screens. Height (255 = heading + 20px gap + table) comes
    // from the content.
    <div className="mt-6 flex w-full max-w-[633px] flex-col gap-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-fit items-center gap-1 text-sm font-medium text-[var(--base-primary)]"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
        />
        Subtasks
      </button>

      {expanded && (
        <div className="overflow-x-auto rounded-md border border-[var(--base-border)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="min-w-[85px] p-3 align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                  Task
                </th>
                <th className="min-w-[85px] p-3 align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                  Priority
                </th>
                <th className="min-w-[85px] p-3 align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                  Members
                </th>
                <th className="min-w-[85px] p-3 align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                  Due Date
                </th>
                <th className="min-w-[85px] p-3 text-right align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((subtask) => (
                <tr key={subtask.id} className="border-b">
                  <td className="min-w-[85px] p-3 align-middle font-sans text-xs font-medium text-[var(--base-primary)]">
                    {subtask.title}
                  </td>
                  <td className="min-w-[85px] p-3">
                    <SelectMenu
                      value={subtask.priority}
                      options={priorityOptions}
                      align="left"
                      onChange={(next) =>
                        void setSubtaskPriority(taskId, subtask.id, next)
                      }
                    />
                  </td>
                  <td className="min-w-[85px] p-3">
                    <MemberCell member={assignee} />
                  </td>
                  <td className="min-w-[85px] p-3 align-middle font-sans text-sm font-normal text-[var(--base-primary)]">
                    <DatePickerField
                      variant="plain"
                      value={
                        subtask.dueDateIso ? new Date(subtask.dueDateIso) : null
                      }
                      onChange={(date) =>
                        void setSubtaskDueDate(
                          taskId,
                          subtask.id,
                          date.toISOString(),
                        )
                      }
                    />
                  </td>
                  <td className="min-w-[85px] p-3 text-right align-middle text-[var(--base-primary)]">
                    <RowActions
                      onDelete={() => removeSubtask(taskId, subtask.id)}
                    />
                  </td>
                </tr>
              ))}

              {/* Sits inside the table as the final row, so it lines up with the
                  columns and keeps the same row height */}
              <tr>
                <td colSpan={5} className="p-3">
                  {adding ? (
                    <input
                      autoFocus
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      onBlur={commitDraft}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") commitDraft();
                        if (event.key === "Escape") {
                          setDraftTitle("");
                          setAdding(false);
                        }
                      }}
                      placeholder="Subtask name"
                      className="h-5 w-full font-sans text-xs font-medium text-[var(--base-primary)] outline-none placeholder:text-[var(--base-muted-foreground)]"
                    />
                  ) : (
                    <button
                      onClick={() => setAdding(true)}
                      className="flex h-5 items-center gap-2.5 align-middle font-sans text-xs font-medium text-[var(--base-primary)] hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Add Subtasks
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
