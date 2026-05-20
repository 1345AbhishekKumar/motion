"use client";

import React from "react";

export default function ExperimentalFooter() {
  return (
    <footer
      id="contact"
      className="relative z-20 w-full bg-[#f0f0f0] text-black pt-32 pb-12 overflow-hidden
                 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Marquee banner */}
      <div className="w-full flex whitespace-nowrap overflow-hidden py-10 mb-20">
        <div className="animate-marquee flex items-center gap-12 w-[200%]">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <span className="text-[12vw] font-black tracking-tighter uppercase leading-none
                               hover:text-blue-600 transition-colors duration-300 cursor-crosshair">
                LET&apos;S CREATE
              </span>
              <span
                className="text-[12vw] font-black tracking-tighter uppercase leading-none
                           text-transparent bg-clip-text"
                style={{ WebkitTextStroke: "2px black" }}
              >
                MAGIC
              </span>
              <span className="text-6xl">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-[10vw] flex flex-col md:flex-row justify-between items-center gap-8
                      font-mono text-sm uppercase font-bold text-gray-500">
        <div className="flex gap-8">
          {["Instagram", "Twitter", "Vimeo"].map((link) => (
            <a key={link} href="#" className="hover:text-black transition-colors">
              {link}
            </a>
          ))}
        </div>
        <div className="text-center md:text-right">
          <p className="text-black mb-1">STUDIO ABHISHEK</p>
          <p>© 2026 // ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}
