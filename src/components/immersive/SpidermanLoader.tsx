import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface SpidermanLoaderProps {
  onComplete: () => void;
}

export const SpidermanLoader: React.FC<SpidermanLoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    // Show loader for 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.15)_0%,_transparent_70%)] pointer-events-none" />
      
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        className="w-24 h-24 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] relative z-10"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C11.5 3.5 10 5.5 8 6C6 6.5 3.5 5 2 4.5C3.5 7 6 8.5 7.5 9.5C6 11 3.5 12.5 1 13C3 13.5 5.5 13 7 12C6.5 14 4.5 17 2 19C4.5 18.5 7 16.5 8.5 14.5C9.5 16 11 19 12 22C13 19 14.5 16 15.5 14.5C17 16.5 19.5 18.5 22 19C19.5 17 17.5 14 17 12C18.5 13 21 13.5 23 13C20.5 12.5 18 11 16.5 9.5C18 8.5 20.5 7 22 4.5C20.5 5 18 6.5 16 6C14 5.5 12.5 3.5 12 2Z" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col items-center relative z-10"
      >
        <h2 className="text-2xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          Spidey Protocol
        </h2>
        <div className="flex gap-2 mt-4">
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#ffffff]" />
        </div>
      </motion.div>
    </motion.div>
  );
};
