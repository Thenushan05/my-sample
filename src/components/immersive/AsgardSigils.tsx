import React, { useEffect, useRef } from "react";

/**
 * Elder Futhark glyphs as SVG path data in a 12×20 box.
 *
 * Drawn as line art rather than Unicode runes on purpose: the Runic block
 * isn't reliably installed on Windows or Android, and a row of tofu boxes
 * would be far worse than no runes. Canvas consumes these through Path2D,
 * which accepts SVG path syntax directly.
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

/**
 * The eight stave terminals of the Vegvísir, in a local frame whose origin
 * is the end of the stave and whose +y points outward.
 */
const STAVE_TERMINALS = [
  "M-8 0L8 0", // crossbar
  "M-7 -5L7 -5M-7 5L7 5", // double bar
  "M0 -2L-8 8M0 -2L8 8", // fork
  "M-8 0L8 0M-8 0L-8 9M8 0L8 9M0 0L0 9", // trident
  "M-7 -7L0 0L7 -7", // chevron
  "M0 -8L8 0L0 8L-8 0Z", // diamond
  "M-7 0L-7 8L0 8M7 0L7 8L0 8", // hook pair
  "M-8 2L8 2M0 -6L0 10", // cross
];

/** Odin's knot: three interlocking triangles. */
const VALKNUT_PATHS = [
  "M50 6L88 72H12Z",
  "M50 26L76 72H24Z",
  "M50 46L64 72H36Z",
];

/** Three-cornered knot — the same sigil worn on the chest of the armour. */
const TRIQUETRA_PATHS = [
  "M50 14C68 34 68 58 50 78C32 58 32 34 50 14Z",
  "M22 62C48 54 68 40 74 18C48 26 28 40 22 62Z",
  "M78 62C52 54 32 40 26 18C52 26 72 40 78 62Z",
];

/** Helm of Awe: eight tridents radiating from a centre. */
const AEGIS_ARMS = Array.from({ length: 8 }, (_, i) => i * 45);

interface SigilCanvasProps {
  /** Seconds for one full turn. Negative spins the other way. */
  spin: number;
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
  className?: string;
}

/**
 * A canvas that is painted ONCE and then rotated by CSS.
 *
 * The other backdrops (arc reactor, blood spatter, storm) hold a
 * requestAnimationFrame loop open. This geometry never changes, so baking it
 * and handing the rotation to the compositor costs nothing per frame — which
 * matters because the storm canvas is already running a live loop on top.
 */
const SigilCanvas: React.FC<SigilCanvasProps> = ({ spin, draw, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const paint = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Oversized square so the corners never swing into view while rotating
      const size = Math.max(window.innerWidth, window.innerHeight) * 1.5;
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.clearRect(0, 0, size, size);
      draw(ctx, size);
    };

    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [draw]);

  return (
    <div
      className={className}
      style={{
        animation: `thor-sigil-spin ${Math.abs(spin)}s linear infinite`,
        animationDirection: spin < 0 ? "reverse" : "normal",
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

/** Stroke one rune, centred on (x, y), rotated to face outward. */
const strokeRune = (
  ctx: CanvasRenderingContext2D,
  path: string,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  alpha: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.translate(-6, -10); // centre the 12×20 glyph box
  ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
  ctx.lineWidth = 1.5 / scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(path));
  ctx.restore();
};

/** The Vegvísir: eight staves, each with its own terminal, inside rings. */
const drawVegvisir = (ctx: CanvasRenderingContext2D, size: number) => {
  const c = size / 2;
  const outer = size * 0.3;

  ctx.save();
  ctx.translate(c, c);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Concentric containment rings, heavier every third
  [0.42, 0.62, 0.72, 0.9, 1].forEach((f, i) => {
    ctx.beginPath();
    ctx.arc(0, 0, outer * f, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(125, 211, 252, ${i % 3 === 0 ? 0.16 : 0.09})`;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.stroke();
  });

  // Bronze ring between the two rune bands
  ctx.beginPath();
  ctx.arc(0, 0, outer * 0.81, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(212, 175, 106, 0.14)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // The eight staves
  STAVE_TERMINALS.forEach((terminal, i) => {
    const angle = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.rotate(angle);

    // Shaft
    ctx.beginPath();
    ctx.moveTo(0, outer * 0.12);
    ctx.lineTo(0, outer * 0.72);
    ctx.strokeStyle = "rgba(186, 230, 253, 0.2)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Cross-ticks along the shaft
    [0.3, 0.45, 0.6].forEach((f) => {
      const w = outer * 0.045;
      ctx.beginPath();
      ctx.moveTo(-w, outer * f);
      ctx.lineTo(w, outer * f);
      ctx.strokeStyle = "rgba(125, 211, 252, 0.14)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    // Terminal glyph, scaled to the ring
    ctx.save();
    ctx.translate(0, outer * 0.72);
    const s = outer * 0.014;
    ctx.scale(s, s);
    ctx.strokeStyle = "rgba(186, 230, 253, 0.24)";
    ctx.lineWidth = 2.2 / s;
    ctx.stroke(new Path2D(terminal));
    ctx.restore();

    ctx.restore();
  });

  ctx.restore();

  // Rune band on the outer ring, each glyph facing outward
  const bandRunes = 24;
  for (let i = 0; i < bandRunes; i++) {
    const angle = (i / bandRunes) * Math.PI * 2;
    const r = outer * 0.855;
    strokeRune(
      ctx,
      RUNES[i % RUNES.length],
      c + Math.cos(angle) * r,
      c + Math.sin(angle) * r,
      outer * 0.0028,
      angle + Math.PI / 2,
      0.2
    );
  }

  // Inner band, fewer glyphs, dimmer
  const innerRunes = 12;
  for (let i = 0; i < innerRunes; i++) {
    const angle = (i / innerRunes) * Math.PI * 2 + 0.26;
    const r = outer * 0.52;
    strokeRune(
      ctx,
      RUNES[(i * 5) % RUNES.length],
      c + Math.cos(angle) * r,
      c + Math.sin(angle) * r,
      outer * 0.0022,
      angle + Math.PI / 2,
      0.14
    );
  }
};

/** A wide, slow band of runic inscription well outside the Vegvísir. */
const drawOuterInscription = (ctx: CanvasRenderingContext2D, size: number) => {
  const c = size / 2;
  const r = size * 0.42;

  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(212, 175, 106, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const count = 48;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    strokeRune(
      ctx,
      RUNES[(i * 7) % RUNES.length],
      c + Math.cos(angle) * r,
      c + Math.sin(angle) * r,
      size * 0.0013,
      angle + Math.PI / 2,
      0.13
    );
  }
};

/**
 * Norse sacred geometry behind the storm.
 *
 * Iron Man mode has its rotating arc-reactor blueprint and Spider-Man its
 * web; this is Thor's equivalent centrepiece — a Vegvísir ringed by runic
 * inscription, with a Valknut, Triquetra and Helm of Awe set into the
 * corners like carvings on a standing stone.
 */
export const AsgardSigils: React.FC = () => (
  <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none select-none">
    {/* Centre: Vegvísir, turning once every four minutes */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <SigilCanvas spin={240} draw={drawVegvisir} />
    </div>

    {/* Outer inscription, counter-rotating so the two never lock up */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <SigilCanvas spin={-380} draw={drawOuterInscription} />
    </div>

    {/* Valknut — Odin's knot */}
    <svg
      viewBox="0 0 100 84"
      className="absolute left-[3%] top-[12%] w-20 opacity-[0.13] sm:w-28"
      style={{ animation: "thor-arc 7s ease-in-out infinite" }}
    >
      {VALKNUT_PATHS.map((d) => (
        <path key={d} d={d} fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinejoin="round" />
      ))}
    </svg>

    {/* Triquetra — the knot on the armour */}
    <svg
      viewBox="0 0 100 92"
      className="absolute right-[3%] top-[16%] w-20 opacity-[0.13] sm:w-28"
      style={{ animation: "thor-arc 9s ease-in-out infinite 1.5s" }}
    >
      {TRIQUETRA_PATHS.map((d) => (
        <path key={d} d={d} fill="none" stroke="#d4af6a" strokeWidth="2" strokeLinejoin="round" />
      ))}
    </svg>

    {/* Aegishjalmur — Helm of Awe */}
    <svg
      viewBox="-50 -50 100 100"
      className="absolute bottom-[10%] left-[5%] w-20 opacity-[0.12] sm:w-28"
      style={{ animation: "thor-arc 11s ease-in-out infinite 0.8s" }}
    >
      <g fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round">
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

    {/* Runic inscription bands along the top and bottom edges */}
    {(["top-1", "bottom-1"] as const).map((pos) => (
      <div key={pos} className={`absolute ${pos} inset-x-0 flex justify-center gap-5 opacity-[0.11]`}>
        {Array.from({ length: 22 }).map((_, i) => (
          <svg key={i} viewBox="0 0 12 20" width="9" height="15">
            <path
              d={RUNES[(i * 3) % RUNES.length]}
              stroke="#bae6fd"
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
      { left: "13%", dur: 46, delay: 0, op: 0.09 },
      { left: "34%", dur: 62, delay: -14, op: 0.07 },
      { left: "68%", dur: 54, delay: -28, op: 0.08 },
      { left: "88%", dur: 70, delay: -8, op: 0.06 },
    ].map((col) => (
      <div
        key={col.left}
        className="absolute top-0 hidden h-[200%] flex-col items-center gap-7 md:flex"
        style={{
          left: col.left,
          opacity: col.op,
          animation: `thor-rune-drift ${col.dur}s linear infinite`,
          animationDelay: `${col.delay}s`,
        }}
      >
        {Array.from({ length: 26 }).map((_, i) => (
          <svg key={i} viewBox="0 0 12 20" width="11" height="18" className="shrink-0">
            <path
              d={RUNES[(i * 4 + col.dur) % RUNES.length]}
              stroke="#7dd3fc"
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
