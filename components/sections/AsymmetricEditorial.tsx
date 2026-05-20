"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { VIDEO_DATA } from "@/lib/data";

const editorialItems = VIDEO_DATA.slice(4, 8);

export default function AsymmetricEditorial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );

    itemRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 w-full bg-[#f0f0f0] text-black">
      <div className="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row relative">

        {/* ── Sticky left panel ── */}
        <div className="w-full md:w-5/12 relative md:sticky top-0 h-auto md:h-screen
                        p-8 md:p-16 flex flex-col justify-between
                        border-b md:border-b-0 md:border-r border-black/10 z-20 bg-[#f0f0f0]">
          <div className="flex justify-between items-start">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest leading-none">
              Editorial<br />Volume 01
            </h2>
            <span className="font-mono text-xs font-bold tracking-[0.2em] bg-black text-white px-3 py-1 rounded-full">
              {activeIndex + 1} / {editorialItems.length}
            </span>
          </div>

          {/* Animated title stack */}
          <div className="my-20 md:my-0 h-[200px] md:h-auto relative overflow-hidden">
            {editorialItems.map((item, index) => (
              <div
                key={`text-${item.id}`}
                className={`absolute inset-0 flex flex-col justify-center
                  transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]
                  ${activeIndex === index
                    ? "opacity-100 translate-y-0"
                    : activeIndex > index
                      ? "opacity-0 -translate-y-[100%]"
                      : "opacity-0 translate-y-[100%]"
                  }`}
              >
                <span className="text-[150px] md:text-[200px] lg:text-[250px] font-black leading-[0.7]
                                 tracking-tighter text-black/5 absolute -left-10 md:-left-20
                                 pointer-events-none select-none">
                  0{index + 1}
                </span>
                <h3 className="text-5xl md:text-7xl lg:text-[6vw] font-black uppercase tracking-tighter
                               leading-[0.85] relative z-10">
                  {item.title.split(" ").map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
                <p className="font-mono text-sm uppercase tracking-widest mt-8 max-w-sm relative z-10 text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="font-mono text-xs tracking-widest border-t border-black/10 pt-6">
            <div className="flex justify-between">
              <span>DESIGN SYSTEM</span>
              <span>SCROLL TO ADVANCE</span>
            </div>
          </div>
        </div>

        {/* ── Right scrolling media column ── */}
        <div className="w-full md:w-7/12 py-20 md:py-32 px-4 md:px-16
                        flex flex-col gap-32 md:gap-64 bg-[#f8f8f8]">
          {editorialItems.map((item, index) => (
            <div
              key={`media-${item.id}`}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`w-full relative flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`w-[90%] md:w-[75%] aspect-[4/5] relative rounded-sm overflow-hidden
                            shadow-[0_30px_60px_rgba(0,0,0,0.15)] group cursor-pointer
                            ${index % 2 !== 0 ? "md:-ml-12" : "md:-mr-12"}`}
              >
                <video
                  src={item.videoUrl} poster={item.poster}
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover
                             transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 w-12 h-12 border border-white/40 rounded-full
                                flex items-center justify-center opacity-0 group-hover:opacity-100
                                transition-opacity duration-500 backdrop-blur-sm">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>

                {/* Caption box */}
                <div
                  className={`absolute -bottom-8 ${index % 2 === 0 ? "-left-8 md:-left-20" : "-right-8 md:-right-20"}
                              bg-black text-white p-6 md:p-8 w-64 shadow-2xl z-20`}
                >
                  <p className="font-mono text-xs tracking-widest uppercase mb-2 text-gray-400">
                    Sequence // 0{index + 1}
                  </p>
                  <p className="font-bold text-sm uppercase">{item.title}</p>
                </div>
              </div>

              {/* Background fill */}
              <div
                className={`absolute top-[10%] ${index % 2 === 0 ? "left-[5%]" : "right-[5%]"}
                            w-1/2 h-full bg-[#ebebeb] -z-10`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
