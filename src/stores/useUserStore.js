import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useUserStore = create((set, get) => ({
    user: null,
    session: null,
    loading: true,

    // Initialize session from Supabase
    initAuth: async () => {
        if (!supabase) {
            set({ loading: false });
            return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null, loading: false });

        // Listen for changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null, loading: false });
        });
    },

    signInWithGoogle: async () => {
        if (!supabase) {
            alert("Supabase not configured! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
            return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    },

    loginAsGuest: () => {
        set({
            user: {
                id: 'guest',
                email: 'guest@example.com',
                role: 'viewer', // Default guest role
                user_metadata: { full_name: 'Guest User' },
                app_metadata: { provider: 'guest' }
            },
            session: { access_token: 'guest-mock-token' },
            loading: false
        });
    },

    signOut: async () => {
        if (get().user?.id === 'guest') {
            set({ session: null, user: null });
            return;
        }
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ session: null, user: null });
    }
}));
