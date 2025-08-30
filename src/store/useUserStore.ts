//src/store/useUserStore.ts
import { create } from "zustand";

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider?: string;
    role?: string;
}

export interface Workspace {
    id: string;
    name: string;
}

interface UserStoreState {
    user: User | null;
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isInitialized: boolean;
    setUser: (user: User | null) => void;
    setWorkspaces: (workspaces: Workspace[]) => void;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    setInitialized: (initialized: boolean) => void;
    logout: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
    user: null,
    workspaces: [],
    currentWorkspace: null,
    isInitialized: false,
    setUser: (user) => set({ user }),
    setWorkspaces: (workspaces) => set({ workspaces }),
    setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
    logout: () => set({ user: null, workspaces: [], currentWorkspace: null, isInitialized: false }),
}));


