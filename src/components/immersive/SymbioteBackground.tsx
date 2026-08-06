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

      // The mass on the void. Black-on-black has no silhouette, so the body
      // is lifted just off the page — barely a value above the background —
      // and the shape is actually carried by the bone specular down one
      // edge. That is how the character is lit everywhere he is drawn: you
      // read the highlight, not the fill.
      const tipX = ax + Math.cos(angle) * len;
      const tipY = ay + Math.sin(angle) * len;
      const body = ctx.createLinearGradient(ax, ay, tipX, tipY);
      body.addColorStop(0, "rgba(26, 26, 34, 0.95)");
      body.addColorStop(0.5, "rgba(15, 15, 21, 0.72)");
      body.addColorStop(1, "rgba(10, 10, 14, 0)");
      ctx.fillStyle = body;
      ctx.fill();

      // Cold violet in the belly, picked up from the ambient pools behind
      ctx.beginPath();
      right.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      const under = ctx.createLinearGradient(ax, ay, tipX, tipY);
      under.addColorStop(0, "rgba(108, 62, 178, 0.4)");
      under.addColorStop(0.6, "rgba(84, 40, 148, 0.14)");
      under.addColorStop(1, "rgba(84, 40, 148, 0)");
      ctx.strokeStyle = under;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Wet specular running down the spine — the bright edge that does the
      // actual drawing here
      ctx.beginPath();
      left.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      const sheen = ctx.createLinearGradient(ax, ay, tipX, tipY);
      sheen.addColorStop(0, "rgba(246, 245, 241, 0.8)");
      sheen.addColorStop(0.45, "rgba(246, 245, 241, 0.3)");
      sheen.addColorStop(1, "rgba(246, 245, 241, 0)");
      ctx.strokeStyle = sheen;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };

    const render = () => {
      t += 1;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // Eased toward the target so the creep lags the scroll slightly
      spread += (target - spread) * 0.16;

      ctx.clearRect(0, 0, width, height);

      // Oily mass shifting underneath (REMOVED to keep background pure white and avoid dirty shadows)

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
