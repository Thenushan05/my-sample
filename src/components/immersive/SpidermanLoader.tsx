import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpidermanLoaderProps {
  onComplete: () => void;
}

// Simple Spiderweb SVG Spinner
const SpiderWebSpinner = () => (
  <motion.svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    animate={{ rotate: 360 }}
    transition={{ duration: 12, ease: "linear", repeat: Infinity }}
    className="drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
  >
    {/* Radial lines */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={`line-${i}`}
        x1="50" y1="50"
        x2={50 + 45 * Math.cos(angle * Math.PI / 180)}
        y2={50 + 45 * Math.sin(angle * Math.PI / 180)}
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
      />
    ))}
    {/* Concentric polygons */}
    {[12, 26, 42].map((r, i) => (
      <motion.polygon
        key={`poly-${i}`}
        points={[0, 45, 90, 135, 180, 225, 270, 315].map(angle => 
          `${50 + r * Math.cos(angle * Math.PI / 180)},${50 + r * Math.sin(angle * Math.PI / 180)}`
        ).join(" ")}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 + i * 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />
    ))}
  </motion.svg>
);

export const SpidermanLoader: React.FC<SpidermanLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        onComplete();
      }, 600);
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="spidey-simple-loader"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05020a]"
        >
          {/* Subtle Red Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Web Loader Container */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
            <SpiderWebSpinner />
            {/* Glowing Center */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              className="absolute w-2 h-2 bg-white rounded-full drop-shadow-[0_0_10px_#fff]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-12 text-white/50 text-xs font-mono uppercase tracking-[0.3em]"
          >
            Loading PS5 HUD...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpidermanLoader;
