import { create } from 'zustand';

export const useFilterStore = create((set) => ({
    dateRange: { start: null, end: null, label: 'Last 7 Days' },
    filters: {}, // Generic key-value filters

    setDateRange: (range) => set({ dateRange: range }),
    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),
    clearFilters: () => set({ filters: {} })
}));
