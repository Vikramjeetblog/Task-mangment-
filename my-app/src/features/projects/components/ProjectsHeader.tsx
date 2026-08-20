"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectsFieldsMenu } from "./ProjectsFieldsMenu";
import { SearchBox } from "@/shared/components/SearchBox";
import { PriorityFilterMenu } from "@/shared/components/PriorityFilterMenu";
import { useProjectsStore } from "../store/useProjectsStore";

const STROKE = (1.5 * 24) / 16;

export function ProjectsHeader() {
  const { query, setQuery, priorityFilter, setPriorityFilter } =
    useProjectsStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
      {/* Sidebar toggle lives in PageToolbar above, so it isn't repeated here */}
      <h1 className="font-sans text-lg font-semibold text-[var(--base-primary)]">
        Projects
      </h1>

      <div className="flex items-center gap-2">
        <SearchBox
          query={query}
          onQueryChange={setQuery}
          placeholder="Search projects"
        />

        <ProjectsFieldsMenu />

        <PriorityFilterMenu
          value={priorityFilter}
          onChange={setPriorityFilter}
        />

        <Link
          href="/projects/new"
          className="flex h-8 items-center gap-1 rounded-md px-3 font-sans text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          <Plus className="h-4 w-4" strokeWidth={STROKE} />
          <span className="hidden sm:inline">Add Project</span>
        </Link>
      </div>
    </div>
  );
}
