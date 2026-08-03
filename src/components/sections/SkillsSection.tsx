import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { skillCategories, techStack } from "../../data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { IconCloud } from "../ui/IconCloud";

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

        {/* Full Tech Stack Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="tech-stack-section bg-white/[0.01] border border-white/5 p-4 sm:p-6 md:p-8 transition-all duration-500 skew-0 md:-skew-x-6 rounded-none border-white/20 border-y border-x-0 [.spiderman_&]:bg-black/20 [.spiderman_&]:backdrop-blur-xl"
        >
          <h4 className="text-white/40 text-xs tracking-wider uppercase font-bold font-mono mb-4 sm:mb-6 transition-colors [.spiderman_&]:text-white italic">
            Technical Stack Overview
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase font-mono transition-colors [.spiderman_&]:text-red-500 italic block">
                  {category}
                </span>
                <ul className="space-y-1.5 text-xs text-white/50 font-mono transition-colors italic">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-violet-500/80 transition-all [.spiderman_&]:bg-red-500 rounded-none shrink-0" />
                      <span className="truncate">{item}</span>
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
