import React from "react";
import { motion } from "framer-motion";

export const IronManWalk: React.FC = () => {
  React.useEffect(() => {
    const img = new Image();
    img.src = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077184/portfolio/12773.gif";
  }, []);

  return (
    <>
      {/* SVG Filter to dynamically remove pure white backgrounds */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="remove-white" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -1.5 -1.5 -1.5 4 0
              "
            />
          </filter>
        </defs>
      </svg>

      <div className="fixed bottom-0 left-0 w-full z-[55] pointer-events-none overflow-hidden h-48 md:h-64 flex items-end">
        <motion.div 
          animate={{ 
            x: ["-20vw", "110vw", "110vw", "-20vw"],
            scaleX: [1, 1, -1, -1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear",
            times: [0, 0.49, 0.51, 1]
          }}
          className="relative h-40 md:h-56 mb-2"
        >
          <img 
            src="https://res.cloudinary.com/dbotzlymk/image/upload/v1786077184/portfolio/12773.gif"
            alt="Iron Man Walking"
            className="h-full w-auto object-contain drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)]"
            style={{ 
              filter: "url(#remove-white) drop-shadow(0 0 10px rgba(6,182,212,0.5))" 
            }}
          />
        </motion.div>
      </div>
    </>
  );
};
