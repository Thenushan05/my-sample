import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, Code2 } from "lucide-react";
import { experiences, type Experience } from "../../data/experience";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";

// Pointer-reactive 3D tilt wrapper around GlassCard
const TiltCard: React.FC<{ children: React.ReactNode; glowColor: string }> = ({
  children,
  glowColor,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Simplified tilt for performance
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="will-change-transform"
    >
      <GlassCard glowColor={glowColor}>{children}</GlassCard>
    </motion.div>
  );
};

// Glowing timeline node with concentric pulse rings
const TimelineNode: React.FC<{ type: Experience["type"] }> = ({ type }) => {
  /* var()-with-fallback: every hero mode except Luffy leaves --tl-work /
     --tl-project undefined, so this resolves straight to the original hex
     and nothing changes for them. Luffy alone defines those two custom
     properties (see index.css), because it is the one theme where the
     hardcoded blue/violet — chosen assuming a near-black backdrop — fails
     contrast outright on parchment, and an inline style is the one thing a
     stylesheet selector can never reach to fix from the outside. */
  const color = type === "work" ? "var(--tl-work, #3B82F6)" : "var(--tl-project, #8B5CF6)";
  const Icon = type === "work" ? Briefcase : Code2;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          /* `color` below is an inline style, so a stylesheet can only beat it
             with !important — hence the `!` on every mode override here. */
          className="absolute inset-0 rounded-full border [.spiderman_&]:!border-white [.ironman_&]:!border-cyan-400 [.deadpool_&]:!border-[#dc143c] transition-colors duration-500"
          style={{ borderColor: color }}
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: ring * 1.2,
          }}
        />
      ))}
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#030712] border-2 [.spiderman_&]:!border-red-600 [.spiderman_&]:!shadow-[0_0_18px_red] [.ironman_&]:!border-cyan-400 [.ironman_&]:!shadow-[0_0_18px_rgba(6,182,212,0.9)] [.deadpool_&]:!border-black [.deadpool_&]:!bg-[#dc143c] [.deadpool_&]:!shadow-[3px_3px_0_rgba(0,0,0,0.85)] transition-all duration-500"
        style={{ borderColor: color, boxShadow: `0 0 18px ${color}` }}
      >
        <Icon className="w-4 h-4 [.spiderman_&]:!text-white [.ironman_&]:!text-cyan-300 [.deadpool_&]:!text-[#fff8e7] transition-colors duration-500" style={{ color }} />
      </div>
    </div>
  );
};

const ExperienceCard: React.FC<{ exp: Experience }> = ({ exp }) => {
  const color = exp.type === "work" ? "var(--tl-work, #3B82F6)" : "var(--tl-project, #8B5CF6)";
  return (
    <TiltCard
      glowColor={exp.type === "work" ? "rgba(59, 130, 246, 0.08)" : "rgba(139, 92, 246, 0.08)"}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white leading-tight uppercase font-mono italic transition-all duration-500">
            {exp.role}
          </h3>
          <span className="text-xs text-blue-400 font-bold block mt-1 font-mono [.spiderman_&]:text-white italic transition-colors duration-500">
            {exp.company}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 font-mono tracking-wider font-bold uppercase">
            {exp.period}
          </span>
          <span
            className="text-[8px] font-bold border rounded px-2 py-0.5 uppercase tracking-widest font-mono [.spiderman_&]:border-red-500 [.spiderman_&]:text-red-500 [.spiderman_&]:rounded-none transition-all duration-500"
            style={{
              borderColor:
                exp.type === "work"
                  ? "var(--tl-work-border, rgba(59,130,246,0.3))"
                  : "var(--tl-project-border, rgba(139,92,246,0.3))",
              color: exp.type === "work" ? "var(--tl-work-text, #60A5FA)" : "var(--tl-project-text, #A78BFA)",
            }}
          >
            {exp.type}
          </span>
        </div>
      </div>

      <p className="exp-description text-xs text-white/50 leading-relaxed mb-4 italic transition-all duration-500">
        {exp.description}
      </p>

      {/* Highlights list */}
      <ul className="space-y-1.5 mb-6">
        {exp.highlights.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed italic transition-all duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 mt-1.5 flex-shrink-0 [.spiderman_&]:bg-red-500 [.spiderman_&]:rounded-none [.ironman_&]:bg-cyan-400 [.deadpool_&]:bg-[#dc143c] [.deadpool_&]:rounded-none transition-all duration-500" />
            {item}
          </li>
        ))}
      </ul>

      {/* Technology Tags */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5 [.spiderman_&]:border-white/20 transition-colors duration-500">
        {exp.technologies.map((tech) => (
          <span
            key={tech}
            className="exp-tech-tag text-[9px] text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-mono [.spiderman_&]:rounded-none [.spiderman_&]:text-white [.spiderman_&]:border-white/20 italic transition-all duration-500"
          >
            {tech}
          </span>
        ))}
      </div>
      <span
        className="hidden md:block absolute top-8 w-10 h-px"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </TiltCard>
  );
};

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="w-full py-24 px-6 relative bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Professional Journey"
          subtitle="Timeline"
        />

        <div className="relative">
          {/* Center spine - desktop zigzag layout */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 via-violet-500/40 to-transparent [.spiderman_&]:from-red-600/80 [.spiderman_&]:via-white/40 [.spiderman_&]:to-transparent [.ironman_&]:from-cyan-400/60 [.ironman_&]:via-amber-400/40 [.deadpool_&]:from-[#dc143c] [.deadpool_&]:via-[#7f1d1d] transition-all duration-500" />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 [.spiderman_&]:bg-white [.deadpool_&]:!bg-[#dc143c] [.deadpool_&]:!shadow-[0_0_14px_3px_rgba(220,20,60,0.85)] transition-colors duration-500"
              style={{ boxShadow: "0 0 14px 3px rgba(103,232,249,0.8)" }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Left rail - mobile */}
          <div className="md:hidden absolute left-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-blue-500 via-violet-500 to-transparent [.spiderman_&]:from-red-600/80 [.spiderman_&]:via-white/40 [.spiderman_&]:to-transparent [.ironman_&]:from-cyan-400 [.ironman_&]:via-amber-400 [.deadpool_&]:from-[#dc143c] [.deadpool_&]:via-[#7f1d1d] transition-colors duration-500" />

          <div className="space-y-14 md:space-y-24">
            {experiences.map((exp, i) => {
              const isEven = i % 2 === 0;
              const color = exp.type === "work" ? "var(--tl-work, #3B82F6)" : "var(--tl-project, #8B5CF6)";

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.1, ease: "easeOut" }}
                  className="relative pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-14 md:items-center transition-transform duration-500 [.spiderman_&]:-skew-x-6"
                >
                  {/* Node - mobile */}
                  <div className="md:hidden absolute -left-8 top-6 transition-transform duration-500 [.spiderman_&]:skew-x-6">
                    <div
                      className="exp-dot w-3.5 h-3.5 rounded-full border-2 bg-[#030712] [.spiderman_&]:!border-white [.spiderman_&]:!bg-red-500 [.ironman_&]:!border-cyan-400 [.deadpool_&]:!border-black [.deadpool_&]:!bg-[#dc143c] [.deadpool_&]:!shadow-[2px_2px_0_rgba(0,0,0,0.85)]"
                      style={{ borderColor: color, boxShadow: `0 0 12px ${color}` }}
                    />
                  </div>

                  {/* Node - desktop, centered on the spine */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-20 transition-transform duration-500 [.spiderman_&]:skew-x-6">
                    <TimelineNode type={exp.type} />
                  </div>

                  {isEven ? (
                    <>
                      <div className="md:pr-6">
                        <ExperienceCard exp={exp} />
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="md:pl-6">
                        <ExperienceCard exp={exp} />
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ExperienceTimeline;
