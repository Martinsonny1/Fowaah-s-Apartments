"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

export default function VideoTour({ video, className = "", compact = false }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  if (!video?.video_url) return null;

  async function play() {
    const el = ref.current;
    if (!el) return;
    try {
      await el.play();
      setPlaying(true);
    } catch {}
  }

  return (
    <div className={`relative overflow-hidden bg-[#081C4D] ${compact ? "rounded-xl" : "rounded-2xl"} ${className}`}>
      <video
        ref={ref}
        src={video.video_url}
        poster={video.poster_url || undefined}
        playsInline
        preload="none"
        muted={muted}
        controls={playing}
        className="block w-full aspect-[16/9] object-contain bg-[#081C4D]"
        onPlay={() => setPlaying(true)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button type="button" onClick={play} aria-label={`Play video tour${video.caption ? `: ${video.caption}` : ""}`} className="absolute inset-0 grid place-items-center bg-black/15 hover:bg-black/25 transition">
          <span className="grid place-items-center w-16 h-16 rounded-full bg-white text-[#0B2A6F] shadow-xl hover:scale-105 transition">
            <Play size={27} fill="currentColor" className="ml-1" />
          </span>
        </button>
      )}
      {playing && (
        <button
          type="button"
          onClick={() => { const next = !muted; setMuted(next); if (ref.current) ref.current.muted = next; }}
          aria-label={muted ? "Turn video sound on" : "Mute video"}
          className="absolute bottom-3 left-3 grid place-items-center w-9 h-9 rounded-full bg-black/60 text-white"
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      )}
      <span className="absolute top-3 left-3 badge bg-[#081C4D]/85 text-white border border-white/20">
        ▶ VIDEO TOUR
      </span>
    </div>
  );
}
