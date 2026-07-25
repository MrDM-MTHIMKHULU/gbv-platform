// SERVER-SIDE ONLY. Never import this from a page component or anything
// that runs in the browser — it uses the service role key, which bypasses
// Row Level Security entirely. It exists specifically so that evidence
// verification results (last_verified_at / last_verified_match) can only
// ever be written by trusted server code, never by a client request.
//
// Requires SUPABASE_SERVICE_ROLE_KEY to be set in your environment
// (Vercel project settings -> Environment Variables). This is DIFFERENT
// from NEXT_PUBLIC_SUPABASE_ANON_KEY — do not prefix it with NEXT_PUBLIC_,
// or it will be bundled into client-side JS and exposed publicly.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
