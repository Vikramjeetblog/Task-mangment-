import { create } from "zustand";

type TaskViewStore = {
  view: "board" | "list";
  setView: (view: "board" | "list") => void;
  query: string;
  setQuery: (query: string) => void;
  visibleFields: Record<string, boolean>;
  toggleField: (field: string) => void;
};

export const useTaskViewStore = create<TaskViewStore>((set) => ({
  view: "board",
  setView: (view) => set({ view }),
  query: "",
  setQuery: (query) => set({ query }),
  visibleFields: {
    Priority: true,
    Members: true,
    "Due Date": true,
    Labels: false,
    Status: false,
    Reporter: false,
  },
  toggleField: (field) =>
    set((state) => ({
      visibleFields: { ...state.visibleFields, [field]: !state.visibleFields[field] },
    })),
}));