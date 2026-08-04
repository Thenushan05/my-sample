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
import { TerminalConsole } from "./components/immersive/TerminalConsole";
import { PageLoader } from "./components/layout/PageLoader";
import { SpidermanLoader } from "./components/immersive/SpidermanLoader";
import { IronManHelmetHUD } from "./components/immersive/IronManHelmetHUD";
import { IronManConsole } from "./components/immersive/IronManConsole";

import { LayoutGroup } from "framer-motion";

export function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );
  const [isIronman, setIsIronman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("ironman")
  );

  useEffect(() => {
    const syncModes = () => {
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
      setIsIronman(document.documentElement.classList.contains("ironman"));
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
  }, [isSpiderman]);

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
          ) : (
            <PageLoader key="hacker-loader" onComplete={() => setLoadingComplete(true)} />
          )
        )}
      </AnimatePresence>

      {/* Global Navigation Header - Always visible immediately upon load completion */}
      {loadingComplete && <Navbar />}

      {/* ── Main App Content ──────────────────────── */}
      <div className={`relative w-full min-h-screen text-white select-none ${loadingComplete ? "opacity-100" : "opacity-0 transition-opacity duration-500"}`}>
        <ClickSpark sparkColor="#8B5CF6" sparkSize={8} sparkRadius={20} sparkCount={10} duration={500} extraScale={1.2}>
          {/* Cinematic ambient lighting backgrounds */}
          <ThemeBackground />

          {/* Immersive HUD Overlays */}
          {isIronman && <IronManHelmetHUD />}

          {/* Immersive Spidey Mode Effects */}
          {isSpiderman && <SpiderwebBackground />}
          {isSpiderman && <SpiderCrawl />}
          {isSpiderman && <SpidermanDrop />}

          {/* ── Page Layout ───────────────────────────── */}
          <main>
            {/* Section 1: Hero Section */}
            <section id="hero">
              <HeroSection onExploreClick={scrollToStory} />
            </section>

            {/* Section 2 to 5: Interactive Code Console & Snake Terminal (Normal Mode) OR Spidey Terminal HUD (Spidey Mode) */}
            <div id="laptop-story-trigger" className="relative w-full">
              {!isSpiderman && !isIronman ? (
                <LaptopStory />
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
              <ScrollReveal>
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
