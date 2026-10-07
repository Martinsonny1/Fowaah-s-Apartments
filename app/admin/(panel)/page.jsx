import { requireAdmin } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin();

  const [apartments, enquiries] = await Promise.all([
    supabase.from("apartments").select("*").order("created_at", { ascending: false }),
    supabase.from("enquiries").select("*, apartments(title)").order("created_at", { ascending: false }).limit(200),
  ]);
  if (apartments.error) throw new Error(apartments.error.message);
  if (enquiries.error) throw new Error(enquiries.error.message);

  const ids = (apartments.data ?? []).map((a) => a.id);
  let videos = [];
  if (ids.length) {
    const result = await supabase
      .from("apartment_videos")
      .select("id, apartment_id, video_url, storage_path, poster_url, caption, duration_seconds, sort_order, created_at")
      .in("apartment_id", ids)
      .order("sort_order", { ascending: true });
    if (result.error) throw new Error(`Could not load apartment videos: ${result.error.message}`);
    videos = result.data ?? [];
  }

  const videoByApartment = new Map();
  for (const video of videos) {
    if (!videoByApartment.has(video.apartment_id)) videoByApartment.set(video.apartment_id, video);
  }

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const staleEnquiries = enquiries.data.filter((e) => e.status === "New" && new Date(e.created_at).getTime() < dayAgo).length;

  return (
    <AdminClient
      apartments={(apartments.data ?? []).map((a) => ({ ...a, price: Number(a.price), video: videoByApartment.get(a.id) ?? null }))}
      enquiries={enquiries.data}
      staleEnquiries={staleEnquiries}
      email={user.email}
    />
  );
}
