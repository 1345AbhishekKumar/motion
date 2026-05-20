"use client";

import { useRef } from "react";
import { VIDEO_DATA } from "@/lib/data";

const ROWS = [
  { text: "ABHISHEK KUMAR // VISUAL LOGIC // RAW FOOTAGE // ",            speed: "animate-marquee",         style: "filled"  },
  { text: "MOTION ARCHITECTURE // KINETIC TYPOGRAPHY // FRAME RATE // ",  speed: "animate-marquee-slow",   style: "outline" },
  { text: "BRUTALIST CINEMATICS // ALGORITHMIC SEQUENCES // SCROLL TO PLAY // ", speed: "animate-marquee", style: "filled"  },
  { text: "UNCOMPROMISING FIDELITY // PURE MOTION // ZERO STATIC // ",    speed: "animate-marquee-reverse",style: "outline" },
];

const POOL_SIZE = 20;

export default function KineticDataStream() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const poolRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const poolIndex     = useRef(0);
  const lastMousePos  = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dist = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);

    if (dist < 40) return; // throttle by distance

    lastMousePos.current = { x, y };
    const el = poolRefs.current[poolIndex.current];
    poolIndex.current = (poolIndex.current + 1) % POOL_SIZE;

    if (el) {
      const rotation = Math.random() * 30 - 15;
      el.style.left = `${x}px`;
      el.style.top  = `${y}px`;
      el.animate(
        [
          { transform: `translate(-50%,-50%) scale(0.5) rotate(${rotation}deg)`, opacity: "0" },
          { transform: `translate(-50%,-50%) scale(1.1) rotate(${rotation}deg)`, opacity: "1", offset: 0.15 },
          { transform: `translate(-50%,-50%) scale(0.9) rotate(${rotation}deg)`, opacity: "0" },
        ],
        { duration: 800, easing: "cubic-bezier(0.19,1,0.22,1)", fill: "forwards" }
      );
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full h-screen bg-[#e6e6e6] text-black overflow-hidden
                 flex items-center justify-center border-y border-black/10 cursor-crosshair"
    >
      {/* Image pool (DOM nodes recycled via poolIndex) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden">
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { poolRefs.current[i] = el; }}
            className="absolute z-30 pointer-events-none overflow-hidden rounded-xl
                       border border-white/20 shadow-2xl bg-zinc-900 will-change-transform opacity-0"
            style={{ width: "220px", height: "300px" }}
          >
            <img
              src={VIDEO_DATA[i % VIDEO_DATA.length].poster}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Marquee rows */}
      <div className="relative z-10 w-[150vw] -left-[25vw] transform -rotate-12 scale-110
                      flex flex-col gap-4 md:gap-8 mix-blend-multiply pointer-events-none">
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="flex whitespace-nowrap overflow-hidden py-2 hover:skew-x-12 transition-transform duration-500"
          >
            <div className={`flex w-max ${row.speed}`}>
              {[1, 2, 3, 4].map((repeat) => (
                <span
                  key={repeat}
                  className={`text-[8vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none pr-8 ${
                    row.style === "outline" ? "text-transparent" : "text-black"
                  }`}
                  style={row.style === "outline" ? { WebkitTextStroke: "2px black" } : {}}
                >
                  {row.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Centre badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      bg-black text-white px-8 py-4 rounded-full font-mono text-xs
                      tracking-[0.5em] uppercase whitespace-nowrap z-40 shadow-2xl pointer-events-none">
        Data Stream Active
      </div>
    </section>
  );
}
