import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  title: "Fowaah's Apartments Blog | Ghana Apartment & Living Guide",
  description: "Helpful guides about apartments in Accra, Kumasi and Cape Coast, renting in Ghana, short stays, neighbourhoods and choosing the right home.",
  alternates: { canonical: "https://fowaah-s-apartments.vercel.app/blog" },
  openGraph: {
    title: "Fowaah's Apartments Blog | Ghana Apartment & Living Guide",
    description: "Apartment, renting and Ghana living guides from Fowaah's Apartments.",
    url: "https://fowaah-s-apartments.vercel.app/blog",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-black tracking-[.18em] text-[#C9A24A] uppercase">Fowaah's Journal</p>
        <h1 className="section-title mt-2">APARTMENT & <span>GHANA LIVING GUIDE</span></h1>
        <p className="muted mt-4 text-lg leading-8">
          Practical advice for finding apartments in Ghana, choosing the right neighbourhood,
          planning a short stay and making a confident renting decision.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
        {blogPosts.map((post) => (
          <article className="card group" key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <img src={post.image} alt={post.title} className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#7A7A7A]">
                  <span className="text-[#C9A24A]">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-black text-[#0B2A6F] mt-3 leading-snug">{post.title}</h2>
                <p className="muted mt-3 leading-6">{post.excerpt}</p>
                <span className="inline-block mt-5 font-black text-[#0B2A6F]">Read guide →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
