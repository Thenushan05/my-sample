import React, { useEffect, useRef } from "react";

interface Drip {
  x: number;
  y: number;
  speed: number;
  width: number;
  tail: number;
  alpha: number;
}

/**
 * Deadpool mode backdrop.
 *
 * Spider-Man mode draws a symmetrical web, Iron Man mode draws a rotating
 * arc-reactor blueprint. This one draws a comic page that has been bled on:
 * a static layer of dried splatters + radiating action lines, with fresh
 * blood running down the glass on top of it.
 */
export const BloodSplatterBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frameId = 0;

    // The dried splatter + speed lines never change, so they are baked once
    // into an offscreen canvas and blitted each frame.
    let staticLayer = document.createElement("canvas");

    /** One irregular blob plus its satellite droplets. */
    const paintSplatter = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      alpha: number
    ) => {
      c.save();
      c.fillStyle = `rgba(124, 10, 24, ${alpha})`;

      // Main blob: a circle walked with random radial noise so no two match
      c.beginPath();
      const points = 22;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const jitter = radius * (0.62 + Math.random() * 0.55);
        const px = cx + Math.cos(angle) * jitter;
        const py = cy + Math.sin(angle) * jitter;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();

      // Satellite droplets flung outwards
      const droplets = 6 + Math.floor(Math.random() * 8);
      for (let i = 0; i < droplets; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (1.3 + Math.random() * 2.4);
        const r = radius * (0.05 + Math.random() * 0.16);
        c.beginPath();
        c.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r, 0, Math.PI * 2);
        c.fill();
      }

      // A couple of runs bleeding downwards out of the blob
      const runs = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < runs; i++) {
        const ox = cx + (Math.random() - 0.5) * radius * 1.2;
        const len = radius * (1.5 + Math.random() * 4);
        const w = radius * (0.08 + Math.random() * 0.12);
        c.beginPath();
        c.moveTo(ox - w, cy);
        c.lineTo(ox + w, cy);
        c.lineTo(ox + w * 0.55, cy + len);
        c.quadraticCurveTo(ox, cy + len + w * 2.2, ox - w * 0.55, cy + len);
        c.closePath();
        c.fill();
      }

      c.restore();
    };

    const buildStaticLayer = () => {
      staticLayer = document.createElement("canvas");
      staticLayer.width = width;
      staticLayer.height = height;
      const c = staticLayer.getContext("2d");
      if (!c) return;

      // Comic "action" speed lines converging on a high vanishing point.
      // Kept faint in the middle so hero text stays readable.
      const vpX = width * 0.5;
      const vpY = height * 0.18;
      const reach = Math.max(width, height) * 1.5;
      const lines = 90;
      for (let i = 0; i < lines; i++) {
        const angle = (i / lines) * Math.PI * 2 + Math.random() * 0.02;
        const inner = reach * (0.28 + Math.random() * 0.22);
        const gradient = c.createLinearGradient(
          vpX + Math.cos(angle) * inner,
          vpY + Math.sin(angle) * inner,
          vpX + Math.cos(angle) * reach,
          vpY + Math.sin(angle) * reach
        );
        gradient.addColorStop(0, "rgba(220, 20, 60, 0)");
        gradient.addColorStop(1, `rgba(220, 20, 60, ${0.1 + Math.random() * 0.16})`);

        c.strokeStyle = gradient;
        c.lineWidth = 0.6 + Math.random() * 2.6;
        c.beginPath();
        c.moveTo(vpX + Math.cos(angle) * inner, vpY + Math.sin(angle) * inner);
        c.lineTo(vpX + Math.cos(angle) * reach, vpY + Math.sin(angle) * reach);
        c.stroke();
      }

      // Dried splatters, biased towards the edges so the centre stays legible
      const splatters = 9;
      for (let i = 0; i < splatters; i++) {
        const edgeBias = Math.random() < 0.5 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3;
        const cx = edgeBias * width;
        const cy = Math.random() * height;
        paintSplatter(c, cx, cy, 26 + Math.random() * 70, 0.16 + Math.random() * 0.2);
      }

      // Two heavier pools bleeding in from the very top of the page
      paintSplatter(c, width * 0.22, -20, 90, 0.3);
      paintSplatter(c, width * 0.78, -34, 74, 0.26);
    };

    const spawnDrip = (initial = false): Drip => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -Math.random() * 200,
      speed: 0.18 + Math.random() * 0.55,
      width: 1 + Math.random() * 3.2,
      tail: 60 + Math.random() * 220,
      alpha: 0.18 + Math.random() * 0.35,
    });

    let drips: Drip[] = Array.from({ length: 16 }, () => spawnDrip(true));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(staticLayer, 0, 0);

      drips.forEach((drip, i) => {
        const gradient = ctx.createLinearGradient(drip.x, drip.y - drip.tail, drip.x, drip.y);
        gradient.addColorStop(0, "rgba(153, 27, 27, 0)");
        gradient.addColorStop(1, `rgba(190, 18, 40, ${drip.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = drip.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(drip.x, drip.y - drip.tail);
        ctx.lineTo(drip.x, drip.y);
        ctx.stroke();

        // Bead of blood at the leading edge
        ctx.fillStyle = `rgba(220, 20, 60, ${drip.alpha + 0.2})`;
        ctx.beginPath();
        ctx.arc(drip.x, drip.y, drip.width * 0.9, 0, Math.PI * 2);
        ctx.fill();

        drip.y += drip.speed;
        if (drip.y - drip.tail > height) drips[i] = spawnDrip();
      });

      frameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      buildStaticLayer();
      drips = Array.from({ length: 16 }, () => spawnDrip(true));
    };

    buildStaticLayer();
    render();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ mixBlendMode: "screen" }} />
    </div>
  );
};

export default BloodSplatterBackground;
