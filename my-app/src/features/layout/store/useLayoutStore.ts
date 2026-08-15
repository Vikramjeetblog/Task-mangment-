import { create } from "zustand";

type LayoutStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));