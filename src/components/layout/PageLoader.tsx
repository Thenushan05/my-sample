import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull } from "lucide-react";


interface PageLoaderProps {
  onComplete: () => void;
}

const BOOT_SEQUENCE = [
  { at: 4, text: "> BIOS: THENUSHAN_SYSTEMS v2.6.0" },
  { at: 16, text: "> Initializing kernel modules..." },
  { at: 30, text: "> Mounting filesystem /home/thenushan..." },
  { at: 44, text: "> Loading GPU drivers [react-three-fiber]..." },
  { at: 58, text: "> Decrypting portfolio_data.json..." },
  { at: 72, text: "> Establishing secure uplink..." },
  { at: 86, text: "> Compiling creativity.module..." },
  { at: 100, text: "> ACCESS GRANTED" },
];

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテト01ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Terminal-style decrypt effect: characters scramble then lock into place left-to-right
const DecryptText: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    let revealed = 0;
    const totalFrames = 22;
    const framesPerReveal = totalFrames / text.length;

    const interval = setInterval(() => {
      frame++;
      revealed = Math.min(text.length, Math.floor(frame / framesPerReveal));

      const next = text
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          if (idx < revealed) return char;
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");

      setDisplay(next);

      if (revealed >= text.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
};

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 15;
    let columns = Math.floor(width / fontSize);
    let drops = new Array(columns).fill(1);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char =
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillStyle = Math.random() > 0.985 ? "#c4ffe0" : "#10b981";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-100"
    />
  );
};

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const duration = 600;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsLoaded(true);
        setTimeout(() => {
          onComplete(); // Immediately pass control so layoutId transition triggers
        }, 400); // Small delay to let the glitch/fade-out play
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Reveal boot log lines as progress crosses each threshold
  useEffect(() => {
    const due = BOOT_SEQUENCE.filter((entry) => progress >= entry.at).map(
      (entry) => entry.text
    );
    setLogs((prev) => (due.length > prev.length ? due : prev));
  }, [progress]);

  return (
    <AnimatePresence>
      {!isUnmounted && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none overflow-hidden bg-black"
        >
          {/* Matrix digital rain background */}
          <motion.div
            animate={{ opacity: isLoaded ? 0 : 0.75 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <MatrixRain />
          </motion.div>



          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: isLoaded ? 0 : 0.5 }}
            className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"
          />

          {/* Scanline overlay for CRT feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* 3D tilted hacker terminal */}
          <motion.div
            animate={{
              opacity: isLoaded ? 0 : 1,
              scale: isLoaded ? 1.02 : 1,
              filter: isLoaded ? "brightness(2) blur(4px)" : "brightness(1) blur(0px)",
            }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-[90vw] max-w-[420px] mb-8"
            style={{ perspective: 1200 }}
          >
            <motion.div
              initial={{ rotateX: 35, rotateY: -8, opacity: 0, y: 40 }}
              animate={{
                rotateX: [6, 3, 6],
                rotateY: [-3, 3, -3],
                opacity: 1,
                y: 0,
              }}
              transition={{
                rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 },
                y: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="rounded-xl bg-black/80 border border-emerald-500/30 shadow-[0_20px_60px_rgba(16,185,129,0.25)] overflow-hidden font-mono"
            >
              {/* Terminal top bar */}
              <div className="bg-[#111]/90 px-3 py-2 flex items-center gap-1.5 border-b border-emerald-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[10px] text-emerald-400/60 tracking-wider">
                  root@thenushan-portfolio: boot
                </span>
              </div>

              {/* Boot log */}
              <div className="p-4 h-[150px] flex flex-col justify-end gap-1 text-[11px] text-emerald-400 leading-relaxed">
                {logs.map((line, idx) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      idx === logs.length - 1 && line === "> ACCESS GRANTED"
                        ? "text-emerald-300 font-bold"
                        : ""
                    }
                  >
                    {line}
                  </motion.div>
                ))}
                <span className="text-white/60 animate-pulse">▋</span>
              </div>

              {/* Progress bar */}
              <div className="px-4 pb-4">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-emerald-500/60 tabular-nums">
                  <span>DECRYPTING</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            layoutId="header-logo"
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            {/* Logo box - hacker HUD terminal glyph */}
            <motion.div
              animate={{
                boxShadow: isLoaded
                  ? "0 0 0px rgba(16,185,129,0)"
                  : [
                      "0 0 15px rgba(16,185,129,0.35)",
                      "0 0 30px rgba(16,185,129,0.7)",
                      "0 0 15px rgba(16,185,129,0.35)",
                    ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 bg-black border border-emerald-500/60 rounded-2xl flex items-center justify-center overflow-hidden"
            >
              {/* Corner brackets */}
              <span className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
              <span className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />

              {/* Scan sweep */}
              <motion.span
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-3 bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent"
              />

              {/* Glitch RGB-split hacker glyph */}
              <span className="relative flex items-center justify-center w-7 h-7">
                <Skull
                  className="absolute -left-[1.5px] top-0 w-7 h-7 text-red-500/60 animate-[glitch-a_2.4s_infinite]"
                  strokeWidth={1.75}
                />
                <Skull
                  className="absolute left-[1.5px] top-0 w-7 h-7 text-cyan-400/60 animate-[glitch-b_2.4s_infinite]"
                  strokeWidth={1.75}
                />
                <Skull className="relative w-7 h-7 text-emerald-400" strokeWidth={1.75} />
              </span>
            </motion.div>

            <motion.div
              animate={{ opacity: isLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-1"
            >
              {/* Decrypting name */}
              <DecryptText
                text="THENUSHAN SRITHARAN"
                className="inline-block text-emerald-400 text-[11px] tracking-[0.3em] uppercase font-bold font-mono"
              />
              <p className="text-emerald-500/50 text-[10px] font-mono mt-1">
                &gt; identity_verified :: loading experience
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
