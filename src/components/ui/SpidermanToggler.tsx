"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { getLenis } from "../../hooks/useLenis"
const spideyLogo = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077342/portfolio/spidey-logo-white.png";
const arcReactorLogo = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077325/portfolio/arc-reactor-logo.png";
import { DeadpoolMaskIcon } from "./DeadpoolMaskIcon"
import { MjolnirIcon } from "./MjolnirIcon"
import { VenomSpiderIcon } from "./VenomSpiderIcon"
import { CrescentIcon } from "./CrescentIcon"
import { StrawHatIcon } from "./StrawHatIcon"
import { KatanaIcon } from "./KatanaIcon"

type HeroMode = "spiderman" | "ironman" | "deadpool" | "thor" | "venom" | "moonknight" | "luffy" | "zoro"
const HERO_MODES: HeroMode[] = ["spiderman", "ironman", "deadpool", "thor", "venom", "moonknight", "luffy", "zoro"]

/** Hero Theme Switcher (Spidey Mode 🕷️, Iron Man Mode 🦾 & Deadpool Mode 🩸). */
export const SpidermanToggler: React.FC<{ className?: string }> = ({ className }) => {
    const [isSpidey, setIsSpidey] = useState(false)
    const [isIronman, setIsIronman] = useState(false)
    const [isDeadpool, setIsDeadpool] = useState(false)
    const [isThor, setIsThor] = useState(false)
    const [isVenom, setIsVenom] = useState(false)
    const [isMoonKnight, setIsMoonKnight] = useState(false)
    const [isLuffy, setIsLuffy] = useState(false)
    const [isZoro, setIsZoro] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(false)
    /** Guards against re-toggling while the page is still travelling home. */
    const switching = useRef(false)

    useEffect(() => {
        const updateThemeStates = () => {
            if (typeof document !== "undefined") {
                setIsSpidey(document.documentElement.classList.contains("spiderman"))
                setIsIronman(document.documentElement.classList.contains("ironman"))
                setIsDeadpool(document.documentElement.classList.contains("deadpool"))
                setIsThor(document.documentElement.classList.contains("thor"))
                setIsVenom(document.documentElement.classList.contains("venom"))
                setIsMoonKnight(document.documentElement.classList.contains("moonknight"))
                setIsLuffy(document.documentElement.classList.contains("luffy"))
                setIsZoro(document.documentElement.classList.contains("zoro"))
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
     * always clears the others and persists the choice for the pre-paint
     * boot script in index.html.
     *
     * Every hero palette except Luffy assumes a near-black base, so
     * activating them forces `dark`. Luffy is a DAYLIGHT theme — a bounty
     * poster on sun-bleached paper — and its stylesheet is written on the
     * assumption `dark` is absent (see the theme block in index.css). Forcing
     * dark on for it would mean fighting hundreds of live `dark:` utilities
     * instead of just not turning the light switch off.
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

            if (next && mode === "luffy") {
                // Daylight theme: strip dark rather than force it.
                root.classList.remove("dark")
                localStorage.setItem("theme", "light")
                window.dispatchEvent(new Event("themeChange"))
            } else if (next) {
                root.classList.add("dark")
                localStorage.setItem("theme", "dark")
                window.dispatchEvent(new Event("themeChange"))
            } else if (mode === "luffy") {
                // Turned Luffy back off directly: restore the app's dark base.
                root.classList.add("dark")
                localStorage.setItem("theme", "dark")
                window.dispatchEvent(new Event("themeChange"))
            }

            localStorage.setItem("hero_mode", next ? mode : "none")
            setIsSpidey(next && mode === "spiderman")
            setIsIronman(next && mode === "ironman")
            setIsDeadpool(next && mode === "deadpool")
            setIsThor(next && mode === "thor")
            setIsVenom(next && mode === "venom")
            setIsMoonKnight(next && mode === "moonknight")
            setIsLuffy(next && mode === "luffy")
            setIsZoro(next && mode === "zoro")
            switching.current = false
        });
    }, [])

    const [isOpen, setIsOpen] = useState(false)

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            if (!target.closest('.hero-dropdown')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSelectMode = (mode: HeroMode | "none") => {
        setIsOpen(false);
        if (mode === "none") {
            // Revert to normal mode (but keep dark mode)
            const root = document.documentElement;
            HERO_MODES.forEach((m) => root.classList.remove(m));
            root.classList.add("dark");
            localStorage.setItem("hero_mode", "none");
            localStorage.setItem("theme", "dark");
            setIsSpidey(false);
            setIsIronman(false);
            setIsDeadpool(false);
            setIsThor(false);
            setIsVenom(false);
            setIsMoonKnight(false);
            setIsLuffy(false);
            setIsZoro(false);
            window.dispatchEvent(new Event("themeChange"));
        } else {
            // The toggleMode already does exactly what we need for enabling
            toggleMode(mode);
        }
    }

    const currentMode = isSpidey ? "spiderman" : isIronman ? "ironman" : isDeadpool ? "deadpool" : isThor ? "thor" : isVenom ? "venom" : isMoonKnight ? "moonknight" : isLuffy ? "luffy" : isZoro ? "zoro" : "none";

    return (
        <div className={cn("relative flex items-center gap-2 hero-dropdown", className)}>
            
            {/* Dropdown Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-900/10 hover:border-slate-900/30 dark:border-white/10 dark:hover:border-white/30 bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all text-xs font-medium tracking-wider text-slate-900 dark:text-white uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <span className="hidden sm:inline">Theme</span>
                <span className="flex items-center justify-center w-5 h-5 opacity-80">
                    {currentMode === "spiderman" && <img src={spideyLogo} alt="Spidey" className="w-5 h-5 object-contain" />}
                    {currentMode === "ironman" && <img src={arcReactorLogo} alt="Iron Man" className="w-5 h-5 object-contain" />}
                    {currentMode === "deadpool" && <DeadpoolMaskIcon muted={false} className="w-5 h-5 object-contain text-white" />}
                    {currentMode === "thor" && <MjolnirIcon muted={false} className="w-5 h-5 object-contain text-white" />}
                    {currentMode === "venom" && <VenomSpiderIcon muted={false} className="w-5 h-5 object-contain" />}
                    {currentMode === "moonknight" && <CrescentIcon muted={false} className="w-5 h-5 object-contain" />}
                    {currentMode === "luffy" && <StrawHatIcon muted={false} className="w-5 h-5 object-contain" />}
                    {currentMode === "zoro" && <KatanaIcon muted={false} className="w-5 h-5 object-contain" />}
                    {currentMode === "none" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </span>
                <svg className={cn("w-3 h-3 transition-transform", isOpen ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="flex flex-col py-1">
                            <button
                                onClick={() => handleSelectMode("none")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "none" && "bg-slate-50 dark:bg-slate-800/50 font-bold")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-70">
                                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Default Theme
                            </button>
                            <button
                                onClick={() => handleSelectMode("spiderman")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "spiderman" && "text-red-600 dark:text-red-400 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <img src={spideyLogo} alt="" className="w-4 h-4 object-contain opacity-80" />
                                Spider-Man
                            </button>
                            <button
                                onClick={() => handleSelectMode("ironman")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "ironman" && "text-cyan-600 dark:text-cyan-400 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <img src={arcReactorLogo} alt="" className="w-4 h-4 object-contain opacity-80" />
                                Iron Man
                            </button>
                            <button
                                onClick={() => handleSelectMode("deadpool")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "deadpool" && "text-red-700 dark:text-red-500 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <DeadpoolMaskIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Deadpool
                            </button>
                            <button
                                onClick={() => handleSelectMode("thor")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "thor" && "text-sky-600 dark:text-sky-400 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <MjolnirIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Thor
                            </button>
                            <button
                                onClick={() => handleSelectMode("venom")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "venom" && "text-zinc-700 dark:text-zinc-200 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <VenomSpiderIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Venom
                            </button>
                            <button
                                onClick={() => handleSelectMode("moonknight")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "moonknight" && "text-amber-600 dark:text-amber-300 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <CrescentIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Moon Knight
                            </button>
                            <button
                                onClick={() => handleSelectMode("luffy")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "luffy" && "text-red-700 dark:text-red-500 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <StrawHatIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Luffy
                            </button>
                            <button
                                onClick={() => handleSelectMode("zoro")}
                                className={cn("flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", currentMode === "zoro" && "text-emerald-700 dark:text-emerald-400 font-bold bg-slate-50 dark:bg-slate-800/50")}
                            >
                                <KatanaIcon muted={true} className="w-4 h-4 object-contain opacity-80" />
                                Zoro
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Onboarding Tooltip (only if menu is closed to avoid clutter) */}
            <AnimatePresence>
                {showOnboarding && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="absolute top-[120%] right-0 w-64 md:w-72 bg-slate-900/95 dark:bg-black/95 border border-slate-700/50 dark:border-white/10 rounded-xl p-4 shadow-2xl z-[100] backdrop-blur-md"
                    >
                        {/* Triangle pointer */}
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-900/95 dark:bg-black/95 border-t border-l border-slate-700/50 dark:border-white/10 rotate-45" />
                        
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
                                Open this menu to experience this portfolio as <strong className="text-red-400 font-bold">Spider-Man</strong>, <strong className="text-cyan-400 font-bold">Iron Man</strong>, <strong className="text-rose-500 font-bold">Deadpool</strong>, <strong className="text-sky-300 font-bold">Thor</strong>, <strong className="text-zinc-200 font-bold">Venom</strong>, <strong className="text-amber-300 font-bold">Moon Knight</strong>, <strong className="text-red-400 font-bold">Luffy</strong> or <strong className="text-emerald-400 font-bold">Zoro</strong>!
                            </p>
                        </div>

                        {/* Glow effect behind tooltip */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-cyan-500/10 to-zinc-400/10 rounded-xl blur-md -z-10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SpidermanToggler
