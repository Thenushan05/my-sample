import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";

const IDLE_LINES = [
  "Well? Keep scrolling.",
  "I'll wait. I'm immortal.",
  "You stopped. Was it something I said?",
  "Take your time. I'm getting paid either way.",
];

/** How long without scroll input before he stops walking / starts talking. */
const STOP_AFTER_MS = 220;
const BORED_AFTER_MS = 1500;

interface FigureProps {
  walking: boolean;
}

/**
 * Chibi Deadpool, assembled from divs the same way IronManFigure is.
 * Limbs are hinged at the top so they can swing through a walk cycle.
 */
const DeadpoolFigure: React.FC<FigureProps> = ({ walking }) => {
  const legSwing = walking ? [24, -24, 24] : [3, -3, 3];
  const armSwing = walking ? [-22, 22, -22] : [-4, 4, -4];
  const cycle = walking ? 0.52 : 3.4;

  return (
    <motion.div
      animate={{ y: walking ? [0, -2.5, 0] : [0, -1, 0] }}
      transition={{ duration: walking ? cycle / 2 : 2.6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-14 h-24 flex flex-col items-center drop-shadow-[0_6px_16px_rgba(220,20,60,0.75)]"
    >
      {/* Katanas crossed behind him */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 z-0">
        <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
          <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
        </div>
        <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 -rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
          <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
        </div>
      </div>

      {/* Head — reuses the same mask art as the toggle button.
          Cocks to one side when he has nothing better to do. */}
      <motion.div
        animate={{ rotate: walking ? [-2, 2, -2] : [0, -9, 0] }}
        transition={{ duration: walking ? cycle : 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom center" }}
        className="relative z-20 w-7 h-8"
      >
        <DeadpoolMaskIcon className="w-full h-full drop-shadow-[0_0_6px_rgba(220,20,60,0.8)]" />
      </motion.div>

      {/* Torso */}
      <div className="relative z-10 -mt-1 w-9 h-11 rounded-t-lg rounded-b-xl border border-black/50 bg-gradient-to-b from-[#c01128] to-[#7f0d1c] shadow-md">
        <span className="absolute inset-y-1 left-0 w-[7px] rounded-l-lg bg-[#151011]" />
        <span className="absolute inset-y-1 right-0 w-[7px] rounded-r-lg bg-[#151011]" />
        <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 rotate-[24deg] bg-[#2a1f16]" />
        <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 -rotate-[24deg] bg-[#2a1f16]" />
        <span className="absolute bottom-0 inset-x-0 h-2 rounded-b-xl bg-[#3a2a1c] border-t border-black/50" />
        <span className="absolute bottom-[1px] left-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
        <span className="absolute bottom-[1px] right-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
      </div>

      {/* Arms — swing opposite to the legs */}
      {[
        { side: "-left-2", phase: 0 },
        { side: "-right-2", phase: cycle / 2 },
      ].map((arm) => (
        <motion.div
          key={arm.side}
          animate={{ rotate: arm.phase ? armSwing.map((a) => -a) : armSwing }}
          transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className={`absolute top-9 ${arm.side} w-[10px] h-9 rounded-full bg-gradient-to-b from-[#a30f22] to-[#7f0d1c] border border-black/40`}
        >
          <span className="absolute bottom-0 inset-x-0 h-3 rounded-full bg-[#151011]" />
        </motion.div>
      ))}

      {/* Legs — the actual walk cycle */}
      <div className="relative z-10 -mt-1 flex gap-[3px]">
        {[0, 1].map((leg) => (
          <motion.div
            key={leg}
            animate={{ rotate: leg ? legSwing.map((a) => -a) : legSwing }}
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
            className="relative w-[13px] h-9 rounded-b-md bg-gradient-to-b from-[#a30f22] to-[#6d0b18] border border-black/40"
          >
            <span className="absolute bottom-0 inset-x-0 h-3 rounded-b-md bg-[#151011]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Deadpool mode's scroll character.
 *
 * Iron Man flies a sweeping flight path and Spider-Man descends on a web.
 * This one walks the floor of the page: scroll position drives how far along
 * he is, scroll *direction* turns him around, and when you stop scrolling he
 * stops, faces you, and starts complaining about it.
 */
export const DeadpoolMerc: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["-6vw", "92vw"]);

  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState(1);
  const [bored, setBored] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  const stopTimer = useRef(0);
  const boredTimer = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // React bails out when these match, so hammering them on scroll is cheap
    setFacing(delta > 0 ? 1 : -1);
    setWalking(true);
    setBored(false);

    clearTimeout(stopTimer.current);
    clearTimeout(boredTimer.current);
    stopTimer.current = window.setTimeout(() => setWalking(false), STOP_AFTER_MS);
    boredTimer.current = window.setTimeout(() => {
      setLineIdx((i) => (i + 1) % IDLE_LINES.length);
      setBored(true);
    }, BORED_AFTER_MS);
  });

  useEffect(() => {
    // Start bored — nobody has scrolled yet
    boredTimer.current = window.setTimeout(() => setBored(true), BORED_AFTER_MS);
    return () => {
      clearTimeout(stopTimer.current);
      clearTimeout(boredTimer.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-0 w-full h-36 z-[58] pointer-events-none overflow-hidden">
      <motion.div style={{ x }} className="absolute bottom-0">
        {/* He turns to face the reader the moment he stops walking */}
        <motion.div
          animate={{ scaleX: walking ? facing : 1, scale: walking ? 1 : 1.04 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <DeadpoolFigure walking={walking} />
        </motion.div>

        {/* Dust kicked up mid-stride, blood pooled when standing still */}
        <motion.div
          animate={{ opacity: walking ? 0.75 : 0.35, scaleX: walking ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-1 left-1/2 h-[3px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-red-700/70 to-transparent blur-[2px]"
        />

        {/* Standing around long enough? He has opinions. */}
        <AnimatePresence>
          {bored && !walking && (
            <motion.div
              key={lineIdx}
              initial={{ opacity: 0, y: 8, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="dp-caption absolute bottom-[105%] left-1/2 w-max max-w-[13rem] -translate-x-1/4 px-2.5 py-1.5 text-[10px]"
            >
              {IDLE_LINES[lineIdx]}
              {/* bubble tail */}
              <span className="absolute -bottom-[9px] left-4 h-0 w-0 border-l-[10px] border-r-0 border-t-[11px] border-l-transparent border-t-black" />
              <span className="absolute -bottom-[5px] left-[18px] h-0 w-0 border-l-[7px] border-r-0 border-t-[8px] border-l-transparent border-t-[#f5c518]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DeadpoolMerc;
