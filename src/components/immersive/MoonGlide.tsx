import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/** How long without scroll input before the glide becomes a hover. */
const SETTLE_MS = 300;

/**
 * The glide, as ONE silhouette: a hooded rise blended into the leading edge,
 * wings sweeping out to sharp tips, and a trailing edge cut into two deep
 * scallops.
 *
 * Two earlier attempts failed here and both failures were instructive. The
 * first assembled him from rounded divs — a capsule per arm, a capsule per
 * leg — which at flying size resolves into a white smudge. The second was a
 * single path but a symmetric one with six radiating points, which reads as
 * a starfish, and its hood was a detached circle that read as an insect.
 *
 * So this is a CAPE, not a man. No limbs and no face to get wrong: the
 * leading edge is one unbroken curve, only the trailing edge is broken up,
 * and the hood is a bump continuous with the silhouette rather than a ball
 * sitting on top of it. The crescent is the only identifying mark it needs.
 * Shapes were compared side by side at true flying size before picking this
 * one — three scallops turned to mush at 143px, two hold.
 */
const GLIDER =
  "M4 64C34 40 78 24 108 20C112 10 120 6 128 8C136 10 140 16 139 23" +
  "C174 28 212 42 238 60C218 70 196 76 172 78C180 92 180 104 172 114" +
  "C154 104 138 94 128 86C124 98 116 106 104 112C98 100 96 90 96 82" +
  "C66 80 30 74 4 64Z";

/* Cut out of the silhouette rather than drawn on top — under difference
   blending an added dark mark would invert along with everything else, but a
   hole always shows the true sky (or moon) behind him. */
const CREST =
  "M132 44C122 49 116 57 116 66C116 75 122 83 132 88C125 81 121 74 121 66C121 58 125 51 132 44Z";

interface FigureProps {
  gliding: boolean;
}

const MoonKnightFigure: React.FC<FigureProps> = React.memo(({ gliding }) => {
  // Framer restarts a keyframe animation when the target array is a new
  // reference, so these are memoised — otherwise every parent re-render
  // snaps the cape back to frame one.
  const flow = useMemo(
    () => ({
      // Cape catches air in the glide, hangs close when hovering
      spread: gliding ? [1, 1.07, 1] : [1, 1.02, 1],
      lift: gliding ? [1, 0.94, 1] : [1, 0.98, 1],
      cycle: gliding ? 1.6 : 4.4,
      bob: gliding ? [0, -5, 0] : [0, -11, 0],
    }),
    [gliding]
  );

  return (
    <motion.div
      animate={{ y: flow.bob }}
      transition={{ duration: flow.cycle, repeat: Infinity, ease: "easeInOut" }}
      className="h-[86px] w-[143px] sm:h-[104px] sm:w-[173px]"
    >
      <motion.svg
        viewBox="0 0 240 120"
        className="h-full w-full overflow-visible"
        animate={{ scaleX: flow.spread, scaleY: flow.lift }}
        transition={{ duration: flow.cycle, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transformOrigin: "50% 22%",
          filter: "drop-shadow(0 0 9px rgba(242,239,230,0.45))",
        }}
      >
        {/* Dark body, bone rim. Each half carries him over one backdrop: the
            near-black fill is the silhouette that reads against the lit moon,
            the bone outline is what reads against the night sky. evenodd is
            what makes the crescent a hole rather than a second filled shape
            sitting on the cape, and non-scaling-stroke keeps the rim an even
            weight while the cape flutter scales the path. */}
        <path
          d={`${GLIDER}${CREST}`}
          fillRule="evenodd"
          fill="#05070d"
          fillOpacity="0.92"
          stroke="#f2efe6"
          strokeWidth="1.6"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </motion.div>
  );
});

MoonKnightFigure.displayName = "MoonKnightFigure";

/**
 * Moon Knight mode's character.
 *
 * The edge lanes are taken — Deadpool has the floor, Spider-Man the right
 * rail, Thor the left margin, Venom the ceiling, Iron Man the open sky. So
 * this one glides THROUGH the backdrop, and it is routed to cross the moon
 * around mid-page, because a caped silhouette passing over the disc is the
 * shot this character is known for.
 *
 * He is a near-black body with a bone rim rather than a flat fill, because he
 * has to read against two very different backdrops. `mix-blend-mode:
 * difference` was tried first and looks clever — white inverts to dark over
 * the moon automatically — but difference only separates strongly when the
 * backdrop is near-black or near-white, and the moon is a mid-grey texture,
 * so he washed out over the exact thing he is supposed to be crossing.
 *
 * He glides while you scroll; when you stop he stops descending and hovers,
 * cape settling.
 */
export const MoonGlide: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();

  // A shallow arc across the sky. The moon sits at 50vw / 28vh, so the peak
  // of this path is tuned to put him over the disc at mid-scroll.
  const x = useTransform(scrollYProgress, [0, 1], ["-20vw", "104vw"]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["7vh", "27vh", "11vh"]);
  // Banks into the descent, levels out as he climbs away
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-9, 10, -6]);

  const [gliding, setGliding] = useState(false);
  const [facing, setFacing] = useState(1);
  const settleTimer = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < 0.5) return;

    // setState bails out when the value is unchanged, so hammering these on
    // every scroll frame is cheap after the first
    setFacing(delta > 0 ? 1 : -1);
    setGliding(true);
    clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setGliding(false), SETTLE_MS);
  });

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  return (
    <div className="fixed inset-0 z-[2] overflow-hidden pointer-events-none">
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div style={{ rotate: tilt }}>
          <motion.div
            animate={{ scaleX: gliding ? facing : 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <MoonKnightFigure gliding={gliding} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MoonGlide;
