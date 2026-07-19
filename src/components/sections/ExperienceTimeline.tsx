import React from "react";
import { motion } from "framer-motion";
import { experiences } from "../../data/experience";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="w-full py-24 px-6 relative bg-transparent">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Professional Journey"
          subtitle="Timeline"
        />

        <div className="relative pl-8 md:pl-10">
          {/* Glowing connector line */}
          <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-blue-500 via-violet-500 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative"
              >
                {/* Glowing Dot indicator */}
                <div className="absolute -left-8 md:-left-10 top-6 flex items-center justify-center">
                  <div
                    className="exp-dot w-3.5 h-3.5 rounded-full border-2 bg-[#030712] transition-colors duration-300"
                    style={{
                      borderColor: exp.type === "work" ? "#3B82F6" : "#8B5CF6",
                      boxShadow: `0 0 12px ${exp.type === "work" ? "#3B82F6" : "#8B5CF6"}`,
                    }}
                  />
                </div>

                {/* Experience Card */}
                <GlassCard glowColor={exp.type === "work" ? "rgba(59, 130, 246, 0.08)" : "rgba(139, 92, 246, 0.08)"}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight uppercase font-mono">
                        {exp.role}
                      </h3>
                      <span className="text-xs text-blue-400 font-bold block mt-1 font-mono">
                        {exp.company}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30 font-mono tracking-wider font-bold uppercase">
                        {exp.period}
                      </span>
                      <span
                        className="text-[8px] font-bold border rounded px-2 py-0.5 uppercase tracking-widest font-mono"
                        style={{
                          borderColor: exp.type === "work" ? "rgba(59,130,246,0.3)" : "rgba(139,92,246,0.3)",
                          color: exp.type === "work" ? "#60A5FA" : "#A78BFA",
                        }}
                      >
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <p className="exp-description text-xs text-white/50 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Highlights list */}
                  <ul className="space-y-1.5 mb-6">
                    {exp.highlights.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="exp-tech-tag text-[9px] text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ExperienceTimeline;
