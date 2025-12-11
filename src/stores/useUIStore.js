import { create } from 'zustand'

export const useUIStore = create((set) => ({
    isSidebarOpen: false,
    currentView: 'dashboard', // 'dashboard' | 'settings'
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
    setView: (view) => set({ currentView: view }),
}))
