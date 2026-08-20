"use client";

import { useState } from "react";
import { Calendar, Tag, Paperclip, Plus, X } from "lucide-react";
import type { TaskResource } from "../store/useKanbanStore";

export function TaskProperties({
  assignee,
  dueDate,
  labels,
  resources,
  onAddResource,
  onRemoveResource,
}: {
  assignee: string;
  dueDate: string;
  labels: string[];
  resources: TaskResource[];
  onAddResource: (name: string, url: string) => void;
  onRemoveResource: (resourceId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function reset() {
    setName("");
    setUrl("");
    setAdding(false);
  }

  function save() {
    if (!name.trim() || !url.trim()) return;
    onAddResource(name.trim(), url.trim());
    reset();
  }

  return (
    <div className="mt-6 flex flex-col gap-3 text-sm">
      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 font-sans text-sm font-medium text-[var(--base-muted-foreground)]">Properties</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-roboto text-[13px] font-medium leading-none text-[var(--base-primary)]">
            <div className="h-4 w-4 rounded-full bg-purple-500" />
            {assignee}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
            <Calendar className="h-3 w-3" />
            {dueDate}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 font-sans text-sm font-medium text-[var(--base-muted-foreground)]">Labels</span>
        <div className="flex flex-wrap items-center gap-2">
          {labels.map(
            (label) => (
              <span
                key={label}
                className="flex h-5 items-center gap-1 rounded-3xl border border-transparent bg-[var(--base-secondary)] px-2 py-0.5 font-sans text-xs font-medium text-[var(--base-primary)]"
              >
                <Tag className="h-3 w-3" />
                {label}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 font-sans text-sm font-medium text-[var(--base-muted-foreground)]">
          Resources
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {resources.map((resource) => (
            <span
              key={resource.id}
              className="flex h-6 items-center gap-1 rounded-md border border-[var(--base-border)] px-2 font-sans text-xs text-[var(--base-primary)]"
            >
              <Paperclip className="h-3 w-3" />
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="max-w-[160px] truncate hover:underline"
              >
                {resource.name}
              </a>
              <button
                onClick={() => onRemoveResource(resource.id)}
                aria-label={`Remove ${resource.name}`}
                className="text-[var(--base-muted-foreground)] hover:text-[var(--base-destructive)]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {adding ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                className="h-7 w-28 rounded-md border border-[var(--base-border)] px-2 font-sans text-xs text-[var(--base-primary)] outline-none"
              />
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") save();
                  if (event.key === "Escape") reset();
                }}
                placeholder="Paste a link..."
                className="h-7 w-56 rounded-md border border-[var(--base-border)] px-2 font-sans text-xs text-[var(--base-primary)] outline-none"
              />
              <button
                onClick={save}
                disabled={!name.trim() || !url.trim()}
                style={{ background: "var(--accent)" }}
                className="flex h-7 items-center gap-1 rounded-md px-3 font-sans text-xs font-medium text-white disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 text-[var(--base-muted-foreground)] hover:text-[var(--base-muted-foreground)]"
            >
              <Paperclip className="h-4 w-4" />
              Add document or link...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
