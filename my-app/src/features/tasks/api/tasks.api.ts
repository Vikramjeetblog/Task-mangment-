import { apiClient } from "@/shared/lib/api-client";
import type { Priority } from "@/shared/lib/priority";

/** What the API sends back. Priorities and statuses are lower-case there. */
export type ApiPriority = "none" | "urgent" | "high" | "medium" | "low";
export type ApiStatus = "todo" | "doing" | "completed" | "onhold";

export type ApiSubtask = {
  id: string;
  title: string;
  priority: ApiPriority;
  dueDate?: string;
  done: boolean;
};

export type ApiResource = { id: string; name: string; url: string };

export type ApiComment = {
  id: string;
  body: string;
  createdAt: string;
  parentId?: string;
  reactions: string[];
  author: { id: string; name: string; avatarColor?: string };
};

export type ApiTask = {
  id: string;
  title: string;
  description?: string;
  status: ApiStatus;
  priority: ApiPriority;
  assignee?: string;
  dueDate?: string;
  labels: string[];
  projectId?: string;
  subtasks: ApiSubtask[];
  comments: ApiComment[];
  resources: ApiResource[];
  createdAt: string;
};

// The UI labels priorities in title case; the API uses lower case. These two
// keep the translation in one place.
export function toUiPriority(priority: ApiPriority): Priority {
  if (priority === "none") return "Medium";
  return (priority.charAt(0).toUpperCase() + priority.slice(1)) as Priority;
}

export function toApiPriority(priority: Priority): ApiPriority {
  return priority.toLowerCase() as ApiPriority;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: ApiStatus;
  priority?: ApiPriority;
  assignee?: string;
  dueDate?: string;
  labels?: string[];
};

export async function listTasks(): Promise<ApiTask[]> {
  const { data } = await apiClient.get<ApiTask[]>("/tasks");
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<ApiTask> {
  const { data } = await apiClient.post<ApiTask>("/tasks", payload);
  return data;
}

export async function updateTask(
  id: string,
  payload: Partial<CreateTaskPayload>,
): Promise<ApiTask> {
  const { data } = await apiClient.patch<ApiTask>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

// Subtasks and comments are nested, so each call returns the updated task.

export async function createSubtask(
  taskId: string,
  title: string,
  dueDate?: string,
): Promise<ApiTask> {
  const { data } = await apiClient.post<ApiTask>(`/tasks/${taskId}/subtasks`, {
    title,
    dueDate,
  });
  return data;
}

export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  payload: {
    title?: string;
    dueDate?: string;
    done?: boolean;
    priority?: ApiPriority;
  },
): Promise<ApiTask> {
  const { data } = await apiClient.patch<ApiTask>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
    payload,
  );
  return data;
}

export async function deleteSubtask(
  taskId: string,
  subtaskId: string,
): Promise<ApiTask> {
  const { data } = await apiClient.delete<ApiTask>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
  );
  return data;
}

export async function createComment(
  taskId: string,
  body: string,
  parentId?: string,
): Promise<ApiTask> {
  const { data } = await apiClient.post<ApiTask>(`/tasks/${taskId}/comments`, {
    body,
    parentId,
  });
  return data;
}

export async function deleteComment(
  taskId: string,
  commentId: string,
): Promise<ApiTask> {
  const { data } = await apiClient.delete<ApiTask>(
    `/tasks/${taskId}/comments/${commentId}`,
  );
  return data;
}

export async function toggleReaction(
  taskId: string,
  commentId: string,
  emoji: string,
): Promise<ApiTask> {
  const { data } = await apiClient.post<ApiTask>(
    `/tasks/${taskId}/comments/${commentId}/reactions`,
    { emoji },
  );
  return data;
}

export async function createResource(
  taskId: string,
  name: string,
  url: string,
): Promise<ApiTask> {
  const { data } = await apiClient.post<ApiTask>(`/tasks/${taskId}/resources`, {
    name,
    url,
  });
  return data;
}

export async function deleteResource(
  taskId: string,
  resourceId: string,
): Promise<ApiTask> {
  const { data } = await apiClient.delete<ApiTask>(
    `/tasks/${taskId}/resources/${resourceId}`,
  );
  return data;
}
