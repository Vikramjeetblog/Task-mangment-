import { create } from "zustand";
import type { Priority } from "@/shared/lib/priority";
import {
  createComment,
  createResource,
  createSubtask,
  createTask,
  deleteComment,
  deleteResource,
  deleteSubtask,
  updateSubtask,
  deleteTask,
  listTasks,
  toApiPriority,
  toggleReaction,
  toUiPriority,
  updateTask as updateTaskRequest,
  type ApiStatus,
  type ApiTask,
} from "../api/tasks.api";

export type Subtask = {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  dueDateIso?: string;
  done: boolean;
};

export type TaskComment = {
  id: string;
  body: string;
  author: string;
  postedAt: string;
  parentId?: string;
  reactions: string[];
};

export type TaskResource = { id: string; name: string; url: string };

export type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  dueDateIso?: string;
  tags: string[];
  priority: Priority;
  description?: string;
  subtasks: Subtask[];
  comments: TaskComment[];
  resources: TaskResource[];
};

type Column = {
  id: ApiStatus;
  title: string;
  tasks: Task[];
};

export type NewTaskInput = {
  title: string;
  assignee?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: string;
  description?: string;
};

/** The board's columns are fixed; tasks are bucketed into them by status. */
const COLUMN_DEFS: { id: ApiStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "completed", title: "Completed" },
  { id: "onhold", title: "On Hold" },
];

type KanbanStore = {
  columns: Column[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  addTask: (columnId: string, input: NewTaskInput) => Promise<string>;
  updateTask: (
    columnId: string,
    taskId: string,
    updates: Partial<Task>,
  ) => Promise<void>;
  deleteTask: (columnId: string, taskId: string) => Promise<void>;
  moveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string,
  ) => Promise<void>;
  setTaskPriority: (taskId: string, priority: Priority) => Promise<void>;
  setTaskDueDate: (taskId: string, isoDate: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  setSubtaskPriority: (
    taskId: string,
    subtaskId: string,
    priority: Priority,
  ) => Promise<void>;
  setTaskAssignee: (taskId: string, assignee: string) => Promise<void>;
  setSubtaskDueDate: (
    taskId: string,
    subtaskId: string,
    isoDate: string,
  ) => Promise<void>;
  removeSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (
    taskId: string,
    body: string,
    parentId?: string,
  ) => Promise<void>;
  removeComment: (taskId: string, commentId: string) => Promise<void>;
  reactToComment: (
    taskId: string,
    commentId: string,
    emoji: string,
  ) => Promise<void>;
  addResource: (taskId: string, name: string, url: string) => Promise<void>;
  removeResource: (taskId: string, resourceId: string) => Promise<void>;
};

function toTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assignee: task.assignee ?? "Unassigned",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No date",
    dueDateIso: task.dueDate,
    tags: task.labels,
    priority: toUiPriority(task.priority),
    subtasks: task.subtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
      priority: toUiPriority(subtask.priority),
      dueDate: subtask.dueDate
        ? new Date(subtask.dueDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date",
      dueDateIso: subtask.dueDate,
      done: subtask.done,
    })),
    comments: task.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      author: comment.author.name,
      postedAt: new Date(comment.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      parentId: comment.parentId,
      reactions: comment.reactions ?? [],
    })),
    resources: task.resources ?? [],
  };
}

/** Buckets the flat task list from the API into the board's columns. */
function toColumns(tasks: ApiTask[]): Column[] {
  return COLUMN_DEFS.map((def) => ({
    ...def,
    tasks: tasks.filter((task) => task.status === def.id).map(toTask),
  }));
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  columns: toColumns([]),
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      set({ columns: toColumns(await listTasks()), loading: false });
    } catch {
      set({ error: "Couldn't load tasks.", loading: false });
    }
  },

  addTask: async (columnId, input) => {
    const created = await createTask({
      title: input.title,
      description: input.description,
      status: columnId as ApiStatus,
      priority: input.priority ? toApiPriority(input.priority) : undefined,
      assignee: input.assignee,
      dueDate: input.dueDate,
      labels: input.tags,
    });
    await get().load();
    return created.id;
  },

  updateTask: async (_columnId, taskId, updates) => {
    await updateTaskRequest(taskId, {
      title: updates.title,
      description: updates.description,
      assignee: updates.assignee,
      labels: updates.tags,
      priority: updates.priority ? toApiPriority(updates.priority) : undefined,
    });
    await get().load();
  },

  deleteTask: async (_columnId, taskId) => {
    await deleteTask(taskId);
    await get().load();
  },

  // Moving a task between columns is just a status change.
  moveTask: async (_fromColumnId, toColumnId, taskId) => {
    await updateTaskRequest(taskId, { status: toColumnId as ApiStatus });
    await get().load();
  },

  setTaskPriority: async (taskId, priority) => {
    await updateTaskRequest(taskId, { priority: toApiPriority(priority) });
    await get().load();
  },

  setTaskDueDate: async (taskId, isoDate) => {
    await updateTaskRequest(taskId, { dueDate: isoDate });
    await get().load();
  },

  addSubtask: async (taskId, title) => {
    await createSubtask(taskId, title);
    await get().load();
  },

  setSubtaskPriority: async (taskId, subtaskId, priority) => {
    await updateSubtask(taskId, subtaskId, { priority: toApiPriority(priority) });
    await get().load();
  },

  setTaskAssignee: async (taskId, assignee) => {
    await updateTaskRequest(taskId, { assignee });
    await get().load();
  },

  setSubtaskDueDate: async (taskId, subtaskId, isoDate) => {
    await updateSubtask(taskId, subtaskId, { dueDate: isoDate });
    await get().load();
  },

  removeSubtask: async (taskId, subtaskId) => {
    await deleteSubtask(taskId, subtaskId);
    await get().load();
  },

  addComment: async (taskId, body, parentId) => {
    await createComment(taskId, body, parentId);
    await get().load();
  },

  removeComment: async (taskId, commentId) => {
    await deleteComment(taskId, commentId);
    await get().load();
  },

  reactToComment: async (taskId, commentId, emoji) => {
    await toggleReaction(taskId, commentId, emoji);
    await get().load();
  },

  addResource: async (taskId, name, url) => {
    await createResource(taskId, name, url);
    await get().load();
  },

  removeResource: async (taskId, resourceId) => {
    await deleteResource(taskId, resourceId);
    await get().load();
  },
}));
