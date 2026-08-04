import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IronManFigure: React.FC = () => {
  return (
    <motion.div 
      animate={{ 
        y: [0, -4, 4, 0],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-12 h-20 flex flex-col items-center drop-shadow-[0_5px_15px_rgba(220,38,38,0.7)]"
    >
      {/* Head */}
      <div className="w-5 h-6 bg-red-700 rounded-t-xl rounded-b-md relative z-20 border border-black/20 flex justify-center shadow-inner">
        {/* Gold Faceplate */}
        <div className="w-4 h-5 mt-[2px] bg-yellow-500 rounded-t-lg rounded-b-sm flex flex-col items-center shadow-inner">
           {/* Glowing Eyes */}
           <div className="flex justify-between w-full px-[2px] mt-1.5 gap-[2px]">
             <div className="w-1.5 h-0.5 bg-white shadow-[0_0_6px_#22d3ee,0_0_2px_#22d3ee]" />
             <div className="w-1.5 h-0.5 bg-white shadow-[0_0_6px_#22d3ee,0_0_2px_#22d3ee]" />
           </div>
           {/* Mouth Slit */}
           <div className="w-2 h-0.5 bg-black/40 mt-1" />
        </div>
      </div>
      
      {/* Body */}
      <div className="w-8 h-10 bg-gradient-to-b from-red-600 to-red-800 rounded-t-lg rounded-b-xl -mt-1 relative z-10 flex justify-center items-center shadow-md border border-black/30">
        {/* Arc Reactor */}
        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_15px_#22d3ee,0_0_25px_#22d3ee,inset_0_0_4px_#22d3ee] z-20 border-[0.5px] border-cyan-200/50" />
        
        {/* Gold accents */}
        <div className="absolute top-1 left-1 w-1.5 h-2 bg-yellow-500 rounded-sm rounded-br-xl" />
        <div className="absolute top-1 right-1 w-1.5 h-2 bg-yellow-500 rounded-sm rounded-bl-xl" />
      </div>

      {/* Arms */}
      <div className="absolute top-6 -left-3 w-3 h-9 bg-red-700 rounded-t-full rounded-b-md rotate-[20deg] z-0 flex items-end justify-center shadow-inner">
        {/* Hand Repulsor */}
        <motion.div 
           animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
           transition={{ duration: 0.15, repeat: Infinity }}
           className="w-2.5 h-5 bg-white rounded-b-full shadow-[0_5px_15px_#22d3ee,0_10px_25px_#22d3ee] -mb-3" />
      </div>
      <div className="absolute top-6 -right-3 w-3 h-9 bg-red-700 rounded-t-full rounded-b-md -rotate-[20deg] z-0 flex items-end justify-center shadow-inner">
        {/* Hand Repulsor */}
        <motion.div 
           animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
           transition={{ duration: 0.15, repeat: Infinity, delay: 0.07 }}
           className="w-2.5 h-5 bg-white rounded-b-full shadow-[0_5px_15px_#22d3ee,0_10px_25px_#22d3ee] -mb-3" />
      </div>

      {/* Legs */}
      <div className="flex gap-[2px] -mt-2 relative z-0">
        <div className="w-3.5 h-9 bg-gradient-to-b from-red-800 to-red-900 rounded-b-sm flex items-end justify-center border-b-2 border-yellow-500">
           {/* Boot Thruster */}
           <motion.div 
             animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 0.1, repeat: Infinity }}
             className="w-3 h-8 bg-white rounded-b-full shadow-[0_10px_20px_#22d3ee,0_20px_40px_#22d3ee] -mb-6" />
        </div>
        <div className="w-3.5 h-9 bg-gradient-to-b from-red-800 to-red-900 rounded-b-sm flex items-end justify-center border-b-2 border-yellow-500">
           {/* Boot Thruster */}
           <motion.div 
             animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 0.1, repeat: Infinity, delay: 0.05 }}
             className="w-3 h-8 bg-white rounded-b-full shadow-[0_10px_20px_#22d3ee,0_20px_40px_#22d3ee] -mb-6" />
        </div>
      </div>
    </motion.div>
  );
};

export const IronManFlight: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Extend arrays to 24,000px so he never stops flying on long pages!
  // Changed from 1000px per sweep to 400px per sweep so he comes back much faster
  const scrollRange = Array.from({ length: 61 }, (_, i) => i * 400); 
  
  // y: alternate between 850 (bottom) and -100 (top)
  const yRange = scrollRange.map((_, i) => (i % 2 === 0 ? 850 : -100));
  const y = useTransform(scrollY, scrollRange, yRange);

  // x: sweep across the screen
  const xPattern = ["10vw", "80vw", "10vw", "20vw", "80vw", "10vw", "70vw"];
  const xRange = scrollRange.map((_, i) => xPattern[i % xPattern.length]);
  const xOffset = useTransform(scrollY, scrollRange, xRange);

  // rotateZ: Needs specific turn timings right before/after the 400px marks
  const rotateStops: number[] = [];
  const rotateVals: number[] = [];
  for (let i = 0; i <= 60; i++) {
    const isUpwards = i % 2 === 0;
    // Base angles depending on the x trajectory
    const xStart = xPattern[i % xPattern.length];
    const xEnd = xPattern[(i + 1) % xPattern.length];
    
    // Roughly determine angle based on X movement
    let angle = isUpwards ? 30 : 150;
    if (xStart === "80vw" && xEnd === "10vw") angle = isUpwards ? -30 : -150;
    if (xStart === "10vw" && xEnd === "20vw") angle = isUpwards ? 10 : 170;

    if (i === 0) {
      rotateStops.push(0);
      rotateVals.push(angle);
    } else {
      rotateStops.push(i * 400 - 50);
      rotateVals.push(rotateVals[rotateVals.length - 1]);
      rotateStops.push(i * 400 + 50);
      rotateVals.push(angle);
    }
  }
  const rotateZ = useTransform(scrollY, rotateStops, rotateVals);

  return (
    <motion.div
      style={{ y, x: xOffset }}
      className="fixed top-0 left-0 z-[60] pointer-events-none flex flex-col items-center"
    >
      <motion.div style={{ rotate: rotateZ }}>
        <IronManFigure />
      </motion.div>
    </motion.div>
  );
};
