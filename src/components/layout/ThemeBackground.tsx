import React from "react";

export const ThemeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-700 pointer-events-none select-none">
      
      {/* ── DARK MODE AMBIENT LIGHTS ── */}
      <div className="absolute inset-0 hidden dark:block [.spiderman_&]:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,24,39,0.98)_0%,rgba(3,7,18,1)_100%)]" />
        {/* Soft, ultra-subtle tech radial glows */}
        <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[15%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[550px] h-[550px] bg-sky-600/5 rounded-full blur-[150px]" />
      </div>

      {/* ── LIGHT MODE AMBIENT LIGHTS ── */}
      <div className="absolute inset-0 dark:hidden [.spiderman_&]:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
        <div className="absolute top-[5%] left-[15%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-[45%] right-[10%] w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[160px]" />
      </div>

      {/* ── SUBTLE ELEGANT TECH GRID (VERY LOW OPACITY - ZERO TEXT INTERFERENCE) ── */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] [.spiderman_&]:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── SOFT FAINT RADIAL CROSSHAIR DOTS AT GRID INTERSECTIONS ── */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] [.spiderman_&]:hidden"
        style={{
          backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.8) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: "-0.5px -0.5px",
        }}
      />
    </div>
  );
};

export default ThemeBackground;
