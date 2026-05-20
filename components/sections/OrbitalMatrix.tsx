"use client";

import { useRef, useEffect } from "react";
import { VIDEO_DATA } from "@/lib/data";
import { useScrollRaf } from "@/lib/hooks";

export default function OrbitalMatrix() {
  const containerRef   = useRef<HTMLElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  // Scroll drives the target rotation
  useScrollRaf(() => {
    const section = containerRef.current;
    if (!section) return;
    const rect     = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    targetRotation.current = progress * -360;
  });

  // Continuous lerp + per-card fade/blur — runs independently from scroll
  useEffect(() => {
    let raf: number;

    // BUG FIX: window.innerWidth must not be read during SSR render.
    // Read it here inside useEffect (client-only).
    const getRadius = () => (window.innerWidth > 768 ? 800 : 400);

    // Build cards once radius is known
    const buildCards = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const total = VIDEO_DATA.length;
      Array.from(wrapper.children).forEach((child, i) => {
        const angle = (i / total) * 360;
        const r = getRadius();
        (child as HTMLElement).style.transform =
          `rotateY(${angle}deg) translateZ(${r}px)`;
      });
    };

    buildCards();

    const animate = () => {
      // Lerp rotation
      currentRotation.current +=
        (targetRotation.current - currentRotation.current) * 0.05;

      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.style.transform =
          `translateZ(-800px) rotateY(${currentRotation.current}deg)`;

        const cards = wrapper.children;
        const total = cards.length;
        for (let i = 0; i < total; i++) {
          const cardAngle   = (i / total) * 360;
          const global      = (cardAngle + currentRotation.current) % 360;
          const normalised  = global < 0 ? global + 360 : global;
          const dist        = Math.min(normalised, 360 - normalised);
          const opacity     = 1 - (dist / 180) * 0.8;
          const blur        = (dist / 180) * 10;
          (cards[i] as HTMLElement).style.opacity = String(opacity);
          (cards[i] as HTMLElement).style.filter  = `blur(${blur}px)`;
        }
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full h-[400vh] bg-[#050505] border-t border-white/5"
    >
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden
                      bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)]">

        <div className="absolute top-12 md:top-24 w-full text-center z-50 pointer-events-none">
          <h2 className="text-sm font-mono tracking-[1em] text-blue-500 uppercase">Orbital Matrix</h2>
        </div>

        <div
          className="relative w-full h-[60vh] flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          <div
            ref={wrapperRef}
            className="relative w-[300px] md:w-[500px] h-full will-change-transform"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(-800px) rotateY(0deg)" }}
          >
            {VIDEO_DATA.map((item, index) => {
              const total = VIDEO_DATA.length;
              const angle = (index / total) * 360;
              // Radius placeholder — actual value set in useEffect after mount
              return (
                <div
                  key={item.id}
                  className="absolute top-[10%] left-0 w-full h-[80%] rounded-3xl overflow-hidden
                             border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]
                             will-change-transform bg-zinc-900"
                  style={{
                    // BUG FIX: use a safe default; useEffect will override with real radius
                    transform: `rotateY(${angle}deg) translateZ(800px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <video
                    src={item.videoUrl} poster={item.poster}
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-6 bottom-8 md:bottom-12 md:inset-x-10 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white text-black flex items-center justify-center mb-4">
                      <span className="font-bold text-sm">0{index + 1}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-12 w-full text-center z-50 pointer-events-none">
          <p className="text-xs font-mono tracking-widest text-gray-500 uppercase">
            Drag or Scroll to rotate space
          </p>
        </div>
      </div>
    </section>
  );
}
