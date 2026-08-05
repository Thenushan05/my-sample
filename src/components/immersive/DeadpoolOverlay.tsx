import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Deadpool talks to the reader. That is the whole bit. */
const FOURTH_WALL_LINES = [
  "Oh good, you're still scrolling. I was getting lonely down here.",
  "Yes, that's HIS actual face under my suit. Bold casting choice.",
  "He built this in React. I'd have used crayons and a threat.",
  "I'm the only one on this page who knows it's a page.",
  "Maximum effort. Mostly on the hover states.",
  "Nice cursor. It's a katana now. You're welcome.",
  "Iron Man mode has telemetry. I have a mouth. Guess which one's fun.",
  "Spider-Man mode is right there if you want something wholesome.",
  "Hire him before I start making decisions around here.",
  "The blood is decorative. Probably.",
];

/** A single hanging drop along the bleeding top edge. */
interface EdgeDrop {
  left: number;
  length: number;
  width: number;
  delay: number;
  duration: number;
}

const EDGE_DROPS: EdgeDrop[] = Array.from({ length: 14 }, (_, i) => ({
  left: (i / 14) * 100 + (i % 3) * 1.6,
  length: 18 + ((i * 37) % 62),
  width: 3 + ((i * 13) % 5),
  delay: (i % 7) * 0.55,
  duration: 3.4 + ((i * 17) % 26) / 10,
}));

interface Slash {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const KatanaCursor: React.FC<{ x: number; y: number; swinging: boolean }> = ({ x, y, swinging }) => (
  <motion.div
    className="fixed z-[10000] pointer-events-none"
    animate={{ x: x - 6, y: y - 6 }}
    transition={{ type: "spring", stiffness: 1400, damping: 60, mass: 0.25 }}
  >
    <motion.div
      animate={{ rotate: swinging ? [-38, 22, -38] : -38 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ transformOrigin: "6px 6px" }}
    >
      <svg width="74" height="74" viewBox="0 0 74 74" className="overflow-visible">
        {/* Blade */}
        <path
          d="M6 6 L58 58 L62 66 L54 62 Z"
          fill="url(#dp-blade)"
          stroke="#1a1a1a"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        {/* Hard specular line down the blade */}
        <path d="M9 8 L56 55" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" strokeLinecap="round" />
        {/* Tsuba (guard) + wrapped handle sitting at the pointer tip */}
        <rect
          x="-3.5"
          y="-3.5"
          width="13"
          height="4"
          rx="1"
          transform="rotate(45 3 -1.5)"
          fill="#dc143c"
          stroke="#120b0c"
          strokeWidth="1"
        />
        <path d="M-9 -9 L4 4" stroke="#120b0c" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M-9 -9 L4 4" stroke="#3f3f46" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 3" />
        {/* Blood still on the edge */}
        <circle cx="60" cy="64" r="2.2" fill="#dc143c" />
        <defs>
          <linearGradient id="dp-blade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  </motion.div>
);

export const DeadpoolOverlay: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [swinging, setSwinging] = useState(false);
  const [slashes, setSlashes] = useState<Slash[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(true);
  const slashId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    // Timers are tracked so switching modes mid-swing doesn't leave them running
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const handleClick = (e: MouseEvent) => {
      const id = slashId.current++;
      setSlashes((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY, angle: -60 + Math.random() * 120 },
      ]);
      setSwinging(true);
      later(() => setSwinging(false), 280);
      later(() => setSlashes((prev) => prev.filter((s) => s.id !== id)), 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Rotate the narration box: show a line, hide it, swap, repeat.
  useEffect(() => {
    let swapTimer = 0;
    const cycle = window.setInterval(() => {
      setCaptionVisible(false);
      swapTimer = window.setTimeout(() => {
        setLineIdx((i) => (i + 1) % FOURTH_WALL_LINES.length);
        setCaptionVisible(true);
      }, 700);
    }, 9000);
    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimer);
    };
  }, []);

  return (
    <>
      <KatanaCursor x={mousePos.x} y={mousePos.y} swinging={swinging} />

      {/* Katana slashes left behind by clicks */}
      <AnimatePresence>
        {slashes.map((slash) => (
          <motion.div
            key={slash.id}
            initial={{ opacity: 0, scaleX: 0.1, scaleY: 0.4 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.1, 1.15, 1.3], scaleY: [0.4, 1, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ left: slash.x, top: slash.y, rotate: slash.angle }}
            className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-52 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_18px_rgba(255,255,255,0.95)]" />
            <div className="w-52 h-[7px] -mt-[5px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent blur-[3px]" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bleeding top edge of the viewport */}
      <div className="fixed top-0 left-0 w-full z-[9997] pointer-events-none">
        <div className="dp-blood-edge w-full h-4" />
        {EDGE_DROPS.map((drop, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0.55 }}
            animate={{ scaleY: [0.55, 1, 0.7, 1, 0.55] }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${drop.left}%`,
              width: drop.width,
              height: drop.length,
              transformOrigin: "top center",
            }}
            className="absolute top-3 rounded-b-full bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] shadow-[0_2px_8px_rgba(139,0,20,0.9)]"
          >
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#b91c1c]"
              style={{ width: drop.width * 1.7, height: drop.width * 1.7 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Comic panel keyline around the whole viewport */}
      <div className="fixed inset-0 z-[9996] pointer-events-none">
        <div className="absolute inset-2 sm:inset-3 border-[3px] border-black/85 rounded-sm shadow-[inset_0_0_0_2px_rgba(220,20,60,0.35)]" />
        {/* Corner rivets, like a printed panel */}
        {[
          "top-1 left-1",
          "top-1 right-1",
          "bottom-1 left-1",
          "bottom-1 right-1",
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-4 h-4 border-2 border-[#dc143c]/70 bg-black/70 rotate-45`}
          />
        ))}
      </div>

      {/* Yellow narration box — Deadpool's fourth-wall device.
          Parked above the merc's walking lane at every width: DeadpoolMerc
          owns bottom-6 up to ~168px once his own speech bubble is counted,
          and he crosses the full width, so a bottom-left box would collide
          on desktop too — just further into the scroll. */}
      <div className="fixed bottom-44 left-4 sm:left-6 z-[9998] pointer-events-none max-w-[13rem] sm:max-w-xs">
        <AnimatePresence mode="wait">
          {captionVisible && (
            <motion.div
              key={lineIdx}
              initial={{ opacity: 0, x: -24, rotate: -4 }}
              animate={{ opacity: 1, x: 0, rotate: -1.5 }}
              exit={{ opacity: 0, x: -24, rotate: -6 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="dp-caption px-3 py-2 text-[11px] sm:text-xs"
            >
              {FOURTH_WALL_LINES[lineIdx]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DeadpoolOverlay;
