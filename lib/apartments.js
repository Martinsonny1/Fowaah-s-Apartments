import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

function normalize(row, video = null) {
  return {
    ...row,
    price: Number(row.price),
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    video: video ? { ...video, poster_url: video.poster_url || row.images?.[0] || null } : null,
  };
}

async function getVideosForApartments(supabase, apartmentIds) {
  if (!apartmentIds.length) return new Map();
  const { data, error } = await supabase
    .from("apartment_videos")
    .select("id, apartment_id, video_url, poster_url, caption, duration_seconds, sort_order, created_at")
    .in("apartment_id", apartmentIds)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Could not load apartment videos: ${error.message}`);
  const map = new Map();
  for (const video of data ?? []) {
    if (!map.has(video.apartment_id)) map.set(video.apartment_id, video);
  }
  return map;
}

export const getPublishedApartments = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .order("id");
  if (error) throw new Error(`Could not load apartments: ${error.message}`);
  const videos = await getVideosForApartments(supabase, (data ?? []).map((a) => a.id));
  return (data ?? []).map((row) => normalize(row, videos.get(row.id) ?? null));
});

export const getApartmentById = cache(async (id) => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();
  if (error) throw new Error(`Could not load apartment: ${error.message}`);
  if (!data) return null;
  const { data: video, error: videoError } = await supabase
    .from("apartment_videos")
    .select("id, apartment_id, video_url, poster_url, caption, duration_seconds, sort_order, created_at")
    .eq("apartment_id", id)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (videoError) throw new Error(`Could not load apartment video: ${videoError.message}`);
  return normalize(data, video ?? null);
});

export async function getSimilarApartments(apartment, limit = 3) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("apartments")
    .select("*")
    .eq("status", "Published")
    .eq("city", apartment.city)
    .neq("id", apartment.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Could not load similar apartments: ${error.message}`);
  const videos = await getVideosForApartments(supabase, (data ?? []).map((a) => a.id));
  return (data ?? []).map((row) => normalize(row, videos.get(row.id) ?? null));
}
