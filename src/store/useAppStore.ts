//src/store/useAppStore.ts
import { create } from 'zustand'

// Define your store's state interface
interface AppState {
  // User state
  user: {
    id: string
    name: string
    email: string
  } | null

  // UI state
  theme: 'light' | 'dark'
  isLoading: boolean

  // Actions
  setUser: (user: AppState['user']) => void
  clearUser: () => void
  toggleTheme: () => void
  setLoading: (loading: boolean) => void
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  theme: 'light',
  isLoading: false,

  // Actions
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  setLoading: (isLoading) => set({ isLoading }),
}))

// Optional: Create selectors for better performance
export const useUser = () => useAppStore((state) => state.user)
export const useTheme = () => useAppStore((state) => state.theme)
export const useIsLoading = () => useAppStore((state) => state.isLoading)