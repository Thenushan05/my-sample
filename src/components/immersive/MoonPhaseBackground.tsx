import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  /** Resting brightness, 0–1. */
  base: number;
  /** Twinkle rate. */
  twinkle: number;
  phase: number;
  color: string;
  /** Only the brightest few get a diffraction flare. */
  flare: boolean;
  /** Parallax depth, 0 = far, 1 = near. */
  depth: number;
}

interface Veil {
  y: number;
  /** Fraction of the viewport width. */
  w: number;
  h: number;
  x: number;
  speed: number;
  alpha: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

/* The theme's palette, so the sky agrees with the rest of Moon Knight
   rather than inventing its own blues. */
const BONE = "242, 239, 230";
const SILVER = "201, 209, 220";
const GOLD = "201, 162, 39";

/**
 * Moon Knight mode backdrop.
 *
 * Iron Man draws a blueprint, Spider-Man a web, Deadpool a bled-on page,
 * Thor a storm, Venom a creature. This one draws the SKY over the desert —
 * the Milky Way banking overhead, dunes black against the horizon, and a moon
 * that runs its phases as you read: a thin crescent at the top of the page,
 * full at the bottom. The terminator is a real shadow disc sliding across the
 * face, so the phase is genuinely geometric rather than a mask fade.
 *
 * Everything that never moves — sky wash, Milky Way, dunes — is rendered once
 * to offscreen canvases and blitted per frame. Only the things that actually
 * animate (twinkle, cloud veils, the moon, the occasional meteor) are redrawn,
 * which keeps a full-viewport starfield off the critical path.
 */
export const MoonPhaseBackground: React.FC = () => {
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
    /** 0 = new, 1 = full. Eased toward the scroll position. */
    let phase = 0.08;
    /** 0–1 down the page, eased. Drives parallax. */
    let scrolled = 0;

    let stars: Star[] = [];
    let veils: Veil[] = [];
    let shooter: Shooter | null = null;
    let nextShooter = 260;

    let skyLayer: HTMLCanvasElement | null = null;
    let duneLayer: HTMLCanvasElement | null = null;

    const moonImg = new Image();
    moonImg.src = "/mk-realistic-moon.png";

    const moonGeometry = () => ({
      cx: width * 0.5,
      cy: height * 0.28,
      r: Math.min(width, height) * 0.19,
    });

    /** Sky wash + Milky Way + the moon's broad glow. Static. */
    const buildSky = () => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const s = c.getContext("2d");
      if (!s) return null;

      // Desert night: coldest overhead, warming very slightly toward the
      // horizon where the moonlight pools.
      const sky = s.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#03050b");
      sky.addColorStop(0.45, "#070b16");
      sky.addColorStop(0.8, "#0d1424");
      sky.addColorStop(1, "#131b2e");
      s.fillStyle = sky;
      s.fillRect(0, 0, width, height);

      // Milky Way, banked across the sky
      const diag = Math.hypot(width, height);
      s.save();
      s.translate(width * 0.66, height * 0.06);
      s.rotate(-0.82);
      const bandH = Math.min(width, height) * 0.5;
      const band = s.createLinearGradient(0, -bandH / 2, 0, bandH / 2);
      band.addColorStop(0, `rgba(${SILVER}, 0)`);
      band.addColorStop(0.5, `rgba(${SILVER}, 0.075)`);
      band.addColorStop(1, `rgba(${SILVER}, 0)`);
      s.fillStyle = band;
      s.fillRect(-diag, -bandH / 2, diag * 2, bandH);

      // Clumps, so the band has structure instead of reading as a smear
      for (let i = 0; i < 22; i++) {
        const cx = (i / 22) * diag * 1.6 - diag * 0.8;
        const cy = Math.sin(i * 2.1) * bandH * 0.22;
        const cr = bandH * (0.16 + ((i * 37) % 100) / 100 * 0.24);
        const g = s.createRadialGradient(cx, cy, 0, cx, cy, cr);
        g.addColorStop(0, `rgba(${SILVER}, ${0.05 + ((i * 17) % 5) / 100})`);
        g.addColorStop(1, `rgba(${SILVER}, 0)`);
        s.fillStyle = g;
        s.beginPath();
        s.arc(cx, cy, cr, 0, Math.PI * 2);
        s.fill();
      }
      s.restore();

      // The moon's spill into the sky around it
      const { cx, cy, r } = moonGeometry();
      const spill = s.createRadialGradient(cx, cy, r, cx, cy, r * 7);
      spill.addColorStop(0, `rgba(${SILVER}, 0.1)`);
      spill.addColorStop(0.35, `rgba(${SILVER}, 0.04)`);
      spill.addColorStop(1, `rgba(${SILVER}, 0)`);
      s.fillStyle = spill;
      s.fillRect(0, 0, width, height);

      return c;
    };

    /** Dune silhouettes along the bottom. Static. */
    const buildDunes = () => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const d = c.getContext("2d");
      if (!d) return null;

      const ridge = (
        baseY: number,
        amp: number,
        freq: number,
        shift: number,
        fill: string,
        rim: number
      ) => {
        const crest: [number, number][] = [];
        for (let x = 0; x <= width; x += 4) {
          const y =
            baseY +
            Math.sin(x * freq + shift) * amp +
            Math.sin(x * freq * 2.4 + shift * 1.7) * amp * 0.34;
          crest.push([x, y]);
        }

        d.beginPath();
        d.moveTo(0, height);
        crest.forEach(([x, y]) => d.lineTo(x, y));
        d.lineTo(width, height);
        d.closePath();
        d.fillStyle = fill;
        d.fill();

        // Moonlight catching the crest — without it the dunes read as a
        // flat black bar rather than a lit landscape.
        if (rim > 0) {
          d.beginPath();
          crest.forEach(([x, y], i) => (i ? d.lineTo(x, y) : d.moveTo(x, y)));
          d.strokeStyle = `rgba(${SILVER}, ${rim})`;
          d.lineWidth = 1;
          d.stroke();
        }
      };

      ridge(height * 0.855, height * 0.035, 0.0042, 1.2, "#080c16", 0.22);
      ridge(height * 0.915, height * 0.028, 0.0061, 3.4, "#04060d", 0.12);
      ridge(height * 0.965, height * 0.02, 0.0089, 5.1, "#010206", 0);

      return c;
    };

    const build = () => {
      const count = Math.round((width * height) / 3400);

      stars = Array.from({ length: count }, () => {
        const roll = Math.random();
        // Gold stars are rare on purpose — they're the theme's accent, and a
        // sky full of them stops reading as night.
        const color = roll > 0.965 ? GOLD : roll > 0.72 ? SILVER : BONE;
        const bright = Math.random();
        return {
          x: Math.random() * width,
          // Squeezed into the sky: stars below the dune line are never seen
          y: Math.random() * height * 0.88,
          r: bright > 0.985 ? 1.7 : bright > 0.9 ? 1.15 : Math.random() * 0.7 + 0.35,
          base: 0.25 + Math.random() * 0.7,
          twinkle: 0.008 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
          color,
          flare: bright > 0.985,
          depth: Math.random(),
        };
      });

      veils = Array.from({ length: 5 }, (_, i) => ({
        y: height * (0.12 + i * 0.14),
        w: 0.5 + Math.random() * 0.55,
        h: height * (0.05 + Math.random() * 0.07),
        x: Math.random() * width,
        speed: 0.09 + Math.random() * 0.16,
        alpha: 0.03 + Math.random() * 0.05,
      }));

      skyLayer = buildSky();
      duneLayer = buildDunes();
    };

    const drawStars = () => {
      // Far stars barely move, near ones drift — a shallow parallax that
      // gives the sky depth as the page scrolls.
      stars.forEach((s) => {
        const y = s.y - scrolled * (8 + s.depth * 34);
        if (y < -4 || y > height) return;

        const a = s.base * (0.55 + 0.45 * Math.sin(t * s.twinkle + s.phase));
        ctx.fillStyle = `rgba(${s.color}, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.flare) {
          ctx.strokeStyle = `rgba(${s.color}, ${a * 0.4})`;
          ctx.lineWidth = 0.7;
          const f = s.r * 5;
          ctx.beginPath();
          ctx.moveTo(s.x - f, y);
          ctx.lineTo(s.x + f, y);
          ctx.moveTo(s.x, y - f);
          ctx.lineTo(s.x, y + f);
          ctx.stroke();
        }
      });
    };

    const drawMoon = () => {
      const { cx, cy, r } = moonGeometry();

      // Halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 3.4);
      halo.addColorStop(0, `rgba(${BONE}, ${0.1 + phase * 0.16})`);
      halo.addColorStop(0.4, `rgba(${SILVER}, ${0.03 + phase * 0.06})`);
      halo.addColorStop(1, `rgba(${SILVER}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.4, 0, Math.PI * 2);
      ctx.fill();

      // The lit disc, using the realistic image
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip(); // Ensure we stay in a perfect circle

      if (moonImg.complete && moonImg.width > 0) {
        // The generated image likely has black padding around the actual moon.
        // We scale it up by 1.35x to push the black padding entirely OUTSIDE
        // the `r` clip boundary, so ONLY the moon texture is visible.
        ctx.drawImage(moonImg, cx - r * 1.35, cy - r * 1.35, r * 2.7, r * 2.7);
      } else {
        // Fallback gradient while loading
        const face = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r * 1.15);
        face.addColorStop(0, "#fbf9f4");
        face.addColorStop(0.55, "#e8e4d8");
        face.addColorStop(1, "#b9b6ab");
        ctx.fillStyle = face;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      // The terminator: a shadow disc of the same radius, offset horizontally.
      // At phase 0 it sits dead on top (new moon); at phase 1 it has slid
      // fully clear (full moon). That offset is what makes the crescent read
      // as real geometry instead of an opacity fade.
      const offset = (1 - phase) * r * 2.05;
      const sx = cx - offset;
      // Feathered at the rim: a hard-edged disc reads as a black shape pasted
      // on the moon, where a real terminator softens over a few kilometres.
      const shadow = ctx.createRadialGradient(sx, cy, r * 0.9, sx, cy, r * 1.02);
      shadow.addColorStop(0, "#03050b");
      shadow.addColorStop(0.75, "rgba(3, 5, 11, 0.97)");
      shadow.addColorStop(1, "rgba(3, 5, 11, 0)");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(sx, cy, r * 1.02, 0, Math.PI * 2);
      ctx.fill();

      // Earthshine: the shadowed part is not truly black
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(${SILVER}, 0.05)`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.restore();
    };

    /** High thin cloud drifting across, catching the moonlight. */
    const drawVeils = () => {
      const { cx, cy } = moonGeometry();
      veils.forEach((v) => {
        v.x += v.speed;
        const w = width * v.w;
        if (v.x - w > width) v.x = -w * 0.5;

        const x = v.x;
        const y = v.y - scrolled * 18;
        // Brighter the closer it passes the moon
        const near = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / (width * 0.55));
        const a = v.alpha * (0.55 + near * 1.5);

        const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        g.addColorStop(0, `rgba(${SILVER}, 0)`);
        g.addColorStop(0.5, `rgba(${SILVER}, ${a})`);
        g.addColorStop(1, `rgba(${SILVER}, 0)`);
        ctx.fillStyle = g;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, v.h / w);
        ctx.beginPath();
        ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawShooter = () => {
      if (!shooter) {
        if (--nextShooter <= 0) {
          const max = 46 + Math.random() * 22;
          shooter = {
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.35,
            vx: 9 + Math.random() * 6,
            vy: 3.4 + Math.random() * 2.4,
            life: max,
            max,
          };
          nextShooter = 420 + Math.random() * 700;
        }
        return;
      }

      const s = shooter;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 1;
      if (s.life <= 0) {
        shooter = null;
        return;
      }

      // Fade in and out rather than popping at both ends
      const f = s.life / s.max;
      const a = Math.min(1, f * 2) * Math.min(1, (1 - f) * 6);
      const tailX = s.x - s.vx * 9;
      const tailY = s.y - s.vy * 9;
      const g = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      g.addColorStop(0, `rgba(${BONE}, 0)`);
      g.addColorStop(1, `rgba(${BONE}, ${a * 0.85})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // New at the top of the page, full at the bottom, with a sliver to start
      // so the moon is never completely absent
      phase += (0.08 + target * 0.92 - phase) * 0.08;
      scrolled += (target - scrolled) * 0.1;

      ctx.clearRect(0, 0, width, height);

      /* Back to front. Every one of these is required: without the sky and
         dune blits the canvas is transparent and ThemeBackground's flat wash
         shows through, which reads as "the background is gone" even though
         the moon is still drawing. */
      if (skyLayer) ctx.drawImage(skyLayer, 0, 0);
      drawStars();
      drawShooter();
      drawMoon();
      drawVeils();
      if (duneLayer) ctx.drawImage(duneLayer, 0, 0);

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
    // z-[1], matching every other immersive backdrop: ThemeBackground owns
    // z-0 and paints an opaque wash, so a backdrop sharing that layer is at
    // the mercy of sibling order.
    <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default MoonPhaseBackground;
