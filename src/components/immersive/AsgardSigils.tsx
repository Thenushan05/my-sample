import React from "react";

/**
 * Elder Futhark glyphs as SVG path data in a 12×20 box.
 */
const RUNES = [
  "M2 19V1M2 3l7 4M2 9l7 4", // fehu
  "M2 19V1l8 3v15", // uruz
  "M2 1v18M2 4l7 4-7 4", // thurisaz
  "M2 19V1M2 3l7 4M2 9l6 4", // ansuz
  "M2 19V1l7 5-7 5M4 11l6 8", // raidho
  "M9 1L2 10l7 9", // kaunan
  "M1 1l10 18M11 1L1 19", // gebo
  "M2 19V1l7 4-7 4", // wunjo
  "M2 1v18M10 1v18M2 7l8 6", // hagalaz
  "M2 1v18M1 8l9 5", // nauthiz
  "M6 1v18", // isa
  "M3 1v18l7-5", // laguz
  "M2 1v18M10 1v18M2 3l8 8M10 3L2 11", // mannaz
  "M2 1v18M10 1v18M2 6l8 5", // ehwaz
  "M6 19V1M1 6l5-5 5 5", // tiwaz
  "M2 1v18M10 1v18M2 1l8 18M10 1L2 19", // dagaz
  "M6 1L1 6l5 5 5-5zM3 12l-2 7M9 12l2 7", // othala
  "M1 1l5 9 5-9M6 10v9", // algiz
];

/** Odin's knot: three interlocking triangles. */
const VALKNUT_PATHS = [
  "M50 6L88 72H12Z",
  "M50 26L76 72H24Z",
  "M50 46L64 72H36Z",
];

/** Helm of Awe: eight tridents radiating from a centre. */
const AEGIS_ARMS = Array.from({ length: 8 }, (_, i) => i * 45);

/**
 * Norse sacred geometry behind the storm.
 *
 * A massive, static layout of Norse symbols replacing the spinning circles.
 * It features an enormous Aegishjalmur (Helm of Awe) overlaid with a Valknut
 * and drifting runes.
 */
export const AsgardSigils: React.FC = () => (
  <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none select-none flex items-center justify-center">
    
    <style>{`
      @keyframes sigil-pulse {
        0%, 100% { opacity: 0.2; transform: scale(1); filter: brightness(1); }
        50% { opacity: 0.8; transform: scale(1.02); filter: brightness(1.5); }
      }
      .sigil-beam {
        animation: sigil-pulse 6s ease-in-out infinite;
      }
      .sigil-beam-slow {
        animation: sigil-pulse 10s ease-in-out infinite 2s;
      }
    `}</style>

    {/* Giant Static Helm of Awe (Aegishjalmur) */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Base faint geometry */}
      <svg
        viewBox="-50 -50 100 100"
        className="absolute w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] text-amber-500/10"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          {AEGIS_ARMS.map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M0 6V42" />
              <path d="M-9 42H9M-9 42V33M9 42V33M0 42v-6" />
              <path d="M-6 22H6" />
            </g>
          ))}
          <circle r="5" />
        </g>
      </svg>
      
      {/* Running Beam Overlay */}
      <svg
        viewBox="-50 -50 100 100"
        className="absolute w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] text-amber-300/40 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="sigil-beam">
          {AEGIS_ARMS.map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M0 6V42" />
              <path d="M-9 42H9M-9 42V33M9 42V33M0 42v-6" />
              <path d="M-6 22H6" />
            </g>
          ))}
        </g>
      </svg>
    </div>

    {/* Giant Static Valknut (Odin's Knot) layered on top */}
    <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
      {/* Base faint geometry */}
      <svg
        viewBox="0 0 100 84"
        className="absolute w-[70vw] h-[70vw] max-w-[750px] max-h-[750px] text-sky-200/5"
      >
        {VALKNUT_PATHS.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        ))}
      </svg>
      
      {/* Running Beam Overlay */}
      <svg
        viewBox="0 0 100 84"
        className="absolute w-[70vw] h-[70vw] max-w-[750px] max-h-[750px] text-sky-200/40 drop-shadow-[0_0_20px_rgba(186,230,253,0.7)]"
      >
        {VALKNUT_PATHS.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="sigil-beam-slow" />
        ))}
      </svg>
    </div>

    {/* Runic inscription bands along the top and bottom edges */}
    {(["top-2", "bottom-2"] as const).map((pos) => (
      <div key={pos} className={`absolute ${pos} inset-x-0 flex justify-center gap-6 opacity-[0.15]`}>
        {Array.from({ length: 30 }).map((_, i) => (
          <svg key={i} viewBox="0 0 12 20" width="10" height="18">
            <path
              d={RUNES[(i * 3) % RUNES.length]}
              stroke="#d4af6a"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    ))}
  </div>
);

export default AsgardSigils;
