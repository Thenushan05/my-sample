import React, { useEffect, useRef, useState } from "react";

/**
 * LuffyRun — animates the luggif.gif across the bottom of the viewport.
 * Runs left→right, flips horizontally, runs right→left, repeats.
 */
export const LuffyRun: React.FC = () => {
  const [posX, setPosX] = useState(-120);
  const [flipped, setFlipped] = useState(false);
  const directionRef = useRef<1 | -1>(1); // 1 = left→right, -1 = right→left
  const posRef = useRef(-120);
  const frameRef = useRef<number>(0);
  const SPEED = 3.5; // px per frame
  const SIZE = 100; // gif display width in px

  useEffect(() => {
    const animate = () => {
      const vw = window.innerWidth;
      posRef.current += SPEED * directionRef.current;

      // Hit the right edge → flip direction
      if (directionRef.current === 1 && posRef.current > vw + SIZE) {
        directionRef.current = -1;
        setFlipped(true);
      }

      // Hit the left edge → flip direction
      if (directionRef.current === -1 && posRef.current < -SIZE) {
        directionRef.current = 1;
        setFlipped(false);
      }

      setPosX(posRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 w-full pointer-events-none z-[9999]"
      style={{ height: `${SIZE + 16}px` }}
    >
      <img
        src="/luggif.gif"
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
