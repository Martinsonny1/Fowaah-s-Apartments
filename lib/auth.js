import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Who is signed in, and are they listed in the profiles table as an admin?
export async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const isAdmin = !!profile && ["admin", "editor"].includes(profile.role);
  return { supabase, user, isAdmin };
}

// For admin pages: send anyone else to the login page.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin.user) redirect("/admin/login");
  if (!admin.isAdmin) redirect("/admin/login?error=forbidden");
  return admin;
}
