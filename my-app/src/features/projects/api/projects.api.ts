import { apiClient } from "@/shared/lib/api-client";
import type { ApiPriority } from "@/features/tasks/api/tasks.api";

export type ApiProject = {
  id: string;
  name: string;
  priority: ApiPriority;
  dueDate?: string;
  lead?: string;
  createdAt: string;
};

export type CreateProjectPayload = {
  name: string;
  priority?: ApiPriority;
  dueDate?: string;
  lead?: string;
};

export async function listProjects(): Promise<ApiProject[]> {
  const { data } = await apiClient.get<ApiProject[]>("/projects");
  return data;
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<ApiProject> {
  const { data } = await apiClient.post<ApiProject>("/projects", payload);
  return data;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export async function updateProject(
  id: string,
  payload: UpdateProjectPayload,
): Promise<ApiProject> {
  const { data } = await apiClient.patch<ApiProject>(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
