"use client";
import { useState, useTransition } from "react";
import { LayoutDashboard, Building2, Inbox, Users, Settings, Activity, Plus, Star, Pencil, Trash2, LogOut, Phone, MessageCircle } from "lucide-react";
import ListingForm from "./ListingForm";
import BrandLogo from "@/components/BrandLogo";
import { setApartmentStatus, toggleFeatured, deleteApartment, setEnquiryStatus, signOut } from "../actions";

const STATUSES = ["Draft", "Pending Review", "Published", "Rented", "Sold", "Archived"];
const ENQUIRY_STATUSES = ["New", "Contacted", "Viewing Scheduled", "Closed"];
const BADGE = { Published: "badge-green", "Pending Review": "badge-amber", Draft: "badge-grey", Rented: "badge-red", Sold: "badge-red", Archived: "badge-grey" };
const NAV = [
  ["Dashboard", LayoutDashboard], ["Listings", Building2], ["Enquiries", Inbox], ["Users & Roles", Users],
  ["Content & Testimonials", Activity], ["Site Settings", Settings], ["Activity Log", Activity],
];

function whatsappLink(phone) {
  let d = String(phone).replace(/\D/g, "");
  if (d.startsWith("0")) d = "233" + d.slice(1);
  return `https://wa.me/${d}`;
}

export default function AdminClient({ apartments, enquiries, staleEnquiries, email }) {
  const [tab, setTab] = useState("Dashboard");
  const [editing, setEditing] = useState(null); // null | "new" | apartment
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  function run(fn) {
    setNotice("");
    startTransition(async () => {
      const res = await fn();
      if (res && !res.ok) setNotice(res.error ?? "Something went wrong.");
    });
  }

  const published = apartments.filter((a) => a.status === "Published").length;
  const pendingReview = apartments.filter((a) => a.status === "Pending Review");
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;

  return (
    <div className="min-h-screen bg-[#f5f5f2] flex">
      <aside className="w-64 bg-[#081C4D] text-white hidden md:flex flex-col p-5 sticky top-0 h-screen">
        <div className="mb-8"><BrandLogo imageClassName="w-[190px] h-[110px]" sizes="190px" /><div className="mt-2 text-xs font-black tracking-[.22em] text-[#C9A24A]">ADMIN DASHBOARD</div></div>
        {NAV.map(([n, I]) => (
          <button key={n} onClick={() => setTab(n)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-1 ${tab === n ? "bg-[#C9A24A] text-[#081C4D]" : "text-white/80"}`}>
            <I size={17} />{n}
          </button>
        ))}
        <div className="mt-auto text-xs text-white/60">
          <p className="truncate">{email}</p>
          <form action={signOut}><button className="flex items-center gap-2 mt-2 text-white/80"><LogOut size={14} />Sign out</button></form>
          <p className="mt-4 tracking-wide">Powered by <b className="text-[#C9A24A]">StoreNest</b></p>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-9 min-w-0">
        <select className="select md:hidden mb-4" value={tab} onChange={(e) => setTab(e.target.value)}>
          {NAV.map(([n]) => <option key={n}>{n}</option>)}
        </select>

        <div className="flex justify-between items-center gap-3">
          <div>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
            <h1 className="text-3xl font-black text-[#0B2A6F]">{tab}</h1>
          </div>
          <button className="btn btn-gold" onClick={() => setEditing("new")}><Plus /> Add New Apartment</button>
        </div>

        {notice && <p className="badge badge-red mt-4">{notice}</p>}

        {tab === "Dashboard" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[["Total Listings", apartments.length], ["Published", published], ["Pending Review", pendingReview.length], ["New Enquiries", newEnquiries]].map(([label, n]) => (
                <div className="card p-5" key={label}><p className="text-sm text-gray-500">{label}</p><b className="text-3xl text-[#0B2A6F]">{n}</b></div>
              ))}
            </div>
            <div className="card p-6 mt-6">
              <h2 className="font-black text-xl text-[#0B2A6F]">Needs Attention</h2>
              {pendingReview.length === 0 && staleEnquiries === 0 && <p className="muted mt-2">Nothing waiting. All caught up.</p>}
              {pendingReview.length > 0 && <p className="mt-2">{pendingReview.length} listing(s) waiting for review: {pendingReview.map((a) => a.title).join(", ")}.</p>}
              {staleEnquiries > 0 && <p className="mt-2">{staleEnquiries} new enquiry(ies) older than 24 hours have not been followed up.</p>}
            </div>
          </>
        )}

        {tab === "Listings" && (
          <div className="card mt-7 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left bg-gray-50"><th className="p-4">Property</th><th>City</th><th>Type</th><th>Price</th><th>Status</th><th className="pr-4">Actions</th></tr></thead>
              <tbody>
                {apartments.map((a) => (
                  <tr className="border-t" key={a.id}>
                    <td className="p-4 font-bold">{a.title}</td>
                    <td>{a.city}</td>
                    <td>{a.listing_type}</td>
                    <td>GH₵ {a.price.toLocaleString()}</td>
                    <td>
                      <select className={`badge ${BADGE[a.status]}`} value={a.status} disabled={pending} onChange={(e) => run(() => setApartmentStatus(a.id, e.target.value))}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="pr-4 whitespace-nowrap">
                      <button title="Toggle featured" disabled={pending} className={`mr-3 ${a.featured ? "text-[#C9A24A]" : "text-gray-300"}`} onClick={() => run(() => toggleFeatured(a.id, !a.featured))}><Star size={16} fill={a.featured ? "currentColor" : "none"} /></button>
                      <button title="Edit" className="text-[#0B2A6F] mr-3" onClick={() => setEditing(a)}><Pencil size={16} /></button>
                      <button title="Delete" disabled={pending} className="text-[#C0392B]" onClick={() => confirm(`Delete "${a.title}" permanently?`) && run(() => deleteApartment(a.id))}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {!apartments.length && <tr><td className="p-6 muted" colSpan={6}>No listings yet. Click "Add New Apartment".</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Enquiries" && (
          <div className="grid gap-4 mt-7">
            {enquiries.map((e) => (
              <div className="card p-5" key={e.id}>
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <b className="text-[#0B2A6F]">{e.name}</b>
                    <p className="text-sm muted">{e.apartments?.title ?? "General enquiry"} · <span suppressHydrationWarning>{new Date(e.created_at).toLocaleString()}</span></p>
                  </div>
                  <select className="select max-w-[200px]" value={e.status} disabled={pending} onChange={(ev) => run(() => setEnquiryStatus(e.id, ev.target.value))}>
                    {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <p className="mt-3">{e.message}</p>
                {e.preferred_date && <p className="text-sm muted mt-1">Preferred viewing date: {e.preferred_date}</p>}
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <a className="btn btn-primary py-2" href={`tel:${e.phone}`}><Phone size={15} />{e.phone}</a>
                  <a className="btn btn-gold py-2" href={whatsappLink(e.phone)} target="_blank"><MessageCircle size={15} />WhatsApp</a>
                  <a className="btn btn-outline py-2" href={`mailto:${e.email}`}>{e.email}</a>
                </div>
              </div>
            ))}
            {!enquiries.length && <div className="card p-7"><p className="muted">No enquiries yet. They appear here as soon as someone submits the form on your site.</p></div>}
          </div>
        )}

        {["Users & Roles", "Content & Testimonials", "Site Settings", "Activity Log"].includes(tab) && (
          <div className="card p-7 mt-7">
            <h2 className="font-black text-xl text-[#0B2A6F]">{tab}</h2>
            <p className="muted mt-2">
              {tab === "Users & Roles"
                ? "Admins are the people listed in the profiles table in Supabase. Add or remove them there for now."
                : "Management controls for this section are scaffolded and ready to connect to the production database."}
            </p>
          </div>
        )}
      </main>

      {editing && <ListingForm key={editing === "new" ? "new" : editing.id} initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
