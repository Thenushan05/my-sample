import React, { useEffect, useRef } from "react";

export const ThemeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drawPattern();
    };

    const drawPattern = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");

      // Line & Dot colors matching Spidey mode style (subtle, crisp vector lines)
      const lineColor = isDark ? "rgba(96, 165, 250, 0.16)" : "rgba(37, 99, 235, 0.18)";
      const nodeColor = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(37, 99, 235, 0.4)";
      const accentColor = isDark ? "rgba(147, 197, 253, 0.25)" : "rgba(29, 78, 216, 0.25)";

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = lineColor;
      ctx.fillStyle = nodeColor;

      // ── 1. ISOMETRIC HEXAGON & NETWORK CONSTELLATION GRID ──
      const hexRadius = 70;
      const h = hexRadius * Math.sqrt(3);

      for (let y = -h; y < height + h * 2; y += h) {
        for (let x = -hexRadius; x < width + hexRadius * 3; x += hexRadius * 3) {
          drawHexNode(ctx, x, y, hexRadius);
          drawHexNode(ctx, x + hexRadius * 1.5, y + h / 2, hexRadius);
        }
      }

      // ── 2. CORNER HUD TECH CIRCUITS (LIKE SPIDEY HUD BACKGROUND) ──
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.0;

      // Top-Left Corner Circuit
      ctx.beginPath();
      ctx.moveTo(30, 100);
      ctx.lineTo(30, 30);
      ctx.lineTo(100, 30);
      ctx.moveTo(30, 30);
      ctx.lineTo(60, 60);
      ctx.stroke();

      // Top-Right Corner Circuit
      ctx.beginPath();
      ctx.moveTo(width - 30, 100);
      ctx.lineTo(width - 30, 30);
      ctx.lineTo(width - 100, 30);
      ctx.moveTo(width - 30, 30);
      ctx.lineTo(width - 60, 60);
      ctx.stroke();

      // Bottom-Left Corner Circuit
      ctx.beginPath();
      ctx.moveTo(30, height - 100);
      ctx.lineTo(30, height - 30);
      ctx.lineTo(100, height - 30);
      ctx.stroke();

      // Bottom-Right Corner Circuit
      ctx.beginPath();
      ctx.moveTo(width - 30, height - 100);
      ctx.lineTo(width - 30, height - 30);
      ctx.lineTo(width - 100, height - 30);
      ctx.stroke();

      // ── 3. STATIC NODES / CROSSHAIR DOTS AT CORNERS ──
      const corners = [
        [30, 30],
        [100, 30],
        [30, 100],
        [width - 30, 30],
        [width - 100, 30],
        [width - 30, 100],
        [30, height - 30],
        [width - 30, height - 30],
      ];

      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });
    };

    const drawHexNode = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number
    ) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) context.moveTo(hx, hy);
        else context.lineTo(hx, hy);
      }
      context.closePath();
      context.stroke();

      // Draw center node dot for tech constellation look
      context.beginPath();
      context.arc(x, y, 1.2, 0, Math.PI * 2);
      context.fill();
    };

    drawPattern();

    window.addEventListener("resize", handleResize);

    // Re-draw when dark/spiderman mode toggles
    const observer = new MutationObserver(() => drawPattern());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-700 pointer-events-none select-none">
      {/* Ambient background glows */}
      <div className="absolute inset-0 hidden dark:block [.spiderman_&]:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.95)_0%,rgba(3,7,18,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="absolute inset-0 dark:hidden [.spiderman_&]:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/20" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-300/10 rounded-full blur-[140px]" />
      </div>

      {/* FULLSCREEN CANVAS GEOMETRY (LIKE SPIDEY BACKGROUND BUT HEXAGONAL/HUD NETWORK) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none [.spiderman_&]:hidden opacity-90"
      />
    </div>
  );
};

export default ThemeBackground;
