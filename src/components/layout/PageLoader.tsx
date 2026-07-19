import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    const duration = 1200; // 1.2s loading
    const intervalTime = 15;
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
        }, 300); // Small delay to let the fade-out of the progress bar start
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isUnmounted && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none"
          style={{ backgroundColor: isLoaded ? 'transparent' : 'var(--color-bg)' }}
        >
          {/* Ambient glow - fade out on load */}
          <motion.div 
            animate={{ opacity: isLoaded ? 0 : 0.6 }}
            className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" 
          />

          <motion.div 
            layoutId="header-logo"
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            {/* Logo box */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <span className="text-white text-2xl font-bold tracking-tight">TS</span>
            </div>

            <motion.div 
              animate={{ opacity: isLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-1"
            >
              {/* Shining name */}
              <p className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white/30 via-white to-white/30 bg-[length:200%_auto] animate-[shine_2s_linear_infinite] text-[10px] tracking-[0.3em] uppercase font-bold">
                Thenushan Sritharan
              </p>
              <p className="text-white/60 text-xs font-medium mt-1">
                Loading the experience
              </p>
            </motion.div>

            {/* Progress line */}
            <motion.div 
              animate={{ opacity: isLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-[180px] h-[2px] bg-white/5 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
            <motion.span 
              animate={{ opacity: isLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-white/40 text-[10px] font-mono tabular-nums"
            >
              {progress}%
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
