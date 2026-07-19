import React from "react";
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
  "css3",
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
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
]

export const SkillsSection: React.FC = () => {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}`
  )

  return (
    <section id="skills" className="w-full py-24 px-6 relative bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionHeading
              title="Skills & Technologies"
              subtitle="My Capabilities"
              align="left"
            />
            <p className="text-slate-600 dark:text-white/60 text-sm md:text-base leading-relaxed font-mono mt-[-20px]">
              An interactive 3D representation of the modern technologies, languages, and frameworks I use to build robust digital experiences.
            </p>
            <p className="text-slate-400 dark:text-white/30 text-xs mt-4 font-mono">
              ★ Drag to rotate the cloud, hover or grab to interact with specific tools.
            </p>
          </div>

          {/* Right Column: Dynamic 3D tag cloud (Right-aligned and larger) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end overflow-hidden">
            <div className="relative flex items-center justify-center p-4 md:p-6 bg-slate-100/30 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm min-h-[550px] w-full max-w-[550px]">
              <IconCloud images={images} size={550} />
            </div>
          </div>
        </div>

        {/* Skill groups grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <GlassCard glowColor={`${category.color}15`} className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{category.icon}</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    {category.label}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag text-xs text-white/70 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg font-mono"
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
          className="tech-stack-section bg-white/[0.01] border border-white/5 rounded-2xl p-8"
        >
          <h4 className="text-white/40 text-xs tracking-wider uppercase font-bold font-mono mb-6">
            Technical Stack Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase font-mono">
                  {category}
                </span>
                <ul className="space-y-1.5 text-xs text-white/50 font-mono">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500/80" />
                      {item}
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
