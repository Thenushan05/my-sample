import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

/** Anything the HUD should treat as a hostile worth locking onto. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-hud-target]';

export const IronManHelmetHUD: React.FC = () => {
  // Motion values, not state: a re-render per mousemove is what makes a
  // custom cursor lag behind the real pointer.
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [locked, setLocked] = useState(false);
  const lastEl = useRef<Element | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX - 24); // centre the 48x48 cursor
      y.set(e.clientY - 24);

      // Targeting computer: only re-query when the pointer changes element,
      // since closest() walks the DOM every call.
      const el = e.target as Element | null;
      if (el !== lastEl.current) {
        lastEl.current = el;
        setLocked(Boolean(el?.closest?.(TARGET_SELECTOR)));
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  return (
    <>
      {/* Interactive Targeting Reticle Cursor */}
      <motion.div
        className="fixed left-0 top-0 z-[10000] pointer-events-none mix-blend-screen"
        style={{ x, y }}
      >
        <motion.div
          animate={{ scale: locked ? 1.45 : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 26 }}
          className="relative w-12 h-12"
        >
          {/* Outer Ring — spins while scanning, snaps still on lock */}
          <motion.div
            animate={{ rotate: locked ? 0 : 360 }}
            transition={
              locked
                ? { duration: 0.25, ease: "easeOut" }
                : { duration: 10, repeat: Infinity, ease: "linear" }
            }
            className={`absolute inset-0 w-12 h-12 rounded-full border-2 border-dashed transition-colors duration-200 ${
              locked ? "border-amber-400 opacity-90" : "border-cyan-500 opacity-50"
            }`}
          />
          {/* Inner Ring */}
          <div
            className={`absolute inset-1 w-10 h-10 border rounded-full flex items-center justify-center transition-colors duration-200 ${
              locked ? "border-amber-300 opacity-70" : "border-cyan-400 opacity-30"
            }`}
          >
            <motion.div
              animate={{ scale: locked ? [1, 1.6, 1] : 1 }}
              transition={{ duration: 0.7, repeat: locked ? Infinity : 0, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"
            />
          </div>
          {/* Crosshairs */}
          <div className="absolute inset-0 w-12 h-12">
            {[
              "top-0 left-1/2 -translate-x-1/2 w-0.5 h-2",
              "bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2",
              "left-0 top-1/2 -translate-y-1/2 h-0.5 w-2",
              "right-0 top-1/2 -translate-y-1/2 h-0.5 w-2",
            ].map((cls) => (
              <div
                key={cls}
                className={`absolute ${cls} transition-colors duration-200 ${
                  locked ? "bg-amber-400" : "bg-cyan-400"
                }`}
              />
            ))}
          </div>

          {/* Lock brackets clamp in from the corners */}
          <AnimatePresence>
            {locked && (
              <>
                {[
                  { pos: "-top-2 -left-2", edge: "border-t-2 border-l-2", from: { x: -6, y: -6 } },
                  { pos: "-top-2 -right-2", edge: "border-t-2 border-r-2", from: { x: 6, y: -6 } },
                  { pos: "-bottom-2 -left-2", edge: "border-b-2 border-l-2", from: { x: -6, y: 6 } },
                  { pos: "-bottom-2 -right-2", edge: "border-b-2 border-r-2", from: { x: 6, y: 6 } },
                ].map((bracket) => (
                  <motion.span
                    key={bracket.pos}
                    initial={{ opacity: 0, ...bracket.from }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, ...bracket.from }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className={`absolute ${bracket.pos} ${bracket.edge} h-2.5 w-2.5 border-amber-400`}
                  />
                ))}

                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] font-bold uppercase tracking-[0.25em] text-amber-300"
                >
                  Tgt Lock
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Minimalistic HUD Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden flex flex-col justify-between p-4 sm:p-8">

        {/* Top Corners */}
        <div className="flex justify-between w-full opacity-50">
          <div className="w-16 h-16 border-t-4 border-l-4 border-cyan-500 rounded-tl-2xl" />
          <div className="w-16 h-16 border-t-4 border-r-4 border-cyan-500 rounded-tr-2xl" />
        </div>

        {/* Minimal Telemetry - Left & Right */}
        <div className="flex justify-between w-full opacity-40 font-mono text-[9px] sm:text-[10px] text-cyan-400">
          <div className="flex flex-col gap-1">
            <span>SYS.OP // J.A.R.V.I.S.</span>
            <span>ARC_CORE: 100%</span>
            <span className={locked ? "text-amber-400" : undefined}>
              REPULSOR: {locked ? "ARMED" : "STANDBY"}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className={locked ? "text-amber-400" : undefined}>
              TARGETING: {locked ? "LOCKED" : "ACTIVE"}
            </span>
            <span>THREAT: ZERO</span>
            <span>PROTOCOL: OMEGA</span>
          </div>
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between w-full opacity-50">
          <div className="w-16 h-16 border-b-4 border-l-4 border-cyan-500 rounded-bl-2xl" />
          <div className="w-16 h-16 border-b-4 border-r-4 border-cyan-500 rounded-br-2xl" />
        </div>

        {/* Very subtle edge vignette, warms up when a target is held */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            locked
              ? "shadow-[inset_0_0_120px_rgba(245,158,11,0.14)]"
              : "shadow-[inset_0_0_100px_rgba(6,182,212,0.1)]"
          }`}
        />
      </div>
    </>
  );
};
