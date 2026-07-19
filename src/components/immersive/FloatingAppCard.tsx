import React from "react";
import { type AppData } from "../../data/apps";

interface FloatingAppCardProps {
  app: AppData;
  isActive: boolean;
  style?: React.CSSProperties;
}

// High-fidelity SVG logo rendering helper
const RenderTechLogo: React.FC<{ appId: string }> = ({ appId }) => {
  switch (appId) {
    case "react":
      return (
        <svg className="w-16 h-16 animate-[spin_20s_linear_infinite]" viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      );
    case "typescript":
      return (
        <svg className="w-14 h-14 rounded-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#3178C6" rx="12"/>
          <path d="M70.9 59.8c-1.9-1-4.2-1.7-6.9-1.7-3.4 0-5.7 1.8-5.7 4.5 0 2.8 2.2 4 6.7 5.6 6 2.1 10.1 4.7 10.1 11.2 0 7.4-5.8 11.8-15 11.8-6.1 0-11.5-2.2-14.2-4.1l3.5-7.5c2.4 1.7 6.8 3.5 10.7 3.5 4.5 0 6.8-2 6.8-4.7 0-3-2.5-4.2-7.2-5.9-5.7-2-9.6-4.9-9.6-10.8 0-6.9 5.5-11.4 13.9-11.4 5.3 0 9.8 1.7 12 2.9l-3 7.8zM39.6 42.8H18.7V34H53v8.8H32.1v48.4H18.7V42.8z" fill="#ffffff"/>
        </svg>
      );
    case "node":
      return (
        <svg className="w-14 h-14" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 8.7L24.8 31.3v45.2L64 99.1l39.2-22.6V31.3L64 8.7z" fill="#339933"/>
          <path d="M64 16.4l31.5 18.2v36.3L64 89.1 32.5 70.9V34.6L64 16.4z" fill="#339933" opacity="0.5"/>
          <path d="M64 35.6v33.4l28.9-16.7V19L64 35.6z" fill="#ffffff" opacity="0.9"/>
          <path d="M64 35.6L35.1 19v33.3l28.9 16.7V35.6z" fill="#ffffff" opacity="0.75"/>
        </svg>
      );
    case "python":
      return (
        <svg className="w-14 h-14" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M54.1 3c-28 0-26.3 12.1-26.3 12.1v9.6h26.7v3.7H27.3c-15.6 0-24.3 10.6-24.3 24.3 0 13.8 8.1 23.4 20.6 23.4h11.1v-15.6c0-10.7 8.9-19.6 19.6-19.6h19.6V27.3C73.9 11.2 59.8 3 54.1 3z" fill="#3776AB"/>
          <path d="M55.9 107c28 0 26.3-12.1 26.3-12.1v-9.6H55.5v-3.7h27.2c15.6 0 24.3-10.6 24.3-24.3 0-13.8-8.1-23.4-20.6-23.4H75.3v15.6c0 10.7-8.9 19.6-19.6 19.6H36.1v13.9c0 16.1 14.1 24.3 19.8 24.3z" fill="#FFD43B"/>
          <circle cx="40" cy="12" r="3" fill="#ffffff"/>
          <circle cx="70" cy="98" r="3" fill="#111"/>
        </svg>
      );
    case "docker":
      return (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="#2496ED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          {/* Whale body */}
          <path d="M2 12c.6 0 1.2-.2 1.7-.5.5-.3 1-.7 1.3-1.2.6.4 1.3.7 2 .7.7 0 1.4-.3 2-.7.3.5.8.9 1.3 1.2.5.3 1.1.5 1.7.5.6 0 1.2-.2 1.7-.5.5-.3 1-.7 1.3-1.2.6.4 1.3.7 2 .7.7 0 1.4-.3 2-.7.3.5.8.9 1.3 1.2.5.3 1.1.5 1.7.5.3 0 .6-.1.8-.2.8 1.4 2 2.2 3.2 2.2H22s1-2.5 1-4c0-2-1.5-3.5-3-3.5h-1c-.5-1.5-1.5-2-3-2H7c-1.5 0-2.5.5-3 2H3c-1.5 0-3 1.5-3 3.5 0 1.5 1 4 1 4h1z" />
          {/* Stacked container boxes */}
          <rect x="5" y="4" width="2" height="2" fill="#2496ED" opacity="0.8"/>
          <rect x="8" y="4" width="2" height="2" fill="#2496ED" opacity="0.8"/>
          <rect x="11" y="4" width="2" height="2" fill="#2496ED" opacity="0.8"/>
          <rect x="6.5" y="1" width="2" height="2" fill="#2496ED" opacity="0.8"/>
          <rect x="9.5" y="1" width="2" height="2" fill="#2496ED" opacity="0.8"/>
        </svg>
      );
    default:
      return null;
  }
};

export const FloatingAppCard: React.FC<FloatingAppCardProps> = ({
  app,
  isActive,
  style,
}) => {
  return (
    <div
      style={{
        ...style,
        "--app-accent": app.color,
      } as React.CSSProperties}
      className={`absolute w-48 aspect-[3/4] rounded-2xl border bg-black/60 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-500 ease-out select-none shadow-2xl ${
        isActive
          ? "border-white/20 shadow-[0_0_35px_rgba(var(--app-accent),0.25)]"
          : "border-white/5 opacity-40 scale-90"
      }`}
    >
      {/* Front Face Accent Glow */}
      <div 
        className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(120px circle at 50% 20%, ${app.color}30, transparent 60%)`,
        }}
      />

      <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-between">
        {/* App Header Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase font-mono">
            TECH_SYS
          </span>
          <span style={{ color: app.color }} className="text-[8px] font-bold font-mono">
            ACTIVE
          </span>
        </div>

        {/* Large Centered Brand Logo */}
        <div className="flex-1 flex items-center justify-center py-4">
          <RenderTechLogo appId={app.id} />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold tracking-wide text-white uppercase font-mono">
            {app.title}
          </h3>
          <p className="text-[9px] leading-relaxed text-white/50">
            {app.description}
          </p>
        </div>
      </div>

      {/* Decorative footer details */}
      <div className="relative z-10 border-t border-white/5 pt-3 flex items-center justify-between text-[8px] text-white/30 font-mono">
        <span>CORE ENGINE</span>
        <span style={{ color: app.color }} className="font-bold">
          0x0F0{app.id.length}
        </span>
      </div>
    </div>
  );
};
export default FloatingAppCard;
