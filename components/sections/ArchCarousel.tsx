"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/data";

/* ─── Individual card ──────────────────────────────────────────────────── */
function CarouselCard({ item }: { item: VideoItem }) {
  return (
    <div
      className="group relative w-[280px] h-[400px] rounded-[1.5rem] overflow-hidden
                 bg-zinc-900 border border-white/5
                 shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
                 hover:scale-105 hover:-translate-y-6
                 hover:shadow-[0_30px_60px_rgba(255,255,255,0.05)] cursor-pointer"
      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      {/* BUG FIX: video element needs explicit tabIndex & key to re-use properly */}
      <video
        src={item.videoUrl}
        poster={item.poster}
        autoPlay loop muted playsInline
        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10
                      opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Play button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-14 h-14 border border-white/30 backdrop-blur-sm rounded-full
                      flex items-center justify-center
                      text-white/0 group-hover:text-white
                      group-hover:bg-white/10 group-hover:scale-110 group-hover:border-white/50
                      transition-all duration-500">
        <Play className="w-5 h-5 ml-1" fill="currentColor" />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8
                      translate-y-8 group-hover:translate-y-0
                      transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
        <div className="overflow-hidden mb-2">
          <h3 className="text-xl font-bold text-white leading-tight tracking-wide
                         translate-y-full group-hover:translate-y-0
                         transition-transform duration-500 delay-100">
            {item.title}
          </h3>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm text-gray-400 line-clamp-2
                        translate-y-full group-hover:translate-y-0
                        transition-transform duration-500 delay-150">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main carousel ────────────────────────────────────────────────────── */
export default function ArchCarousel({ items }: { items: VideoItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  // State kept in refs so the rAF loop never causes re-renders
  const scrollRef       = useRef(0);
  const targetScrollRef = useRef(0);
  const isDragging      = useRef(false);
  const startX          = useRef(0);
  const startScroll     = useRef(0);
  const isHovering      = useRef(false);

  const N               = items.length;
  const SPACING         = 240;
  const CURVE_DROP      = 35;
  const ROTATION_STRENGTH = 12;
  const SCALE_DROP      = 0.06;
  const AUTO_SPEED      = 0.003;
  const LERP_FACTOR     = 0.08;

  useEffect(() => {
    let raf: number;

    const animate = () => {
      if (!isDragging.current && !isHovering.current) {
        targetScrollRef.current += AUTO_SPEED;
      }
      // Lerp toward target (smooth inertia)
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * LERP_FACTOR;

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        // Wrap distance around the ring
        const rawD = i - scrollRef.current;
        const d = ((rawD + N / 2) % N + N) % N - N / 2;

        const x     = d * SPACING;
        const y     = Math.pow(Math.abs(d), 1.6) * CURVE_DROP;
        const rot   = -d * ROTATION_STRENGTH;
        const scale = Math.max(0.4, 1 - Math.abs(d) * SCALE_DROP);
        const zIndex = Math.round(100 - Math.abs(d) * 10);

        // Fade edges
        const fadeThreshold = N / 2 - 1.5;
        const opacity = Math.abs(d) > fadeThreshold
          ? Math.max(0, 1 - (Math.abs(d) - fadeThreshold))
          : 1;

        card.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${rot}deg)`;
        card.style.zIndex    = String(zIndex);
        card.style.opacity   = String(opacity);
        card.style.filter    = `brightness(${1 - Math.abs(d) * 0.15}) grayscale(${Math.abs(d) * 20}%)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  /* ── pointer handlers ── */
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startScroll.current = targetScrollRef.current;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    targetScrollRef.current = startScroll.current - (e.clientX - startX.current) * 0.008;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  /* BUG FIX: wheel must be passive:false to call preventDefault;
     React synthetic wheel is passive by default in React 17+,
     so we attach it manually. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!isHovering.current) return;
      e.preventDefault();
      targetScrollRef.current += (e.deltaY + e.deltaX) * 0.005;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] flex items-center justify-center cursor-grab select-none touch-none"
      style={{ perspective: "1200px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => { cardRefs.current[index] = el; }}
          className="absolute origin-bottom will-change-transform"
          style={{ transition: "none" }}
        >
          <CarouselCard item={item} />
        </div>
      ))}
    </div>
  );
}
