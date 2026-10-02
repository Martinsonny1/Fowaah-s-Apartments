"use server";

import { createPublicClient } from "@/lib/supabase/public";

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export async function submitEnquiry(input) {
  // Hidden "website" field: real visitors leave it empty, bots fill it in.
  if (input?.website) return { ok: true };

  const name = clean(input?.name, 120);
  const phone = clean(input?.phone, 40);
  const email = clean(input?.email, 200);
  const message = clean(input?.message, 2000);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input?.date ?? "") ? input.date : null;
  const apartment_id = input?.apartmentId ? clean(input.apartmentId, 100) : null;

  if (!name || !message) return { ok: false, error: "Please fill in your name and message." };
  if (phone.length < 5) return { ok: false, error: "Please enter a valid phone number." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };

  const { error } = await createPublicClient()
    .from("enquiries")
    .insert({ name, phone, email, message, preferred_date: date, apartment_id });

  if (error) {
    console.error("Enquiry insert failed:", error.message);
    return { ok: false, error: "We could not send your enquiry. Please try again or call us." };
  }
  return { ok: true };
}
