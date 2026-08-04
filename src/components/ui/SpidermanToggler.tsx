"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "../../lib/utils"
import spideyLogo from "../../assets/il_570xN.3228576578_i800.avif"
import arcReactorLogo from "../../assets/arc-reactor-logo.png"

/** Dual Hero Theme Switcher (Spidey Mode 🕷️ & Iron Man Mode 🦾). */
export const SpidermanToggler: React.FC<{ className?: string }> = ({ className }) => {
    const [isSpidey, setIsSpidey] = useState(false)
    const [isIronman, setIsIronman] = useState(false)

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

        return () => observer.disconnect()
    }, [])

    const toggleSpidey = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
    }, [])

    const toggleIronman = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
    }, [])

    return (
        <div className={cn("flex items-center gap-2", className)}>
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
                            "w-7 h-7 object-contain transition-all duration-300 pointer-events-none mix-blend-screen",
                            "[filter:invert(20%)_sepia(90%)_saturate(5000%)_hue-rotate(350deg)_brightness(100%)_contrast(110%)]",
                            isSpidey
                                ? "scale-115 drop-shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"
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
        </div>
    )
}

export default SpidermanToggler
