import { createPublicClient } from "@/lib/supabase/public";
import { blogPosts } from "@/lib/blog";

const baseUrl = "https://fowaah-s-apartments.vercel.app";

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const pages = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/apartments`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly", priority: 0.7 })),
  ];

  let listings = [];
  try {
    const { data, error } = await createPublicClient()
      .from("apartments")
      .select("id, featured, updated_at")
      .eq("status", "Published");
    if (error) throw error;
    listings = (data ?? []).map((apt) => ({
      url: `${baseUrl}/apartments/${apt.id}`,
      lastModified: new Date(apt.updated_at),
      changeFrequency: "weekly",
      priority: apt.featured ? 0.9 : 0.8,
    }));
  } catch (err) {
    console.error("Sitemap: could not load apartments from Supabase", err);
  }

  return [...pages, ...listings];
}
