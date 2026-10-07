import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";

const baseUrl = "https://fowaah-s-apartments.vercel.app";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found | Fowaah's Apartments" };
  return {
    title: `${post.title} | Fowaah's Apartments`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Fowaah's Apartments", url: baseUrl },
    publisher: { "@type": "Organization", name: "Fowaah's Apartments", url: baseUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  return (
    <article className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> → <Link href="/blog">Blog</Link> → {post.category}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
          <span className="text-[#C9A24A]">{post.category}</span>
          <span className="text-gray-400">·</span>
          <time dateTime={post.date}>{new Date(post.date + "T00:00:00").toLocaleDateString("en-GH", { year: "numeric", month: "long", day: "numeric" })}</time>
          <span className="text-gray-400">·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#0B2A6F] leading-tight mt-4">{post.title}</h1>
        <p className="text-lg md:text-xl muted leading-8 mt-5">{post.excerpt}</p>
        <img src={post.image} alt={post.title} className="w-full aspect-[16/8] object-cover rounded-2xl mt-8 border-2 border-[#C9A24A]" />
        <div className="prose-fowaah mt-10">
          <p className="text-lg leading-8">{post.intro}</p>
          {post.sections.map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <div className="card p-7 mt-12 bg-white">
          <h2 className="text-2xl font-black text-[#0B2A6F]">Looking for an apartment in Ghana?</h2>
          <p className="muted mt-2">Browse current Fowaah's Apartments listings or contact us about a property that interests you.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link className="btn btn-primary" href="/apartments">Browse Apartments</Link>
            <Link className="btn btn-outline" href="/about">Contact Fowaah's</Link>
          </div>
        </div>
        <div className="mt-10">
          <Link href="/blog" className="font-black text-[#0B2A6F]">← Back to all guides</Link>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </div>
    </article>
  );
}
