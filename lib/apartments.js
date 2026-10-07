import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

function normalize(row) {
  const video = row.apartment_videos?.[0] ?? null;
  return { ...row, price: Number(row.price), amenities: row.amenities ?? [], images: row.images ?? [], video: video ? { ...video, poster_url: video.poster_url || row.images?.[0] || null } : null };
}

const VIDEO_SELECT = "*, apartment_videos(id, video_url, poster_url, caption, duration_seconds, sort_order, created_at)";

export const getPublishedApartments = cache(async () => {
  const { data, error } = await createPublicClient()
    .from("apartments")
    .select(VIDEO_SELECT)
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .order("id");
  if (error) throw new Error(`Could not load apartments: ${error.message}`);
  return data.map(normalize);
});

export const getApartmentById = cache(async (id) => {
  const { data, error } = await createPublicClient()
    .from("apartments")
    .select(VIDEO_SELECT)
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();
  if (error) throw new Error(`Could not load apartment: ${error.message}`);
  return data ? normalize(data) : null;
});

export async function getSimilarApartments(apartment, limit = 3) {
  const { data, error } = await createPublicClient()
    .from("apartments")
    .select(VIDEO_SELECT)
    .eq("status", "Published")
    .eq("city", apartment.city)
    .neq("id", apartment.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Could not load similar apartments: ${error.message}`);
  return data.map(normalize);
}
