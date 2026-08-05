import React from "react";

interface VenomSpiderIconProps {
  className?: string;
  /** Dim the symbiote to a dormant state when the mode is inactive. */
  muted?: boolean;
}

/**
 * Venom's chest emblem — the sprawling white symbiote spider.
 *
 * Not the neat Spider-Man silhouette: this one's legs are long, uneven and
 * splayed right across the ribs, which is the whole visual difference between
 * the two suits. Kept as inline SVG so it stays legible at 20px in the navbar
 * and can be dimmed for the inactive state.
 */
export const VenomSpiderIcon: React.FC<VenomSpiderIconProps> = ({ className, muted }) => {
  const web = muted ? "#8f96a3" : "#f4f7fb";
  const glow = muted ? "none" : "drop-shadow(0 0 3px rgba(233,237,242,0.9))";

  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g style={{ filter: glow }}>
        {/* Body: narrow head, long tapering abdomen */}
        <path
          d="M32 15c3.2 0 5 2.1 5 4.6 0 1.7-.8 2.9-1.6 3.8 1.6 1.6 2.6 3.8 2.6 7 0 6.2-2.6 13.2-6 18.6-3.4-5.4-6-12.4-6-18.6 0-3.2 1-5.4 2.6-7-.8-.9-1.6-2.1-1.6-3.8 0-2.5 1.8-4.6 5-4.6Z"
          fill={web}
        />

        {/* Upper leg pair — sweeping almost horizontally out to the arms */}
        <path
          d="M28.5 22.5C23 20 15 18.5 5 19.5c9.2 1.9 15.6 4.4 20.5 8.2"
          fill="none"
          stroke={web}
          strokeWidth="3.1"
          strokeLinecap="round"
        />
        <path
          d="M35.5 22.5C41 20 49 18.5 59 19.5c-9.2 1.9-15.6 4.4-20.5 8.2"
          fill="none"
          stroke={web}
          strokeWidth="3.1"
          strokeLinecap="round"
        />

        {/* Mid pair — kinked, dropping down the flank */}
        <path
          d="M28 29C22.5 29.5 15 32.5 9 38.5c6.5-3.6 12-5.2 17.5-5.4"
          fill="none"
          stroke={web}
          strokeWidth="2.7"
          strokeLinecap="round"
        />
        <path
          d="M36 29C41.5 29.5 49 32.5 55 38.5c-6.5-3.6-12-5.2-17.5-5.4"
          fill="none"
          stroke={web}
          strokeWidth="2.7"
          strokeLinecap="round"
        />

        {/* Lower pair — long, reaching down toward the waist */}
        <path
          d="M28.8 36C24.5 38.5 19.5 44 16 52c3.8-6.4 7.6-10.4 11.6-12.6"
          fill="none"
          stroke={web}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M35.2 36C39.5 38.5 44.5 44 48 52c-3.8-6.4-7.6-10.4-11.6-12.6"
          fill="none"
          stroke={web}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default VenomSpiderIcon;
