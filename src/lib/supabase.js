import { createClient } from '@supabase/supabase-js';

// These should be in your .env file
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for development UI without keys (prevents crash, but auth won't work)
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.warn("Supabase keys missing! Auth will not function. Check src/lib/supabase.js");
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
