import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** How rarely, at minimum, the technique fires. Jittered so it never
    reads as a timed loop. */
const INTERVAL_MS = 21000;

/** How long the manifestation holds before receding. */
const HOLD_MS = 1700;

/**
 * Santoryu's escalation: Asura. Three faces, six arms, nine blades — the
 * single most iconic image tied to this character, and the one thing
 * this theme was missing entirely; everything else here (the scroll, the
 * cuts, the compass) is texture, this is the actual reason people know
 * his silhouette. It manifests behind the hero mark for a couple of
 * seconds, then recedes — a rare flare rather than a loop, the same
 * restraint every other Zoro mechanic in this project respects (the
 * "getting lost" compass in ZoroOverlay uses the identical jittered-
 * interval shape for the same reason).
 *
 * Entirely original silhouette work — two ghost hoods and six blade
 * glints built from primitive SVG shapes, not a reproduction of any
 * official art.
 */
export const ZoroAshura: React.FC = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer = 0;
    const fire = () => {
      setActive(true);
      window.setTimeout(() => setActive(false), HOLD_MS);
      timer = window.setTimeout(fire, INTERVAL_MS + Math.random() * 9000);
    };
    timer = window.setTimeout(fire, 5000 + Math.random() * 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0, scale: 1.18, transition: { duration: 0.45, ease: "easeIn" } }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        >
          <svg viewBox="0 0 200 200" className="h-[240%] w-[240%] max-w-none overflow-visible">
            {/* The second and third face — ghost hoods either side of the
                real one, the way onlookers describe seeing him gain heads */}
            {[-1, 1].map((side) => (
              <motion.g
                key={side}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: side * 30, opacity: 0.5 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <path
                  d="M100 58C87 58 77 69 77 84C77 97 86 106 100 106C114 106 123 97 123 84C123 69 113 58 100 58Z"
                  fill="rgba(61,220,114,0.22)"
                  stroke="rgba(61,220,114,0.55)"
                  strokeWidth="1"
                  style={{ filter: "blur(1.4px)" }}
                />
              </motion.g>
            ))}

            {/* Six ghost blades fanning out beyond the three real ones —
                the extra arms, implied rather than drawn as limbs */}
            {[-72, -46, -20, 20, 46, 72].map((angle, i) => (
              <motion.line
                key={angle}
                x1="100"
                y1="96"
                x2="100"
                y2="18"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.55, pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.14 + i * 0.025 }}
                stroke="rgba(61,220,114,0.75)"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ transformOrigin: "100px 96px", transform: `rotate(${angle}deg)` }}
              />
            ))}

            {/* A pressure ring, the surge itself */}
            <motion.circle
              cx="100"
              cy="88"
              r="30"
              fill="none"
              stroke="rgba(61,220,114,0.4)"
              strokeWidth="1"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.4, opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              style={{ transformOrigin: "100px 88px" }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZoroAshura;
