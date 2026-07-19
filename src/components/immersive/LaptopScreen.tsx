import React from "react";

interface LaptopScreenProps {
  children?: React.ReactNode;
}

export const LaptopScreen: React.FC<LaptopScreenProps> = ({ children }) => {
  return (
    <div className="w-full h-full relative bg-[#0b0f19] flex flex-col select-none overflow-hidden">
      {/* Premium wallpaper background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.15)_0%,transparent_60%)]" />

      {/* Simulated Desktop Header / OS Status Bar */}
      <div className="w-full h-6 border-b border-white/5 bg-black/40 px-3 flex items-center justify-between text-[9px] text-white/50 font-mono tracking-wider relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
          <span className="ml-1 text-[8px] font-bold text-white/40 uppercase">OS v1.0.0</span>
        </div>
        <span className="text-[8px] font-bold">THENUSHAN_PORTFOLIO.EXE</span>
        <div className="flex items-center gap-2">
          <span>127.0.0.1</span>
          <span className="text-white/60">ONLINE</span>
        </div>
      </div>

      {/* Screen Work Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col p-4">
        {children}
      </div>
    </div>
  );
};
export default LaptopScreen;
