import React, { useEffect, useRef } from "react";

export const SpiderwebBackground: React.FC = () => {
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

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Spider web properties
    const centerX = width / 2;
    const centerY = height / 2;
    let maxRadius = Math.max(width, height);
    const numRadials = 16;
    const numSpirals = 15;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.1)";
      } else {
        ctx.strokeStyle = `rgba(0, 0, 0, 0.25)`;
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      }
      
      ctx.lineWidth = 1.0;
      ctx.shadowBlur = 4;
      
      // Draw radial threads
      ctx.beginPath();
      for (let i = 0; i < numRadials; i++) {
        const angle = (i / numRadials) * Math.PI * 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius
        );
      }
      ctx.stroke();

      // Draw spiral threads with a slight sag (quadratic curve)
      ctx.beginPath();
      for (let s = 1; s <= numSpirals; s++) {
        const radius = (s / numSpirals) * maxRadius;
        
        for (let i = 0; i < numRadials; i++) {
          const angle1 = (i / numRadials) * Math.PI * 2;
          const angle2 = ((i + 1) / numRadials) * Math.PI * 2;
          
          const x1 = centerX + Math.cos(angle1) * radius;
          const y1 = centerY + Math.sin(angle1) * radius;
          
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;
          
          // Add sag to the web
          const midAngle = (angle1 + angle2) / 2;
          const sagRadius = radius * 0.92; // sags inwards
          const cx = centerX + Math.cos(midAngle) * sagRadius;
          const cy = centerY + Math.sin(midAngle) * sagRadius;
          
          if (i === 0) {
            ctx.moveTo(x1, y1);
          }
          ctx.quadraticCurveTo(cx, cy, x2, y2);
        }
      }
      ctx.stroke();
    };

    render();

    // Re-render when dark mode class changes
    const observer = new MutationObserver(() => render());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
};
