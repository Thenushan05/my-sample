import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { StrawHatIcon } from "../ui/StrawHatIcon";

/** Anything worth grabbing. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-luffy-target]';

/** He narrates in the present tense and means every word of it. */
const SHOUT_LINES = [
  "Ooh! What's this one do?",
  "I'm gonna be King of the Pirates!",
  "Shishishi! Keep scrolling.",
  "This ship looks fast.",
  "Is there meat further down?",
  "You're pretty good. Join my crew.",
  "Adventure! Let's go!",
];

/** Attack names, cycled so the same click doesn't always shout the same thing. */
const PUNCH_NAMES = ["Gomu Gomu no Pistol!", "Gomu Gomu no Bell!", "Gomu Gomu no Rifle!"];

/** How many punches until the drums sound and Gear 5th kicks in. */
const GEAR5_EVERY = 5;

interface Punch {
  id: number;
  /** Where the arm is rooted — just off the bottom edge, centred. */
  anchorX: number;
  anchorY: number;
  angle: number;
  length: number;
  targetX: number;
  targetY: number;
  name: string;
}

/**
 * Luffy mode's cursor, chatter, and signature move.
 *
 * The straw hat IS the cursor — it hangs slightly above the pointer and
 * swings on its brim as you move, because a hat that stayed rigid would read
 * as an icon rather than an object. Behind it a rubber arm stretches back
 * toward where the pointer just was: the trail is the Gum-Gum, so movement
 * itself is the character's power rather than a decoration on top of it.
 *
 * A click is a real Gum-Gum strike: the arm roots off-screen below (he is
 * standing just out of frame, the way an off-panel attack works in the
 * comic) and a fist rockets out along that rotated axis to wherever you
 * clicked, same beam-and-tip technique the hero laser eyes elsewhere in
 * this app use for pointing a line at a target — then snaps back elastic.
 * Land enough of them and the drums sound: dispatches `luffy-gear5` for
 * Gear5Awakening to pick up.
 *
 * On the light theme the trail is INK, not glow. Every dark theme in this
 * project draws attention with light; on paper the only way to be loud is
 * to be darker than the page.
 */
export const LuffyOverlay: React.FC = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [grabbing, setGrabbing] = useState(false);
  const [shoutIdx, setShoutIdx] = useState(0);
  const [shoutVisible, setShoutVisible] = useState(false);
  const idleTimer = useRef(0);

  const [punches, setPunches] = useState<Punch[]>([]);
  const punchId = useRef(0);
  const punchStreak = useRef(0);

  // The hat lags the pointer slightly; the arm lags the hat. Two stages is
  // enough to read as stretch without a chain of blobs.
  const hatX = useSpring(x, { stiffness: 420, damping: 30, mass: 0.5 });
  const hatY = useSpring(y, { stiffness: 420, damping: 30, mass: 0.5 });
  const armX = useSpring(hatX, { stiffness: 150, damping: 26, mass: 0.8 });
  const armY = useSpring(hatY, { stiffness: 150, damping: 26, mass: 0.8 });

  // Swing the brim into the direction of travel
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const tilt = useTransform<number, number>([vx, vy], ([a, b]) => {
    const speed = Math.hypot(a as number, b as number);
    if (speed < 30) return 0;
    return Math.max(-22, Math.min(22, ((a as number) / 90)));
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target as HTMLElement | null;
      setGrabbing(!!el?.closest?.(TARGET_SELECTOR));

      // He gets bored. Say something when the pointer rests.
      setShoutVisible(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setShoutIdx((i) => (i + 1) % SHOUT_LINES.length);
        setShoutVisible(true);
      }, 2600);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      clearTimeout(idleTimer.current);
    };
  }, [x, y]);

  useEffect(() => {
    const timers = new Set<number>();

    const punch = (e: MouseEvent) => {
      // Clicking an actual control should activate it, not get eaten by a
      // fist landing on top of it.
      if ((e.target as HTMLElement | null)?.closest?.(TARGET_SELECTOR)) return;

      const id = punchId.current++;
      const anchorX = window.innerWidth / 2;
      const anchorY = window.innerHeight + 30;
      const dx = e.clientX - anchorX;
      const dy = e.clientY - anchorY;

      setPunches((prev) => [
        ...prev,
        {
          id,
          anchorX,
          anchorY,
          angle: (Math.atan2(dy, dx) * 180) / Math.PI,
          length: Math.hypot(dx, dy),
          targetX: e.clientX,
          targetY: e.clientY,
          name: PUNCH_NAMES[id % PUNCH_NAMES.length],
        },
      ]);

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        setPunches((prev) => prev.filter((p) => p.id !== id));
      }, 950);
      timers.add(timer);

      punchStreak.current += 1;
      if (punchStreak.current >= GEAR5_EVERY) {
        punchStreak.current = 0;
        window.dispatchEvent(new CustomEvent("luffy-gear5"));
      }
    };

    window.addEventListener("click", punch);
    return () => {
      window.removeEventListener("click", punch);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <>
      {/* Gum-Gum strikes: rooted just off the bottom edge, one rotated axis
          per punch so the fist travels in a straight line to the click. */}
      <div className="pointer-events-none fixed inset-0 z-[9997] overflow-hidden">
        <AnimatePresence>
          {punches.map((p) => (
            <div
              key={p.id}
              style={{ left: p.anchorX, top: p.anchorY, transform: `rotate(${p.angle}deg)` }}
              className="absolute origin-top-left"
            >
              {/* The arm: a straight stretch, thick at the root and tapering,
                  scaled out along local +x then snapped back. */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.75, times: [0, 0.32, 0.6, 1], ease: ["circOut", "linear", "backIn"] }}
                style={{ width: p.length, transformOrigin: "0% 50%" }}
                className="h-3 -translate-y-1/2 rounded-full border-2 border-[var(--l-ink)] bg-gradient-to-r from-[#f6ead0] to-[var(--l-straw)]"
              />

              {/* The fist: rides the same axis in real px, arriving exactly
                  where the arm's tip is regardless of the arm's own scale.
                  op-fist's knuckle shape is symmetric enough that it doesn't
                  need its own counter-rotation to stay "upright". */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, p.length, p.length, 0] }}
                exit={{ x: 0 }}
                transition={{ duration: 0.75, times: [0, 0.32, 0.6, 1], ease: ["circOut", "linear", "backIn"] }}
                className="op-fist absolute top-1/2 h-9 w-10 -translate-y-1/2"
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Impact: stars and the shouted attack name, upright at the click
          point regardless of which way the arm rotated to get there. */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        <AnimatePresence>
          {punches.map((p) => (
            <motion.div
              key={p.id}
              style={{ left: p.targetX, top: p.targetY }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, times: [0, 0.3, 0.36, 0.68, 0.85] }}
            >
              {[0, 90, 180, 270].map((deg, i) => (
                <motion.span
                  key={deg}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [0.3, 1.1, 0.9], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 0.24 + i * 0.02 }}
                  style={{ rotate: deg + 12, left: Math.cos((deg * Math.PI) / 180) * 22, top: Math.sin((deg * Math.PI) / 180) * 22 }}
                  className="op-impact absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                />
              ))}
              <div className="op-shout absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[11px] sm:text-sm">
                {p.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* The rubber arm trailing the cursor, drawn under the hat so the hat
          caps it */}
      <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
        <motion.div
          style={{ x: armX, y: armY }}
          className="absolute left-0 top-0"
        >
          <motion.span
            animate={{ scaleY: grabbing ? 1.5 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#241a10] bg-[#c3352a]"
          />
        </motion.div>
      </div>

      {/* The hat */}
      <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
        <motion.div style={{ x: hatX, y: hatY }} className="absolute left-0 top-0">
          <motion.div
            style={{ rotate: tilt }}
            animate={{ scale: grabbing ? 1.25 : 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 24 }}
            className="-translate-x-1/2 -translate-y-[62%]"
          >
            <StrawHatIcon className="h-9 w-11 drop-shadow-[2px_3px_0_rgba(36,26,16,0.35)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Chatter, on a pinned scrap in the corner */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[9996] max-w-[15rem] sm:max-w-xs">
        <AnimatePresence mode="wait">
          {shoutVisible && (
            <motion.div
              key={shoutIdx}
              initial={{ opacity: 0, y: 10, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.24 }}
              className="op-scrap px-3 py-2 text-[10px] leading-snug sm:text-[11px]"
            >
              {SHOUT_LINES[shoutIdx]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LuffyOverlay;
