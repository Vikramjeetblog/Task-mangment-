"use client";

import { useState } from "react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GalleryVerticalEnd, ChevronsUpDown } from "lucide-react";
import { DashboardSquare03Icon } from "hugeicons-react";
import { WorkspaceMenu } from "@/features/layout/components/WorkspaceMenu";
import { UserAvatar } from "@/features/auth/components/UserAvatar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useLayoutStore } from "@/features/layout/store/useLayoutStore";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: DashboardSquare03Icon },
  { href: "/projects", label: "Projects", icon: GalleryVerticalEnd },
];

export function Sidebar() {
  const pathname = usePathname();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const workspaceRef = useDismiss(workspaceMenuOpen, () =>
    setWorkspaceMenuOpen(false),
  );
  const [navOpen, setNavOpen] = useState(true);
  const user = useAuthStore((state) => state.user);
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);

  // On phones the sidebar floats over the page, so picking a destination
  // should get it out of the way.
  function handleNavigate() {
    if (window.matchMedia("(max-width: 767px)").matches) closeSidebar();
  }

  // Guarded route, so user should always be set here. Fallback just avoids a crash on first render.
  const displayName = user?.name ?? "User";

  return (
    <aside
      className="flex h-full w-[min(16rem,80vw)] flex-col md:w-64"
      style={{
        background: "var(--base-sidebar)",
        borderRight: "1px solid var(--base-border)",
      }}
    >
      <div ref={workspaceRef} className="relative p-3">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-[var(--base-accent)]"
        >
          <div className="flex items-center gap-2">
            <UserAvatar user={user} size={24} />
            <span className="font-sans text-sm font-medium leading-none text-[var(--base-card-foreground)]">
              {displayName}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-[var(--base-card-foreground)]" />
        </button>

        {workspaceMenuOpen && <WorkspaceMenu />}
      </div>

      <div className="flex-1 p-3">
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-[var(--base-accent)]"
        >
          <span className="font-sans text-sm font-medium leading-none text-[var(--base-card-foreground)]">
            Workspace
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--base-card-foreground)] transition-transform ${
              navOpen ? "" : "-rotate-90"
            }`}
          />
        </button>

        {navOpen && (
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium leading-none ${
                    isActive
                      ? "text-[var(--sidebar-accent-foreground)]"
                      : "text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
                  }`}
                  style={
                    isActive
                      ? {
                          background: "var(--accent)",
                          color: "#fff",
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </aside>
  );
}
