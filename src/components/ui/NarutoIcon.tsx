import React from "react";

interface NarutoIconProps {
  className?: string;
  /** Bleach it toward the dormant tone when the mode is inactive. */
  muted?: boolean;
}

/**
 * A forehead protector — steel plate, cloth strap either side, a leaf-
 * like swirl engraved in the centre. Zoro's mark on this project is
 * three crossed blades; Luffy's is a straw hat. His is the one thing
 * every hidden-village ninja wears, so the plate is the icon, not a
 * portrait.
 *
 * The engraving is an original spiral/leaf glyph, not a reproduction of
 * any studio's registered village emblem — same policy as every other
 * icon in this set (StrawHatIcon, KatanaIcon): code-drawn shapes only.
 */
export const NarutoIcon: React.FC<NarutoIconProps> = ({ className, muted }) => {
  const cloth = muted ? "#4a4038" : "#7a5a2e";
  const steel = muted ? "#7d8a8d" : "#a9b4b8";
  const steelDark = muted ? "#565f61" : "#6f7a7d";
  const glyph = muted ? "#5c6668" : "#ff9736";
  const ink = "#0d0a06";

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {/* Cloth strap, trailing either side of the plate */}
      <path d="M4 22L15 19.5L15 28.5L4 30Z" fill={cloth} stroke={ink} strokeWidth="1" />
      <path d="M44 22L33 19.5L33 28.5L44 30Z" fill={cloth} stroke={ink} strokeWidth="1" />

      {/* The steel plate */}
      <rect x="12" y="15" width="24" height="18" rx="3" fill={steel} stroke={ink} strokeWidth="1.4" />
      <rect x="12" y="15" width="24" height="6" rx="3" fill={steelDark} opacity="0.55" />

      {/* The engraved swirl — an original leaf-like glyph */}
      <path
        d="M24 19.5C27.5 19.5 30 22 30 24.8C30 27 28.3 28.4 26.4 28.4C24.9 28.4 23.9 27.4 23.9 26.2C23.9 25.2 24.6 24.5 25.5 24.5C26.1 24.5 26.5 24.9 26.5 25.4"
        fill="none"
        stroke={glyph}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24.4" r="1.15" fill={glyph} />
    </svg>
  );
};

export default NarutoIcon;
