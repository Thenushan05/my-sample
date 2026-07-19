import React from "react";
import { LAPTOP_SCREEN } from "../../config/laptop";

interface LaptopFrameProps {
  children?: React.ReactNode;
  screenGlow?: number; // opacity multiplier 0 to 1
}

export const LaptopFrame: React.FC<LaptopFrameProps> = ({
  children,
  screenGlow = 0,
}) => {
  return (
    <div className="relative w-full aspect-[16/10] max-w-[850px] mx-auto select-none">
      {/* Laptop Lid/Bezel Shadow */}
      <div className="absolute -inset-x-8 -bottom-4 h-8 bg-black/40 rounded-[50%] blur-xl pointer-events-none" />

      {/* Screen Bezel / Upper Chassis */}
      <div className="absolute inset-0 bg-[#1e2022] rounded-3xl border border-[#37393b] p-3 shadow-2xl flex flex-col justify-between">
        {/* Webcam / Bezel details */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-black border border-white/5" />
          <div className="w-1 h-1 rounded-full bg-[#111] opacity-70" />
        </div>

        {/* Screen Display Area (configured bounds) */}
        <div
          className="absolute overflow-hidden bg-black border border-neutral-900 rounded-lg"
          style={{
            left: LAPTOP_SCREEN.left,
            top: LAPTOP_SCREEN.top,
            width: LAPTOP_SCREEN.width,
            height: LAPTOP_SCREEN.height,
          }}
        >
          {/* Internal screen content */}
          {children}

          {/* Dynamic screen glow reflection layer */}
          <div
            className="absolute inset-0 bg-blue-500/10 pointer-events-none transition-opacity duration-300 mix-blend-screen"
            style={{ opacity: screenGlow }}
          />
        </div>
      </div>

      {/* Laptop Lower Chassis (Base & Keyboard) */}
      <div className="absolute left-[-4%] right-[-4%] bottom-[-5%] h-[8%] bg-[#1a1b1d] rounded-b-2xl border-t border-[#46484a] shadow-md flex items-center justify-center">
        {/* Bezel lip / indent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-[#111] rounded-b-md" />

        {/* Trackpad area */}
        <div className="w-32 h-[80%] border border-[#303234]/60 bg-[#121314] rounded-md shadow-inner mt-1 opacity-70" />
      </div>
    </div>
  );
};
export default LaptopFrame;
