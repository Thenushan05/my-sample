import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "ARC REACTOR ....... ONLINE",
  "NANO-PARTICLES .... BONDED",
  "TARGETING ......... CALIBRATED",
  "FLIGHT STAB ....... NOMINAL",
  "WELCOME BACK, SIR.",
];

/**
 * One-shot suit-up sequence played when Iron Man mode is switched on.
 *
 * Mounted keyed on activation so it replays every time the mode is entered,
 * then unmounts itself and leaves the HUD to take over.
 */
export const IronManSuitUp: React.FC = () => {
  const [running, setRunning] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setVisibleLines(i + 1), 380 + i * 190));
    });
    timers.push(window.setTimeout(() => setRunning(false), 2200));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          key="ironman-suitup"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9995] pointer-events-none overflow-hidden"
        >
          {/* Plate-by-plate assembly wash */}
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.35)_0%,rgba(0,0,0,0.92)_70%)]"
          />

          {/* Scan line sweeping the visor top to bottom */}
          <motion.div
            initial={{ y: "-10vh", opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-x-0 h-24"
          >
            <div className="h-[2px] w-full bg-cyan-300 shadow-[0_0_25px_#22d3ee,0_0_60px_#22d3ee]" />
            <div className="h-24 w-full bg-gradient-to-b from-cyan-400/25 to-transparent" />
          </motion.div>

          {/* Iris opening, like the faceplate sealing shut then clearing */}
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(85% at 50% 50%)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 border-[3px] border-cyan-400/25"
          />

          {/* Boot readout */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.28em" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="mb-4 font-mono text-lg sm:text-2xl font-bold uppercase text-cyan-300 drop-shadow-[0_0_18px_rgba(6,182,212,0.9)]"
            >
              Mark LXXXV
            </motion.div>

            <div className="flex flex-col items-start gap-1 font-mono text-[10px] sm:text-xs text-cyan-400/85">
              {BOOT_LINES.slice(0, visibleLines).map((line) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={line.startsWith("WELCOME") ? "text-amber-300 font-bold" : undefined}
                >
                  {line}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IronManSuitUp;
