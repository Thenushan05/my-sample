import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VenomSpiderIcon } from "../ui/VenomSpiderIcon";

interface VenomLoaderProps {
  onComplete: () => void;
}

const WHISPERS = [
  "Something is moving…",
  "It found the host…",
  "Bonding…",
  "We are Venom.",
];

/** Tendrils clawing in from the edges toward the centre. */
const CLAWS = Array.from({ length: 14 }, (_, i) => ({
  rot: (360 / 14) * i,
  delay: 0.1 + (i % 7) * 0.12,
  len: 40 + ((i * 29) % 26),
}));

export const VenomLoader: React.FC<VenomLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [whisperIdx, setWhisperIdx] = useState(0);

  useEffect(() => {
    const whisperTimer = window.setInterval(() => {
      setWhisperIdx((i) => Math.min(i + 1, WHISPERS.length - 1));
    }, 700);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 600);
    }, 2800);

    return () => {
      clearInterval(whisperTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="venom-loader"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-white"
        >
          {/* Mass welling up from every edge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.05)_62%,rgba(255,255,255,1)_100%)]"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10 blur-[120px]" />

          {/* Tendrils reaching for the centre */}
          <svg
            viewBox="-100 -100 200 200"
            className="pointer-events-none absolute h-[74vw] w-[74vw] max-h-[720px] max-w-[720px] overflow-visible"
          >
            {CLAWS.map((claw) => (
              <motion.path
                key={claw.rot}
                d={`M0 -100L6 -${claw.len + 34}L-5 -${claw.len + 14}L3 -${claw.len}`}
                fill="none"
                stroke="url(#venom-claw)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`rotate(${claw.rot})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0.85] }}
                transition={{ duration: 1.5, delay: claw.delay, ease: "easeOut" }}
              />
            ))}
            <defs>
              <linearGradient id="venom-claw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="black" />
                <stop offset="60%" stopColor="rgba(0,0,0,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
              </linearGradient>
            </defs>
          </svg>

          {/* The emblem forming out of the mass */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, filter: "blur(14px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-32 w-32 items-center justify-center md:h-44 md:w-44"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [-2.5, 2.5, -2.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full text-black"
            >
              <VenomSpiderIcon className="h-full w-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
            </motion.div>
          </motion.div>

          {/* Bond meter */}
          <div className="mt-10 w-56 sm:w-72">
            <div
              className="mb-1.5 flex justify-between text-[10px] tracking-[0.28em] text-black/70 font-bold"
              style={{ fontFamily: "'Creepster', cursive" }}
            >
              <span>Bonding</span>
              <span className="text-black">98%</span>
            </div>
            <div className="h-2.5 rounded-full border border-black/30 bg-black/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "98%" }}
                transition={{ duration: 2.7, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-black/80 via-black to-black shadow-[0_0_14px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {/* Whispers */}
          <div className="mt-6 h-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={whisperIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="text-[12px] tracking-[0.3em] text-black font-bold"
                style={{ fontFamily: "'Creepster', cursive" }}
              >
                {WHISPERS[whisperIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VenomLoader;
