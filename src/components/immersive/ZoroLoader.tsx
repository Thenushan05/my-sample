import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ZoroLoaderProps {
  onComplete: () => void;
}

/** A quiet running commentary, not a progress bar. */
const LINES = [
  "Sharpening…",
  "Finding the way. Eventually.",
  "Wrong door. Try again.",
  "Ready.",
];

export const ZoroLoader: React.FC<ZoroLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setLineIdx((i) => Math.min(i + 1, LINES.length - 1));
    }, 650);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 550);
    }, 2600);

    return () => {
      clearInterval(lineTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="zoro-loader"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0d0b]"
        >
          {/* A cold wash, the same corner the backdrop's moon sits in */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_16%,rgba(159,180,188,0.12)_0%,transparent_55%)]" />

          {/* Three strokes, drawing themselves in — Santoryu, the same mark
              the console uses as a divider, played once at full size here */}
          <svg viewBox="0 0 200 90" className="h-20 w-44 overflow-visible sm:h-24 sm:w-52">
            {[
              { d: "M20 20L120 8", delay: 0 },
              { d: "M14 45L150 32", delay: 0.14 },
              { d: "M22 70L130 60", delay: 0.28 },
            ].map((s) => (
              <motion.path
                key={s.d}
                d={s.d}
                fill="none"
                stroke="#ececdd"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: s.delay, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 8px rgba(236,236,221,0.6))" }}
              />
            ))}
          </svg>

          <h1
            className="mt-8 text-4xl sm:text-5xl"
            style={{ fontFamily: "'Nanum Brush Script', cursive", color: "#ececdd" }}
          >
            Santoryu
          </h1>
          <div className="zk-label mt-1">Three Sword Style</div>

          <div className="mt-8 h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={lineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-[11px] tracking-[0.2em] text-[#84847c]"
              >
                {LINES[lineIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZoroLoader;
