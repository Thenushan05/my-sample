import React from "react";

interface CrescentIconProps {
  className?: string;
  /** Dim to a waning state when the mode is inactive. */
  muted?: boolean;
}

/**
 * Moon Knight's emblem: the crescent, cut the way his chest plate and
 * throwing darts are — a hard inner bite rather than a soft lune, with the
 * horns drawn out to points.
 *
 * Built as a single filled path (outer circle minus an offset inner circle,
 * traced by hand) so it stays crisp at 20px in the navbar, with a gold
 * inscription ring that only appears in the active state.
 */
export const CrescentIcon: React.FC<CrescentIconProps> = ({ className, muted }) => {
  const bone = muted ? "#8d9199" : "#f2efe6";
  const gold = muted ? "#6b5a2a" : "#c9a227";

  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Inscription ring — the band of glyphs around the emblem */}
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke={gold}
        strokeWidth="1.6"
        opacity={muted ? 0.35 : 0.75}
      />
      <circle
        cx="32"
        cy="32"
        r="25.5"
        fill="none"
        stroke={gold}
        strokeWidth="0.8"
        opacity={muted ? 0.2 : 0.45}
        strokeDasharray="2 4"
      />

      {/* The crescent: horns pulled to points, bite taken from the right */}
      <path
        d="M40 6.5C26.5 9 16.5 19.6 16.5 32.5S26.5 56 40 58.5C29.5 52.5 23 43 23 32.5S29.5 12.5 40 6.5Z"
        fill={bone}
        style={{ filter: muted ? "none" : "drop-shadow(0 0 4px rgba(242,239,230,0.85))" }}
      />

      {/* Cold rim-light down the inner edge of the crescent */}
      <path
        d="M40 6.5C29.5 12.5 23 21.9 23 32.5S29.5 52.5 40 58.5"
        fill="none"
        stroke={muted ? "#b9bcc2" : "#ffffff"}
        strokeWidth="1.2"
        opacity={muted ? 0.4 : 0.9}
      />
    </svg>
  );
};

export default CrescentIcon;
