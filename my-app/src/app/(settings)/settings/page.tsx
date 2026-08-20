"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { updateProfile } from "@/features/auth/api/auth.api";
import { UserAvatar } from "@/features/auth/components/UserAvatar";

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Form fields start out filled with the current user's data and only get
  // sent to the backend when"Save changes" is clicked.
  const [name, setName] = useState(user?.name ?? "");
  const [title, setTitle] = useState(user?.title ?? "");
  const [username, setUsername] = useState(user?.username ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile({ name, title, username });
      setUser(updatedUser);
      setSaved(true);
    } catch {
      setError("Couldn't save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    // Content starts below the sidebar's "Profile" nav item,
    // which ends 118px down, past the "Back to app" link and the search box.
    <div className="px-4 pb-8 pt-8 sm:px-8 lg:pt-[118px]">
      {/* 640px wide in the design, with 48px between the two sections */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="font-sans text-2xl font-medium leading-none text-[var(--base-primary)]">
            Profile
          </h1>

          <div className="rounded-lg border border-[var(--base-border)] p-5">
          <div className="flex items-center justify-between border-b py-3">
            <span className="font-sans text-xs font-medium text-[var(--base-primary)]">Profile picture</span>
            <UserAvatar user={user} size={40} />
          </div>

          <div className="flex items-center justify-between border-b py-3">
            <span className="font-sans text-xs font-medium text-[var(--base-primary)]">Email</span>
            <div className="flex items-center gap-2">
              {/* Guest accounts don't have an email, so there's nothing to edit here */}
              <span className="font-sans text-sm text-[var(--base-primary)]">
                {user?.email ?? "Guest account"}
              </span>
              {user?.email && (
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--base-secondary)] text-[var(--base-primary)] hover:bg-gray-200">
                  <Pencil
                    className="h-3.5 w-3.5"
                    strokeWidth={(1.5 * 24) / 14}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-b py-3">
            <span className="font-sans text-xs font-medium text-[var(--base-primary)]">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-9 w-[180px] max-w-[180px] rounded-md border border-transparent bg-[var(--base-input)]/50 px-3 py-1 font-sans text-sm font-normal text-[var(--base-muted-foreground)] outline-none placeholder:text-[var(--base-muted-foreground)]"
            />
          </div>

          <div className="flex items-center justify-between border-b py-3">
            <div>
              <p className="font-sans text-xs font-medium text-[var(--base-primary)]">Title</p>
              <p className="font-sans text-xs font-normal text-[var(--base-primary)]">Your job title or role</p>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Designer"
              className="h-9 w-[180px] max-w-[180px] rounded-md border border-transparent bg-[var(--base-input)]/50 px-3 py-1 font-sans text-sm font-normal text-[var(--base-muted-foreground)] outline-none placeholder:text-[var(--base-muted-foreground)]"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-sans text-xs font-medium text-[var(--base-primary)]">Username</p>
              <p className="font-sans text-xs font-normal text-[var(--base-primary)]">
                One word, like a nickname or first name
              </p>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Dexuser"
              className="h-9 w-[180px] max-w-[180px] rounded-md border border-transparent bg-[var(--base-input)]/50 px-3 py-1 font-sans text-sm font-normal text-[var(--base-muted-foreground)] outline-none placeholder:text-[var(--base-muted-foreground)]"
            />
          </div>
        </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{ background: "var(--accent)" }}
              className="rounded-md px-4 py-2 font-sans text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-sans text-base font-medium leading-none text-[var(--base-primary)]">
            Workspace access
          </h2>
          <div className="flex h-[82px] items-center justify-between gap-3 rounded-lg border border-[var(--base-border)] px-4 shadow-[0px_1px_1px_0px_#0000000A,0px_3px_6px_-2px_#00000005,0px_0px_0px_0.5px_#00000016]">
            <span className="font-sans text-xs font-medium text-gray-500">
              Remove yourself from the workspace
            </span>
            <button className="flex h-8 w-[126px] items-center justify-center gap-1 rounded-md bg-[#DC26261A] px-3 py-2 align-middle font-sans text-xs font-medium whitespace-nowrap text-[var(--base-destructive)] hover:bg-[#DC262633]">
              Leave Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
