import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** How rarely, at minimum, the seal slips. Jittered so it never reads
    as a timed loop. Short on purpose — this is the theme's headline
    moment, not a rare aside, and a first-time visitor who scrolls past
    in under fifteen seconds should still catch it at least once. */
const INTERVAL_MS = 9000;

/** How long the cloak holds before Kurama's chakra recedes. */
const HOLD_MS = 2800;

/** Nine tails, fanned wide — matches the count and spread KonohaBackground's
    giant sky version uses, so the small card flare and the large backdrop
    flourish read as the same creature. */
const TAILS = [-84, -63, -42, -21, 0, 21, 42, 63, 84];

/**
 * The Nine-Tails surfacing — Kurama's chakra cloak flaring around the
 * mark. Third build of this device: the first two passes used muted,
 * translucent tails that read as an abstract smear rather than a fox —
 * direct feedback was that it "didn't look like Nine-Tails" at all. This
 * one draws an actual head (two separate pointed ears, not an ambiguous
 * zigzag) and nine bold, ink-outlined, saturated tails, matching the
 * redesigned backdrop version in KonohaBackground so the small card
 * flare and the large sky flourish are visibly the same creature.
 *
 * Entirely original silhouette work — tail and head shapes built from
 * primitive SVG, not a reproduction of any official design.
 */
export const NarutoKurama: React.FC = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer = 0;
    const fire = () => {
      setActive(true);
      window.setTimeout(() => setActive(false), HOLD_MS);
      timer = window.setTimeout(fire, INTERVAL_MS + Math.random() * 4000);
    };
    // The loader overlay (see NarutoLoader) covers the screen for
    // roughly its own 2.6s duration plus a ~0.55s exit fade — firing
    // sooner than that means the first, highest-impact flare ignites
    // and finishes entirely behind it, unseen. 3.6s clears that with
    // margin.
    timer = window.setTimeout(fire, 3600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1.14 }}
          exit={{ opacity: 0, scale: 1.28, transition: { duration: 0.5, ease: "easeIn" } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        >
          <svg viewBox="0 0 200 200" className="h-[260%] w-[260%] max-w-none overflow-visible">
            {/* The shockwave — a full ring of chakra pressure */}
            <motion.circle
              cx="100"
              cy="88"
              r="36"
              fill="none"
              stroke="rgba(28, 15, 4, 0.4)"
              strokeWidth="2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.8, opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              style={{ transformOrigin: "100px 88px" }}
            />
            <motion.circle
              cx="100"
              cy="88"
              r="36"
              fill="none"
              stroke="rgba(255, 96, 0, 0.6)"
              strokeWidth="1"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.55, opacity: [0, 0.85, 0] }}
              transition={{ duration: 1.15, ease: "easeOut", delay: 0.05 }}
              style={{ transformOrigin: "100px 88px" }}
            />

            {/* Nine tails, fanned wide behind the head — bold saturated
                fill with a dark ink outline and a darker tip, so every
                tail reads as its own shape rather than a colour wash */}
            {TAILS.map((angle, i) => (
              <motion.g
                key={angle}
                initial={{ opacity: 0, scale: 0.55, rotate: angle * 0.4 }}
                animate={{ opacity: 1, scale: 1, rotate: angle }}
                transition={{ duration: 0.55, delay: 0.04 + i * 0.025, ease: "easeOut" }}
                style={{ transformOrigin: "100px 88px" }}
              >
                <path
                  d="M100 88C104 78 108 60 102 34C100 30 98 30 96 34C90 60 94 78 100 88Z"
                  fill="#d43a12"
                  stroke="#2a1006"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path
                  d="M101 46C102 38 100 32 98 30C97 32 96 38 97 46C98 49 100 49 101 46Z"
                  fill="#7a1a08"
                />
              </motion.g>
            ))}

            {/* The head: two distinct pointed ears, then an actual fox
                muzzle — tapered to a point at the nose, not the round
                oval this device shipped with originally (which read as
                a cat, not a fox, per direct feedback). */}
            <motion.g
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              style={{ transformOrigin: "100px 88px" }}
            >
              {[-1, 1].map((side) => (
                <path
                  key={side}
                  d={`M${100 + side * 8} 76L${100 + side * 20} 54L${100 + side * 13} 80Z`}
                  fill="#2a1006"
                  stroke="#150803"
                  strokeWidth="0.6"
                />
              ))}
              <path
                d="M100 62C118 62 128 74 126 88C124 100 112 106 100 114C88 106 76 100 74 88C72 74 82 62 100 62Z"
                fill="#2a1006"
                stroke="#150803"
                strokeWidth="0.6"
              />
              {/* The nose, a dark point at the tip of the snout */}
              <ellipse cx="100" cy="109" rx="2.6" ry="2" fill="#150803" />
            </motion.g>

            {/* Whisker marks, thickened and inked */}
            {[-1, 1].map((side) =>
              [0, 1, 2].map((i) => (
                <motion.line
                  key={`${side}-${i}`}
                  x1={100 + side * 9}
                  y1={87 + i * 3.4}
                  x2={100 + side * 19}
                  y2={86 + i * 3.4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  stroke="#150803"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ))
            )}

            {/* The eyes, gone slit and red — the one saturated colour
                on the whole silhouette */}
            {[-1, 1].map((side) => (
              <motion.ellipse
                key={side}
                cx={100 + side * 7.5}
                cy="82"
                rx="4.2"
                ry="1.7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.32 }}
                fill="#ff2a1f"
                stroke="#150803"
                strokeWidth="0.5"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,42,31,0.9))" }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NarutoKurama;
