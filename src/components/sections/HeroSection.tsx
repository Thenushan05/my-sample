import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "../../data/personal";
import { Button } from "../ui/Button";
import { ShareButton } from "../ui/ShareButton";
import { Antigravity } from "../immersive/Antigravity";
import profileImage from "../../assets/profile.png";

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

const PRO_TECH_LOGOS = [
  // Farthest Outer Ring = Big Logos (size: "lg") floating right around the halo
  { name: "React", slug: "react", color: "61DAFB", lightColor: "0284C7", size: "lg", pos: "top-[8%] -left-[10%] sm:-left-[14%]" },
  { name: "Java", slug: "java", color: "ED8B00", customUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", size: "lg", pos: "top-[5%] -right-[10%] sm:-right-[14%]" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E", lightColor: "16A34A", size: "lg", pos: "top-[42%] -left-[12%] sm:-left-[16%]" },
  { name: "Next.js", slug: "nextdotjs", color: "ffffff", lightColor: "000000", size: "lg", pos: "top-[38%] -right-[12%] sm:-right-[16%]" },
  { name: "Python", slug: "python", color: "3776AB", size: "lg", pos: "bottom-[15%] -left-[8%] sm:-left-[12%]" },
  { name: "Angular", slug: "angular", color: "DD0031", size: "lg", pos: "bottom-[12%] -right-[8%] sm:-right-[12%]" },
  { name: "Docker", slug: "docker", color: "2496ED", lightColor: "0284C7", size: "lg", pos: "-top-[4%] left-[34%]" },

  // Nearest Inner Ring = Small Logos (size: "sm") floating close near cheeks & shoulders
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
  const [isFunMode, setIsFunMode] = useState(true);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [laserTitleIdx, setLaserTitleIdx] = useState(0);
  const [laserColorIdx, setLaserColorIdx] = useState(0);
  const [typingPhase, setTypingPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  // User-calibrated exact pupil coordinates for profile portrait
  const [pupilPos, setPupilPos] = useState({
    leftX: 0.244,
    leftY: 0.271,
    rightX: 0.381,
    rightY: 0.257,
  });
  const [isAdjustingLasers, setIsAdjustingLasers] = useState(false);
  const [adjustingEye, setAdjustingEye] = useState<"left" | "right">("left");
  const [copyToast, setCopyToast] = useState(false);

  // Reflects the global "Spidey Mode" toggle (html.spiderman) so the portrait can suit up
  const [isSpiderman, setIsSpiderman] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("spiderman")
  );

  useEffect(() => {
    const syncSpiderman = () =>
      setIsSpiderman(document.documentElement.classList.contains("spiderman"));
    syncSpiderman();
    const observer = new MutationObserver(syncSpiderman);
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

    // Exact user-calibrated pupil centers using live pupilPos
    const leftPupilX = imgRect.left + imgRect.width * pupilPos.leftX;
    const leftPupilY = imgRect.top + imgRect.height * pupilPos.leftY;

    const rightPupilX = imgRect.left + imgRect.width * pupilPos.rightX;
    const rightPupilY = imgRect.top + imgRect.height * pupilPos.rightY;

    // Target point is the left-center impact area of our laser typing container
    const targetX = targetRect.left + 24;
    const targetY = targetRect.top + targetRect.height / 2;

    // Calculate left eye vector
    const leftDx = targetX - leftPupilX;
    const leftDy = targetY - leftPupilY;
    const leftLength = Math.hypot(leftDx, leftDy);
    const leftAngle = (Math.atan2(leftDy, leftDx) * 180) / Math.PI;

    // Calculate right eye vector
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
    // Role text rotator
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and blur hero text out as visitor scrolls
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
      {/* Top Right Corner Fun Mode & Laser Calibration Controls */}
      <div className="hidden md:flex absolute top-24 right-4 md:top-28 md:right-8 z-40 items-center gap-2 sm:gap-3">
        {/* 
        {isFunMode && (
          <button
            onClick={() => {
              const nextState = !isAdjustingLasers;
              setIsAdjustingLasers(nextState);
              if (nextState) setIsLaserActive(true);
            }}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer select-none backdrop-blur-md ${
              isAdjustingLasers
                ? "bg-fuchsia-950/90 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-105 ring-2 ring-fuchsia-400/50"
                : "bg-white/90 dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-purple-500 hover:text-purple-400"
            }`}
            title="Adjust exact laser eye positions on your portrait"
          >
            <span className="text-sm">🎯</span>
            <span className="hidden sm:inline">Adjust Laser Eyes</span>
            <span className="sm:hidden">Adjust</span>
          </button>
        )}
        */}

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

      {/* Floating Interactive Laser Calibration Panel (Commented out after calibration)
      <AnimatePresence>
        {isAdjustingLasers && isFunMode && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 sm:right-10 z-[60] w-[320px] sm:w-[380px] bg-neutral-950/95 border-2 border-purple-500/70 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(168,85,247,0.5)] backdrop-blur-2xl text-white flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 text-purple-300">
                  <span>🎯</span> Laser Pupil Calibration
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Click directly on your image or use sliders to fit laser right on your eyes!
                </p>
              </div>
              <button
                onClick={() => setIsAdjustingLasers(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close Calibration"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setAdjustingEye("left")}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adjustingEye === "left"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>🟢</span> Left Eye (Eye 1)
              </button>
              <button
                onClick={() => setAdjustingEye("right")}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adjustingEye === "right"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>🔵</span> Right Eye (Eye 2)
              </button>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-2.5 text-center">
              <span className="text-xs text-purple-300 font-medium animate-pulse">
                👆 Active: Click directly on the {adjustingEye === "left" ? "🟢 LEFT Eye" : "🔵 RIGHT Eye"} on your portrait to set exact position!
              </span>
            </div>

            <div className="flex flex-col gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Horizontal (X %):</span>
                <span className="text-purple-400 font-mono">
                  {(pupilPos[adjustingEye === "left" ? "leftX" : "rightX"] * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={Math.round(pupilPos[adjustingEye === "left" ? "leftX" : "rightX"] * 1000)}
                onChange={(e) => {
                  const val = Number(e.target.value) / 1000;
                  const newPos = { ...pupilPos, [adjustingEye === "left" ? "leftX" : "rightX"]: val };
                  setPupilPos(newPos);
                  localStorage.setItem("custom_laser_pupils", JSON.stringify(newPos));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mt-1">
                <span>Vertical (Y %):</span>
                <span className="text-purple-400 font-mono">
                  {(pupilPos[adjustingEye === "left" ? "leftY" : "rightY"] * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={Math.round(pupilPos[adjustingEye === "left" ? "leftY" : "rightY"] * 1000)}
                onChange={(e) => {
                  const val = Number(e.target.value) / 1000;
                  const newPos = { ...pupilPos, [adjustingEye === "left" ? "leftY" : "rightY"]: val };
                  setPupilPos(newPos);
                  localStorage.setItem("custom_laser_pupils", JSON.stringify(newPos));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  const codeToCopy = JSON.stringify(pupilPos, null, 2);
                  navigator.clipboard?.writeText(codeToCopy);
                  setCopyToast(true);
                  setTimeout(() => setCopyToast(false), 2500);
                }}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📋 Copy Exact Positions ({copyToast ? "Copied!" : "JSON"})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const defaults = { leftX: 0.268, leftY: 0.252, rightX: 0.381, rightY: 0.245 };
                    setPupilPos(defaults);
                    localStorage.setItem("custom_laser_pupils", JSON.stringify(defaults));
                  }}
                  className="py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  🔄 Reset Default
                </button>
                <button
                  onClick={() => setIsAdjustingLasers(false)}
                  className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  ✅ Done & Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      */}

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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
              Available for New Projects
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-name text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-none w-full"
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

            {/* --- LASER IMPACT & TYPING REVEAL TARGET --- */}
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
                  {/* Glowing Laser Impact Core Point */}
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
          className="order-2 lg:order-none relative z-10 flex justify-center items-center shrink-0 group mt-4 lg:mt-8"
          onMouseEnter={updateLaserTargets}
          onMouseLeave={() => setIsLaserActive(false)}
        >
          {/* Pure Radial Glow Behind Portrait (No GPU blur box clipping or drop-shadow squares) */}
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
            {/* Professional Mode Pure Floating PNG Logo Constellation */}
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
                      {/* Light Mode High-Contrast PNG Icon */}
                      <img
                        src={(tech as any).customUrl || `https://cdn.simpleicons.org/${tech.slug}/${(tech as any).lightColor || tech.color}`}
                        alt={tech.name}
                        className={`dark:hidden ${
                          tech.size === "sm"
                            ? "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] group-hover/logo:drop-shadow-[0_0_14px_rgba(2,132,199,0.8)]"
                            : "w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] group-hover/logo:drop-shadow-[0_0_24px_rgba(2,132,199,0.8)]"
                        } object-contain transition-all duration-300`}
                      />
                      {/* Dark Mode Glowing PNG Icon */}
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

            {/* Interactive Click-to-position overlay when adjusting lasers (Commented out after calibration)
            {isAdjustingLasers && isFunMode && (
              <div
                onClick={(e) => {
                  if (!imgRef.current) return;
                  const rect = imgRef.current.getBoundingClientRect();
                  const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                  const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

                  const newPos = {
                    ...pupilPos,
                    [adjustingEye === "left" ? "leftX" : "rightX"]: Number(x.toFixed(3)),
                    [adjustingEye === "left" ? "leftY" : "rightY"]: Number(y.toFixed(3)),
                  };
                  setPupilPos(newPos);
                  localStorage.setItem("custom_laser_pupils", JSON.stringify(newPos));
                }}
                className="absolute inset-0 z-40 cursor-crosshair rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border-2 border-dashed border-purple-400 flex items-center justify-center backdrop-blur-[1px] transition-all"
                title={`Click anywhere to place ${adjustingEye === "left" ? "LEFT (🟢)" : "RIGHT (🔵)"} eye laser target`}
              >
                <div className="bg-black/90 text-purple-300 text-xs font-semibold px-3.5 py-2 rounded-full border border-purple-500/60 shadow-xl pointer-events-none animate-bounce flex items-center gap-2">
                  <span>🎯</span>
                  <span>Click exactly on your {adjustingEye === "left" ? "🟢 LEFT Eye" : "🔵 RIGHT Eye"} to set position!</span>
                </div>
              </div>
            )}
            */}

            <div
              className={`relative z-10 grid grid-cols-1 grid-rows-1 items-center justify-center transition-all duration-700 ${
                isLaserActive && isFunMode ? "scale-105" : "group-hover:scale-105"
              }`}
            >
              {/* Base Profile Image */}
              <motion.img
                ref={imgRef}
                src={profileImage}
                alt={personal.name}
                animate={{ opacity: isSpiderman ? 0 : 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                style={{
                  maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                  WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                }}
                className="col-start-1 row-start-1 relative z-10 w-auto h-auto max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] max-h-[52vh] sm:max-h-[60vh] md:max-h-[66vh] lg:max-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)] object-contain"
              />

              {/* Suit Up Overlay - Exact same size as base image */}
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
            {isFunMode && !isSpiderman && (
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
            {isFunMode && !isSpiderman && (
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
