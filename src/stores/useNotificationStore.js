import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: [
                { id: '1', title: 'System Update', message: 'Dashboard v2.0 is live!', type: 'info', read: false, time: '2 min ago' },
                { id: '2', title: 'Alert', message: 'High latency detected in US-East region.', type: 'warning', read: false, time: '1 hour ago' },
                { id: '3', title: 'Success', message: 'Weekly report generated successfully.', type: 'success', read: true, time: 'Yesterday' },
            ],

            unreadCount: () => get().notifications.filter(n => !n.read).length,

            addNotification: (notification) => set((state) => ({
                notifications: [
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        read: false,
                        time: 'Just now',
                        ...notification
                    },
                    ...state.notifications
                ]
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            })),

            clearAll: () => set({ notifications: [] })
        }),
        {
            name: 'notification-storage',
            partialize: (state) => ({ notifications: state.notifications }), // Only persist notifications
        }
    )
);
