import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const IronManHelmetHUD: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Interactive Targeting Reticle Cursor */}
      <motion.div
        className="fixed z-[10000] pointer-events-none mix-blend-screen"
        animate={{
          x: mousePos.x - 24, // center the 48x48 cursor
          y: mousePos.y - 24,
          rotate: 360,
        }}
        transition={{
          x: { duration: 0 },
          y: { duration: 0 },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        }}
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 w-12 h-12 border-2 border-dashed border-cyan-500 rounded-full opacity-50" />
        {/* Inner Ring */}
        <div className="absolute inset-1 w-10 h-10 border border-cyan-400 rounded-full opacity-30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]" />
        </div>
        {/* Crosshairs */}
        <div className="absolute inset-0 w-12 h-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-400" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-400" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-cyan-400" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-cyan-400" />
        </div>
      </motion.div>

      {/* Minimalistic HUD Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden flex flex-col justify-between p-4 sm:p-8">
        
        {/* Top Corners */}
        <div className="flex justify-between w-full opacity-50">
          <div className="w-16 h-16 border-t-4 border-l-4 border-cyan-500 rounded-tl-2xl" />
          <div className="w-16 h-16 border-t-4 border-r-4 border-cyan-500 rounded-tr-2xl" />
        </div>

        {/* Minimal Telemetry - Left & Right */}
        <div className="flex justify-between w-full opacity-40 font-mono text-[9px] sm:text-[10px] text-cyan-400">
          <div className="flex flex-col gap-1">
            <span>SYS.OP // J.A.R.V.I.S.</span>
            <span>ARC_CORE: 100%</span>
            <span>REPULSOR: STANDBY</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span>TARGETING: ACTIVE</span>
            <span>THREAT: ZERO</span>
            <span>PROTOCOL: OMEGA</span>
          </div>
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between w-full opacity-50">
          <div className="w-16 h-16 border-b-4 border-l-4 border-cyan-500 rounded-bl-2xl" />
          <div className="w-16 h-16 border-b-4 border-r-4 border-cyan-500 rounded-br-2xl" />
        </div>

        {/* Very subtle edge vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(6,182,212,0.1)] pointer-events-none" />
      </div>
    </>
  );
};
