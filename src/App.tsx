import React, { useState, useEffect } from "react";
import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ThemeBackground } from "./components/layout/ThemeBackground";
import { HeroSection } from "./components/sections/HeroSection";
import { AnimatePresence } from "framer-motion";
import { LaptopStory } from "./components/immersive/LaptopStory";
import { AboutSection } from "./components/sections/AboutSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { ExperienceTimeline } from "./components/sections/ExperienceTimeline";
import { ContactSection } from "./components/sections/ContactSection";
import { ClickSpark } from "./components/ui/ClickSpark";
import { ScrollReveal } from "./components/ui/ScrollReveal";
import { SpiderwebBackground } from "./components/immersive/SpiderwebBackground";
import { SpiderCrawl } from "./components/immersive/SpiderCrawl";
import { SpidermanDrop } from "./components/immersive/SpidermanDrop";
import { SpiderSenseCursor } from "./components/immersive/SpiderSenseCursor";
import { WebShooter } from "./components/immersive/WebShooter";
import { TerminalConsole } from "./components/immersive/TerminalConsole";
import { PageLoader } from "./components/layout/PageLoader";
import { SpidermanLoader } from "./components/immersive/SpidermanLoader";
import { IronManHelmetHUD } from "./components/immersive/IronManHelmetHUD";
import { IronManConsole } from "./components/immersive/IronManConsole";
import { IronManRepulsor } from "./components/immersive/IronManRepulsor";
import { IronManSuitUp } from "./components/immersive/IronManSuitUp";
import { DeadpoolOverlay } from "./components/immersive/DeadpoolOverlay";
import { DeadpoolConsole } from "./components/immersive/DeadpoolConsole";
import { DeadpoolLoader } from "./components/immersive/DeadpoolLoader";
import { DeadpoolMerc } from "./components/immersive/DeadpoolMerc";
import { BloodSplatterBackground } from "./components/immersive/BloodSplatterBackground";
import { ThorOverlay } from "./components/immersive/ThorOverlay";
import { ThorConsole } from "./components/immersive/ThorConsole";
import { ThorLoader } from "./components/immersive/ThorLoader";
import { StormBackground } from "./components/immersive/StormBackground";
import { AsgardSigils } from "./components/immersive/AsgardSigils";
import { MjolnirThrow } from "./components/immersive/MjolnirThrow";
import { VenomOverlay } from "./components/immersive/VenomOverlay";
import { VenomConsole } from "./components/immersive/VenomConsole";
import { VenomLoader } from "./components/immersive/VenomLoader";
import { SymbioteBackground } from "./components/immersive/SymbioteBackground";
import { VenomCrawl } from "./components/immersive/VenomCrawl";
import { VenomSpiderIcon } from "./components/ui/VenomSpiderIcon";
import { KhonshuOverlay } from "./components/immersive/KhonshuOverlay";
import { MoonKnightConsole } from "./components/immersive/MoonKnightConsole";
import { MoonKnightLoader } from "./components/immersive/MoonKnightLoader";
import { MoonPhaseBackground } from "./components/immersive/MoonPhaseBackground";
import { MoonGlide } from "./components/immersive/MoonGlide";
import { CrescentIcon } from "./components/ui/CrescentIcon";
import { MjolnirIcon } from "./components/ui/MjolnirIcon";
import { LuffyOverlay } from "./components/immersive/LuffyOverlay";
import { Gear5Awakening } from "./components/immersive/Gear5Awakening";
import { LuffyConsole } from "./components/immersive/LuffyConsole";
import { LuffyLoader } from "./components/immersive/LuffyLoader";
import { GrandLineBackground } from "./components/immersive/GrandLineBackground";
import { StrawHatIcon } from "./components/ui/StrawHatIcon";
import { LuffyRun } from "./components/immersive/LuffyRun";
import { ZoroOverlay } from "./components/immersive/ZoroOverlay";
import { ZoroConsole } from "./components/immersive/ZoroConsole";
import { ZoroLoader } from "./components/immersive/ZoroLoader";
import { DojoBackground } from "./components/immersive/DojoBackground";
import { KatanaIcon } from "./components/ui/KatanaIcon";

import { LayoutGroup } from "framer-motion";

export function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );
  const [isIronman, setIsIronman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("ironman")
  );
  const [isDeadpool, setIsDeadpool] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("deadpool")
  );
  const [isThor, setIsThor] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("thor")
  );
  const [isVenom, setIsVenom] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("venom")
  );
  const [isMoonKnight, setIsMoonKnight] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("moonknight")
  );
  const [isLuffy, setIsLuffy] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("luffy")
  );
  const [isZoro, setIsZoro] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("zoro")
  );

  useEffect(() => {
    const syncModes = () => {
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
      setIsIronman(document.documentElement.classList.contains("ironman"));
      setIsDeadpool(document.documentElement.classList.contains("deadpool"));
      setIsThor(document.documentElement.classList.contains("thor"));
      setIsVenom(document.documentElement.classList.contains("venom"));
      setIsMoonKnight(document.documentElement.classList.contains("moonknight"));
      setIsLuffy(document.documentElement.classList.contains("luffy"));
      setIsZoro(document.documentElement.classList.contains("zoro"));
    };
    syncModes();
    const observer = new MutationObserver(syncModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Refresh GSAP ScrollTrigger whenever the layout drastically changes (like toggling Spidey Mode)
  useEffect(() => {
    // Wait a short moment for DOM to settle after unmounting LaptopStory
    const timeoutId = setTimeout(() => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [isSpiderman, isIronman, isDeadpool, isThor, isVenom, isMoonKnight, isLuffy, isZoro]);

  // Synchronize smooth scrolling with Lenis & ScrollTrigger
  useLenis(loadingComplete);

  const scrollToStory = () => {
    // Scroll past hero directly to the pinned laptop scroll story trigger area
    const storyElement = document.getElementById("laptop-story-trigger");
    if (storyElement) {
      storyElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <LayoutGroup>
      {/* ── Cinematic Loader ──────────────────────── */}
      <AnimatePresence mode="wait">
        {!loadingComplete && (
          isSpiderman ? (
            <SpidermanLoader key="spidey-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isDeadpool ? (
            <DeadpoolLoader key="deadpool-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isThor ? (
            <ThorLoader key="thor-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isVenom ? (
            <VenomLoader key="venom-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isMoonKnight ? (
            <MoonKnightLoader key="moonknight-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isLuffy ? (
            <LuffyLoader key="luffy-loader" onComplete={() => setLoadingComplete(true)} />
          ) : isZoro ? (
            <ZoroLoader key="zoro-loader" onComplete={() => setLoadingComplete(true)} />
          ) : (
            <PageLoader key="hacker-loader" onComplete={() => setLoadingComplete(true)} />
          )
        )}
      </AnimatePresence>

      {/* Global Navigation Header - Always visible immediately upon load completion */}
      {loadingComplete && <Navbar />}

      {/* ── Main App Content ──────────────────────── */}
      <div className={`relative w-full min-h-screen [.venom_&]:text-black [.luffy_&]:text-[#4a3826] text-white select-none ${loadingComplete ? "opacity-100" : "opacity-0 transition-opacity duration-500"}`}>
        <ClickSpark
          sparkColor={isIronman ? "#22D3EE" : isSpiderman ? "#EF4444" : isDeadpool ? "#DC143C" : isThor ? "#BAE6FD" : isVenom ? "#F4F7FB" : isMoonKnight ? "#F2EFE6" : isLuffy ? "#C3352A" : isZoro ? "#9FB4BC" : "#8B5CF6"}
          sparkSize={isIronman || isThor ? 12 : 8}
          sparkRadius={isIronman || isThor ? 28 : 20}
          sparkCount={isIronman || isThor ? 12 : 10}
          duration={500}
          extraScale={1.2}
        >
          {/* Cinematic ambient lighting backgrounds */}
          <ThemeBackground />

          {/* Immersive HUD Overlays */}
          {isIronman && <IronManHelmetHUD />}
          {isIronman && <IronManRepulsor />}
          {/* Remounts on every activation, so the suit-up replays each time */}
          {isIronman && loadingComplete && <IronManSuitUp />}

          {/* Immersive Spidey Mode Effects */}
          {isSpiderman && <SpiderwebBackground />}
          {isSpiderman && <SpiderCrawl />}
          {isSpiderman && <SpidermanDrop />}
          {isSpiderman && <SpiderSenseCursor />}
          {isSpiderman && <WebShooter />}

          {/* Immersive Deadpool Mode Effects */}
          {isDeadpool && <BloodSplatterBackground />}
          {isDeadpool && <DeadpoolOverlay />}
          {isDeadpool && <DeadpoolMerc />}

          {/* Immersive Thor Mode Effects */}
          {isThor && <AsgardSigils />}
          {isThor && <StormBackground />}
          {isThor && <ThorOverlay />}
          {isThor && <MjolnirThrow />}

          {/* Immersive Venom Mode Effects */}
          {isVenom && <SymbioteBackground />}
          {isVenom && <VenomOverlay />}
          {isVenom && <VenomCrawl />}

          {/* Immersive Moon Knight Mode Effects */}
          {isMoonKnight && <MoonPhaseBackground />}
          {isMoonKnight && <MoonGlide />}
          {isMoonKnight && <KhonshuOverlay />}

          {/* Immersive Luffy Mode Effects */}
          {isLuffy && <GrandLineBackground />}
          {isLuffy && <LuffyOverlay />}
          {isLuffy && <Gear5Awakening />}
          {isLuffy && <LuffyRun />}

          {/* Immersive Zoro Mode Effects */}
          {isZoro && <DojoBackground />}
          {isZoro && <ZoroOverlay />}

          {/* ── Page Layout ───────────────────────────── */}
          <main>
            {/* Section 1: Hero Section */}
            <section id="hero">
              <HeroSection onExploreClick={scrollToStory} />
            </section>

            {/* Section 2 to 5: Interactive Code Console & Snake Terminal (Normal Mode) OR Spidey Terminal HUD (Spidey Mode) */}
            <div id="laptop-story-trigger" className="relative w-full">
              {!isSpiderman && !isIronman && !isDeadpool && !isThor && !isVenom && !isMoonKnight && !isLuffy && !isZoro ? (
                <LaptopStory />
              ) : isVenom ? (
                /* Venom gets a living membrane, not a panel */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  {/* He talks first. Both of these are the balloon device, not
                      generic chips — the drips hang below them, so they need
                      clearance rather than the old -mb-4 overlap. */}
                  <div className="relative z-20 mb-7 flex items-start justify-between gap-3">
                    <div className="venom-speak flex items-center gap-2.5 px-4 py-2">
                      <VenomSpiderIcon className="w-5 h-5 venom-ink" />
                      <span className="text-sm sm:text-base venom-ink">Symbiote Link</span>
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest venom-muted normal-case">
                        KLYNTAR // HOST BONDED
                      </span>
                    </div>

                    <div className="venom-speak hidden sm:block px-3 py-1.5 text-[11px] venom-ink">
                      We know what you are looking for
                    </div>
                  </div>

                  {/* The face. It owns its own skull, eyes and mouth, and
                      sizes to its content — no outer frame, or we would be
                      back to a panel with a face painted on it. */}
                  <VenomConsole />

                  {/* Closing whisper */}
                  <div className="relative z-20 mt-7 flex justify-end">
                    <div className="venom-speak px-3 py-1.5 text-[11px] venom-ink">
                      Keep scrolling. We are not finished.
                    </div>
                  </div>
                </div>
              ) : isMoonKnight ? (
                /* Moon Knight gets a wrapped linen tablet, not a HUD window */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  {/* Cartouche header */}
                  <div className="relative z-20 -mb-4 flex items-end justify-between gap-3">
                    <div className="mk-cartouche flex items-center gap-2.5 px-5 py-2 shadow-[0_0_26px_rgba(242,239,230,0.25)]">
                      <CrescentIcon className="w-5 h-5" />
                      <span className="text-sm sm:text-base tracking-[0.2em]">
                        The Suit
                      </span>
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[#c9a227]">
                        FOUR OCCUPANTS
                      </span>
                    </div>

                    <div className="mk-cartouche hidden sm:block px-3 py-1.5">
                      <span className="text-[10px] tracking-[0.2em]">
                        Servant of Khonshu
                      </span>
                    </div>
                  </div>

                  {/* The linen */}
                  <div className="relative mk-linen h-[580px] flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden relative flex flex-col p-3 sm:p-4">
                      <MoonKnightConsole />
                    </div>
                  </div>

                  {/* Closing inscription */}
                  <div className="relative z-20 -mt-4 flex justify-end">
                    <div className="mk-cartouche px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#c9a227]">
                      ☾ The moon sees the work ☾
                    </div>
                  </div>
                </div>
              ) : isThor ? (
                /* Thor gets a rune-cut stone tablet, not a HUD window */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  {/* Bronze title plaque, hovering above the tablet */}
                  <div className="relative z-20 -mb-4 flex items-end justify-between gap-3">
                    <div className="thor-plaque flex items-center gap-2.5 rounded-md px-4 py-2 shadow-[0_0_24px_rgba(56,189,248,0.3)]">
                      <MjolnirIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(125,211,252,1)]" />
                      <span className="text-sm sm:text-base tracking-[0.18em] text-sky-100">
                        Asgard Archive
                      </span>
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[#d4af6a]">
                        BIFRÖST // MIDGARD LINK
                      </span>
                    </div>

                    <div className="thor-plaque hidden sm:block rounded-md px-3 py-1.5">
                      <span className="text-[10px] tracking-[0.2em] text-sky-200">
                        Whosoever holds this hammer
                      </span>
                    </div>
                  </div>

                  {/* The tablet */}
                  <div className="relative thor-tablet h-[580px] flex flex-col overflow-hidden">
                    {/* Bronze rivets down the sides */}
                    {["top-8 left-2", "bottom-8 left-2", "top-8 right-2", "bottom-8 right-2"].map((pos) => (
                      <span
                        key={pos}
                        className={`absolute ${pos} z-30 h-2.5 w-2.5 rounded-full border border-[#d4af6a]/80 bg-[#b08d57]/60`}
                      />
                    ))}

                    <div className="flex-1 overflow-hidden relative flex flex-col p-3 sm:p-4">
                      <ThorConsole />
                    </div>
                  </div>

                  {/* Closing inscription */}
                  <div className="relative z-20 -mt-4 flex justify-end">
                    <div className="thor-plaque rounded-md px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#d4af6a]">
                      …if he be worthy, shall possess the power ⚡
                    </div>
                  </div>
                </div>
              ) : isDeadpool ? (
                /* Deadpool gets a printed comic page instead of a HUD window */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  {/* Issue banner */}
                  <div className="relative z-20 flex items-end justify-between gap-3 -mb-3">
                    <div
                      className="border-[3px] border-black bg-[#dc143c] px-4 py-1.5 shadow-[6px_6px_0_rgba(0,0,0,0.85)]"
                      style={{ transform: "rotate(-1.8deg)" }}
                    >
                      <span className="text-white text-xl sm:text-2xl tracking-wider" style={{ fontFamily: "'Bangers', cursive" }}>
                        Deadpool
                      </span>
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-yellow-200">
                        Issue #42 • The Merc With A Portfolio
                      </span>
                    </div>

                    <div
                      className="hidden sm:block border-[3px] border-black bg-[#f7f1e3] px-3 py-1 shadow-[5px_5px_0_rgba(0,0,0,0.85)]"
                      style={{ transform: "rotate(2.5deg)" }}
                    >
                      <span className="text-[10px] uppercase tracking-widest text-[#140000]" style={{ fontFamily: "'Bangers', cursive" }}>
                        Approved by absolutely nobody
                      </span>
                    </div>
                  </div>

                  {/* The page itself */}
                  <div className="relative dp-panel h-[580px] flex flex-col overflow-hidden">
                    {/* Staples along the spine */}
                    <div className="absolute left-0 top-1/4 h-8 w-1.5 bg-slate-400/70 z-30 rounded-r-sm" />
                    <div className="absolute left-0 bottom-1/4 h-8 w-1.5 bg-slate-400/70 z-30 rounded-r-sm" />

                    <div className="flex-1 overflow-hidden relative flex flex-col p-2.5 sm:p-3">
                      <DeadpoolConsole />
                    </div>
                  </div>

                  {/* Closing caption strip */}
                  <div className="relative z-20 -mt-3 flex justify-end">
                    <div className="dp-caption px-3 py-1.5 text-[11px]" style={{ transform: "rotate(1.2deg)" }}>
                      Next issue: he actually ships it. Keep scrolling →
                    </div>
                  </div>
                </div>
              ) : isLuffy ? (
                /* Luffy gets a bounty board, not a HUD window. The board
                   owns its own masthead, tabs and Marine seal — this wrapper
                   only adds the pinned scraps above and below it, the same
                   role the venom-speak balloons play for Venom. */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  <div className="relative z-20 mb-5 flex items-start justify-between gap-3">
                    <div className="op-scrap flex items-center gap-2.5 px-4 py-2">
                      <StrawHatIcon className="w-5 h-5" />
                      <span className="text-sm sm:text-base">Log Pose</span>
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest op-faint normal-case">
                        GRAND LINE // NEW WORLD
                      </span>
                    </div>

                    <div className="op-scrap hidden sm:block px-3 py-1.5 text-[11px]">
                      The bounty went up again
                    </div>
                  </div>

                  <LuffyConsole />

                  <div className="relative z-20 mt-5 flex justify-end">
                    <div className="op-scrap px-3 py-1.5 text-[11px]">
                      Shishishi. Keep scrolling.
                    </div>
                  </div>
                </div>
              ) : isZoro ? (
                /* Zoro gets a hanging scroll, not a HUD window. The scroll
                   owns its own masthead, dowels and cut divider — this
                   wrapper only adds the two terse notes above and below,
                   the same supporting role Luffy's pinned scraps play. */
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  <div className="relative z-20 mb-5 flex items-start justify-between gap-3">
                    <div className="zk-tag flex items-center gap-2.5 rounded-sm px-4 py-2">
                      <KatanaIcon className="w-5 h-5" />
                      <span className="text-sm sm:text-base">The Dojo</span>
                      <span className="hidden sm:inline font-mono text-[10px] tracking-widest zk-muted normal-case">
                        DIRECTION UNKNOWN
                      </span>
                    </div>

                    <div className="zk-tag hidden rounded-sm px-3 py-1.5 text-[11px] sm:block">
                      Nothing happened.
                    </div>
                  </div>

                  <ZoroConsole />

                  <div className="relative z-20 mt-5 flex justify-end">
                    <div className="zk-tag rounded-sm px-3 py-1.5 text-[11px]">
                      Keep scrolling. I'll catch up. Eventually.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 relative z-10">
                  {/* HUD Frame */}
                  <div className={`relative rounded-2xl overflow-hidden border-2 bg-[#090a0f]/95 backdrop-blur-md flex flex-col h-[580px] transition-all duration-500 ${isIronman ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.35)]' : 'border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.35)]'}`}>
                    
                    {/* HUD Corner Brackets */}
                    <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 z-30 pointer-events-none transition-colors ${isIronman ? 'border-cyan-400' : 'border-red-500'}`} />
                    <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 z-30 pointer-events-none transition-colors ${isIronman ? 'border-amber-400' : 'border-blue-500'}`} />
                    <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 z-30 pointer-events-none transition-colors ${isIronman ? 'border-amber-400' : 'border-blue-500'}`} />
                    <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 z-30 pointer-events-none transition-colors ${isIronman ? 'border-cyan-400' : 'border-red-500'}`} />

                    {/* Window Top Bar / HUD Banner */}
                    <div className={`w-full border-b px-4 py-2.5 flex items-center justify-between z-20 transition-colors ${isIronman ? 'bg-gradient-to-r from-[#031b29] via-[#081226] to-[#1c0808] border-cyan-500/30' : 'bg-gradient-to-r from-[#1c0808] via-[#0f0714] to-[#081226] border-red-500/30'}`}>
                      {/* Left: Window Control Dots & Logo */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${isIronman ? 'bg-cyan-500/90 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                          <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                          <div className={`w-3 h-3 rounded-full ${isIronman ? 'bg-blue-500/90 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-blue-500/90 shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`} />
                        </div>
                        
                        {/* Logo Area */}
                        <div className={`flex items-center gap-1.5 pl-2 border-l border-white/10 transition-colors ${isIronman ? 'text-cyan-400' : 'text-red-500'}`}>
                          {isIronman ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 animate-pulse" xmlns="http://www.w3.org/2000/svg">
                              <path d="M501.491,288.032l-153.832-61.279c-1.212-1.157-2.453-2.283-3.707-3.395h151.364c9.214,0,16.684-7.47,16.684-16.684c0-9.214-7.47-16.684-16.684-16.684H324.755l70.97-28.271c6.346-2.527,10.51-8.668,10.51-15.5V22.422c0-9.214-7.47-16.684-16.684-16.684c-9.214,0-16.684,7.47-16.684,16.684v112.485l-39.875,15.884c0.089-1.514,0.147-3.035,0.147-4.57c0-42.534-34.604-77.138-77.138-77.138s-77.138,34.604-77.138,77.138c0,1.535,0.058,3.058,0.147,4.57l-39.875-15.884V22.422c0-9.214-7.47-16.684-16.684-16.684s-16.684,7.47-16.684,16.684v123.799c0,6.832,4.164,12.972,10.51,15.5l70.97,28.271H16.684C7.47,189.992,0,197.462,0,206.676c0,9.214,7.47,16.684,16.684,16.684h151.364c-1.255,1.111-2.495,2.238-3.707,3.395L10.509,288.032C4.163,290.56,0,296.7,0,303.531V406.22c0,9.214,7.47,16.684,16.684,16.684c9.214,0,16.684-7.47,16.684-16.684v-91.376l98.443-39.214c-4.296,11.258-7.102,23.243-8.179,35.718l-49.599,19.757c-6.347,2.528-10.51,8.668-10.51,15.5v142.973c0,9.214,7.47,16.684,16.684,16.684c9.214,0,16.684-7.47,16.684-16.684v-131.66l28.366-11.3C136.491,408.588,190.841,455.734,256,455.734s119.509-47.145,130.741-109.115l28.366,11.3v131.66c0,9.214,7.47,16.684,16.684,16.684c9.214,0,16.684-7.47,16.684-16.684V346.605c0-6.832-4.163-12.971-10.51-15.5l-49.599-19.757c-1.076-12.474-3.882-24.46-8.179-35.719l98.443,39.214v91.376c0,9.214,7.47,16.684,16.684,16.684c9.214,0,16.684-7.47,16.684-16.684V303.531C512,296.7,507.837,290.56,501.491,288.032z" />
                            </svg>
                          )}
                          <span className="text-[11px] font-extrabold tracking-wider font-mono uppercase">
                            {isIronman ? 'STARK HUD // J.A.R.V.I.S.' : 'SPIDER-MAN HUD // OS v2.0'}
                          </span>
                        </div>
                      </div>

                      {/* Right: HUD Telemetry */}
                      <div className="hidden sm:flex items-center gap-3 text-[9px] font-mono">
                        {isIronman ? (
                          <>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                              ARC REACTOR: 100%
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              TARGETING: ACTIVE
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                              WEBSHOOTERS: 100%
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                              SPIDER-SENSE: ACTIVE
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Console Content Body */}
                    <div className="flex-1 p-4 overflow-hidden relative flex flex-col sys-console">
                      {isIronman ? <IronManConsole /> : <TerminalConsole />}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 6 to 8: Accessible Classic Portfolio Layout */}
            <div className="relative z-10 bg-transparent flex flex-col gap-10 lg:gap-20 pb-20">
              <ScrollReveal>
                <AboutSection />
              </ScrollReveal>
              <ScrollReveal>
                <SkillsSection />
              </ScrollReveal>
              <ScrollReveal triggerStart="top 98%">
                <ProjectsSection />
              </ScrollReveal>
              <ScrollReveal>
                <ExperienceTimeline />
              </ScrollReveal>
              <ScrollReveal>
                <ContactSection />
              </ScrollReveal>
            </div>
          </main>

          {/* Page Footer */}
          <Footer />
        </ClickSpark>
      </div>
    </LayoutGroup>
  );
}

export default App;
