import { create } from "zustand";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  tags: string[];
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type KanbanStore = {
  columns: Column[];
  addTask: (columnId: string, title: string, assignee: string, tags: string[]) => void;
  updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (fromColumnId: string, toColumnId: string, taskId: string) => void;
};

export const useKanbanStore = create<KanbanStore>((set) => ({
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "1", title: "Write API Documentation", assignee: "Admin", dueDate: "29 Jul", tags: ["Deployment", "Deployment"] },
        { id: "2", title: "Implement Search Function", assignee: "Admin", dueDate: "29 Jul", tags: ["Deployment", "Deployment"] },
        { id: "3", title: "Deploy to Production", assignee: "Admin", dueDate: "29 Jul", tags: ["Deployment", "Deployment"] },
      ],
    },
    {
      id: "doing",
      title: "Doing",
      tasks: [
        { id: "4", title: "Code Review Completed", assignee: "Admin", dueDate: "29 Jul", tags: ["Deployment", "Deployment"] },
        { id: "5", title: "Design Mockups Finalized", assignee: "Admin", dueDate: "29 Jul", tags: ["Deployment", "Deployment"] },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [
        { id: "6", title: "Feature Testing Passed", assignee: "QA Team", dueDate: "30 Jul", tags: ["Testing", "Passed"] },
        { id: "7", title: "UI Design Updated", assignee: "Designer", dueDate: "31 Jul", tags: ["Design", "Updated"] },
        { id: "8", title: "Security Audit Scheduled", assignee: "Security", dueDate: "01 Aug", tags: ["Audit", "Scheduled"] },
      ],
    },
    {
      id: "onhold",
      title: "On Hold",
      tasks: [
        { id: "9", title: "UI Review", assignee: "Design", dueDate: "29 Jul", tags: ["Design", "Review"] },
        { id: "10", title: "Backend Integration", assignee: "Dev Team", dueDate: "30 Jul", tags: ["Dev", "Deployment"] },
        { id: "11", title: "User Feedback Review", assignee: "Product", dueDate: "31 Jul", tags: ["Product", "Research"] },
        { id: "12", title: "Performance Optimization", assignee: "Engineer", dueDate: "01 Aug", tags: ["Engineering", "Optimization"] },
      ],
    },
  ],
  addTask: (columnId, title, assignee, tags) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, { id: Date.now().toString(), title, assignee, dueDate: "TBD", tags }] }
          : col
      ),
    })),
  updateTask: (columnId, taskId, updates) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
            }
          : col
      ),
    })),
  deleteTask: (columnId, taskId) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
      ),
    })),
  moveTask: (fromColumnId, toColumnId, taskId) =>
    set((state) => {
      const fromCol = state.columns.find((c) => c.id === fromColumnId);
      const task = fromCol?.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      return {
        columns: state.columns.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          if (col.id === toColumnId) {
            return { ...col, tasks: [...col.tasks, task] };
          }
          return col;
        }),
      };
    }),
}));