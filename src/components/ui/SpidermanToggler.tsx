"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import spideyLogo from "../../assets/spidey-logo-white.png"
import arcReactorLogo from "../../assets/arc-reactor-logo.png"

/** Dual Hero Theme Switcher (Spidey Mode 🕷️ & Iron Man Mode 🦾). */
export const SpidermanToggler: React.FC<{ className?: string }> = ({ className }) => {
    const [isSpidey, setIsSpidey] = useState(false)
    const [isIronman, setIsIronman] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(false)

    useEffect(() => {
        const updateThemeStates = () => {
            if (typeof document !== "undefined") {
                setIsSpidey(document.documentElement.classList.contains("spiderman"))
                setIsIronman(document.documentElement.classList.contains("ironman"))
            }
        }

        updateThemeStates()
        const observer = new MutationObserver(updateThemeStates)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        // Check if user has seen the guide. If not, show onboarding after a delay.
        const hasSeenGuide = localStorage.getItem("has_seen_hero_guide")
        if (!hasSeenGuide) {
            const timer = setTimeout(() => {
                setShowOnboarding(true)
            }, 2500)
            return () => clearTimeout(timer)
        }

        return () => observer.disconnect()
    }, [])

    const handleDismissGuide = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setShowOnboarding(false);
        localStorage.setItem("has_seen_hero_guide", "true");
    };

    const maintainScrollPosition = (action: () => void) => {
        action();
        
        // Scroll to the home page (hero section) when changing modes
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const toggleSpidey = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        handleDismissGuide(); // Hide tooltip on interaction

        maintainScrollPosition(() => {
            const next = !document.documentElement.classList.contains("spiderman")
            document.documentElement.classList.remove("ironman")
            document.documentElement.classList.toggle("spiderman", next)
            
            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
                window.dispatchEvent(new Event("themeChange"))
            }

            localStorage.setItem("hero_mode", next ? "spiderman" : "none")
            setIsSpidey(next)
            setIsIronman(false)
        });
    }, [])

    const toggleIronman = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        handleDismissGuide(); // Hide tooltip on interaction

        maintainScrollPosition(() => {
            const next = !document.documentElement.classList.contains("ironman")
            document.documentElement.classList.remove("spiderman")
            document.documentElement.classList.toggle("ironman", next)

            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
                window.dispatchEvent(new Event("themeChange"))
            }

            localStorage.setItem("hero_mode", next ? "ironman" : "none")
            setIsIronman(next)
            setIsSpidey(false)
        });
    }, [])

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            {/* Spidey Mode Button */}
            <div className="relative inline-flex group">
                <button
                    type="button"
                    onClick={toggleSpidey}
                    aria-pressed={isSpidey}
                    title={isSpidey ? "Disable Spidey Mode" : "Enable Spidey Mode"}
                    className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border overflow-hidden p-1.5",
                        isSpidey
                            ? "bg-black/95 border-red-500/90 shadow-[0_0_20px_rgba(239,68,68,0.85)] ring-2 ring-red-500/60"
                            : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/30 text-white/70 hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                    )}
                >
                    <img
                        src={spideyLogo}
                        alt="Spidey Mode"
                        className={cn(
                            "w-7 h-7 object-contain transition-all duration-300 pointer-events-none",
                            isSpidey
                                ? "scale-115 drop-shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse text-red-500"
                                : "opacity-90 hover:opacity-100 group-hover:scale-110"
                        )}
                    />
                    <span className="sr-only">Toggle Spidey Mode</span>
                </button>
            </div>

            {/* Iron Man Mode Button */}
            <div className="relative inline-flex group">
                <button
                    type="button"
                    onClick={toggleIronman}
                    aria-pressed={isIronman}
                    title={isIronman ? "Disable Iron Man Mode" : "Enable Iron Man Mode"}
                    className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border overflow-hidden p-1.5",
                        isIronman
                            ? "bg-black/95 border-cyan-400/90 shadow-[0_0_20px_rgba(6,182,212,0.85)] ring-2 ring-amber-400/60"
                            : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/30 text-white/70 hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                    )}
                >
                    <img
                        src={arcReactorLogo}
                        alt="Iron Man Mode"
                        className={cn(
                            "w-7 h-7 object-contain transition-all duration-300 pointer-events-none",
                            isIronman
                                ? "scale-115 filter drop-shadow-[0_0_10px_rgba(6,182,212,1)] animate-pulse"
                                : "opacity-90 hover:opacity-100 group-hover:scale-110"
                        )}
                    />
                    <span className="sr-only">Toggle Iron Man Mode</span>
                </button>
            </div>

            {/* Onboarding Tooltip */}
            <AnimatePresence>
                {showOnboarding && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="absolute top-[120%] right-0 w-64 md:w-72 bg-slate-900/95 dark:bg-black/95 border border-slate-700/50 dark:border-white/10 rounded-xl p-4 shadow-2xl z-[100] backdrop-blur-md"
                    >
                        {/* Triangle pointer */}
                        <div className="absolute -top-2 right-12 w-4 h-4 bg-slate-900/95 dark:bg-black/95 border-t border-l border-slate-700/50 dark:border-white/10 rotate-45" />
                        
                        <div className="relative z-10 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-bold text-sm uppercase tracking-wide">Choose Your Hero</h3>
                                <button 
                                    onClick={handleDismissGuide}
                                    className="text-slate-400 hover:text-white transition-colors"
                                    aria-label="Dismiss onboarding"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                Experience this portfolio as <strong className="text-red-400 font-bold">Spider-Man</strong> or <strong className="text-cyan-400 font-bold">Iron Man</strong>. Click the icons above to activate immersive mode!
                            </p>
                        </div>
                        
                        {/* Glow effect behind tooltip */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-cyan-500/10 rounded-xl blur-md -z-10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SpidermanToggler
