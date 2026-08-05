import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WebShot {
  id: number;
  x: number;
  y: number;
  /** Per-shot rotation so no two splats look stamped from the same die. */
  spin: number;
}

const SPLAT = 120;
const C = SPLAT / 2;
const SPOKES = 12;

const pt = (angle: number, r: number) =>
  `${(C + Math.cos(angle) * r).toFixed(1)},${(C + Math.sin(angle) * r).toFixed(1)}`;

/** Radial strands of the splat, alternating long and short. */
const STRANDS = Array.from({ length: SPOKES }, (_, i) => {
  const a = (i / SPOKES) * Math.PI * 2;
  const r = i % 2 === 0 ? 54 : 40;
  return { d: `M${pt(a, 4)} L${pt(a, r)}`, tip: pt(a, r) };
});

/** Sagging spiral rings between the strands. */
const ring = (r: number) => {
  let d = `M${pt(0, r)}`;
  for (let i = 0; i < SPOKES; i++) {
    const a1 = (i / SPOKES) * Math.PI * 2;
    const a2 = ((i + 1) / SPOKES) * Math.PI * 2;
    d += ` Q${pt((a1 + a2) / 2, r * 0.82)} ${pt(a2, r)}`;
  }
  return d;
};
const RINGS = [15, 27, 39].map(ring);

/**
 * Spider-Man mode click effect: THWIP.
 *
 * Iron Man charges and releases; Deadpool slashes. This one is instant —
 * a web splat stamps onto the page where you clicked, strands snap taut,
 * and a few globs of silk fling loose.
 */
export const WebShooter: React.FC = () => {
  const [shots, setShots] = useState<WebShot[]>([]);
  const shotId = useRef(0);

  useEffect(() => {
    const timers = new Set<number>();

    const handleClick = (e: MouseEvent) => {
      const id = shotId.current++;
      setShots((prev) => [...prev, { id, x: e.clientX, y: e.clientY, spin: (id * 53) % 360 }]);

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setShots((prev) => prev.filter((s) => s.id !== id));
      }, 900);
      timers.add(timer);
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {shots.map((shot) => (
          <div
            key={shot.id}
            style={{ left: shot.x, top: shot.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {/* The splat itself */}
            <motion.svg
              viewBox={`0 0 ${SPLAT} ${SPLAT}`}
              width={SPLAT}
              height={SPLAT}
              initial={{ scale: 0.12, opacity: 0, rotate: shot.spin - 12 }}
              animate={{ scale: [0.12, 1.12, 1], opacity: [0, 1, 0], rotate: shot.spin }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            >
              {RINGS.map((d) => (
                <path key={d} d={d} fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />
              ))}
              {STRANDS.map((strand) => (
                <g key={strand.d}>
                  <path
                    d={strand.d}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Silk bead at the anchor point */}
                  <circle
                    cx={strand.tip.split(",")[0]}
                    cy={strand.tip.split(",")[1]}
                    r="2"
                    fill="#ffffff"
                  />
                </g>
              ))}
              <circle cx={C} cy={C} r="5.5" fill="#ffffff" />
            </motion.svg>

            {/* Impact ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90 shadow-[0_0_22px_rgba(255,255,255,0.8)]"
            />

            {/* Loose silk flung off the shot */}
            {Array.from({ length: 7 }).map((_, i) => {
              const angle = (360 / 7) * i + (i % 3) * 11;
              const dist = 46 + (i % 4) * 18;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.95, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((angle * Math.PI) / 180) * dist,
                    y: Math.sin((angle * Math.PI) / 180) * dist,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.62, ease: "easeOut" }}
                  style={{ width: 3 + (i % 3), height: 3 + (i % 3) }}
                  className="absolute left-1/2 top-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WebShooter;
