import React from "react";

/**
 * Elder Futhark glyphs as SVG path data in a 12×20 box.
 *
 * Line art rather than Unicode runes on purpose: the Runic block isn't
 * reliably installed on Windows or Android, and a row of tofu boxes would be
 * far worse than no runes.
 */
const RUNES = [
  "M2 19V1M2 3l7 4M2 9l7 4", // fehu
  "M2 19V1l8 3v15", // uruz
  "M2 1v18M2 4l7 4-7 4", // thurisaz — Thor's own rune
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

/** Odin's knot, kept as a corner carving. */
const VALKNUT_PATHS = ["M50 6L88 72H12Z", "M50 26L76 72H24Z", "M50 46L64 72H36Z"];

/* ══════════════════════════════════════════════════════════════════
   Geometry is generated once at module load from a fixed seed, so the
   scatter is organic but identical on every render. Math.random() in
   render would rewrite every glyph on each pass.
   ══════════════════════════════════════════════════════════════════ */

let seed = 20260805;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const C = 100;

/**
 * The splashed inscription.
 *
 * Runes struck across the whole surface at varied scale, angle and weight,
 * the way a real carved wall accumulates marks — some deep and large, most
 * small and weathered. Deliberately not arranged in rings or columns: those
 * read as UI, this reads as stone.
 */
const SPLASH = Array.from({ length: 104 }, () => {
  const r = rnd();
  // A few large deep-cut glyphs, a scattering of mid, mostly small marks
  const size = r > 0.94 ? 46 + rnd() * 34 : r > 0.74 ? 24 + rnd() * 16 : 11 + rnd() * 10;
  return {
    rune: RUNES[Math.floor(rnd() * RUNES.length)],
    x: rnd() * 100,
    y: rnd() * 100,
    size,
    // Big marks sit straighter; small ones scatter harder
    rot: (rnd() - 0.5) * (size > 40 ? 22 : 62),
    // Larger glyphs are fainter so they stay background, not foreground
    op: size > 40 ? 0.05 + rnd() * 0.05 : 0.09 + rnd() * 0.14,
    gold: rnd() > 0.78,
  };
});

/** Jagged arc rings — lightning does not travel in smooth circles. */
const arcRing = (radius: number, segments: number, jag: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radius + (rnd() - 0.5) * jag;
    pts.push(`${(C + Math.cos(a) * r).toFixed(1)} ${(C + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
};

const ARC_RINGS = [arcRing(62, 44, 6), arcRing(88, 56, 8), arcRing(118, 70, 11)];

/**
 * Thor's backdrop: a wall of struck runes under a still Bifröst.
 *
 * Deliberately static. StormBackground already runs a live canvas on top of
 * this with drifting cloud, rain and lightning strikes — stacking spinning
 * dials, chasing runes and flickering bolt tiers underneath that made the
 * page restless. All the motion in Thor mode now comes from the weather.
 */
export const AsgardSigils: React.FC = () => (
  <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none select-none">
    {/* ── Bifröst, still ───────────────────────────────────────────── */}
    <svg
      viewBox="0 0 1000 320"
      preserveAspectRatio="none"
      className="absolute -top-6 inset-x-0 h-[34vh] w-full opacity-[0.1] mix-blend-screen"
    >
      <defs>
        {/* Cool spectrum rather than a full rainbow, so the bridge reads as
            part of the storm instead of fighting it */}
        <linearGradient id="bifrost-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="22%" stopColor="#1d4ed8" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="66%" stopColor="#22d3ee" />
          <stop offset="85%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <path d="M-60 330Q500 -70 1060 330" fill="none" stroke="url(#bifrost-band)" strokeWidth="54" />
      <path d="M-60 330Q500 -70 1060 330" fill="none" stroke="#f0f9ff" strokeWidth="2" opacity="0.4" />
    </svg>

    {/* ── Charge pooled behind the centre ──────────────────────────── */}
    <div className="absolute inset-0 flex items-center justify-center mix-blend-screen">
      <div className="absolute h-[52vw] max-h-[640px] w-[52vw] max-w-[640px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(29,78,216,0.05)_46%,transparent_72%)]" />
      <div className="absolute h-[18vw] max-h-[240px] w-[18vw] max-w-[240px] rounded-full bg-[radial-gradient(circle,rgba(186,230,253,0.16)_0%,transparent_62%)]" />
    </div>

    {/* ── Faint struck rings, no rotation ──────────────────────────── */}
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="-40 -40 280 280"
        className="absolute h-[86vw] max-h-[1000px] w-[86vw] max-w-[1000px] text-sky-400/20"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {ARC_RINGS.map((d, i) => (
            <path key={d} d={d} strokeWidth={i === 1 ? 1.1 : 0.7} opacity={i === 1 ? 1 : 0.6} />
          ))}
        </g>
      </svg>
    </div>

    {/* ── The splashed inscription ─────────────────────────────────── */}
    <div className="absolute inset-0">
      {SPLASH.map((mark, i) => (
        <svg
          key={i}
          viewBox="0 0 12 20"
          className="absolute"
          style={{
            left: `${mark.x}%`,
            top: `${mark.y}%`,
            width: mark.size * 0.6,
            height: mark.size,
            opacity: mark.op,
            transform: `translate(-50%, -50%) rotate(${mark.rot}deg)`,
          }}
        >
          <path
            d={mark.rune}
            stroke={mark.gold ? "#d4af6a" : "#7dd3fc"}
            strokeWidth={mark.size > 40 ? 1.1 : 1.7}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>

    {/* ── Valknut, a corner carving ────────────────────────────────── */}
    <svg
      viewBox="0 0 100 84"
      className="absolute left-[4%] top-[13%] w-20 text-sky-400/20 sm:w-28"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        {VALKNUT_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>

    {/* ── Inscription bands along the top and bottom edges ─────────── */}
    {(["top-2", "bottom-2"] as const).map((pos) => (
      <div key={pos} className={`absolute ${pos} inset-x-0 flex justify-center gap-6 opacity-[0.14]`}>
        {Array.from({ length: 30 }).map((_, i) => (
          <svg key={i} viewBox="0 0 12 20" width="10" height="18">
            <path
              d={RUNES[(i * 3) % RUNES.length]}
              stroke="#7dd3fc"
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
