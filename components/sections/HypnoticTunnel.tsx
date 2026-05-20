"use client";

const RINGS = Array.from({ length: 15 });

export default function HypnoticTunnel() {
  return (
    <section className="relative w-full h-screen bg-[#e5e5e5] overflow-hidden border-t border-black/10 flex flex-col justify-center items-center">
      
      {/* EXACT SAME ANIMATION */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tunnel-dive {
              0% {
                transform: translateZ(-2000px) rotate(0deg);
                opacity: 0;
              }
              20% {
                opacity: 0.1;
              }
              80% {
                opacity: 1;
              }
              100% {
                transform: translateZ(1000px) rotate(90deg);
                opacity: 0;
              }
            }

            .tunnel-ring {
              animation: tunnel-dive 8s infinite linear;
              transform-style: preserve-3d;
              will-change: transform, opacity;
              backface-visibility: hidden;
            }
          `,
        }}
      />

      {/* Top Text */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <p className="font-mono text-black text-xs tracking-[0.5em] uppercase font-bold">
          Infinite Depth of Field
        </p>
      </div>

      {/* CRITICAL FIX: preserve-3d added */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          perspective: "800px",
          transformStyle: "preserve-3d", // 🔥 REQUIRED FIX
        }}
      >
        {RINGS.map((_, i) => (
          <div
            key={i}
            className="tunnel-ring absolute flex items-center justify-center"
            style={{
              animationDelay: `${(i * -8) / 15}s`, // keep EXACT timing
              width: "80vw",
              height: "80vw",
              maxWidth: "800px",
              maxHeight: "800px",
            }}
          >
            {/* Also preserve 3D here */}
            <div
              className="relative w-full h-full flex flex-col justify-between items-center p-8 border-[2px] border-black/10"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span
                className="text-[6vw] font-black uppercase text-transparent tracking-[0.2em]"
                style={{ WebkitTextStroke: "2px black" }}
              >
                ABHISHEK
              </span>

              <div className="w-full flex justify-between">
                <span
                  className="text-[6vw] font-black uppercase text-transparent tracking-[0.2em]"
                  style={{
                    WebkitTextStroke: "2px black",
                    writingMode: "vertical-rl",
                  }}
                >
                  LIGHT
                </span>

                <span
                  className="text-[6vw] font-black uppercase text-transparent tracking-[0.2em]"
                  style={{
                    WebkitTextStroke: "2px black",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  ACTION
                </span>
              </div>

              <span
                className="text-[6vw] font-black uppercase text-transparent tracking-[0.2em] rotate-180"
                style={{ WebkitTextStroke: "2px black" }}
              >
                ABHISHEK
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}