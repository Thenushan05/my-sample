import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import GooeyNav from "../ui/GooeyNav";
import { AnimatedThemeToggler } from "../ui/AnimatedThemeToggler";
import { SpidermanToggler } from "../ui/SpidermanToggler";
import { motion } from "framer-motion";
import logoImg from "../../assets/logo.png";
import spideyLogo from "../../assets/spidey-logo-white.png";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";
import { MjolnirIcon } from "../ui/MjolnirIcon";
import { VenomSpiderIcon } from "../ui/VenomSpiderIcon";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });
  const [isSpiderman, setIsSpiderman] = useState(false);
  const [isIronman, setIsIronman] = useState(false);
  const [isDeadpool, setIsDeadpool] = useState(false);
  const [isThor, setIsThor] = useState(false);
  const [isVenom, setIsVenom] = useState(false);

  useEffect(() => {
    const syncModes = () => {
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
      setIsIronman(document.documentElement.classList.contains("ironman"));
      setIsDeadpool(document.documentElement.classList.contains("deadpool"));
      setIsThor(document.documentElement.classList.contains("thor"));
      setIsVenom(document.documentElement.classList.contains("venom"));
    };
    const observer = new MutationObserver(syncModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    syncModes();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => {
        const id = item.href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id,
            offsetTop: rect.top + window.scrollY,
            height: rect.height,
          };
        }
        return null;
      }).filter(Boolean);

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.height
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(targetId);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-800/50 dark:border-white/5 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      {/* Spider-Man Web shooter glowing bottom border */}
      {isSpiderman && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-[0_0_12px_rgba(220,38,38,0.6)] pointer-events-none" />
      )}

      {/* Iron Man Repulsor glowing bottom border */}
      {isIronman && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-cyan-400 to-red-600 shadow-[0_0_12px_rgba(6,182,212,0.8)] pointer-events-none" />
      )}

      {/* Venom: the symbiote oozes along the bottom edge */}
      {isVenom && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="venom-ooze-edge h-[3px] w-full" />
          {[6, 19, 31, 44, 57, 69, 82, 94].map((left, i) => (
            <span
              key={left}
              style={{ left: `${left}%`, height: 6 + ((i * 9) % 14) }}
              className="absolute top-[2px] w-[3px] rounded-b-full bg-[#3b0764]"
            />
          ))}
        </div>
      )}

      {/* Thor: current arcs along the bottom edge instead of a static glow */}
      {isThor && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="thor-live-edge h-[2.5px] w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_14px_rgba(125,211,252,0.9)]" />
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af6a]/60 to-transparent" />
        </div>
      )}

      {/* Deadpool: the navbar bleeds instead of glowing */}
      {isDeadpool && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="dp-blood-edge h-[3px] w-full" />
          {[8, 21, 34, 47, 58, 71, 84, 93].map((left, i) => (
            <span
              key={left}
              style={{ left: `${left}%`, height: 5 + ((i * 7) % 12) }}
              className="absolute top-[2px] w-[3px] rounded-b-full bg-[#b91c1c]"
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative z-10">
        {/* Initials / Hero Logo */}
        <motion.a
          layoutId="header-logo"
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold tracking-tight shadow-md group-hover:scale-105 transition-all ${
            isIronman
              ? "bg-gradient-to-br from-black via-amber-950 to-red-950 border border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.9)]"
              : isSpiderman
                ? "bg-gradient-to-br from-red-600 via-red-700 to-blue-700 border border-red-400/60 shadow-[0_0_18px_rgba(239,68,68,0.8)] rotate-[-4deg]"
                : isDeadpool
                  ? "!rounded-none bg-[#dc143c] border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,0.85)] rotate-[-3deg]"
                  : isThor
                    ? "bg-gradient-to-br from-[#1b2a44] via-[#0d1524] to-black border border-[#d4af6a]/80 shadow-[0_0_18px_rgba(125,211,252,0.85)]"
                    : isVenom
                      ? "!rounded-[16px_7px_18px_9px/9px_17px_7px_16px] bg-gradient-to-br from-[#2e1065] via-[#12061f] to-black border border-[#a855f7]/80 shadow-[0_0_20px_rgba(168,85,247,0.9)]"
                      : "bg-gradient-to-br from-blue-500 to-violet-600"
          }`}>
            {isIronman ? (
              <img src={arcReactorLogo} alt="Iron Man Mode" className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse" />
            ) : isSpiderman ? (
              <img src={spideyLogo} alt="Spidey Mode" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
            ) : isDeadpool ? (
              <DeadpoolMaskIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]" />
            ) : isThor ? (
              <MjolnirIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(125,211,252,1)]" />
            ) : isVenom ? (
              <VenomSpiderIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(233,237,242,1)]" />
            ) : (
              <img src={logoImg} alt="TS Logo" className="w-full h-full object-cover rounded-xl" />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-extrabold tracking-wider uppercase hidden md:inline-block transition-colors ${
              isIronman ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]" : isSpiderman ? "text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]" : isDeadpool ? "text-[#f7f1e3] drop-shadow-[2px_2px_0_rgba(127,29,29,1)]" : isThor ? "text-sky-100 drop-shadow-[0_0_12px_rgba(125,211,252,0.9)]" : isVenom ? "text-zinc-100 drop-shadow-[0_0_12px_rgba(185,194,205,0.9)]" : "text-slate-900 dark:text-white"
            }`}>
              Thenushan Sritharan
            </span>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-slate-900 dark:text-white">
          <GooeyNav
            items={NAV_ITEMS}
            particleCount={12}
            particleDistances={[70, 8]}
            particleR={80}
            animationTime={500}
            timeVariance={250}
            colors={[1, 2, 3, 4]}
            initialActiveIndex={NAV_ITEMS.findIndex(item => item.href.slice(1) === activeSection)}
            onItemClick={(index) => {
              const href = NAV_ITEMS[index].href;
              handleNavClick({ preventDefault: () => { } } as React.MouseEvent<HTMLAnchorElement>, href);
            }}
          />

          <SpidermanToggler />

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="resume-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-900/10 hover:border-slate-900/30 dark:border-white/10 dark:hover:border-white/30 bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all text-xs font-medium tracking-wider text-slate-900 dark:text-white uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [.spiderman_&]:!rounded-none [.spiderman_&]:!border-none [.spiderman_&]:bg-red-600 [.spiderman_&]:hover:bg-red-500 [.spiderman_&]:text-white italic [.spiderman_&]:-skew-x-6"
          >
            Resume
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Trigger & Toggles */}
        <div className="flex md:hidden items-center gap-2">
          <SpidermanToggler className="scale-90" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-900 dark:text-white/70 hover:text-slate-600 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 ml-1"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-[#030712]/95 border-b border-slate-200 dark:border-white/5 backdrop-blur-lg px-6 py-6 transition-all duration-300 shadow-xl">
          <ul className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-sm tracking-wider uppercase font-medium block py-1.5 ${isActive
                      ? "text-blue-500 dark:text-blue-400 [.deadpool_&]:inline-block [.deadpool_&]:bg-[#dc143c] [.deadpool_&]:!text-[#fff8e7] [.deadpool_&]:border-2 [.deadpool_&]:border-black [.deadpool_&]:px-2.5 [.deadpool_&]:-rotate-1 [.deadpool_&]:shadow-[4px_4px_0_rgba(0,0,0,0.85)] [.thor_&]:inline-block [.thor_&]:!text-sky-100 [.thor_&]:border-l-2 [.thor_&]:border-sky-300 [.thor_&]:pl-2.5 [.thor_&]:drop-shadow-[0_0_10px_rgba(125,211,252,0.9)] [.venom_&]:inline-block [.venom_&]:!text-zinc-100 [.venom_&]:border-l-2 [.venom_&]:border-[#e9edf2] [.venom_&]:pl-2.5 [.venom_&]:drop-shadow-[0_0_10px_rgba(185,194,205,0.9)]"
                      : "text-slate-600 dark:text-white/60"
                      }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-2 border-t border-slate-200 dark:border-white/5">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium tracking-wider text-white uppercase"
              >
                Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};