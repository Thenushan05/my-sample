import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SpidermanDrop: React.FC = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Unmount after 8.5 seconds when the slowed-down animation finishes
    const timer = setTimeout(() => {
      setShow(false);
    }, 8500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "-100vh" }}
          animate={{ y: ["-100vh", "5vh", "5vh", "-100vh"] }}
          transition={{ duration: 8, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
          className="fixed top-0 left-1/2 -translate-x-1/2 md:left-3/4 z-[80] pointer-events-none flex flex-col items-center"
        >
          {/* Web thread stretching up to the top of the screen */}
          <div className="w-[1.5px] h-[100vh] absolute bottom-[90%] bg-gradient-to-t from-white/90 to-transparent shadow-[0_0_10px_#ffffff]" />
          
          <div className="relative flex justify-center">
            {/* 
              This white blob is positioned behind his head. 
              Since the SVG filter removes ALL white (including the background AND his eyes), 
              his eyes become transparent. This blob shines through the transparent eyes, 
              keeping them white without showing a white box background! 
            */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[30%] h-[30%] bg-white blur-md rounded-full" />
            
            <img 
              src="https://res.cloudinary.com/dbotzlymk/image/upload/v1786077206/portfolio/e01c53683465d1222380d29e5cc77837.gif"
              alt="Spider-Man Drop"
              className="w-48 sm:w-72 object-contain relative z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
              style={{ 
                filter: "url(#remove-white-spidey)"
              }}
            />
          </div>

          {/* SVG filter to completely eliminate the white background (and inadvertently the eyes) */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <filter id="remove-white-spidey" colorInterpolationFilters="sRGB">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
