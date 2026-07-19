import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGSAPCleanup = () => {
  const ctx = useRef<gsap.Context | null>(null);

  const createCtx = (scope: Element | null) => {
    ctx.current = gsap.context(() => {}, scope ?? undefined);
    return ctx.current;
  };

  useEffect(() => {
    return () => {
      ctx.current?.revert();
    };
  }, []);

  return { createCtx };
};

export const useScrollTrigger = (
  ref: React.RefObject<Element>,
  animation: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current ?? undefined,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
      animation(tl);
    }, ref.current ?? undefined);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
