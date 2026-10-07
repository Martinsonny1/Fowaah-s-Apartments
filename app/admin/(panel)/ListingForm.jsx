"use client";
import { useState, useTransition } from "react";
import { X, Video, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveApartment, saveApartmentVideo, deleteApartmentVideo } from "../actions";

const CITIES = ["Accra", "Kumasi", "Cape Coast"];
const TYPES = ["1-Bed", "2-Bed", "3-Bed", "4-Bed+", "Townhouse", "Villa", "Studio"];
const STATUSES = ["Draft", "Pending Review", "Published", "Rented", "Sold", "Archived"];

function Field({ label, children, wide }) {
  return <label className={`text-xs font-bold ${wide ? "md:col-span-2" : ""}`}>{label}<div className="mt-1">{children}</div></label>;
}

export default function ListingForm({ initial, onClose }) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    city: initial?.city ?? "Accra",
    neighbourhood: initial?.neighbourhood ?? "",
    listing_type: initial?.listing_type ?? "Rent",
    property_type: initial?.property_type ?? "2-Bed",
    price: initial?.price ?? "",
    price_period: initial?.price_period ?? "month",
    bedrooms: initial?.bedrooms ?? 2,
    bathrooms: initial?.bathrooms ?? 2,
    size_m2: initial?.size_m2 ?? "",
    parking: initial?.parking ?? 1,
    furnished: initial?.furnished ?? false,
    featured: initial?.featured ?? false,
    status: initial?.status ?? "Draft",
    description: initial?.description ?? "",
    amenities: (initial?.amenities ?? []).join(", "),
    images: initial?.images ?? [],
    video: initial?.video ?? null,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(initial?.video?.duration_seconds ?? null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function setListingType(e) {
    const listing_type = e.target.value;
    setF((p) => ({
      ...p,
      listing_type,
      price_period: listing_type === "Sale" ? "sale" : p.price_period === "sale" ? "month" : p.price_period,
    }));
  }

  function addUrl() {
    const u = urlInput.trim();
    if (!/^https?:\/\//i.test(u)) return setError("Image links must start with https://");
    setError("");
    setF((p) => ({ ...p, images: [...p.images, u] }));
    setUrlInput("");
  }

  async function onFiles(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    const supabase = createClient();
    const urls = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) { setError("Only image files can be uploaded."); continue; }
      if (file.size > 5 * 1024 * 1024) { setError(`${file.name} is larger than 5 MB.`); continue; }
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("apartment-images").upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (upErr) { setError(upErr.message); continue; }
      urls.push(supabase.storage.from("apartment-images").getPublicUrl(path).data.publicUrl);
    }
    setF((p) => ({ ...p, images: [...p.images, ...urls] }));
    setUploading(false);
  }

  async function readVideoDuration(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(video.duration); };
      video.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read this video file.")); };
      video.src = url;
    });
  }

  async function onVideoFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("video/")) return setError("Please choose an MP4, MOV or WebM video.");
    if (file.size > 50 * 1024 * 1024) return setError("Video must be 50 MB or smaller.");
    try {
      const duration = await readVideoDuration(file);
      if (!Number.isFinite(duration) || duration <= 0 || duration > 30.5) return setError("Video must be 30 seconds or shorter. Aim for 10–30 seconds.");
      setVideoDuration(Math.round(duration));
      setVideoFile(file);
    } catch (err) { setError(err.message); }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await saveApartment({ ...f, id: initial?.id });
      if (!res?.ok) return setError(res?.error ?? "Could not save.");
      let apartmentId = res.id;
      if (videoFile) {
        setVideoUploading(true);
        const ext = (videoFile.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
        const path = `listings/${apartmentId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const supabase = createClient();
        const { error: upErr } = await supabase.storage.from("apartment-videos").upload(path, videoFile, { cacheControl: "31536000", contentType: videoFile.type, upsert: false });
        if (upErr) { setVideoUploading(false); return setError(`Video upload failed: ${upErr.message}`); }
        const publicUrl = supabase.storage.from("apartment-videos").getPublicUrl(path).data.publicUrl;
        const videoRes = await saveApartmentVideo({ apartment_id: apartmentId, video_url: publicUrl, storage_path: path, duration_seconds: videoDuration, caption: "Apartment walkthrough" });
        setVideoUploading(false);
        if (!videoRes?.ok) return setError(videoRes?.error ?? "Video was uploaded but could not be saved.");
      }
      onClose();
    });
  }

  async function removeVideo() {
    if (!f.video || !initial?.id) return;
    setError("");
    setVideoUploading(true);
    const res = await deleteApartmentVideo(initial.id);
    setVideoUploading(false);
    if (!res?.ok) return setError(res?.error ?? "Could not delete video.");
    setF((p) => ({ ...p, video: null }));
    setVideoFile(null);
    setVideoDuration(null);
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 overflow-y-auto p-4">
      <form onSubmit={submit} className="card p-6 max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex justify-between items-center">
          <h2 className="text-2xl font-black text-[#0B2A6F]">{initial ? "Edit apartment" : "Add new apartment"}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <Field label="Title" wide><input required className="input" value={f.title} onChange={set("title")} /></Field>
        <Field label="City"><select className="select" value={f.city} onChange={set("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Neighbourhood"><input required className="input" value={f.neighbourhood} onChange={set("neighbourhood")} /></Field>
        <Field label="Rent or Sale"><select className="select" value={f.listing_type} onChange={setListingType}><option>Rent</option><option>Sale</option></select></Field>
        <Field label="Property type"><select className="select" value={f.property_type} onChange={set("property_type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Price (GH₵)"><input required type="number" min="0" className="input" value={f.price} onChange={set("price")} /></Field>
        <Field label="Price period"><select className="select" value={f.price_period} onChange={set("price_period")}>{["month", "year", "night", "sale"].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Bedrooms"><input type="number" min="0" className="input" value={f.bedrooms} onChange={set("bedrooms")} /></Field>
        <Field label="Bathrooms"><input type="number" min="0" className="input" value={f.bathrooms} onChange={set("bathrooms")} /></Field>
        <Field label="Size (m²)"><input type="number" min="0" className="input" value={f.size_m2} onChange={set("size_m2")} /></Field>
        <Field label="Parking spaces"><input type="number" min="0" className="input" value={f.parking} onChange={set("parking")} /></Field>
        <Field label="Status"><select className="select" value={f.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <div className="flex gap-6 items-end pb-2 text-sm font-bold">
          <label className="flex gap-2"><input type="checkbox" checked={f.furnished} onChange={set("furnished")} />Furnished</label>
          <label className="flex gap-2"><input type="checkbox" checked={f.featured} onChange={set("featured")} />Featured</label>
        </div>
        <Field label="Description" wide><textarea className="input min-h-28" value={f.description} onChange={set("description")} /></Field>
        <Field label="Amenities (separate with commas)" wide><input className="input" placeholder="Wi-Fi, Parking, 24/7 security" value={f.amenities} onChange={set("amenities")} /></Field>

        <div className="md:col-span-2 card p-5 border border-[#e8e2d4] bg-[#fffdf8]">
          <div className="flex items-center justify-between gap-3"><div><b className="text-xs uppercase tracking-wider text-[#0B2A6F]">Video Tour</b><p className="text-sm muted mt-1">Upload one real 10–30 second walkthrough from your phone. Maximum 50 MB.</p></div><Video className="text-[#C9A24A]" /></div>
          {f.video && !videoFile && <div className="mt-4 flex flex-wrap items-center gap-4"><video src={f.video.video_url} poster={f.video.poster_url || undefined} controls playsInline preload="metadata" className="w-full max-w-md aspect-video rounded-xl bg-[#081C4D]"/><div><p className="font-bold text-[#0B2A6F]">Current video{f.video.duration_seconds ? ` · ${f.video.duration_seconds}s` : ""}</p><button type="button" className="btn btn-outline mt-3" disabled={videoUploading} onClick={removeVideo}><Trash2 size={16}/>Remove video</button></div></div>}
          {videoFile && <div className="mt-4 rounded-xl bg-[#081C4D] text-white p-4"><p className="font-bold">New video ready ✓</p><p className="text-sm text-white/70 mt-1">{videoFile.name} · {videoDuration}s · {(videoFile.size / 1024 / 1024).toFixed(1)} MB</p></div>}
          <div className="mt-4 flex flex-wrap gap-3 items-center"><label className="btn btn-gold cursor-pointer"><Video size={17}/> {videoFile || !f.video ? "Choose Video" : "Replace Video"}<input type="file" hidden accept="video/mp4,video/quicktime,video/webm" onChange={onVideoFile}/></label>{!videoFile && <span className="text-xs muted">MP4, MOV or WebM · 30 sec max</span>}</div>
        </div>

        <div className="md:col-span-2">
          <b className="text-xs">Images (the first one is the main photo)</b>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
            {f.images.map((u, i) => (
              <div key={u + i} className="relative">
                <img src={u} alt="" className="w-full aspect-[4/3] object-cover rounded-lg" />
                <button type="button" aria-label="Remove image" className="absolute top-1 right-1 bg-white rounded-full p-1" onClick={() => setF((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <input type="file" accept="image/*" multiple onChange={onFiles} disabled={uploading} className="text-sm" />
            <input className="input flex-1 min-w-[200px]" placeholder="…or paste an image link (https://)" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            <button type="button" className="btn btn-outline" onClick={addUrl}>Add link</button>
          </div>
          {uploading && <p className="muted text-sm mt-2">Uploading images…</p>}
          {videoUploading && <p className="muted text-sm mt-2">Uploading video… please keep this page open.</p>}
        </div>

        {error && <p className="md:col-span-2 badge badge-red">{error}</p>}
        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={pending || uploading || videoUploading}>{pending ? "Saving…" : "Save apartment"}</button>
        </div>
      </form>
    </div>
  );
}
