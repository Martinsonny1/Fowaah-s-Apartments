import { requireAdmin } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin();

  const [apartments, enquiries] = await Promise.all([
    supabase.from("apartments").select("*, apartment_videos(id, video_url, storage_path, poster_url, caption, duration_seconds, sort_order, created_at)").order("created_at", { ascending: false }),
    supabase.from("enquiries").select("*, apartments(title)").order("created_at", { ascending: false }).limit(200),
  ]);
  if (apartments.error) throw new Error(apartments.error.message);
  if (enquiries.error) throw new Error(enquiries.error.message);

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const staleEnquiries = enquiries.data.filter((e) => e.status === "New" && new Date(e.created_at).getTime() < dayAgo).length;

  return (
    <AdminClient
      apartments={apartments.data.map((a) => ({ ...a, price: Number(a.price), video: a.apartment_videos?.[0] ?? null }))}
      enquiries={enquiries.data}
      staleEnquiries={staleEnquiries}
      email={user.email}
    />
  );
}
