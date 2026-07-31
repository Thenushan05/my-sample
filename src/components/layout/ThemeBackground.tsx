import React from "react";

export const ThemeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#030712] dark:bg-[#030712]">
      {/* Deep navy radial gradient glow (dark mode) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.95)_0%,rgba(3,7,18,1)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.95)_0%,rgba(3,7,18,1)_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 dark:bg-violet-600/5 rounded-full blur-[120px]" />

      {/* Light mode subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:hidden [.spiderman_&]:hidden" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/30 dark:hidden [.spiderman_&]:hidden rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-200/30 dark:hidden [.spiderman_&]:hidden rounded-full blur-[120px]" />

      {/* Fine technical grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
export default ThemeBackground;
