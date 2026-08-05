import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MjolnirIcon } from "../ui/MjolnirIcon";

interface ThorLoaderProps {
  onComplete: () => void;
}

const OMENS = [
  "The storm gathers…",
  "Summoning Mjölnir…",
  "Opening the Bifröst…",
  "Asgard answers.",
];

/** A forked bolt path across the loader, generated once per mount. */
const bolt = (x: number) => {
  let d = `M${x},0`;
  for (let i = 1; i <= 9; i++) {
    d += ` L${(x + (Math.random() - 0.5) * 70).toFixed(1)},${(i * 11).toFixed(1)}`;
  }
  return d;
};

export const ThorLoader: React.FC<ThorLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [omenIdx, setOmenIdx] = useState(0);
  const [bolts] = useState(() => [bolt(24), bolt(50), bolt(76)]);

  useEffect(() => {
    const omenTimer = window.setInterval(() => {
      setOmenIdx((i) => Math.min(i + 1, OMENS.length - 1));
    }, 700);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 600);
    }, 2800);

    return () => {
      clearInterval(omenTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="thor-loader"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#04070f]"
        >
          {/* Storm closing in from above */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(125,211,252,0.32)_0%,transparent_60%)]"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[120px]" />

          {/* Bolts striking down toward the hammer */}
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute left-1/2 top-0 h-[52vh] w-[60vw] -translate-x-1/2 overflow-visible"
            preserveAspectRatio="none"
          >
            {bolts.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0.2, 1, 0] }}
                transition={{ duration: 1.1, delay: 0.5 + i * 0.45, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 4px rgba(125,211,252,1))" }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* Mjölnir, hovering and taking the charge */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-32 w-32 items-center justify-center md:h-40 md:w-40"
          >
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <MjolnirIcon className="h-full w-full drop-shadow-[0_0_30px_rgba(125,211,252,0.9)]" />
            </motion.div>

            {/* Rings of charge expanding off the head */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.7], opacity: [0, 0.7, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 + i * 0.55, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-sky-300/70"
              />
            ))}
          </motion.div>

          {/* Charge meter */}
          <div className="mt-10 w-56 sm:w-72">
            <div
              className="mb-1.5 flex justify-between text-[10px] tracking-[0.28em] text-sky-200/70"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span>CHARGE</span>
              <span className="text-[#d4af6a]">ODINFORCE</span>
            </div>
            <div className="h-1.5 rounded-full border border-[#6c552f]/70 bg-black/60">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.7, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#7dd3fc] to-[#f0f9ff] shadow-[0_0_14px_#7dd3fc]"
              />
            </div>
          </div>

          {/* Omens */}
          <div className="mt-6 h-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={omenIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="text-[11px] tracking-[0.3em] text-sky-100/80"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {OMENS[omenIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThorLoader;
