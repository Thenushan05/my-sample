import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import GooeyNav from "../ui/GooeyNav";
import { AnimatedThemeToggler } from "../ui/AnimatedThemeToggler";
import { motion } from "framer-motion";

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
      className={`fixed top-0 left-0 right-0 z-[49] transition-all duration-300 ${isScrolled
        ? "border-b backdrop-blur-md py-4"
        : "bg-transparent py-6"
        }`}
      style={{
        backgroundColor: isScrolled ? 'var(--color-navbar-bg)' : 'transparent',
        borderColor: isScrolled ? 'var(--color-border)' : 'transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Initials Logo */}
        <motion.a
          layoutId="header-logo"
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold tracking-tight shadow-md group-hover:scale-105 transition-transform">
            TS
          </div>
          <span className="text-sm font-semibold tracking-wider text-white uppercase hidden md:inline-block">
            Thenushan Sritharan
          </span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
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

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="resume-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-xs font-medium tracking-wider text-white uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Resume
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#030712]/95 border-b border-white/5 backdrop-blur-lg px-6 py-6 transition-all duration-300">
          <ul className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-sm tracking-wider uppercase font-medium block py-1.5 ${isActive ? "text-blue-400" : "text-white/60"
                      }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-2 border-t border-white/5">
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