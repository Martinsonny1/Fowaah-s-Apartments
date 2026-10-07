"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApartmentCard from "./ApartmentCard";

export default function Filters({ apartments }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [city, setCity] = useState(sp.get("city") || "");
  const [type, setType] = useState(sp.get("type") || "");
  const [beds, setBeds] = useState(sp.get("beds") || "");
  const [furn, setFurn] = useState("");
  const [max, setMax] = useState(sp.get("max") || "");
  const [videoOnly, setVideoOnly] = useState(sp.get("video") === "1");
  const [sort, setSort] = useState("newest");
  const maxOptions = type === "Sale" ? [["1200000", "GH₵ 1,200,000"], ["2000000", "GH₵ 2,000,000"], ["5000000", "GH₵ 5,000,000"]] : [["5000", "GH₵ 5,000"], ["8000", "GH₵ 8,000"], ["10000", "GH₵ 10,000"], ["20000", "GH₵ 20,000"]];
  const list = useMemo(() => { let x = apartments.filter(a => a.status === "Published"); if (city) x = x.filter(a => a.city === city); if (type) x = x.filter(a => a.listing_type === type); if (beds) x = x.filter(a => beds === "4+" ? a.bedrooms >= 4 : a.bedrooms === +beds); if (furn) x = x.filter(a => furn === "Furnished" ? a.furnished : !a.furnished); if (max) x = x.filter(a => a.price <= +max); if (videoOnly) x = x.filter(a => a.video); if (sort === "low") x.sort((a,b) => a.price-b.price); if (sort === "high") x.sort((a,b) => b.price-a.price); if (sort === "popular") x.sort((a,b) => Number(b.featured)-Number(a.featured)); return x; }, [apartments, city, type, beds, furn, max, videoOnly, sort]);
  function updateUrl(next) { const q = new URLSearchParams(); const values = { city, type, beds, max, video: videoOnly ? "1" : "" , ...next }; Object.entries(values).forEach(([k,v]) => { if (v) q.set(k,v); }); router.replace(`/apartments${q.toString() ? `?${q}` : ""}`, { scroll: false }); }
  function change(setter, key) { return e => { const value=e.target.value; setter(value); updateUrl({ [key]: value, ...(key === "type" ? { max: "" } : {}) }); if (key === "type") setMax(""); }; }
  function clear() { setCity(""); setType(""); setBeds(""); setFurn(""); setMax(""); setVideoOnly(false); router.replace("/apartments", { scroll:false }); }
  return <div className="grid lg:grid-cols-[280px_1fr] gap-7"><aside className="card p-5 h-fit lg:sticky lg:top-24"><h3 className="font-black text-[#0B2A6F] text-lg">Find an Apartment</h3><div className="grid gap-4 mt-5">
    {[[city,setCity,"City",["","Accra","Kumasi","Cape Coast"],"city"],[type,setType,"Listing Type",["","Rent","Sale"],"type"],[beds,setBeds,"Bedrooms",["","1","2","3","4+"],"beds"],[furn,setFurn,"Furnished",["","Furnished","Unfurnished"],"furn"]].map(([v,set,label,opts,key])=><label key={label} className="text-xs font-bold">{label}<select className="select mt-1" value={v} onChange={change(set,key)}>{opts.map(o=><option key={o} value={o}>{o||"Any"}</option>)}</select></label>)}
    <label className="text-xs font-bold">Max budget<select className="select mt-1" value={max} onChange={change(setMax,"max")}><option value="">Any</option>{maxOptions.map(([v,label])=><option value={v} key={v}>{label}</option>)}</select></label>
    <label className="flex gap-2 items-center text-sm font-bold"><input type="checkbox" checked={videoOnly} onChange={e=>{setVideoOnly(e.target.checked); updateUrl({video:e.target.checked?"1":""});}}/> Video tour available</label>
    <button className="btn btn-outline" onClick={clear}>Clear filters</button></div></aside>
    <section><div className="flex justify-between items-center mb-5 gap-3"><b className="text-[#0B2A6F]">{list.length} apartments</b><select className="select max-w-[190px]" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="low">Price low to high</option><option value="high">Price high to low</option><option value="popular">Most popular</option></select></div><div className="grid md:grid-cols-2 xl:grid-cols-3">{list.map(a=><ApartmentCard key={a.id} a={a}/>)}</div>{!list.length&&<div className="card p-10 text-center"><h3 className="font-black text-xl text-[#0B2A6F]">No apartments match your search.</h3><p className="muted mt-2">Call us and we&apos;ll help you find one.</p></div>}</section></div>;
}
