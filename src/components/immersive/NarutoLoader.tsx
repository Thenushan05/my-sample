import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NarutoLoaderProps {
  onComplete: () => void;
}

/** A quiet running commentary, not a progress bar. */
const LINES = [
  "Molding chakra…",
  "Believe it!",
  "Wrong scroll. Try again.",
  "Ready.",
];

export const NarutoLoader: React.FC<NarutoLoaderProps> = ({ onComplete }) => {
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
          key="naruto-loader"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#ffe9b8]"
        >
          {/* A warm wash, the same corner the backdrop's sun sits in */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,106,0,0.16)_0%,transparent_58%)]" />

          {/* A Rasengan forming — three rings spinning inward and
              converging into a solid chakra sphere */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-dashed"
                style={{ borderColor: i % 2 === 0 ? "#145268" : "#8a3208" }}
                initial={{ scale: 1.6 - i * 0.15, opacity: 0, rotate: 0 }}
                animate={{ scale: 1 - i * 0.18, opacity: 0.8, rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 1.4, delay: i * 0.12, ease: "easeOut", rotate: { duration: 2.4, repeat: Infinity, ease: "linear" } }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
              className="absolute inset-[28%] rounded-full"
              style={{
                background: "radial-gradient(circle at 38% 32%, #eaf7ff 0%, rgba(94,200,240,0.95) 32%, rgba(94,200,240,0.25) 68%, transparent 100%)",
                boxShadow: "0 0 30px 10px rgba(94,200,240,0.55)",
              }}
            />
          </div>

          <h1
            className="mt-8 text-4xl sm:text-5xl"
            style={{ fontFamily: "'Anton', sans-serif", color: "#2b1607" }}
          >
            HIDDEN LEAF
          </h1>
          <div className="nt-label mt-1">Believe It</div>

          <div className="mt-8 h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={lineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-[11px] tracking-[0.2em] text-[#7a5530]"
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

export default NarutoLoader;
