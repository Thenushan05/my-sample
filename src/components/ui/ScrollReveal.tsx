import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useUtils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  yOffset?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  yOffset = 40,
  duration = 0.8,
  delay = 0,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !ref.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%", // Trigger when element's top is 85% down viewport
            toggleActions: "play none none reverse", // Re-hide when scrolling back up
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [yOffset, duration, delay, prefersReduced]);

  return <div ref={ref} className={className}>{children}</div>;
};
