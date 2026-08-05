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

/** Ancient Odin's Knot (Valknut) paths */
const VALKNUT_PATHS = [
  "M50 6L88 72H12Z",
  "M50 26L76 72H24Z",
  "M50 46L64 72H36Z",
];

const RUNIC_CIRCLE = Array.from({ length: 24 }, (_, i) => ({
  deg: i * 15,
  rune: RUNES[i % RUNES.length]
}));

/**
 * Norse sacred geometry behind the storm.
 *
 * A massive, static layout of Norse symbols replacing the spinning circles.
 * It features an enormous Mjolnir surrounded by a Runic Circle.
 */
export const AsgardSigils: React.FC = () => (
  <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none select-none flex items-center justify-center">
    
    <style>{`
      @keyframes ancient-pulse {
        0%, 100% { opacity: 0.15; filter: drop-shadow(0 0 10px rgba(217,119,6,0.3)); }
        50% { opacity: 0.6; filter: drop-shadow(0 0 25px rgba(251,191,36,0.7)); }
      }
      .ancient-glow {
        animation: ancient-pulse 8s ease-in-out infinite;
      }
      
      @keyframes ancient-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .ancient-dial {
        animation: ancient-rotate 180s linear infinite;
        transform-origin: center;
      }

      @keyframes ember-chase {
        0%, 100% { opacity: 0.1; filter: drop-shadow(0 0 0px transparent); }
        10% { opacity: 1; filter: drop-shadow(0 0 15px #fbbf24); } /* amber-400 */
        40% { opacity: 0.1; filter: drop-shadow(0 0 0px transparent); }
      }
      .ember-blink {
        animation: ember-chase 15s ease-in-out infinite;
      }

      @keyframes ethereal-ripple {
        0% { opacity: 0.5; transform: scale(0.5); }
        100% { opacity: 0; transform: scale(2); }
      }
      .ethereal-ripple {
        animation: ethereal-ripple 12s ease-out infinite;
      }
    `}</style>

    {/* Ancient Mythical Core Glow */}
    <div className="absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none">
      {/* Deep ancient fiery core */}
      <div className="ancient-glow absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.25)_0%,rgba(180,83,9,0.05)_40%,transparent_70%)]" />
      {/* Intense center ember */}
      <div className="ancient-glow absolute w-[15vw] h-[15vw] max-w-[200px] max-h-[200px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.3)_0%,transparent_60%)]" style={{ animationDelay: '-4s' }} />
      
      {/* Ethereal golden ripples */}
      <div className="ethereal-ripple absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full border border-amber-500/10" />
      <div className="ethereal-ripple absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full border border-yellow-600/10" style={{ animationDelay: '-6s' }} />
    </div>

    {/* Giant Static Mjolnir & Rotating Runic Circles */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Base faint geometry */}
      <svg
        viewBox="0 0 100 100"
        className="absolute w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] text-amber-700/30"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer and Inner circles (dial) */}
          <g className="ancient-dial">
            <circle cx="50" cy="50" r="48" />
            <circle cx="50" cy="50" r="38" />
            <g className="opacity-40">
              {RUNIC_CIRCLE.map((item, i) => (
                <g key={i} transform={`translate(50, 50) rotate(${item.deg}) translate(0, -43)`}>
                  <path d={item.rune} transform="scale(0.25) translate(-6, -10)" strokeWidth="2.5" />
                </g>
              ))}
            </g>
          </g>

          {/* Valknut (static in center) */}
          <g strokeWidth="1.2" transform="scale(0.55) translate(40, 30)">
            {VALKNUT_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </g>
      </svg>
      
      {/* Overlay: Glowing Embers */}
      <svg
        viewBox="0 0 100 100"
        className="absolute w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] text-amber-400/60 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <g className="ancient-dial">
            <circle cx="50" cy="50" r="48" className="ancient-glow" />
            <circle cx="50" cy="50" r="38" className="ancient-glow" style={{ animationDelay: '-4s' }} />
            
            {/* Chasing Blinking Runes Overlay */}
            {RUNIC_CIRCLE.map((item, i) => (
              <g 
                key={i} 
                className="ember-blink text-amber-100" 
                style={{ animationDelay: `${i * (15 / 24)}s` }}
                transform={`translate(50, 50) rotate(${item.deg}) translate(0, -43)`}
              >
                <path d={item.rune} transform="scale(0.25) translate(-6, -10)" strokeWidth="3" />
              </g>
            ))}
          </g>

          {/* Glowing Valknut */}
          <g className="ancient-glow" strokeWidth="1.8" transform="scale(0.55) translate(40, 30)">
            {VALKNUT_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </g>
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

    {/* Columns of inscription drifting down the page like falling script */}
    {[
      { left: "10%", dur: 50, delay: 0, op: 0.12 },
      { left: "30%", dur: 65, delay: -14, op: 0.08 },
      { left: "70%", dur: 58, delay: -28, op: 0.10 },
    ].map((col) => (
      <div
        key={col.left}
        className="absolute top-0 hidden h-[200%] flex-col items-center gap-8 md:flex"
        style={{
          left: col.left,
          opacity: col.op,
          animation: `thor-rune-drift ${col.dur}s linear infinite`,
          animationDelay: `${col.delay}s`,
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <svg key={i} viewBox="0 0 12 20" width="12" height="20" className="shrink-0">
            <path
              d={RUNES[(i * 4 + col.dur) % RUNES.length]}
              stroke="#bae6fd"
              strokeWidth="1.7"
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
