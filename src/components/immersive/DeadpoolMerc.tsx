import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";

/**
 * Chibi Deadpool, assembled from divs the same way IronManFigure is —
 * red suit, black side panels, utility belt, twin katanas on his back.
 */
const DeadpoolFigure: React.FC = () => (
  <div className="relative w-14 h-24 flex flex-col items-center drop-shadow-[0_6px_16px_rgba(220,20,60,0.75)]">
    {/* Katanas crossed behind him */}
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 z-0">
      <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
        <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
      </div>
      <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 -rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
        <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
      </div>
    </div>

    {/* Head — reuses the same mask art as the toggle button */}
    <div className="relative z-20 w-7 h-8">
      <DeadpoolMaskIcon className="w-full h-full drop-shadow-[0_0_6px_rgba(220,20,60,0.8)]" />
    </div>

    {/* Torso */}
    <div className="relative z-10 -mt-1 w-9 h-11 rounded-t-lg rounded-b-xl border border-black/50 bg-gradient-to-b from-[#c01128] to-[#7f0d1c] shadow-md">
      {/* Black side panels */}
      <span className="absolute inset-y-1 left-0 w-[7px] rounded-l-lg bg-[#151011]" />
      <span className="absolute inset-y-1 right-0 w-[7px] rounded-r-lg bg-[#151011]" />
      {/* Shoulder straps crossing the chest */}
      <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 rotate-[24deg] bg-[#2a1f16]" />
      <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 -rotate-[24deg] bg-[#2a1f16]" />
      {/* Utility belt + pouches */}
      <span className="absolute bottom-0 inset-x-0 h-2 rounded-b-xl bg-[#3a2a1c] border-t border-black/50" />
      <span className="absolute bottom-[1px] left-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
      <span className="absolute bottom-[1px] right-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
    </div>

    {/* Arms */}
    <div className="absolute top-9 -left-2 w-[10px] h-9 rotate-[26deg] rounded-full bg-gradient-to-b from-[#a30f22] to-[#7f0d1c] border border-black/40">
      <span className="absolute bottom-0 inset-x-0 h-3 rounded-full bg-[#151011]" />
    </div>
    <div className="absolute top-9 -right-2 w-[10px] h-9 -rotate-[26deg] rounded-full bg-gradient-to-b from-[#a30f22] to-[#7f0d1c] border border-black/40">
      <span className="absolute bottom-0 inset-x-0 h-3 rounded-full bg-[#151011]" />
    </div>

    {/* Legs */}
    <div className="relative z-10 -mt-1 flex gap-[3px]">
      {[0, 1].map((leg) => (
        <div
          key={leg}
          className="w-[13px] h-9 rounded-b-md bg-gradient-to-b from-[#a30f22] to-[#6d0b18] border border-black/40"
        >
          <span className="absolute bottom-0 h-3 w-[13px] rounded-b-md bg-[#151011]" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Deadpool mode's scroll character.
 *
 * Iron Man flies a sweeping flight path and Spider-Man descends on a web —
 * this one cartwheels along the floor of the page. Scroll progress drives
 * horizontal travel and a continuous 4-rotation tumble, so scrolling back
 * up literally rewinds the somersault.
 */
export const DeadpoolMerc: React.FC = () => {
  const { scrollYProgress } = useScroll();

  const x = useTransform(scrollYProgress, [0, 1], ["-8vw", "94vw"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1440]);
  // Little hop at each quarter turn so the tumble reads as a cartwheel
  const y = useTransform(
    scrollYProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    [0, -26, 0, -26, 0, -26, 0, -26, 0]
  );

  return (
    <div className="fixed bottom-6 left-0 w-full h-28 z-[58] pointer-events-none overflow-hidden">
      <motion.div style={{ x }} className="absolute bottom-0">
        <motion.div style={{ y }}>
          <motion.div style={{ rotate }} className="origin-center">
            <DeadpoolFigure />
          </motion.div>
        </motion.div>
        {/* Smear of blood he keeps rolling through */}
        <div className="absolute -bottom-1 left-1/2 h-[3px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-red-700/70 to-transparent blur-[2px]" />
      </motion.div>
    </div>
  );
};

export default DeadpoolMerc;
