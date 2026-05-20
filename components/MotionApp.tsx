"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu as MenuIcon, X } from "lucide-react";

import { MENU_LINKS } from "@/lib/data";
import { VIDEO_DATA } from "@/lib/data";

import ArchCarousel       from "./sections/ArchCarousel";
import ExperimentalArchive from "./sections/ExperimentalArchive";
import ElasticGallery     from "./sections/ElasticGallery";
import InfiniteFilmstrip  from "./sections/InfiniteFilmstrip";
import CinematicBento     from "./sections/CinematicBento";
import StackingShowcase   from "./sections/StackingShowcase";
import ApertureGrid       from "./sections/ApertureGrid";
import OrbitalMatrix      from "./sections/OrbitalMatrix";
import AsymmetricEditorial from "./sections/AsymmetricEditorial";
import KineticDataStream  from "./sections/KineticDataStream";
import InteractiveSpotlight from "./sections/InteractiveSpotlight";
import ProductionIndex    from "./sections/ProductionIndex";
import LiquidPlasma       from "./sections/LiquidPlasma";
import HypnoticTunnel     from "./sections/HypnoticTunnel";
import BarcodeSplitter    from "./sections/BarcodeSplitter";
import PaperUnrollShowcase from "./sections/PaperUnrollShowcase";
import ExperimentalFooter from "./sections/ExperimentalFooter";

export default function MotionApp() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  /* ── lock body scroll when menu is open ── */
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.overflowX = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* ── smooth-scroll to section, close menu first ── */
  const handleNavigate = useCallback((targetId: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  }, []);

  return (
    <div className="w-full bg-[#050505] text-white font-sans selection:bg-white/20">

      {/* ── FIXED HEADER ── */}
      <header className="fixed top-0 left-0 w-full px-8 py-8 flex justify-between items-start z-50 pointer-events-none mix-blend-difference">
        <div
          className="flex flex-col gap-1 pointer-events-auto cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-xl font-black tracking-tighter uppercase leading-none">Motion</span>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">BY アビシェク</span>
        </div>

        <button
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((v) => !v)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full
                     bg-white/10 backdrop-blur-md border border-white/20
                     hover:bg-white/20 hover:scale-105 active:scale-95
                     transition-all duration-300 pointer-events-auto overflow-hidden"
        >
          <span className={`absolute transition-all duration-500 ease-in-out ${isMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`}>
            <MenuIcon className="w-5 h-5" />
          </span>
          <span className={`absolute transition-all duration-500 ease-in-out ${isMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`}>
            <X className="w-5 h-5" />
          </span>
        </button>
      </header>

      {/* ── FULLSCREEN MENU OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[60] flex items-center transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]
          ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-200"}`}
      >
        {/* Background layer with image reveal */}
        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
          {MENU_LINKS.map((link) => (
            <div
              key={link.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
                hoveredImage === link.id ? "opacity-40 scale-105" : "opacity-0 scale-100"
              }`}
              style={{ backgroundImage: `url(${link.image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Nav links */}
        <nav className="relative z-10 w-full px-8 md:px-[10vw] flex flex-col gap-4 md:gap-8">
          {MENU_LINKS.map((link, index) => (
            <div
              key={link.id}
              className="group flex items-baseline gap-6 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredImage(link.id)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => handleNavigate(link.targetId)}
            >
              <span
                className={`text-sm md:text-xl font-mono text-gray-500 transition-all duration-700 ${
                  isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {link.id}
              </span>
              <h2
                className={`text-5xl md:text-8xl lg:text-[10vw] font-black tracking-tighter uppercase
                  text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 hover:to-white
                  transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]
                  ${isMenuOpen ? "translate-y-0 rotate-0 opacity-100" : "translate-y-full rotate-6 opacity-0"}`}
                style={{ transitionDelay: `${index * 50 + 100}ms` }}
              >
                {link.title}
              </h2>
            </div>
          ))}
        </nav>

        <div
          className={`absolute bottom-8 left-8 right-8 flex justify-between text-[10px] font-mono
            tracking-widest text-gray-400 transition-opacity duration-1000 delay-500
            ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <span>SOCIALS [IN, TW, IG]</span>
          <span>© 2026 アビシェク・クマール</span>
        </div>
      </div>

      {/* ── SCROLLING CONTENT ── */}
      <div className="relative w-full">

        {/* Hero – sticky carousel */}
        <div className="sticky top-0 h-screen w-full z-0 flex flex-col items-center justify-center overflow-hidden">
          <main
            className={`relative w-full h-full flex flex-col items-center justify-center
              transition-all duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] origin-center
              ${isMenuOpen ? "scale-[0.85] opacity-30 blur-md pointer-events-none" : "scale-100 opacity-100 blur-0"}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,50,0.2)_0%,transparent_60%)] pointer-events-none" />

            <div className="z-10 w-full flex justify-center -mt-24">
              <ArchCarousel items={VIDEO_DATA} />
            </div>

            <div className="absolute top-[75%] md:top-[80%] flex flex-col items-center justify-center pointer-events-none z-0 opacity-80">
              <div className="w-24 h-[2px] bg-white/30 mb-8 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
              <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white mb-2 uppercase">
                Motion <span className="font-bold">ギャラリー</span>
              </h1>
              <p className="text-xs font-mono tracking-[0.4em] text-gray-500 uppercase mt-3">Drag to rotate</p>
            </div>
          </main>
        </div>

        <ExperimentalArchive />
        <ElasticGallery />
        <InfiniteFilmstrip />
        <CinematicBento />
        <StackingShowcase />
        <ApertureGrid />
        <OrbitalMatrix />
        <AsymmetricEditorial />
        <KineticDataStream />
        <InteractiveSpotlight />
        <ProductionIndex />
        <LiquidPlasma />
        <HypnoticTunnel />
        <BarcodeSplitter />
        <PaperUnrollShowcase />
        <ExperimentalFooter />
      </div>
    </div>
  );
}
