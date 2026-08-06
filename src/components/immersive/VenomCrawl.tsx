import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/** How long without scroll input before he stops and looks at you. */
const STOP_AFTER_MS = 240;

interface FigureProps {
  crawling: boolean;
}

/**
 * Venom, upside down, built from divs the way IronManFigure is.
 *
 * Hanging from the ceiling means gravity runs the other way for him: the
 * head and tongue hang DOWN off the torso, and the four limbs reach UP to
 * grip the surface. Limbs are hinged at the shoulder so they can walk.
 */
const VenomFigure: React.FC<FigureProps> = React.memo(({ crawling }) => {
  // Framer restarts a keyframe animation when the target array is a new
  // reference, so these are memoised — otherwise every parent re-render
  // (facing flip, idle change) snaps the gait back to frame one.
  const gait = useMemo(() => {
    const reach = crawling ? [-26, 26, -26] : [-5, 5, -5];
    return {
      // Diagonal pairs move together, like an actual quadruped
      pairA: reach,
      pairB: reach.map((a) => -a),
      cycle: crawling ? 0.58 : 4,
      bob: crawling ? [0, 3, 0] : [0, 1.5, 0],
      headSway: crawling ? [-4, 4, -4] : [0, 11, 0],
      tongue: crawling ? [0, 4, 0] : [0, 9, 0],
    };
  }, [crawling]);

  return (
    <motion.div
      animate={{ y: gait.bob }}
      transition={{ duration: gait.cycle / 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-24 w-28 drop-shadow-[0_8px_18px_rgba(75,82,89,0.75)]"
    >
      {/* Limbs gripping the ceiling above him. Rendered first so the torso
          overlaps their shoulders. */}
      {[
        { x: "left-2", swing: gait.pairA },
        { x: "left-8", swing: gait.pairB },
        { x: "right-8", swing: gait.pairA },
        { x: "right-2", swing: gait.pairB },
      ].map((limb, i) => (
        <motion.div
          key={i}
          animate={{ rotate: limb.swing }}
          transition={{ duration: gait.cycle, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "bottom center" }}
          className={`absolute bottom-[3.7rem] ${limb.x} h-10 w-[7px] rounded-full bg-gradient-to-t from-black to-black/90`}
        >
          {/* Clawed hand flattened against the surface */}
          <span className="absolute -top-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-full bg-black" />
        </motion.div>
      ))}

      {/* Torso, hanging below the grip line */}
      <div className="absolute bottom-8 left-1/2 h-12 w-14 -translate-x-1/2 rounded-[46%_54%_40%_60%/40%_38%_62%_60%] bg-[radial-gradient(ellipse_at_40%_28%,black_0%,rgba(0,0,0,0.9)_55%,rgba(0,0,0,0.8)_100%)] shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]">
        {/* The white spider, sprawled across the back */}
        <svg viewBox="0 0 40 30" className="absolute inset-x-2 top-2 h-5 w-10 opacity-90">
          <g stroke="white" strokeLinecap="round" fill="white">
            <ellipse cx="20" cy="14" rx="2.4" ry="6" />
            <path d="M17 10C12 7 6 6 1 8" strokeWidth="1.5" fill="none" />
            <path d="M23 10C28 7 34 6 39 8" strokeWidth="1.5" fill="none" />
            <path d="M17 15C13 15 8 17 4 21" strokeWidth="1.3" fill="none" />
            <path d="M23 15C27 15 32 17 36 21" strokeWidth="1.3" fill="none" />
          </g>
        </svg>
      </div>

      {/* Head, hanging down off the torso */}
      <motion.div
        animate={{ rotate: gait.headSway }}
        transition={{ duration: crawling ? gait.cycle : 4.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
        className="absolute bottom-1 left-1/2 h-9 w-9 -translate-x-1/2"
      >
        <div className="relative h-full w-full rounded-[52%_48%_42%_58%/60%_56%_44%_40%] bg-[radial-gradient(ellipse_at_38%_30%,black_0%,rgba(0,0,0,0.95)_60%,rgba(0,0,0,0.9)_100%)]">
          {/* Long white lenses — inverted, because he is upside down */}
          <span className="absolute bottom-[52%] left-[8%] h-[7px] w-[38%] rotate-[18deg] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          <span className="absolute bottom-[52%] right-[8%] h-[7px] w-[38%] -rotate-[18deg] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />

          {/* Teeth across the jaw */}
          <svg viewBox="0 0 36 12" className="absolute bottom-[18%] left-1/2 h-3 w-8 -translate-x-1/2">
            <path
              d="M2 1L6 8L10 1L14 8L18 1L22 8L26 1L30 8L34 1"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tongue, hanging and flicking */}
        <motion.div
          animate={{ rotate: gait.tongue, scaleY: crawling ? 1 : [1, 1.25, 1] }}
          transition={{ duration: crawling ? 1.2 : 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="absolute -bottom-6 left-1/2 h-7 w-[5px] -translate-x-1/2 rounded-b-full bg-gradient-to-b from-black/50 to-white"
        />
      </motion.div>

      {/* Tendrils trailing off the mass */}
      {[
        { pos: "left-4", len: 26, delay: 0 },
        { pos: "left-12", len: 34, delay: 0.5 },
        { pos: "right-6", len: 30, delay: 1 },
      ].map((t) => (
        <motion.span
          key={t.pos}
          animate={{ rotate: [-12, 12, -12], scaleY: [1, 1.15, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: t.delay, ease: "easeInOut" }}
          style={{ transformOrigin: "top center", height: t.len }}
          className={`absolute top-[3.4rem] ${t.pos} w-[3px] rounded-b-full bg-gradient-to-b from-black to-black/0`}
        />
      ))}
    </motion.div>
  );
});

VenomFigure.displayName = "VenomFigure";

/**
 * Venom mode's character.
 *
 * Deadpool owns the floor, Spider-Man the right rail, Thor the left margin,
 * Iron Man the open sky. Venom takes the CEILING — because what he actually
 * does in every book is crawl. He hauls himself along upside down as you
 * scroll, on a proper diagonal quadruped gait, and when you stop he hangs
 * still and turns his head down to look at you.
 */
export const VenomCrawl: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["-8vw", "92vw"]);

  const [crawling, setCrawling] = useState(false);
  const [facing, setFacing] = useState(1);
  const stopTimer = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // setState bails out when the value is unchanged, so hammering these on
    // every scroll frame is cheap after the first
    setFacing(delta > 0 ? 1 : -1);
    setCrawling(true);
    clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => setCrawling(false), STOP_AFTER_MS);
  });

  useEffect(() => () => clearTimeout(stopTimer.current), []);

  return (
    <div className="fixed left-0 top-16 z-[56] h-40 w-full overflow-hidden pointer-events-none">
      <motion.div style={{ x }} className="absolute top-0">
        {/* He turns to face the direction of travel, and squares up to the
            reader the moment he stops */}
        <motion.div
          animate={{ scaleX: crawling ? facing : 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
        >
          <VenomFigure crawling={crawling} />
        </motion.div>

        {/* Residue left on the ceiling where he has been */}
        <motion.div
          animate={{ opacity: crawling ? 0.7 : 0.3, scaleX: crawling ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-1 left-1/2 h-[3px] w-28 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-black to-transparent blur-[2px]"
        />
      </motion.div>
    </div>
  );
};

export default VenomCrawl;
