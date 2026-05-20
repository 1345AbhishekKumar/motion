"use client";

import { useRef, useEffect } from "react";

const NUM_BARS = 80;
const BARS     = Array.from({ length: NUM_BARS });

export default function BarcodeSplitter() {
  const containerRef = useRef<HTMLElement>(null);
  const barsRef      = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf: number;
    let targetX  = -1000;
    let currentX = -1000;

    const onMove  = (e: MouseEvent) => { targetX = e.clientX; };
    const onLeave = ()               => { targetX = -1000; };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;

      barsRef.current.forEach((bar) => {
        if (!bar) return;
        const rect      = bar.getBoundingClientRect();
        const barCenterX = rect.left + rect.width / 2;
        const distance  = Math.abs(currentX - barCenterX);
        const RADIUS    = 200;

        let margin = 0;
        let scaleY = 1;

        if (distance < RADIUS && targetX !== -1000) {
          const force = (RADIUS - distance) / RADIUS;
          margin = force * 60;
          scaleY = 1 - force * 0.3;
        }

        if (currentX < barCenterX) {
          bar.style.marginLeft  = `${margin}px`;
          bar.style.marginRight = "0px";
        } else {
          bar.style.marginRight = `${margin}px`;
          bar.style.marginLeft  = "0px";
        }
        bar.style.transform = `scaleY(${scaleY})`;
      });

      raf = requestAnimationFrame(animate);
    };

    const section = containerRef.current;
    window.addEventListener("mousemove", onMove, { passive: true });
    section?.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[80vh] bg-white overflow-hidden flex cursor-ew-resize"
    >
      {/* Background text */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-white pointer-events-none">
        <h2 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none text-center">
          Raw <br /> Timeline Splitting
        </h2>
        <p className="mt-6 font-mono text-sm tracking-[0.4em] uppercase text-blue-600 font-bold">
          Frames rendered in real-time
        </p>
      </div>

      {/* Barcode bars */}
      <div className="relative z-10 w-full h-full flex items-stretch justify-between pointer-events-none px-[2vw]">
        {BARS.map((_, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className="bg-black w-[2px] md:w-[6px] h-full origin-center will-change-transform"
            style={{ transition: "margin 0.1s ease-out, transform 0.1s ease-out" }}
          />
        ))}
      </div>
    </section>
  );
}
