import React, { useEffect, useRef } from "react";

export const ThemeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const numParticles = Math.min(100, Math.floor((width * height) / 15000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const isSpidey = document.documentElement.classList.contains("spiderman");

      // Don't render particles if Spidey mode is active (it has its own background)
      if (isSpidey) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.lineWidth = 0.5;
      const maxDistance = 150;

      // Update and draw particles
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(100, 150, 255, 0.4)" : "rgba(100, 100, 200, 0.2)";
        ctx.fill();

        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.2 : 0.1);
            ctx.strokeStyle = isDark ? `rgba(100, 150, 255, ${alpha})` : `rgba(100, 100, 200, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-700">
      
      {/* ── DARK MODE BASE ── */}
      <div className="absolute inset-0 hidden dark:block [.spiderman_&]:hidden transition-opacity duration-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.95)_0%,rgba(3,7,18,1)_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      {/* ── LIGHT MODE BASE ── */}
      <div className="absolute inset-0 dark:hidden [.spiderman_&]:hidden transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-200/20 rounded-full blur-[120px]" />
      </div>

      {/* ── HTML5 CANVAS NEURAL CONSTELLATION ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none [.spiderman_&]:hidden"
      />

      {/* ── SHARED GRID PATTERN ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none [.spiderman_&]:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(150,150,150,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150,150,150,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
export default ThemeBackground;
