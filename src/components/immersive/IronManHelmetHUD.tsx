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
      {/* 2. Interactive Targeting Reticle Cursor */}
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
          <div className="absolute inset-0 w-12 h-12 border-2 border-dashed border-red-500 rounded-full opacity-70" />
          {/* Inner Ring */}
          <div className="absolute inset-1 w-10 h-10 border border-amber-400 rounded-full opacity-50 flex items-center justify-center">
            {/* Center dot */}
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]" />
          </div>
          {/* Crosshairs */}
          <div className="absolute inset-0 w-12 h-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-amber-400" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-amber-400" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-amber-400" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-2 bg-amber-400" />
          </div>
        </motion.div>

      {/* 3. Helmet Inside View Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden mix-blend-screen">
        
        {/* Supplied Image as Overlay Frame */}
        <div className="absolute inset-0 opacity-15 mix-blend-screen">
            <img 
              src="/Gemini_Generated_Image_pu6o7vpu6o7vpu6o-Picsart-BackgroundRemover.png" 
              className="w-full h-full object-cover blur-sm" 
              alt="Ironman Frame Background" 
            />
        </div>

        {/* Top Helmet Edge */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ height: '8vh', opacity: 0.8 }}
        >
          <path
            d="M0 0 L1440 0 L1440 30 Q1200 120 720 120 Q240 120 0 30 Z"
            fill="url(#helmetGradTop)"
          />
          <path
            d="M0 30 Q240 120 720 120 Q1200 120 1440 30"
            stroke="url(#edgeGrad)"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="helmetGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c0000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4a0000" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom Helmet Edge */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ height: '10vh', opacity: 0.8 }}
        >
          <path
            d="M0 150 L1440 150 L1440 80 Q1200 0 720 0 Q240 0 0 80 Z"
            fill="url(#helmetGradBottom)"
          />
          <path
            d="M0 80 Q240 0 720 0 Q1200 0 1440 80"
            stroke="url(#edgeGrad)"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="helmetGradBottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2c0000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4a0000" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glowing Eyes reflections */}
        <div className="absolute top-1/4 left-[10%] w-32 h-16 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-[10%] w-32 h-16 bg-cyan-400/10 rounded-full blur-3xl" />

        {/* Edge Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(6,182,212,0.15)] pointer-events-none" />

        {/* Scanlines Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(6, 182, 212, 0.25) 50%)`,
            backgroundSize: '100% 4px',
          }}
        />

        {/* Telemetry Widgets - Left */}
        <div className="absolute top-1/4 left-4 sm:left-12 flex flex-col gap-6 font-mono text-[10px] sm:text-xs text-cyan-400 opacity-80 pointer-events-none">
          {/* Target Lock Info */}
          <div className="flex flex-col gap-1 border-l-2 border-cyan-500/50 pl-2">
            <span className="text-amber-500 font-bold tracking-widest uppercase">Target Lock</span>
            <span>SYSTEM: ONLINE</span>
            <span>FREQ: {Math.floor(Math.random() * 50 + 800)} MHz</span>
            <span>RNG: {Math.floor(Math.random() * 2000 + 5000)} m</span>
          </div>
          
          {/* Power Core */}
          <div className="flex flex-col gap-1 border-l-2 border-cyan-500/50 pl-2 mt-4">
            <span className="text-amber-500 font-bold tracking-widest uppercase">Arc Reactor</span>
            <span>OUTPUT: 3.01 GJ/s</span>
            <span>INTEGRITY: 100%</span>
            <div className="w-32 h-2 mt-1 bg-cyan-900/30 border border-cyan-500/30 p-[1px]">
              <motion.div 
                className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                animate={{ width: ["98%", "100%", "99%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry Widgets - Right */}
        <div className="absolute top-1/4 right-4 sm:right-12 flex flex-col gap-6 font-mono text-[10px] sm:text-xs text-cyan-400 opacity-80 pointer-events-none items-end text-right">
          {/* Environment */}
          <div className="flex flex-col gap-1 border-r-2 border-cyan-500/50 pr-2">
            <span className="text-amber-500 font-bold tracking-widest uppercase">Environment</span>
            <span>ALT: 45,000 FT</span>
            <span>SPD: MACH 3.2</span>
            <span>TEMP: -45°C</span>
          </div>

          {/* AI Status */}
          <div className="flex flex-col gap-1 border-r-2 border-cyan-500/50 pr-2 mt-4">
            <span className="text-amber-500 font-bold tracking-widest uppercase">J.A.R.V.I.S.</span>
            <span>SYNC: OPTIMAL</span>
            <span>DB: CONNECTED</span>
            <div className="flex gap-1 mt-1 justify-end">
              {[1,2,3,4,5].map(i => (
                <motion.div 
                  key={i}
                  className="w-2 h-4 bg-cyan-500/20 border border-cyan-500/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
