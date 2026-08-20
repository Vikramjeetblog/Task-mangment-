import { apiClient } from "@/shared/lib/api-client";
import type { PublicUser } from "../store/useAuthStore";

export type SessionResponse = {
  token: string;
  user: PublicUser;
};

export async function guestLogin(): Promise<SessionResponse> {
  const { data } = await apiClient.post<SessionResponse>("/auth/guest");
  return data;
}

export async function getMe(): Promise<PublicUser> {
  const { data } = await apiClient.get<PublicUser>("/auth/me");
  return data;
}

export type UpdateProfilePayload = {
  name?: string;
  title?: string;
  username?: string;
  email?: string;
};

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<PublicUser> {
  const { data } = await apiClient.patch<PublicUser>("/auth/me", payload);
  return data;
}

export function googleLoginUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return `${apiUrl}/auth/google`;
}
