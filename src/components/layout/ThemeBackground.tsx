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

    // The clean geometric blueprint doesn't need particles
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
        // 🏗️ ELEGANT ARC REACTOR BLUEPRINT (Like Spiderweb)
        time += 0.001; // Extremely slow, majestic rotation
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height) * 0.8;

        // Deep cosmic purple background for high text contrast
        const bgGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
        bgGlow.addColorStop(0, "rgba(20, 5, 40, 1)"); // Extremely dark purple at center
        bgGlow.addColorStop(0.5, "rgba(5, 1, 15, 1)"); // Near black
        bgGlow.addColorStop(1, "rgba(0, 0, 0, 1)"); // Pure black at edges
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(centerX, centerY);

        // --- DETAILED ARC REACTOR CORE ---
        ctx.save();
        
        const reactorPulse = Math.sin(time * 50) * 0.05 + 0.95; 
        
        // 1. Outer Glow Base (Dimmed for text visibility)
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(34, 211, 238, 0.2)";

        // 2. Outer Ring Casing
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
        ctx.stroke();

        ctx.shadowBlur = 10;

        // 3. Inner Coil Ring (10 segments)
        ctx.beginPath();
        ctx.arc(0, 0, 85, 0, Math.PI * 2);
        ctx.lineWidth = 30;
        // Circumference = 2 * PI * 85 = 534.07
        // 10 Segments -> Dash pattern length = 53.407
        ctx.setLineDash([35, 18.407]);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // 4. Triangle / Palladium core struts (Like Mark VI)
        ctx.save();
        ctx.rotate(-time * 0.5); // Very slow counter-rotation for the inner struts
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
          ctx.lineTo(Math.cos(angle) * 65, Math.sin(angle) * 65);
        }
        ctx.closePath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.stroke();
        ctx.restore();

        // 5. The intense center glowing core (Faded to act as watermark)
        ctx.beginPath();
        ctx.arc(0, 0, 45 * reactorPulse, 0, Math.PI * 2);
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 45 * reactorPulse);
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        coreGradient.addColorStop(0.2, "rgba(255, 255, 255, 0.15)");
        coreGradient.addColorStop(0.6, "rgba(34, 211, 238, 0.1)");
        coreGradient.addColorStop(1, "rgba(34, 211, 238, 0)");
        
        ctx.fillStyle = coreGradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 255, 255, 0.15)";
        ctx.fill();

        ctx.restore();
        // --------------------------------

        ctx.rotate(time);

        // Thin, elegant blueprint lines
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.25)"; // Faint crisp cyan
        ctx.shadowBlur = 0; // No blurry neon glows, keep it crisp like the web

        // 1. Concentric Blueprint Rings
        const numRings = 12;
        for (let i = 1; i <= numRings; i++) {
          const r = (i / numRings) * maxRadius;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
          
          // Thicker structural rings at certain intervals
          if (i % 3 === 0) {
             ctx.beginPath();
             ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
             ctx.stroke();
             ctx.beginPath();
             ctx.arc(0, 0, r - 4, 0, Math.PI * 2);
             ctx.stroke();
          }
        }

        // 2. Radial Structural Spokes
        const numSpokes = 24;
        ctx.beginPath();
        for (let i = 0; i < numSpokes; i++) {
          const angle = (i / numSpokes) * Math.PI * 2;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
        }
        ctx.stroke();

        // 3. Hexagonal Inner Truss Bracing
        const hexRadius = maxRadius * 0.25;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const nextAngle = ((i + 1) / 6) * Math.PI * 2;
          ctx.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
          ctx.lineTo(Math.cos(nextAngle) * hexRadius, Math.sin(nextAngle) * hexRadius);
        }
        ctx.stroke();

        ctx.restore();

        // Draw Corner HUD Reticles (Static)
        drawCornerHUD(ctx, width, height, "rgba(34, 211, 238, 0.3)", "rgba(245, 158, 11, 0.1)");

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
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-slate-50 dark:bg-[#030712] [.ironman_&]:bg-[#020408] [.deadpool_&]:bg-[#0b0203] [.thor_&]:bg-[#040a16] [.venom_&]:bg-white transition-colors duration-700 pointer-events-none select-none">
      {/* Ambient background glows */}
      <div className="absolute inset-0 hidden dark:block [.spiderman_&]:hidden [.ironman_&]:hidden [.deadpool_&]:hidden [.thor_&]:hidden [.venom_&]:hidden">
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

      {/* Deadpool Ambient Glows — pooled blood, no neon */}
      <div className="absolute inset-0 hidden [.deadpool_&]:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(190,18,40,0.28)_0%,rgba(11,2,3,0.98)_65%)]" />
        <div className="absolute top-[-12%] left-[-12%] w-[62%] h-[62%] bg-red-700/20 rounded-full blur-[170px]" />
        <div className="absolute bottom-[-12%] right-[-12%] w-[62%] h-[62%] bg-[#450a0a]/60 rounded-full blur-[150px]" />
      </div>

      {/* Venom Ambient Glows — we leave it empty because the canvas draws the pure white background */}
      <div className="absolute inset-0 hidden [.venom_&]:block overflow-hidden" />

      {/* Thor Ambient Glows — storm light above, deep charge pooling below */}
      <div className="absolute inset-0 hidden [.thor_&]:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.2)_0%,rgba(4,10,22,0.98)_62%)]" />
        <div className="absolute top-[-14%] left-[-10%] w-[60%] h-[60%] bg-sky-200/12 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-14%] left-[-8%] w-[58%] h-[58%] bg-blue-700/22 rounded-full blur-[170px]" />
        <div className="absolute bottom-[-10%] right-[-12%] w-[54%] h-[54%] bg-[#0ea5e9]/16 rounded-full blur-[160px]" />
      </div>

      {/* Moon Knight Ambient Glows — clean deep space */}
      <div className="absolute inset-0 hidden [.moonknight_&]:block bg-slate-950" />

      <div className="absolute inset-0 dark:hidden [.spiderman_&]:hidden [.ironman_&]:hidden [.deadpool_&]:hidden [.thor_&]:hidden [.moonknight_&]:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/20" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-300/10 rounded-full blur-[140px]" />
      </div>

      {/* FULLSCREEN CANVAS GEOMETRY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none [.spiderman_&]:hidden [.deadpool_&]:hidden [.thor_&]:hidden [.venom_&]:hidden opacity-90"
      />
    </div>
  );
};

export default ThemeBackground;
