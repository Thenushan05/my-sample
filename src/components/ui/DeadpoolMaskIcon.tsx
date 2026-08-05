import React from "react";

interface DeadpoolMaskIconProps {
  className?: string;
  /** Dim the mask to a muted state when the mode is inactive. */
  muted?: boolean;
}

/**
 * Deadpool mask, drawn inline so it scales and recolours cleanly.
 * Iron Man and Spider-Man use PNG logos; this mode gets vector art
 * because the lenses need to stay crisp at 20px in the navbar.
 */
export const DeadpoolMaskIcon: React.FC<DeadpoolMaskIconProps> = ({ className, muted }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Mask base */}
    <path
      d="M32 2.5c11.9 0 19.9 7.4 19.9 21 0 15-8.6 32.8-19.9 38.4C20.7 56.3 12.1 38.5 12.1 23.5c0-13.6 8-21 19.9-21Z"
      fill={muted ? "#7f1020" : "#c01128"}
    />
    {/* Upper highlight so the latex reads as curved */}
    <path
      d="M32 2.5c11.9 0 19.9 7.4 19.9 21 0 3-.35 6.2-1 9.4C46.2 26.4 39.7 22.6 32 22.6s-14.2 3.8-18.9 10.3c-.65-3.2-1-6.4-1-9.4 0-13.6 8-21 19.9-21Z"
      fill="#ffffff"
      opacity={muted ? 0.05 : 0.1}
    />
    {/* Centre seam */}
    <path d="M32 44.5v15.5" stroke="#4a0410" strokeWidth="1.4" opacity="0.7" />

    {/* Left eye patch */}
    <path
      d="M16.6 21.4c3.1-4.2 9.4-5.6 12.4-.4 1.2 2.1.9 5.2-.7 8.4-1.9 3.9-5.6 5.9-9.1 4.6-3.6-1.3-5.1-8-2.6-12.6Z"
      fill="#120b0c"
    />
    {/* Right eye patch */}
    <path
      d="M47.4 21.4c-3.1-4.2-9.4-5.6-12.4-.4-1.2 2.1-.9 5.2.7 8.4 1.9 3.9 5.6 5.9 9.1 4.6 3.6-1.3 5.1-8 2.6-12.6Z"
      fill="#120b0c"
    />
    {/* Left lens */}
    <path
      d="M19 22.7c2.3-3.1 7-4.1 8.8-.4.8 1.6.5 3.9-.7 6.2-1.4 2.7-4.1 4.1-6.5 3.2-2.5-1-3.4-5.7-1.6-9Z"
      fill={muted ? "#d8d4cb" : "#fffdf5"}
    />
    {/* Right lens */}
    <path
      d="M45 22.7c-2.3-3.1-7-4.1-8.8-.4-.8 1.6-.5 3.9.7 6.2 1.4 2.7 4.1 4.1 6.5 3.2 2.5-1 3.4-5.7 1.6-9Z"
      fill={muted ? "#d8d4cb" : "#fffdf5"}
    />
  </svg>
);

export default DeadpoolMaskIcon;
