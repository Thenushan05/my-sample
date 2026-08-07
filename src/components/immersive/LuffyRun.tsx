import React, { useEffect, useRef, useState } from "react";

const DIALOGS = [
  "I'm gonna be King of the Pirates!",
  "I'm hungry...",
  "GOMU GOMU NO...",
  "SHISHISHI! 😄",
  "I don't wanna be a hero!",
  "Meat!!!",
  "I won't lose!",
  "Let's go on an adventure!",
  "My nakama are the best!",
  "GEAR FIVE!!",
  "I'm not running away, I'm moving forward!",
  "Shanks gave me this hat!",
  "I'll surpass you!",
  "BAAAAH!!",
  "The sea is so big!",
];

/**
 * LuffyRun — animates the luggif.gif across the bottom of the viewport.
 * Runs left→right, flips horizontally, runs right→left, repeats.
 * Shows random manga-style speech bubbles while running.
 */
export const LuffyRun: React.FC = () => {
  const [posX, setPosX] = useState(-250);
  const [flipped, setFlipped] = useState(false);
  const [dialog, setDialog] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const directionRef = useRef<1 | -1>(1);
  const posRef = useRef(-250);
  const frameRef = useRef<number>(0);
  const dialogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDialogIndexRef = useRef(-1);

  const SPEED = 4;
  const SIZE = 220;

  const showRandomDialog = () => {
    // Pick a dialog that's different from the last one
    let idx: number;
    do { idx = Math.floor(Math.random() * DIALOGS.length); }
    while (idx === lastDialogIndexRef.current);
    lastDialogIndexRef.current = idx;

    setDialog(DIALOGS[idx]);
    setDialogVisible(true);

    // Hide after 2.5 seconds
    dialogTimerRef.current = setTimeout(() => {
      setDialogVisible(false);
      // Schedule next dialog between 2.5–5 seconds later
      dialogTimerRef.current = setTimeout(showRandomDialog, 2500 + Math.random() * 2500);
    }, 2500);
  };

  useEffect(() => {
    const animate = () => {
      const vw = window.innerWidth;
      posRef.current += SPEED * directionRef.current;

      if (directionRef.current === 1 && posRef.current > vw + SIZE) {
        directionRef.current = -1;
        setFlipped(true);
      }
      if (directionRef.current === -1 && posRef.current < -SIZE) {
        directionRef.current = 1;
        setFlipped(false);
      }

      setPosX(posRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Start first dialog after a short delay
    // Preload gif
    const img = new Image();
    img.src = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077244/portfolio/luggif.gif";

    dialogTimerRef.current = setTimeout(showRandomDialog, 1500);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 w-full pointer-events-none z-[9999]"
      style={{ height: `${SIZE + 80}px` }}
    >
      {/* Speech bubble */}
      {dialog && (
        <div
          style={{
            position: "absolute",
            bottom: "130px",
            left: 0,
            transform: `translateX(${posX + (flipped ? -20 : SIZE - 10)}px)`,
            maxWidth: "220px",
            opacity: dialogVisible ? 1 : 0,
            transition: "opacity 0.35s ease",
            pointerEvents: "none",
          }}
        >
          {/* Bubble box */}
          <div
            style={{
              background: "white",
              border: "2.5px solid #1a120a",
              borderRadius: "16px",
              padding: "8px 13px",
              fontFamily: "'Bangers', 'Comic Sans MS', cursive",
              fontSize: "14px",
              fontWeight: "700",
              color: "#1a120a",
              lineHeight: 1.3,
              letterSpacing: "0.02em",
              boxShadow: "3px 3px 0 #1a120a",
              whiteSpace: "nowrap",
              maxWidth: "220px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {dialog}
          </div>
          {/* Tail pointing down toward Luffy */}
          <div
            style={{
              position: "absolute",
              bottom: "-12px",
              left: flipped ? "auto" : "18px",
              right: flipped ? "18px" : "auto",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "12px solid #1a120a",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-9px",
              left: flipped ? "auto" : "19px",
              right: flipped ? "19px" : "auto",
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "11px solid white",
            }}
          />
        </div>
      )}

      {/* Luffy GIF */}
      <img
        src="https://res.cloudinary.com/dbotzlymk/image/upload/v1786077244/portfolio/luggif.gif"
        alt="Luffy running"
        style={{
          position: "absolute",
          bottom: "8px",
          left: 0,
          width: `${SIZE}px`,
          height: "auto",
          transform: `translateX(${posX}px) scaleX(${flipped ? -1 : 1})`,
          willChange: "transform",
          imageRendering: "auto",
        }}
      />
    </div>
  );
};

export default LuffyRun;
