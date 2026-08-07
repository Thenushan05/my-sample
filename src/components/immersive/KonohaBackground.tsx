import React, { useEffect, useRef } from "react";

interface Leaf {
  x: number;
  y: number;
  size: number;
  fall: number;
  drift: number;
  phase: number;
  rotation: number;
  hue: 0 | 1;
}

interface CloudBand {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

/* The theme's palette, kept in one place so the backdrop agrees with the
   console and overlay rather than inventing its own colours. */
const ORANGE = "255, 106, 0";
const GREEN = "58, 122, 58";

/**
 * Naruto mode backdrop.
 *
 * Third pass. The second one made the theme genuinely bright (a real
 * pivot from the original dark-void build), but a blue sky reads as
 * "generic bright anime day," not specifically him — direct feedback
 * was that it didn't feel like the character's own colours at all. This
 * version keeps the daylight-theme structure (matching how Luffy's
 * GrandLineBackground runs its whole page as a bright scene) but makes
 * the sky itself HIS gradient — a burning orange-to-gold sunset over
 * the village, the promo-art palette, rather than a blue midday sky
 * that happens to have some orange trim. The cliff silhouette is still
 * abstracted to plain rounded humps rather than carved likenesses —
 * evocative of the Hokage Monument without reproducing anyone's actual
 * portrait.
 *
 * Sky, cliff, canopy and rooftops never move, so they render once to an
 * offscreen canvas; only drifting clouds and falling leaves are redrawn
 * per frame. The giant Nine-Tails loom is the one large-scale animated
 * flourish — rebuilt this pass with an actual recognisable fox head and
 * nine distinct fanned tails, after feedback that the previous shape
 * didn't read as Kurama at all.
 */
export const KonohaBackground: React.FC = () => {
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
    let scrolled = 0;

    let clouds: CloudBand[] = [];
    let leaves: Leaf[] = [];
    let farLayer: HTMLCanvasElement | null = null;

    // The giant Nine-Tails, looming — a rare, large-scale echo of the
    // small chakra flare on the hero card. loomAlpha is driven by a
    // plain timer rather than React state — this whole component is an
    // imperative rAF loop, so a re-render for every alpha tick would be
    // pure waste.
    let loomAlpha = 0;
    let loomTarget = 0;
    let loomTimer = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const fireLoom = () => {
      loomTarget = 1;
      window.setTimeout(() => { loomTarget = 0; }, 5200);
      loomTimer = window.setTimeout(fireLoom, 14000 + Math.random() * 6000);
    };

    /** The FIRST fire only, scheduled separately from the recurring
        ones below — the loader overlay (see NarutoLoader) covers the
        screen for ~3.15s, so scheduling this one on the same long
        14-20s cadence as the repeats meant the earliest, most
        attention-grabbing appearance could land while a returning
        visitor has already scrolled away. 3.8s clears the loader with
        margin without competing with the hero card's own flare at 3.6s. */
    const scheduleLoom = () => {
      loomTimer = window.setTimeout(fireLoom, 3800);
    };

    /** Sky wash and the cliff/canopy/rooftop silhouettes. Static. */
    const buildFar = () => {
      const layer = document.createElement("canvas");
      layer.width = width;
      layer.height = height;
      const s = layer.getContext("2d");
      if (!s) return layer;

      // His sky: a burning orange-to-gold sunset, not a blue midday —
      // the palette IS the identity here, not a backdrop that happens
      // to have orange trim.
      const sky = s.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#ff8a1e");
      sky.addColorStop(0.28, "#ff9f2e");
      sky.addColorStop(0.52, "#ffb84d");
      sky.addColorStop(0.74, "#ffd873");
      sky.addColorStop(1, "#ffe9a6");
      s.fillStyle = sky;
      s.fillRect(0, 0, width, height);

      // A huge, low sun — the single loudest shape in the whole scene
      const sunX = width * 0.5;
      const sunY = height * 0.42;
      const sunR = Math.min(width, height) * 0.11;
      const glow = s.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 7);
      glow.addColorStop(0, "rgba(255, 250, 220, 0.95)");
      glow.addColorStop(0.35, `rgba(${ORANGE}, 0.35)`);
      glow.addColorStop(1, `rgba(${ORANGE}, 0)`);
      s.fillStyle = glow;
      s.fillRect(0, 0, width, height);
      s.beginPath();
      s.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      s.fillStyle = "#fff6d9";
      s.fill();

      // The cliff monument: sunlit stone with a ridge of rounded humps,
      // abstracted — evokes the carved Hokage faces without depicting
      // anyone
      const cliffBaseY = height * 0.6;
      s.fillStyle = "#c9b896";
      s.beginPath();
      s.moveTo(0, cliffBaseY + 60);
      s.lineTo(0, cliffBaseY);
      const humps = 5;
      for (let i = 0; i <= humps; i++) {
        const hx = (width * 0.15) + (i / humps) * (width * 0.7);
        const hy = cliffBaseY - Math.sin((i / humps) * Math.PI) * (height * 0.08) - (i % 2 === 0 ? 8 : 0);
        s.quadraticCurveTo(
          hx - (width * 0.7) / humps / 2, cliffBaseY - 6,
          hx, hy
        );
      }
      s.lineTo(width, cliffBaseY);
      s.lineTo(width, cliffBaseY + 60);
      s.closePath();
      s.fill();
      // Stone shading — a soft vertical gradient so the cliff doesn't
      // read as a flat cutout
      const stoneShade = s.createLinearGradient(0, cliffBaseY - height * 0.09, 0, cliffBaseY + 60);
      stoneShade.addColorStop(0, "rgba(255,255,255,0.25)");
      stoneShade.addColorStop(1, "rgba(120,100,70,0.25)");
      s.fillStyle = stoneShade;
      s.fill();

      // The forest canopy, backlit by the sunset into a darker green
      // silhouette rather than a flat midday green
      const canopyBaseY = height * 0.72;
      s.fillStyle = "#2c5c34";
      s.beginPath();
      s.moveTo(0, height);
      s.lineTo(0, canopyBaseY);
      let cx = 0;
      let seed = 3;
      const rnd1 = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      while (cx < width) {
        const r = 22 + rnd1() * 30;
        s.arc(cx + r, canopyBaseY, r, Math.PI, 0);
        cx += r * 1.6;
      }
      s.lineTo(width, height);
      s.closePath();
      s.fill();
      s.fillStyle = "rgba(255,255,255,0.08)";
      s.fill();

      // Rooftop skyline, warm wood tones over the canopy line
      const roofBaseY = height * 0.8;
      s.fillStyle = "#5a3c22";
      s.beginPath();
      s.moveTo(0, height);
      s.lineTo(0, roofBaseY);
      let rx = 0;
      let seed2 = 7;
      const rnd2 = () => {
        seed2 = (seed2 * 9301 + 49297) % 233280;
        return seed2 / 233280;
      };
      while (rx < width) {
        const w = 26 + rnd2() * 46;
        const h = 14 + rnd2() * 30;
        s.lineTo(rx, roofBaseY - h * 0.3);
        s.lineTo(rx + w * 0.5, roofBaseY - h);
        s.lineTo(rx + w, roofBaseY - h * 0.3);
        rx += w;
      }
      s.lineTo(width, roofBaseY);
      s.lineTo(width, height);
      s.closePath();
      s.fill();

      return layer;
    };

    const initLeaves = () => {
      leaves = Array.from({ length: 14 }, () => ({
        x: rand(0, width),
        y: rand(-height * 0.3, height),
        size: rand(5, 11),
        fall: rand(14, 28),
        drift: rand(-14, 14),
        phase: rand(0, Math.PI * 2),
        rotation: rand(0, Math.PI * 2),
        hue: Math.random() > 0.5 ? 1 : 0,
      }));
    };

    const initClouds = () => {
      clouds = Array.from({ length: 6 }, () => ({
        x: rand(0, width),
        y: rand(height * 0.05, height * 0.4),
        scale: rand(0.6, 1.5),
        speed: rand(3, 8),
      }));
    };

    const drawCloud = (c: CloudBand) => {
      const x = ((c.x + t * c.speed * 0.01) % (width + 300)) - 150;
      const y = c.y - scrolled * 0.04;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(c.scale, c.scale);
      ctx.fillStyle = "rgba(255,240,214,0.9)";
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.arc(26, -8, 26, 0, Math.PI * 2);
      ctx.arc(54, 0, 20, 0, Math.PI * 2);
      ctx.arc(24, 10, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (leaf: Leaf) => {
      leaf.y += leaf.fall * 0.016;
      leaf.x += Math.sin(t * 0.0012 + leaf.phase) * 0.25 + leaf.drift * 0.01;
      leaf.rotation += 0.012;
      if (leaf.y > height + 20) {
        leaf.y = -20;
        leaf.x = rand(0, width);
      }
      if (leaf.x < -20) leaf.x = width + 20;
      if (leaf.x > width + 20) leaf.x = -20;

      ctx.save();
      ctx.translate(leaf.x, leaf.y - scrolled * 0.12);
      ctx.rotate(leaf.rotation);
      ctx.fillStyle = leaf.hue ? `rgba(${ORANGE}, 0.6)` : `rgba(${GREEN}, 0.55)`;
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size);
      ctx.quadraticCurveTo(leaf.size * 0.7, 0, 0, leaf.size);
      ctx.quadraticCurveTo(-leaf.size * 0.7, 0, 0, -leaf.size);
      ctx.fill();
      ctx.restore();
    };

    /** The giant fox, staged as a ghost in the sky. Rebuilt after
        feedback that the first shape didn't read as Kurama at all — the
        tails were a dark, low-opacity brown-red on a similarly warm
        sky, so they simply blended in. This version uses a bold,
        near-opaque saturated red-orange for the tails with a dark
        outline stroke on every shape, and a deliberately drawn head:
        two pointed ears and a distinct snout, not an ambiguous zigzag. */
    const drawLoom = () => {
      loomAlpha += (loomTarget - loomAlpha) * 0.04;
      if (loomAlpha < 0.01) return;

      const cx = width * 0.5;
      const cy = height * 0.24;
      const scale = Math.min(width, height) * 0.011;

      ctx.save();
      ctx.globalAlpha = loomAlpha;
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 80);
      halo.addColorStop(0, "rgba(255, 60, 0, 0.5)");
      halo.addColorStop(1, "rgba(255, 60, 0, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fill();

      // Nine tails, fanned wide in a clear arc behind the head — bold
      // saturated fill with a dark ink outline so every tail reads as
      // its own shape against the sky, not a wash of colour.
      ctx.lineJoin = "round";
      for (let i = 0; i < 9; i++) {
        const a = (i - 4) * 0.26;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.quadraticCurveTo(13, -22, 5, -58);
        ctx.quadraticCurveTo(0, -66, -5, -58);
        ctx.quadraticCurveTo(-13, -22, 0, 4);
        ctx.closePath();
        ctx.fillStyle = "#d43a12";
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "rgba(60, 12, 4, 0.9)";
        ctx.stroke();
        // A darker tip, the way each tail is drawn in official art
        ctx.beginPath();
        ctx.moveTo(3, -46);
        ctx.quadraticCurveTo(0, -66, -3, -46);
        ctx.quadraticCurveTo(0, -56, 3, -46);
        ctx.closePath();
        ctx.fillStyle = "rgba(60, 12, 4, 0.85)";
        ctx.fill();
        ctx.restore();
      }

      // The head: two clear pointed ears, then an actual fox muzzle
      // tapered to a point at the nose — the original round oval read
      // as a cat, not a fox, per direct feedback.
      ctx.fillStyle = "#2a1006";
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1;
      [-1, 1].map((side) => {
        ctx.beginPath();
        ctx.moveTo(side * 10, -6);
        ctx.lineTo(side * 26, -34);
        ctx.lineTo(side * 16, -2);
        ctx.closePath();
        ctx.fill();
      });
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.bezierCurveTo(18, -20, 28, -8, 26, 6);
      ctx.bezierCurveTo(24, 18, 12, 24, 0, 32);
      ctx.bezierCurveTo(-12, 24, -24, 18, -26, 6);
      ctx.bezierCurveTo(-28, -8, -18, -20, 0, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // The nose, a dark point at the tip of the snout
      ctx.beginPath();
      ctx.ellipse(0, 27, 2.6, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(10, 5, 2, 0.75)";
      ctx.fill();

      // Whisker marks, thick ink strokes on each cheek
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      [-1, 1].forEach((side) => {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(side * 9, -2 + i * 4);
          ctx.lineTo(side * 20, -4 + i * 4);
          ctx.stroke();
        }
      });

      // The eyes: slit, glowing red — the one saturated colour on the
      // whole silhouette
      ctx.fillStyle = "#ff2a1f";
      ctx.shadowColor = "rgba(255,42,31,0.95)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(-8, -6, 4.4, 1.8, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, -6, 4.4, 1.8, 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      t += 16;
      ctx.clearRect(0, 0, width, height);
      if (farLayer) ctx.drawImage(farLayer, 0, 0);
      clouds.forEach(drawCloud);
      drawLoom();
      leaves.forEach(drawLeaf);
      frameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      farLayer = buildFar();
      initLeaves();
      initClouds();
    };

    const handleScroll = () => {
      scrolled += (window.scrollY - scrolled) * 0.08;
    };

    farLayer = buildFar();
    initLeaves();
    initClouds();
    render();
    scheduleLoom();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(loomTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default KonohaBackground;
