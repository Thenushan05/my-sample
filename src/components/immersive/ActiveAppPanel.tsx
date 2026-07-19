import React from "react"

interface ActiveAppPanelProps {
  appId: string
}

export const ActiveAppPanel: React.FC<ActiveAppPanelProps> = ({ appId }) => {
  switch (appId) {
    case "aiml":
      return (
        <div className="space-y-4 text-white/90">
          <h3 className="text-lg font-bold text-[#FF6F00] font-mono uppercase">
            1. AI & Machine Learning
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-white/60">
            Training neural network classifiers, processing computer vision frames, and deploying light inference endpoints.
          </p>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider block">
              Core Technologies
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                "TensorFlow",
                "PyTorch",
                "OpenCV",
                "Pandas / NumPy",
                "Scikit-Learn",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[9px] text-slate-700 dark:text-white/80 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-3 text-[8px] text-slate-400 dark:text-white/30 font-mono flex justify-between">
            <span>FOCUS: MODEL SERVING</span>
            <span>ROLE: AI ENGINEER</span>
          </div>
        </div>
      )

    case "backend":
      return (
        <div className="space-y-4 text-white/90">
          <h3 className="text-lg font-bold text-[#339933] font-mono uppercase">
            2. Backend Architecture
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-white/60">
            Designing transactional database schemas, tuning indexing strategies, building microservice endpoints, and caching heavy queries.
          </p>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider block">
              Systems Stack
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                "Node.js / Express",
                "FastAPI / Python",
                "PostgreSQL",
                "Redis Cache",
                "Prisma ORM",
                "JWT / OAuth",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[9px] text-slate-700 dark:text-white/80 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-3 text-[8px] text-slate-400 dark:text-white/30 font-mono flex justify-between">
            <span>FOCUS: SCALABILITY & SPEED</span>
            <span>ROLE: BACKEND ARCHITECT</span>
          </div>
        </div>
      )

    case "frontend":
      return (
        <div className="space-y-4 text-white/90">
          <h3 className="text-lg font-bold text-[#61DAFB] font-mono uppercase">
            3. Frontend Craftsmanship
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-white/60">
            Crafting pixel-perfect, highly responsive interfaces, structuring fluid motion animations, and tuning bundle delivery times.
          </p>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider block">
              UI Ecosystem
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                "React / Next.js",
                "TypeScript",
                "Framer Motion",
                "Tailwind CSS",
                "HTML5 Canvas",
                "Zustand State",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[9px] text-slate-700 dark:text-white/80 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-3 text-[8px] text-slate-400 dark:text-white/30 font-mono flex justify-between">
            <span>FOCUS: INTERACTIVE UX</span>
            <span>ROLE: FRONTEND DEVELOPER</span>
          </div>
        </div>
      )

    case "devops":
      return (
        <div className="space-y-4 text-white/90">
          <h3 className="text-lg font-bold text-[#2496ED] font-mono uppercase">
            4. DevOps & Cloud
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-white/60">
            Virtualizing application environments in containers, orchestrating release triggers, and administering AWS hosting servers.
          </p>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider block">
              Ops Ecosystem
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                "Docker Compose",
                "GitHub Actions",
                "AWS ECS / S3",
                "Nginx Reverse Proxy",
                "Bash Scripts",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[9px] text-slate-700 dark:text-white/80 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-3 text-[8px] text-slate-400 dark:text-white/30 font-mono flex justify-between">
            <span>FOCUS: ENVIRONMENT PARITY</span>
            <span>ROLE: DEVOPS SPECIALIST</span>
          </div>
        </div>
      )

    case "ux":
      return (
        <div className="space-y-4 text-white/90">
          <h3 className="text-lg font-bold text-[#F24E1E] font-mono uppercase">
            5. Design & UX Strategy
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-white/60">
            Mapping wireframe layouts, conducting layout specification iterations, structuring design tokens, and validating interface prototypes.
          </p>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider block">
              Design Assets
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                "Figma Wireframes",
                "Interactive Prototypes",
                "Design Systems",
                "Typography Specs",
                "SVG Icon Assets",
              ].map((item) => (
                <span
                  key={item}
                  className="text-[9px] text-slate-700 dark:text-white/80 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 px-2 py-0.5 rounded font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-3 text-[8px] text-slate-400 dark:text-white/30 font-mono flex justify-between">
            <span>FOCUS: ACCESSIBILITY & FLOW</span>
            <span>ROLE: UX DESIGNER</span>
          </div>
        </div>
      )

    default:
      return null
  }
}
export default ActiveAppPanel
