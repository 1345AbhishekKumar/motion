"use client";

import { Play } from "lucide-react";
import { VIDEO_DATA } from "@/lib/data";

const items = VIDEO_DATA.slice(0, 5);

export default function ElasticGallery() {
  return (
    <section className="relative z-10 w-full bg-[#050505] pt-10 pb-32 px-4 md:px-8 border-t border-white/5">
      <div className="mb-12 md:mb-16 md:px-[8vw] flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-light uppercase tracking-widest text-white">
          Elastic{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Frames
          </span>
        </h2>
        <p className="font-mono text-gray-500 mt-4 text-xs md:text-sm tracking-[0.3em] uppercase">
          Hover to expand perspective
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full h-[60vh] md:h-[70vh] gap-2 md:gap-4
                      px-2 md:px-0 max-w-[1600px] mx-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative flex-1 hover:flex-[4]
                       transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]
                       overflow-hidden rounded-2xl md:rounded-[2rem]
                       bg-zinc-900 cursor-pointer border border-white/5 shadow-2xl"
          >
            <video
              src={item.videoUrl}
              poster={item.poster}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover
                         opacity-40 group-hover:opacity-100
                         transition-opacity duration-[800ms] ease-out
                         scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent
                            opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Collapsed label */}
            <div className="absolute inset-0 flex items-center justify-center
                            pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
              <h3 className="text-white/40 font-black tracking-[0.2em] uppercase
                             md:-rotate-90 whitespace-nowrap text-xl md:text-3xl mix-blend-overlay">
                0{index + 1} // {item.title.split(" ")[0]}
              </h3>
            </div>

            {/* Expanded info */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10
                            translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                            transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] delay-100 w-full">
              <div className="flex justify-between items-end w-full">
                <div>
                  <p className="font-mono text-xs text-blue-400 mb-2 tracking-widest uppercase">
                    CINEMATICS // 0{index + 1}
                  </p>
                  <h3 className="text-2xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                    {item.title}
                  </h3>
                </div>
                <div className="hidden md:flex w-12 h-12 rounded-full bg-white text-black
                                items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
