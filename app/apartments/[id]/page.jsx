import { notFound } from "next/navigation";
import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin, Phone, MessageCircle, Play } from "lucide-react";
import { money, BUSINESS } from "@/lib/data";
import { getApartmentById, getSimilarApartments } from "@/lib/apartments";
import EnquiryForm from "@/components/EnquiryForm";
import VideoTour from "@/components/VideoTour";
import ApartmentCard from "@/components/ApartmentCard";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = await getApartmentById(id);
  if (!a) return { title: "Apartment not found | Fowaah's Apartments" };
  return { title: `${a.title} | ${a.neighbourhood}, ${a.city}`, description: a.description, alternates: { canonical: `https://fowaah-s-apartments.vercel.app/apartments/${a.id}` }, openGraph: { title: a.title, description: a.description, images: a.images[0] ? [a.images[0]] : [] } };
}

export default async function Detail({ params }) {
  const { id } = await params;
  const a = await getApartmentById(id);
  if (!a) notFound();
  const similar = await getSimilarApartments(a);
  const videoSchema = a.video ? { "@type": "VideoObject", name: `${a.title} video tour`, description: a.video.caption || `Short video tour of ${a.title} in ${a.neighbourhood}, ${a.city}.`, contentUrl: a.video.video_url, thumbnailUrl: a.video.poster_url || a.images[0], uploadDate: a.video.created_at, duration: a.video.duration_seconds ? `PT${a.video.duration_seconds}S` : undefined } : null;
  return <div className="container py-10">
    <div className="text-sm text-gray-500 mb-5"><Link href="/">Home</Link> → <Link href="/apartments">Apartments</Link> → <Link href={`/apartments?city=${encodeURIComponent(a.city)}`}>{a.city}</Link> → {a.title}</div>
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
      <div>
        {a.video && <div className="mb-5"><div className="flex items-center gap-2 mb-3"><Play size={16} fill="currentColor" className="text-[#C9A24A]"/><h2 className="font-black text-[#0B2A6F]">VIDEO TOUR</h2><span className="text-sm muted">See it before you visit</span></div><VideoTour video={a.video}/><p className="text-sm muted mt-3">{a.video.caption || "A quick walkthrough of the apartment."} {a.video.duration_seconds ? `· ${a.video.duration_seconds}s` : ""}</p></div>}
        <div className="hero-frame"><img src={a.images[0]} alt={a.title} className="w-full aspect-[16/9] object-cover"/></div>
        <div className="grid grid-cols-3 gap-3 mt-3">{a.images.map((im, i)=><img key={im+i} src={im} alt={`${a.title} ${i+1}`} className="w-full aspect-[4/3] object-cover rounded-xl"/>)}</div>
        <div className="mt-8"><h1 className="text-3xl md:text-4xl font-black text-[#0B2A6F] mt-3">{a.title}</h1><p className="flex gap-2 items-center muted mt-2"><MapPin size={16}/>{a.neighbourhood}, {a.city}</p><div className="text-3xl font-black text-[#0B2A6F] mt-5">{money(a.price)} <span className="text-base font-normal">{a.price_period==="sale"?"one-time sale":"/ "+a.price_period}</span></div><div className="flex flex-wrap gap-5 mt-5 text-sm"><span className="flex gap-2"><BedDouble/>{a.bedrooms} Bedrooms</span><span className="flex gap-2"><Bath/>{a.bathrooms} Bathrooms</span><span className="flex gap-2"><Ruler/>{a.size_m2} m²</span><span>{a.furnished?"Furnished":"Unfurnished"}</span><span>{a.parking} Parking</span></div><h2 className="text-2xl font-black text-[#0B2A6F] mt-10">Description</h2><p className="leading-7 mt-3">{a.description}</p><h2 className="text-2xl font-black text-[#0B2A6F] mt-10">Amenities</h2><div className="flex flex-wrap gap-2 mt-3">{a.amenities.map(x=><span className="px-3 py-2 rounded-lg bg-[#E4EDDD] text-[#0B2A6F] text-sm" key={x}>{x}</span>)}</div></div>
      </div>
      <aside className="lg:sticky lg:top-24 h-fit"><EnquiryForm apartmentTitle={a.title} apartmentId={a.id}/><div className="grid grid-cols-2 gap-2 mt-3"><a className="btn btn-primary" href={`tel:${BUSINESS.intl}`}><Phone/>Call</a><a className="btn btn-gold" href={`${BUSINESS.whatsapp}?text=${encodeURIComponent(`I'm interested in ${a.title}. I watched the video tour and would like more information.`)}`}><MessageCircle/>WhatsApp</a></div><a className="btn btn-outline w-full mt-2" href={BUSINESS.snapchat}>Snapchat @2xfowaah</a></aside>
    </div>
    {similar.length > 0 && <section className="mt-16"><h2 className="section-title">SIMILAR <span>APARTMENTS</span></h2><div className="grid md:grid-cols-3 mt-7">{similar.map(x=><ApartmentCard x={x} key={x.id} a={x}/>)}</div></section>}
    {a.video && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(videoSchema)}} />}
  </div>
}
