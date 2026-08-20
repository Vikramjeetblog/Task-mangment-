"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/layout/components/Sidebar";
import { useLayoutStore } from "@/features/layout/store/useLayoutStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { getMe } from "@/features/auth/api/auth.api";
import { useKanbanStore } from "@/features/tasks/store/useKanbanStore";
import { useProjectsStore } from "@/features/projects/store/useProjectsStore";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const loadTasks = useKanbanStore((state) => state.load);
  const loadProjects = useProjectsStore((state) => state.load);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    // Refresh the cached user on load - picks up profile changes (like a new
    // Google photo) and logs out if the token has expired or is invalid.
    getMe()
      .then(setUser)
      .catch(() => {
        logout();
        router.replace("/login");
      });
  }, [hasHydrated, token, router, setUser, logout]);

  // Tasks and projects come from the API, so fetch them once the token is in place.
  useEffect(() => {
    if (!token) return;
    void loadTasks();
    void loadProjects();
  }, [token, loadTasks, loadProjects]);

  // Sidebar defaults to open (desktop layout), so on small screens we close
  // it once on load - otherwise it'd push the page content off-screen.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      closeSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasHydrated || !token) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <>
          {/* Backdrop only shows on mobile, where the sidebar floats over the page instead of pushing it */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:static">
            <Sidebar />
          </div>
        </>
      )}
      {/* Sidebar is height-locked to the viewport, so content scrolls in its
          own box instead of the whole page - otherwise the sidebar's
          background would run out partway down on tall pages. */}
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
