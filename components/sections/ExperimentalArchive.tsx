"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { VIDEO_DATA } from "@/lib/data";

const FEATURED_WORKS = [
  { id: "01", title: "NEON OASIS",       category: "CINEMATOGRAPHY", videoUrl: VIDEO_DATA[0].videoUrl, poster: VIDEO_DATA[0].poster },
  { id: "02", title: "SYNTHETIC DREAMS", category: "VFX / 3D",       videoUrl: VIDEO_DATA[2].videoUrl, poster: VIDEO_DATA[2].poster },
  { id: "03", title: "URBAN DECAY",      category: "DOCUMENTARY",    videoUrl: VIDEO_DATA[6].videoUrl, poster: VIDEO_DATA[6].poster },
  { id: "04", title: "ECHOES",           category: "EXPERIMENTAL",   videoUrl: VIDEO_DATA[3].videoUrl, poster: VIDEO_DATA[3].poster },
];

export default function ExperimentalArchive() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="archive"
      className="relative z-10 w-full bg-[#050505] rounded-t-[3rem] md:rounded-t-[5rem]
                 overflow-hidden pt-32 pb-40
                 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5"
    >
      {/* Header */}
      <div className="px-8 md:px-[10vw] mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Curated<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-white">
            Archive
          </span>
        </h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <p className="text-gray-400 font-mono text-xs md:text-sm tracking-wide leading-relaxed">
            A brutalist exploration of our finest motion sequences. Hover over the indices
            below to reveal the cinematic universe hidden within each project file.
          </p>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-gray-400 active:scale-[0.97] transition-[transform,color] duration-160 ease-out w-max">
            View All Projects <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Work list */}
      <div className="w-full flex flex-col border-b border-white/10">
        {FEATURED_WORKS.map((work, idx) => (
          <div
            key={work.id}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`group relative w-full border-t border-white/10 cursor-pointer overflow-hidden
                        transition-[height] duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${hoveredIdx === idx ? "h-[300px] md:h-[400px]" : "h-[100px] md:h-[140px]"}`}
          >
            {/* Video reveal */}
            <div
              className={`absolute inset-0 w-full h-full
                          transition-[opacity,transform] duration-400 ease-out
                          ${hoveredIdx === idx ? "opacity-50 scale-100" : "opacity-0 scale-110"}`}
            >
              <video
                src={work.videoUrl}
                poster={work.poster}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Row content */}
            <div className="relative z-10 w-full h-full px-8 md:px-[10vw] flex flex-col justify-center pointer-events-none">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className={`font-mono text-sm md:text-lg transition-colors duration-300 ${hoveredIdx === idx ? "text-white" : "text-gray-600"}`}>
                    {work.id}
                  </span>
                  <h3
                    className={`text-4xl md:text-7xl font-bold uppercase tracking-tighter
                                transition-[transform,color] duration-350 ease-[cubic-bezier(0.23,1,0.32,1)]
                                ${hoveredIdx === idx ? "text-white translate-x-4 md:translate-x-8" : "text-gray-300 translate-x-0"}`}
                  >
                    {work.title}
                  </h3>
                </div>
                <div className="hidden md:flex items-center gap-8">
                  <span className={`font-mono text-sm tracking-widest uppercase transition-colors duration-300 ${hoveredIdx === idx ? "text-white" : "text-gray-600"}`}>
                    {work.category}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-full border flex items-center justify-center
                                transition-[transform,background-color,border-color,color] duration-250 ease-out
                                ${hoveredIdx === idx ? "border-white bg-white text-black -rotate-45" : "border-white/20 text-white rotate-0"}`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
