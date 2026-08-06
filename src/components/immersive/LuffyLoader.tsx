import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrawHatIcon } from "../ui/StrawHatIcon";

interface LuffyLoaderProps {
  onComplete: () => void;
}

/** A crier reading the notice out loud, not a progress message. */
const CRIES = [
  "A new notice, up on the board…",
  "Ink's still wet…",
  "Bounty's climbing…",
  "Set sail.",
];

export const LuffyLoader: React.FC<LuffyLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cryIdx, setCryIdx] = useState(0);

  useEffect(() => {
    const cryTimer = window.setInterval(() => {
      setCryIdx((i) => Math.min(i + 1, CRIES.length - 1));
    }, 650);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 550);
    }, 2600);

    return () => {
      clearInterval(cryTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="luffy-loader"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#f3e3bf]"
        >
          {/* Paper grain, faint */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(150,110,50,0.14)_0%,transparent_60%)]" />

          {/* The notice, dropping and nailing down */}
          <motion.div
            initial={{ y: -60, opacity: 0, rotate: -6 }}
            animate={{ y: 0, opacity: 1, rotate: -1.5 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="op-poster relative w-56 px-5 py-6 sm:w-64"
          >
            <div className="op-screentone" />

            <div className="relative z-[2] text-center">
              <div className="op-masthead text-3xl sm:text-4xl">Wanted</div>
              <div className="op-label mt-1 text-[9px]">Dead or Alive</div>

              <div className="op-burst mx-auto mt-3 flex h-20 w-20 items-center justify-center border-2 border-[var(--l-ink)] sm:h-24 sm:w-24">
                <motion.div
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <StrawHatIcon className="w-14 sm:w-16" />
                </motion.div>
              </div>

              <div className="op-bounty mt-3 text-base sm:text-lg">Ƀ1,500,000,000</div>
            </div>

            {/* The seal, thudding into the corner once the notice has landed */}
            <motion.div
              initial={{ scale: 2.4, opacity: 0, rotate: -13 }}
              animate={{ scale: 1, opacity: 0.82, rotate: -13 }}
              transition={{ duration: 0.35, delay: 0.55, ease: "easeOut" }}
              className="op-stamp absolute -bottom-3 -right-3 flex h-14 w-14 flex-col items-center justify-center text-center text-[6px] leading-tight sm:h-16 sm:w-16 sm:text-[7px]"
            >
              <span>Marine</span>
              <span className="text-[8px] sm:text-[9px]">認可</span>
            </motion.div>
          </motion.div>

          {/* The crier */}
          <div className="mt-10 h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={cryIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="op-label text-[11px] tracking-[0.2em]"
              >
                {CRIES[cryIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LuffyLoader;
