import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 py-10 bg-[#030712] relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
            AC
          </div>
          <span className="footer-text text-white/40 text-xs font-medium tracking-wide">
            Thenushan Sritharan — Software Engineer & Product Builder
          </span>
        </div>
        <div className="text-center md:text-right">
          <p className="footer-copyright text-white/20 text-[11px] tracking-wide">
            © {new Date().getFullYear()} Thenushan Sritharan. Built with React, TypeScript, GSAP, & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
};
