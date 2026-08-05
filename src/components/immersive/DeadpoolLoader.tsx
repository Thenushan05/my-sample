import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";

interface DeadpoolLoaderProps {
  onComplete: () => void;
}

const LOADING_QUIPS = [
  "Reticulating katanas…",
  "Regenerating limbs, hold on…",
  "Skipping the boring origin story…",
  "Bribing the load balancer with a chimichanga…",
  "Almost there. Look busy.",
];

export const DeadpoolLoader: React.FC<DeadpoolLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [quipIdx, setQuipIdx] = useState(0);

  useEffect(() => {
    const quipTimer = window.setInterval(() => {
      setQuipIdx((i) => (i + 1) % LOADING_QUIPS.length);
    }, 620);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 600);
    }, 2800);

    return () => {
      clearInterval(quipTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="deadpool-loader"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0b0203]"
        >
          {/* Blood pooling up from the bottom of the screen */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            style={{ transformOrigin: "bottom" }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#7f1d1d] via-[#450a0a]/70 to-transparent"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/20 blur-[110px]" />

          {/* The mask heals itself into existence */}
          <div className="relative flex h-32 w-32 items-center justify-center md:h-44 md:w-44">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <DeadpoolMaskIcon className="h-full w-full drop-shadow-[0_0_28px_rgba(220,20,60,0.85)]" />
            </motion.div>

            {/* Katana slash across the mask, twice */}
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.75, delay: 1.1 + i * 0.35, ease: "easeOut" }}
                style={{ rotate: i === 0 ? -38 : 34 }}
                className="absolute h-[3px] w-[150%] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.95)]"
              />
            ))}
          </div>

          {/* Healing factor bar */}
          <div className="mt-10 w-56 sm:w-72">
            <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/70">
              <span>Healing Factor</span>
              <span className="text-yellow-300">∞%</span>
            </div>
            <div className="h-2.5 border-2 border-black bg-black/70">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.7, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#7f1d1d] via-[#dc143c] to-[#ef2b4f]"
              />
            </div>
          </div>

          {/* Sarcastic status line, in the yellow box obviously */}
          <div className="mt-6 h-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={quipIdx}
                initial={{ opacity: 0, y: 6, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="dp-caption px-3 py-1.5 text-[11px]"
              >
                {LOADING_QUIPS[quipIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeadpoolLoader;
