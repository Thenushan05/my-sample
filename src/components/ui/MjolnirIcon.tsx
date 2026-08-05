import React from "react";

interface MjolnirIconProps {
  className?: string;
  /** Dim the metal to a muted state when the mode is inactive. */
  muted?: boolean;
}

/**
 * Mjölnir, drawn inline so the engraving stays crisp at 20px in the navbar.
 * Spider-Man and Iron Man use PNG logos; the vector modes (Deadpool, Thor)
 * get SVG so they can recolour per state.
 */
export const MjolnirIcon: React.FC<MjolnirIconProps> = ({ className, muted }) => {
  const head = muted ? "#6b7280" : "#b9c6d6";
  const headDark = muted ? "#454c56" : "#6d7d90";
  const bronze = muted ? "#6b5636" : "#d4af6a";
  const spark = muted ? "#8fa3b8" : "#e0f2fe";

  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Handle */}
      <rect x="29" y="30" width="6" height="30" rx="2" fill={bronze} />
      {/* Leather wrap */}
      {[36, 42, 48, 54].map((y) => (
        <rect key={y} x="28" y={y} width="8" height="2.4" rx="1" fill={muted ? "#3f3527" : "#7a5c33"} />
      ))}
      {/* Pommel loop */}
      <circle cx="32" cy="60.5" r="2.6" fill="none" stroke={bronze} strokeWidth="1.6" />

      {/* Hammer head */}
      <path
        d="M11 12h42a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z"
        fill={head}
        stroke="#0b1220"
        strokeWidth="1.6"
      />
      {/* Struck faces, darker at the ends */}
      <path d="M8 15a3 3 0 0 1 3-3h5v20h-5a3 3 0 0 1-3-3V15Z" fill={headDark} />
      <path d="M48 12h5a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5V12Z" fill={headDark} />
      {/* Bronze binding across the head */}
      <rect x="24" y="10.5" width="16" height="23" rx="2" fill="none" stroke={bronze} strokeWidth="2" />
      {/* Rune cut into the face */}
      <path d="M32 15.5v12.5M32 17.5l4 3-4 3" stroke={spark} strokeWidth="1.7" fill="none" strokeLinecap="round" />

      {/* Lightning arcing off the head */}
      <path
        d="M5 33l4.5 1.5-3 3 5 1"
        stroke={spark}
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={muted ? 0.4 : 1}
      />
      <path
        d="M59 33l-4.5 1.5 3 3-5 1"
        stroke={spark}
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={muted ? 0.4 : 1}
      />
    </svg>
  );
};

export default MjolnirIcon;
