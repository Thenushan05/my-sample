import React, { useLayoutEffect, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LaptopFrame } from "./LaptopFrame"
import { LaptopScreen } from "./LaptopScreen"
import { AppGrid } from "./AppGrid"
import { FloatingAppCard } from "./FloatingAppCard"
import { ActiveAppPanel } from "./ActiveAppPanel"
import { PORTFOLIO_APPS } from "../../data/apps"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { useReducedMotion } from "../../hooks/useUtils"
import { motion, AnimatePresence } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

// --- Typewriter Helper for Terminal ---
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 5); // Fast 5ms typing speed for terminal vibe
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export const LaptopStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const laptopWrapperRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [screenGlow, setScreenGlow] = useState(0)

  // Dual mode state
  const [isInteractive, setIsInteractive] = useState(true)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const isMobile = useMediaQuery("(max-width: 767px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)")
  const prefersReduced = useReducedMotion()

  useLayoutEffect(() => {
    if (prefersReduced || !isInteractive) return

    const ctx = gsap.context(() => {
      // Laptop zoom and app emergence timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Calculate which app card is active based on scroll progress
            const progress = self.progress

            if (progress < 0.3) {
              setActiveAppId(null)
              setScreenGlow(progress * 2)
            } else if (progress >= 0.3 && progress < 0.9) {
              const innerProg = (progress - 0.3) / 0.6 // 0.0 to 1.0
              const activeIndex = Math.min(
                Math.floor(innerProg * PORTFOLIO_APPS.length),
                PORTFOLIO_APPS.length - 1
              )
              setActiveAppId(PORTFOLIO_APPS[activeIndex].id)
              setScreenGlow(0.6 + (1 - progress) * 0.4)
            } else {
              setActiveAppId(null)
            }
          },
        },
      })

      // 1. Zoom into the laptop screen
      tl.to(laptopWrapperRef.current, {
        scale: isMobile ? 2.5 : isTablet ? 3.5 : 4.5,
        y: isMobile ? "5%" : "8%",
        duration: 2,
        ease: "power1.inOut",
      })

      // Fade out bezel/body and dim surrounds
      tl.to(
        laptopWrapperRef.current,
        {
          filter: "brightness(0.2)",
          opacity: 0.15,
          duration: 1,
        },
        "-=0.5"
      )

      // Helper to generate spacious, symmetrical tech card layout coordinates
      const getCoordinates = (index: number) => {
        if (isMobile) {
          return { x: 0, y: (index - 2) * 110 }
        }
        switch (index) {
          case 0:
            return { x: -280, y: -90 } // AI/ML
          case 1:
            return { x: 280, y: -90 } // Backend
          case 2:
            return { x: -300, y: 90 } // Frontend
          case 3:
            return { x: 300, y: 90 } // DevOps
          case 4:
            return { x: 0, y: -190 } // UX
          default:
            return { x: 0, y: 0 }
        }
      }

      // 2. Animate the cards emerging from screen space
      const cards = gsap.utils.toArray(".floating-card-wrapper")

      cards.forEach((card: any, i) => {
        const coords = getCoordinates(i)
        tl.fromTo(
          card,
          {
            scale: 0.1,
            z: -1000,
            opacity: 0,
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
          },
          {
            scale: 1,
            z: 0,
            opacity: 1,
            x: coords.x,
            y: coords.y,
            rotationY: isMobile ? 0 : i % 2 === 0 ? 15 : -15,
            duration: 1.5,
            ease: "power2.out",
          },
          `-=${i === 0 ? 0.5 : 1.2}`
        )
      })

      // 3. Highlight and rotate each card when active
      PORTFOLIO_APPS.forEach((app, i) => {
        const card = cards[i] as any
        const coords = getCoordinates(i)

        // Active rotation, scaling and tilt
        tl.to(
          card,
          {
            scale: 1.25,
            x: isMobile ? 0 : -140, // Move left to leave space for contents panel
            y: isMobile ? -50 : 0,
            z: 150,
            rotationY: 360, // Spin smoothly
            rotationX: 10,
            duration: 1.5,
            ease: "power3.inOut",
          },
          `+=0.2`
        )

        // Return card to original spread/depth
        tl.to(
          card,
          {
            scale: 1,
            x: coords.x,
            y: coords.y,
            z: 0,
            rotationY: isMobile ? 0 : i % 2 === 0 ? 15 : -15,
            rotationX: 0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          `+=0.5`
        )
      })

      // Exit / Zoom back out
      tl.to(overlayRef.current, {
        opacity: 0,
        y: -100,
        duration: 1.5,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isMobile, isTablet, prefersReduced, isInteractive])

  const getCodeRepresentation = (appId: string) => {
    switch (appId) {
      case "aiml":
        return `=========================================
 PERSONA: AI & ML SPECIALIST
=========================================

>> CORE FOCUS:
   Computer Vision, Predictive Modeling, Neural Networks

>> PRIMARY TECHNOLOGIES:
   • TensorFlow & Keras
   • OpenCV & Scikit-Learn
   • Python Data Science Stack

>> KEY RESPONSIBILITIES:
   - Training deep learning classifiers on custom datasets.
   - Deploying lightweight inference APIs for production.
   - Optimizing model weights for edge performance.`
      case "backend":
        return `=========================================
 PERSONA: BACKEND ARCHITECT
=========================================

>> CORE FOCUS:
   Scalable APIs, Database Modeling, Caching

>> PRIMARY TECHNOLOGIES:
   • Node.js & Express / FastAPI
   • PostgreSQL & MongoDB
   • Redis Caching & Prisma ORM

>> KEY RESPONSIBILITIES:
   - Designing secure, event-driven REST and GraphQL APIs.
   - Structuring relational data models and query indexes.
   - Implementing OAuth auth layers and transaction locks.`
      case "frontend":
        return `=========================================
 PERSONA: FRONTEND CRAFTSMAN
=========================================

>> CORE FOCUS:
   Interactive UX, State Management, Rendering Performance

>> PRIMARY TECHNOLOGIES:
   • React.js & Next.js Ecosystem
   • TypeScript & Zustand
   • Tailwind CSS & Framer Motion

>> KEY RESPONSIBILITIES:
   - Crafting pixel-perfect, highly responsive interfaces.
   - Orchestrating complex spring-physics micro-animations.
   - Tuning bundle delivery times and Lighthouse scores.`
      case "devops":
        return `=========================================
 PERSONA: DEVOPS SPECIALIST
=========================================

>> CORE FOCUS:
   Infrastructure, CI/CD Pipelines, Cloud Hosting

>> PRIMARY TECHNOLOGIES:
   • Docker & Containerization
   • GitHub Actions CI/CD
   • AWS ECS, S3 & Vercel

>> KEY RESPONSIBILITIES:
   - Virtualizing dev environments to ensure system parity.
   - Orchestrating automated testing and release triggers.
   - Managing cloud hosting architectures and proxy servers.`
      case "ux":
        return `=========================================
 PERSONA: UX STRATEGIST
=========================================

>> CORE FOCUS:
   User Journeys, Wireframing, Layout Specifications

>> PRIMARY TECHNOLOGIES:
   • Figma Design Systems
   • Interactive Prototyping Tools
   • SVG & Vector Asset Management

>> KEY RESPONSIBILITIES:
   - Translating product logic into high-fidelity mockups.
   - Mapping intuitive user click patterns and flows.
   - Conducting layout tests for WCAG accessibility.`
      default:
        return ""
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      {/* ── Mode Toggle Button ──────────────────────── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
        <button
          onClick={() => {
            setIsInteractive(true)
            setSelectedAppId(null)
          }}
          className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono transition-all ${
            isInteractive
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md"
              : "text-white/40 hover:text-white"
          }`}
        >
          🎬 3D Story
        </button>
        <button
          onClick={() => {
            setIsInteractive(false)
            setActiveAppId(null)
          }}
          className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono transition-all ${
            !isInteractive
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md"
              : "text-white/40 hover:text-white"
          }`}
        >
          💻 Code Console
        </button>
      </div>

      {isInteractive ? (
        /* Immersive Interactive 3D Storyteller mode */
        <div
          ref={containerRef}
          className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20"
          style={{ perspective: "1400px" }}
        >
          {/* 2.5D Layer: Pinned Laptop */}
          <div
            ref={laptopWrapperRef}
            className="w-full max-w-[750px] px-6 transition-all duration-300 relative z-0"
          >
            <LaptopFrame screenGlow={screenGlow}>
              <LaptopScreen>
                <AppGrid activeAppId={activeAppId} />
              </LaptopScreen>
            </LaptopFrame>
          </div>

          {/* 3D Perspective Layer: Emerging & Active Cards */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {PORTFOLIO_APPS.map((app, i) => {
              const isActive = activeAppId === app.id
              return (
                <div
                  key={app.id}
                  className="absolute floating-card-wrapper pointer-events-auto"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <FloatingAppCard app={app} isActive={isActive} />

                  {/* Side Content Panel (Only reveals when card is active) */}
                  {isActive && !isMobile && (
                    <div
                      className="absolute left-[210px] top-1/2 -translate-y-1/2 w-[280px] bg-black/60 border border-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl animate-fadeIn z-20"
                      style={{ transform: "translateZ(50px)" }}
                    >
                      <ActiveAppPanel appId={app.id} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Active Panel Overlay */}
          {activeAppId && isMobile && (
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-black/85 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl pointer-events-auto animate-fadeIn">
              <ActiveAppPanel appId={activeAppId} />
            </div>
          )}
        </div>
      ) : (
        /* Alternative Style: Interactive CLI / Code Console Editor */
        <div className="max-w-4xl mx-auto px-6 w-full py-32 relative z-10">
          <div className="text-center mb-12 mt-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 block mb-2">
              Capabilities Console
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-mono">
              developer_profile.sh
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/40 max-w-md mx-auto leading-relaxed font-mono">
              Select files from the workspace tree to query my core technology stacks and experience metrics.
            </p>
          </div>

          {/* Premium IDE Terminal */}
          <div className="w-full rounded-2xl overflow-hidden bg-[#1e1e1e] border border-white/10 shadow-2xl flex flex-col h-[480px] font-mono text-sm">
            {/* Window Top Bar */}
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center border-b border-white/[0.04] justify-between">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[11px] text-white/50 select-none">
                antigravity@thenushan: ~/skills
              </div>
              <div className="w-12" />
            </div>

            {/* Editor Workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: File Explorer */}
              <div className="w-48 sm:w-56 bg-[#252526] border-r border-white/[0.04] p-4 flex flex-col gap-2 select-none overflow-y-auto">
                <div className="text-white/30 text-[9px] uppercase font-bold tracking-wider mb-2">
                  Workspace Files
                </div>
                {PORTFOLIO_APPS.map((app) => {
                  const isSelected = selectedAppId === app.id
                  const extension =
                    app.id === "ux"
                      ? ".fig"
                      : app.id === "frontend"
                        ? ".tsx"
                        : app.id === "aiml"
                          ? ".py"
                          : app.id === "backend"
                            ? ".go"
                            : ".yml"
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                        isSelected
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                          : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-sm">
                        {app.id === "ux"
                          ? "🎨"
                          : app.id === "frontend"
                            ? "💻"
                            : app.id === "aiml"
                              ? "🧠"
                              : app.id === "backend"
                                ? "🗄️"
                                : "🐋"}
                      </span>
                      <span className="truncate">
                        {app.id}
                        {extension}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Right Side: Code View / Terminal Output */}
              <div className="flex-1 bg-[#1e1e1e] p-6 overflow-y-auto relative flex flex-col justify-between">
                <div>
                  {selectedAppId ? (
                    <div className="space-y-4">
                      {/* File path heading */}
                      <div className="text-xs text-white/30 border-b border-white/[0.04] pb-2 mb-4">
                        // Viewing: ~/skills/{selectedAppId}
                        {selectedAppId === "ux"
                          ? ".fig"
                          : selectedAppId === "frontend"
                            ? ".tsx"
                            : selectedAppId === "aiml"
                              ? ".py"
                              : selectedAppId === "backend"
                                ? ".go"
                                : ".yml"}
                      </div>

                      {/* JSON / Code representation */}
                      <pre className="text-xs text-green-400 leading-relaxed font-mono whitespace-pre-wrap">
                        <TypewriterText key={selectedAppId} text={getCodeRepresentation(selectedAppId)} />
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/30 py-20 gap-3">
                      <span className="text-4xl animate-pulse">💻</span>
                      <p className="text-xs">
                        Select a capability file from the left sidebar to cat
                        and inspect its metadata code configuration.
                      </p>
                    </div>
                  )}
                </div>

                {/* Terminal prompt at bottom */}
                <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-xs text-white/50 select-none">
                  <span className="text-blue-400">thenushan@portfolio:~$</span>
                  <span className="text-white animate-pulse">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default LaptopStory
