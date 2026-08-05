import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Blast {
  id: number;
  x: number;
  y: number;
  /** 0.35 – 1, derived from how long the repulsor was charged. */
  power: number;
}

const MAX_CHARGE_MS = 700;

/**
 * Iron Man mode click effect.
 *
 * Press and hold to spin the repulsor up, release to fire. Hold longer and
 * the discharge is bigger, brighter and throws more shrapnel — the palm
 * repulsor beat, rather than a generic click ripple.
 */
export const IronManRepulsor: React.FC = () => {
  const [charge, setCharge] = useState<{ x: number; y: number } | null>(null);
  const [blasts, setBlasts] = useState<Blast[]>([]);
  const chargeStart = useRef(0);
  const blastId = useRef(0);

  useEffect(() => {
    const timers = new Set<number>();

    const handleDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      chargeStart.current = performance.now();
      setCharge({ x: e.clientX, y: e.clientY });
    };

    const handleUp = (e: PointerEvent) => {
      if (e.button !== 0 || !chargeStart.current) return;

      const held = performance.now() - chargeStart.current;
      const power = Math.min(1, Math.max(0.35, held / MAX_CHARGE_MS));
      const id = blastId.current++;

      chargeStart.current = 0;
      setCharge(null);
      setBlasts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, power }]);

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setBlasts((prev) => prev.filter((b) => b.id !== id));
      }, 800);
      timers.add(timer);
    };

    const handleCancel = () => {
      chargeStart.current = 0;
      setCharge(null);
    };

    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    window.addEventListener("blur", handleCancel);

    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
      window.removeEventListener("blur", handleCancel);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none overflow-hidden">
      {/* ── Charging: the palm spins up while the button is held ── */}
      <AnimatePresence>
        {charge && (
          <motion.div
            key="repulsor-charge"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: [0.3, 1.15, 0.95, 1.15] }}
            exit={{ opacity: 0, scale: 1.6, transition: { duration: 0.12 } }}
            transition={{ duration: MAX_CHARGE_MS / 1000, ease: "easeOut" }}
            style={{ left: charge.x, top: charge.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {/* Core building up */}
            <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_20px_#22d3ee,0_0_45px_#22d3ee,inset_0_0_8px_#a5f3fc]" />
            {/* Containment ring winding up */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] rounded-full border-2 border-dashed border-cyan-300/80"
            />
            {/* Intake wisps pulled toward the palm */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.span
                key={angle}
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: [0.9, 0], scale: [1, 0.2] }}
                transition={{ duration: 0.55, repeat: Infinity, delay: (angle / 360) * 0.55 }}
                style={{ rotate: `${angle}deg` }}
                className="absolute left-1/2 top-1/2 h-[2px] w-9 -translate-y-1/2 origin-left bg-gradient-to-r from-transparent to-cyan-300"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Discharge ─────────────────────────────────────────── */}
      <AnimatePresence>
        {blasts.map((blast) => (
          <div
            key={blast.id}
            style={{ left: blast.x, top: blast.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {/* White-hot core */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2.2 * blast.power, opacity: 0 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_40px_#ffffff,0_0_80px_#22d3ee]"
            />

            {/* Primary cyan shockwave */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0.95 }}
              animate={{ scale: 4.5 * blast.power, opacity: 0 }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.9),inset_0_0_20px_rgba(34,211,238,0.5)]"
            />

            {/* Trailing gold ring — Mark LXXXV accent */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0.8 }}
              animate={{ scale: 3.1 * blast.power, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/90 shadow-[0_0_22px_rgba(245,158,11,0.7)]"
            />

            {/* Energy lances thrown out by the discharge */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scaleX: 0.1, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0, x: 26 + 58 * blast.power }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ rotate: `${(360 / 10) * i}deg` }}
                className="absolute left-1/2 top-1/2 h-[2px] w-8 origin-left -translate-y-1/2 bg-gradient-to-r from-white via-cyan-300 to-transparent"
              />
            ))}

            {/* Impact brackets snapping shut on the point of contact */}
            {[
              { pos: "-top-6 -left-6", edge: "border-t-2 border-l-2", from: { x: -10, y: -10 } },
              { pos: "-top-6 -right-6", edge: "border-t-2 border-r-2", from: { x: 10, y: -10 } },
              { pos: "-bottom-6 -left-6", edge: "border-b-2 border-l-2", from: { x: -10, y: 10 } },
              { pos: "-bottom-6 -right-6", edge: "border-b-2 border-r-2", from: { x: 10, y: 10 } },
            ].map((bracket) => (
              <motion.span
                key={bracket.pos}
                initial={{ opacity: 0, ...bracket.from }}
                animate={{ opacity: [0, 1, 0], x: 0, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute ${bracket.pos} ${bracket.edge} h-4 w-4 border-amber-300`}
              />
            ))}

            {/* Only a full charge is worth announcing */}
            {blast.power > 0.85 && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 1, 0], y: -14 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-amber-300"
              >
                Repulsor · Full Power
              </motion.span>
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default IronManRepulsor;
