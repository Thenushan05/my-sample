import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import GooeyNav from "../ui/GooeyNav";
import { AnimatedThemeToggler } from "../ui/AnimatedThemeToggler";
import { SpidermanToggler } from "../ui/SpidermanToggler";
import { motion } from "framer-motion";
import logoImg from "../../assets/logo.png";
import spideyLogo from "../../assets/spidey-logo.png";

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

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsSpiderman(document.documentElement.classList.contains("spiderman"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsSpiderman(document.documentElement.classList.contains("spiderman"));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = NAV_ITEMS.map((item) => {
        const id = item.href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id,
            offsetTop: rect.top + window.scrollY,
            rect,
          };
        }
        return null;
      }).filter(Boolean);

      const scrollPos = window.scrollY + 200;
      let currentSection = "hero";

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section && scrollPos >= section.offsetTop) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[49] transition-all duration-300 ${
        isScrolled
          ? `border-b backdrop-blur-md py-4 ${
              isSpiderman ? 'bg-black/90 dark:bg-black/90' : 'bg-[var(--color-navbar-bg)]'
            }`
          : 'bg-transparent py-6'
      }`}
      style={{
        backgroundImage: isSpiderman && isScrolled

          ? 'radial-gradient(ellipse at center top, rgba(220, 38, 38, 0.15) 0%, transparent 70%)'
          : 'none',
        borderColor: isSpiderman ? (isScrolled ? 'rgba(220, 38, 38, 0.5)' : 'transparent') : (isScrolled ? 'var(--color-border)' : 'transparent'),
      }}
    >
      {/* Spider-Man Web shooter glowing bottom border */}
      {isSpiderman && isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-600 via-red-500 to-blue-600 shadow-[0_0_12px_rgba(220,38,38,0.6)] pointer-events-none" />
      )}

      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative z-10">
        {/* Initials / Spidey Logo */}
        <motion.a
          layoutId="header-logo"
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold tracking-tight shadow-md group-hover:scale-105 transition-all ${
            isSpiderman 
              ? "bg-gradient-to-br from-red-600 via-red-700 to-blue-700 border border-red-400/60 shadow-[0_0_18px_rgba(239,68,68,0.8)] rotate-[-4deg]" 
              : "bg-gradient-to-br from-blue-500 to-violet-600"
          }`}>
            {isSpiderman ? (
              <img src={spideyLogo} alt="Spidey Mode" className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
            ) : (
              <img src={logoImg} alt="TS Logo" className="w-full h-full object-cover rounded-xl" />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-extrabold tracking-wider uppercase hidden md:inline-block transition-colors ${
              isSpiderman ? "text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]" : "text-slate-900 dark:text-white"
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

          <AnimatedThemeToggler className="theme-toggler" variant="circle" duration={500} />
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
          <AnimatedThemeToggler className="theme-toggler scale-90" variant="circle" duration={500} />
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
                    className={`text-sm tracking-wider uppercase font-medium block py-1.5 ${isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-600 dark:text-white/60"
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
    </nav>
  );
};