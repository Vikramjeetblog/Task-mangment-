"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { FieldsDropdown } from "./FieldsDropdown";
import { SearchBox } from "@/shared/components/SearchBox";
import { PriorityFilterMenu } from "@/shared/components/PriorityFilterMenu";
import { useTaskViewStore } from "../store/useTaskViewStore";

const STROKE = (1.5 * 24) / 16;

export function TasksHeader() {
  const { query, setQuery, priorityFilter, setPriorityFilter } =
    useTaskViewStore();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        {/* The sidebar toggle lives in the page toolbar above, not here. */}
        <h1 className="font-sans text-lg font-semibold text-[var(--base-primary)]">
          Tasks
        </h1>

        <div className="flex items-center gap-2">
          <SearchBox
            query={query}
            onQueryChange={setQuery}
            placeholder="Search tasks"
          />

          <FieldsDropdown />

          <PriorityFilterMenu
            value={priorityFilter}
            onChange={setPriorityFilter}
          />

          <Link
            href="/tasks/new"
            className="flex h-8 items-center gap-1 rounded-md px-3 font-sans text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            <Plus className="h-4 w-4" strokeWidth={STROKE} />
            <span className="hidden sm:inline">Add Task</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
