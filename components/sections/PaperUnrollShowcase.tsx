"use client";

import { useRef, useEffect, useState } from "react";
import { VIDEO_DATA, type VideoItem } from "@/lib/data";

/* ─────────────────────────────────────────────────────────────────────────
   PaperUnroll
   A reusable component that animates a canvas/paper unrolling effect.
   BUG FIX: The original used inline <style> tags inside JSX — in Next.js 
   App Router this should live in globals.css. All keyframes are there.
   BUG FIX: `replay` had a stale-closure bug; the observer callback was 
   capturing the initial `replay` value. Fixed with a ref.
───────────────────────────────────────────────────────────────────────── */
interface PaperUnrollProps {
  item: VideoItem;
  trigger?: "scroll" | "appear";
  direction?: "left-to-right" | "top-to-bottom" | "right-to-left";
  rollRadius?: number;
  duration?: number;
  delay?: number;
  replay?: boolean;
}

function PaperUnroll({
  item,
  trigger    = "scroll",
  direction  = "left-to-right",
  rollRadius = 60,
  duration   = 1.5,
  delay      = 0,
  replay     = true,
}: PaperUnrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const replayRef = useRef(replay);
  replayRef.current = replay;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf: number;

    if (trigger === "scroll") {
      const handleScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const wh   = window.innerHeight;
          const start = wh;
          const end   = wh * 0.2;
          const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
          setProgress(p);
        });
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => {
        window.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(raf);
      };
    }

    // trigger === "appear"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const animate = (now: number) => {
            const t    = Math.max(0, Math.min(1, (now - start) / (duration * 1000)));
            const ease = 1 - Math.pow(1 - t, 5); // quintic ease-out
            setProgress(ease);
            if (t < 1) raf = requestAnimationFrame(animate);
          };
          setTimeout(() => { raf = requestAnimationFrame(animate); }, delay * 1000);
        } else if (replayRef.current) {
          cancelAnimationFrame(raf);
          setProgress(0);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [trigger, duration, delay]);

  /* ── Derived visuals ── */
  const MIN_RADIUS    = 10;
  const currentRadius = Math.max(MIN_RADIUS, rollRadius * Math.sqrt(1 - progress));
  const opacity       = progress > 0.98 ? (1 - progress) * 50 : 1;

  const cylV = `linear-gradient(to right,rgba(0,0,0,0.95) 0%,rgba(255,255,255,0.4) 20%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.98) 100%)`;
  const cylH = `linear-gradient(to bottom,rgba(0,0,0,0.95) 0%,rgba(255,255,255,0.4) 20%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.98) 100%)`;

  let clipPath    = "";
  let shadowOverlay = "";
  let rollStyle: React.CSSProperties = {};

  const pct = progress * 100;

  if (direction === "left-to-right") {
    clipPath      = `inset(0 ${100 - pct}% 0 0)`;
    shadowOverlay = `linear-gradient(to right,transparent calc(${pct}% - ${currentRadius * 2.5}px),rgba(0,0,0,0.85) calc(${pct}% + 2px),transparent calc(${pct}% + 5px))`;
    rollStyle     = {
      left: `${pct}%`, top: "-4%", bottom: "-4%", width: `${currentRadius * 2}px`,
      transform: "translateX(-50%)",
      background: cylV,
      boxShadow: `-${currentRadius * 1.5}px 0 ${currentRadius * 2}px rgba(0,0,0,${0.9 * (1 - progress)})`,
      borderRadius: "8px / 50%",
      borderLeft: "1px solid rgba(255,255,255,0.2)",
      zIndex: 20,
    };
  } else if (direction === "right-to-left") {
    clipPath      = `inset(0 0 0 ${100 - pct}%)`;
    shadowOverlay = `linear-gradient(to left,transparent calc(${pct}% - ${currentRadius * 2.5}px),rgba(0,0,0,0.85) calc(${pct}% + 2px),transparent calc(${pct}% + 5px))`;
    rollStyle     = {
      right: `${pct}%`, top: "-4%", bottom: "-4%", width: `${currentRadius * 2}px`,
      transform: "translateX(50%)",
      background: cylV,
      boxShadow: `${currentRadius * 1.5}px 0 ${currentRadius * 2}px rgba(0,0,0,${0.9 * (1 - progress)})`,
      borderRadius: "8px / 50%",
      borderRight: "1px solid rgba(255,255,255,0.2)",
      zIndex: 20,
    };
  } else {
    // top-to-bottom
    clipPath      = `inset(0 0 ${100 - pct}% 0)`;
    shadowOverlay = `linear-gradient(to bottom,transparent calc(${pct}% - ${currentRadius * 2.5}px),rgba(0,0,0,0.85) calc(${pct}% + 2px),transparent calc(${pct}% + 5px))`;
    rollStyle     = {
      top: `${pct}%`, left: "-4%", right: "-4%", height: `${currentRadius * 2}px`,
      transform: "translateY(-50%)",
      background: cylH,
      boxShadow: `0 -${currentRadius * 1.5}px ${currentRadius * 2}px rgba(0,0,0,${0.9 * (1 - progress)})`,
      borderRadius: "50% / 8px",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      zIndex: 20,
    };
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#030303] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      {/* Empty-state background */}
      <div
        className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center opacity-80"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
          backgroundSize: "15px 15px",
        }}
      >
        <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mb-4">
          <div className="w-2 h-2 bg-blue-500/80 rounded-full animate-ping" />
        </div>
        <span className="font-mono text-[9px] text-white/30 tracking-[0.4em] uppercase">Matrix Empty</span>
      </div>

      {/* Revealed content */}
      <div className="absolute inset-0 will-change-transform" style={{ clipPath }}>
        <video
          src={item.videoUrl}
          poster={item.poster}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
        {/* Cast shadow from roll */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-90"
          style={{ background: shadowOverlay }}
        />
        <div className="absolute inset-0 border border-white/10 pointer-events-none z-10" />
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
          <h3 className="text-white font-black uppercase tracking-tighter text-xl md:text-3xl leading-none drop-shadow-xl">
            {item.title}
          </h3>
          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-[10px] text-cyan-400 tracking-[0.2em] uppercase font-bold block mb-1">
              AXIS // {direction}
            </span>
            <span className="font-mono text-[9px] bg-white/10 px-2 py-1 backdrop-blur-sm text-white/80 tracking-widest">
              PRG: {(progress * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Roll geometry */}
      <div
        className="absolute pointer-events-none will-change-transform"
        style={{ ...rollStyle, opacity }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PaperUnrollShowcase
───────────────────────────────────────────────────────────────────────── */
export default function PaperUnrollShowcase() {
  const [telemetry, setTelemetry] = useState("0.00");

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry((Math.random() * 99).toFixed(2));
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 w-full min-h-[150vh] bg-[#000000] border-t border-white/10 py-32 md:py-40 px-4 md:px-[6vw] overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-20 w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-24 items-start">

        {/* ── Left: sticky control spine ── */}
        <div className="md:col-span-3 flex flex-col relative h-full">
          <div className="sticky top-40 flex flex-col gap-16">
            <div className="relative">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-2 h-2 bg-blue-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400">Cinematic Module</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-white relative z-10">
                Frame<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Unroll</span>
              </h2>
            </div>

            {/* Telemetry panel */}
            <div className="border border-white/10 bg-white/[0.01] backdrop-blur-md p-6 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
              <p className="font-mono text-[9px] text-gray-500 tracking-widest mb-6 uppercase">Runtime Diagnostics</p>
              <div className="flex justify-between items-end mb-2">
                <span className="font-mono text-[10px] text-gray-400 uppercase">Render Load</span>
                <span className="font-mono text-xl font-light text-cyan-400 tracking-tight">{telemetry}%</span>
              </div>
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden mb-6">
                <div
                  className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-100 ease-linear"
                  style={{ width: `${telemetry}%` }}
                />
              </div>
              <p className="font-mono text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider">
                <span className="text-white font-bold">Abhishek Kumar</span> // Frame buffering algorithms deployed.
                Mass mapping optical flow &amp; quintic timeline friction.
              </p>
            </div>

            <div className="hidden md:block font-mono text-[10px] text-gray-700 tracking-widest uppercase">
              ↓ Scroll to initialize sequence
            </div>
          </div>
        </div>

        {/* ── Centre: primary scroll-triggered ── */}
        <div className="md:col-span-6 relative z-30 flex flex-col items-center">
          <div className="hidden md:block w-[1px] h-32 bg-gradient-to-b from-transparent to-blue-500/50 -mt-32 mb-8" />
          <div className="w-full relative p-4 border border-white/10 bg-[#050505] shadow-[0_0_100px_rgba(0,0,0,0.8)] aspect-[3/4] group">
            {/* Corner brackets */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
              <div
                key={pos}
                className={`absolute w-12 h-12 transition-all duration-500 group-hover:w-8 group-hover:h-8 ${
                  pos === "top-left"     ? "-top-1 -left-1 border-t-[3px] border-l-[3px]"  :
                  pos === "top-right"    ? "-top-1 -right-1 border-t-[3px] border-r-[3px]" :
                  pos === "bottom-left"  ? "-bottom-1 -left-1 border-b-[3px] border-l-[3px]" :
                                           "-bottom-1 -right-1 border-b-[3px] border-r-[3px]"
                } border-blue-500`}
              />
            ))}
            <PaperUnroll item={VIDEO_DATA[1]} trigger="scroll" direction="left-to-right" rollRadius={65} />
            <div className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2
                            font-mono text-[9px] md:text-[11px] text-white/30 tracking-[0.5em]
                            rotate-90 origin-center whitespace-nowrap uppercase">
              Primary Axis [LTR - Scroll Triggered]
            </div>
          </div>
        </div>

        {/* ── Right: appear-triggered pair ── */}
        <div className="md:col-span-3 flex flex-col gap-20 md:mt-[30vh] relative z-20">

          {/* Top-to-bottom */}
          <div className="relative group w-full aspect-square md:-ml-12 border border-white/5 p-2 bg-[#080808]
                          transition-colors hover:border-cyan-400/40 shadow-2xl">
            <div className="hidden md:block absolute top-1/2 -left-16 w-16 h-[1px] bg-cyan-400/30" />
            <div className="hidden md:block absolute top-1/2 -left-16 w-2 h-2 bg-cyan-400 -translate-y-1/2 rounded-full" />
            <PaperUnroll item={VIDEO_DATA[2]} trigger="appear" direction="top-to-bottom" duration={1.8} delay={0.2} rollRadius={40} />
            <div className="absolute -bottom-6 right-0 font-mono text-[9px] text-cyan-400 uppercase tracking-widest">
              Secondary [TTB] / Appear
            </div>
          </div>

          {/* Right-to-left */}
          <div className="relative group w-full aspect-video md:ml-8 border border-white/5 p-2 bg-[#080808]
                          transition-colors hover:border-white/30 shadow-2xl">
            <div className="hidden md:block absolute top-1/2 -left-16 w-16 h-[1px] bg-white/20" />
            <div className="hidden md:block absolute top-1/2 -left-16 w-2 h-2 bg-white/50 -translate-y-1/2 rounded-full" />
            <PaperUnroll item={VIDEO_DATA[6]} trigger="appear" direction="right-to-left" duration={1.5} delay={0.5} rollRadius={55} />
            <div className="absolute -bottom-6 left-0 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              Tertiary [RTL] / Delay: 0.5s
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
