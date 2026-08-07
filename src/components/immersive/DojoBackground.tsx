import React, { useEffect, useRef } from "react";

interface Bamboo {
  x: number;
  /** Fraction of viewport height. */
  h: number;
  w: number;
  sway: number;
  phase: number;
  depth: number;
}

interface MistBand {
  y: number;
  h: number;
  speed: number;
  alpha: number;
  dir: 1 | -1;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  fall: number;
  drift: number;
  phase: number;
  rotation: number;
}

/* The theme's palette, kept in one place so the backdrop agrees with the
   console and overlay rather than inventing its own greys. */
const INK = "10, 13, 11";
const PAPER = "236, 236, 221";
const STEEL = "159, 180, 188";
const MOSS = "111, 143, 92";
/** His colour, bled faintly into the moon halo so the backdrop agrees
    with the console instead of reading as a plain cold night. */
const FLASH = "61, 220, 114";

/**
 * Zoro mode backdrop.
 *
 * Iron Man draws a blueprint, Luffy a bright sea. This one draws a dojo
 * courtyard at night: ink-wash mountains layered in the distance the way a
 * sumi-e scroll builds depth with value alone rather than detail, a cold
 * moon, drifting mist bands, and a bamboo grove framing the page the way
 * tendrils frame Venom's — except still, upright, swaying only a little,
 * because this character's whole visual language is restraint.
 *
 * The far mountains and moon never move, so they render once to an
 * offscreen canvas; only the mist, the bamboo sway and the odd falling
 * leaf are redrawn per frame.
 */
export const DojoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frameId = 0;
    let t = 0;
    let scrolled = 0;

    let bamboo: Bamboo[] = [];
    let mist: MistBand[] = [];
    let leaves: Leaf[] = [];
    let farLayer: HTMLCanvasElement | null = null;

    /** Sky wash, moon, and the ink-wash mountain silhouettes. Static. */
    const buildFar = () => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const s = c.getContext("2d");
      if (!s) return null;

      const sky = s.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#05070a");
      sky.addColorStop(0.5, "#080b09");
      sky.addColorStop(1, "#0d100d");
      s.fillStyle = sky;
      s.fillRect(0, 0, width, height);

      // The moon: pale, high, small — a presence, not a spectacle
      const moonX = width * 0.76;
      const moonY = height * 0.16;
      const moonR = Math.min(width, height) * 0.045;
      const halo = s.createRadialGradient(moonX, moonY, moonR * 0.6, moonX, moonY, moonR * 9);
      halo.addColorStop(0, `rgba(${PAPER}, 0.16)`);
      halo.addColorStop(0.35, `rgba(${STEEL}, 0.05)`);
      halo.addColorStop(0.7, `rgba(${FLASH}, 0.05)`);
      halo.addColorStop(1, `rgba(${FLASH}, 0)`);
      s.fillStyle = halo;
      s.fillRect(0, 0, width, height);
      s.beginPath();
      s.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      s.fillStyle = "#e9e7d8";
      s.fill();
      // A single soft crater — sumi-e doesn't render detail, it implies it
      s.beginPath();
      s.arc(moonX - moonR * 0.3, moonY + moonR * 0.2, moonR * 0.22, 0, Math.PI * 2);
      s.fillStyle = "rgba(180, 178, 160, 0.35)";
      s.fill();

      // Ink-wash mountain ridges, back to front, each a flatter value than
      // the last — the classic sumi-e way of building distance with tone
      // alone rather than detail or colour.
      const ridge = (baseY: number, amp: number, freq: number, shift: number, alpha: number) => {
        s.beginPath();
        s.moveTo(0, height);
        for (let x = 0; x <= width; x += 6) {
          const y =
            baseY +
            Math.sin(x * freq + shift) * amp +
            Math.sin(x * freq * 2.3 + shift * 1.6) * amp * 0.3;
          s.lineTo(x, y);
        }
        s.lineTo(width, height);
        s.closePath();
        s.fillStyle = `rgba(${PAPER}, ${alpha})`;
        s.fill();
      };

      ridge(height * 0.58, height * 0.05, 0.0026, 0.4, 0.05);
      ridge(height * 0.66, height * 0.04, 0.0035, 2.1, 0.08);
      ridge(height * 0.74, height * 0.03, 0.0048, 4.3, 0.12);

      return c;
    };

    const build = () => {
      const reach = Math.min(width, height);

      bamboo = Array.from({ length: 9 }, (_, i) => {
        const edge = i < 5;
        const f = edge ? i / 4 : (i - 5) / 3;
        return {
          x: edge ? f * width * 0.16 : width - f * width * 0.14,
          h: height * (0.4 + ((i * 37) % 100) / 100 * 0.5),
          w: 5 + ((i * 23) % 100) / 100 * 7,
          sway: 1.2 + ((i * 17) % 100) / 100 * 1.8,
          phase: ((i * 53) % 100) / 100 * Math.PI * 2,
          depth: 0.4 + ((i * 29) % 100) / 100 * 0.6,
        };
      });

      mist = Array.from({ length: 4 }, (_, i) => ({
        y: height * (0.5 + i * 0.13),
        h: height * (0.05 + ((i * 31) % 100) / 100 * 0.05),
        speed: 0.15 + ((i * 19) % 100) / 100 * 0.25,
        alpha: 0.04 + ((i * 13) % 100) / 100 * 0.05,
        dir: i % 2 === 0 ? 1 : -1,
      }));

      leaves = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: reach * (0.006 + Math.random() * 0.008),
        fall: 0.3 + Math.random() * 0.4,
        drift: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
      }));

      farLayer = buildFar();
    };

    /** A bamboo stalk: segmented, with node rings, swaying from the base. */
    const drawBamboo = (b: Bamboo) => {
      const sway = Math.sin(t * 0.006 + b.phase) * b.sway;
      const y = height - scrolled * 40 * b.depth;
      const segments = 7;
      const segH = b.h / segments;

      ctx.save();
      ctx.globalAlpha = 0.55 + b.depth * 0.4;

      ctx.beginPath();
      ctx.moveTo(b.x - b.w / 2, y);
      for (let i = 0; i <= segments; i++) {
        const f = i / segments;
        const offset = sway * f * f;
        ctx.lineTo(b.x - b.w / 2 * (1 - f * 0.3) + offset, y - segH * i);
      }
      for (let i = segments; i >= 0; i--) {
        const f = i / segments;
        const offset = sway * f * f;
        ctx.lineTo(b.x + b.w / 2 * (1 - f * 0.3) + offset, y - segH * i);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${INK}, 0.92)`;
      ctx.fill();

      // Node rings, one per segment
      for (let i = 1; i < segments; i++) {
        const f = i / segments;
        const offset = sway * f * f;
        const ny = y - segH * i;
        const nw = (b.w / 2) * (1 - f * 0.3) * 1.15;
        ctx.beginPath();
        ctx.moveTo(b.x - nw + offset, ny);
        ctx.lineTo(b.x + nw + offset, ny);
        ctx.strokeStyle = `rgba(${PAPER}, 0.14)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      ctx.restore();
    };

    /** A horizontal mist band, drifting */
    const drawMist = (m: MistBand) => {
      const x = ((t * m.speed * m.dir) % (width * 1.4)) - width * 0.2;
      const g = ctx.createLinearGradient(x, 0, x + width * 1.2, 0);
      g.addColorStop(0, `rgba(${PAPER}, 0)`);
      g.addColorStop(0.5, `rgba(${PAPER}, ${m.alpha})`);
      g.addColorStop(1, `rgba(${PAPER}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, m.y - m.h / 2, width, m.h);
    };

    /** A single bamboo leaf, drifting down and swaying side to side */
    const drawLeaf = (l: Leaf) => {
      l.y += l.fall;
      l.x += Math.sin(t * 0.02 + l.phase) * l.drift * 0.3;
      if (l.y > height + 20) {
        l.y = -20;
        l.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation + Math.sin(t * 0.03 + l.phase) * 0.6);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size, l.size * 0.32, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${MOSS}, 0.4)`;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      scrolled += (target - scrolled) * 0.08;

      ctx.clearRect(0, 0, width, height);

      if (farLayer) ctx.drawImage(farLayer, 0, 0);
      mist.forEach(drawMist);
      leaves.forEach(drawLeaf);
      bamboo.forEach(drawBamboo);

      frameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      build();
    };

    build();
    frameId = requestAnimationFrame(render);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default DojoBackground;
