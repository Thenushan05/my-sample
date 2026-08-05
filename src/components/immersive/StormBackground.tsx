import React, { useEffect, useRef } from "react";

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

interface Bolt {
  /** Polyline of the main channel, plus recursive forks. */
  segments: Array<[number, number][]>;
  born: number;
  life: number;
}

/**
 * Thor mode backdrop.
 *
 * Iron Man draws a rotating blueprint, Spider-Man a symmetrical web,
 * Deadpool a bled-on comic page. This one is weather: layered storm cloud
 * banks, driving rain, and forked lightning that strikes on its own schedule
 * and lights the whole sky when it does.
 */
export const StormBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frameId = 0;
    let time = 0;

    /** Recursive forked bolt: jitter a channel, branch off it, repeat. */
    const buildBolt = (
      x: number,
      y: number,
      targetY: number,
      spread: number,
      depth: number
    ): Array<[number, number][]> => {
      const channel: [number, number][] = [[x, y]];
      let cx = x;
      let cy = y;
      const step = 14 + Math.random() * 16;

      while (cy < targetY) {
        cx += (Math.random() - 0.5) * spread;
        cy += step;
        channel.push([cx, cy]);
      }

      const out: Array<[number, number][]> = [channel];

      // Branch off a couple of mid-points, shorter and thinner each level
      if (depth > 0) {
        const forks = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < forks; i++) {
          const at = channel[Math.floor(channel.length * (0.3 + Math.random() * 0.5))];
          if (!at) continue;
          out.push(
            ...buildBolt(
              at[0],
              at[1],
              at[1] + (targetY - at[1]) * (0.35 + Math.random() * 0.4),
              spread * 1.5,
              depth - 1
            )
          );
        }
      }

      return out;
    };

    let bolts: Bolt[] = [];
    let nextStrike = 900 + Math.random() * 2600;
    /** 0–1, how lit the sky is right now. Drives the flash overlay. */
    let flash = 0;

    const strike = (now: number) => {
      const x = width * (0.12 + Math.random() * 0.76);
      bolts.push({
        segments: buildBolt(x, -30, height * (0.55 + Math.random() * 0.5), 26, 2),
        born: now,
        life: 260 + Math.random() * 260,
      });
      flash = 0.75 + Math.random() * 0.25;
      nextStrike = now + 1400 + Math.random() * 5200;
    };

    const spawnDrop = (initial = false): RainDrop => ({
      x: Math.random() * (width + 260) - 130,
      y: initial ? Math.random() * height : -Math.random() * 300,
      len: 10 + Math.random() * 26,
      speed: 7 + Math.random() * 12,
      alpha: 0.1 + Math.random() * 0.3,
    });

    // Thinned from a downpour to a steadier fall, so the carved sigils and
    // knotwork behind it stay legible
    const RAIN_COUNT = 130;
    let rain: RainDrop[] = Array.from({ length: RAIN_COUNT }, () => spawnDrop(true));

    const drawClouds = () => {
      // Three parallax bands of cloud, each a soft ellipse field drifting
      // at its own rate. Cheap stand-in for volumetric cloud, reads well
      // behind the rain.
      // Cold storm cloud, lit from above. Brightest band on top where the
      // lightning sits, deepening to slate-blue below so the white-hot bolts
      // stay the brightest thing on screen.
      const bands = [
        { y: height * 0.02, r: height * 0.3, drift: 0.006, alpha: 0.26, tint: "186,230,253" },
        { y: height * 0.13, r: height * 0.26, drift: -0.009, alpha: 0.2, tint: "125,178,232" },
        { y: height * 0.26, r: height * 0.2, drift: 0.013, alpha: 0.15, tint: "56,96,168" },
      ];

      bands.forEach((band, bi) => {
        for (let i = 0; i < 7; i++) {
          const phase = time * band.drift + i * 1.7 + bi;
          const cx = ((phase % 2) / 2) * (width + band.r * 2) - band.r;
          const cy = band.y + Math.sin(phase * 1.3) * height * 0.03;
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, band.r);
          gradient.addColorStop(0, `rgba(${band.tint}, ${band.alpha * 0.5})`);
          gradient.addColorStop(0.55, `rgba(${band.tint}, ${band.alpha * 0.18})`);
          gradient.addColorStop(1, `rgba(${band.tint}, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(cx, cy, band.r, band.r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawRain = () => {
      ctx.lineCap = "round";
      rain.forEach((drop, i) => {
        // Rain catching the cold light of the storm above
        ctx.strokeStyle = `rgba(191, 219, 254, ${drop.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Driven at an angle, like wind-blown rain
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.len * 0.32, drop.y - drop.len);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.speed * 0.32;
        if (drop.y - drop.len > height) rain[i] = spawnDrop();
      });
    };

    const drawBolts = (now: number) => {
      bolts = bolts.filter((bolt) => now - bolt.born < bolt.life);

      bolts.forEach((bolt) => {
        const age = (now - bolt.born) / bolt.life;
        // Flicker rather than fade linearly — lightning stutters
        const alpha = (1 - age) * (0.55 + Math.random() * 0.45);

        bolt.segments.forEach((channel, ci) => {
          const isMain = ci === 0;

          // Wide soft glow underneath
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.32})`;
          ctx.lineWidth = isMain ? 13 : 6;
          ctx.beginPath();
          channel.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
          ctx.stroke();

          // Hot white core
          ctx.strokeStyle = `rgba(240, 249, 255, ${alpha})`;
          ctx.lineWidth = isMain ? 2.4 : 1.2;
          ctx.beginPath();
          channel.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
          ctx.stroke();
        });
      });
    };

    const render = (now: number) => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      if (now > nextStrike) strike(now);

      drawClouds();

      // Sky lit by the strike, painted before the rain so drops catch the light
      if (flash > 0.01) {
        // White-hot where the bolt enters, falling away through storm blue
        const glow = ctx.createLinearGradient(0, 0, 0, height);
        glow.addColorStop(0, `rgba(224, 242, 254, ${flash * 0.4})`);
        glow.addColorStop(0.4, `rgba(125, 211, 252, ${flash * 0.18})`);
        glow.addColorStop(1, "rgba(37, 99, 235, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        flash *= 0.86;
      }

      drawRain();
      drawBolts(now);

      frameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      rain = Array.from({ length: RAIN_COUNT }, () => spawnDrop(true));
      bolts = [];
    };

    frameId = requestAnimationFrame(render);
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

export default StormBackground;
