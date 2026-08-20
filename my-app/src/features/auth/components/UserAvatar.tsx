"use client";

import Image from "next/image";
import type { PublicUser } from "../store/useAuthStore";

// Google accounts show their real profile photo. Guests don't have one,
// so they fall back to a colored circle with their first initial.
export function UserAvatar({
  user,
  size = 24,
  className = "",
}: {
  user: PublicUser | null;
  size?: number;
  className?: string;
}) {
  const displayName = user?.name ?? "User";
  const initial = displayName.charAt(0).toUpperCase();

  if (user?.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-medium text-white ${className}`}
      style={{
        background: user?.avatarColor ?? "#171717",
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
    >
      {initial}
    </div>
  );
}
