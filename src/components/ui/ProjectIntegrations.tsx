import React, { forwardRef, useRef, useState, useEffect } from "react"
import { type IntegrationNode } from "../../data/projects"
import { AnimatedBeam } from "./AnimatedBeam"
import { cn } from "../../lib/utils"
import { Brain, Cpu, Database, Cloud, Globe, Bot, Layers, Network, Eye } from "lucide-react"

interface ProjectIntegrationsProps {
  integrations: IntegrationNode[]
  category: string
}

// Icon mapper for integrations
const iconMap: Record<string, React.ComponentType<any>> = {
  react: Globe,
  api: Cpu,
  database: Database,
  openai: Bot,
  chain: Network,
  docker: Layers,
  code: Cpu,
  map: Globe,
  bolt: Cpu,
  cloud: Cloud,
  server: Cloud,
  brain: Brain,
  eye: Eye,
}

const categoryIcons: Record<string, string> = {
  "AI & Education": "🎓",
  "AI & Travel": "✈️",
  "Enterprise & Logistics": "📦",
  "AI & Agriculture": "🌱",
}

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; name?: string }
>(({ className, children, name }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] transition-colors relative group cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 [.spiderman_&]:border-red-900/50 [.spiderman_&]:bg-black [.spiderman_&]:hover:border-red-500 [.spiderman_&]:shadow-[0_0_15px_rgba(220,38,38,0.3)]",
        className
      )}
    >
      {children}
      {name && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 border border-white/10 font-mono">
          {name}
        </span>
      )}
    </div>
  )
})

Circle.displayName = "Circle"

export const ProjectIntegrations: React.FC<ProjectIntegrationsProps> = ({
  integrations,
  category,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  // Map icons
  const getIconComponent = (idx: number) => {
    const item = integrations[idx]
    if (!item) return <Cpu className="size-5" />
    const Icon = iconMap[item.icon] || Cpu
    return <Icon className="size-5" style={{ color: item.color }} />
  }

  const getName = (idx: number) => integrations[idx]?.name || ""

  const [isSpidey, setIsSpidey] = useState(false)
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsSpidey(document.documentElement.classList.contains("spiderman"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    setIsSpidey(document.documentElement.classList.contains("spiderman"))
    return () => observer.disconnect()
  }, [])

  const beamColor = isSpidey ? "#ef4444" : "#3b82f6"

  return (
    <div
      className="relative flex h-[320px] w-full items-center justify-center overflow-hidden bg-slate-950/40 [.spiderman_&]:bg-black/20 [.spiderman_&]:backdrop-blur-xl rounded-2xl [.spiderman_&]:rounded-none border border-white/[0.05] [.spiderman_&]:border-y [.spiderman_&]:border-x-0 [.spiderman_&]:border-white/20 p-6 md:p-10 transition-colors duration-500 shadow-[0_0_0_rgba(220,38,38,0)]"
      ref={containerRef}
    >
      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref} name={getName(0)}>
            {getIconComponent(0)}
          </Circle>
          <Circle ref={div5Ref} name={getName(3)}>
            {getIconComponent(3)}
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} name={getName(1)}>
            {getIconComponent(1)}
          </Circle>
          <Circle ref={div4Ref} className="size-16 border-blue-500 dark:border-blue-400 [.spiderman_&]:border-white bg-blue-50/50 dark:bg-blue-950/20 [.spiderman_&]:bg-red-600/30 [.spiderman_&]:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="text-2xl relative z-10">{categoryIcons[category] || "💻"}</span>
          </Circle>
          <Circle ref={div6Ref} name={getName(4)}>
            {getIconComponent(4)}
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} name={getName(2)}>
            {getIconComponent(2)}
          </Circle>
          <Circle ref={div7Ref} name={getName(5)}>
            {getIconComponent(5)}
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        gradientStartColor={integrations[0]?.color}
        gradientStopColor={beamColor}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        gradientStartColor={integrations[1]?.color}
        gradientStopColor={beamColor}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        gradientStartColor={integrations[2]?.color}
        gradientStopColor={beamColor}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
        gradientStartColor={integrations[3]?.color}
        gradientStopColor={beamColor}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
        gradientStartColor={integrations[4]?.color}
        gradientStopColor={beamColor}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
        gradientStartColor={integrations[5]?.color}
        gradientStopColor={beamColor}
      />
    </div>
  )
}
