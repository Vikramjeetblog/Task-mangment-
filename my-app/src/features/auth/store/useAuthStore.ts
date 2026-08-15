import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PublicUser = {
  id: string;
  name: string;
  email?: string;
  avatarColor: string;
  provider: "guest" | "google";
};

type AuthStore = {
  token: string | null;
  user: PublicUser | null;
  hasHydrated: boolean;
  setSession: (session: { token: string; user: PublicUser }) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setSession: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
