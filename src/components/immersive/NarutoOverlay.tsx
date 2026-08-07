import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";

/** Anything worth landing a technique on. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-naruto-target]';

/** What appears when the clones show up uninvited. */
const CLONE_LINES = [
  "Kage Bunshin no Jutsu! ...wait, why two?",
  "More hands, more ramen orders.",
  "Sensei said this was a bad habit.",
  "One of us should probably focus.",
  "Multiply first, think later.",
  "Clones don't do the paperwork either.",
];

/** How often, at minimum, the clones show up. Jittered so it never feels timed. */
const CLONE_INTERVAL_MS = 16000;

/** Jutsu names, shown for an instant on click. */
const JUTSU_NAMES = ["Rasengan!", "Odama Rasengan!", "Shuriken Jutsu!"];

interface Burst {
  id: number;
  x: number;
  y: number;
  name: string;
}

/**
 * Naruto mode's cursor and his one real running gag, staged as a
 * mechanic rather than a line of copy.
 *
 * The cursor itself is a kunai tip that tracks the real pointer exactly
 * — `cursor: none` is set globally, so unlike Zoro's compass companion
 * (which is free to wander because it's a SEPARATE badge, not the only
 * pointer indicator) this one can't afford to drift for effect.
 *
 * A click spins up a Rasengan: a blue-white chakra sphere that flashes
 * at the pointer and dissipates almost immediately — loud but brief,
 * the way the technique actually reads on screen. Separately, on a
 * jittered interval, two translucent Shadow Clones poof into existence
 * beside the cursor for a few seconds with a caption — his own
 * personality played as a mechanic, the same role Zoro's "getting lost"
 * compass plays for him.
 */
export const NarutoOverlay: React.FC = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [grabbing, setGrabbing] = useState(false);

  const [clonesVisible, setClonesVisible] = useState(false);
  const [cloneLine, setCloneLine] = useState(CLONE_LINES[0]);

  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

  // The kunai tracks the pointer with a tight spring — has to stay
  // accurate, so it's a single stage rather than a chained lag.
  const tipX = useSpring(x, { stiffness: 520, damping: 34, mass: 0.4 });
  const tipY = useSpring(y, { stiffness: 520, damping: 34, mass: 0.4 });

  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const tilt = useTransform<number, number>([vx, vy], ([a, b]) => {
    const speed = Math.hypot(a as number, b as number);
    if (speed < 40) return 45;
    return (Math.atan2(b as number, a as number) * 180) / Math.PI + 90;
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setGrabbing(!!el?.closest?.(TARGET_SELECTOR));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  // The running gag: on a jittered interval, the clones show up.
  useEffect(() => {
    let timer = 0;
    const summon = () => {
      const idx = Math.floor(Math.random() * CLONE_LINES.length);
      setCloneLine(CLONE_LINES[idx]);
      setClonesVisible(true);
      window.setTimeout(() => setClonesVisible(false), 3200);
      timer = window.setTimeout(summon, CLONE_INTERVAL_MS + Math.random() * 9000);
    };
    timer = window.setTimeout(summon, 5000 + Math.random() * 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timers = new Set<number>();

    const draw = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.(TARGET_SELECTOR)) return;

      const id = burstId.current++;
      setBursts((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY, name: JUTSU_NAMES[id % JUTSU_NAMES.length] },
      ]);

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 480);
      timers.add(timer);
    };

    window.addEventListener("click", draw);
    return () => {
      window.removeEventListener("click", draw);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <>
      {/* Rasengan bursts */}
      <div className="pointer-events-none fixed inset-0 z-[9997] overflow-hidden">
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              style={{ left: b.x, top: b.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, times: [0, 0.35, 1] }}
            >
              <motion.div
                initial={{ scale: 0.2, rotate: 0 }}
                animate={{ scale: [0.2, 1.15, 1], rotate: 220 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative h-11 w-11 rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #eaf7ff 0%, rgba(94,200,240,0.9) 35%, rgba(94,200,240,0.15) 70%, transparent 100%)",
                  boxShadow: "0 0 22px 6px rgba(94,200,240,0.65)",
                }}
              />
              <div className="nt-label absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[9px] nt-blue">
                {b.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The Shadow Clones, poofing in beside the cursor */}
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        <motion.div style={{ x: tipX, y: tipY }} className="absolute left-0 top-0">
          <AnimatePresence>
            {clonesVisible &&
              [-1, 1].map((side) => (
                <motion.div
                  key={side}
                  initial={{ opacity: 0, scale: 0.4, x: 0 }}
                  animate={{ opacity: 0.6, scale: 1, x: side * 26 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-2 top-2"
                >
                  <svg viewBox="0 0 24 32" className="h-8 w-6" style={{ filter: "drop-shadow(0 0 4px rgba(43,22,7,0.35))" }}>
                    <ellipse cx="12" cy="7" rx="5" ry="5.5" fill="rgba(255,106,0,0.45)" stroke="rgba(43,22,7,0.5)" strokeWidth="0.6" />
                    <path d="M5 30C5 20 7 15 12 15C17 15 19 20 19 30Z" fill="rgba(255,106,0,0.35)" stroke="rgba(43,22,7,0.4)" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* The kunai-tip cursor itself — always accurate to the real pointer */}
      <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
        <motion.div style={{ x: tipX, y: tipY }} className="absolute left-0 top-0">
          <motion.div
            style={{ rotate: tilt }}
            animate={{ scale: grabbing ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            className="-translate-x-1/2 -translate-y-1/2 origin-center"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-[0_0_5px_rgba(255,151,54,0.6)]">
              <path d="M12 2L14.4 9.5L12 13L9.6 9.5Z" fill="#c9d3d6" stroke="#0d0a06" strokeWidth="0.6" />
              <rect x="11.2" y="13" width="1.6" height="6.5" fill="#3a2a1a" stroke="#0d0a06" strokeWidth="0.3" />
              <circle cx="12" cy="20.5" r="1.9" fill="none" stroke="#8a6a3a" strokeWidth="1.1" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Chatter, only while the clones are out */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[9996] max-w-[15rem] sm:max-w-xs">
        <AnimatePresence>
          {clonesVisible && (
            <motion.div
              key={cloneLine}
              initial={{ opacity: 0, y: 10, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.24 }}
              className="nt-tag rounded-sm px-3 py-2 text-[10px] leading-snug sm:text-[11px]"
            >
              {cloneLine}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NarutoOverlay;
