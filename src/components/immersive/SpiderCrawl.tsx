import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const OldSpider: React.FC = () => {
  return (
    <motion.div 
      animate={{ 
        rotateZ: [0, 2, -2, 0],
        scale: [1, 1.02, 0.98, 1]
      }}
      transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
      className="relative w-16 h-16 flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
    >
      {/* Spider Cephalothorax (Head/Body) */}
      <div className="w-4 h-5 bg-blue-800 rounded-full relative z-10 shadow-sm border border-black/30" />
      
      {/* Spider Abdomen (Back) */}
      <div className="w-6 h-8 bg-red-700 rounded-full -mt-2 relative z-20 shadow-sm border border-black/30">
        {/* Pattern on back */}
        <div className="absolute top-2 left-1.5 w-1 h-3 bg-black/40 rounded-full rotate-45" />
        <div className="absolute top-2 right-1.5 w-1 h-3 bg-black/40 rounded-full -rotate-45" />
      </div>

      {/* Legs - Left Side */}
      <motion.div animate={{ rotateZ: [-10, 10, -10] }} transition={{ duration: 0.2, repeat: Infinity }} className="absolute top-2 -left-4 w-6 h-1 bg-red-600 rounded-full origin-right rotate-[20deg]" />
      <motion.div animate={{ rotateZ: [-10, 10, -10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.05 }} className="absolute top-4 -left-5 w-7 h-1 bg-red-600 rounded-full origin-right rotate-[5deg]" />
      <motion.div animate={{ rotateZ: [-10, 10, -10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }} className="absolute top-6 -left-5 w-7 h-1 bg-red-600 rounded-full origin-right rotate-[-15deg]" />
      <motion.div animate={{ rotateZ: [-10, 10, -10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.15 }} className="absolute top-9 -left-4 w-6 h-1 bg-red-600 rounded-full origin-right rotate-[-35deg]" />

      {/* Legs - Right Side */}
      <motion.div animate={{ rotateZ: [10, -10, 10] }} transition={{ duration: 0.2, repeat: Infinity }} className="absolute top-2 -right-4 w-6 h-1 bg-red-600 rounded-full origin-left rotate-[-20deg]" />
      <motion.div animate={{ rotateZ: [10, -10, 10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.05 }} className="absolute top-4 -right-5 w-7 h-1 bg-red-600 rounded-full origin-left rotate-[-5deg]" />
      <motion.div animate={{ rotateZ: [10, -10, 10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }} className="absolute top-6 -right-5 w-7 h-1 bg-red-600 rounded-full origin-left rotate-[15deg]" />
      <motion.div animate={{ rotateZ: [10, -10, 10] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.15 }} className="absolute top-9 -right-4 w-6 h-1 bg-red-600 rounded-full origin-left rotate-[35deg]" />
    </motion.div>
  );
};

export const SpiderCrawl: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Smooth, natural climb/descent animation as user scrolls
  // Every 1200px of scroll, Spider-Man smoothly crawls to bottom (~850px), flips 180 degrees, and climbs back up to top (-100px)
  const y = useTransform(
    scrollY,
    [0, 1200, 2400, 3600, 4800, 6000],
    [-100, 850, -100, 850, -100, 850]
  );

  const rotate = useTransform(
    scrollY,
    [0, 1150, 1250, 2350, 2450, 3550, 3650, 4750, 4850, 5950],
    [0, 0, 180, 180, 0, 0, 180, 180, 0, 0]
  );

  const xOffset = useTransform(scrollY, [0, 300, 600, 900, 1200], [0, 15, -15, 15, 0]);

  return (
    <motion.div
      style={{ y, x: xOffset }}
      className="fixed top-0 right-4 md:right-auto md:left-[85%] left-auto z-[60] pointer-events-none flex flex-col items-center"
    >
      {/* Web thread stretching up to the top of the screen */}
      <div className="w-[2px] h-[100vh] absolute bottom-1/2 bg-gradient-to-t from-red-600/80 via-red-600/40 to-transparent dark:from-white/90 dark:via-white/50 dark:to-transparent shadow-[0_0_10px_rgba(220,38,38,0.8)] dark:shadow-[0_0_10px_#ffffff]" />
      
      <motion.div style={{ rotate }}>
        <OldSpider />
      </motion.div>
    </motion.div>
  );
};
