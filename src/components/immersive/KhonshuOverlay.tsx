import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import type { MotionValue } from "framer-motion";

/** Anything worth putting a dart in. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-moon-target]';

/**
 * Khonshu does not converse. He instructs.
 *
 * Every other mode's captions chat with the reader — Deadpool jokes, Venom
 * says "we". The god of the moon only ever gives orders, which is the whole
 * character.
 */
const KHONSHU_COMMANDS = [
  "You will look upon his work.",
  "The moon is watching. So am I.",
  "He does not sleep. Neither do we.",
  "Scroll. I did not ask.",
  "I chose him. You may yet agree.",
  "Every line of it, written under my moon.",
  "There are three of him. All of them ship.",
  "Do not mistake the silence for absence.",
];

/** Hieroglyph line-art in a 14×20 box — drawn, never Unicode. */
const GLYPHS = [
  "M2 2h10M7 2v16M2 18h10", // pillar
  "M2 18V2l10 8-10 8", // wedge
  "M7 3a5 5 0 1 1 0 10a5 5 0 1 1 0-10M7 13v6", // ankh-ish
  "M2 2h10v8H2zM7 10v8", // standard
  "M2 10a5 5 0 0 1 10 0M7 5v13", // reed
  "M2 2l10 16M12 2L2 18", // cross
  "M2 6h10M2 12h10M6 2v16", // grid
  "M12 3a6 6 0 1 0 0 12M12 9H4", // crescent-and-bar
];

interface Dart {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const CrescentCursor: React.FC<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  locked: boolean;
}> = ({ x, y, locked }) => (
  <motion.div className="fixed left-0 top-0 z-[10000] pointer-events-none" style={{ x, y }}>
    <motion.div
      animate={{ scale: locked ? 1.4 : 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 24 }}
      className="relative h-11 w-11"
    >
      {/* The dart itself, always turning slowly */}
      <motion.svg
        viewBox="0 0 44 44"
        animate={{ rotate: locked ? 0 : 360 }}
        transition={
          locked
            ? { duration: 0.3, ease: "easeOut" }
            : { duration: 9, repeat: Infinity, ease: "linear" }
        }
        className="absolute inset-0 h-11 w-11 overflow-visible"
        style={{ filter: "drop-shadow(0 0 6px rgba(242,239,230,0.95))" }}
      >
        {/* Crescent blade, horns drawn to points */}
        <path
          d="M28 5C18.5 8 12 14.6 12 22s6.5 14 16 17c-6.5-4.4-10.5-10.4-10.5-17S21.5 9.4 28 5Z"
          fill="#f2efe6"
        />
        {/* Inner rim-light */}
        <path
          d="M28 5c-6.5 4.4-10.5 10.4-10.5 17S21.5 34.6 28 39"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.9"
        />
      </motion.svg>

      {/* Locked on: the crescent completes into a full moon and a gold
          cartouche ring closes around it */}
      <AnimatePresence>
        {locked && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2efe6] shadow-[0_0_16px_rgba(242,239,230,1)]"
            />
            <motion.svg
              viewBox="0 0 44 44"
              initial={{ opacity: 0, rotate: -40 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 40 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-11 w-11 overflow-visible"
            >
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#c9a227"
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
            </motion.svg>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  </motion.div>
);

export const KhonshuOverlay: React.FC = () => {
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const [locked, setLocked] = useState(false);
  const [darts, setDarts] = useState<Dart[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(true);
  const dartId = useRef(0);
  const lastEl = useRef<Element | null>(null);

  useEffect(() => {
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 22);
      cursorY.set(e.clientY - 22);

      // closest() walks the DOM, so only re-query when the pointer crosses
      // into a different element
      const el = e.target as Element | null;
      if (el !== lastEl.current) {
        lastEl.current = el;
        setLocked(Boolean(el?.closest?.(TARGET_SELECTOR)));
      }
    };

    const handleClick = (e: MouseEvent) => {
      const id = dartId.current++;
      setDarts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, angle: (id * 61) % 360 }]);
      later(() => setDarts((prev) => prev.filter((d) => d.id !== id)), 850);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [cursorX, cursorY]);

  // Khonshu speaks on his own schedule
  useEffect(() => {
    let swapTimer = 0;
    const cycle = window.setInterval(() => {
      setCaptionVisible(false);
      swapTimer = window.setTimeout(() => {
        setLineIdx((i) => (i + 1) % KHONSHU_COMMANDS.length);
        setCaptionVisible(true);
      }, 700);
    }, 9500);
    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimer);
    };
  }, []);

  return (
    <>
      <CrescentCursor x={cursorX} y={cursorY} locked={locked} />

      {/* Darts thrown by clicks */}
      <AnimatePresence>
        {darts.map((dart) => (
          <div
            key={dart.id}
            style={{ left: dart.x, top: dart.y }}
            className="fixed z-[9994] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {/* Three crescents fanning out and spinning away */}
            {[-34, 0, 34].map((spreadDeg, i) => (
              <motion.svg
                key={spreadDeg}
                viewBox="0 0 44 44"
                width="34"
                height="34"
                initial={{ opacity: 0, x: 0, y: 0, rotate: dart.angle, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(((spreadDeg - 90) * Math.PI) / 180) * 78,
                  y: Math.sin(((spreadDeg - 90) * Math.PI) / 180) * 78,
                  rotate: dart.angle + 540,
                  scale: 1,
                }}
                transition={{ duration: 0.62, delay: i * 0.05, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
                style={{ filter: "drop-shadow(0 0 6px rgba(242,239,230,0.95))" }}
              >
                <path
                  d="M28 5C18.5 8 12 14.6 12 22s6.5 14 16 17c-6.5-4.4-10.5-10.4-10.5-17S21.5 9.4 28 5Z"
                  fill="#f2efe6"
                />
              </motion.svg>
            ))}

            {/* Moonlight ring at the point of impact */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f2efe6]/90 shadow-[0_0_22px_rgba(242,239,230,0.85)]"
            />

            {/* A glyph struck into the air where it landed */}
            <motion.svg
              viewBox="0 0 14 20"
              width="16"
              height="23"
              initial={{ opacity: 0, scale: 0.5, y: 6 }}
              animate={{ opacity: [0, 1, 0], scale: 1.15, y: -18 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <path
                d={GLYPHS[dart.id % GLYPHS.length]}
                fill="none"
                stroke="#c9a227"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </motion.svg>
          </div>
        ))}
      </AnimatePresence>

      {/* Moonlight bleeding along the top edge */}
      <div className="fixed left-0 top-0 z-[9997] w-full pointer-events-none">
        <div className="mk-moon-edge mk-glow h-[2px] w-full" />
      </div>

      {/* Inscription frame: glyph columns down both margins */}
      <div className="fixed inset-0 z-[9996] pointer-events-none">
        <div className="absolute inset-3 border border-[#f2efe6]/12 shadow-[inset_0_0_90px_rgba(201,209,220,0.06)]" />

        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className={`absolute ${side === "left" ? "left-5" : "right-5"} top-1/2 hidden -translate-y-1/2 flex-col gap-7 opacity-30 sm:flex`}
          >
            {GLYPHS.map((d, i) => (
              <motion.svg
                key={d}
                viewBox="0 0 14 20"
                width="13"
                height="19"
                animate={{ opacity: [0.35, 1, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
              >
                <path
                  d={d}
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  style={{ filter: "drop-shadow(0 0 4px rgba(201,162,39,0.8))" }}
                />
              </motion.svg>
            ))}
          </div>
        ))}
      </div>

      {/* Khonshu, issuing instructions */}
      <div className="fixed bottom-5 left-4 z-[9998] max-w-[15rem] pointer-events-none sm:left-6 sm:max-w-xs">
        <AnimatePresence mode="wait">
          {captionVisible && (
            <motion.div
              key={lineIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mk-cartouche px-4 py-2 text-[11px] leading-snug sm:text-xs"
            >
              {KHONSHU_COMMANDS[lineIdx]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default KhonshuOverlay;
