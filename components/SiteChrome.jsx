"use client";
import Link from "next/link";
import {Phone, Menu, X, MessageCircle} from "lucide-react";
import {useState} from "react";
import {BUSINESS} from "@/lib/data";
import BrandLogo from "@/components/BrandLogo";

export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 bg-[#FAF8F2]/95 backdrop-blur border-b border-[#0B2A6F12]">
  <div className="container h-[74px] flex items-center justify-between gap-5">
   <Link href="/" aria-label="Fowaah’s Apartments home" className="flex items-center shrink-0">
    <BrandLogo priority className="w-[150px] sm:w-[175px] h-[58px]" sizes="175px" />
   </Link>
   <nav className="hidden md:flex items-center gap-7 font-bold text-sm text-[#0B2A6F]">
    <Link href="/">Home</Link><Link href="/apartments">Apartments</Link><Link href="/blog">Blog</Link><Link href="/about">About & Contact</Link>
    <a className="btn btn-gold py-2.5" href={`tel:${BUSINESS.intl}`}><Phone size={16}/>Call Now</a>
   </nav>
   <button aria-label="Open navigation menu" className="md:hidden text-[#0B2A6F]" onClick={()=>setOpen(true)}><Menu/></button>
  </div>
  {open && <div className="fixed inset-0 bg-[#081C4D] text-white z-[100] p-7">
    <div className="flex justify-between items-center"><BrandLogo imageClassName="w-[150px] h-[60px]" sizes="150px" /><button aria-label="Close navigation menu" onClick={()=>setOpen(false)}><X/></button></div>
    <div className="mt-20 grid gap-8 text-2xl font-black"><Link onClick={()=>setOpen(false)} href="/">Home</Link><Link onClick={()=>setOpen(false)} href="/apartments">Apartments</Link><Link onClick={()=>setOpen(false)} href="/blog">Blog</Link><Link onClick={()=>setOpen(false)} href="/about">About & Contact</Link><a href={`tel:${BUSINESS.intl}`}>Call Now</a></div>
  </div>}
 </header>
}
export function FloatingActions(){return <div className="fixed z-40 right-4 bottom-5 flex flex-col gap-3"><a aria-label="WhatsApp Fowaah’s Apartments" className="w-12 h-12 rounded-full bg-[#C9A24A] text-[#081C4D] grid place-items-center shadow-lg" href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/></a><a aria-label="Call Fowaah’s Apartments" className="w-12 h-12 rounded-full bg-[#0B2A6F] text-white grid place-items-center shadow-lg" href={`tel:${BUSINESS.intl}`}><Phone size={20}/></a></div>}
export function Footer(){return <footer className="bg-[#081C4D] text-white mt-16"><div className="container py-14 grid md:grid-cols-4 gap-9">
 <div><Link href="/" aria-label="Fowaah’s Apartments home" className="inline-block"><BrandLogo imageClassName="w-[210px] h-[105px]" sizes="210px" /></Link><p className="text-white/70 mt-3">Simply luxury living across Accra, Kumasi and Cape Coast.</p></div>
 <div><b>Explore</b><div className="grid gap-2 mt-3 text-white/70"><Link href="/">Home</Link><Link href="/apartments">Apartments</Link><Link href="/blog">Blog</Link><Link href="/about">About & Contact</Link></div></div>
 <div><b>Locations</b><div className="grid gap-2 mt-3 text-white/70"><Link href="/apartments?city=Accra">Accra</Link><Link href="/apartments?city=Kumasi">Kumasi</Link><Link href="/apartments?city=Cape%20Coast">Cape Coast</Link></div></div>
 <div><b>Contact</b><div className="grid gap-2 mt-3 text-white/70"><a href={`tel:${BUSINESS.intl}`}>{BUSINESS.phone}</a><a href={BUSINESS.whatsapp}>WhatsApp</a><a href={BUSINESS.snapchat}>@2xfowaah</a><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div></div>
 </div><div className="border-t border-white/10 text-center text-white/50 py-5 text-sm">© 2026 Fowaah's Apartments. All rights reserved. · <Link href="/admin">Admin</Link></div></footer>}
