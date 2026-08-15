"use client";

import { useKanbanStore } from "../store/useKanbanStore";
import { Column } from "./Column";

export function TasksBoard() {
  const columns = useKanbanStore((state) => state.columns);

  return (
    <div className="flex gap-4 overflow-x-auto px-6 pb-6">
      {columns.map((col) => (
        <Column key={col.id} id={col.id} title={col.title} />
      ))}
    </div>
  );
}