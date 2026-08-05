import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

/**
 * Rune glyphs as line art rather than Unicode — the Runic block isn't
 * reliably installed on Windows or Android and a tofu box would be worse
 * than no rune. Each path fits a 12×20 box.
 */
const STAVE_RUNES = [
  "M2 1v18M2 4l7 4-7 4", // thurisaz — the thorn, Thor's own rune
  "M2 19V1l7 5-7 5M4 11l6 8", // raidho — the ride
  "M1 1l5 9 5-9M6 10v9", // algiz — protection
  "M1 1h10M6 1v18", // tiwaz — the stem
  "M2 19V1l7 4-7 4", // wunjo — joy
  "M1 1l5 7 5-7M1 19l5-7 5 7", // dagaz — the break of day
];

const COUNT = STAVE_RUNES.length;

interface StaveRuneProps {
  d: string;
  index: number;
  charge: MotionValue<number>;
}

/**
 * One rune on the stave. Kept as its own component so all of its
 * useTransform calls sit at the top level of a component body — calling
 * hooks inside a .map() callback violates the rules of hooks even when the
 * array length happens to be constant.
 */
const StaveRune: React.FC<StaveRuneProps> = ({ d, index, charge }) => {
  const from = index / COUNT;
  const to = (index + 1) / COUNT;

  const opacity = useTransform(charge, [from, to], [0.22, 1], { clamp: true });
  const scale = useTransform(charge, [from, to], [0.85, 1], { clamp: true });
  const glow = useTransform(charge, [from, to], [0, 1], { clamp: true });
  const filter = useTransform(
    glow,
    (v) => `drop-shadow(0 0 ${(v * 7).toFixed(1)}px rgba(125,211,252,${(v * 0.95).toFixed(2)}))`
  );
  // The arc below this rune lights as the charge crosses into its band
  const arcOpacity = useTransform(charge, [from, to], [0, 1], { clamp: true });

  return (
    <div className="relative flex h-5 w-3 items-center justify-center">
      {/* Current jumping up from the rune below */}
      {index > 0 && (
        <motion.svg
          viewBox="0 0 8 22"
          width="8"
          height="22"
          style={{ opacity: arcOpacity }}
          className="absolute -top-[22px] overflow-visible"
        >
          <motion.path
            d="M4 22L1 15L6 9L2 2"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="1.2"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 1, 0.35] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.12 }}
            style={{ filter: "drop-shadow(0 0 4px rgba(125,211,252,1))" }}
          />
        </motion.svg>
      )}

      <motion.svg
        viewBox="0 0 12 20"
        width="13"
        height="21"
        style={{ opacity, scale }}
        className="relative z-10 overflow-visible"
      >
        <motion.path
          d={d}
          stroke="#bae6fd"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter }}
        />
      </motion.svg>
    </div>
  );
};

/**
 * Thor mode's scroll device.
 *
 * The other modes put a character on the page — Iron Man flies a sweep,
 * Spider-Man descends on a web, Deadpool walks the floor. This one is an
 * object instead: an Asgardian rune stave pinned to the edge of the viewport
 * that the storm climbs as you read. Current rises up the shaft, each rune
 * ignites as the charge reaches it, and arcs jump between the lit ones.
 */
export const ThorRuneStave: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth the raw scroll so the current climbs rather than snapping
  const charge = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <div className="fixed right-3 top-1/2 z-[57] hidden -translate-y-1/2 flex-col items-center gap-2 pointer-events-none md:flex">
      {/* Bronze cap */}
      <span className="h-2 w-6 rounded-t-sm border border-[#d4af6a]/70 bg-gradient-to-b from-[#d4af6a]/60 to-[#6c552f]/60" />

      <div className="relative flex w-9 flex-col items-center gap-5 rounded-full border border-[#6c552f]/70 bg-[#0b1424]/70 py-4 backdrop-blur-sm">
        {/* Cold shaft */}
        <span className="absolute inset-y-4 left-1/2 w-[2px] -translate-x-1/2 rounded bg-[#6c552f]/45" />
        {/* Live current climbing it */}
        <motion.span
          style={{ scaleY: charge }}
          className="absolute inset-y-4 left-1/2 w-[2px] origin-top -translate-x-1/2 rounded bg-gradient-to-b from-[#f0f9ff] via-[#7dd3fc] to-[#38bdf8] shadow-[0_0_12px_#7dd3fc]"
        />

        {STAVE_RUNES.map((d, i) => (
          <StaveRune key={d} d={d} index={i} charge={charge} />
        ))}
      </div>

      {/* Bronze foot */}
      <span className="h-2 w-6 rounded-b-sm border border-[#d4af6a]/70 bg-gradient-to-t from-[#d4af6a]/60 to-[#6c552f]/60" />
    </div>
  );
};

export default ThorRuneStave;
