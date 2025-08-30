import { create } from "zustand";

interface UIState {
    sidebarScrollTop: number;
    setSidebarScrollTop: (v: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarScrollTop: 0,
    setSidebarScrollTop: (v) => set({ sidebarScrollTop: v }),
}));


