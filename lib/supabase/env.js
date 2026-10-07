export function getSupabaseEnv() {
  const url = process.env.https://tqpnrbomzpgeeenzysoy.supabase.co;
  const key = process.env.sb_publishable_kFacSVrrpoV_pDOT2EODyQ_9L9v2lmi;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
    );
  }

  return { url, key };
}