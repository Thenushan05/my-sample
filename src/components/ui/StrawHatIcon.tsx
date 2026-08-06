import React from "react";

interface StrawHatIconProps {
  className?: string;
  /** Bleach it out to a dormant state when the mode is inactive. */
  muted?: boolean;
}

/**
 * The straw hat, seen slightly from the front-above — the crown, the brim,
 * and the red band that is the whole point of the object.
 *
 * Not a generic sun hat: the brim is wide and uneven, the crown is short, and
 * the band sits high and thick. Those three proportions are the difference
 * between "straw hat" and "any hat", and they have to survive at 16px in the
 * navbar, so everything else is left out.
 */
export const StrawHatIcon: React.FC<StrawHatIconProps> = ({ className, muted }) => {
  const straw = muted ? "#c9b58a" : "#edb945";
  const strawDark = muted ? "#a8946f" : "#d09a2c";
  const band = muted ? "#9c6f68" : "#c3352a";
  const ink = "#241a10";

  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden>
      {/* Brim — wide, slightly lopsided, the way woven straw sits */}
      <path
        d="M2 27C2 22.4 11.9 18.8 24 18.8S46 22.4 46 27c0 4.6-9.9 8.2-22 8.2S2 31.6 2 27Z"
        fill={straw}
        stroke={ink}
        strokeWidth="2"
      />
      {/* Underside shadow, so the brim reads as a disc and not a blob */}
      <path
        d="M4.4 29.2C7.9 32.7 15.4 35.2 24 35.2s16.1-2.5 19.6-6c-1 4-9.7 7-19.6 7s-18.6-3-19.6-7Z"
        fill={strawDark}
      />
      {/* Crown — short and rounded */}
      <path
        d="M11.6 22.6c0-7.6 5.5-13.8 12.4-13.8s12.4 6.2 12.4 13.8"
        fill={straw}
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* The red band, high on the crown */}
      <path
        d="M11.9 20.4c3.4-1.6 7.6-2.5 12.1-2.5s8.7.9 12.1 2.5c-.2 1.4-.4 2.2-.4 2.2-3.5-1.5-7.4-2.3-11.7-2.3s-8.2.8-11.7 2.3c0 0-.2-.8-.4-2.2Z"
        fill={band}
        stroke={ink}
        strokeWidth="1.4"
      />
      {/* Two straw weave marks — enough to say "woven" without noise */}
      <path
        d="M17.2 12.6c1 3.2 1.2 6.4.8 9.4M30.4 12.6c-1 3.2-1.2 6.4-.8 9.4"
        stroke={strawDark}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default StrawHatIcon;
