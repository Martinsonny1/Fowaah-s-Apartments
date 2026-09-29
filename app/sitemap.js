import { apartments } from "@/lib/data";

const baseUrl = "https://fowaah-s-apartments.vercel.app";

export default function sitemap() {
  const now = new Date();

  const pages = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/apartments`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const listings = apartments
    .filter((apt) => apt.status === "Published")
    .map((apt) => ({
      url: `${baseUrl}/apartments/${apt.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: apt.featured ? 0.9 : 0.8,
    }));

  return [...pages, ...listings];
}