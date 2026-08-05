import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MoonKnightLoaderProps {
  onComplete: () => void;
}

/** Khonshu's summons, not a progress message. */
const SUMMONS = [
  "The night is called…",
  "The linen is wrapped…",
  "The crescent is drawn…",
  "Suit up.",
];

/** Hieroglyph line-art in a 14×20 box — drawn, never Unicode. */
const GLYPHS = [
  "M2 2h10M7 2v16M2 18h10",
  "M2 18V2l10 8-10 8",
  "M7 3a5 5 0 1 1 0 10a5 5 0 1 1 0-10M7 13v6",
  "M2 2h10v8H2zM7 10v8",
  "M2 10a5 5 0 0 1 10 0M7 5v13",
  "M2 2l10 16M12 2L2 18",
];

export const MoonKnightLoader: React.FC<MoonKnightLoaderProps> = ({ onComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [summonIdx, setSummonIdx] = useState(0);

  useEffect(() => {
    const summonTimer = window.setInterval(() => {
      setSummonIdx((i) => Math.min(i + 1, SUMMONS.length - 1));
    }, 700);

    const timer = window.setTimeout(() => {
      setIsLoaded(true);
      window.setTimeout(onComplete, 600);
    }, 2800);

    return () => {
      clearInterval(summonTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="moonknight-loader"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#05070d]"
        >
          {/* Moonrise from below the horizon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(242,239,230,0.18)_0%,transparent_52%)]"
          />

          {/* The moon waxing from new to full — a shadow disc sliding clear,
              the same geometry the backdrop uses, so the loader is a preview
              of the mode's core mechanic. */}
          <div className="relative h-36 w-36 md:h-44 md:w-44">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_36%_32%,#fbf9f4_0%,#e8e4d8_58%,#b9b6ab_100%)]" />
              {/* Craters */}
              {[
                { l: "22%", t: "26%", s: "26%" },
                { l: "58%", t: "18%", s: "16%" },
                { l: "64%", t: "52%", s: "20%" },
                { l: "34%", t: "62%", s: "24%" },
              ].map((c) => (
                <span
                  key={c.l + c.t}
                  style={{ left: c.l, top: c.t, width: c.s, height: c.s }}
                  className="absolute rounded-full bg-[#a8a59a]/35"
                />
              ))}
              {/* The terminator sliding off the face */}
              <motion.div
                initial={{ x: "-4%" }}
                animate={{ x: "-104%" }}
                transition={{ duration: 2.6, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#05070d]"
              />
            </div>

            {/* Moon halo */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.4], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(242,239,230,0.22)_0%,transparent_68%)]"
            />

            {/* Inscription ring turning around it */}
            <motion.svg
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]"
            >
              {GLYPHS.concat(GLYPHS).map((d, i, arr) => {
                const a = (i / arr.length) * Math.PI * 2;
                const r = 92;
                return (
                  <g
                    key={i}
                    transform={`translate(${100 + Math.cos(a) * r} ${100 + Math.sin(a) * r}) rotate(${(a * 180) / Math.PI + 90}) translate(-7 -10)`}
                  >
                    <path d={d} fill="none" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="square" opacity="0.7" />
                  </g>
                );
              })}
            </motion.svg>
          </div>

          {/* Summons */}
          <div className="mt-14 h-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={summonIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="text-[11px] tracking-[0.34em] text-[#f2efe6]/85"
                style={{ fontFamily: "'Marcellus SC', serif" }}
              >
                {SUMMONS[summonIdx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoonKnightLoader;
