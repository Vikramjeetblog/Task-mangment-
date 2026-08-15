import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";
import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <SettingsSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}