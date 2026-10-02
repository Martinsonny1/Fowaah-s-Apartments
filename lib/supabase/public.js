import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

// Anonymous client for public pages (no cookies, so pages can be cached).
// Row Level Security lets it read only Published listings and insert enquiries.
export function createPublicClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
