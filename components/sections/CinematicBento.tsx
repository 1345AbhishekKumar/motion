"use client";

import { useRef, useEffect } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { VIDEO_DATA } from "@/lib/data";
import { useScrollRaf } from "@/lib/hooks";

export default function CinematicBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);

  // Dot offsets push cards from center before expanding
  const dotOffsets = [
    { x: -35, y: -35 },
    { x:  35, y: -35 },
    { x: -35, y:  35 },
    { x:  40, y:  35 },
  ];

  useScrollRaf(() => {
    const section = sectionRef.current;
    const grid    = gridRef.current;
    if (!section || !grid) return;

    const rect           = section.getBoundingClientRect();
    const windowHeight   = window.innerHeight;
    const scrollable     = rect.height - windowHeight;
    const scrolled       = -rect.top;
    const rawProgress    = Math.max(0, Math.min(1, scrolled / scrollable));

    const gridCenterX    = grid.offsetWidth  / 2;
    const gridCenterY    = grid.offsetHeight / 2;

    itemsRef.current.forEach((card, i) => {
      if (!card) return;

      const staggerDelay = i * 0.03;
      let expandProgress = 0;
      if (rawProgress > 0.15 + staggerDelay) {
        expandProgress = Math.max(0, Math.min(1, (rawProgress - (0.15 + staggerDelay)) / 0.50));
      }
      // Quartic ease-out
      const easeProgress = 1 - Math.pow(1 - expandProgress, 4);

      const cardCenterX = card.offsetLeft + card.offsetWidth  / 2;
      const cardCenterY = card.offsetTop  + card.offsetHeight / 2;

      const startX = (gridCenterX - cardCenterX) + dotOffsets[i].x;
      const startY = (gridCenterY - cardCenterY) + dotOffsets[i].y;

      const maxRadius =
        Math.sqrt(card.offsetWidth ** 2 + card.offsetHeight ** 2) / 2 + 10;
      const clipRadius = 25 + easeProgress * maxRadius;

      card.style.transform  = `translate3d(${startX * (1 - easeProgress)}px,${startY * (1 - easeProgress)}px,0)`;
      card.style.clipPath   = easeProgress === 1 ? "none" : `circle(${clipRadius}px at 50% 50%)`;

      const content = card.querySelector<HTMLElement>(".card-content");
      if (content) {
        content.style.opacity   = String(Math.max(0, (easeProgress - 0.7) / 0.3));
        content.style.transform = `translateY(${(1 - easeProgress) * 20}px)`;
      }
    });
  });

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative z-10 w-full h-[400vh] bg-[#050505] border-t border-white/5"
    >
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">

        {/* Heading */}
        <div className="w-full text-center z-20 pointer-events-none mb-8 md:mb-12 shrink-0 pt-16 md:pt-0">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            CURATED{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              MOMENTS
            </span>
          </h2>
          <p className="font-mono text-gray-400 text-sm tracking-widest uppercase">
            Structured Cinematic Layouts
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-4 md:grid-rows-2
                     gap-4 md:gap-6 h-[60vh] md:h-[70vh] shrink-0"
        >
          {/* Card 0 – large left */}
          <div
            ref={(el) => { itemsRef.current[0] = el; }}
            className="will-change-transform group relative md:col-span-2 md:row-span-2
                       rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900
                       cursor-pointer min-h-[300px] shadow-2xl"
          >
            <video
              src={VIDEO_DATA[0].videoUrl} poster={VIDEO_DATA[0].poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60
                         group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            <div className="card-content absolute inset-0 flex flex-col justify-end will-change-transform opacity-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="relative p-8">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center
                                justify-center mb-4 group-hover:bg-white transition-colors duration-500">
                  <Play className="w-4 h-4 ml-1 text-white group-hover:text-black" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{VIDEO_DATA[0].title}</h3>
                <p className="text-gray-300">{VIDEO_DATA[0].description}</p>
              </div>
            </div>
          </div>

          {/* Card 1 – top right */}
          <div
            ref={(el) => { itemsRef.current[1] = el; }}
            className="will-change-transform group relative md:col-span-2 md:row-span-1
                       rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900
                       cursor-pointer min-h-[250px] shadow-2xl"
          >
            <video
              src={VIDEO_DATA[3].videoUrl} poster={VIDEO_DATA[3].poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60
                         group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            <div className="card-content absolute inset-0 flex flex-col justify-end will-change-transform opacity-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 pointer-events-none" />
              <div className="relative p-6">
                <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-1">Featured</p>
                <h3 className="text-xl font-bold text-white">{VIDEO_DATA[3].title}</h3>
              </div>
            </div>
          </div>

          {/* Card 2 – bottom right small */}
          <div
            ref={(el) => { itemsRef.current[2] = el; }}
            className="will-change-transform group relative md:col-span-1 md:row-span-1
                       rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900
                       cursor-pointer min-h-[250px] shadow-2xl"
          >
            <video
              src={VIDEO_DATA[5].videoUrl} poster={VIDEO_DATA[5].poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60
                         group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            <div className="card-content absolute inset-0 flex flex-col justify-end will-change-transform opacity-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 pointer-events-none" />
              <div className="relative p-6">
                <h3 className="text-lg font-bold text-white">{VIDEO_DATA[5].title}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 – bottom right CTA */}
          <div
            ref={(el) => { itemsRef.current[3] = el; }}
            className="will-change-transform group relative md:col-span-1 md:row-span-1
                       rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900
                       cursor-pointer min-h-[250px] flex items-center justify-center shadow-2xl"
          >
            <video
              src={VIDEO_DATA[4].videoUrl} poster={VIDEO_DATA[4].poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30
                         group-hover:opacity-50 transition-all duration-700"
            />
            <div className="card-content relative z-10 text-center will-change-transform opacity-0 w-full">
              <div className="w-14 h-14 mx-auto rounded-full border border-white/30 flex items-center
                              justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <span className="font-mono text-sm tracking-widest text-white uppercase">View Gallery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
