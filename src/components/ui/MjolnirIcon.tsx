import React from "react";

interface MjolnirIconProps {
  className?: string;
  /** Dim the metal to a muted state when the mode is inactive. */
  muted?: boolean;
}

/**
 * Mjölnir.
 *
 * Modelled on the screen prop rather than the flat amulet outline: the
 * striking faces protrude past the head body, a bronze band straddles the
 * middle, and the shaft is leather-wrapped down to a strap loop. Kept as
 * inline SVG so it stays crisp at 20px in the navbar and can be recoloured
 * for the inactive state.
 *
 * Geometry matches the large background hammer in AsgardSigils, just with
 * detail dropped for legibility at icon size.
 */
export const MjolnirIcon: React.FC<MjolnirIconProps> = ({ className, muted }) => {
  const id = muted ? "mut" : "act";

  return (
    <svg viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`mj-steel-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={muted ? "#9aa5b1" : "#eef4fa"} />
          <stop offset="16%" stopColor={muted ? "#7c8894" : "#c2cfdd"} />
          <stop offset="46%" stopColor={muted ? "#5a6570" : "#8496aa"} />
          <stop offset="76%" stopColor={muted ? "#3a434d" : "#4d5c6e"} />
          <stop offset="100%" stopColor={muted ? "#242b32" : "#28323d"} />
        </linearGradient>
        <linearGradient id={`mj-cap-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={muted ? "#828d99" : "#c9d6e4"} />
          <stop offset="24%" stopColor={muted ? "#616c78" : "#94a5b8"} />
          <stop offset="66%" stopColor={muted ? "#333c45" : "#3f4d5d"} />
          <stop offset="100%" stopColor={muted ? "#1b2127" : "#1c242d"} />
        </linearGradient>
        <linearGradient id={`mj-bronze-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={muted ? "#9c8556" : "#f4e0ab"} />
          <stop offset="32%" stopColor={muted ? "#7d6840" : "#d4af6a"} />
          <stop offset="70%" stopColor={muted ? "#574627" : "#9a7638"} />
          <stop offset="100%" stopColor={muted ? "#372c16" : "#5f451e"} />
        </linearGradient>
        <linearGradient id={`mj-leather-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#171008" />
          <stop offset="30%" stopColor={muted ? "#3a2b1c" : "#4d3823"} />
          <stop offset="58%" stopColor="#3a2a19" />
          <stop offset="100%" stopColor="#120c06" />
        </linearGradient>
        <linearGradient id={`mj-sheen-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={muted ? 0.22 : 0.5} />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Shaft, drawn first so the head overlaps it */}
      <rect x="27" y="36" width="10" height="46" rx="3.5" fill={`url(#mj-leather-${id})`} />
      {/* Coil wraps */}
      {[44, 51, 58, 65, 72].map((y) => (
        <g key={y}>
          <rect x="25.5" y={y} width="13" height="4.4" rx="1.8" fill="#3b2a19" />
          <rect x="25.5" y={y} width="13" height="1.3" rx="0.7" fill="#6b5031" opacity="0.85" />
        </g>
      ))}
      {/* Strap loop */}
      <path
        d="M32 82c-6 0-9.5 3.6-9.5 7s3.5 5.6 9.5 5.6 9.5-2.2 9.5-5.6-3.5-7-9.5-7Z"
        fill="none"
        stroke={muted ? "#3a2b1c" : "#4d3823"}
        strokeWidth="2.6"
      />

      {/* Ferrule */}
      <rect x="24" y="34" width="16" height="6" rx="1.6" fill={`url(#mj-bronze-${id})`} />

      {/* Head: body, then protruding striking faces */}
      <rect x="13" y="10" width="38" height="26" rx="2.2" fill={`url(#mj-steel-${id})`} />
      <rect x="1" y="7" width="15" height="32" rx="2.8" fill={`url(#mj-cap-${id})`} />
      <rect x="48" y="7" width="15" height="32" rx="2.8" fill={`url(#mj-cap-${id})`} />

      {/* Bevels — light on top, dark underneath */}
      <g fill="none" strokeLinecap="round">
        <path d="M15 11h34" stroke="#f2f7fc" strokeWidth="1" opacity={muted ? 0.3 : 0.55} />
        <path d="M15 35h34" stroke="#0d141c" strokeWidth="1.2" opacity="0.75" />
        <path d="M3 37h11M50 37h11" stroke="#0d141c" strokeWidth="1.1" opacity="0.7" />
      </g>

      {/* Sheen across the head */}
      <rect x="1" y="7" width="62" height="16" rx="2.8" fill={`url(#mj-sheen-${id})`} />

      {/* Cap seams */}
      <g stroke="#1b232d" strokeWidth="0.9" opacity="0.75">
        <path d="M16 9v28M48 9v28" />
      </g>

      {/* Bronze band straddling the head, with Thurisaz struck into it */}
      <rect x="25" y="5" width="14" height="36" rx="1.8" fill={`url(#mj-bronze-${id})`} />
      <rect x="25" y="5" width="14" height="1.6" rx="0.8" fill="#f9efd8" opacity={muted ? 0.3 : 0.6} />
      <path
        d="M32 15v16M32 19l5 3-5 3"
        fill="none"
        stroke="#3f2c10"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Current arcing off the striking faces */}
      <g
        fill="none"
        stroke={muted ? "#8fa3b8" : "#e0f2fe"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={muted ? 0.35 : 1}
      >
        <path d="M1 42l4 1.6-3 2.6 4 1.2" />
        <path d="M63 42l-4 1.6 3 2.6-4 1.2" />
      </g>
    </svg>
  );
};

export default MjolnirIcon;
