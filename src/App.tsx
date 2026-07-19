import React, { useState } from "react";
import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { PageLoader } from "./components/layout/PageLoader";
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

import { LayoutGroup } from "framer-motion";

export function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

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
      <AnimatePresence>
        {!loadingComplete && (
          <PageLoader onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {/* Global Navigation Header - Always visible immediately upon load completion */}
      {loadingComplete && <Navbar />}

      {/* ── Main App Content ──────────────────────── */}
      <div className={`relative w-full min-h-screen text-white select-none ${loadingComplete ? "opacity-100" : "opacity-0 transition-opacity duration-500"}`}>
        <ClickSpark sparkColor="#8B5CF6" sparkSize={8} sparkRadius={20} sparkCount={10} duration={500} extraScale={1.2}>
          {/* Cinematic ambient lighting backgrounds */}
          <ThemeBackground />

          {/* ── Page Layout ───────────────────────────── */}
          <main>
            {/* Section 1: Hero Section */}
            <section id="hero">
              <HeroSection onExploreClick={scrollToStory} />
            </section>

            {/* Section 2 to 5: Pinned Laptop 2.5D Storyteller */}
            <div id="laptop-story-trigger" className="relative w-full">
              <LaptopStory />
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
