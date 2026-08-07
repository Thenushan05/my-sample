import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "../../data/personal";
import { Button } from "../ui/Button";
import { ShareButton } from "../ui/ShareButton";
import { Antigravity } from "../immersive/Antigravity";
import { IronManFlight } from "../immersive/IronManFlight";
import { IronManWalk } from "../immersive/IronManWalk";
import profileImage from "../../assets/profile.png";
import spideyLogo from "../../assets/spidey-logo-white.png";
import arcReactorLogo from "../../assets/arc-reactor-logo.png";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";
import { MjolnirIcon } from "../ui/MjolnirIcon";
import { VenomSpiderIcon } from "../ui/VenomSpiderIcon";
import { CrescentIcon } from "../ui/CrescentIcon";
import { StrawHatIcon } from "../ui/StrawHatIcon";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreClick: () => void;
}

const ROLES = ["Software Engineer", "Business Analyst", "Digital Product Builder"];
const LASER_TITLES = [
  "FULLSTACK DEVELOPER",
  "AI / ML ENGINEER",
  "SYSTEMS ARCHITECT",
  "UI / UX INNOVATOR",
  "DIGITAL PRODUCT BUILDER"
];

const LASER_COLORS = [
  {
    name: "Red",
    flare: "bg-red-600 shadow-[0_0_25px_#ff0000,0_0_60px_#ff0000]",
    beam: "from-red-500/30 via-white via-15% via-red-500 via-60% to-red-600 shadow-[0_0_20px_#ff0000,0_0_45px_#ff1a1a,0_0_80px_#ff0000]",
    glow: "from-red-500/30 via-red-600/60 to-red-600/80",
    box: "border-red-500/80 bg-red-950/40 shadow-[0_0_35px_rgba(255,0,0,0.4),inset_0_0_15px_rgba(255,0,0,0.2)] scale-105",
    text: "text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-red-400 drop-shadow-[0_0_12px_rgba(255,100,100,0.8)]",
    cursor: "bg-red-500 shadow-[0_0_10px_#ff0000]",
    radial: "radial-gradient(circle, rgba(255,30,30,0.6) 0%, rgba(255,60,20,0.25) 40%, rgba(255,0,0,0) 70%)",
  },
  {
    name: "Cyan",
    flare: "bg-cyan-500 shadow-[0_0_25px_#06b6d4,0_0_60px_#06b6d4]",
    beam: "from-cyan-500/30 via-white via-15% via-cyan-400 via-60% to-blue-600 shadow-[0_0_20px_#06b6d4,0_0_45px_#3b82f6,0_0_80px_#06b6d4]",
    glow: "from-cyan-500/30 via-cyan-500/60 to-blue-600/80",
    box: "border-cyan-500/80 bg-cyan-950/40 shadow-[0_0_35px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.2)] scale-105",
    text: "text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    cursor: "bg-cyan-400 shadow-[0_0_10px_#06b6d4]",
    radial: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.25) 40%, rgba(6,182,212,0) 70%)",
  },
  {
    name: "Violet",
    flare: "bg-fuchsia-600 shadow-[0_0_25px_#d946ef,0_0_60px_#d946ef]",
    beam: "from-fuchsia-500/30 via-white via-15% via-fuchsia-500 via-60% to-purple-600 shadow-[0_0_20px_#d946ef,0_0_45px_#a855f7,0_0_80px_#d946ef]",
    glow: "from-fuchsia-500/30 via-fuchsia-600/60 to-purple-600/80",
    box: "border-fuchsia-500/80 bg-fuchsia-950/40 shadow-[0_0_35px_rgba(217,70,239,0.4),inset_0_0_15px_rgba(217,70,239,0.2)] scale-105",
    text: "text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-fuchsia-400 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]",
    cursor: "bg-fuchsia-500 shadow-[0_0_10px_#d946ef]",
    radial: "radial-gradient(circle, rgba(217,70,239,0.6) 0%, rgba(168,85,247,0.25) 40%, rgba(217,70,239,0) 70%)",
  },
  {
    name: "Emerald",
    flare: "bg-emerald-500 shadow-[0_0_25px_#10b981,0_0_60px_#10b981]",
    beam: "from-emerald-500/30 via-white via-15% via-emerald-400 via-60% to-green-600 shadow-[0_0_20px_#10b981,0_0_45px_#22c55e,0_0_80px_#10b981]",
    glow: "from-emerald-500/30 via-emerald-500/60 to-green-600/80",
    box: "border-emerald-500/80 bg-emerald-950/40 shadow-[0_0_35px_rgba(16,185,129,0.4),inset_0_0_15px_rgba(16,185,129,0.2)] scale-105",
    text: "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-green-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]",
    cursor: "bg-emerald-400 shadow-[0_0_10px_#10b981]",
    radial: "radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(34,197,94,0.25) 40%, rgba(16,185,129,0) 70%)",
  },
];

const DEADPOOL_PORTRAIT = "/deadpoolme_nobg.png";
const THOR_PORTRAIT = "/thorme_nobg.png";
const VENOM_PORTRAIT = "/venom-nobg.png";
const MOONKNIGHT_PORTRAIT = "/moonme_nobg.png";

/**
 * The symbiote spread.
 *
 * A real Venom transformation isn't a wipe — the mass takes hold at one point
 * and creeps outward in lobes until it has covered everything. These are five
 * polygons with an identical point count so clip-path can morph between them,
 * each a larger version of the same irregular outline centred on the chest.
 * The per-point noise is fixed, so the shape grows outward rather than
 * wobbling randomly on every frame.
 */
const VENOM_SPREAD = (() => {
  const POINTS = 26;
  const cx = 50;
  const cy = 56;
  const noise = Array.from(
    { length: POINTS },
    (_, i) => 0.72 + ((Math.sin(i * 2.3) + Math.sin(i * 5.1)) * 0.5 + 1) * 0.28
  );
  const at = (r: number) =>
    "polygon(" +
    Array.from({ length: POINTS }, (_, i) => {
      const a = (i / POINTS) * Math.PI * 2;
      const rr = r * noise[i];
      return (cx + Math.cos(a) * rr).toFixed(1) + "% " + (cy + Math.sin(a) * rr * 1.3).toFixed(1) + "%";
    }).join(", ") +
    ")";

  return [at(2), at(20), at(52), at(96), at(165)];
})();

/** Feelers that run ahead of the spread, then retract into the mass. */
const VENOM_FEELERS = [
  { d: "M50 56 C 44 44, 30 36, 22 20", delay: 0.18 },
  { d: "M50 56 C 57 44, 71 36, 79 20", delay: 0.26 },
  { d: "M50 56 C 40 62, 26 66, 14 62", delay: 0.36 },
  { d: "M50 56 C 61 62, 75 66, 87 62", delay: 0.44 },
  { d: "M50 56 C 48 72, 42 84, 34 97", delay: 0.54 },
  { d: "M50 56 C 53 72, 59 84, 67 97", delay: 0.62 },
  { d: "M50 56 C 50 44, 50 30, 50 10", delay: 0.70 },
];


/**
 * Katana cuts across the portrait. Adjacent bands share their edge
 * coordinates exactly, so once they land there are no gaps.
 */
const DEADPOOL_SLICES = [
  { clip: "polygon(0% 0%, 100% 0%, 100% 17%, 0% 25%)", x: -170, y: -34, r: -4 },
  { clip: "polygon(0% 25%, 100% 17%, 100% 37%, 0% 45%)", x: 180, y: -14, r: 3 },
  { clip: "polygon(0% 45%, 100% 37%, 100% 58%, 0% 66%)", x: -190, y: 10, r: -3 },
  { clip: "polygon(0% 66%, 100% 58%, 100% 79%, 0% 87%)", x: 175, y: 30, r: 4 },
  { clip: "polygon(0% 87%, 100% 79%, 100% 100%, 0% 100%)", x: -160, y: 48, r: -2 },
];

/** Left-edge height of each cut, used to place the seam flashes. */
const DEADPOOL_SEAMS = [25, 45, 66, 87];

const PRO_TECH_LOGOS = [
  { name: "React", slug: "react", color: "61DAFB", lightColor: "0284C7", size: "lg", pos: "top-[8%] -left-[10%] sm:-left-[14%]" },
  { name: "Java", slug: "java", color: "ED8B00", customUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", size: "lg", pos: "top-[5%] -right-[10%] sm:-right-[14%]" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E", lightColor: "16A34A", size: "lg", pos: "top-[42%] -left-[12%] sm:-left-[16%]" },
  { name: "Next.js", slug: "nextdotjs", color: "ffffff", lightColor: "000000", size: "lg", pos: "top-[38%] -right-[12%] sm:-right-[16%]" },
  { name: "Python", slug: "python", color: "3776AB", size: "lg", pos: "bottom-[15%] -left-[8%] sm:-left-[12%]" },
  { name: "Angular", slug: "angular", color: "DD0031", size: "lg", pos: "bottom-[12%] -right-[8%] sm:-right-[12%]" },
  { name: "Docker", slug: "docker", color: "2496ED", lightColor: "0284C7", size: "lg", pos: "-top-[4%] left-[34%]" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1", size: "sm", pos: "top-[22%] left-[4%] sm:left-[8%]" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", lightColor: "0891B2", size: "sm", pos: "top-[18%] right-[4%] sm:right-[8%]" },
  { name: "GraphQL", slug: "graphql", color: "E10098", size: "sm", pos: "top-[55%] left-[6%] sm:left-[10%]" },
  { name: "MongoDB", slug: "mongodb", color: "47A248", lightColor: "16A34A", size: "sm", pos: "top-[52%] right-[6%] sm:right-[10%]" },
  { name: "Git", slug: "git", color: "F05032", size: "sm", pos: "bottom-[20%] left-[15%] sm:left-[18%]" },
  { name: "Prisma", slug: "prisma", color: "ffffff", lightColor: "0F172A", size: "sm", pos: "bottom-[18%] right-[15%] sm:right-[18%]" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const laserTextTargetRef = useRef<HTMLDivElement>(null);

  const [roleIndex, setRoleIndex] = useState(0);
  const [isFunMode, setIsFunMode] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [laserTitleIdx, setLaserTitleIdx] = useState(0);
  const [laserColorIdx, setLaserColorIdx] = useState(0);
  const [typingPhase, setTypingPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  const [pupilPos, setPupilPos] = useState({
    leftX: 0.244,
    leftY: 0.271,
    rightX: 0.381,
    rightY: 0.257,
  });
  const [isAdjustingLasers, setIsAdjustingLasers] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );
  const [isIronman, setIsIronman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("ironman")
  );
  const [isDeadpool, setIsDeadpool] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("deadpool")
  );
  const [isThor, setIsThor] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("thor")
  );
  const [isVenom, setIsVenom] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("venom")
  );
  const [isMoonKnight, setIsMoonKnight] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("moonknight")
  );
  const [isLuffy, setIsLuffy] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("luffy")
  );
  const [isMaskOn, setIsMaskOn] = useState(false);

  useEffect(() => {
    const syncHeroModes = () => {
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
      setIsIronman(document.documentElement.classList.contains("ironman"));
      setIsDeadpool(document.documentElement.classList.contains("deadpool"));
      setIsThor(document.documentElement.classList.contains("thor"));
      setIsVenom(document.documentElement.classList.contains("venom"));
      setIsMoonKnight(document.documentElement.classList.contains("moonknight"));
      setIsLuffy(document.documentElement.classList.contains("luffy"));
    };
    syncHeroModes();
    const observer = new MutationObserver(syncHeroModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [laserTargets, setLaserTargets] = useState({
    left: { length: 800, angle: -10 },
    right: { length: 800, angle: -14 },
  });

  const updateLaserTargets = () => {
    if (!isFunMode || !imgRef.current || !laserTextTargetRef.current) return;
    const imgRect = imgRef.current.getBoundingClientRect();
    const targetRect = laserTextTargetRef.current.getBoundingClientRect();
    const leftPupilX = imgRect.left + imgRect.width * pupilPos.leftX;
    const leftPupilY = imgRect.top + imgRect.height * pupilPos.leftY;
    const rightPupilX = imgRect.left + imgRect.width * pupilPos.rightX;
    const rightPupilY = imgRect.top + imgRect.height * pupilPos.rightY;
    const targetX = targetRect.left + 24;
    const targetY = targetRect.top + targetRect.height / 2;
    const leftDx = targetX - leftPupilX;
    const leftDy = targetY - leftPupilY;
    const leftLength = Math.hypot(leftDx, leftDy);
    const leftAngle = (Math.atan2(leftDy, leftDx) * 180) / Math.PI;
    const rightDx = targetX - rightPupilX;
    const rightDy = targetY - rightPupilY;
    const rightLength = Math.hypot(rightDx, rightDy);
    const rightAngle = (Math.atan2(rightDy, rightDx) * 180) / Math.PI;

    setLaserTargets({
      left: { length: leftLength, angle: leftAngle },
      right: { length: rightLength, angle: rightAngle },
    });
    setLaserColorIdx((prev) => (prev + 1) % LASER_COLORS.length);
    setIsLaserActive(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isLaserActive || isAdjustingLasers) updateLaserTargets();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLaserActive, isFunMode, isAdjustingLasers, pupilPos]);

  useEffect(() => {
    if (isFunMode || isAdjustingLasers) {
      updateLaserTargets();
    }
  }, [pupilPos, isAdjustingLasers, isFunMode]);

  useEffect(() => {
    if (!isLaserActive) {
      setTypedText("");
      setTypingPhase("typing");
      return;
    }
    const currentTitle = LASER_TITLES[laserTitleIdx];
    let timer: ReturnType<typeof setTimeout>;
    if (typingPhase === "typing") {
      if (typedText.length < currentTitle.length) {
        timer = setTimeout(() => {
          setTypedText(currentTitle.slice(0, typedText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => setTypingPhase("pausing"), 1400);
      }
    } else if (typingPhase === "pausing") {
      timer = setTimeout(() => setTypingPhase("deleting"), 100);
    } else if (typingPhase === "deleting") {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 28);
      } else {
        setLaserTitleIdx((prev) => (prev + 1) % LASER_TITLES.length);
        setTypingPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [isLaserActive, typedText, typingPhase, laserTitleIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-fade-element", {
        opacity: 0,
        y: -60,
        filter: "blur(8px)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const currentTheme = LASER_COLORS[laserColorIdx];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-16 pt-28 pb-12 lg:pt-32 lg:pb-12">
      {isIronman && <IronManFlight />}
      {isIronman && <IronManWalk />}
      <div className="hidden md:flex absolute top-24 right-4 md:top-28 md:right-8 z-40 items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            if (isFunMode) {
              setIsLaserActive(false);
              setIsAdjustingLasers(false);
            }
            setIsFunMode(!isFunMode);
          }}
          className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer select-none backdrop-blur-md ${
            isFunMode
              ? "bg-purple-950/70 border-purple-500/80 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105"
              : "bg-white/90 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
          }`}
          title="Toggle Superman Laser & Typing FX"
        >
          <span className="relative flex h-2 w-2">
            {isFunMode && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-300 ${
                isFunMode ? "bg-purple-400" : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            ></span>
          </span>
          <span>⚡ Fun Mode</span>
          <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-300 flex items-center ${isFunMode ? "bg-purple-500" : "bg-neutral-300 dark:bg-neutral-700"}`}>
            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isFunMode ? "translate-x-3" : "translate-x-0"}`} />
          </div>
        </button>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#FF9FFC"
          autoAnimate={true}
          particleVariance={1}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        <div className="max-lg:contents lg:flex-1 lg:max-w-2xl lg:flex lg:flex-col text-center lg:text-left w-full">
          <div className="hero-fade-element order-1 flex flex-col items-center lg:items-start w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)] [.spiderman_&]:bg-red-950/60 [.spiderman_&]:border-red-500/40 [.spiderman_&]:text-red-400 [.spiderman_&]:shadow-[0_0_20px_rgba(239,68,68,0.4)] [.ironman_&]:bg-black/90 [.ironman_&]:border-cyan-400/50 [.ironman_&]:text-cyan-400 [.ironman_&]:shadow-[0_0_20px_rgba(6,182,212,0.5)] [.deadpool_&]:rounded-none [.deadpool_&]:bg-[#dc143c] [.deadpool_&]:border-[3px] [.deadpool_&]:border-black [.deadpool_&]:text-white [.deadpool_&]:shadow-[5px_5px_0_rgba(0,0,0,0.85)] [.thor_&]:rounded-md [.thor_&]:bg-[#101a2c] [.thor_&]:border-[#d4af6a]/60 [.thor_&]:text-sky-200 [.thor_&]:shadow-[0_0_22px_rgba(56,189,248,0.35)] [.venom_&]:rounded-[14px_6px_16px_8px/8px_15px_6px_14px] [.venom_&]:bg-[#0f1011] [.venom_&]:border-[#b9c2cd]/60 [.venom_&]:text-zinc-200 [.venom_&]:shadow-[0_0_24px_rgba(185,194,205,0.45)] [.luffy_&]:rounded-none [.luffy_&]:bg-[#e9d5a8] [.luffy_&]:border-[2px] [.luffy_&]:border-[#241a10] [.luffy_&]:text-[#241a10] [.luffy_&]:shadow-[3px_3px_0_rgba(36,26,16,0.3)]"
            >
              {isIronman ? (
                <img src={arcReactorLogo} alt="Arc Reactor" className="w-4 h-4 object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,1)] animate-pulse" />
              ) : isSpiderman ? (
                <img src={spideyLogo} alt="Spidey" className="w-4 h-4 object-contain drop-shadow-[0_0_6px_rgba(239,68,68,1)] animate-pulse" />
              ) : isDeadpool ? (
                <DeadpoolMaskIcon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(220,20,60,1)] animate-pulse" />
              ) : isThor ? (
                <MjolnirIcon className="w-4 h-4 drop-shadow-[0_0_7px_rgba(125,211,252,1)] animate-pulse" />
              ) : isVenom ? (
                <VenomSpiderIcon className="w-4 h-4 drop-shadow-[0_0_7px_rgba(233,237,242,1)] animate-pulse" />
              ) : isMoonKnight ? (
                <CrescentIcon className="w-4 h-4 drop-shadow-[0_0_7px_rgba(242,239,230,1)] animate-pulse" />
              ) : isLuffy ? (
                <StrawHatIcon className="w-4 h-4" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
              )}
              {isIronman
                ? "STARK INDUSTRIES • MARK LXXXV SUITED"
                : isSpiderman
                  ? "Friendly Neighborhood Developer"
                  : isDeadpool
                    ? "MERC WITH A PORTFOLIO • MAXIMUM EFFORT"
                    : isThor
                      ? "ASGARD • GOD OF THUNDER & DEPLOYMENTS"
                      : isVenom
                        ? "WE ARE VENOM • WE SHIP TOGETHER"
                        : isMoonKnight
                      ? "SERVANT OF KHONSHU • SUIT UP"
                      : isLuffy
                      ? "STRAW HAT CREW • FUTURE PIRATE KING"
                      : "Available for New Projects"}
            </motion.div>

            <AnimatePresence>
              {isIronman && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="hidden sm:block w-full mb-6 p-4 bg-black/90 border border-cyan-500/50 rounded-none shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-2xl text-left font-mono relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-red-600 shadow-[0_0_10px_#06b6d4]" />
                  <div className="flex items-center justify-between gap-4 pb-2 border-b border-cyan-500/30">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold tracking-widest text-xs uppercase italic">
                      <img src={arcReactorLogo} alt="" className="w-4 h-4 object-contain filter drop-shadow-[0_0_8px_#06b6d4] animate-pulse" />
                      <span>J.A.R.V.I.S. TACTICAL HUD ONLINE</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase animate-pulse">
                      MARK LXXXV • CAPACITOR 100%
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-cyan-200">
                    <div className="bg-cyan-950/40 p-2 border border-cyan-500/30">
                      <span className="text-cyan-400 font-extrabold block">ARC REACTOR:</span> 3.2 Gigawatts
                    </div>
                    <div 
                      className="bg-cyan-950/40 p-2 border border-cyan-500/30 cursor-pointer hover:bg-cyan-800/60 transition-colors"
                      onClick={() => setIsMaskOn(!isMaskOn)}
                    >
                      <span className="text-amber-400 font-extrabold block">HELMET MASK:</span> {isMaskOn ? "DEPLOYED" : "STANDBY (CLICK)"}
                    </div>
                    <div className="bg-cyan-950/40 p-2 border border-cyan-500/30">
                      <span className="text-cyan-400 font-extrabold block">TARGET LOCK:</span> ACTIVE
                    </div>
                    <div className="bg-cyan-950/40 p-2 border border-cyan-500/30">
                      <span className="text-amber-400 font-extrabold block">PILOT:</span> T. SRITHARAN
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-name text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-none w-full [.ironman_&]:text-cyan-300 [.ironman_&]:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            >
              {personal.name}
            </motion.h1>
          </div>

          <div className="hero-fade-element order-3 flex flex-col items-center lg:items-start w-full">
            <div className="h-10 md:h-12 relative overflow-hidden mb-6 mt-4 lg:mt-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-lg md:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 font-mono"
                >
                  {ROLES[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="hero-tagline text-sm md:text-base text-white/50 leading-relaxed max-w-md mb-10 mx-auto lg:mx-0"
            >
              I design and build intelligent, scalable, and visually engaging digital products that solve real business problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-4 items-center justify-center lg:justify-start"
            >
              <Button variant="glow" onClick={onExploreClick}>
                Explore My Work
              </Button>
              
              <div ref={contactBtnRef} className="transition-all duration-300 rounded-full">
                <Button variant="secondary" onClick={scrollToContact}>
                  Contact Me
                </Button>
              </div>

              <ShareButton />
            </motion.div>

            <AnimatePresence>
              {isFunMode && (
                <motion.div
                  initial={{ opacity: 0, y: 15, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 15, height: 0 }}
                  transition={{ duration: 0.4 }}
                  ref={laserTextTargetRef}
                  className={`mt-6 inline-flex items-center justify-center lg:justify-start gap-3.5 px-5 py-3 rounded-2xl border transition-all duration-500 max-w-full overflow-hidden ${
                    isLaserActive
                      ? currentTheme.box
                      : "border-neutral-300 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/60 shadow-lg text-neutral-800 dark:text-white"
                  }`}
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isLaserActive
                          ? "bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] scale-125 animate-ping"
                          : "bg-neutral-400 dark:bg-red-500/30"
                      }`}
                    />
                    {isLaserActive && (
                      <div className={`absolute w-6 h-6 rounded-full blur-sm animate-pulse ${currentTheme.cursor}`} />
                    )}
                  </div>

                  <div className="font-mono text-sm sm:text-base md:text-lg font-extrabold tracking-widest uppercase flex items-center min-h-[28px]">
                    <span className={isLaserActive ? currentTheme.text : "text-neutral-700 dark:text-white/50 text-xs tracking-normal font-semibold"}>
                      {typedText || (isLaserActive ? "" : "⚡ HOVER PORTRAIT TO POWER ON LASER...")}
                    </span>
                    {isLaserActive && (
                      <span className={`w-2.5 h-6 ml-1.5 animate-pulse ${currentTheme.cursor}`} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-2 lg:order-none relative z-10 flex justify-center items-center shrink-0 group mt-4 lg:mt-8 w-full"
          onMouseEnter={updateLaserTargets}
          onMouseLeave={() => setIsLaserActive(false)}
        >
          <div
            style={{
              background: isLaserActive && isFunMode
                ? currentTheme.radial
                : "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(168,85,247,0.15) 40%, rgba(236,72,153,0) 70%)",
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[600px] md:w-[700px] h-[500px] sm:h-[600px] md:h-[700px] rounded-full pointer-events-none transition-all duration-700 ${
              isLaserActive && isFunMode ? "scale-110 opacity-100" : "opacity-60 group-hover:scale-105"
            }`}
          />

          <div className="relative inline-block z-10">
            <AnimatePresence>
              {!isFunMode && (
                <div className="absolute inset-0 pointer-events-none z-40">
                  {PRO_TECH_LOGOS.map((tech, idx) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0, y: 15 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: tech.size === "sm" ? [0, -12, 0] : [0, -8, 0],
                        rotate: tech.size === "sm" ? [0, 6, -6, 0] : [0, 4, -4, 0],
                      }}
                      exit={{ opacity: 0, scale: 0, y: 15 }}
                      transition={{
                        opacity: { duration: 0.4, delay: idx * 0.06 },
                        scale: { duration: 0.5, delay: idx * 0.06, type: "spring", bounce: 0.5 },
                        y: {
                          duration: tech.size === "sm" ? 2.5 + (idx % 2) * 0.5 : 3.5 + (idx % 3) * 0.6,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: idx * 0.15,
                        },
                        rotate: {
                          duration: 4 + (idx % 2) * 1,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                        },
                      }}
                      className={`absolute ${tech.pos} pointer-events-auto flex items-center justify-center p-1.5 rounded-2xl hover:scale-125 transition-all duration-300 group/logo cursor-pointer`}
                      title={tech.name}
                    >
                      <img
                        src={(tech as any).customUrl || `https://cdn.simpleicons.org/${tech.slug}/${(tech as any).lightColor || tech.color}`}
                        alt={tech.name}
                        className={`dark:hidden ${
                          tech.size === "sm"
                            ? "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] group-hover/logo:drop-shadow-[0_0_14px_rgba(2,132,199,0.8)]"
                            : "w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] group-hover/logo:drop-shadow-[0_0_24px_rgba(2,132,199,0.8)]"
                        } object-contain transition-all duration-300`}
                      />
                      <img
                        src={(tech as any).customUrl || `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
                        alt={tech.name}
                        className={`hidden dark:block ${
                          tech.size === "sm"
                            ? "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] group-hover/logo:drop-shadow-[0_0_14px_rgba(59,130,246,0.9)]"
                            : "w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 drop-shadow-[0_12px_22px_rgba(0,0,0,0.7)] group-hover/logo:drop-shadow-[0_0_26px_rgba(59,130,246,0.9)]"
                        } object-contain transition-all duration-300`}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            <div
              className={`relative z-10 grid grid-cols-1 grid-rows-1 items-center justify-center justify-items-center transition-all duration-700 ${
                isLaserActive && isFunMode ? "scale-105" : "group-hover:scale-105"
              }`}
            >
              <motion.img
                ref={imgRef}
                src={profileImage}
                alt={personal.name}
                animate={{ opacity: isSpiderman || isIronman || isDeadpool || isThor || isVenom || isMoonKnight || isLuffy ? 0 : 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                style={{
                  maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                  WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                }}
                className="col-start-1 row-start-1 relative z-10 w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain"
              />

              <AnimatePresence>
                {isSpiderman && (
                  <motion.img
                    initial={{ clipPath: "inset(100% 0 0 0)", filter: "brightness(1.5)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)", filter: "brightness(1)" }}
                    exit={{ clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    src="/spiderman_nomask.png"
                    alt="Spidey Suit"
                    style={{
                      maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                      WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                    }}
                    className="col-start-1 row-start-1 z-20 w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isIronman && !isMaskOn && (
                  <motion.img
                    initial={{ clipPath: "inset(100% 0 0 0)", filter: "brightness(1.8) saturate(1.4)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)", filter: "brightness(1.1) saturate(1.2)" }}
                    exit={{ clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    src="/Gemini_Generated_Image_pu6o7vpu6o7vpu6o-Picsart-BackgroundRemover.png"
                    alt="Iron Man Mark LXXXV Suit"
                    onClick={() => setIsMaskOn(!isMaskOn)}
                    style={{
                      cursor: 'pointer',
                      maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                      WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                    }}
                    className="col-start-1 row-start-1 z-20 w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain filter drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isIronman && isMaskOn && (
                  <motion.img
                    initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", filter: "brightness(1.5) saturate(1.5)" }}
                    animate={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", filter: "brightness(1) saturate(1)" }}
                    exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", filter: "brightness(1.5) saturate(1.5)", transition: { duration: 0.5 } }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    src="/173121d8-8551-462a-9b93-2091a23261be-Picsart-BackgroundRemover.jpg"
                    alt="Iron Man Helmet Transformed"
                    onClick={() => setIsMaskOn(false)}
                    style={{ cursor: 'pointer' }}
                    className="col-start-1 row-start-1 z-30 w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain filter drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                  />
                )}
              </AnimatePresence>

              {/* Moon Knight: the suit assembles out of moonlight.
                  This portrait ships on a SOLID BLACK background rather than
                  transparent, so it is composited with mix-blend-mode: screen —
                  against the desert night the black drops out cleanly and the
                  white linen reads as lit by the moon. */}
              <AnimatePresence>
                {isMoonKnight && (
                  <motion.div
                    key="moonknight-portrait"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-start-1 row-start-1 z-20 relative"
                  >
                    {/* Invisible sizer: fixes the box so the overlays align */}
                    <img
                      src={MOONKNIGHT_PORTRAIT}
                      alt=""
                      aria-hidden
                      className="block w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain opacity-0 pointer-events-none"
                    />

                    {/* The linen wraps on: a moonlight sweep travels down the
                        figure, and everything it passes is already suited. */}
                    <motion.img
                      initial={{ clipPath: "inset(0 0 100% 0)", filter: "brightness(2.4) contrast(1.4)" }}
                      animate={{ clipPath: "inset(0 0 0% 0)", filter: "brightness(1.05) contrast(1.05)" }}
                      exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      src={MOONKNIGHT_PORTRAIT}
                      alt="Moon Knight Suit"
                      style={{
                        mixBlendMode: "screen",
                        maskImage: "radial-gradient(ellipse at 50% 44%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 97%)",
                        WebkitMaskImage: "radial-gradient(ellipse at 50% 44%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 97%)",
                      }}
                      className="absolute inset-0 h-full w-full object-contain"
                    />

                    {/* The wrapping edge itself — a bar of moonlight running
                        down the figure, one pass */}
                    <motion.div
                      initial={{ top: "-6%", opacity: 0 }}
                      animate={{ top: ["-6%", "104%"], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], times: [0, 0.12, 0.85, 1] }}
                      className="absolute inset-x-0 h-16 pointer-events-none"
                    >
                      <div className="h-[2px] w-full bg-[#f2efe6] shadow-[0_0_24px_rgba(242,239,230,1),0_0_60px_rgba(242,239,230,0.7)]" />
                      <div className="h-16 w-full bg-gradient-to-b from-[#f2efe6]/22 to-transparent" />
                    </motion.div>

                    {/* Crescent struck behind him as the suit lands */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                      animate={{ opacity: [0, 0.35, 0.16], scale: 1, rotate: 0 }}
                      transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
                      className="absolute left-1/2 top-[34%] -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:h-72 sm:w-72"
                    >
                      <CrescentIcon className="h-full w-full" />
                    </motion.div>

                    {/* Moonlight clinging to the linen */}
                    <motion.div
                      animate={{ opacity: [0.18, 0.42, 0.22] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_32%,rgba(242,239,230,0.2)_0%,transparent_60%)]"
                    />

                    {/* Khonshu takes the credit */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.7 }}
                      className="mk-cartouche absolute bottom-[5%] right-[2%] px-3 py-1.5 text-[10px] tracking-[0.18em] sm:text-[11px] pointer-events-none"
                    >
                      I Chose Him
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Venom: the symbiote takes hold.
                  The portrait is a transparent PNG now, so it composites
                  normally — a screen blend would wash the black suit out
                  against the void. The reveal is an organic clip-path spread
                  from the chest outward rather than a wipe. */}
              <AnimatePresence>
                {isVenom && (
                  <motion.div
                    key="venom-portrait"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-start-1 row-start-1 z-20 relative"
                  >
                    {/* Invisible sizer: fixes the box so the overlays align */}
                    <img
                      src={VENOM_PORTRAIT}
                      alt=""
                      aria-hidden
                      className="block w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain opacity-0 pointer-events-none"
                    />

                    <motion.img
                      initial={{ clipPath: VENOM_SPREAD[0], filter: "grayscale(1) contrast(1.5) brightness(0.7)" }}
                      animate={{
                        clipPath: VENOM_SPREAD,
                        filter: [
                          "grayscale(1) contrast(1.5) brightness(0.7)",
                          "grayscale(1) contrast(1.35) brightness(0.85)",
                          "grayscale(0.7) contrast(1.18) brightness(0.92)",
                          "grayscale(0.25) contrast(1.08) brightness(1)",
                          "grayscale(0) contrast(1.04) brightness(1)",
                        ],
                      }}
                      exit={{ clipPath: VENOM_SPREAD[0], opacity: 0 }}
                      transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1], times: [0, 0.18, 0.44, 0.72, 1] }}
                      src={VENOM_PORTRAIT}
                      alt="Symbiote Suit"
                      style={{
                        maskImage: "radial-gradient(ellipse at 50% 44%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 97%)",
                        WebkitMaskImage: "radial-gradient(ellipse at 50% 44%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 97%)",
                      }}
                      className="absolute inset-0 h-full w-full object-contain"
                    />

                    {/* Feelers running ahead of the mass */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
                    >
                      {VENOM_FEELERS.map((f) => (
                        <motion.path
                          key={f.d}
                          d={f.d}
                          fill="none"
                          stroke="#0b0b0d"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: [0, 1, 1, 0.15], opacity: [0, 1, 0.8, 0] }}
                          transition={{ duration: 1.7, delay: f.delay, ease: "easeOut", times: [0, 0.4, 0.7, 1] }}
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.95))" }}
                        />
                      ))}
                      {/* Wet highlight riding each feeler */}
                      {VENOM_FEELERS.map((f) => (
                        <motion.path
                          key={"hl-" + f.d}
                          d={f.d}
                          fill="none"
                          stroke="#f4f7fb"
                          strokeWidth="0.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: [0, 1, 1, 0.15], opacity: [0, 0.85, 0.4, 0] }}
                          transition={{ duration: 1.7, delay: f.delay + 0.04, ease: "easeOut", times: [0, 0.4, 0.7, 1] }}
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>

                    {/* Wet sheen crawling over the mass, never still */}
                    <motion.div
                      animate={{ opacity: [0.14, 0.34, 0.18], scale: [1, 1.04, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_42%_32%,rgba(244,247,251,0.2)_0%,transparent_58%)]"
                    />

                    {/* It has opinions */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 2 }}
                      className="venom-chip absolute bottom-[5%] right-[2%] px-3 py-1.5 text-[10px] tracking-[0.16em] sm:text-[11px] pointer-events-none"
                    >
                      We Are Venom
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Thor: summoned by lightning. */}
              <AnimatePresence>
                {isThor && (
                  <motion.div
                    key="thor-portrait"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-start-1 row-start-1 z-20 relative"
                  >
                    <motion.img
                      initial={{ opacity: 0, scale: 1.06, filter: "brightness(2.6) contrast(1.5)" }}
                      animate={{ opacity: 1, scale: 1, filter: "brightness(1.06) contrast(1.06)" }}
                      exit={{ opacity: 0, scale: 1.04, filter: "brightness(2.2)" }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      src={THOR_PORTRAIT}
                      alt="Asgardian Armour"
                      style={{
                        maskImage: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 97%)",
                        WebkitMaskImage: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 97%)",
                      }}
                      className="block w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain"
                    />

                    {/* The bolt that delivered him, striking down the frame */}
                    <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
                      {[38, 62].map((pct, i) => (
                        <motion.path
                          key={pct}
                          d={`M${pct}% 0 L${pct - 5}% 22% L${pct + 4}% 40% L${pct - 3}% 62% L${pct + 2}% 82% L${pct}% 100%`}
                          fill="none"
                          stroke="#e0f2fe"
                          strokeWidth={i === 0 ? 2.5 : 1.6}
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: [0, 1, 0.2, 1, 0] }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.22, ease: "easeOut" }}
                          style={{ filter: "drop-shadow(0 0 9px rgba(125,211,252,1))" }}
                        />
                      ))}
                    </svg>

                    {/* Ambient charge still clinging to the armour */}
                    <motion.div
                      animate={{ opacity: [0.25, 0.6, 0.3] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(125,211,252,0.22)_0%,transparent_62%)]"
                    />

                    {/* Runic inscription along the bottom */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 }}
                      className="thor-plaque absolute bottom-[5%] right-[2%] rounded-md px-3 py-1.5 text-[10px] tracking-[0.2em] sm:text-[11px] pointer-events-none"
                    >
                      Worthy · Since Birth
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Deadpool: he arrives in pieces.
                  Five katana-cut bands fly in from alternating sides and slam
                  together, seams flash white, then the ink pass floods to
                  full colour — the comic gets drawn, cut up and coloured. */}
              <AnimatePresence>
                {isDeadpool && (
                  <motion.div
                    key="deadpool-portrait"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-start-1 row-start-1 z-20 relative"
                  >
                    {/* Invisible sizer: fixes the box so every slice lines up exactly */}
                    <img
                      src={DEADPOOL_PORTRAIT}
                      alt=""
                      aria-hidden
                      className="block w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain opacity-0 pointer-events-none"
                    />

                    {/* Ink → colour pass, applied once so all slices grade together */}
                    <motion.div
                      initial={{ filter: "grayscale(1) contrast(1.8) brightness(1.18)" }}
                      animate={{ filter: "grayscale(0) contrast(1.06) saturate(1.2) brightness(1)" }}
                      transition={{ duration: 0.95, delay: 0.66, ease: "easeOut" }}
                      style={{
                        maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 96%)",
                        WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 96%)",
                      }}
                      className="absolute inset-0 drop-shadow-[0_0_35px_rgba(220,20,60,0.55)]"
                    >
                      {DEADPOOL_SLICES.map((slice, i) => (
                        <motion.img
                          key={slice.clip}
                          src={DEADPOOL_PORTRAIT}
                          alt={i === 0 ? "Deadpool Suit" : ""}
                          aria-hidden={i !== 0}
                          initial={{ x: slice.x, y: slice.y, rotate: slice.r, opacity: 0 }}
                          animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                          exit={{
                            x: slice.x * 0.75,
                            y: slice.y * 0.75,
                            rotate: slice.r,
                            opacity: 0,
                            transition: { duration: 0.4, delay: i * 0.045, ease: "easeIn" },
                          }}
                          transition={{ duration: 0.6, delay: i * 0.085, ease: [0.16, 1, 0.3, 1] }}
                          style={{ clipPath: slice.clip, WebkitClipPath: slice.clip }}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      ))}
                    </motion.div>

                    {/* Seams flash white as each cut closes */}
                    {DEADPOOL_SEAMS.map((top, i) => (
                      <motion.div
                        key={top}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, delay: 0.42 + i * 0.085, ease: "easeOut" }}
                        style={{ top: `${top}%`, rotate: -5 }}
                        className="absolute left-[-6%] h-[2.5px] w-[112%] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_18px_rgba(255,255,255,0.95)] pointer-events-none"
                      />
                    ))}

                    {/* Crimson ink bleeding across the page as the colour lands */}
                    <motion.div
                      initial={{ x: "-115%", opacity: 0.85 }}
                      animate={{ x: "115%", opacity: 0 }}
                      transition={{ duration: 1, delay: 0.62, ease: "easeInOut" }}
                      className="absolute inset-0 pointer-events-none mix-blend-color-dodge bg-gradient-to-r from-transparent via-[#dc143c]/60 to-transparent"
                    />

                    {/* Halftone print dots settling out */}
                    <motion.div
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 1.3, delay: 0.55 }}
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.2px, transparent 1.3px)",
                        backgroundSize: "7px 7px",
                      }}
                    />

                    {/* He has notes */}
                    <motion.div
                      initial={{ opacity: 0, y: 14, rotate: 6 }}
                      animate={{ opacity: 1, y: 0, rotate: 3 }}
                      transition={{ duration: 0.5, delay: 1.6 }}
                      className="dp-caption absolute bottom-[6%] right-[2%] max-w-[11rem] px-2.5 py-1.5 text-[10px] sm:text-[11px] pointer-events-none"
                    >
                      That's him. I just wear the suit better.
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Luffy: no "him as the character" portrait exists for this
                  theme (unlike Deadpool/Thor/Venom/Moon Knight, each of which
                  ships an AI-generated PNG), so rather than fabricate one or
                  fake a photo that isn't there, the hero visual IS the bounty
                  poster itself — the same devices the console and loader
                  already use, scaled up. It drops in and the seal thuds down
                  on top of it, exactly like the loader's opening beat. */}
              <AnimatePresence>
                {isLuffy && (
                  <motion.div
                    key="luffy-portrait"
                    initial={{ opacity: 0, y: -50, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                    exit={{ opacity: 0, y: -30, transition: { duration: 0.35 } }}
                    transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    className="op-poster op-pinned col-start-1 row-start-1 justify-self-center mx-auto z-20 aspect-[3/4] w-auto max-w-[280px] px-5 py-6 sm:max-w-[340px] md:max-w-[400px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)]"
                  >
                    <div className="op-screentone" />

                    <div className="relative z-[2] flex h-full flex-col items-center text-center">
                      <div className="op-masthead text-2xl sm:text-3xl md:text-4xl">Wanted</div>
                      <div className="op-label mt-1 text-[9px] sm:text-[10px]">Dead or Alive</div>
                      <div className="mt-2 h-[2px] w-full max-w-[85%] bg-[var(--l-ink)]" />

                      <div className="relative mt-4 flex flex-1 w-full items-center justify-end overflow-hidden border-2 border-[var(--l-ink)] bg-[rgba(36,26,16,0.05)]">
                        <div className="op-speed" />
                        <img
                          src="/luffyme_nobg.png"
                          alt="Luffy"
                          className="relative z-[2] h-full w-full object-cover object-top"
                          style={{ filter: "sepia(0.15) contrast(1.05)" }}
                        />
                      </div>

                      <h3 className="op-masthead mt-3 text-lg sm:text-xl md:text-2xl">
                        {personal.name}
                      </h3>
                      <div className="op-bounty mt-1 text-sm sm:text-base md:text-lg">
                        Ƀ1,500,000,000
                      </div>
                    </div>

                    {/* The seal, thudding down after the poster lands */}
                    <motion.div
                      initial={{ scale: 2.2, opacity: 0, rotate: -13 }}
                      animate={{ scale: 1, opacity: 0.82, rotate: -13 }}
                      transition={{ duration: 0.35, delay: 0.55, ease: "easeOut" }}
                      className="op-stamp absolute -bottom-3 -right-3 flex h-14 w-14 flex-col items-center justify-center text-center text-[6px] leading-tight sm:h-16 sm:w-16 sm:text-[7px] pointer-events-none"
                    >
                      <span>Marine</span>
                      <span className="text-[8px] sm:text-[9px]">認可</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pixel Grid Wave - Masked strictly to the PNG subject silhouette */}
              <AnimatePresence>
                {isSpiderman && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.5, duration: 0.3 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(25, 1fr)",
                      gridTemplateRows: "repeat(25, 1fr)",
                      maskImage: "url(/spiderman_nomask.png)",
                      WebkitMaskImage: "url(/spiderman_nomask.png)",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                    className="col-start-1 row-start-1 z-30 w-full h-full pointer-events-none"
                  >
                    {Array.from({ length: 625 }).map((_, idx) => {
                      const row = Math.floor(idx / 25); // 0 (top) to 24 (bottom)
                      const col = idx % 25;
                      // Bottom row (row 24) activates first, working upwards to top row (row 0)
                      const rowDelay = (24 - row) * 0.045;
                      const jitter = (col % 4) * 0.012;
                      const delay = rowDelay + jitter;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.05, 0.9],
                            backgroundColor: ["rgba(239, 68, 68, 0.95)", "rgba(59, 130, 246, 0.95)", "rgba(255, 255, 255, 0)"]
                          }}
                          transition={{
                            duration: 0.2,
                            delay: delay,
                            ease: "easeOut"
                          }}
                          className="border border-red-500/40 bg-red-600/30"
                        />
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Left Eye Flare & Laser */}
            {isFunMode && !isSpiderman && !isDeadpool && !isThor && !isVenom && !isMoonKnight && !isLuffy && (
              <div
                style={{ top: `${(pupilPos.leftY * 100).toFixed(1)}%`, left: `${(pupilPos.leftX * 100).toFixed(1)}%` }}
                className={`absolute z-30 pointer-events-none transition-all duration-300 ease-out ${
                  isAdjustingLasers ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 delay-75"
                }`}
              >
                <div className={`absolute -left-3 -top-3 sm:-left-4 sm:-top-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full blur-[2px] flex items-center justify-center animate-pulse ${currentTheme.flare}`}>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
                </div>

                <div
                  style={{
                    left: "8px",
                    width: `${Math.max(0, laserTargets.left.length - 8)}px`,
                    transform: `rotate(${laserTargets.left.angle}deg)`,
                  }}
                  className={`absolute top-0 h-[6px] sm:h-[8px] -mt-[3px] sm:-mt-[4px] bg-gradient-to-r origin-left transition-all duration-300 ${currentTheme.beam}`}
                />
                <div
                  style={{
                    left: "8px",
                    width: `${Math.max(0, laserTargets.left.length - 8)}px`,
                    transform: `rotate(${laserTargets.left.angle}deg)`,
                  }}
                  className={`absolute top-0 h-[16px] sm:h-[22px] -mt-[8px] sm:-mt-[11px] bg-gradient-to-r origin-left blur-md ${currentTheme.glow}`}
                />
              </div>
            )}

            {/* Right Eye Flare & Laser */}
            {isFunMode && !isSpiderman && !isDeadpool && !isThor && !isMoonKnight && !isLuffy && (
              <div
                style={{ top: `${(pupilPos.rightY * 100).toFixed(1)}%`, left: `${(pupilPos.rightX * 100).toFixed(1)}%` }}
                className={`absolute z-30 pointer-events-none transition-all duration-300 ease-out ${
                  isAdjustingLasers ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 delay-100"
                }`}
              >
                <div className={`absolute -left-3 -top-3 sm:-left-4 sm:-top-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full blur-[2px] flex items-center justify-center animate-pulse ${currentTheme.flare}`}>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
                </div>

                <div
                  style={{
                    left: "8px",
                    width: `${Math.max(0, laserTargets.right.length - 8)}px`,
                    transform: `rotate(${laserTargets.right.angle}deg)`,
                  }}
                  className={`absolute top-0 h-[6px] sm:h-[8px] -mt-[3px] sm:-mt-[4px] bg-gradient-to-r origin-left transition-all duration-300 ${currentTheme.beam}`}
                />
                <div
                  style={{
                    left: "8px",
                    width: `${Math.max(0, laserTargets.right.length - 8)}px`,
                    transform: `rotate(${laserTargets.right.angle}deg)`,
                  }}
                  className={`absolute top-0 h-[16px] sm:h-[22px] -mt-[8px] sm:-mt-[11px] bg-gradient-to-r origin-left blur-md ${currentTheme.glow}`}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="lg:hidden absolute right-[5%] top-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
export default HeroSection;
