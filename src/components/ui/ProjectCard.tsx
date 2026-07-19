import React, { useRef, useState } from "react";
import { type Project } from "../../data/projects";
import { ArrowRight, ExternalLink } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

interface ProjectCardProps {
  project: Project;
  index: number;
}

const categoryIcons: Record<string, string> = {
  "AI & Education": "🎓",
  "AI & Travel": "✈️",
  "Enterprise & Logistics": "📦",
  "AI & Agriculture": "🌱",
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 20;
    const tiltY = (centerX - x) / 20;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="group perspective-[1000px]"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative preserve-3d transition-all duration-300 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        }}
      >
        {/* Glow orb that follows cursor */}
        <div
          className={`absolute -inset-1 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 pointer-events-none ${isHovered ? "opacity-70" : ""
            }`}
          style={{
            background: `radial-gradient(600px circle at ${isHovered ? "var(--mouse-x, 50%)" : "50%"
              } var(--mouse-y, 50%), rgba(59,130,246,0.15), transparent 40%)`,
          }}
        />

        {/* Main Card */}
        <div className="project-card relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-2xl transition-all duration-500">
          {/* Ambient gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Top row: Category badge + Index */}
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/50 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                <span className="text-xs">{categoryIcons[project.category] ?? "💻"}</span>
                {project.category}
              </span>
              <span className="text-[10px] font-mono text-white/20 tracking-widest">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-300">
              {project.title}
            </h3>

            {/* Gradient accent line */}
            <div className="w-12 h-[2px] rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 mb-4 opacity-70 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />

            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed mb-5 line-clamp-3 group-hover:text-white/60 transition-colors duration-300">
              {project.longDescription}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono text-white/40 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-md hover:bg-white/[0.08] hover:text-white/70 hover:border-white/10 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
              {project.caseStudyUrl && (
                <a
                  href={project.caseStudyUrl}
                  className="group/btn inline-flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors duration-200"
                >
                  <span className="relative">
                    View Project
                    <span className="absolute -bottom-px left-0 right-0 h-[1px] bg-white/30 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-200 ml-auto"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
                >
                  <GithubIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Gradient background on hover */}
          <div
            className={`absolute -inset-40 bg-gradient-radial from-blue-500/[0.03] via-violet-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
          />
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;