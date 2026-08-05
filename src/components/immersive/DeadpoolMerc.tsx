import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import { DeadpoolMaskIcon } from "../ui/DeadpoolMaskIcon";

const IDLE_LINES = [
  "Well? Keep scrolling.",
  "I'll wait. I'm immortal.",
  "You stopped. Was it something I said?",
  "Take your time. I'm getting paid either way.",
];

/** Random reaction when you smack him. */
const HIT_REACTIONS = [
  { word: "POW!", line: "Ow. Rude." },
  { word: "SNIKT!", line: "Careful, I bruise like a peach." },
  { word: "OOF!", line: "That's going in the complaint box." },
  { word: "BONK!", line: "Do it again. I dare you." },
  { word: "THWAP!", line: "Healing factor: 1. You: 0." },
];

/** Escalating responses once you clearly aren't going to stop. */
const HIT_MILESTONES: Record<number, { word: string; line: string }> = {
  3: { word: "AGAIN?!", line: "Three times. Who's counting? Me. I am." },
  6: { word: "SERIOUSLY", line: "You know I feel every one of these, right?" },
  10: { word: "ENOUGH!", line: "I'm telling him you did this. All ten times." },
  15: { word: "WOW.", line: "Genuinely impressive commitment to violence." },
};

/** How long without scroll input before he stops walking / starts talking. */
const STOP_AFTER_MS = 220;
const BORED_AFTER_MS = 1500;
/** How long a hit reaction owns the speech bubble. */
const REACTION_MS = 1500;

interface FigureProps {
  walking: boolean;
}

/**
 * Chibi Deadpool, assembled from divs the same way IronManFigure is.
 * Limbs are hinged at the top so they can swing through a walk cycle.
 */
const DeadpoolFigure: React.FC<FigureProps> = React.memo(({ walking }) => {
  // Framer-motion restarts a keyframe animation when the target array is a
  // new reference, so these are memoised — otherwise every parent re-render
  // (facing flip, hit reaction, idle line) snaps the walk cycle back to frame
  // one and the whole figure judders.
  const { legA, legB, armA, armB, cycle, bob, headBob } = useMemo(() => {
    const leg = walking ? [24, -24, 24] : [3, -3, 3];
    const arm = walking ? [-22, 22, -22] : [-4, 4, -4];
    return {
      legA: leg,
      legB: leg.map((a) => -a),
      armA: arm,
      armB: arm.map((a) => -a),
      cycle: walking ? 0.52 : 3.4,
      bob: walking ? [0, -2.5, 0] : [0, -1, 0],
      headBob: walking ? [-2, 2, -2] : [0, -9, 0],
    };
  }, [walking]);

  return (
    <motion.div
      animate={{ y: bob }}
      transition={{ duration: walking ? cycle / 2 : 2.6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-14 h-24 flex flex-col items-center drop-shadow-[0_6px_16px_rgba(220,20,60,0.75)]"
    >
      {/* Katanas crossed behind him */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 z-0">
        <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
          <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
        </div>
        <div className="absolute top-0 left-1/2 h-16 w-[3px] -translate-x-1/2 -rotate-[38deg] bg-gradient-to-b from-slate-200 to-slate-500 rounded-full">
          <span className="absolute -bottom-2 left-1/2 h-4 w-[5px] -translate-x-1/2 rounded-sm bg-[#120b0c]" />
        </div>
      </div>

      {/* Head — reuses the same mask art as the toggle button.
          Cocks to one side when he has nothing better to do. */}
      <motion.div
        animate={{ rotate: headBob }}
        transition={{ duration: walking ? cycle : 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom center" }}
        className="relative z-20 w-7 h-8"
      >
        <DeadpoolMaskIcon className="w-full h-full drop-shadow-[0_0_6px_rgba(220,20,60,0.8)]" />
      </motion.div>

      {/* Torso */}
      <div className="relative z-10 -mt-1 w-9 h-11 rounded-t-lg rounded-b-xl border border-black/50 bg-gradient-to-b from-[#c01128] to-[#7f0d1c] shadow-md">
        <span className="absolute inset-y-1 left-0 w-[7px] rounded-l-lg bg-[#151011]" />
        <span className="absolute inset-y-1 right-0 w-[7px] rounded-r-lg bg-[#151011]" />
        <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 rotate-[24deg] bg-[#2a1f16]" />
        <span className="absolute top-1 left-1/2 h-9 w-[3px] -translate-x-1/2 -rotate-[24deg] bg-[#2a1f16]" />
        <span className="absolute bottom-0 inset-x-0 h-2 rounded-b-xl bg-[#3a2a1c] border-t border-black/50" />
        <span className="absolute bottom-[1px] left-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
        <span className="absolute bottom-[1px] right-1 h-[7px] w-2 rounded-sm bg-[#5a4229]" />
      </div>

      {/* Arms — swing opposite to the legs */}
      {[
        { side: "-left-2", swing: armA },
        { side: "-right-2", swing: armB },
      ].map((arm) => (
        <motion.div
          key={arm.side}
          animate={{ rotate: arm.swing }}
          transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className={`absolute top-9 ${arm.side} w-[10px] h-9 rounded-full bg-gradient-to-b from-[#a30f22] to-[#7f0d1c] border border-black/40`}
        >
          <span className="absolute bottom-0 inset-x-0 h-3 rounded-full bg-[#151011]" />
        </motion.div>
      ))}

      {/* Legs — the actual walk cycle */}
      <div className="relative z-10 -mt-1 flex gap-[3px]">
        {[legA, legB].map((swing, i) => (
          <motion.div
            key={i}
            animate={{ rotate: swing }}
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
            className="relative w-[13px] h-9 rounded-b-md bg-gradient-to-b from-[#a30f22] to-[#6d0b18] border border-black/40"
          >
            <span className="absolute bottom-0 inset-x-0 h-3 rounded-b-md bg-[#151011]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

DeadpoolFigure.displayName = "DeadpoolFigure";

/**
 * Deadpool mode's scroll character.
 *
 * Iron Man flies a sweeping flight path and Spider-Man descends on a web.
 * This one walks the floor of the page: scroll position drives how far along
 * he is, scroll *direction* turns him around, and when you stop scrolling he
 * stops, faces you, and starts complaining about it.
 */
export const DeadpoolMerc: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["-6vw", "92vw"]);

  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState(1);
  const [bored, setBored] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [reaction, setReaction] = useState<{ id: number; word: string; line: string } | null>(null);

  const stopTimer = useRef(0);
  const boredTimer = useRef(0);
  const reactTimer = useRef(0);
  const hits = useRef(0);
  const reactId = useRef(0);
  const recoil = useAnimationControls();

  /** Smack him and he has something to say about it. */
  const handleHit = () => {
    hits.current += 1;
    const milestone = HIT_MILESTONES[hits.current];
    const random = HIT_REACTIONS[Math.floor(Math.random() * HIT_REACTIONS.length)];

    setReaction({ id: reactId.current++, ...(milestone ?? random) });
    setBored(false);

    // Once he's done reacting, let him drift back into idle chatter instead
    // of going silent for good.
    clearTimeout(boredTimer.current);
    boredTimer.current = window.setTimeout(() => {
      setLineIdx((i) => (i + 1) % IDLE_LINES.length);
      setBored(true);
    }, REACTION_MS + 700);

    recoil.start({
      rotate: [0, -19, 13, -6, 0],
      y: [0, -20, 2, -5, 0],
      scale: [1, 1.14, 0.95, 1.03, 1],
      transition: { duration: 0.6, ease: "easeOut" },
    });

    clearTimeout(reactTimer.current);
    reactTimer.current = window.setTimeout(() => setReaction(null), REACTION_MS);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // React bails out when these match, so hammering them on scroll is cheap
    setFacing(delta > 0 ? 1 : -1);
    setWalking(true);
    setBored(false);

    clearTimeout(stopTimer.current);
    clearTimeout(boredTimer.current);
    stopTimer.current = window.setTimeout(() => setWalking(false), STOP_AFTER_MS);
    boredTimer.current = window.setTimeout(() => {
      setLineIdx((i) => (i + 1) % IDLE_LINES.length);
      setBored(true);
    }, BORED_AFTER_MS);
  });

  useEffect(() => {
    // Start bored — nobody has scrolled yet
    boredTimer.current = window.setTimeout(() => setBored(true), BORED_AFTER_MS);
    return () => {
      clearTimeout(stopTimer.current);
      clearTimeout(boredTimer.current);
      clearTimeout(reactTimer.current);
    };
  }, []);

  // A hit always outranks idle chatter, but they share one bubble
  const speech = reaction
    ? { key: `hit-${reaction.id}`, text: reaction.line }
    : bored && !walking
      ? { key: `idle-${lineIdx}`, text: IDLE_LINES[lineIdx] }
      : null;

  return (
    <div className="fixed bottom-6 left-0 w-full h-36 z-[58] pointer-events-none overflow-hidden">
      <motion.div style={{ x }} className="absolute bottom-0">
        {/* He turns to face the reader the moment he stops walking.
            The recoil layer sits outside the facing flip so a hit reads the
            same whichever way he's pointing. */}
        <motion.div animate={recoil}>
          <motion.div
            animate={{ scaleX: walking ? facing : 1, scale: walking ? 1 : 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            whileHover={{ scale: 1.08 }}
            onClick={handleHit}
            className="pointer-events-auto"
          >
            <DeadpoolFigure walking={walking} />
          </motion.div>
        </motion.div>

        {/* ── Hit reaction ─────────────────────────────────── */}
        <AnimatePresence>
          {reaction && (
            <div key={reaction.id} className="absolute inset-0 pointer-events-none">
              {/* Comic impact starburst */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotate: -18 }}
                animate={{ scale: [0.2, 1.25, 1], opacity: [0, 1, 1], rotate: [-18, 6, -4] }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -top-8 left-1/2 -translate-x-1/2"
              >
                <div className="relative flex items-center justify-center">
                  <svg viewBox="0 0 120 90" className="w-28 h-20 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]">
                    <polygon
                      points="60,2 70,24 94,12 88,38 116,42 92,56 110,76 82,72 80,88 60,74 40,88 38,72 10,76 28,56 4,42 32,38 26,12 50,24"
                      fill="#fde047"
                      stroke="#0a0000"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="absolute text-[#0a0000] text-base leading-none"
                    style={{ fontFamily: "'Bangers', cursive" }}
                  >
                    {reaction.word}
                  </span>
                </div>
              </motion.div>

              {/* Blood spray — he heals, so it's purely for show */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i + (i % 3) * 9;
                const dist = 34 + (i % 4) * 16;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      x: Math.cos((angle * Math.PI) / 180) * dist,
                      y: Math.sin((angle * Math.PI) / 180) * dist + 14,
                      scale: 0.35,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2 }}
                    className="absolute left-1/2 top-1/3 rounded-full bg-[#b91c1c]"
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Dust kicked up mid-stride, blood pooled when standing still */}
        <motion.div
          animate={{ opacity: walking ? 0.75 : 0.35, scaleX: walking ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-1 left-1/2 h-[3px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-red-700/70 to-transparent blur-[2px]"
        />

        {/* Complaints — about being hit, or about being ignored.
            One bubble, one anchor, stable key: hitting him while he's already
            talking swaps the LINE rather than tearing the bubble down and
            building a second one somewhere else. */}
        <AnimatePresence>
          {speech && (
            <motion.div
              key="dp-speech-bubble"
              /* No `layout` here on purpose: this sits inside a motion.div
                 whose x changes every scroll frame, and App is wrapped in
                 LayoutGroup — layout animation re-measures nonstop and the
                 bubble stutters. Let the width just change. */
              initial={{ opacity: 0, y: 8, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="dp-caption absolute bottom-[118%] left-1/2 w-max max-w-[13rem] -translate-x-1/4 px-2.5 py-1.5 text-[10px]"
            >
              {/* Only the text crossfades; the bubble itself never leaves */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={speech.key}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.13, ease: "easeOut" }}
                  className="block"
                >
                  {speech.text}
                </motion.span>
              </AnimatePresence>

              {/* bubble tail */}
              <span className="absolute -bottom-[9px] left-4 h-0 w-0 border-l-[10px] border-r-0 border-t-[11px] border-l-transparent border-t-black" />
              <span className="absolute -bottom-[5px] left-[18px] h-0 w-0 border-l-[7px] border-r-0 border-t-[8px] border-l-transparent border-t-[#f5c518]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DeadpoolMerc;
