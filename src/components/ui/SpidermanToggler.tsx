"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { getLenis } from "../../hooks/useLenis"
import spideyLogo from "../../assets/spidey-logo-white.png"
import arcReactorLogo from "../../assets/arc-reactor-logo.png"
import { DeadpoolMaskIcon } from "./DeadpoolMaskIcon"

type HeroMode = "spiderman" | "ironman" | "deadpool"
const HERO_MODES: HeroMode[] = ["spiderman", "ironman", "deadpool"]

/** Hero Theme Switcher (Spidey Mode 🕷️, Iron Man Mode 🦾 & Deadpool Mode 🩸). */
export const SpidermanToggler: React.FC<{ className?: string }> = ({ className }) => {
    const [isSpidey, setIsSpidey] = useState(false)
    const [isIronman, setIsIronman] = useState(false)
    const [isDeadpool, setIsDeadpool] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(false)
    /** Guards against re-toggling while the page is still travelling home. */
    const switching = useRef(false)

    useEffect(() => {
        const updateThemeStates = () => {
            if (typeof document !== "undefined") {
                setIsSpidey(document.documentElement.classList.contains("spiderman"))
                setIsIronman(document.documentElement.classList.contains("ironman"))
                setIsDeadpool(document.documentElement.classList.contains("deadpool"))
            }
        }

        updateThemeStates()
        const observer = new MutationObserver(updateThemeStates)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        // Check if user has seen the guide. If not, show onboarding after a delay.
        let timer: ReturnType<typeof setTimeout> | undefined
        const hasSeenGuide = localStorage.getItem("has_seen_hero_guide")
        if (!hasSeenGuide) {
            timer = setTimeout(() => {
                setShowOnboarding(true)
            }, 2500)
        }

        return () => {
            if (timer) clearTimeout(timer)
            observer.disconnect()
        }
    }, [])

    const handleDismissGuide = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setShowOnboarding(false);
        localStorage.setItem("has_seen_hero_guide", "true");
    };

    /**
     * Ride the page back to the hero, then run `done`.
     *
     * The whole payoff of a hero mode — the suit-up, the portrait reveal, the
     * loader — lives at the top of the page. Firing it while the reader is
     * halfway down means the animation plays off-screen and is over before
     * the scroll lands, so the transformation waits until we're home.
     */
    const scrollHomeThen = (done: () => void) => {
        if (window.scrollY < 4) {
            done();
            return;
        }

        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            // Let the scroll settle for a beat so the reveal isn't clipped
            window.setTimeout(done, 120);
        };

        const lenis = getLenis();
        if (lenis) {
            lenis.scrollTo(0, { duration: 0.9, onComplete: finish });
        } else {
            // No Lenis (still loading, or reduced-motion): poll the native scroll
            window.scrollTo({ top: 0, behavior: "smooth" });
            const start = performance.now();
            const check = () => {
                if (window.scrollY < 4) return finish();
                if (performance.now() - start > 1400) return finish();
                requestAnimationFrame(check);
            };
            requestAnimationFrame(check);
        }

        // Safety net: never strand the toggle if the scroll is interrupted
        window.setTimeout(finish, 1600);
    };

    /**
     * Hero modes are mutually exclusive classes on <html>. Toggling one
     * always clears the other two, forces dark mode (every hero palette
     * assumes a near-black base) and persists the choice for the
     * pre-paint boot script in index.html.
     */
    const toggleMode = useCallback((mode: HeroMode, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        handleDismissGuide(); // Hide tooltip on interaction

        // Ignore extra clicks while a switch is already travelling home
        if (switching.current) return;
        switching.current = true;

        scrollHomeThen(() => {
            const root = document.documentElement
            const next = !root.classList.contains(mode)

            HERO_MODES.forEach((m) => root.classList.remove(m))
            root.classList.toggle(mode, next)

            if (next) {
                root.classList.add("dark")
                localStorage.setItem("theme", "dark")
                window.dispatchEvent(new Event("themeChange"))
            }

            localStorage.setItem("hero_mode", next ? mode : "none")
            setIsSpidey(next && mode === "spiderman")
            setIsIronman(next && mode === "ironman")
            setIsDeadpool(next && mode === "deadpool")
            switching.current = false
        });
    }, [])

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            {/* Spidey Mode Button */}
            <div className="relative inline-flex group">
                <button
                    type="button"
                    onClick={(e) => toggleMode("spiderman", e)}
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
                    onClick={(e) => toggleMode("ironman", e)}
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

            {/* Deadpool Mode Button */}
            <div className="relative inline-flex group">
                <button
                    type="button"
                    onClick={(e) => toggleMode("deadpool", e)}
                    aria-pressed={isDeadpool}
                    title={isDeadpool ? "Disable Deadpool Mode" : "Enable Deadpool Mode"}
                    className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border overflow-hidden p-1.5",
                        isDeadpool
                            ? "bg-black/95 border-red-700/90 shadow-[0_0_20px_rgba(220,20,60,0.9)] ring-2 ring-yellow-400/50"
                            : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/30 text-white/70 hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700",
                    )}
                >
                    {/* Blood smear that wipes across the button while active */}
                    {isDeadpool && (
                        <motion.span
                            aria-hidden
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 0.85, 0.45] }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-x-0 bottom-0 h-1/2 origin-left bg-gradient-to-t from-red-800/90 to-transparent pointer-events-none"
                        />
                    )}
                    <DeadpoolMaskIcon
                        muted={!isDeadpool}
                        className={cn(
                            "w-7 h-7 object-contain transition-all duration-300 pointer-events-none relative z-10",
                            isDeadpool
                                ? "scale-115 drop-shadow-[0_0_10px_rgba(220,20,60,1)] animate-pulse"
                                : "opacity-90 hover:opacity-100 group-hover:scale-110 group-hover:rotate-[-6deg]"
                        )}
                    />
                    <span className="sr-only">Toggle Deadpool Mode</span>
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
                                Experience this portfolio as <strong className="text-red-400 font-bold">Spider-Man</strong>, <strong className="text-cyan-400 font-bold">Iron Man</strong> or <strong className="text-rose-500 font-bold">Deadpool</strong>. Click the icons above to activate immersive mode!
                            </p>
                        </div>

                        {/* Glow effect behind tooltip */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-cyan-500/10 to-rose-700/10 rounded-xl blur-md -z-10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SpidermanToggler
