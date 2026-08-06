import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** First unprompted appearance, so it isn't invisible if nobody clicks. */
const AUTO_FIRST_MS = 16000;
/** How often it can happen again on its own after that. */
const AUTO_EVERY_MS = 55000;
/** Total time one awakening plays before it fades. */
const PLAY_MS = 2200;

const LINES = ["Nika.", "The drums are calling.", "Let the joy in."];

/**
 * Gear 5th, staged without a character.
 *
 * Every other transformation moment in this app (Iron Man's suit-up, Moon
 * Knight's wrap, Venom's spread) has a portrait PNG to transform, generated
 * for that specific character. There isn't one for an awakened Luffy — and
 * drawing white hair and a red-and-cream toon body onto a stock photo would
 * look worse than not attempting it at all.
 *
 * So this does what the transformation DOES rather than what it looks like:
 * the world reacts. The page flashes warm-cream, a comic shockwave rings
 * out from centre, the drums stamp declares it, and the nearest bounty
 * board briefly goes rubbery — `.op-toon-physics`, the same bounce the poster
 * already flexes with, just turned up. The character stays off-screen; the
 * WORLD going a little cartoon-wrong is the special effect.
 *
 * Triggered by `window` CustomEvent `luffy-gear5` (LuffyOverlay dispatches
 * it every five Gum-Gum strikes) and, so it's never gated behind knowing to
 * click five times, by its own long-interval timer.
 */
export const Gear5Awakening: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const cooldown = useRef(false);
  const dismissTimer = useRef(0);

  useEffect(() => {
    const play = () => {
      if (cooldown.current) return;
      cooldown.current = true;
      setLineIdx((i) => (i + 1) % LINES.length);
      setPlaying(true);

      // Toon-physics on whatever the page's main poster surface is, if one
      // is mounted right now — a class toggle rather than prop-drilling a
      // ref through App.tsx for something this occasional.
      const board = document.querySelector(".op-plank, .op-poster");
      board?.classList.add("op-toon-physics");

      clearTimeout(dismissTimer.current);
      dismissTimer.current = window.setTimeout(() => {
        setPlaying(false);
        board?.classList.remove("op-toon-physics");
        cooldown.current = false;
      }, PLAY_MS);
    };

    window.addEventListener("luffy-gear5", play);

    let everyTimer = 0;
    const firstTimer = window.setTimeout(() => {
      play();
      everyTimer = window.setInterval(play, AUTO_EVERY_MS);
    }, AUTO_FIRST_MS);

    return () => {
      window.removeEventListener("luffy-gear5", play);
      clearTimeout(firstTimer);
      clearInterval(everyTimer);
      clearTimeout(dismissTimer.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[10001] overflow-hidden">
      <AnimatePresence>
        {playing && (
          <motion.div
            key="gear5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="absolute inset-0"
          >
            {/* The world going cream-bright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 0] }}
              transition={{ duration: 1.1, times: [0, 0.22, 0.55, 1] }}
              className="op-awakening-flash absolute inset-0"
            />

            {/* The shockwave ring */}
            <motion.div
              initial={{ scale: 0.05, opacity: 0.9 }}
              animate={{ scale: 5.5, opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="op-awakening-ring absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />

            {/* The stamp itself */}
            <motion.div
              initial={{ opacity: 0, scale: 1.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="op-toon-physics absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <div className="op-masthead op-outline text-5xl sm:text-7xl">Gear 5th</div>
              <div className="op-label mt-1 text-xs sm:text-sm">Awakened</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lineIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="op-shout mt-3 text-lg sm:text-2xl"
                >
                  {LINES[lineIdx]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gear5Awakening;
