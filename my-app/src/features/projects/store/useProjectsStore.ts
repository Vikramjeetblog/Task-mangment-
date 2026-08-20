import { create } from "zustand";
import type { Priority } from "@/shared/lib/priority";
import { toApiPriority, toUiPriority } from "@/features/tasks/api/tasks.api";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
  type ApiProject,
} from "../api/projects.api";

export type NewProjectInput = {
  name: string;
  priority?: Priority;
  lead?: string;
  dueDate?: string;
};

export type Project = {
  id: string;
  name: string;
  priority: Priority;
  lead: string;
  /** Formatted for display. */
  dueDate: string;
  /** Raw value, for the date picker. */
  dueDateIso?: string;
};

type ProjectsStore = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  addProject: (input: NewProjectInput) => Promise<void>;
  updateProject: (
    id: string,
    changes: { name?: string; priority?: Priority; dueDate?: string },
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // View state for the projects toolbar — kept beside the data so the search
  // box and filter menu don't have to thread props through the table.
  query: string;
  setQuery: (query: string) => void;
  priorityFilter: Priority | null;
  setPriorityFilter: (priority: Priority | null) => void;
};

function toProject(project: ApiProject): Project {
  return {
    id: project.id,
    name: project.name,
    priority: toUiPriority(project.priority),
    lead: project.lead ?? "+",
    dueDateIso: project.dueDate,
    dueDate: project.dueDate
      ? new Date(project.dueDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No date",
  };
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await listProjects();
      set({ projects: projects.map(toProject), loading: false });
    } catch {
      set({ error: "Couldn't load projects.", loading: false });
    }
  },

  updateProject: async (id, changes) => {
    await updateProject(id, {
      name: changes.name,
      priority: changes.priority ? toApiPriority(changes.priority) : undefined,
      dueDate: changes.dueDate,
    });
    await get().load();
  },

  addProject: async (input) => {
    await createProject({
      name: input.name,
      priority: input.priority ? toApiPriority(input.priority) : undefined,
      lead: input.lead,
      dueDate: input.dueDate,
    });
    await get().load();
  },

  deleteProject: async (id) => {
    await deleteProject(id);
    await get().load();
  },

  query: "",
  setQuery: (query) => set({ query }),
  priorityFilter: null,
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
}));
