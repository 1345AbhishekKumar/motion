"use client";

import { useRef, useEffect } from "react";

export default function LiquidPlasma() {
  const containerRef   = useRef<HTMLElement>(null);
  const cursorRef      = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const section = containerRef.current;
    if (!section) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let trailX = mouseX, trailY = mouseY;

    // Native listener for maximum perf on hot mousemove path
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const animate = () => {
      curX   += (mouseX - curX)   * 0.15;
      curY   += (mouseY - curY)   * 0.15;
      trailX += (curX - trailX)   * 0.10;
      trailY += (curY - trailY)   * 0.10;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${curX}px,${curY}px) translate(-50%,-50%)`;
      }
      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate(${trailX}px,${trailY}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(animate);
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden border-t border-white/5 cursor-none"
    >
      {/* SVG goo filter */}
      <svg style={{ width: 0, height: 0, position: "absolute" }}>
        <defs>
          <filter id="liquid-plasma-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -30"
              result="liquid"
            />
            <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Blob layer */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{ filter: "url(#liquid-plasma-filter)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] bg-white rounded-full mix-blend-screen" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[15vw] h-[15vw] bg-white rounded-full mix-blend-screen animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[20vw] h-[20vw] bg-white rounded-full mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]" />
        {/* Cursor blob */}
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full mix-blend-screen will-change-transform pointer-events-none"
        />
        {/* Trail blob */}
        <div
          ref={cursorTrailRef}
          className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white rounded-full mix-blend-screen will-change-transform pointer-events-none"
        />
      </div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mix-blend-difference text-white">
        <h2 className="text-[18vw] md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] text-center select-none">
          Fluid<br />State
        </h2>
        <div className="flex items-center gap-6 mt-12">
          <span className="w-12 h-[2px] bg-white" />
          <p className="font-mono text-sm tracking-[0.4em] uppercase font-bold text-white">Kinetic Masking</p>
          <span className="w-12 h-[2px] bg-white" />
        </div>
      </div>

      <div className="absolute bottom-10 w-full text-center z-20 pointer-events-none mix-blend-difference text-white">
        <p className="font-mono text-xs tracking-[0.3em] uppercase opacity-60">
          Separated Optics Rendering
        </p>
      </div>
    </section>
  );
}
