import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import type { MotionValue } from "framer-motion";

/** Anything the symbiote wants to get its teeth into. */
const TARGET_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-venom-target]';

/** The symbiote speaks in the first-person plural. That is the whole bit. */
const WE_LINES = [
  "We like this one. We will keep him.",
  "We are not a costume. We are a partnership.",
  "You scroll. We watch. This is working out.",
  "We have tasted worse portfolios.",
  "We do not need the spider. We never did.",
  "We could take over the hiring process, if you prefer.",
  "There is no Venom without both of us.",
  "We are already inside the page.",
];

/** A hanging strand of ooze along the top edge. */
interface Drip {
  left: number;
  length: number;
  width: number;
  delay: number;
  duration: number;
}

const DRIPS: Drip[] = Array.from({ length: 16 }, (_, i) => ({
  left: (i / 16) * 100 + (i % 4) * 1.3,
  length: 22 + ((i * 41) % 74),
  width: 4 + ((i * 11) % 7),
  delay: (i % 8) * 0.42,
  duration: 3.2 + ((i * 23) % 30) / 10,
}));

interface Splat {
  id: number;
  x: number;
  y: number;
  spin: number;
}

const SPLAT = 130;
const SC = SPLAT / 2;

/** An irregular blob outline — the goo never lands in a circle. */
const gooBlob = (radius: number, points: number, wobble: number, seedOffset: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    // Deterministic pseudo-noise so each splat differs but never re-rolls
    const n = Math.sin(a * 3 + seedOffset) * 0.5 + Math.sin(a * 5 + seedOffset * 2) * 0.5;
    const r = radius * (1 + n * wobble);
    pts.push(`${(SC + Math.cos(a) * r).toFixed(1)} ${(SC + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
};

const SPLAT_CORE = gooBlob(30, 22, 0.28, 1.2);
const SPLAT_RING = gooBlob(48, 26, 0.34, 2.7);

/**
 * The cursor: black liquid mass.
 *
 * The tell of a symbiote isn't a wobbling blob — it's that the mass is
 * LIQUID. So the head sits exactly on the pointer while four follower blobs
 * chase it down a chain of progressively softer springs, which makes the
 * whole thing stretch when you move fast and pull back together when you
 * stop. Pure black body with a bone-white rim only — Venom's comic palette
 * is black and white; the purple is a movie-ism.
 */
const SymbioteCursor: React.FC<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  hungry: boolean;
}> = ({ x, y, hungry }) => {
  // Chained springs: each follower lags the one before it, so the tail
  // compounds instead of every blob racing the pointer independently.
  const t1x = useSpring(x, { stiffness: 300, damping: 24, mass: 0.5 });
  const t1y = useSpring(y, { stiffness: 300, damping: 24, mass: 0.5 });
  const t2x = useSpring(t1x, { stiffness: 220, damping: 24, mass: 0.6 });
  const t2y = useSpring(t1y, { stiffness: 220, damping: 24, mass: 0.6 });
  const t3x = useSpring(t2x, { stiffness: 160, damping: 24, mass: 0.7 });
  const t3y = useSpring(t2y, { stiffness: 160, damping: 24, mass: 0.7 });
  const t4x = useSpring(t3x, { stiffness: 120, damping: 24, mass: 0.8 });
  const t4y = useSpring(t3y, { stiffness: 120, damping: 24, mass: 0.8 });

  // Stretch the head along its direction of travel
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const speed = useTransform<number, number>([vx, vy], ([a, b]) =>
    Math.min(1, Math.hypot(a as number, b as number) / 2600)
  );
  const stretch = useTransform(speed, [0, 1], [1, 1.75]);
  const squash = useTransform(speed, [0, 1], [1, 0.62]);
  const lean = useTransform<number, number>([vx, vy], ([a, b]) =>
    Math.hypot(a as number, b as number) < 40
      ? 0
      : (Math.atan2(b as number, a as number) * 180) / Math.PI
  );

  const tail = [
    { tx: t1x, ty: t1y, size: 22, alpha: 0.85 },
    { tx: t2x, ty: t2y, size: 17, alpha: 0.7 },
    { tx: t3x, ty: t3y, size: 12, alpha: 0.55 },
    { tx: t4x, ty: t4y, size: 8, alpha: 0.4 },
  ];

  return (
    <>
      {/* Trailing mass, painted first so the head sits on top */}
      {tail.map((blob, i) => (
        <motion.div
          key={i}
          style={{ x: blob.tx, y: blob.ty }}
          className="fixed left-0 top-0 z-[9999] pointer-events-none"
        >
          <motion.div
            animate={{
              borderRadius: [
                "58% 42% 55% 45% / 48% 56% 44% 52%",
                "42% 58% 46% 54% / 56% 44% 58% 42%",
                "58% 42% 55% 45% / 48% 56% 44% 52%",
              ],
            }}
            transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: blob.size,
              height: blob.size,
              opacity: blob.alpha,
              marginLeft: (40 - blob.size) / 2,
              marginTop: (40 - blob.size) / 2,
            }}
            className="bg-[radial-gradient(circle_at_34%_30%,#171819_0%,#08090a_55%,#000_100%)] shadow-[0_0_10px_rgba(75,82,89,0.7)]"
          />
        </motion.div>
      ))}

      {/* The head */}
      <motion.div className="fixed left-0 top-0 z-[10000] pointer-events-none" style={{ x, y }}>
        <motion.div
          animate={{ scale: hungry ? 1.35 : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 24 }}
          className="relative h-10 w-10"
        >
          {/* Liquid body: stretches into the direction of travel */}
          <motion.div style={{ rotate: lean }} className="absolute inset-0">
            <motion.div
              style={{ scaleX: stretch, scaleY: squash }}
              className="h-full w-full"
            >
              <motion.div
                animate={{
                  borderRadius: [
                    "58% 42% 55% 45% / 48% 56% 44% 52%",
                    "44% 56% 42% 58% / 58% 44% 56% 42%",
                    "52% 48% 60% 40% / 42% 52% 48% 58%",
                    "58% 42% 55% 45% / 48% 56% 44% 52%",
                  ],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full bg-[radial-gradient(circle_at_32%_26%,#1b1d20_0%,#08090a_50%,#000_100%)] shadow-[0_0_18px_rgba(75,82,89,0.9),inset_0_1px_2px_rgba(233,237,242,0.45)]"
              />
            </motion.div>
          </motion.div>

          {/* Tendrils feeling outward from the mass */}
          {[18, 96, 174, 252, 320].map((deg, i) => (
            <motion.span
              key={deg}
              animate={{ scaleX: [0.35, 1, 0.5, 1, 0.35], opacity: [0.3, 0.85, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.24, ease: "easeInOut" }}
              style={{ rotate: `${deg}deg` }}
              className="absolute left-1/2 top-1/2 h-[2px] w-7 origin-left bg-gradient-to-r from-black via-[#17181b] to-transparent"
            />
          ))}

          {/* Teeth: only when there is something to bite */}
          <AnimatePresence>
            {hungry && (
              <motion.svg
                viewBox="0 0 40 40"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16 }}
                className="absolute inset-0 h-10 w-10 overflow-visible"
              >
                <motion.g
                  animate={{ y: [-1.5, 1, -1.5] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M6 13L10 19L14 13L18 19L22 13L26 19L30 13L34 19" fill="none" stroke="#f4f7fb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
                <motion.g
                  animate={{ y: [1.5, -1, 1.5] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M6 27L10 21L14 27L18 21L22 27L26 21L30 27L34 21" fill="none" stroke="#f4f7fb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export const VenomOverlay: React.FC = () => {
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const [hungry, setHungry] = useState(false);
  const [splats, setSplats] = useState<Splat[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(true);
  const splatId = useRef(0);
  const lastEl = useRef<Element | null>(null);

  useEffect(() => {
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);

      // closest() walks the DOM, so only re-query when the pointer crosses
      // into a different element
      const el = e.target as Element | null;
      if (el !== lastEl.current) {
        lastEl.current = el;
        setHungry(Boolean(el?.closest?.(TARGET_SELECTOR)));
      }
    };

    const handleClick = (e: MouseEvent) => {
      const id = splatId.current++;
      setSplats((prev) => [...prev, { id, x: e.clientX, y: e.clientY, spin: (id * 47) % 360 }]);
      later(() => setSplats((prev) => prev.filter((s) => s.id !== id)), 900);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [cursorX, cursorY]);

  // Rotate the "we" commentary
  useEffect(() => {
    let swapTimer = 0;
    const cycle = window.setInterval(() => {
      setCaptionVisible(false);
      swapTimer = window.setTimeout(() => {
        setLineIdx((i) => (i + 1) % WE_LINES.length);
        setCaptionVisible(true);
      }, 700);
    }, 9500);
    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimer);
    };
  }, []);

  return (
    <>
      {/* Drains the colour out of the ENTIRE page.
          Recolouring the theme tokens was never going to be enough — the
          portrait, the project screenshots and the brand-coloured tech logos
          are all still full-colour images. A viewport-wide backdrop-filter
          desaturates everything painted beneath it.
          Deliberately backdrop-filter and NOT `filter` on a wrapper: a filter
          on an ancestor creates a containing block for fixed positioning,
          which would break every fixed overlay in the app. This sits below the
          symbiote chrome (z-9996+) and the cursor (z-10000), all of which are
          already black and white. */}
      <div
        className="fixed inset-0 z-[9995] pointer-events-none"
        style={{
          backdropFilter: "grayscale(1) contrast(1.08)",
          WebkitBackdropFilter: "grayscale(1) contrast(1.08)",
        }}
      />

      <SymbioteCursor x={cursorX} y={cursorY} hungry={hungry} />

      {/* Goo thrown by clicks */}
      <AnimatePresence>
        {splats.map((splat) => (
          <div
            key={splat.id}
            style={{ left: splat.x, top: splat.y }}
            className="fixed z-[9994] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <motion.svg
              viewBox={`0 0 ${SPLAT} ${SPLAT}`}
              width={SPLAT}
              height={SPLAT}
              initial={{ scale: 0.1, opacity: 0, rotate: splat.spin - 14 }}
              animate={{ scale: [0.1, 1.15, 1], opacity: [0, 1, 0], rotate: splat.spin }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], times: [0, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
            >
              <path d={SPLAT_RING} fill="rgba(20,21,23,0.5)" />
              <path d={SPLAT_CORE} fill="#08090a" stroke="#b9c2cd" strokeWidth="2" />
              <path
                d={SPLAT_CORE}
                fill="none"
                stroke="#f4f7fb"
                strokeWidth="0.9"
                opacity="0.5"
                transform="translate(-2,-3) scale(0.92) translate(5.6,7.8)"
              />
            </motion.svg>

            {/* Strings of goo flung outward */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (360 / 8) * i + (i % 3) * 13;
              const dist = 44 + (i % 4) * 20;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((angle * Math.PI) / 180) * dist,
                    y: Math.sin((angle * Math.PI) / 180) * dist + 12,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  style={{ width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2 }}
                  className="absolute left-1/2 top-1/2 rounded-full bg-[#141517] shadow-[0_0_8px_rgba(185,194,205,0.9)]"
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>

      {/* Ooze hanging off the top edge */}
      <div className="fixed left-0 top-0 z-[9997] w-full pointer-events-none">
        <div className="venom-ooze-edge h-5 w-full" />
        {DRIPS.map((drip, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0.5 }}
            animate={{ scaleY: [0.5, 1.15, 0.7, 1, 0.5] }}
            transition={{
              duration: drip.duration,
              delay: drip.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${drip.left}%`,
              width: drip.width,
              height: drip.length,
              transformOrigin: "top center",
            }}
            className="absolute top-4 rounded-b-full bg-gradient-to-b from-[#0f1011] to-[#17181b] shadow-[0_2px_10px_rgba(75,82,89,0.9)]"
          >
            <span
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-[#141517]"
              style={{ width: drip.width * 1.6, height: drip.width * 1.6 }}
            />
          </motion.div>
        ))}
      </div>

      {/* The membrane closing in on the frame */}
      <div className="fixed inset-0 z-[9996] pointer-events-none">
        <div className="absolute inset-0 shadow-[inset_0_0_130px_rgba(59,7,100,0.75)]" />
        <div className="venom-alive absolute inset-2 rounded-[28px_14px_30px_16px/16px_30px_14px_28px] border border-[#b9c2cd]/25" />
      </div>

      {/* "We" — always plural */}
      <div className="fixed bottom-5 left-4 z-[9998] max-w-[15rem] pointer-events-none sm:left-6 sm:max-w-xs">
        <AnimatePresence mode="wait">
          {captionVisible && (
            <motion.div
              key={lineIdx}
              initial={{ opacity: 0, x: -24, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.94 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="venom-chip px-3 py-2 text-[11px] leading-snug sm:text-xs"
            >
              {WE_LINES[lineIdx]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default VenomOverlay;
