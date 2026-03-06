"use client";

import { type ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HighlightTextProps {
  children: ReactNode;
  className?: string;
  parallaxSpeed?: number;
}

export function HighlightText({
  children,
  className = "",
  parallaxSpeed = 0.35,
}: HighlightTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !highlightRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        highlightRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.to(highlightRef.current, {
        yPercent: -20 * parallaxSpeed,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [parallaxSpeed]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-block align-baseline ${className}`}
    >
      <span
        ref={highlightRef}
        className="absolute bg-accent pointer-events-none"
        style={{
          left: "var(--highlight-left, -0.16em)",
          right: "var(--highlight-right, -0.12em)",
          top: "var(--highlight-top, 0.06em)",
          bottom: "var(--highlight-bottom, 0.06em)",
          transform: "scaleX(0)",
        }}
      />
      <span className="relative z-10 text-[#0E0E12]">{children}</span>
    </span>
  );
}
