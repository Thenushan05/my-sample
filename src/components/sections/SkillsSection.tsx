import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { skillCategories, techStack } from "../../data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { IconCloud } from "../ui/IconCloud";
import spideyLogo from "../../assets/spidey-logo-white.png";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "openjdk",
  "react",
  "flutter",
  "android",
  "html5",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "angular",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "androidstudio",
  "figma",
];

export const SkillsSection: React.FC = () => {
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}`);
  const [cloudSize, setCloudSize] = useState(300);
  const [isIronman, setIsIronman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("ironman")
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCloudSize(300);
      } else if (window.innerWidth < 1024) {
        setCloudSize(420);
      } else {
        setCloudSize(500);
      }
    };
    const syncModes = () => {
      setIsIronman(document.documentElement.classList.contains("ironman"));
    };
    
    handleResize();
    syncModes();

    window.addEventListener("resize", handleResize);
    const observer = new MutationObserver(syncModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="skills" className="w-full py-16 sm:py-24 px-4 sm:px-6 relative bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16 [.ironman_&]:flex [.ironman_&]:flex-col">
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-5 flex flex-col justify-center transition-all duration-500 skew-0 md:-skew-x-6 [.ironman_&]:-skew-x-0 [.ironman_&]:items-center [.ironman_&]:text-center">
            <SectionHeading
              title="Skills & Technologies"
              subtitle="My Capabilities"
              align="left"
            />
            <p className="text-slate-600 dark:text-white/60 text-sm md:text-base leading-relaxed font-mono italic text-center md:text-left [.ironman_&]:text-center">
              An interactive 3D representation of the modern technologies, languages, and frameworks I use to build robust digital experiences.
            </p>
            <p className="text-slate-400 dark:text-white/30 text-xs mt-3 font-mono italic text-center md:text-left [.ironman_&]:text-center">
              ★ Drag to rotate the cloud, hover or grab to interact with specific tools.
            </p>
          </div>

          {/* Right Column: Dynamic 3D tag cloud (Right-aligned and larger) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end overflow-hidden [.ironman_&]:justify-center [.ironman_&]:w-full">
            <div className="relative flex items-center justify-center p-2 sm:p-4 md:p-6 bg-transparent border border-slate-200 dark:border-white/5 shadow-sm aspect-square w-full max-w-[340px] sm:max-w-[460px] md:max-w-[520px] transition-all duration-500 rounded-none border-white/20 border-y border-x-0 [.spiderman_&]:rounded-full [.spiderman_&]:border-transparent [.spiderman_&]:shadow-[0_0_50px_rgba(220,38,38,0.15)] mx-auto lg:ml-auto lg:mr-0 [.ironman_&]:mx-auto [.ironman_&]:stark-hud-panel">
              
              {/* Spinning Spidey World Rings */}
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-red-500/40 opacity-0 [.spiderman_&]:opacity-100 [.spiderman_&]:animate-[spin_20s_linear_infinite] pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-red-500/20 opacity-0 [.spiderman_&]:opacity-100 [.spiderman_&]:animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent opacity-0 [.spiderman_&]:opacity-100 pointer-events-none backdrop-blur-sm" />
              
              {/* Spider-Man Background Logo */}
              <img 
                src={spideyLogo} 
                alt="" 
                className="absolute inset-0 m-auto w-[60%] h-[60%] object-contain opacity-0 [.spiderman_&]:opacity-10 pointer-events-none transition-opacity duration-500 text-red-500 [.spiderman_&]:animate-[spin_30s_linear_infinite]" 
                style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.5))" }}
              />

              <div className="relative z-10">
                <IconCloud images={images} size={cloudSize} />
              </div>
            </div>
          </div>
        </div>

        {/* Skill groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 transition-all duration-500 skew-0 md:-skew-x-6 [.ironman_&]:-skew-x-0">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <GlassCard glowColor={`${category.color}15`} className="h-full transition-all duration-500 !rounded-none [.spiderman_&]:!bg-black/40 border-white/20 border-y border-x-0 !p-4 sm:!p-6 flex flex-col items-center md:items-start md:block [.ironman_&]:stark-hud-panel [.ironman_&]:flex [.ironman_&]:flex-col [.ironman_&]:items-center">
                <div className="flex items-center gap-3 mb-4 flex-col md:flex-row [.ironman_&]:flex-col text-center md:text-left">
                  <span className="text-base flex items-center justify-center w-7 h-7 rounded bg-white/5 border border-white/10 shrink-0">
                    {category.icon}
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono italic">
                    {category.label}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start [.ironman_&]:justify-center">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag text-xs text-white/70 bg-white/5 border border-white/5 px-2.5 py-1 font-mono transition-all duration-500 rounded-none border-white/20 italic [.spiderman_&]:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Full Tech Stack Breakdown with Hero Vibes */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="tech-stack-section relative bg-white/[0.01] border border-white/5 p-4 sm:p-6 md:p-8 transition-all duration-500 skew-0 md:-skew-x-6 rounded-none border-white/20 border-y border-x-0 [.spiderman_&]:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] [.spiderman_&]:from-red-950/40 [.spiderman_&]:via-black/80 [.spiderman_&]:to-black/95 [.spiderman_&]:border-red-600/40 [.spiderman_&]:shadow-[0_0_35px_rgba(239,68,68,0.25)] [.ironman_&]:-skew-x-0 [.ironman_&]:stark-hud-panel [.spiderman_&]:backdrop-blur-xl overflow-hidden"
        >
          {/* Top accent web shooter bar for Spidey Mode */}
          <div className="hidden [.spiderman_&]:block absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-blue-600 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />

          {/* Top accent Repulsor bar for Iron Man Mode */}
          <div className="hidden [.ironman_&]:block absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-red-600 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />

          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 [.spiderman_&]:border-red-500/30 [.ironman_&]:border-cyan-500/30">
            <div className="flex items-center gap-2.5">
              <img
                src={spideyLogo}
                alt="Spidey Emblem"
                className="w-5 h-5 object-contain mix-blend-screen [filter:invert(20%)_sepia(90%)_saturate(5000%)_hue-rotate(350deg)_brightness(100%)_contrast(110%)] drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse hidden [.spiderman_&]:block"
              />
              <img
                src={arcReactorLogo}
                alt="Arc Reactor Emblem"
                className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse hidden [.ironman_&]:block"
              />
              <h4 className="text-white/70 text-xs sm:text-sm tracking-widest uppercase font-extrabold font-mono transition-colors [.spiderman_&]:text-red-400 [.ironman_&]:text-cyan-400 italic">
                Technical Stack Overview
              </h4>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-white/40 [.spiderman_&]:text-blue-400 [.ironman_&]:text-amber-400 [.spiderman_&]:font-bold [.ironman_&]:font-bold italic">
              <span className="hidden [.spiderman_&]:inline">🕷️ STARK & OSCORP MAINFRAME GRID</span>
              <span className="hidden [.ironman_&]:inline">🦾 JARVIS MARK LXXXV SUITE</span>
              <span className="inline [.spiderman_&]:hidden [.ironman_&]:hidden">CORE ARCHITECTURE GRID</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div
                key={category}
                className="relative group p-3.5 sm:p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] [.spiderman_&]:rounded-none [.spiderman_&]:border-red-500/30 [.spiderman_&]:bg-black/60 [.spiderman_&]:hover:border-red-500/80 [.spiderman_&]:hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] [.ironman_&]:bg-transparent [.ironman_&]:border-transparent overflow-hidden [.ironman_&]:flex [.ironman_&]:flex-col [.ironman_&]:items-center"
              >
                {/* Spidey web line accent top corner */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden [.spiderman_&]:block">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-red-500 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-red-500 to-transparent" />
                </div>

                {/* Iron Man HUD accent top corner */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden [.ironman_&]:block">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-400 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-amber-400 to-transparent" />
                </div>

                <div className="flex items-center gap-2 mb-3 [.ironman_&]:flex-col">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 [.spiderman_&]:bg-red-500 [.spiderman_&]:shadow-[0_0_8px_#ef4444] [.ironman_&]:bg-amber-400 [.ironman_&]:shadow-[0_0_8px_#f59e0b] [.ironman_&]:w-2 [.ironman_&]:h-2" />
                  <span className="text-xs font-extrabold tracking-wider text-blue-400 uppercase font-mono transition-colors [.spiderman_&]:text-red-400 [.ironman_&]:text-amber-400 italic block [.ironman_&]:text-center">
                    {category}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-white/60 font-mono transition-colors italic [.ironman_&]:flex [.ironman_&]:flex-col [.ironman_&]:items-center">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 group/item">
                      <span className="hidden [.spiderman_&]:inline text-[10px] text-red-400 group-hover/item:text-blue-400 shrink-0">
                        🕷️
                      </span>
                      <span className="hidden [.ironman_&]:inline text-[10px] text-cyan-400 group-hover/item:text-amber-400 shrink-0">
                        ⚡
                      </span>
                      <span className="inline [.spiderman_&]:hidden [.ironman_&]:hidden w-1.5 h-1.5 bg-violet-500/80 rounded-none shrink-0" />
                      <span className="truncate group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default SkillsSection;
