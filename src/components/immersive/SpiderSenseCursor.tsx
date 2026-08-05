import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Anything worth tingling about. */
const TARGET_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-spider-target]';

const SIZE = 44;
const C = SIZE / 2;
const SPOKES = 8;
const R = 20;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (angle: number, r: number, cx = C, cy = C) =>
  `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;

/** Radial support strands of the reticle web. */
const STRANDS = Array.from({ length: SPOKES }, (_, i) => {
  const a = (i / SPOKES) * Math.PI * 2;
  return `M${C},${C} L${pt(a, R)}`;
});

/** Spiral rings, sagging inward between spokes like real web silk. */
const ring = (r: number) => {
  let d = `M${pt(0, r)}`;
  for (let i = 0; i < SPOKES; i++) {
    const a1 = (i / SPOKES) * Math.PI * 2;
    const a2 = ((i + 1) / SPOKES) * Math.PI * 2;
    d += ` Q${pt((a1 + a2) / 2, r * 0.84)} ${pt(a2, r)}`;
  }
  return d;
};
const RINGS = [8.5, 14, 19].map(ring);

/** Arc of a spider-sense wave, drawn in an 88×88 overlay box. */
const senseArc = (r: number, startDeg: number, endDeg: number) => {
  const cx = 44;
  const cy = 44;
  return `M${pt(rad(startDeg), r, cx, cy)} A${r},${r} 0 0 1 ${pt(rad(endDeg), r, cx, cy)}`;
};

const SENSE_WAVES = [20, 28, 36];

export const SpiderSenseCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [tingling, setTingling] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as Element | null;
      setTingling(Boolean(target?.closest?.(TARGET_SELECTOR)));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed z-[10000] pointer-events-none"
      animate={{ x: pos.x - C, y: pos.y - C }}
      transition={{ x: { duration: 0 }, y: { duration: 0 } }}
    >
      <motion.div
        animate={{ scale: tingling ? 1.3 : 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 26 }}
        className="relative"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* The web reticle. Drifts while idle, locks still when alerted. */}
        <motion.svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          animate={{ rotate: tingling ? 0 : 360 }}
          transition={
            tingling
              ? { duration: 0.3, ease: "easeOut" }
              : { duration: 22, repeat: Infinity, ease: "linear" }
          }
          className="absolute inset-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.85)]"
        >
          {STRANDS.map((d) => (
            <path
              key={d}
              d={d}
              stroke={tingling ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)"}
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {RINGS.map((d) => (
            <path
              key={d}
              d={d}
              stroke={tingling ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)"}
              strokeWidth="0.9"
              fill="none"
            />
          ))}
        </motion.svg>

        {/* Web node at the exact pointer position */}
        <motion.span
          animate={{ scale: tingling ? [1, 1.5, 1] : 1 }}
          transition={{ duration: 0.65, repeat: tingling ? Infinity : 0, ease: "easeInOut" }}
          className={`absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            tingling
              ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"
              : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]"
          }`}
        />

        {/* Spider-sense: waves radiating off the top corners */}
        <AnimatePresence>
          {tingling && (
            <svg
              viewBox="0 0 88 88"
              width={88}
              height={88}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
            >
              {SENSE_WAVES.map((r, i) =>
                [
                  senseArc(r, 196, 250), // upper-left
                  senseArc(r, 290, 344), // upper-right
                ].map((d, side) => (
                  <motion.path
                    key={`${r}-${side}`}
                    d={d}
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.7, 1.12, 1.3] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.14,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{ transformOrigin: "44px 44px", filter: "drop-shadow(0 0 6px rgba(239,68,68,0.9))" }}
                  />
                ))
              )}
            </svg>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SpiderSenseCursor;
