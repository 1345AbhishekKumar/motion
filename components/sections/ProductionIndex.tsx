"use client";

import { useState } from "react";

const INDEX_DATA = [
  {
    num: "01",
    title: "PRE-PRODUCTION",
    desc: "The genesis of the sequence. Mapping out the fundamental storyboards and optical flow before a single frame is captured.",
  },
  {
    num: "02",
    title: "CINEMATOGRAPHY",
    desc: "Stripping away aesthetics to evaluate pure light. Constructing the visual narrative using raw camera sensors and environmental logic.",
  },
  {
    num: "03",
    title: "VFX & COMPOSITING",
    desc: "Injecting surrealism through mathematical motion. Utilizing deep compositing and custom shaders to create physical, weighty visual effects.",
  },
  {
    num: "04",
    title: "FINAL RENDER",
    desc: "Optimising the master file. Colour grading, sound design integration, and ensuring buttery 60 fps playback across all digital canvases.",
  },
];

export default function ProductionIndex() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[#050505] text-white py-32 px-4 md:px-[10vw] border-t border-white/5">
      <div className="mb-20">
        <h2 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-white mb-2">
          Production <span className="font-bold">Index</span>
        </h2>
        <p className="font-mono text-gray-500 text-xs tracking-widest uppercase">
          The methodology behind the lens
        </p>
      </div>

      <div className="w-full border-t-[2px] border-white">
        {INDEX_DATA.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            className="group relative border-b border-white/20 cursor-pointer overflow-hidden
                       transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{ height: hoveredRow === i ? "280px" : "100px" }}
          >
            {/* White fill */}
            <div
              className={`absolute inset-0 bg-white origin-top
                          transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]
                          ${hoveredRow === i ? "scale-y-100" : "scale-y-0"}`}
            />

            <div className="relative w-full h-full flex items-center px-4 md:px-8">
              {/* Number */}
              <div
                className={`text-6xl md:text-8xl font-black transition-all duration-500 w-[15%] md:w-[20%]
                            ${hoveredRow === i ? "text-black -translate-y-8" : "text-white/30 translate-y-0"}`}
              >
                {item.num}
              </div>

              {/* Title */}
              <div
                className={`text-2xl md:text-5xl font-black uppercase tracking-widest w-[80%] md:w-[40%]
                            transition-colors duration-500
                            ${hoveredRow === i ? "text-black" : "text-white"}`}
              >
                {item.title}
              </div>

              {/* Description – slide in from right on hover */}
              <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-[35%] overflow-hidden">
                <p
                  className={`font-mono text-sm leading-relaxed text-black
                              transition-all duration-[700ms] delay-100
                              ${hoveredRow === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[50px]"}`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
