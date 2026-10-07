"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/auth";

const STATUSES = ["Draft", "Pending Review", "Published", "Rented", "Sold", "Archived"];
const ENQUIRY_STATUSES = ["New", "Contacted", "Viewing Scheduled", "Closed"];
const PERIODS = ["month", "year", "night", "sale"];
const NOT_ADMIN = { ok: false, error: "You are not signed in as an admin." };

// Make the public site and sitemap pick up a change straight away.
function refreshSite(id) {
  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath("/apartments/[id]", "page");
  if (id) revalidatePath(`/apartments/${id}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function int(v, min, max) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function parseListing(input) {
  const title = String(input.title ?? "").trim();
  const city = String(input.city ?? "").trim();
  const neighbourhood = String(input.neighbourhood ?? "").trim();
  const property_type = String(input.property_type ?? "").trim();
  const description = String(input.description ?? "").trim();
  const listing_type = input.listing_type;
  const price_period = input.price_period;
  const status = input.status;

  if (title.length < 3 || title.length > 150) return { error: "Title must be 3 to 150 characters." };
  if (city.length < 2) return { error: "Choose a city." };
  if (neighbourhood.length < 2) return { error: "Enter the neighbourhood." };
  if (!["Rent", "Sale"].includes(listing_type)) return { error: "Choose Rent or Sale." };
  if (!property_type) return { error: "Enter the property type." };
  if (!PERIODS.includes(price_period)) return { error: "Choose a price period." };
  if (!STATUSES.includes(status)) return { error: "Choose a valid status." };
  if (description.length > 5000) return { error: "Description is too long." };

  const price = int(input.price, 0, 1e12);
  const bedrooms = int(input.bedrooms, 0, 50);
  const bathrooms = int(input.bathrooms, 0, 50);
  const size_m2 = int(input.size_m2, 0, 100000);
  const parking = int(input.parking, 0, 100);
  if (price === null) return { error: "Enter a valid price." };
  if (bedrooms === null || bathrooms === null || size_m2 === null || parking === null) {
    return { error: "Bedrooms, bathrooms, size and parking must be whole numbers." };
  }

  const amenities = (Array.isArray(input.amenities) ? input.amenities : String(input.amenities ?? "").split(","))
    .map((x) => String(x).trim())
    .filter(Boolean)
    .slice(0, 30);

  const images = (Array.isArray(input.images) ? input.images : []).map((x) => String(x).trim()).filter(Boolean);
  if (images.length < 1) return { error: "Add at least one image." };
  if (images.length > 12) return { error: "Use at most 12 images." };
  if (images.some((u) => !/^https?:\/\//i.test(u))) return { error: "Every image must be a web link starting with https://" };

  return {
    row: {
      title, city, neighbourhood, listing_type, property_type, price, price_period,
      bedrooms, bathrooms, size_m2, parking, furnished: !!input.furnished, featured: !!input.featured,
      status, description, amenities, images,
    },
  };
}

export async function saveApartment(input) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;

  const parsed = parseListing(input ?? {});
  if (parsed.error) return { ok: false, error: parsed.error };

  if (input.id) {
    const { data, error } = await supabase.from("apartments").update(parsed.row).eq("id", input.id).select("id");
    if (error) return { ok: false, error: error.message };
    if (!data?.length) return { ok: false, error: "That listing no longer exists." };
    refreshSite(input.id);
    return { ok: true, id: input.id };
  }

  const base = slugify(parsed.row.title) || "listing";
  const { data: taken } = await supabase.from("apartments").select("id").eq("id", base).maybeSingle();
  const id = taken ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;

  const { error } = await supabase.from("apartments").insert({ ...parsed.row, id });
  if (error) return { ok: false, error: error.message };
  refreshSite(id);
  return { ok: true, id };
}

export async function saveApartmentVideo(input) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  const apartmentId = String(input?.apartment_id ?? "").trim();
  const videoUrl = String(input?.video_url ?? "").trim();
  if (!apartmentId || !/^https?:\/\//i.test(videoUrl)) return { ok: false, error: "A valid apartment and video URL are required." };
  const duration = Number(input?.duration_seconds);
  if (!Number.isFinite(duration) || duration <= 0 || duration > 30) return { ok: false, error: "Video must be 30 seconds or shorter." };
  const posterUrl = String(input?.poster_url ?? "").trim() || null;
  const caption = String(input?.caption ?? "").trim().slice(0, 160) || null;
  const storagePath = String(input?.storage_path ?? "").trim() || null;

  const { data: apartment, error: apartmentError } = await supabase.from("apartments").select("id").eq("id", apartmentId).maybeSingle();
  if (apartmentError) return { ok: false, error: `Could not verify the apartment: ${apartmentError.message}` };
  if (!apartment) return { ok: false, error: "That apartment could not be found." };

  const { data: old, error: oldError } = await supabase.from("apartment_videos").select("storage_path").eq("apartment_id", apartmentId).maybeSingle();
  if (oldError && !/no rows|not found/i.test(oldError.message)) {
    return { ok: false, error: `Could not read the existing video record: ${oldError.message}. Make sure supabase/video_migration.sql has been run.` };
  }

  const payload = {
    apartment_id: apartmentId,
    video_url: videoUrl,
    storage_path: storagePath,
    poster_url: posterUrl,
    caption,
    duration_seconds: Math.round(duration),
    sort_order: 0,
  };

  const { data: savedVideo, error } = await supabase
    .from("apartment_videos")
    .upsert(payload, { onConflict: "apartment_id" })
    .select("id, apartment_id, video_url, storage_path, poster_url, caption, duration_seconds, sort_order, created_at, updated_at")
    .single();

  if (error) {
    return { ok: false, error: `Video database save failed: ${error.message}. If this is the first time using video tours, run supabase/video_migration.sql in your existing Supabase project.` };
  }

  if (!savedVideo?.id) return { ok: false, error: "Supabase did not return the saved video record." };
  if (old?.storage_path && old.storage_path !== storagePath) {
    await supabase.storage.from("apartment-videos").remove([old.storage_path]);
  }
  refreshSite(apartmentId);
  return { ok: true, video: savedVideo };
}

export async function deleteApartmentVideo(apartmentId) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  const { data: old } = await supabase.from("apartment_videos").select("storage_path").eq("apartment_id", apartmentId).maybeSingle();
  const { error } = await supabase.from("apartment_videos").delete().eq("apartment_id", apartmentId);
  if (error) return { ok: false, error: error.message };
  if (old?.storage_path) await supabase.storage.from("apartment-videos").remove([old.storage_path]);
  refreshSite(apartmentId);
  return { ok: true };
}

export async function setApartmentStatus(id, status) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  if (!STATUSES.includes(status)) return { ok: false, error: "Invalid status." };
  const { error } = await supabase.from("apartments").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshSite(id);
  return { ok: true };
}

export async function toggleFeatured(id, featured) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  const { error } = await supabase.from("apartments").update({ featured: !!featured }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshSite(id);
  return { ok: true };
}

export async function deleteApartment(id) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  const { error } = await supabase.from("apartments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshSite(id);
  return { ok: true };
}

export async function setEnquiryStatus(id, status) {
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return NOT_ADMIN;
  if (!ENQUIRY_STATUSES.includes(status)) return { ok: false, error: "Invalid status." };
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function signIn(formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=invalid");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
