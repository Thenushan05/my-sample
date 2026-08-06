import React from "react";

interface LuffyFaceIconProps {
  className?: string;
}

/**
 * An original comic-style bust, drawn entirely in code — no sourced or
 * generated imagery, no likeness. This is what fills the bounty poster's
 * "photo" panel: round head, the straw hat, a wide open grin (the one
 * expression that reads as HIM at a glance), and the small scar under the
 * left eye that is the character's single most recognisable identifying
 * mark. Line weight and flat colour fills only, matching StrawHatIcon's
 * technique so the two read as one house style.
 */
export const LuffyFaceIcon: React.FC<LuffyFaceIconProps> = ({ className }) => {
  const skin = "#f0b878";
  const skinShade = "#dd9f5c";
  const ink = "#241a10";
  const straw = "#edb945";
  const strawDark = "#d09a2c";
  const band = "#c3352a";
  const hair = "#2a1c10";

  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden>
      {/* Neck + collar hint, so the bust doesn't float as a disembodied head */}
      <path d="M42 108C42 100 46 94 60 94C74 94 78 100 78 108L82 128H38Z" fill={skin} stroke={ink} strokeWidth="2.5" />
      <path d="M36 122C42 116 52 113 60 113C68 113 78 116 84 122L86 129H34Z" fill={band} stroke={ink} strokeWidth="2.5" />

      {/* Head */}
      <ellipse cx="60" cy="62" rx="34" ry="36" fill={skin} stroke={ink} strokeWidth="2.8" />

      {/* Cheek shading — the only shadow this whole style permits itself */}
      <path d="M30 66C30 78 36 88 46 92C38 84 34 74 36 64Z" fill={skinShade} opacity="0.6" />
      <path d="M90 66C90 78 84 88 74 92C82 84 86 74 84 64Z" fill={skinShade} opacity="0.6" />

      {/* Hair fringe under the hat */}
      <path
        d="M27 52C27 44 33 34 42 30C39 36 38 42 40 48C33 47 29 49 27 52Z"
        fill={hair}
      />
      <path
        d="M93 52C93 44 87 34 78 30C81 36 82 42 80 48C87 47 91 49 93 52Z"
        fill={hair}
      />

      {/* Eyes: round, a little too big, permanently amused */}
      <g>
        <ellipse cx="45" cy="60" rx="6.5" ry="8" fill={ink} />
        <circle cx="47.4" cy="57" r="2.1" fill="#f6f5f1" />
      </g>
      <g>
        <ellipse cx="75" cy="60" rx="6.5" ry="8" fill={ink} />
        <circle cx="77.4" cy="57" r="2.1" fill="#f6f5f1" />
      </g>

      {/* Eyebrows — the whole expression lives here as much as the mouth */}
      <path d="M37 47C40 44 46 43 51 45" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M83 47C80 44 74 43 69 45" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />

      {/* The scar: three short marks under the left eye, the single most
          identifying feature at this size */}
      <path
        d="M38 70L41 74M41 69L44 74M44 68L47 73"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* The grin — wide, open, a row of teeth rather than a closed smile */}
      <path
        d="M42 78C48 88 72 88 78 78C74 84 66 87 60 87C54 87 46 84 42 78Z"
        fill="#fff8ea"
        stroke={ink}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M50 80.5H70" stroke={ink} strokeWidth="1.3" opacity="0.5" />

      {/* Nose: a single small line, the minimum this style needs */}
      <path d="M58 64C57 68 57 71 59 72" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />

      {/* ── The straw hat ────────────────────────────────────────
          Same proportions as StrawHatIcon, sat back on the head rather
          than floating above it. */}
      <g>
        <path
          d="M8 40C8 34.6 24 30 60 30S112 34.6 112 40C112 45.4 96 49.6 60 49.6S8 45.4 8 40Z"
          fill={straw}
          stroke={ink}
          strokeWidth="2.6"
        />
        <path
          d="M11 41.6C16 46.4 32 50 60 50S104 46.4 109 41.6C107 46.8 87 51 60 51S13 46.8 11 41.6Z"
          fill={strawDark}
        />
        <path
          d="M25 33C31 30 44 28 60 28S89 30 95 33C95 24 79 16 60 16S25 24 25 33Z"
          fill={straw}
          stroke={ink}
          strokeWidth="2.6"
        />
        <path
          d="M27 32C31 25 44 22 60 22S89 25 93 32C89 30 76 27 60 27S31 30 27 32Z"
          fill={strawDark}
        />
        <path
          d="M27.5 30.5C36 27.5 47 26 60 26S84 27.5 92.5 30.5C92 32 91.5 32.8 91.5 32.8C84.5 30 73 28.4 60 28.4S35.5 30 28.5 32.8C28.5 32.8 28 32 27.5 30.5Z"
          fill={band}
          stroke={ink}
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
};

export default LuffyFaceIcon;
