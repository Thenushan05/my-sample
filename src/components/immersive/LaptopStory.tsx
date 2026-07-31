import React, { useLayoutEffect, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LaptopFrame } from "./LaptopFrame"
import { LaptopScreen } from "./LaptopScreen"
import { AppGrid } from "./AppGrid"
import { FloatingAppCard } from "./FloatingAppCard"
import { ActiveAppPanel } from "./ActiveAppPanel"
import { TerminalSnake } from "./TerminalSnake"
import { Lock, Unlock, ArrowRight, Skull, Loader2, LogOut } from "lucide-react"
import { PORTFOLIO_APPS } from "../../data/apps"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { useReducedMotion } from "../../hooks/useUtils"
import { motion, AnimatePresence } from "framer-motion"
import { MobileCyberDeck } from "./MobileCyberDeck"

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

const HackerLoading: React.FC<{ isError: boolean }> = ({ isError }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = isError
      ? [
          "> INITIATING BRUTEFORCE...",
          "> BYPASSING FIREWALL...",
          "> INJECTING PAYLOAD...",
          "> ERROR: CHECKSUM MISMATCH",
          "> CONNECTION TERMINATED",
        ]
      : [
          "> INITIATING BRUTEFORCE...",
          "> BYPASSING FIREWALL...",
          "> DECRYPTING HASH...",
          "> PAYLOAD ACCEPTED",
          "> ACCESS GRANTED",
        ];

    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, sequence[i]]);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [isError]);

  return (
    <div className="w-56 sm:w-72 bg-black/80 border border-white/10 rounded-md p-4 font-mono text-[10px] sm:text-xs text-emerald-400 shadow-inner flex flex-col gap-1.5 text-left mb-4">
      {logs.map((log, idx) => (
        <div key={idx} className={isError && idx >= 3 ? "text-red-500 font-bold" : "text-emerald-400"}>
          {log}
        </div>
      ))}
      {logs.length < 5 && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/50">Processing</span>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 bg-white/50 rounded-full animate-pulse" />
            <span className="w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      )}
      <motion.div 
        className={`h-1.5 w-full mt-3 rounded-full ${isError ? 'bg-red-500/20' : 'bg-emerald-500/20'} overflow-hidden`}
      >
        <motion.div 
          className={`h-full ${isError ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}
          initial={{ width: "0%" }}
          animate={{ width: isError ? "60%" : "100%" }}
          transition={{ duration: 1.5, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export const LaptopStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const laptopWrapperRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [screenGlow, setScreenGlow] = useState(0)

  // Dual mode state
  const [isInteractive, setIsInteractive] = useState(true)
  const [isLaptopUnlocked, setIsLaptopUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [lockError, setLockError] = useState(false)
  const [attemptWasError, setAttemptWasError] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [terminalCmdInput, setTerminalCmdInput] = useState("")
  const [lastSubmittedCmd, setLastSubmittedCmd] = useState<string | undefined>(undefined)
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])

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

  const scrollToSection = () => {
    setTimeout(() => {
      const el = document.getElementById("laptop-story-trigger")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }, 50)
  }

  if (isMobile) {
    return (
      <div className="relative w-full bg-transparent">
        {/* ── Mode Toggle Button (Mobile) ──────────────────────── */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={() => {
              setIsInteractive(true)
              setSelectedAppId(null)
              scrollToSection()
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono transition-all ${
              isInteractive
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md"
                : "text-white/40 hover:text-white"
            }`}
          >
            🗂️ Modules
          </button>
          <button
            onClick={() => {
              setIsInteractive(false)
              setActiveAppId(null)
              if (selectedAppId === "snake_game") setSelectedAppId(null)
              scrollToSection()
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-mono transition-all ${
              !isInteractive
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            💻 Cyber-Deck
          </button>
        </div>
        <MobileCyberDeck 
          isInteractive={isInteractive} 
          selectedAppId={selectedAppId} 
          setSelectedAppId={setSelectedAppId} 
          getCodeRepresentation={getCodeRepresentation} 
        />
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      {/* ── Mode Toggle Button ──────────────────────── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
        <button
          onClick={() => {
            setIsInteractive(true)
            setSelectedAppId(null)
            scrollToSection()
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
            if (selectedAppId === "snake_game") {
              setSelectedAppId(null)
            }
            scrollToSection()
          }}
          className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono transition-all ${
            !isInteractive && selectedAppId !== "snake_game"
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md"
              : "text-white/40 hover:text-white"
          }`}
        >
          💻 Code Console
        </button>
        <button
          onClick={() => {
            setIsInteractive(false)
            setSelectedAppId("snake_game")
            scrollToSection()
          }}
          className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono transition-all ${
            !isInteractive && selectedAppId === "snake_game"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-bold"
              : "text-emerald-400/70 hover:text-emerald-300"
          }`}
        >
          🐍 Terminal Snake
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-16 relative z-10">
          <div className="text-center mb-8 mt-4">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Code Console & Terminals</h2>
            <p className="text-white/40 text-sm">A deep dive into the systems and security modules.</p>
          </div>

          {/* Premium IDE Terminal disguised as a Laptop */}
          <div className="w-full mx-auto max-w-4xl">
            <div className="w-full rounded-t-3xl rounded-b-lg overflow-hidden bg-black border-[12px] sm:border-[16px] border-[#141414] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-[65vh] min-h-[550px] max-h-[800px] relative">
              {/* Laptop Camera Hole */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3 sm:h-4 bg-[#141414] flex items-center justify-center z-[60]">
                <div className="w-1.5 h-1.5 rounded-full bg-black border border-white/10" />
              </div>
              
              {/* Inner Screen Content */}
              <div className="flex-1 w-full bg-[#1e1e1e] flex flex-col relative mt-2 sm:mt-3 rounded-md overflow-hidden font-mono text-sm">
            <AnimatePresence>
              {!isLaptopUnlocked && (
                <motion.div
                  key="terminal-lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50 pointer-events-auto"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] ${lockError ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                    {lockError ? (
                      <Skull className="w-5 h-5 sm:w-7 sm:h-7 text-white animate-bounce" />
                    ) : (
                      <Lock className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    )}
                  </div>
                  <h3 className={`font-bold text-sm sm:text-lg mb-1 tracking-tight ${lockError ? 'text-red-500' : 'text-white'}`}>
                    {lockError ? 'ACCESS DENIED' : 'Terminal Locked'}
                  </h3>
                  <p className="text-emerald-300/70 text-[10px] sm:text-xs mb-6 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Security Question: What is 2^10?
                  </p>
                  {isUnlocking ? (
                    <HackerLoading isError={attemptWasError} />
                  ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (isUnlocking) return
                      const form = e.target as HTMLFormElement
                      const input = form.elements.namedItem('pin') as HTMLInputElement
                      const val = input.value
                      
                      const isWrong = val !== "1024"
                      setAttemptWasError(isWrong)
                      setIsUnlocking(true)
                      setLockError(false)

                      setTimeout(() => {
                        if (!isWrong) {
                          setTimeout(() => {
                            setIsLaptopUnlocked(true)
                            setIsUnlocking(false)
                          }, 500)
                        } else {
                          setLockError(true)
                          setIsUnlocking(false)
                          input.value = ""
                          setTimeout(() => setLockError(false), 2000)
                        }
                      }, 1500)
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <input 
                        name="pin"
                        type="password"
                        disabled={isUnlocking}
                        className={`w-32 sm:w-40 bg-black/50 border rounded-xl px-4 py-2.5 sm:py-3 text-center text-white font-mono tracking-[0.5em] sm:tracking-[0.7em] focus:outline-none transition-colors text-sm sm:text-base placeholder:tracking-normal shadow-inner disabled:opacity-50 ${lockError ? 'border-red-500 text-red-500 placeholder:text-red-500/30' : 'border-white/20 focus:border-emerald-500 placeholder:text-white/20'}`}
                        placeholder="PIN"
                        maxLength={4}
                        autoComplete="off"
                      />
                      <button 
                        type="submit" 
                        disabled={isUnlocking}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 ${lockError ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Terminal Top Bar */}
            <div className="bg-[#1e1e1e] px-4 py-3 flex items-center border-b border-white/[0.04] justify-between">
              <div className="w-4" /> {/* Spacer to balance the right icon */}
              <div className="text-[11px] text-white/50 select-none flex-1 text-center">
                antigravity@thenushan: ~/skills
              </div>
              <button 
                onClick={() => setIsLaptopUnlocked(false)}
                className="text-white/30 hover:text-red-400 transition-colors"
                title="Lock System"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Editor Workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: File Explorer */}
              <div className="w-48 sm:w-56 bg-[#252526] border-r border-white/[0.04] p-4 flex flex-col gap-2 select-none overflow-y-auto">
                <div className="text-white/30 text-[9px] uppercase font-bold tracking-wider mb-2">
                  Workspace Files
                </div>
                <button
                  onClick={() => setSelectedAppId("snake_game")}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs transition-all text-left border ${
                    selectedAppId === "snake_game"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold"
                      : "text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">🐍</span>
                    <span className="truncate">snake_game.py</span>
                  </div>
                  <span className="shrink-0 px-1.5 py-0.5 text-[8px] rounded bg-emerald-500/20 text-emerald-300 font-extrabold uppercase animate-pulse">
                    GAME
                  </span>
                </button>
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
              <div className="flex-1 bg-[#1e1e1e] p-4 sm:p-6 overflow-hidden relative flex flex-col justify-between min-w-0">
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  {selectedAppId === "snake_game" ? (
                    <TerminalSnake
                      onCommandInput={lastSubmittedCmd}
                      onNavigateFile={(fileId) => setSelectedAppId(fileId)}
                    />
                  ) : selectedAppId ? (
                    <div className="space-y-4">
                      {/* File path heading */}
                      <div className="text-xs text-white/30 border-b border-white/[0.04] pb-2 mb-4 flex items-center justify-between">
                        <span>
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
                        </span>
                        <button
                          onClick={() => setSelectedAppId("snake_game")}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                        >
                          <span>🐍 Open Snake Game</span>
                        </button>
                      </div>

                      {/* JSON / Code representation */}
                      <pre className="text-xs text-green-400 leading-relaxed font-mono whitespace-pre-wrap">
                        <TypewriterText key={selectedAppId} text={getCodeRepresentation(selectedAppId)} />
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/40 py-16 gap-4">
                      <span className="text-5xl animate-bounce">🎮</span>
                      <div className="max-w-xs space-y-1">
                        <h4 className="text-sm font-bold text-white">Select a Capability or Game</h4>
                        <p className="text-xs text-white/50 leading-relaxed">
                          Click <span className="text-emerald-400 font-semibold">snake_game.py</span> from the left sidebar to play a quick terminal game, or cat any capability file below.
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedAppId("snake_game")}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg flex items-center gap-2"
                      >
                        <span>🚀 Launch Terminal Snake</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Terminal history logs if any */}
                {terminalHistory.length > 0 && selectedAppId !== "snake_game" && (
                  <div className="mt-4 p-3 bg-black/60 rounded-lg border border-white/5 font-mono text-xs space-y-1 text-white/80 max-h-24 overflow-y-auto">
                    {terminalHistory.map((line, idx) => (
                      <div key={idx} className={line.startsWith(">[!]") ? "text-amber-400" : line.startsWith(">[+]") ? "text-emerald-400" : "text-white/70"}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* Terminal prompt at bottom */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const cmd = terminalCmdInput.trim()
                    if (!cmd) return

                    const lower = cmd.toLowerCase()
                    if (lower === "help") {
                      setTerminalHistory((prev) => [
                        ...prev,
                        `> ${cmd}`,
                        `>[+] Available commands: snake (or ./snake_game.py), ls, cat <file>, clear`,
                      ])
                    } else if (lower === "clear") {
                      setTerminalHistory([])
                    } else if (lower === "ls" || lower === "dir") {
                      setTerminalHistory((prev) => [
                        ...prev,
                        `> ${cmd}`,
                        `>[+] Workspace files: snake_game.py [ACTIVE], aiml.py, backend.go, frontend.tsx, devops.yml, ux.fig`,
                      ])
                    } else if (lower === "snake" || lower === "./snake_game.py" || lower === "cat snake_game.py" || lower === "start" || lower === "play") {
                      setSelectedAppId("snake_game")
                      setTerminalHistory((prev) => [
                        ...prev,
                        `> ${cmd}`,
                        `>[+] Launching snake_game.py terminal node...`,
                      ])
                    } else if (lower.startsWith("cat ")) {
                      const file = lower.replace("cat ", "").trim().replace(".py", "").replace(".go", "").replace(".tsx", "").replace(".yml", "").replace(".fig", "")
                      if (PORTFOLIO_APPS.some((a) => a.id === file)) {
                        setSelectedAppId(file)
                        setTerminalHistory((prev) => [...prev, `> ${cmd}`, `>[+] Viewing ${file}...`])
                      } else {
                        setTerminalHistory((prev) => [...prev, `> ${cmd}`, `>[!] File not found: ${cmd}`])
                      }
                    } else if (lower === "reset" || lower === "restart") {
                      if (selectedAppId !== "snake_game") {
                        setSelectedAppId("snake_game")
                      }
                      setLastSubmittedCmd(cmd)
                      setTerminalHistory((prev) => [...prev, `> ${cmd}`, `>[+] Sent restart command to snake_game.py`])
                    } else {
                      setTerminalHistory((prev) => [
                        ...prev,
                        `> ${cmd}`,
                        `>[!] Command '${cmd}' not recognized. Type 'help' or 'snake' to start playing.`,
                      ])
                    }
                    setTerminalCmdInput("")
                  }}
                  className="mt-6 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-xs text-white/80 shrink-0"
                >
                  <span className="text-blue-400 select-none font-mono font-bold">thenushan@portfolio:~$</span>
                  <input
                    type="text"
                    value={terminalCmdInput}
                    onChange={(e) => setTerminalCmdInput(e.target.value)}
                    placeholder="Type 'snake' to play, 'help', 'ls', or 'clear'..."
                    className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder:text-white/20 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-mono transition-colors"
                  >
                    Enter ↵
                  </button>
                </form>
              </div>
            </div>
            </div>
            </div>

            {/* Laptop Base (Keyboard area hint) */}
            <div className="h-6 sm:h-8 w-[105%] -ml-[2.5%] bg-gradient-to-b from-[#2a2a2a] to-[#141414] rounded-t-sm rounded-b-3xl shadow-2xl border-t border-white/5 relative z-20">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 sm:h-1.5 bg-[#1a1a1a] rounded-b-md" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default LaptopStory
