import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { skillCategories, techStack } from "../../data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { IconCloud } from "../ui/IconCloud";
import spideyLogo from "../../assets/spidey-logo.png";

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
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="skills" className="w-full py-16 sm:py-24 px-4 sm:px-6 relative bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-5 flex flex-col justify-center transition-transform duration-500 skew-0 md:-skew-x-6">
            <SectionHeading
              title="Skills & Technologies"
              subtitle="My Capabilities"
              align="left"
            />
            <p className="text-slate-600 dark:text-white/60 text-sm md:text-base leading-relaxed font-mono italic">
              An interactive 3D representation of the modern technologies, languages, and frameworks I use to build robust digital experiences.
            </p>
            <p className="text-slate-400 dark:text-white/30 text-xs mt-3 font-mono italic">
              ★ Drag to rotate the cloud, hover or grab to interact with specific tools.
            </p>
          </div>

          {/* Right Column: Dynamic 3D tag cloud (Right-aligned and larger) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end overflow-hidden">
            <div className="relative flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-100/30 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 shadow-sm min-h-[320px] sm:min-h-[440px] md:min-h-[520px] w-full max-w-[340px] sm:max-w-[460px] md:max-w-[520px] transition-all duration-500 rounded-none border-white/20 border-y border-x-0 [.spiderman_&]:bg-black/20 [.spiderman_&]:backdrop-blur-xl mx-auto lg:ml-auto lg:mr-0">
              <IconCloud images={images} size={cloudSize} />
            </div>
          </div>
        </div>

        {/* Skill groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 transition-transform duration-500 skew-0 md:-skew-x-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <GlassCard glowColor={`${category.color}15`} className="h-full transition-all duration-500 !rounded-none [.spiderman_&]:!bg-black/40 border-white/20 border-y border-x-0 !p-4 sm:!p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-base flex items-center justify-center w-7 h-7 rounded bg-white/5 border border-white/10 shrink-0">
                    {category.icon}
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono italic">
                    {category.label}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
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

        {/* Full Tech Stack Breakdown with Spidey Vibe */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="tech-stack-section relative bg-white/[0.01] border border-white/5 p-4 sm:p-6 md:p-8 transition-all duration-500 skew-0 md:-skew-x-6 rounded-none border-white/20 border-y border-x-0 [.spiderman_&]:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] [.spiderman_&]:from-red-950/40 [.spiderman_&]:via-black/80 [.spiderman_&]:to-black/95 [.spiderman_&]:border-red-600/40 [.spiderman_&]:shadow-[0_0_35px_rgba(239,68,68,0.25)] [.spiderman_&]:backdrop-blur-xl overflow-hidden"
        >
          {/* Top accent web shooter bar for Spidey Mode */}
          <div className="hidden [.spiderman_&]:block absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-blue-600 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />

          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 [.spiderman_&]:border-red-500/30">
            <div className="flex items-center gap-2.5">
              <img
                src={spideyLogo}
                alt="Spidey Emblem"
                className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse hidden [.spiderman_&]:block"
              />
              <h4 className="text-white/70 text-xs sm:text-sm tracking-widest uppercase font-extrabold font-mono transition-colors [.spiderman_&]:text-red-400 italic">
                Technical Stack Overview
              </h4>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-white/40 [.spiderman_&]:text-blue-400 [.spiderman_&]:font-bold italic">
              <span className="hidden [.spiderman_&]:inline">🕷️ STARK & OSCORP MAINFRAME GRID</span>
              <span className="inline [.spiderman_&]:hidden">CORE ARCHITECTURE GRID</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div
                key={category}
                className="relative group p-3.5 sm:p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] [.spiderman_&]:rounded-none [.spiderman_&]:border-red-500/30 [.spiderman_&]:bg-black/60 [.spiderman_&]:hover:border-red-500/80 [.spiderman_&]:hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] overflow-hidden"
              >
                {/* Spidey web line accent top corner */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden [.spiderman_&]:block">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-red-500 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-red-500 to-transparent" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 [.spiderman_&]:bg-red-500 [.spiderman_&]:shadow-[0_0_8px_#ef4444]" />
                  <span className="text-xs font-extrabold tracking-wider text-blue-400 uppercase font-mono transition-colors [.spiderman_&]:text-red-400 italic block">
                    {category}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-white/60 font-mono transition-colors italic">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 group/item">
                      <span className="text-[10px] text-violet-400/80 transition-all [.spiderman_&]:text-red-400 [.spiderman_&]:group-hover/item:text-blue-400 shrink-0">
                        🕷️
                      </span>
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
