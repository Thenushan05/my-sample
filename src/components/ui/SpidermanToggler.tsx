"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "../../lib/utils"
import spideyLogo from "../../assets/spidey-logo.png"

/** Toggles the `spiderman` accent theme (independent of light/dark mode). */
export const SpidermanToggler: React.FC<React.ComponentPropsWithoutRef<"button">> = ({
    className,
    ...props
}) => {
    const [isActive, setIsActive] = useState(() => {
        if (typeof document !== "undefined") {
            return document.documentElement.classList.contains("spiderman")
        }
        return false
    })

    const [showGuide, setShowGuide] = useState(false)

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsActive(document.documentElement.classList.contains("spiderman"))
        })
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        // Show guide after 2.5 seconds if they haven't activated it yet
        const timer = setTimeout(() => {
            if (!document.documentElement.classList.contains("spiderman") && localStorage.getItem("spidey_guide_dismissed") !== "true") {
                setShowGuide(true)
            }
        }, 2500)

        return () => {
            observer.disconnect()
            clearTimeout(timer)
        }
    }, [])

    const toggle = useCallback(() => {
        const next = !document.documentElement.classList.contains("spiderman")
        document.documentElement.classList.toggle("spiderman", next)
        
        if (next) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
            window.dispatchEvent(new Event("themeChange"))
        }

        localStorage.setItem("spidey_mode", next ? "true" : "false")
        setIsActive(next)
        if (showGuide) {
            setShowGuide(false)
            localStorage.setItem("spidey_guide_dismissed", "true")
        }
    }, [showGuide])

    return (
        <div className={cn("relative inline-flex group", className)}>
            <button
                type="button"
                onClick={toggle}
                aria-pressed={isActive}
                title={isActive ? "Disable Spidey Mode" : "Enable Spidey Mode"}
                className={cn(
                    "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border overflow-hidden",
                    isActive
                        ? "bg-black/90 border-red-500/80 shadow-[0_0_18px_rgba(239,68,68,0.8)] ring-2 ring-red-500/50"
                        : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/30 text-white/70 hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                )}
                {...props}
            >
                <img
                    src={spideyLogo}
                    alt="Spidey Mode"
                    className={cn(
                        "w-5 h-5 object-contain transition-all duration-300 pointer-events-none",
                        isActive
                            ? "scale-110 filter drop-shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"
                            : "opacity-85 hover:opacity-100 group-hover:scale-105"
                    )}
                />
                <span className="sr-only">Toggle Spidey Mode</span>
            </button>

            {/* Quick Guide Tooltip */}
            {showGuide && (
                <div className="absolute right-0 top-full mt-4 w-max animate-bounce pointer-events-none z-50">
                    <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-2 rounded-lg shadow-xl border border-red-400 relative flex items-center gap-2">
                        {/* Upward pointing triangle */}
                        <div className="absolute -top-1.5 right-3 w-3 h-3 bg-red-600 border-t border-l border-red-400 rotate-45" />
                        <img src={spideyLogo} alt="" className="w-3.5 h-3.5 object-contain filter brightness-200 invert" />
                        <span className="relative z-10 uppercase tracking-wider">
                            Try Spidey Mode!
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpidermanToggler
