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
    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (!document.documentElement.classList.contains("ironman")) {
        drawPattern();
      }
    };

    const drawPattern = () => {
      ctx.clearRect(0, 0, width, height);

      const isIronman = document.documentElement.classList.contains("ironman");
      const isSpiderman = document.documentElement.classList.contains("spiderman");
      const isDark = document.documentElement.classList.contains("dark");

      if (isIronman) {
        // 🦾 IRON MAN JARVIS HUD TARGETING SYSTEM
        time += 0.01;
        const cyanLine = "rgba(6, 182, 212, 0.35)";
        const cyanNode = "rgba(6, 182, 212, 0.7)";
        const goldAccent = "rgba(245, 158, 11, 0.5)";

        const centerX = width / 2;
        const centerY = height * 0.45;

        // 1. Concentric JARVIS Arc Reactor HUD Rings (Animated)
        const rings = [
          { r: 150, speed: 0.8, dash: [0], thick: 2, color: "rgba(6, 182, 212, 0.5)" },
          { r: 180, speed: -0.5, dash: [10, 15], thick: 1, color: "rgba(245, 158, 11, 0.4)" },
          { r: 300, speed: -0.2, dash: [30, 15, 10, 15], thick: 1.5, color: cyanLine },
          { r: 450, speed: 0.15, dash: [80, 40], thick: 1, color: "rgba(6, 182, 212, 0.2)" },
          { r: 480, speed: 0.1, dash: [4, 8], thick: 3, color: "rgba(6, 182, 212, 0.1)" },
          { r: 650, speed: -0.05, dash: [2, 12], thick: 1, color: "rgba(245, 158, 11, 0.2)" },
          { r: 850, speed: 0.02, dash: [150, 80, 20, 80], thick: 1.5, color: cyanLine }
        ];

        // Central Arc Glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
        ctx.fill();

        rings.forEach((ring) => {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(time * ring.speed);
          ctx.beginPath();
          ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = ring.thick;
          ctx.setLineDash(ring.dash);
          ctx.stroke();
          ctx.restore();
        });

        // Crosshairs
        ctx.strokeStyle = goldAccent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 900, centerY);
        ctx.lineTo(centerX + 900, centerY);
        ctx.moveTo(centerX, centerY - 900);
        ctx.lineTo(centerX, centerY + 900);
        ctx.stroke();

        // Animated Radar Sweep Line
        const sweepY = (Math.sin(time * 2) * 0.5 + 0.5) * height;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(width, sweepY);
        ctx.stroke();

        const sweepX = (Math.cos(time * 1.5) * 0.5 + 0.5) * width;
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, height);
        ctx.stroke();

        // Corner HUD Reticles
        drawCornerHUD(ctx, width, height, "rgba(6, 182, 212, 0.6)", "rgba(245, 158, 11, 0.6)");

        animationFrameId = requestAnimationFrame(drawPattern);
        return;
      }

      // Normal / Dark mode drawing
      cancelAnimationFrame(animationFrameId);

      // Line & Dot colors matching standard / Spidey mode style
      const lineColor = isDark ? "rgba(96, 165, 250, 0.16)" : "rgba(37, 99, 235, 0.18)";
      const nodeColor = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(37, 99, 235, 0.4)";
      const accentColor = isDark ? "rgba(147, 197, 253, 0.25)" : "rgba(29, 78, 216, 0.25)";

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = lineColor;
      ctx.fillStyle = nodeColor;

      const hexRadius = 70;
      const h = hexRadius * Math.sqrt(3);

      for (let y = -h; y < height + h * 2; y += h) {
        for (let x = -hexRadius; x < width + hexRadius * 3; x += hexRadius * 3) {
          drawHexNode(ctx, x, y, hexRadius);
          drawHexNode(ctx, x + hexRadius * 1.5, y + h / 2, hexRadius);
        }
      }

      drawCornerHUD(ctx, width, height, accentColor, nodeColor);
    };

    const drawCornerHUD = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      accent: string,
      node: string
    ) => {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(30, 100); ctx.lineTo(30, 30); ctx.lineTo(100, 30);
      ctx.moveTo(30, 30); ctx.lineTo(60, 60);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(w - 30, 100); ctx.lineTo(w - 30, 30); ctx.lineTo(w - 100, 30);
      ctx.moveTo(w - 30, 30); ctx.lineTo(w - 60, 60);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(30, h - 100); ctx.lineTo(30, h - 30); ctx.lineTo(100, h - 30);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - 30, h - 100); ctx.lineTo(w - 30, h - 30); ctx.lineTo(w - 100, h - 30);
      ctx.stroke();

      const corners = [
        [30, 30], [100, 30], [30, 100],
        [w - 30, 30], [w - 100, 30], [w - 30, 100],
        [30, h - 30], [w - 30, h - 30]
      ];

      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = node;
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
      context.setLineDash([]);
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) context.moveTo(hx, hy);
        else context.lineTo(hx, hy);
      }
      context.closePath();
      context.stroke();

      context.beginPath();
      context.arc(x, y, 1.2, 0, Math.PI * 2);
      context.fill();
    };

    drawPattern();

    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(animationFrameId);
      drawPattern();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-slate-50 dark:bg-[#030712] [.ironman_&]:bg-[#020408] transition-colors duration-700 pointer-events-none select-none">
      {/* Ambient background glows */}
      <div className="absolute inset-0 hidden dark:block [.spiderman_&]:hidden [.ironman_&]:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.95)_0%,rgba(3,7,18,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Iron Man Ambient Glows */}
      <div className="absolute inset-0 hidden [.ironman_&]:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.22)_0%,rgba(2,4,8,0.98)_70%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-500/15 rounded-full blur-[160px]" />
      </div>

      <div className="absolute inset-0 dark:hidden [.spiderman_&]:hidden [.ironman_&]:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/20" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-300/10 rounded-full blur-[140px]" />
      </div>

      {/* FULLSCREEN CANVAS GEOMETRY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none [.spiderman_&]:hidden opacity-90"
      />
    </div>
  );
};

export default ThemeBackground;
