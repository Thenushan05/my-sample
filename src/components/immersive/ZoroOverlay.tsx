import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";

/** Anything worth cutting through. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-zoro-target]';

/** What the compass says when it settles on a direction that is, of course, wrong. */
const LOST_LINES = [
  "This way. Definitely.",
  "...that's not where I started, is it.",
  "The crow's nest was THIS direction. Probably.",
  "I don't get lost. The dojo moves.",
  "Wait — which way is the ship?",
  "I was taking the scenic route.",
];

/** How often, at minimum, he loses his way. Jittered so it never feels timed. */
const LOST_INTERVAL_MS = 15000;

/** Quick-draw technique names, shown for an instant on click. */
const IAI_NAMES = ["Ittoryu: Iai", "Nitoryu: Setsu", "Santoryu: Ogi"];

interface Cut {
  id: number;
  x: number;
  y: number;
  angle: number;
  name: string;
}

/**
 * Zoro mode's cursor and his one real character trait, staged as a
 * mechanic rather than a line of copy.
 *
 * The cursor itself is a blade tip that tracks the real pointer exactly —
 * this project's other themes let their cursor companion drift for
 * effect, but replacing the only visible pointer indicator (`cursor:none`
 * is set globally) with something that wanders would actually cost
 * usability, not just charm. So the tracking stays accurate, and the gag
 * lives in a SEPARATE compass badge that trails just behind it: every so
 * often the needle spins hard and settles on a direction that is visibly,
 * comedically wrong, with a caption to match. Nothing about where the
 * real cursor is ever changes.
 *
 * A click is a quick-draw: one straight ink cut flashes at the pointer
 * with a technique name, gone almost as fast as it appeared — restrained,
 * the way his own fights start, unlike Luffy's stretched-out haymaker.
 */
export const ZoroOverlay: React.FC = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [grabbing, setGrabbing] = useState(false);

  const [lost, setLost] = useState(false);
  const [lostLine, setLostLine] = useState(LOST_LINES[0]);
  const [needleAngle, setNeedleAngle] = useState(20);

  const [cuts, setCuts] = useState<Cut[]>([]);
  const cutId = useRef(0);

  // The blade tracks the pointer with a tight spring — this one has to
  // stay accurate, so it's a single stage rather than the chained lag
  // every other theme's cursor companion uses.
  const bladeX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.4 });
  const bladeY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.4 });

  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const tilt = useTransform<number, number>([vx, vy], ([a, b]) => {
    const speed = Math.hypot(a as number, b as number);
    if (speed < 40) return -35;
    return Math.max(-80, Math.min(10, (Math.atan2(b as number, a as number) * 180) / Math.PI));
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

  // The running gag: on a jittered interval, he loses his way.
  useEffect(() => {
    let timer = 0;
    const goLost = () => {
      const idx = Math.floor(Math.random() * LOST_LINES.length);
      setLostLine(LOST_LINES[idx]);
      setNeedleAngle(Math.round(Math.random() * 360));
      setLost(true);
      window.setTimeout(() => setLost(false), 3200);
      timer = window.setTimeout(goLost, LOST_INTERVAL_MS + Math.random() * 9000);
    };
    timer = window.setTimeout(goLost, 5000 + Math.random() * 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timers = new Set<number>();

    const draw = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.(TARGET_SELECTOR)) return;

      const id = cutId.current++;
      setCuts((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          angle: (id * 47) % 180 - 90,
          name: IAI_NAMES[id % IAI_NAMES.length],
        },
      ]);

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setCuts((prev) => prev.filter((c) => c.id !== id));
      }, 420);
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
      {/* Quick-draw cuts */}
      <div className="pointer-events-none fixed inset-0 z-[9997] overflow-hidden">
        <AnimatePresence>
          {cuts.map((c) => (
            <motion.div
              key={c.id}
              style={{ left: c.x, top: c.y, rotate: c.angle }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, times: [0, 0.25, 1] }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1] }}
                transition={{ duration: 0.4, times: [0, 0.3, 1] }}
                className="h-[2px] w-20 origin-center bg-[var(--z-ink)] shadow-[0_0_10px_rgba(236,236,221,0.8)] sm:w-28"
              />
              <div className="zk-label absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap text-[9px]" style={{ transform: `rotate(${-c.angle}deg)` }}>
                {c.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The compass companion, trailing just under the blade */}
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        <motion.div style={{ x: bladeX, y: bladeY }} className="absolute left-0 top-0">
          <motion.div
            animate={{ opacity: lost ? 1 : 0.55, scale: lost ? 1.15 : 1 }}
            transition={{ duration: 0.3 }}
            className="zk-compass relative h-6 w-6 translate-x-3 translate-y-4"
          >
            <motion.div
              animate={{ rotate: lost ? needleAngle + 720 : needleAngle }}
              transition={lost ? { duration: 1.1, ease: "easeOut" } : { duration: 0.6 }}
              className="absolute left-1/2 top-1/2 h-[70%] w-[2px] -translate-x-1/2 -translate-y-1/2"
            >
              <div className="zk-compass-needle h-full w-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* The blade-tip cursor itself — always accurate to the real pointer */}
      <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
        <motion.div style={{ x: bladeX, y: bladeY }} className="absolute left-0 top-0">
          <motion.div
            style={{ rotate: tilt }}
            animate={{ scale: grabbing ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            className="-translate-x-1/2 -translate-y-1/2 origin-center"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-[0_0_5px_rgba(236,236,221,0.6)]">
              <path d="M12 1L14 3L12.6 16L11.4 16L10 3Z" fill="#ececdd" stroke="#0a0d0b" strokeWidth="0.6" />
              <rect x="9.5" y="16.3" width="5" height="1.6" rx="0.4" fill="#1b211c" stroke="#0a0d0b" strokeWidth="0.4" />
              <rect x="10.7" y="17.6" width="2.6" height="4.4" rx="0.6" fill="#3a1620" stroke="#0a0d0b" strokeWidth="0.4" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Chatter, only while lost */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[9996] max-w-[15rem] sm:max-w-xs">
        <AnimatePresence>
          {lost && (
            <motion.div
              key={lostLine}
              initial={{ opacity: 0, y: 10, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.24 }}
              className="zk-tag rounded-sm px-3 py-2 text-[10px] leading-snug sm:text-[11px]"
            >
              {lostLine}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ZoroOverlay;
