"use client";

import { useRef } from "react";
import { Play } from "lucide-react";
import { VIDEO_DATA } from "@/lib/data";
import { useScrollRaf } from "@/lib/hooks";

const stackItems = VIDEO_DATA.slice(1, 5);

export default function StackingShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useScrollRaf(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect         = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Pre-pin: first card enters from the side as section scrolls into view
    const prePinProgress  = Math.max(0, Math.min(1, 1 - rect.top / windowHeight));
    // Post-pin: subsequent cards enter while section is pinned
    const scrollable      = rect.height - windowHeight;
    const postPinProgress = Math.max(0, Math.min(1, -rect.top / scrollable));

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const direction = index % 2 === 0 ? -120 : 120; // left / right alternation
      let xOffset    = 0;
      let scale      = 1;
      let brightness = 1;

      if (index === 0) {
        // First card slides in during pre-pin
        const ease = 1 - Math.pow(1 - prePinProgress, 3);
        xOffset = direction * (1 - ease);

        if (postPinProgress > 0) {
          const push = Math.min(1, postPinProgress / 0.35);
          scale      = 1 - push * 0.1;
          brightness = 1 - push * 0.6;
        }
      } else {
        const startEntrance = (index - 1) * 0.25;
        const endEntrance   = startEntrance + 0.35;

        if (postPinProgress < startEntrance) {
          xOffset = direction;
        } else if (postPinProgress < endEntrance) {
          const local = (postPinProgress - startEntrance) / 0.35;
          xOffset     = direction * (1 - (1 - Math.pow(1 - local, 3)));
        } else {
          xOffset = 0;
          const nextEntrance = startEntrance + 0.25;
          if (index < cardsRef.current.length - 1 && postPinProgress > nextEntrance) {
            const push = Math.min(1, (postPinProgress - nextEntrance) / 0.35);
            scale      = 1 - push * 0.1;
            brightness = 1 - push * 0.6;
          }
        }
      }

      card.style.transform = `translate3d(${xOffset}vw,0,0) scale(${scale})`;
      card.style.filter    = `brightness(${brightness})`;
      card.style.zIndex    = String(10 + index);
    });
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full h-[600vh] bg-[#050505] border-t border-white/5"
    >
      <div className="sticky top-0 left-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Title */}
        <div className="absolute top-12 left-0 w-full text-center z-50 pointer-events-none mix-blend-difference">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 uppercase drop-shadow-md">
            The Collection
          </h2>
          <p className="font-mono text-gray-400 text-xs tracking-widest uppercase">Scroll to reveal</p>
        </div>

        {/* Card stack */}
        <div className="relative w-full max-w-[1000px] h-[65vh] md:h-[75vh] mt-10">
          {stackItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute inset-0 w-full h-full rounded-[2rem] md:rounded-[3rem]
                         overflow-hidden border border-white/10
                         shadow-[0_30px_60px_rgba(0,0,0,0.8)] will-change-transform"
              style={{ transform: `translate3d(${index % 2 === 0 ? -120 : 120}vw,0,0)` }}
            >
              <video
                src={item.videoUrl} poster={item.poster}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              <div className="absolute inset-x-8 bottom-12 md:bottom-16 md:inset-x-16
                              flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <span className="font-mono text-white/50 tracking-[0.3em] text-sm uppercase mb-3 block">
                    Vol {index + 1}
                  </span>
                  <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 max-w-md">{item.description}</p>
                </div>
                <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full
                                   font-bold uppercase tracking-widest text-xs
                                   hover:bg-gray-200 transition-colors pointer-events-auto">
                  Play Sequence <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
