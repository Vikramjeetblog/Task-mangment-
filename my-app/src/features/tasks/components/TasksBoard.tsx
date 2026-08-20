"use client";

import { useKanbanStore } from "../store/useKanbanStore";
import { Column } from "./Column";
import { ColumnSkeleton } from "@/shared/components/Skeleton";

export function TasksBoard() {
  const columns = useKanbanStore((state) => state.columns);
  const loading = useKanbanStore((state) => state.loading);
  const error = useKanbanStore((state) => state.error);

  if (error) {
    return (
      <p className="px-6 pb-6 font-sans text-sm text-[var(--base-destructive)]">
        {error}
      </p>
    );
  }

  if (loading && columns.every((column) => column.tasks.length === 0)) {
    return (
      <div className="flex items-start gap-4 overflow-x-auto px-6 pb-6">
        {columns.map((column) => (
          <ColumnSkeleton key={column.id} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 overflow-x-auto px-6 pb-6">
      {columns.map((col) => (
        <Column key={col.id} id={col.id} title={col.title} />
      ))}
    </div>
  );
}
