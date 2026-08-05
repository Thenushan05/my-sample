import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { MjolnirIcon } from "../ui/MjolnirIcon";

/** How long without scroll input before the hammer is considered returned. */
const SETTLE_MS = 380;

/**
 * Thor mode's scroll presence: Mjölnir, thrown and returning.
 *
 * The other modes put a body on the page — Iron Man flies a sweep,
 * Spider-Man hangs from a web, Deadpool walks the floor. This one throws the
 * weapon instead, which gives it a mechanic none of the others have: it spins
 * hard while it travels, and the moment you stop scrolling it slows, recoils
 * upward and hovers, waiting to be called back.
 *
 * Parked in the left margin and hidden below lg, so it never sits over
 * content the way a mid-height right-rail element does.
 */
export const MjolnirThrow: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();

  // Travel down the page as a percentage, so it survives resizes
  const travel = useTransform(scrollYProgress, [0, 1], [10, 76]);
  const settled = useSpring(travel, { stiffness: 110, damping: 26, mass: 0.7 });
  const top = useMotionTemplate`${settled}%`;

  // Accumulated spin, written straight to a motion value — no React renders
  const rotation = useMotionValue(0);
  const velocity = useVelocity(scrollYProgress);

  const [flying, setFlying] = useState(false);
  const settleTimer = useRef(0);

  useAnimationFrame((_, delta) => {
    const speed = Math.min(1, Math.abs(velocity.get()) * 2.2);
    // Idles at a lazy turn, spins up to a blur when thrown
    const degPerSec = 40 + speed * 1000;
    rotation.set(rotation.get() + degPerSec * (delta / 1000));
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // setState bails out when the value is unchanged, so hammering this on
    // every scroll frame is cheap after the first one
    setFlying(true);
    clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setFlying(false), SETTLE_MS);
  });

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return (
    <div className="fixed left-2 top-0 z-[57] hidden h-screen w-16 pointer-events-none xl:left-6 lg:block">
      <motion.div style={{ top }} className="absolute left-0 w-16 -translate-y-1/2">
        {/* Trail of current, only while it's actually in flight */}
        <motion.svg
          viewBox="0 0 40 150"
          animate={{ opacity: flying ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="absolute -top-[150px] left-1/2 h-[150px] w-10 -translate-x-1/2 overflow-visible"
          preserveAspectRatio="none"
        >
          <path
            d="M20 150L14 122L26 98L13 72L25 46L17 20L21 0"
            fill="none"
            stroke="url(#mjolnir-trail)"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 7px rgba(125,211,252,0.95))" }}
          />
          <defs>
            <linearGradient id="mjolnir-trail" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="40%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Hover bob while it waits, damped out while flying */}
        <motion.div
          animate={{ y: flying ? 0 : [0, -7, 0] }}
          transition={
            flying
              ? { duration: 0.3 }
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <motion.div style={{ rotate: rotation }} className="origin-center">
            <MjolnirIcon className="h-14 w-14 drop-shadow-[0_0_16px_rgba(125,211,252,0.85)]" />
          </motion.div>

          {/* Charge pooling under it while it hovers */}
          <motion.div
            animate={{ opacity: flying ? 0 : [0.3, 0.75, 0.3], scale: flying ? 0.6 : [0.9, 1.15, 0.9] }}
            transition={
              flying
                ? { duration: 0.3 }
                : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
            }
            className="absolute left-1/2 top-1/2 -z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.5)_0%,transparent_70%)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MjolnirThrow;
