 "use client";
import Link from "next/link";
import {Phone, Menu, X, MessageCircle} from "lucide-react";
import {useState} from "react";
import {BUSINESS} from "@/lib/data";

export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 bg-[#FAF8F2]/95 backdrop-blur border-b border-[#0B2A6F12]">
  <div className="container h-[74px] flex items-center justify-between gap-5">
   <Link href="/" className="flex items-center gap-3">
    <div className="w-11 h-11 rounded-full border-2 border-[#C9A24A] grid place-items-center text-[#0B2A6F] font-black text-xl">F</div>
    <div><div className="font-black tracking-tight text-[#0B2A6F]">FOWAAH'S</div><div className="text-[10px] tracking-[.25em] text-[#C9A24A]">APARTMENTS</div></div>
   </Link>
   <nav className="hidden md:flex items-center gap-7 font-bold text-sm text-[#0B2A6F]">
    <Link href="/">Home</Link><Link href="/apartments">Apartments</Link><Link href="/about">About & Contact</Link>
    <a className="btn btn-gold py-2.5" href={`tel:${BUSINESS.intl}`}><Phone size={16}/>Call Now</a>
   </nav>
   <button className="md:hidden text-[#0B2A6F]" onClick={()=>setOpen(true)}><Menu/></button>
  </div>
  {open && <div className="fixed inset-0 bg-[#081C4D] text-white z-[100] p-7">
    <div className="flex justify-between"><span className="font-black text-xl">FOWAAH'S</span><button onClick={()=>setOpen(false)}><X/></button></div>
    <div className="mt-20 grid gap-8 text-2xl font-black"><Link onClick={()=>setOpen(false)} href="/">Home</Link><Link onClick={()=>setOpen(false)} href="/apartments">Apartments</Link><Link onClick={()=>setOpen(false)} href="/about">About & Contact</Link><a href={`tel:${BUSINESS.intl}`}>Call Now</a></div>
  </div>}
 </header>
}
export function FloatingActions(){return <div className="fixed z-40 right-4 bottom-5 flex flex-col gap-3"><a className="w-12 h-12 rounded-full bg-[#C9A24A] text-[#081C4D] grid place-items-center shadow-lg" href={BUSINESS.whatsapp} target="_blank"><MessageCircle size={21}/></a><a className="w-12 h-12 rounded-full bg-[#0B2A6F] text-white grid place-items-center shadow-lg" href={`tel:${BUSINESS.intl}`}><Phone size={20}/></a></div>}
export function Footer(){return <footer className="bg-[#081C4D] text-white mt-16"><div className="container py-14 grid md:grid-cols-4 gap-9">
 <div><div className="text-2xl font-black">FOWAAH'S <span className="text-[#C9A24A]">APARTMENTS</span></div><p className="text-white/70 mt-3">Simply luxury living across Accra, Kumasi and Cape Coast.</p></div>
 <div><b>Explore</b><div className="grid gap-2 mt-3 text-white/70"><Link href="/">Home</Link><Link href="/apartments">Apartments</Link><Link href="/about">About & Contact</Link></div></div>
 <div><b>Locations</b><div className="grid gap-2 mt-3 text-white/70"><Link href="/apartments?city=Accra">Accra</Link><Link href="/apartments?city=Kumasi">Kumasi</Link><Link href="/apartments?city=Cape%20Coast">Cape Coast</Link></div></div>
 <div><b>Contact</b><div className="grid gap-2 mt-3 text-white/70"><a href={`tel:${BUSINESS.intl}`}>{BUSINESS.phone}</a><a href={BUSINESS.whatsapp}>WhatsApp</a><a href={BUSINESS.snapchat}>@2xfowaah</a><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div></div>
 </div><div className="border-t border-white/10 text-center text-white/50 py-5 text-sm">© 2026 Fowaah's Apartments. All rights reserved. · <Link href="/admin">Admin</Link></div></footer>}
