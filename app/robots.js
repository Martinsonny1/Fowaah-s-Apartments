const baseUrl = "https://fowaah-s-apartments.vercel.app";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}