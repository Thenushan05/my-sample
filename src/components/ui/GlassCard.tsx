import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(59, 130, 246, 0.05)",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
      className={`glass-card relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] 
      [.ironman_&]:rounded-none [.ironman_&]:border-cyan-500/30 [.ironman_&]:bg-[#031b29]/40 [.ironman_&]:hover:bg-[#031b29]/60 [.ironman_&]:shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]
      ${onClick ? "cursor-pointer hover:-translate-y-0.5 [.ironman_&]:hover:border-cyan-400" : ""
        } ${className}`}
    >
      {/* Iron Man HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/80 z-20 pointer-events-none hidden [.ironman_&]:block transition-colors group-hover:border-amber-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/80 z-20 pointer-events-none hidden [.ironman_&]:block transition-colors group-hover:border-amber-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/80 z-20 pointer-events-none hidden [.ironman_&]:block transition-colors group-hover:border-amber-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/80 z-20 pointer-events-none hidden [.ironman_&]:block transition-colors group-hover:border-amber-400" />

      {/* Accent hover glow */}
      <div
        className="absolute -inset-px bg-radial-glow opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
export default GlassCard;
