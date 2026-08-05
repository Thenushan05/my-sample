import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import type { MotionValue } from "framer-motion";

/** Anything worth channelling the storm at. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-thor-target]';

/**
 * Runes drawn as line glyphs rather than Unicode — the Runic block isn't
 * reliably present on Windows/Android, and a missing glyph box would be worse
 * than no rune. Each path fits a 10×18 box.
 */
const RUNES = [
  "M2 1v16M2 4l6 4-6 4", // thurisaz
  "M2 17V1l6 5-6 5M4 11l5 6", // raidho
  "M1 1l4 8 4-8M5 9v8", // algiz-ish
  "M1 1h8M5 1v16", // tiwaz stem
  "M2 17V1l6 4-6 4", // wunjo
  "M1 1l4 6 4-6M1 17l4-6 4 6", // dagaz
];

interface Strike {
  id: number;
  x: number;
  y: number;
  /** Jittered polyline from the top of the viewport down to the click. */
  path: string;
}

/** Build a forked bolt path from the sky down to (x, y). */
const boltPath = (x: number, y: number) => {
  let d = `M${x + (Math.random() - 0.5) * 120},0`;
  const steps = Math.max(6, Math.floor(y / 42));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const px = x + (Math.random() - 0.5) * 54 * (1 - t) + (Math.random() - 0.5) * 12;
    const py = y * t;
    d += ` L${px.toFixed(1)},${py.toFixed(1)}`;
  }
  return `${d} L${x},${y}`;
};

const MjolnirCursor: React.FC<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  charged: boolean;
}> = ({ x, y, charged }) => (
  <motion.div className="fixed left-0 top-0 z-[10000] pointer-events-none" style={{ x, y }}>
    <motion.div
      animate={{ rotate: charged ? [-14, -6, -14] : -14, scale: charged ? 1.16 : 1 }}
      transition={{
        rotate: charged
          ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.25 },
        scale: { type: "spring", stiffness: 520, damping: 26 },
      }}
      style={{ transformOrigin: "16px 10px" }}
    >
      <svg width="46" height="58" viewBox="0 0 46 58" className="overflow-visible">
        {/* Handle */}
        <rect x="13" y="20" width="6" height="34" rx="2" fill="#a97f45" stroke="#0b1220" strokeWidth="1" />
        {[26, 32, 38, 44].map((wy) => (
          <rect key={wy} x="12" y={wy} width="8" height="2.2" rx="1" fill="#6b4f2a" />
        ))}
        {/* Head */}
        <rect x="1" y="4" width="30" height="17" rx="2.5" fill="url(#thor-steel)" stroke="#0b1220" strokeWidth="1.6" />
        <rect x="1" y="4" width="6" height="17" fill="#5d6c7e" />
        <rect x="25" y="4" width="6" height="17" fill="#5d6c7e" />
        <rect x="11" y="2.5" width="10" height="20" rx="1.5" fill="none" stroke="#d4af6a" strokeWidth="1.8" />
        {/* Rune on the face */}
        <path d="M16 8v9M16 9.5l3 2-3 2" stroke="#e0f2fe" strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* Live current, only while charged */}
        {charged && (
          <>
            {[
              "M0 22l4 2-3 2.4 4 1.2",
              "M32 22l-4 2 3 2.4-4 1.2",
              "M16 24l-3 4 4 1-2 4",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="#e0f2fe"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ opacity: [0.2, 1, 0.3, 1, 0.2] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.09 }}
                style={{ filter: "drop-shadow(0 0 5px rgba(125,211,252,0.95))" }}
              />
            ))}
          </>
        )}

        <defs>
          <linearGradient id="thor-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7e2ee" />
            <stop offset="55%" stopColor="#9fb0c3" />
            <stop offset="100%" stopColor="#6b7d90" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  </motion.div>
);

export const ThorOverlay: React.FC = () => {
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const [charged, setCharged] = useState(false);
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const [flash, setFlash] = useState(0);
  const strikeId = useRef(0);
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
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 6);

      const el = e.target as Element | null;
      if (el !== lastEl.current) {
        lastEl.current = el;
        setCharged(Boolean(el?.closest?.(TARGET_SELECTOR)));
      }
    };

    /** Click calls the lightning down on the pointer. */
    const handleClick = (e: MouseEvent) => {
      const id = strikeId.current++;
      setStrikes((prev) => [...prev, { id, x: e.clientX, y: e.clientY, path: boltPath(e.clientX, e.clientY) }]);
      setFlash(id + 1); // changing value re-triggers the flash animation
      later(() => setStrikes((prev) => prev.filter((s) => s.id !== id)), 700);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <MjolnirCursor x={cursorX} y={cursorY} charged={charged} />

      {/* Thunder: the whole sky lights up, twice, like a real strike */}
      {flash > 0 && (
        <div
          key={flash}
          className="fixed inset-0 z-[9993] pointer-events-none bg-sky-100"
          style={{ animation: "thor-flash 0.55s ease-out forwards" }}
        />
      )}

      {/* Bolts called down by clicks */}
      <AnimatePresence>
        {strikes.map((strike) => (
          <div key={strike.id} className="fixed inset-0 z-[9994] pointer-events-none">
            <svg className="absolute inset-0 h-full w-full overflow-visible">
              {/* Outer glow, then hot core */}
              <motion.path
                d={strike.path}
                fill="none"
                stroke="rgba(56,189,248,0.5)"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
              <motion.path
                d={strike.path}
                fill="none"
                stroke="#f0f9ff"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 10px rgba(224,242,254,1))" }}
              />
            </svg>

            {/* Ground zero: impact flare + expanding thunder ring */}
            <motion.div
              style={{ left: strike.x, top: strike.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-50 shadow-[0_0_45px_#7dd3fc,0_0_90px_#38bdf8]"
              />
              <motion.div
                initial={{ scale: 0.15, opacity: 0.9 }}
                animate={{ scale: 4.2, opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-200/90 shadow-[0_0_26px_rgba(125,211,252,0.85)]"
              />
              {/* Sparks thrown off the impact */}
              {Array.from({ length: 9 }).map((_, i) => {
                const angle = (360 / 9) * i + (i % 3) * 12;
                const dist = 40 + (i % 4) * 20;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      x: Math.cos((angle * Math.PI) / 180) * dist,
                      y: Math.sin((angle * Math.PI) / 180) * dist,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full bg-sky-100 shadow-[0_0_8px_#7dd3fc]"
                  />
                );
              })}
            </motion.div>
          </div>
        ))}
      </AnimatePresence>

      {/* Rune-cut frame: glyphs down the edges, pulsing with the current */}
      <div className="fixed inset-0 z-[9996] pointer-events-none">
        <div className="absolute inset-3 rounded-lg border border-[#d4af6a]/25 shadow-[inset_0_0_60px_rgba(56,189,248,0.1)]" />

        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className={`absolute ${side === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-6 opacity-45`}
          >
            {RUNES.map((d, i) => (
              <motion.svg
                key={d}
                viewBox="0 0 10 18"
                width="11"
                height="19"
                animate={{ opacity: [0.3, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
              >
                <path
                  d={d}
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 4px rgba(125,211,252,0.9))" }}
                />
              </motion.svg>
            ))}
          </div>
        ))}

        {/* Bifröst shimmer along the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-sky-300/70 to-transparent shadow-[0_0_14px_rgba(125,211,252,0.8)]" />
      </div>
    </>
  );
};

export default ThorOverlay;
