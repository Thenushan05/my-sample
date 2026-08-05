import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The live Lenis instance, so callers outside React (the hero-mode switcher)
 * can drive a scroll and be told when it finishes. Null before the page
 * finishes loading, or when the user prefers reduced motion.
 */
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Check for user reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisInstance = lenis;

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      if (lenisInstance === lenis) lenisInstance = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [enabled]);
}
