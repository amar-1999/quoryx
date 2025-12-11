import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/stores/useUserStore';

const DEFAULT_LAYOUT = [
    { i: '1', x: 0, y: 0, w: 4, h: 8, type: 'KPI', config: { title: 'Total Revenue', metric: 'revenue', trend: 12.5 } },
    { i: '2', x: 4, y: 0, w: 4, h: 8, type: 'KPI', config: { title: 'Active Users', metric: 'users', trend: -2.4 } },
    { i: '3', x: 8, y: 0, w: 4, h: 8, type: 'KPI', config: { title: 'Bounce Rate', metric: 'bounce_rate', trend: 0.8 } },
    { i: '4', x: 0, y: 8, w: 8, h: 10, type: 'TIMESERIES', config: { title: 'Traffic Overview', metric: 'traffic' } },
    { i: '5', x: 8, y: 8, w: 4, h: 10, type: 'BAR', config: { title: 'Device Breakdown', metric: 'devices' } },
];

export const useDashboardStore = create(
    persist(
        (set, get) => ({
            dashboards: [
                { id: '1', name: 'Main Overview', layout: DEFAULT_LAYOUT, isDefault: true },
                { id: '2', name: 'Sales Performance', layout: [], isDefault: false },
            ],
            currentDashboardId: '1',

            setCurrentDashboard: (id) => set({ currentDashboardId: id }),

            renameDashboard: (id, newName) => {
                if (!newName.trim()) return;
                set((state) => ({
                    dashboards: state.dashboards.map(d =>
                        d.id === id ? { ...d, name: newName } : d
                    )
                }));
            },

            addWidget: async (type, customConfig = {}) => {
                const state = get();
                const newId = Math.random().toString(36).substr(2, 9);
                let w = 4, h = 8;
                let title = 'New Widget';

                if (type === 'TIMESERIES') { w = 8; h = 10; title = 'New Analysis'; }
                if (type === 'TABLE') { w = 8; h = 10; title = 'Data Table'; }
                if (type === 'TOPN') { w = 4; h = 10; title = 'Top Performers'; }
                if (type === 'PIE') { w = 4; h = 8; title = 'Distribution'; }

                if (customConfig.title) title = customConfig.title;

                const currentDash = state.dashboards.find(d => d.id === state.currentDashboardId);
                const maxY = currentDash?.layout.reduce((max, item) => Math.max(max, item.y + item.h), 0) || 0;

                const newWidget = {
                    i: newId,
                    x: 0,
                    y: maxY,
                    w,
                    h,
                    type,
                    config: {
                        title,
                        metric: 'default',
                        ...customConfig
                    }
                };

                const updatedDashboards = state.dashboards.map(d =>
                    d.id === state.currentDashboardId
                        ? { ...d, layout: [...d.layout, newWidget] }
                        : d
                );

                set({ dashboards: updatedDashboards });

                // Persistence Layer
                const user = useUserStore.getState().user;
                if (user && user.id !== 'guest' && supabase) {
                    const updatedDashboard = updatedDashboards.find(d => d.id === state.currentDashboardId);
                    try {
                        const { error } = await supabase
                            .from('dashboards')
                            .update({ layout: updatedDashboard.layout })
                            .eq('id', state.currentDashboardId);

                        if (error) console.error("Failed to save widget to Supabase:", error);
                    } catch (err) {
                        console.error("Supabase sync error:", err);
                    }
                }
            },

            createDashboard: () => {
                const newId = Math.random().toString(36).substr(2, 9);
                const newDashboard = {
                    id: newId,
                    name: `New Dashboard ${get().dashboards.length + 1}`,
                    layout: [],
                    isDefault: false
                };
                set((state) => ({
                    dashboards: [...state.dashboards, newDashboard],
                    currentDashboardId: newId
                }));
            },

            deleteDashboard: (id) => {
                const state = get();
                // Prevent deleting the last dashboard
                if (state.dashboards.length <= 1) return;

                const newDashboards = state.dashboards.filter(d => d.id !== id);
                let newCurrentId = state.currentDashboardId;

                // If deleting current, switch to first available
                if (id === state.currentDashboardId) {
                    newCurrentId = newDashboards[0].id;
                }

                set({
                    dashboards: newDashboards,
                    currentDashboardId: newCurrentId
                });
            },

            updateLayout: (id, newLayout) => {
                set((state) => ({
                    dashboards: state.dashboards.map(d =>
                        d.id === id ? { ...d, layout: newLayout } : d
                    )
                }));
            },

            updateWidgetConfig: (widgetId, newConfig) => {
                set((state) => {
                    const dashboard = state.dashboards.find(d => d.id === state.currentDashboardId);
                    if (!dashboard) return state;

                    const newLayout = dashboard.layout.map(item =>
                        item.i === widgetId
                            ? { ...item, config: { ...item.config, ...newConfig } }
                            : item
                    );

                    return {
                        dashboards: state.dashboards.map(d =>
                            d.id === state.currentDashboardId
                                ? { ...d, layout: newLayout }
                                : d
                        )
                    };
                });
            },

            removeWidget: (widgetId) => {
                set((state) => {
                    const dashboard = state.dashboards.find(d => d.id === state.currentDashboardId);
                    if (!dashboard) return state;

                    const newLayout = dashboard.layout.filter(item => item.i !== widgetId);

                    return {
                        dashboards: state.dashboards.map(d =>
                            d.id === state.currentDashboardId
                                ? { ...d, layout: newLayout }
                                : d
                        )
                    };
                });
            },

            getCurrentDashboard: () => {
                const state = get();
                return state.dashboards.find(d => d.id === state.currentDashboardId);
            }
        }),
        {
            name: 'dashboard-storage',
        }
    )
);
