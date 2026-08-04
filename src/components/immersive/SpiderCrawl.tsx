import React from "react";
import { motion } from "framer-motion";

const SwingingSpiderman: React.FC = () => {
  return (
    <div className="relative w-16 h-24 flex flex-col items-center drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] -mt-2">
      {/* Hands holding the web at the top */}
      <div className="absolute -top-1 w-5 h-4 bg-red-600 rounded-full z-30" />
      
      {/* Arms connecting hands to body */}
      <div className="absolute top-0 -left-1 w-3 h-10 bg-red-600 rounded-full origin-top rotate-[25deg] z-10" />
      <div className="absolute top-0 -right-1 w-3 h-10 bg-red-600 rounded-full origin-top -rotate-[25deg] z-10" />

      {/* Head */}
      <div className="absolute top-5 w-8 h-9 bg-red-600 rounded-b-[45%] rounded-t-[40%] z-20 shadow-sm border-2 border-black/30 overflow-hidden flex justify-center">
        {/* Eyes */}
        <div className="absolute left-1 top-2.5 w-2.5 h-3.5 bg-white rounded-full rotate-[25deg] border border-black" />
        <div className="absolute right-1 top-2.5 w-2.5 h-3.5 bg-white rounded-full -rotate-[25deg] border border-black" />
      </div>
      
      {/* Body */}
      <div className="absolute top-[42px] w-10 h-10 bg-blue-700 rounded-[40%] z-10 shadow-sm border border-black/30 overflow-hidden">
        {/* Red chest block */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full bg-red-600" />
        {/* Spider logo */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
      </div>
      
      {/* Legs swinging dynamically */}
      <motion.div 
        animate={{ rotateZ: [-10, 10, -10] }} 
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[75px] left-0 w-3.5 h-12 bg-blue-700 rounded-full origin-top rotate-[15deg] z-0 overflow-hidden"
      >
         {/* Red boots */}
         <div className="absolute bottom-0 w-full h-5 bg-red-600" />
      </motion.div>
      <motion.div 
        animate={{ rotateZ: [10, -10, 10] }} 
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[75px] right-0 w-3.5 h-12 bg-blue-700 rounded-full origin-top -rotate-[15deg] z-0 overflow-hidden"
      >
         {/* Red boots */}
         <div className="absolute bottom-0 w-full h-5 bg-red-600" />
      </motion.div>
    </div>
  );
};

export const SpiderCrawl: React.FC = () => {
  return (
    <div className="fixed top-0 left-[20%] md:left-[30%] w-0 h-0 z-[60] pointer-events-none">
      <motion.div
        initial={{ rotateZ: -60 }}
        animate={{ rotateZ: 60 }}
        transition={{ 
          duration: 2.8, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center h-[45vh] w-32 -ml-16"
      >
        {/* Web thread stretching from the top of the screen to Spiderman */}
        <div className="w-[1.5px] h-full bg-gradient-to-t from-white/90 to-transparent shadow-[0_0_10px_#ffffff]" />
        
        <SwingingSpiderman />
      </motion.div>
    </div>
  );
};
