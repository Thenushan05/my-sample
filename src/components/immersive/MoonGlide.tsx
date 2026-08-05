import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/** How long without scroll input before the glide becomes a hover. */
const SETTLE_MS = 300;

interface FigureProps {
  gliding: boolean;
}

/**
 * Moon Knight in silhouette, built from divs the way IronManFigure is.
 *
 * Rendered as a pure white cut-out rather than a shaded figure: he is passing
 * in front of the moon, so what you'd actually see is the cape's outline
 * against the disc. The only detail that survives is the crescent on his
 * chest and the two eye slits.
 */
const MoonKnightFigure: React.FC<FigureProps> = React.memo(({ gliding }) => {
  // Framer restarts a keyframe animation when the target array is a new
  // reference, so these are memoised — otherwise every parent re-render
  // snaps the cape back to frame one.
  const flow = useMemo(
    () => ({
      // Cape flares wide in the glide, hangs close when hovering
      capeSkew: gliding ? [-9, 9, -9] : [-3, 3, -3],
      capeScale: gliding ? [1, 1.14, 1] : [1, 1.04, 1],
      cycle: gliding ? 1.5 : 4.2,
      bob: gliding ? [0, -4, 0] : [0, -9, 0],
    }),
    [gliding]
  );

  return (
    <motion.div
      animate={{ y: flow.bob }}
      transition={{ duration: flow.cycle, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-24 w-32"
      style={{ filter: "drop-shadow(0 0 14px rgba(242,239,230,0.55))" }}
    >
      {/* Cape, spread into a glide */}
      <motion.div
        animate={{ skewY: flow.capeSkew, scaleX: flow.capeScale }}
        transition={{ duration: flow.cycle, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 20%" }}
        className="absolute left-1/2 top-3 h-16 w-28 -translate-x-1/2"
      >
        {/* Scalloped trailing edge — the silhouette that reads as Moon Knight */}
        <svg viewBox="0 0 120 70" className="h-full w-full">
          <path
            d="M60 0C44 0 26 6 6 20c14 2 22 8 26 16-10 2-18 8-24 18 18-6 30-6 38-2-4 8-6 16-4 26 8-12 16-20 24-24 8 4 16 12 24 24 2-10 0-18-4-26 8-4 20-4 38 2-6-10-14-16-24-18 4-8 12-14 26-16C94 6 76 0 60 0Z"
            fill="#f2efe6"
            opacity="0.94"
          />
        </svg>
      </motion.div>

      {/* Body: hood and shoulders as one mass */}
      <div className="absolute left-1/2 top-4 h-14 w-9 -translate-x-1/2 rounded-t-full bg-[#f8f6f0]" />

      {/* Eye slits — the only break in the silhouette */}
      <span className="absolute left-1/2 top-[1.65rem] h-[3px] w-2 -translate-x-[0.72rem] rotate-[8deg] rounded-full bg-[#05070d]" />
      <span className="absolute left-1/2 top-[1.65rem] h-[3px] w-2 translate-x-[0.1rem] -rotate-[8deg] rounded-full bg-[#05070d]" />

      {/* Crescent struck into the chest */}
      <svg viewBox="0 0 44 44" className="absolute left-1/2 top-[2.7rem] h-5 w-5 -translate-x-1/2">
        <path
          d="M28 5C18.5 8 12 14.6 12 22s6.5 14 16 17c-6.5-4.4-10.5-10.4-10.5-17S21.5 9.4 28 5Z"
          fill="#05070d"
        />
      </svg>

      {/* Arms held out along the cape's leading edge */}
      <div className="absolute left-1/2 top-[2.4rem] h-[6px] w-11 -translate-x-[2.9rem] -rotate-12 rounded-full bg-[#f8f6f0]" />
      <div className="absolute left-1/2 top-[2.4rem] h-[6px] w-11 translate-x-[0.35rem] rotate-12 rounded-full bg-[#f8f6f0]" />

      {/* Legs trailing behind in the glide */}
      <div className="absolute left-1/2 top-[4.3rem] h-[7px] w-9 -translate-x-[1.7rem] rotate-[7deg] rounded-full bg-[#f8f6f0]" />
      <div className="absolute left-1/2 top-[4.8rem] h-[7px] w-9 -translate-x-[1.3rem] rotate-[13deg] rounded-full bg-[#f8f6f0]" />
    </motion.div>
  );
});

MoonKnightFigure.displayName = "MoonKnightFigure";

/**
 * Moon Knight mode's character.
 *
 * The edge lanes are taken — Deadpool has the floor, Spider-Man the right
 * rail, Thor the left margin, Venom the ceiling, Iron Man the open sky. So
 * this one flies THROUGH the backdrop instead of around the content: a white
 * cape silhouette crossing in front of the moon, sitting in the background
 * layer where it can never collide with anything.
 *
 * He glides down-and-across as you scroll, and when you stop he stops falling
 * and just hovers, cape settling.
 */
export const MoonGlide: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();

  // A shallow diagonal across the sky, passing the moon around mid-page
  const x = useTransform(scrollYProgress, [0, 1], ["-14vw", "96vw"]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["6vh", "22vh", "9vh"]);
  // Banks into the descent, levels out as he climbs again
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 9, -5]);

  const [gliding, setGliding] = useState(false);
  const [facing, setFacing] = useState(1);
  const settleTimer = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // setState bails out when the value is unchanged, so hammering these on
    // every scroll frame is cheap after the first
    setFacing(delta > 0 ? 1 : -1);
    setGliding(true);
    clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setGliding(false), SETTLE_MS);
  });

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return (
    <div className="fixed inset-0 z-[2] overflow-hidden pointer-events-none">
      <motion.div style={{ x, y }} className="absolute left-0 top-0 opacity-90">
        <motion.div style={{ rotate: tilt }}>
          <motion.div
            animate={{ scaleX: gliding ? facing : 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <MoonKnightFigure gliding={gliding} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MoonGlide;
