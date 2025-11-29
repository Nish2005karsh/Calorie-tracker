import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = "https://drvylbsfmpymsjjxbnfj.supabase.co"
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydnlsYnNmbXB5bXNqanhibmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjI4MDEsImV4cCI6MjA3OTQzODgwMX0.jIA0mnCVyvSuPrXXE_YcpnwOAz50s0ZaHjCubzNVxx4"

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}



export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createAuthenticatedClient = (supabaseAccessToken: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${supabaseAccessToken}`,
            },
        },
    });
};
