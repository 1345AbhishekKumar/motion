"use client";

import { useRef, useEffect } from "react";
import { VIDEO_DATA } from "@/lib/data";
import { useScrollRaf } from "@/lib/hooks";

const row1       = [...VIDEO_DATA, ...VIDEO_DATA];
const row2Src    = [...VIDEO_DATA].reverse();
const doubledRow2 = [...row2Src, ...row2Src];

export default function InfiniteFilmstrip() {
  const sectionRef  = useRef<HTMLElement>(null);
  const wrapper1Ref = useRef<HTMLDivElement>(null);
  const wrapper2Ref = useRef<HTMLDivElement>(null);

  useScrollRaf(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const offset = (window.innerHeight - rect.top) * 0.15;
    if (wrapper1Ref.current) wrapper1Ref.current.style.transform = `translate3d(${-offset}px,0,0)`;
    if (wrapper2Ref.current) wrapper2Ref.current.style.transform = `translate3d(${offset}px,0,0)`;
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#050505] py-24 overflow-hidden border-t border-white/5"
    >
      <div className="mb-16 px-8 md:px-[10vw]">
        <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
          Continuous <span className="font-bold">Flow</span>
        </h2>
        <p className="font-mono text-gray-500 text-xs tracking-widest uppercase">
          Infinite motion exploration
        </p>
      </div>

      {/* Row 1 */}
      <div ref={wrapper1Ref} className="will-change-transform">
        <div className="flex w-[200%] mb-8 animate-marquee-slow pause-on-hover hover:z-20 relative">
          {row1.map((item, idx) => (
            <div
              key={`r1-${idx}`}
              className="w-[300px] h-[200px] md:w-[450px] md:h-[280px] mx-4
                         rounded-2xl md:rounded-[2rem] overflow-hidden relative group
                         cursor-pointer shrink-0 border border-white/5 shadow-2xl"
            >
              <video
                src={item.videoUrl}
                poster={item.poster}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white font-bold text-lg md:text-xl drop-shadow-md">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div ref={wrapper2Ref} className="will-change-transform">
        <div className="flex w-[200%] animate-marquee-reverse pause-on-hover hover:z-20 relative -ml-[10%]">
          {doubledRow2.map((item, idx) => (
            <div
              key={`r2-${idx}`}
              className="w-[250px] h-[160px] md:w-[350px] md:h-[220px] mx-4
                         rounded-2xl md:rounded-[2rem] overflow-hidden relative group
                         cursor-pointer shrink-0 border border-white/5 shadow-2xl"
            >
              <video
                src={item.videoUrl}
                poster={item.poster}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white font-bold text-md md:text-lg drop-shadow-md">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
