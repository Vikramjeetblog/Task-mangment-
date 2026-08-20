"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, Plus, Signal } from "lucide-react";
import type { Task } from "../store/useKanbanStore";

/**
 * Activity for one task. The API stores no separate audit log, so this is
 * derived from what the task itself records: when it was created, each comment,
 * and each subtask added.
 */
type Update = {
  id: string;
  icon: "created" | "comment" | "subtask";
  who: string;
  what: string;
  when: string;
};

const iconStyles = {
  created: { Icon: Signal, tint: "text-red-500", bg: "bg-[var(--base-destructive-foreground)]" },
  comment: { Icon: MessageSquare, tint: "text-blue-500", bg: "bg-blue-50" },
  subtask: { Icon: Plus, tint: "text-emerald-600", bg: "bg-emerald-50" },
};

function buildUpdates(task: Task, reporter: string): Update[] {
  const updates: Update[] = [
    {
      id: "created",
      icon: "created",
      who: reporter,
      what: `created this task with ${task.priority.toLowerCase()} priority`,
      when: task.dueDate === "No date" ? "" : "",
    },
  ];

  for (const subtask of task.subtasks) {
    updates.push({
      id: `subtask-${subtask.id}`,
      icon: "subtask",
      who: reporter,
      what: `added subtask “${subtask.title}”`,
      when: subtask.dueDate === "No date" ? "" : `due ${subtask.dueDate}`,
    });
  }

  for (const comment of task.comments) {
    updates.push({
      id: `comment-${comment.id}`,
      icon: "comment",
      who: comment.author,
      what: `commented “${comment.body}”`,
      when: comment.postedAt,
    });
  }

  return updates;
}

export function UpdatesPanel({
  task,
  reporter,
}: {
  task: Task;
  reporter: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const updates = buildUpdates(task, reporter);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--base-border)] p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-fit items-center gap-1 align-middle font-sans text-sm font-medium text-[var(--base-primary)]"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
        />
        Updates
      </button>

      {expanded && (
        <div className="flex max-h-[320px] flex-col gap-4 overflow-y-auto pr-1">
          {updates.map((update) => {
            const { Icon, tint, bg } = iconStyles[update.icon];
            return (
              <div
                key={update.id}
                className="flex min-w-[85px] shrink-0 items-start gap-2"
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${bg}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${tint}`} />
                </span>
                <div className="min-w-0">
                  <p className="align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
                    {update.who}
                  </p>
                  <p className="truncate align-middle font-sans text-sm font-normal text-[var(--base-muted-foreground)]">
                    {update.what}
                    {update.when ? ` · ${update.when}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
