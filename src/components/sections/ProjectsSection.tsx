import React, { useState } from "react"
import { projects, type Project } from "../../data/projects"
import { ProjectIntegrations } from "../ui/ProjectIntegrations"
import { Safari } from "../ui/Safari"
import { Iphone } from "../ui/Iphone"
import { ArrowRight, ExternalLink, Code2, Network, Image as ImageIcon, ChevronLeft, ChevronRight, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

export const ProjectsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeProject = projects[activeIdx]
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile" | "architecture">("desktop")
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  return (
    <section
      id="projects"
      className="relative w-full py-32 px-6 overflow-hidden bg-transparent"
    >
      {/* Background gradient orbs */}
      <div className="project-orb absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 [.spiderman_&]:bg-red-600/30 [.ironman_&]:bg-cyan-500/30 rounded-full blur-[128px] pointer-events-none transition-colors duration-700" />
      {/* PS4 Menu Background (Spiderman) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 [.spiderman_&]:opacity-100 transition-opacity duration-700 -z-10 bg-black/40 backdrop-blur-xl border-y border-red-500/20" />
      
      {/* J.A.R.V.I.S HUD Grid Background (Iron Man) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 [.ironman_&]:opacity-100 transition-opacity duration-700 -z-10 bg-[#020813] bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] border-y border-cyan-500/40 shadow-[inset_0_0_100px_rgba(2,8,19,1)]">
        {/* Inner glow over grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,rgba(2,8,19,0.9)_70%)]" />
      </div>

      {/* Section decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-20 [.ironman_&]:flex [.ironman_&]:flex-col [.ironman_&]:items-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-[1.1] uppercase italic [.spiderman_&]:-skew-x-6 [.ironman_&]:tracking-wider [.ironman_&]:text-center transition-all duration-500">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400 [.spiderman_&]:from-red-500 [.spiderman_&]:via-red-500 [.spiderman_&]:to-white [.ironman_&]:from-cyan-400 [.ironman_&]:via-amber-400 [.ironman_&]:to-cyan-200 transition-all duration-700">
              Projects
            </span>
          </h2>
          <p className="text-slate-600 dark:text-white/60 max-w-2xl text-lg uppercase italic tracking-widest [.spiderman_&]:text-xs [.spiderman_&]:text-white/80 [.ironman_&]:text-xs [.ironman_&]:text-cyan-300 [.ironman_&]:text-center transition-all duration-500">
            Real-world applications built with modern technologies — from architecture to production. Click on a project to explore.
          </p>
        </div>

        {/* Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch [.ironman_&]:flex [.ironman_&]:flex-col">
          
          {/* Left Column: Project Selection Tabs */}
          <div className="lg:col-span-5 [.ironman_&]:w-full">
            <div className="flex flex-col gap-2 [.ironman_&]:flex-row [.ironman_&]:flex-wrap [.ironman_&]:justify-center">
              {projects.map((project, idx) => {
                const isActive = idx === activeIdx
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveIdx(idx)
                      setActiveTab("desktop")
                      setActiveImageIdx(0)
                    }}
                    className={`group relative p-4 text-left rounded-xl transition-all duration-300 [.spiderman_&]:-skew-x-6 [.spiderman_&]:rounded-none [.spiderman_&]:border-l-4 [.ironman_&]:stark-hud-panel [.ironman_&]:text-center [.ironman_&]:flex-1 [.ironman_&]:min-w-[200px] [.ironman_&]:rounded-sm [.ironman_&]:border ${
                      isActive
                        ? "bg-white dark:bg-white/10 shadow-lg border-transparent [.spiderman_&]:bg-red-600/90 [.spiderman_&]:border-white [.spiderman_&]:shadow-[0_0_20px_rgba(220,38,38,0.5)] [.ironman_&]:bg-cyan-900/40 [.ironman_&]:border-cyan-400 [.ironman_&]:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "hover:bg-white/50 dark:hover:bg-white/5 border-transparent [.spiderman_&]:bg-black/40 [.spiderman_&]:border-white/20 hover:[.spiderman_&]:bg-red-600/20 hover:[.spiderman_&]:border-red-500 [.ironman_&]:border-cyan-900/50 hover:[.ironman_&]:border-cyan-500/50 hover:[.ironman_&]:bg-cyan-900/20"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-violet-500 transition-transform duration-300 origin-top [.spiderman_&]:hidden [.ironman_&]:hidden ${
                        isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    
                    <div className="flex items-center justify-between mb-2 [.ironman_&]:justify-center">
                      <span className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${
                        isActive ? "text-blue-500 dark:text-blue-400 [.spiderman_&]:text-white/80 [.ironman_&]:text-amber-400" : "text-blue-500 dark:text-blue-400 [.spiderman_&]:text-white/50 [.ironman_&]:text-cyan-500"
                      }`}>
                        {project.category}
                      </span>
                    </div>

                    <h3 className={`text-lg font-bold transition-colors uppercase italic tracking-wider ${
                      isActive ? "text-slate-900 dark:text-white [.spiderman_&]:text-white [.ironman_&]:text-cyan-100" : "text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white [.spiderman_&]:text-white/70 [.spiderman_&]:group-hover:text-white [.ironman_&]:text-cyan-600 [.ironman_&]:group-hover:text-cyan-300"
                    }`}>
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-white/40 mt-2 line-clamp-2 [.ironman_&]:text-cyan-400/60">
                      {project.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Detailed Project Viewer */}
          <div className="lg:col-span-7 [.ironman_&]:w-full">
            <div className="h-full flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-100/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden [.spiderman_&]:bg-black/20 [.spiderman_&]:backdrop-blur-2xl [.ironman_&]:stark-hud-panel">
              
              {/* Header inside viewer */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 [.ironman_&]:flex-col [.ironman_&]:justify-center">
                <div className="[.spiderman_&]:-skew-x-6 [.ironman_&]:text-center">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white [.spiderman_&]:text-white [.ironman_&]:text-cyan-200 uppercase italic tracking-widest leading-tight transition-all duration-500">
                    {activeProject.title}
                  </h3>
                  <span className="text-xs font-mono text-blue-500 dark:text-blue-400 [.spiderman_&]:text-red-400 [.spiderman_&]:tracking-[0.3em] uppercase tracking-wider block mt-1 transition-colors [.ironman_&]:text-amber-500">
                    {activeProject.category}
                  </span>
                </div>

                {/* View switcher tabs */}
                <div className="flex gap-2 [.spiderman_&]:-skew-x-6">
                  <button
                    onClick={() => setActiveTab("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all [.spiderman_&]:rounded-none uppercase [.spiderman_&]:font-bold italic [.ironman_&]:rounded-sm [.ironman_&]:font-bold [.ironman_&]:tracking-wider ${
                      activeTab === "desktop"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm [.spiderman_&]:bg-white [.spiderman_&]:text-red-600 [.spiderman_&]:shadow-[0_0_15px_rgba(255,255,255,0.5)] [.ironman_&]:bg-cyan-500/20 [.ironman_&]:text-cyan-200 [.ironman_&]:border [.ironman_&]:border-cyan-400 [.ironman_&]:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white [.spiderman_&]:text-white/60 [.spiderman_&]:bg-black/50 [.spiderman_&]:border [.spiderman_&]:border-white/20 [.spiderman_&]:hover:text-white [.spiderman_&]:hover:border-white/50 [.ironman_&]:text-cyan-600 [.ironman_&]:bg-transparent [.ironman_&]:border [.ironman_&]:border-transparent hover:[.ironman_&]:text-cyan-300"
                    }`}
                  >
                    <ImageIcon className="size-3.5" />
                    Desktop
                  </button>
                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all [.spiderman_&]:rounded-none uppercase [.spiderman_&]:font-bold italic [.ironman_&]:rounded-sm [.ironman_&]:font-bold [.ironman_&]:tracking-wider ${
                      activeTab === "mobile"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm [.spiderman_&]:bg-white [.spiderman_&]:text-red-600 [.spiderman_&]:shadow-[0_0_15px_rgba(255,255,255,0.5)] [.ironman_&]:bg-cyan-500/20 [.ironman_&]:text-cyan-200 [.ironman_&]:border [.ironman_&]:border-cyan-400 [.ironman_&]:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white [.spiderman_&]:text-white/60 [.spiderman_&]:bg-black/50 [.spiderman_&]:border [.spiderman_&]:border-white/20 [.spiderman_&]:hover:text-white [.spiderman_&]:hover:border-white/50 [.ironman_&]:text-cyan-600 [.ironman_&]:bg-transparent [.ironman_&]:border [.ironman_&]:border-transparent hover:[.ironman_&]:text-cyan-300"
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    Mobile
                  </button>
                  <button
                    onClick={() => setActiveTab("architecture")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all [.spiderman_&]:rounded-none uppercase [.spiderman_&]:font-bold italic [.ironman_&]:rounded-sm [.ironman_&]:font-bold [.ironman_&]:tracking-wider ${
                      activeTab === "architecture"
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm [.spiderman_&]:bg-white [.spiderman_&]:text-red-600 [.spiderman_&]:shadow-[0_0_15px_rgba(255,255,255,0.5)] [.ironman_&]:bg-cyan-500/20 [.ironman_&]:text-cyan-200 [.ironman_&]:border [.ironman_&]:border-cyan-400 [.ironman_&]:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white [.spiderman_&]:text-white/60 [.spiderman_&]:bg-black/50 [.spiderman_&]:border [.spiderman_&]:border-white/20 [.spiderman_&]:hover:text-white [.spiderman_&]:hover:border-white/50 [.ironman_&]:text-cyan-600 [.ironman_&]:bg-transparent [.ironman_&]:border [.ironman_&]:border-transparent hover:[.ironman_&]:text-cyan-300"
                    }`}
                  >
                    <Network className="size-3.5" />
                    Architecture
                  </button>
                </div>
              </div>

              {/* Viewer body container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950/20 [.spiderman_&]:bg-transparent [.spiderman_&]:rounded-none border border-slate-200 dark:border-white/[0.05] [.spiderman_&]:border-none mb-6 flex-1 min-h-[480px] flex items-center justify-center transition-all duration-500 [.spiderman_&]:-skew-x-6 [.ironman_&]:skew-x-0">
                
                
                {/* HUD Corners - Sharp Tech Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-red-500 opacity-0 [.spiderman_&]:opacity-100 pointer-events-none transition-opacity duration-500 z-40" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white opacity-0 [.spiderman_&]:opacity-100 pointer-events-none transition-opacity duration-500 z-40" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white opacity-0 [.spiderman_&]:opacity-100 pointer-events-none transition-opacity duration-500 z-40" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-red-500 opacity-0 [.spiderman_&]:opacity-100 pointer-events-none transition-opacity duration-500 z-40" />

                <AnimatePresence mode="wait">
                  {activeTab === "desktop" && (
                    <motion.div
                      key="desktop"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-full max-w-2xl flex items-center justify-center group/slider">
                        {/* Left Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIdx((prev) => (prev === 0 ? activeProject.images.length - 1 : prev - 1))
                          }}
                          className="absolute left-2 z-20 p-2 rounded-full bg-slate-950/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-white/10 hover:bg-slate-900"
                        >
                          <ChevronLeft className="size-4" />
                        </button>

                        <Safari
                          imageSrc={activeProject.images[activeImageIdx]}
                          url={activeProject.liveUrl?.replace("https://", "") || "example.com"}
                          className="w-full shadow-2xl border border-slate-200/50 dark:border-white/5 [.spiderman_&]:border-white/10 [.spiderman_&]:rounded-none transition-all duration-500 [.spiderman_&]:skew-x-6 [.ironman_&]:skew-x-0 [.ironman_&]:border-cyan-500/30"
                        />

                        {/* Right Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIdx((prev) => (prev === activeProject.images.length - 1 ? 0 : prev + 1))
                          }}
                          className="absolute right-2 z-20 p-2 rounded-full bg-slate-950/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-white/10 hover:bg-slate-900"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>

                      {/* Indicator Dots */}
                      <div className="flex gap-1.5 mt-4">
                        {activeProject.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIdx(i)}
                            className={`size-2 rounded-full transition-all ${
                              i === activeImageIdx ? "bg-blue-500 [.spiderman_&]:bg-red-500 [.ironman_&]:bg-amber-400 w-4" : "bg-slate-400 dark:bg-white/20 [.ironman_&]:bg-cyan-900"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "mobile" && (
                    <motion.div
                      key="mobile"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-full max-w-[210px] flex items-center justify-center group/slider">
                        {/* Left Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIdx((prev) => (prev === 0 ? activeProject.images.length - 1 : prev - 1))
                          }}
                          className="absolute -left-10 z-20 p-2 rounded-full bg-slate-950/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-white/10 hover:bg-slate-900"
                        >
                          <ChevronLeft className="size-4" />
                        </button>

                        <Iphone
                          src={activeProject.images[activeImageIdx]}
                          className="w-full shadow-2xl border border-slate-200/50 dark:border-white/5 [.spiderman_&]:border-white/10 [.spiderman_&]:rounded-[40px] transition-all duration-500 [.spiderman_&]:skew-x-6 [.ironman_&]:skew-x-0 [.ironman_&]:border-cyan-500/30"
                        />

                        {/* Right Arrow */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIdx((prev) => (prev === activeProject.images.length - 1 ? 0 : prev + 1))
                          }}
                          className="absolute -right-10 z-20 p-2 rounded-full bg-slate-950/80 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity border border-white/10 hover:bg-slate-900"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>

                      {/* Indicator Dots */}
                      <div className="flex gap-1.5 mt-4">
                        {activeProject.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIdx(i)}
                            className={`size-2 rounded-full transition-all ${
                              i === activeImageIdx ? "bg-blue-500 [.spiderman_&]:bg-red-500 [.ironman_&]:bg-amber-400 w-4" : "bg-slate-400 dark:bg-white/20 [.ironman_&]:bg-cyan-900"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "architecture" && (
                    <motion.div
                      key="architecture"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full p-4 flex items-center justify-center"
                    >
                      <ProjectIntegrations
                        integrations={activeProject.integrations}
                        category={activeProject.category}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-6 [.ironman_&]:text-center">
                {activeProject.longDescription}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-6 [.ironman_&]:justify-center">
                {activeProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono text-slate-600 dark:text-white/40 bg-slate-200 dark:bg-white/[0.03] border border-slate-300 dark:border-white/[0.05] px-2.5 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-300 dark:border-white/[0.05] [.ironman_&]:justify-center [.ironman_&]:w-full">
                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    <GithubIcon className="size-4" />
                    Source Code
                  </a>
                )}
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    <ExternalLink className="size-4" />
                    Live Demo
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
