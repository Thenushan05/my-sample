import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  twinkle: number;
  phase: number;
}

interface Crater {
  /** Position on the moon disc, in units of the moon radius. */
  dx: number;
  dy: number;
  r: number;
  depth: number;
}

/** Fixed crater field so the moon's face never reshuffles between frames. */
const CRATERS: Crater[] = [
  { dx: -0.32, dy: -0.28, r: 0.19, depth: 0.5 },
  { dx: 0.24, dy: -0.42, r: 0.11, depth: 0.38 },
  { dx: 0.41, dy: 0.08, r: 0.15, depth: 0.44 },
  { dx: -0.12, dy: 0.34, r: 0.22, depth: 0.4 },
  { dx: -0.52, dy: 0.24, r: 0.09, depth: 0.32 },
  { dx: 0.06, dy: -0.06, r: 0.13, depth: 0.3 },
  { dx: 0.3, dy: 0.46, r: 0.1, depth: 0.36 },
  { dx: -0.44, dy: -0.02, r: 0.07, depth: 0.28 },
  { dx: 0.55, dy: -0.24, r: 0.06, depth: 0.26 },
];

/**
 * Moon Knight mode backdrop.
 *
 * Iron Man draws a blueprint, Spider-Man a web, Deadpool a bled-on page,
 * Thor a storm, Venom a creature. This one draws the SKY — and the moon in it
 * runs its phases as you read: a thin crescent at the top of the page, full at
 * the bottom. The terminator is drawn as a real shadow disc sliding across the
 * face, so the phase is genuinely geometric rather than a mask fade.
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

    let stars: Star[] = [];

    const build = () => {
      const count = Math.round((width * height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        // Denser toward the top: the horizon haze washes the low stars out
        y: Math.pow(Math.random(), 1.5) * height,
        r: 0.4 + Math.random() * 1.3,
        base: 0.15 + Math.random() * 0.6,
        twinkle: 0.004 + Math.random() * 0.014,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const moonGeometry = () => ({
      cx: width * 0.5,
      cy: height * 0.28,
      r: Math.min(width, height) * 0.19,
    });

    const drawStars = () => {
      stars.forEach((star) => {
        const a = star.base + Math.sin(t * star.twinkle + star.phase) * 0.28;
        ctx.fillStyle = `rgba(242, 239, 230, ${Math.max(0, a)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawMoon = () => {
      const { cx, cy, r } = moonGeometry();

      // Halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 3.4);
      halo.addColorStop(0, "rgba(242, 239, 230, 0.16)");
      halo.addColorStop(0.4, "rgba(201, 209, 220, 0.06)");
      halo.addColorStop(1, "rgba(201, 209, 220, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.4, 0, Math.PI * 2);
      ctx.fill();

      // The lit disc, clipped so craters and the terminator stay on the face
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const face = ctx.createRadialGradient(
        cx - r * 0.3,
        cy - r * 0.35,
        r * 0.1,
        cx,
        cy,
        r * 1.15
      );
      face.addColorStop(0, "#fbf9f4");
      face.addColorStop(0.55, "#e8e4d8");
      face.addColorStop(1, "#b9b6ab");
      ctx.fillStyle = face;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Craters
      CRATERS.forEach((crater) => {
        const px = cx + crater.dx * r;
        const py = cy + crater.dy * r;
        const pr = crater.r * r;
        const shade = ctx.createRadialGradient(px, py, 0, px, py, pr);
        shade.addColorStop(0, `rgba(120, 118, 108, ${crater.depth * 0.5})`);
        shade.addColorStop(0.7, `rgba(150, 148, 138, ${crater.depth * 0.22})`);
        shade.addColorStop(1, "rgba(150, 148, 138, 0)");
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();

        // Sunlit rim on the upper-left of each crater
        ctx.strokeStyle = `rgba(255, 253, 247, ${crater.depth * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pr * 0.95, Math.PI * 0.9, Math.PI * 1.9);
        ctx.stroke();
      });

      // The terminator: a shadow disc of the same radius, offset horizontally.
      // At phase 0 it sits dead on top (new moon); at phase 1 it has slid
      // fully clear (full moon). That offset is what makes the crescent read
      // as real geometry instead of an opacity fade.
      const offset = (1 - phase) * r * 2.05;
      ctx.fillStyle = "#05070d";
      ctx.beginPath();
      ctx.arc(cx - offset, cy, r * 1.005, 0, Math.PI * 2);
      ctx.fill();

      // Earthshine: the shadowed part is not truly black
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(120, 130, 150, 0.05)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.restore();

      // Cold rim on the lit limb
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + phase * 0.3})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    };

    const drawDunes = () => {
      // Two dune ridges, the near one darker. Static silhouettes — the sky
      // does the moving in this mode.
      const ridges = [
        { base: 0.9, amp: 0.035, freq: 1.6, fill: "rgba(14, 18, 27, 0.9)", shift: 0 },
        { base: 0.95, amp: 0.028, freq: 2.4, fill: "rgba(6, 9, 15, 0.96)", shift: 1.2 },
      ];

      ridges.forEach((ridge) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 8) {
          const n =
            Math.sin((x / width) * Math.PI * ridge.freq + ridge.shift) * 0.6 +
            Math.sin((x / width) * Math.PI * ridge.freq * 2.7 + ridge.shift * 2) * 0.4;
          ctx.lineTo(x, height * ridge.base - n * height * ridge.amp);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = ridge.fill;
        ctx.fill();
      });
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // New at the top of the page, full at the bottom, with a sliver to start
      // so the moon is never completely absent
      phase += (0.08 + target * 0.92 - phase) * 0.08;

      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawMoon();
      drawDunes();

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

export default MoonPhaseBackground;
