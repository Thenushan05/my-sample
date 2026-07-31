import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import spideyGif from "../../assets/27122204d43e88725018ff4ebec3e260.gif";

interface SpidermanLoaderProps {
  onComplete: () => void;
}

// Comic Halftone overlay for that Spider-Verse comic book feel
const HalftoneOverlay: React.FC = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
    style={{
      backgroundImage: `radial-gradient(circle at center, #ffffff 1.5px, transparent 2px)`,
      backgroundSize: '10px 10px'
    }}
  />
);

export const SpidermanLoader: React.FC<SpidermanLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cinematic load timing
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        onComplete();
      }, 800); // Allow exit animations to finish (blur and fade out)
    }, 2800); // 2.8s total cinematic load time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="spidey-cinematic-loader"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05020a] overflow-hidden"
        >
          {/* Dynamic Background Gradients */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Deep Red Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-red-600/40 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
          </motion.div>

          <HalftoneOverlay />

          {/* Central Animated Spider Emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Swinging Container & SVG Spider Draw Animation */}
            <motion.div
              initial={{ rotate: 35, y: -250 }}
              animate={{ rotate: [-20, 15, -8, 4, 0], y: 0 }}
              transition={{
                rotate: { duration: 2.4, ease: "easeInOut" },
                y: { duration: 0.8, ease: "easeOut" }
              }}
              style={{ transformOrigin: "top center" }}
              className="relative flex flex-col items-center"
            >
              {/* Web Strand (from above screen to spider) */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 500 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute bottom-[90%] left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-t from-white/90 to-transparent" 
              />
              
              <div className="relative w-64 h-64 md:w-96 md:h-96 drop-shadow-[0_0_35px_rgba(220,38,38,0.9)] mt-4">
                <img src={spideyGif} alt="Loading..." className="w-full h-full object-contain mix-blend-screen scale-150" />
              </div>
            </motion.div>

            {/* Glitch Identity Text */}
            <div className="mt-8 relative">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase text-center relative z-10"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
              >
                THENUSHAN
              </motion.h1>
              
              {/* Spider-Verse Chromatic Aberration Glitches */}
              <motion.h1
                animate={{ 
                  x: [0, -5, 0, 5, 0],
                  y: [0, 2, 0, -2, 0],
                  opacity: [0, 0.8, 0, 0.8, 0]
                }}
                transition={{ duration: 0.25, repeat: 4, delay: 1.3, repeatDelay: 0.6 }}
                className="absolute top-0 left-0 text-4xl md:text-6xl font-black italic tracking-tighter text-cyan-400 uppercase text-center w-full mix-blend-screen pointer-events-none"
                style={{ transform: "translate(-3px, 2px)" }}
              >
                THENUSHAN
              </motion.h1>
              <motion.h1
                animate={{ 
                  x: [0, 5, 0, -5, 0],
                  y: [0, -2, 0, 2, 0],
                  opacity: [0, 0.8, 0, 0.8, 0]
                }}
                transition={{ duration: 0.25, repeat: 4, delay: 1.35, repeatDelay: 0.6 }}
                className="absolute top-0 left-0 text-4xl md:text-6xl font-black italic tracking-tighter text-red-500 uppercase text-center w-full mix-blend-screen pointer-events-none"
                style={{ transform: "translate(3px, -2px)" }}
              >
                THENUSHAN
              </motion.h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="mt-4 flex items-center gap-4"
            >
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-red-500 rounded-full" />
              <span className="text-red-400 font-bold text-xs tracking-[0.4em] uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                Ready to Swing
              </span>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-red-500 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Web Shoots across screen just before exit to transition into site */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 2.3 }}
            className="absolute top-[45%] left-0 w-full h-[2px] bg-white origin-left z-20 shadow-[0_0_15px_#fff]"
          />
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 2.4 }}
            className="absolute top-0 left-[60%] w-[2px] h-full bg-white origin-top z-20 shadow-[0_0_15px_#fff]"
          />
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 2.45 }}
            className="absolute top-[65%] right-0 w-full h-[3px] bg-red-400 origin-right z-20 shadow-[0_0_20px_#ef4444]"
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpidermanLoader;
