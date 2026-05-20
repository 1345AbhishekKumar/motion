"use client";

import { useRef, useEffect } from "react";

export default function InteractiveSpotlight() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // BUG FIX: Use native listener (not React synthetic) for performance —
    // avoids React's event pooling overhead on every mousemove.
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      container.style.setProperty("--x", `${e.clientX - rect.left}px`);
      container.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    return () => container.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="directors"
      ref={containerRef}
      className="relative z-10 w-full h-[80vh] bg-[#020202] border-t border-white/10 cursor-crosshair overflow-hidden group"
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
    >
      {/* Dim background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[1em] text-white/20 text-center">
          The<br />Lens
        </h2>
      </div>

      {/* Revealed white panel (spotlight mask) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-white pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(circle 300px at var(--x) var(--y), black 20%, transparent 80%)",
          maskImage:        "radial-gradient(circle 300px at var(--x) var(--y), black 20%, transparent 80%)",
        }}
      >
        <div className="text-black text-center max-w-[90vw] md:max-w-5xl px-8">
          <p className="font-mono text-sm md:text-xl font-bold tracking-[0.3em] uppercase mb-8 text-blue-600">
            Focus Pull Engaged
          </p>
          <h2 className="text-5xl md:text-[5vw] font-black uppercase tracking-tighter leading-[0.85] mb-12">
            Motion is not just movement.{" "}
            <br />
            Motion is how the story{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              breathes
            </span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-black/20 pt-8">
            {[
              { num: "01", title: "Composition", body: "Removing all visual noise to focus purely on framing, subject, and cinematographic hierarchy." },
              { num: "02", title: "Sequence",    body: "Narrative driven by user pacing rather than locked timelines. The film lives through touch." },
              { num: "03", title: "Abhishek",    body: "Directing digital experiences that respect the viewer's intelligence through minimalist cinematography." },
            ].map(({ num, title, body }) => (
              <div key={num}>
                <h4 className="font-bold text-lg mb-2 uppercase">{num} / {title}</h4>
                <p className="text-sm font-mono text-gray-700">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs tracking-widest uppercase text-white/40 pointer-events-none">
        Move cursor to reveal
      </div>
    </section>
  );
}
