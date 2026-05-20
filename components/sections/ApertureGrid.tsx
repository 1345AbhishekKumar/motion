"use client";

import { useRef } from "react";
import { VIDEO_DATA } from "@/lib/data";
import { useScrollRaf } from "@/lib/hooks";

export default function ApertureGrid() {
  const sectionRef    = useRef<HTMLElement>(null);
  const centerVideoRef = useRef<HTMLDivElement>(null);
  const leftVideoRef   = useRef<HTMLDivElement>(null);
  const rightVideoRef  = useRef<HTMLDivElement>(null);
  const bgTextRef      = useRef<HTMLDivElement>(null);
  const fgTextRef      = useRef<HTMLDivElement>(null);

  useScrollRaf(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect      = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress  = Math.max(0, Math.min(1, -rect.top / scrollable));

    // Smooth ease-in-out
    const p = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    if (bgTextRef.current) {
      bgTextRef.current.style.transform = `translate3d(0,${progress * -20}vh,0) scale(${1 + progress * 0.2})`;
      bgTextRef.current.style.opacity   = String(1 - progress * 0.5);
    }

    if (fgTextRef.current) {
      fgTextRef.current.style.transform = `translate3d(0,${progress * -40}vh,0)`;
    }

    if (centerVideoRef.current) {
      const radius = 10 + p * 150;
      centerVideoRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;
      centerVideoRef.current.style.transform = `scale(${1.2 - p * 0.2})`;
    }

    if (leftVideoRef.current) {
      leftVideoRef.current.style.transform =
        `translate3d(${progress * -30}vw,${progress * -20}vh,0) rotate(${progress * -15}deg)`;
    }

    if (rightVideoRef.current) {
      rightVideoRef.current.style.transform =
        `translate3d(${progress * 30}vw,${progress * 20}vh,0) rotate(${progress * 15}deg)`;
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full h-[300vh] bg-[#000000] border-t border-white/10"
    >
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020202]">

        {/* Background ghost text */}
        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center z-0 will-change-transform pointer-events-none"
        >
          <h2 className="text-[18vw] font-black uppercase tracking-tighter text-white/5 whitespace-nowrap leading-none">
            Aperture
          </h2>
        </div>

        {/* Flanking videos */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            ref={leftVideoRef}
            className="absolute left-[10%] top-[20%] w-[25vw] aspect-[3/4] rounded-2xl overflow-hidden will-change-transform opacity-60"
          >
            <video src={VIDEO_DATA[5].videoUrl} poster={VIDEO_DATA[5].poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
          <div
            ref={rightVideoRef}
            className="absolute right-[10%] bottom-[20%] w-[20vw] aspect-square rounded-full overflow-hidden will-change-transform opacity-60"
          >
            <video src={VIDEO_DATA[4].videoUrl} poster={VIDEO_DATA[4].poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Iris video */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ filter: "drop-shadow(0 0 50px rgba(0,0,0,0.8))" }}>
          <div
            ref={centerVideoRef}
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ clipPath: "circle(10% at 50% 50%)" }}
          >
            <video src={VIDEO_DATA[1].videoUrl} poster={VIDEO_DATA[1].poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        {/* Foreground text */}
        <div
          ref={fgTextRef}
          className="absolute bottom-[-20vh] left-[5vw] z-30 pointer-events-none will-change-transform"
        >
          <p className="font-mono text-xs md:text-sm text-white/50 tracking-[0.4em] uppercase mb-4 mix-blend-difference">
            Focal Length Scaling
          </p>
          <h3 className="text-5xl md:text-[8vw] font-black uppercase tracking-tighter text-white leading-[0.85] mix-blend-difference drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            Optical <br /> Shift
          </h3>
        </div>
      </div>
    </section>
  );
}
