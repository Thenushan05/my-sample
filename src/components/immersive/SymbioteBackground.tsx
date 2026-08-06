import React, { useEffect, useRef } from "react";

interface Tendril {
  /** Anchor on the viewport edge. */
  ax: number;
  ay: number;
  /** Direction it reaches, in radians. */
  angle: number;
  len: number;
  width: number;
  /** Per-tendril phase so they never writhe in unison. */
  phase: number;
  speed: number;
  wobble: number;
  segments: number;
}

interface Blob {
  x: number;
  y: number;
  r: number;
  drift: number;
  phase: number;
  alpha: number;
}

/**
 * Venom mode backdrop.
 *
 * The other modes draw patterns — a blueprint, a web, a comic page, a storm.
 * This one draws a creature: tendrils rooted in the edges of the viewport,
 * reaching inward and writhing continuously, over a bed of slow oily blobs.
 * Nothing here holds still, which is the point.
 */
export const SymbioteBackground: React.FC = () => {
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

    let tendrils: Tendril[] = [];
    let blobs: Blob[] = [];
    /** 0–1 down the page. Drives how far the mass has crept in. */
    let spread = 0;

    const build = () => {
      const reach = Math.min(width, height);

      // Rooted along all four edges so the mass frames the page
      const edges: Array<{ count: number; place: (f: number) => Tendril }> = [
        {
          count: 11,
          place: (f) => ({
            ax: -10,
            ay: height * f,
            angle: (Math.random() - 0.5) * 1.1,
            len: reach * (0.3 + Math.random() * 0.5),
            width: 11 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
            speed: 0.006 + Math.random() * 0.012,
            wobble: 0.18 + Math.random() * 0.3,
            segments: 12,
          }),
        },
        {
          count: 11,
          place: (f) => ({
            ax: width + 10,
            ay: height * f,
            angle: Math.PI + (Math.random() - 0.5) * 1.1,
            len: reach * (0.3 + Math.random() * 0.5),
            width: 11 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
            speed: 0.006 + Math.random() * 0.012,
            wobble: 0.18 + Math.random() * 0.3,
            segments: 12,
          }),
        },
        {
          count: 9,
          place: (f) => ({
            ax: width * f,
            ay: -10,
            angle: Math.PI / 2 + (Math.random() - 0.5) * 1.1,
            len: reach * (0.26 + Math.random() * 0.44),
            width: 13 + Math.random() * 32,
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.011,
            wobble: 0.16 + Math.random() * 0.28,
            segments: 11,
          }),
        },
        {
          count: 9,
          place: (f) => ({
            ax: width * f,
            ay: height + 10,
            angle: -Math.PI / 2 + (Math.random() - 0.5) * 1.1,
            len: reach * (0.26 + Math.random() * 0.44),
            width: 13 + Math.random() * 32,
            phase: Math.random() * Math.PI * 2,
            speed: 0.005 + Math.random() * 0.011,
            wobble: 0.16 + Math.random() * 0.28,
            segments: 11,
          }),
        },
      ];

      tendrils = edges.flatMap(({ count, place }) =>
        Array.from({ length: count }, (_, i) => place((i + 0.5) / count))
      );

      blobs = Array.from({ length: 13 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: reach * (0.1 + Math.random() * 0.22),
        drift: 0.0015 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.05 + Math.random() * 0.09,
      }));
    };

    /** Walk a tendril's spine, tapering the width toward the tip. */
    const drawTendril = (tendril: Tendril) => {
      const { ax, ay, angle, width: w, phase, speed, wobble, segments } = tendril;
      // This is the takeover: strands are stubs at the top of the page and
      // fully extended by the bottom. Thin tapered strands hold their shape
      // at any length, which large filled blobs did not.
      const len = tendril.len * (0.42 + spread * 1.35);

      const left: [number, number][] = [];
      const right: [number, number][] = [];

      for (let i = 0; i <= segments; i++) {
        const f = i / segments;
        // Lateral sway grows toward the tip, so the root stays anchored
        const sway = Math.sin(t * speed + phase + f * 3.2) * len * wobble * f;
        const a = angle + Math.sin(t * speed * 0.6 + phase) * 0.12;

        const cx = ax + Math.cos(a) * len * f - Math.sin(a) * sway;
        const cy = ay + Math.sin(a) * len * f + Math.cos(a) * sway;

        // Taper: full width at the root, needle at the tip
        const halfW = (w * (1 - f) ** 1.4) / 2;
        const nx = -Math.sin(a);
        const ny = Math.cos(a);

        left.push([cx + nx * halfW, cy + ny * halfW]);
        right.push([cx - nx * halfW, cy - ny * halfW]);
      }

      ctx.beginPath();
      left.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();

      // Black mass. The symbiote eats light: the body is near-pure black and
      // only the very edge catches a cold grey highlight.
      const tipX = ax + Math.cos(angle) * len;
      const tipY = ay + Math.sin(angle) * len;
      const body = ctx.createLinearGradient(ax, ay, tipX, tipY);
      body.addColorStop(0, "rgba(0, 0, 0, 0.96)");
      body.addColorStop(0.5, "rgba(0, 0, 0, 0.7)");
      body.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = body;
      ctx.fill();

      // Wet specular running down the spine
      ctx.beginPath();
      left.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      const sheen = ctx.createLinearGradient(ax, ay, tipX, tipY);
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.34)");
      sheen.addColorStop(0.55, "rgba(255, 255, 255, 0.14)");
      sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.strokeStyle = sheen;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // Eased toward the target so the creep lags the scroll slightly
      spread += (target - spread) * 0.16;

      ctx.clearRect(0, 0, width, height);

      // Oily mass shifting underneath
      blobs.forEach((blob) => {
        const bx = blob.x + Math.cos(t * blob.drift + blob.phase) * blob.r * 0.3;
        const by = blob.y + Math.sin(t * blob.drift * 1.3 + blob.phase) * blob.r * 0.22;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, blob.r);
        g.addColorStop(0, `rgba(0, 0, 0, ${blob.alpha * 1.6})`);
        g.addColorStop(0.5, `rgba(0, 0, 0, ${blob.alpha * 0.3})`);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      tendrils.forEach(drawTendril);

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
      {/* NOT screen-blended: the mass is black, and screen would erase it
          completely. Drawn normally so it actually occludes the backdrop. */}
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default SymbioteBackground;
