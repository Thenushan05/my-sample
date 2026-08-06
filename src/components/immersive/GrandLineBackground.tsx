import React, { useEffect, useRef } from "react";

interface Cloud {
  x: number;
  y: number;
  /** Fraction of viewport width. */
  w: number;
  h: number;
  speed: number;
  alpha: number;
}

interface Gull {
  x: number;
  y: number;
  speed: number;
  /** Wingbeat phase. */
  phase: number;
  scale: number;
}

/* The theme's palette, so the sea agrees with the poster rather than
   inventing its own blues. */
const INK = "36, 26, 16";
const PAPER = "243, 227, 191";

/**
 * Luffy mode backdrop.
 *
 * Iron Man draws a blueprint, Spider-Man a web, Deadpool a bled-on page,
 * Thor a storm, Venom a creature, Moon Knight a desert sky. This one draws
 * the GRAND LINE at midday: hard sun, a bright horizon, fat shonen clouds,
 * and swells rolling toward you with ink-drawn crests.
 *
 * It is the only backdrop in the set that is LIGHT, and that changes the
 * technique completely. On the dark themes shapes read by their highlights;
 * here everything reads by its ink OUTLINE, the way a manga panel does —
 * flat fills, no glow, and a drawn line on every silhouette.
 *
 * The sky wash and the cloud bank never move, so they are rendered once to
 * an offscreen canvas and blitted; only the swells, the sun glitter and the
 * gulls are redrawn per frame.
 */
export const GrandLineBackground: React.FC = () => {
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
    /** 0–1 down the page, eased. */
    let scrolled = 0;

    let clouds: Cloud[] = [];
    let gulls: Gull[] = [];
    let skyLayer: HTMLCanvasElement | null = null;

    /** Where the sea starts. Everything above is sky. */
    const horizon = () => height * 0.42;

    /** Sky wash, sun, and the far cloud bank. Static. */
    const buildSky = () => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      const s = c.getContext("2d");
      if (!s) return null;

      const hz = horizon();

      // Sky: hot and pale at the horizon, deeper overhead
      const sky = s.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, "#6fb7dc");
      sky.addColorStop(0.55, "#a8d8ea");
      sky.addColorStop(1, "#e8ecd8");
      s.fillStyle = sky;
      s.fillRect(0, 0, width, hz);

      // Sun, high and to the right, with a flat shonen halo
      const sunX = width * 0.78;
      const sunY = hz * 0.34;
      const sunR = Math.min(width, height) * 0.055;
      const halo = s.createRadialGradient(sunX, sunY, sunR, sunX, sunY, sunR * 7);
      halo.addColorStop(0, "rgba(255, 246, 210, 0.85)");
      halo.addColorStop(0.35, "rgba(255, 240, 190, 0.28)");
      halo.addColorStop(1, "rgba(255, 240, 190, 0)");
      s.fillStyle = halo;
      s.fillRect(0, 0, width, hz);
      s.beginPath();
      s.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      s.fillStyle = "#fff6d2";
      s.fill();

      // Sea: bright at the horizon, saturated toward the viewer
      const sea = s.createLinearGradient(0, hz, 0, height);
      sea.addColorStop(0, "#4d9dc4");
      sea.addColorStop(0.35, "#2b7ba6");
      sea.addColorStop(1, "#175f86");
      s.fillStyle = sea;
      s.fillRect(0, hz, width, height - hz);

      // The horizon itself is a drawn line, not a gradient boundary
      s.beginPath();
      s.moveTo(0, hz);
      s.lineTo(width, hz);
      s.strokeStyle = `rgba(${INK}, 0.5)`;
      s.lineWidth = 1.5;
      s.stroke();

      return c;
    };

    const build = () => {
      clouds = Array.from({ length: 7 }, (_, i) => ({
        x: (i / 7) * width * 1.3 - width * 0.15,
        y: horizon() * (0.14 + ((i * 37) % 100) / 100 * 0.6),
        w: 0.16 + (((i * 53) % 100) / 100) * 0.16,
        h: 0.05 + (((i * 29) % 100) / 100) * 0.05,
        speed: 0.07 + (((i * 17) % 100) / 100) * 0.1,
        alpha: 0.82 + (((i * 11) % 100) / 100) * 0.18,
      }));

      gulls = Array.from({ length: 5 }, (_, i) => ({
        x: (i / 5) * width,
        y: horizon() * (0.3 + ((i * 41) % 100) / 100 * 0.42),
        speed: 0.32 + (((i * 23) % 100) / 100) * 0.36,
        phase: (((i * 71) % 100) / 100) * Math.PI * 2,
        scale: 0.7 + (((i * 13) % 100) / 100) * 0.6,
      }));

      skyLayer = buildSky();
    };

    /** A fat shonen cloud: overlapping lobes with an ink outline. */
    const drawCloud = (cl: Cloud) => {
      const w = width * cl.w;
      const h = height * cl.h;
      cl.x += cl.speed;
      if (cl.x - w > width) cl.x = -w;

      const lobes: Array<[number, number, number]> = [
        [0, 0, h * 0.62],
        [-w * 0.3, h * 0.16, h * 0.44],
        [w * 0.3, h * 0.2, h * 0.48],
        [-w * 0.12, -h * 0.24, h * 0.42],
        [w * 0.14, -h * 0.18, h * 0.38],
      ];

      ctx.save();
      ctx.translate(cl.x, cl.y);

      // Fill first as one silhouette so the internal lobe seams don't show
      ctx.beginPath();
      lobes.forEach(([lx, ly, lr]) => {
        ctx.moveTo(lx + lr, ly);
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      });
      ctx.fillStyle = `rgba(255, 255, 252, ${cl.alpha})`;
      ctx.fill();

      // Underside tone — the only shading a manga cloud gets
      ctx.beginPath();
      ctx.ellipse(0, h * 0.3, w * 0.42, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180, 205, 220, 0.5)";
      ctx.fill();

      ctx.restore();
    };

    /** Swells rolling toward the viewer, each with a drawn crest. */
    const drawSwells = () => {
      const hz = horizon();
      const rows = 13;

      for (let i = 0; i < rows; i++) {
        const f = i / (rows - 1);
        // Perspective: rows bunch up at the horizon and spread toward us
        const y = hz + (height - hz) * f ** 1.85;
        const amp = 2 + f * 16;
        const len = 90 + f * 320;
        const speed = 0.006 + f * 0.02;
        const step = Math.max(6, 26 - f * 16);

        ctx.beginPath();
        for (let x = -len; x <= width + len; x += step) {
          const yy =
            y +
            Math.sin(x / len + t * speed + i * 1.7) * amp +
            Math.sin(x / (len * 0.4) - t * speed * 1.6 + i) * amp * 0.35;
          if (x === -len) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        // Ink line, heavier as it comes toward you
        ctx.strokeStyle = `rgba(${INK}, ${0.14 + f * 0.3})`;
        ctx.lineWidth = 0.8 + f * 1.8;
        ctx.stroke();

        // Foam flecks on the nearer swells only
        if (f > 0.45) {
          const flecks = Math.round(4 + f * 9);
          for (let k = 0; k < flecks; k++) {
            const fx = ((k * 137 + i * 61) % 100) / 100 * width;
            const drift = ((t * (0.3 + f)) % width);
            const px = (fx + drift) % width;
            const py =
              y +
              Math.sin(px / len + t * speed + i * 1.7) * amp -
              (1.5 + f * 3);
            ctx.beginPath();
            ctx.ellipse(px, py, 3 + f * 7, 1 + f * 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PAPER}, ${0.25 + f * 0.45})`;
            ctx.fill();
          }
        }
      }
    };

    /** Sun glitter: a bright column on the water under the sun. */
    const drawGlitter = () => {
      const hz = horizon();
      const sunX = width * 0.78;
      ctx.save();
      const g = ctx.createLinearGradient(0, hz, 0, height);
      g.addColorStop(0, "rgba(255, 246, 210, 0.5)");
      g.addColorStop(1, "rgba(255, 246, 210, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sunX - 10, hz);
      ctx.lineTo(sunX + 10, hz);
      ctx.lineTo(sunX + width * 0.16, height);
      ctx.lineTo(sunX - width * 0.16, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    /** A gull is two arcs. Anything more reads as a bird-shaped smudge. */
    const drawGull = (g: Gull) => {
      g.x += g.speed;
      if (g.x > width + 40) g.x = -40;

      const beat = Math.sin(t * 0.09 + g.phase);
      const span = 11 * g.scale;
      const lift = beat * 5 * g.scale;
      const y = g.y - scrolled * 26;

      ctx.beginPath();
      ctx.moveTo(g.x - span, y + lift);
      ctx.quadraticCurveTo(g.x - span * 0.45, y - lift * 0.7, g.x, y);
      ctx.quadraticCurveTo(g.x + span * 0.45, y - lift * 0.7, g.x + span, y + lift);
      ctx.strokeStyle = `rgba(${INK}, 0.5)`;
      ctx.lineWidth = 1.6 * g.scale;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      scrolled += (target - scrolled) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Back to front. The sky blit is opaque, so it also clears the frame.
      if (skyLayer) ctx.drawImage(skyLayer, 0, 0);
      clouds.forEach(drawCloud);
      gulls.forEach(drawGull);
      drawGlitter();
      drawSwells();

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

export default GrandLineBackground;
