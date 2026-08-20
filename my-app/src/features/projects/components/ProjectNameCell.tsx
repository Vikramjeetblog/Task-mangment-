"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useProjectsStore } from "../store/useProjectsStore";

/**
 * A project name: a link by default, an input once the pencil is clicked.
 * Kept as its own component so each row owns its draft rather than the table
 * tracking which row is being edited.
 */
export function ProjectNameCell({ id, name }: { id: string; name: string }) {
  const updateProject = useProjectsStore((state) => state.updateProject);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  function commit() {
    const next = draft.trim();
    // A project has to be called something, so a blank name reverts.
    if (!next) {
      setDraft(name);
      setEditing(false);
      return;
    }
    if (next !== name) void updateProject(id, { name: next });
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setDraft(name);
            setEditing(false);
          }
        }}
        aria-label="Project name"
        className="h-6 w-full rounded-md border border-[var(--base-border)] px-2 font-sans text-sm font-medium text-[var(--base-primary)] outline-none"
      />
    );
  }

  return (
    <span className="group flex items-center gap-2">
      <Link
        href={`/projects/${id}`}
        className="align-middle font-sans text-sm font-medium text-[var(--base-primary)] hover:underline"
      >
        {name}
      </Link>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Rename ${name}`}
        className="text-[var(--base-muted-foreground)] opacity-0 transition-opacity hover:text-[var(--base-primary)] focus:opacity-100 group-hover:opacity-100"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </span>
  );
}
