import { createClient } from '@supabase/supabase-js';

// Read from env so you can point the app at your own Supabase project without
// editing source. Set these in .env.local (and restart `npm run dev`).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createAuthenticatedClient = (supabaseAccessToken: string) => {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
        global: {
            headers: {
                Authorization: `Bearer ${supabaseAccessToken}`,
            },
        },
        // These per-request clients don't manage their own session; disabling
        // session persistence avoids the "Multiple GoTrueClient instances"
        // warning from sharing the same storage key as the base client.
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
};
