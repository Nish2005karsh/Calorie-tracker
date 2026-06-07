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

// Create a client authenticated as the current Clerk user using Supabase's
// official third-party `accessToken` option. Pass Clerk's `getToken` function
// (from useAuth); supabase-js calls it to attach the user's JWT on every
// request. NOTE: do NOT manually set the Authorization header here — with the
// new `sb_publishable_...` keys, supabase-js would otherwise send the opaque
// publishable key as the bearer token, which PostgREST can't decode as a JWT.
export const createAuthenticatedClient = (getToken: () => Promise<string | null>) => {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
        accessToken: async () => (await getToken()) ?? null,
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
};
