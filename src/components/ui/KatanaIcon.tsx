import React from "react";

interface KatanaIconProps {
  className?: string;
  /** Bleach it toward the dormant tone when the mode is inactive. */
  muted?: boolean;
}

/**
 * Three crossed blades over a haramaki knot — Zoro's mark, the way a
 * spider is Spider-Man's and a crescent is Moon Knight's.
 *
 * Three swords rather than one is the whole point: the icon has to read
 * as Santoryu specifically, not "a sword icon," and three trumps one at
 * a glance. Kept as inline SVG so it stays legible at 16px in the navbar.
 */
export const KatanaIcon: React.FC<KatanaIconProps> = ({ className, muted }) => {
  const steel = muted ? "#7d8a8d" : "#ececdd";
  const steelDark = muted ? "#5f696c" : "#9fb4bc";
  const hilt = muted ? "#4a3c3c" : "#3a1620";
  const sash = muted ? "#5c4448" : "#b23a4a";
  const ink = "#0a0d0b";

  const blade = (rotate: number, key: string) => (
    <g key={key} transform={`rotate(${rotate} 24 24)`}>
      {/* Blade */}
      <path
        d="M24 4L26 5.4L24.7 27L23.3 27L22 5.4Z"
        fill={steel}
        stroke={ink}
        strokeWidth="0.6"
      />
      {/* Blade centreline highlight */}
      <path d="M24 6L24 26" stroke={steelDark} strokeWidth="0.5" opacity="0.7" />
      {/* Guard */}
      <rect x="20.5" y="26.6" width="7" height="1.8" rx="0.5" fill={hilt} stroke={ink} strokeWidth="0.5" />
      {/* Hilt */}
      <rect x="22.3" y="28.2" width="3.4" height="7" rx="1" fill={hilt} stroke={ink} strokeWidth="0.5" />
    </g>
  );

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {/* The haramaki knot, low and centred — everything crosses through it */}
      <ellipse cx="24" cy="36" rx="7.5" ry="4" fill={sash} stroke={ink} strokeWidth="1" />
      <path d="M18 35.4C20.5 37.6 27.5 37.6 30 35.4" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.5" />

      <g transform="translate(0 -6)">
        {blade(-32, "left")}
        {blade(32, "right")}
        {blade(0, "centre")}
      </g>
    </svg>
  );
};

export default KatanaIcon;
