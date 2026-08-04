import React, { useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";

const WebAnchorSplatSVG: React.FC = () => (
  <div className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none z-10">
    <svg 
      viewBox="0 0 100 50" 
      className="w-24 h-12 overflow-visible filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
    >
      <g stroke="rgba(255, 255, 255, 0.95)" strokeWidth="1.6" strokeLinecap="round">
        <line x1="50" y1="2" x2="5" y2="10" />
        <line x1="50" y1="2" x2="20" y2="28" />
        <line x1="50" y1="2" x2="38" y2="42" />
        <line x1="50" y1="2" x2="50" y2="48" />
        <line x1="50" y1="2" x2="62" y2="42" />
        <line x1="50" y1="2" x2="80" y2="28" />
        <line x1="50" y1="2" x2="95" y2="10" />
        <path d="M 20 14 Q 50 22 80 14" fill="none" strokeWidth="1.2" opacity="0.85" />
        <path d="M 30 25 Q 50 35 70 25" fill="none" strokeWidth="1.2" opacity="0.85" />
        <path d="M 40 35 Q 50 44 60 35" fill="none" strokeWidth="1.2" opacity="0.85" />
      </g>
      <circle cx="50" cy="2" r="4.5" fill="#ffffff" />
    </svg>
  </div>
);

export const SpiderCrawl: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const yPos = useTransform(scrollYProgress, [0, 1], ["10vh", "78vh"]);

  // Hardcoded web alignment coordinates provided by user
  const WEB_OFFSET_X = 6;
  const WEB_OFFSET_Y = -4;

  // Dynamically stretch web line from top anchor directly to Spider-Man's hand (accounting for drag and manual offsets)
  const lineX2 = useMotionTemplate`calc(50% + ${dragX}px + ${WEB_OFFSET_X}px)`;
  const lineY2 = useMotionTemplate`calc(${yPos} + ${dragY}px + ${WEB_OFFSET_Y}px)`;

  return (
    <div className="fixed top-0 right-0 sm:right-4 md:right-8 h-full w-[200px] z-[60] pointer-events-none flex flex-col items-center">
      <WebAnchorSplatSVG />

      {/* Dynamic SVG Web Thread */}
      <svg className="absolute top-0 left-0 w-full h-[100vh] overflow-visible pointer-events-none">
        <defs>
          <linearGradient id="webLineGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
          </linearGradient>
        </defs>
        <motion.line 
          x1="50%" 
          y1="0" 
          x2={lineX2 as any} 
          y2={lineY2 as any} 
          stroke="url(#webLineGlow)"
          strokeWidth="1.8"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
        />
      </svg>

      {/* Invisible spacer to push Spider-Man down by scroll amount */}
      <motion.div style={{ height: yPos }} className="w-full flex-shrink-0" />

      {/* Draggable Clean Spider-Man Character */}
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.5}
        dragConstraints={{ left: -250, right: 250, top: -150, bottom: 300 }}
        dragTransition={{ 
          bounceStiffness: 150, // Higher stiffness for faster snap back
          bounceDamping: 4,     // Low damping for lots of pendulum swinging!
        }}
        whileDrag={{ 
          scale: 1.05,
          cursor: "grabbing"
        }}
        style={{ 
          x: dragX, 
          y: dragY,
          transformOrigin: "top center" 
        }}
        animate={{ 
          rotateZ: [-1.5, 1.5, -1.5], // Restored subtle ambient swing
          y: [-2, 2, -2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="-mt-4 flex flex-col items-center pointer-events-auto cursor-grab select-none group"
      >
        <img
          src="/4576132-middle-Picsart-BackgroundRemover.png"
          alt="Spider-Man Hanging"
          draggable={false}
          className="w-48 sm:w-56 md:w-64 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] transition-transform duration-200 group-hover:scale-105"
        />
        <span className="absolute -bottom-6 text-[10px] uppercase tracking-widest text-white/50 bg-black/60 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Drag Me! 🕸️
        </span>
      </motion.div>
    </div>
  );
};


