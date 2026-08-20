"use client";

import { useRef, useState } from "react";
import { useKanbanStore } from "../store/useKanbanStore";

/**
 * The task's title and description, editable in place. Both keep the plain
 * typography of the design until focused, so the block reads as text rather
 * than as a form, and each saves on blur.
 */
export function TaskHeading({
  columnId,
  taskId,
  title,
  description,
}: {
  columnId: string;
  taskId: string;
  title: string;
  description?: string;
}) {
  const updateTask = useKanbanStore((state) => state.updateTask);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDescription, setDraftDescription] = useState(description ?? "");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // A title is the only way to identify a task, so an empty one reverts
  // instead of saving.
  function commitTitle() {
    const next = draftTitle.trim();
    if (!next) {
      setDraftTitle(title);
      return;
    }
    if (next !== title) void updateTask(columnId, taskId, { title: next });
  }

  function commitDescription() {
    const next = draftDescription.trim();
    if (next !== (description ?? "")) {
      void updateTask(columnId, taskId, { description: next });
    }
  }

  /** Grows the box with its content so long descriptions don't scroll. */
  function autoSize() {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <div className="flex w-full max-w-[581px] flex-col gap-1.5">
      <input
        value={draftTitle}
        onChange={(event) => setDraftTitle(event.target.value)}
        onBlur={commitTitle}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setDraftTitle(title);
            event.currentTarget.blur();
          }
        }}
        aria-label="Task title"
        className="w-full rounded-md border border-transparent bg-transparent font-sans text-2xl font-semibold tracking-[-0.4px] text-[var(--base-primary)] outline-none hover:border-[var(--base-border)] focus:border-[var(--base-border)]"
      />
      <textarea
        ref={descriptionRef}
        rows={1}
        value={draftDescription}
        onChange={(event) => {
          setDraftDescription(event.target.value);
          autoSize();
        }}
        onFocus={autoSize}
        onBlur={commitDescription}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setDraftDescription(description ?? "");
            event.currentTarget.blur();
          }
        }}
        placeholder="Add a description…"
        aria-label="Task description"
        className="w-full resize-none rounded-md border border-transparent bg-transparent font-sans text-sm text-[var(--base-muted-foreground)] outline-none hover:border-[var(--base-border)] focus:border-[var(--base-border)] placeholder:text-[var(--base-muted-foreground)]"
      />
    </div>
  );
}
